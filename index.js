const { InstanceBase, Regex, runEntrypoint, InstanceStatus } = require('@companion-module/base')
const UpgradeScripts = require('./upgrades')
const UpdateActions = require('./actions')
const UpdateFeedbacks = require('./feedbacks')
const UpdatePresets = require('./presets')
const UpdateVariableDefinitions = require('./variables')
const { request } = require('urllib')

class JvcPtzInstance extends InstanceBase {
	constructor(internal) {
		super(internal)
	}

	async init(config) {
		this.config = config

		this.updateStatus(InstanceStatus.Connecting)
		
		this.updateActions() // export actions
		this.updateFeedbacks() // export feedbacks
		this.updatePresets() // export preset definitions
		this.updateVariableDefinitions() // export variable definitions
		
		this.initConnection()

	}

	initState() {
		this.tally = 'Off'
		this.record = -1
		this.stream = -1
		this.sessionID = null
		this.tilt = "Stop"
		this.direction = ""
		this.tracking = undefined
	}

	async initConnection() {
		this.stopPolling() // if we need to reinit, stop polling until successful

		if (this.config.host && this.config.username && this.config.password) {
			this.initState()
			if (this.authtimeout) {
				clearTimeout(this.authtimeout)
				delete this.authtimeout
			}
			try {	
				await this.processAuthentication()
				this.sendCommand({ Command: 'GetSystemInfo' })
				if (this.config.polling && this.config.interval > 0) this.startPolling()
				setTimeout(() => {
					this.getCamStatus()
				}, 100)	
			} catch (error) {
				if (error === 401) {
					this.log('error', 'Login failed, retry in 2s.')
				} else {
					this.log('error', 'Init connection failed, retry in 2s. Error: ' + error)
				}
				this.authtimeout = setTimeout(() => {
					this.initConnection()
				}, 1925)

			}
		} else {
			this.updateStatus(InstanceStatus.BadConfig)
		}
	}

	// When module gets deleted
	async destroy() {
		if (this.authtimeout) {
			clearTimeout(this.authtimeout)
			delete this.authtimeout
		}
		this.stopPolling()
		this.log('debug', 'destroy')
	}

	async configUpdated(config) {
		let oldconfig = this.config
		this.config = config
		if (config.host !== oldconfig.host || config.username !== oldconfig.username || config.password !== oldconfig.password) {
			this.initConnection()
		}
		if (config.polling === false && this.interval) {
			this.stopPolling()
		} else if ((config.polling === true && !this.interval) || (config.polling === true && config.interval != oldconfig.interval)) {
			this.startPolling()
		}

	}

	// Return config fields for web config
	getConfigFields() {
		return [
			{
				type: 'static-text',
				id: 'info',
				width: 12,
				label: 'Information',
				value: "This module is tested with the JVC PTZ KZ100 and KY510 cameras. Some functions may not work on different models.",
			},
			{
				type: 'textinput',
				id: 'host',
				width: 12,
				label: 'Target IP Address',
				// regex: this.REGEX_IP
			},
			{
				type: 'textinput',
				id: 'username',
				label: 'Username',
				default: 'jvc',
				width: 6,
			},
			{
				type: 'textinput',
				id: 'password',
				label: 'Password',
				default: '0000',
				width: 6,
			},
			{
				type: 'checkbox',
				id: 'polling',
				label: 'Use polling of status',
				default: false,
				width: 3,
			},
			{
				type: 'number',
				id: 'interval',
				label: 'Polling Interval (seconds)',
				default: 2,
				width: 9,
				min: 0.5,
				max: 5000,
				step: 0.1,
				isVisible: (opt) => {return opt.polling === true}
			},
	
		]
	}

	updateActions() {
		UpdateActions(this)
	}

	updateFeedbacks() {
		UpdateFeedbacks(this)
	}

	updatePresets() {
		UpdatePresets(this)
	}

	updateVariableDefinitions() {
		UpdateVariableDefinitions(this)
	}

	async processAuthentication() {
		this.updateStatus(InstanceStatus.Connecting, 'Logging in')

		try {
			let {status, statusText, headers} = await request(this.config.host + '/api.php', { digestAuth: `${this.config.username}:${this.config.password}` })
			if (status === 200) {
				this.sessionID = headers['set-cookie'][1].slice(10)
				this.updateStatus(InstanceStatus.Ok)
				//this.log('info', 'sessionID: ' + this.sessionID)
				return Promise.resolve(200)
			} else if (status === 401) {
				this.updateStatus(InstanceStatus.ConnectionFailure)
				this.log('error', `Connection to ${this.config.host} failed because of authentication error. Check your login and password.`)
				return Promise.reject(status)
			} else if (status >= 400) {
				this.updateStatus(InstanceStatus.ConnectionFailure)
				this.log('error', `Error ${status} ${statusText} while trying to access ${this.config.host}/api.php`)
				return Promise.reject(status)
			}
	
		} catch (error) {
			this.updateStatus(InstanceStatus.ConnectionFailure)
			this.log('error', 'Error while trying to login: ' + error.message)
			return Promise.reject(error.message)
		}
	}

	async sendCommand(cmdObj) {
		if (this.sessionID === null) {
			this.log('warn', `Can't send command when not logged in`)
			return 401
		}
		let jvcPTZObj = {
			Request: {
				...cmdObj,
				SessionID: this.sessionID,
			}
		}
		console.log('sending', JSON.stringify(jvcPTZObj))

		try {
			let {status, statusText, data} = await request(this.config.host + '/cgi-bin/api.cgi', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				content: JSON.stringify(jvcPTZObj),
			})
	
			if (status === 200) {
				let resultObj = JSON.parse(data)
				console.log('incoming: ' + data)
				if (resultObj.Response?.Result === 'SessionError') {
					// for some reason the Session has terminated or changed
					await this.initConnection() // reinit connection
					this.sendCommand(cmdObj) // resend command
					return
				}
				this.processIncomingData(resultObj)
				this.updateStatus(InstanceStatus.Ok)
				return Promise.resolve(status)

			} else if (status === 401) {
				this.updateStatus(InstanceStatus.ConnectionFailure)
				this.log('error', `Connection to ${this.config.host} failed because of authentication error.`) // TODO: handle authentication
				return Promise.reject(status)

			} else if (status >= 400) {
				this.updateStatus(InstanceStatus.ConnectionFailure)
				this.log('error', `Error ${statusText} while trying to access ${this.config.host}/cgi-bin/api.cgi`)
				return Promise.reject(status)

			}
		} catch (error) {
			this.updateStatus(InstanceStatus.ConnectionFailure)
			this.log('error', 'Error while sending command: ' + error)
			return // Promise.reject(error.message)
		}
	}

	getCamStatus() {
		this.sendCommand({ Command: 'GetCamStatus' })
		this.sendCommand({ Command: 'GetPTPosition' })
	}

	processIncomingData(resultObj) {
		

		if (resultObj.Response?.Requested === 'GetSystemInfo') {

			this.setVariableValues({
				model: resultObj.Response.Data.Model,
				serial: resultObj.Response.Data.Serial
			})

		} else if (resultObj.Response?.Requested.startsWith('GetCamStatus')) {

			if (resultObj.Response?.Data?.Camera?.Status) {
				if (resultObj.Response.Data.Camera.Status != 'Rec') {
					this.recording = -1
				} else {
					this.recording = 1
				}
				this.checkFeedbacks('recording')
			}
			
			if (resultObj.Response?.Data?.Streaming?.Status) {
				if (resultObj.Response.Data.Streaming.Status != 'Start') {
					this.streaming = -1
				} else {
					this.streaming = 1
				}
				this.checkFeedbacks('streaming')
			}

			if (resultObj.Response?.Data?.Tracking?.Status) {
				this.tracking = resultObj.Response.Data.Tracking.Status
				this.checkFeedbacks('tracking')
			}

			if (resultObj.Response?.Data?.TallyLamp?.StudioTally) {
				this.tally = resultObj.Response.Data.TallyLamp.StudioTally
				this.checkFeedbacks('tally_PGM', 'tally_PVW')
			}

		} else if (resultObj.Response?.Requested === 'GetPTPosition') {
			this.setVariableValues({
				pan: resultObj.Response.Data.Pan,
				tilt: resultObj.Response.Data.Tilt,
			})
		}
	}

	startPolling() {
		this.stopPolling()
		this.interval = setInterval(
			(self) => {
				self.sendCommand({ Command: 'GetCamStatusMinimum' })
				this.sendCommand({ Command: 'GetPTPosition' })
			},
			this.config.interval * 1000,
			this
		)
	}

	stopPolling() {
		if (this.interval) {
			clearInterval(this.interval)
			delete this.interval
		}
	}

}

runEntrypoint(JvcPtzInstance, UpgradeScripts)
