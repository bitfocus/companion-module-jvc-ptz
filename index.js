let instance_skel = require('../../instance_skel')
let actions = require('./actions')
let presets = require('./presets')
let feedbacks = require('./feedbacks')
let urllib = require('urllib')

class instance extends instance_skel {
	constructor(system, id, config) {
		super(system, id, config)

		Object.assign(this, {
			...actions,
			...presets,
			...feedbacks,
		})

		this.tally = 'Off'
		this.record = -1
		this.stream = -1
		this.sessionID = null
		this.tilt = "Stop"
		this.direction = ""
	}

	initActions() {
		this.setActions(this.getActions())
	}

	initConnection() {
		if (this.config.host !== undefined && this.config.username !== undefined && this.config.password !== undefined) {
			this.processAuthentication()
		} else {
			this.log('error', 'Apply instance settings')
		}
	}

	processAuthentication() {
		this.status(this.STATUS_WARNING, 'Logging in')
		urllib
			.request(this.config.host + '/api.php', { digestAuth: `${this.config.username}:${this.config.password}` })
			.then((result) => {
				// store header information
				let headersObj = result.res.headers
				this.sessionID = headersObj['set-cookie'][1].slice(10)

				this.status(this.STATUS_OK)
				this.sendCommand({ Request: { Command: 'GetSystemInfo', SessionID: this.sessionID } })
				setTimeout(() => {
					this.getCamStatus()
				}, 500)
				//this.log('info', 'sessionID: ' + this.sessionID)
			})
			.catch((err) => {
				this.log('error', 'Error: ' + err)
			})
	}

	config_fields() {
		return [
			{
				type: 'text',
				id: 'info',
				width: 12,
				label: 'Information',
				value: "This module is for the JVC PTZ KZ100 camera's. Some functions may not work on different models.",
			},
			{
				type: 'textinput',
				id: 'host',
				width: 6,
				label: 'Target IP Address',
				// regex: this.REGEX_IP
			},
			{
				type: 'textinput',
				id: 'username',
				label: 'Username',
				default: 'jvc',
				width: 5,
			},
			{
				type: 'textinput',
				id: 'password',
				label: 'Password',
				default: '0000',
				width: 5,
			},
			{
				type: 'text',
				id: 'tallyOnInfo',
				width: 12,
				label: 'Tally On',
				value: 	'Support for Tally On is no longer possible. Instead you can set this up as a trigger, and get additional control',
			},
		]
	}

	action(action) {
		let id = action.action
		let opt = action.options
		let jvcPTZObj = {}

		switch (id) {
			case 'getCamStatus':
				jvcPTZObj = { Request: { Command: 'GetCamStatus', SessionID: this.sessionID } }
				break

			case 'setGain':
				jvcPTZObj = { Request: { Command: 'Gain' } }
				break

			case 'setZoomCtrl':
				jvcPTZObj = {
					Request: { Command: 'SetZoomCtrl', SessionID: this.sessionID, Params: { Position: opt.position } },
				}
				break

			case 'setPresetZoomPosition':
				jvcPTZObj = {
					Request: {
						Command: 'SetPresetZoomPosition',
						SessionID: this.sessionID,
						Params: { ID: opt.positionStore, Position: opt.position },
					},
				}
				break

			case 'gain':
				jvcPTZObj = {
					Request: {
						Command: 'SetWebButtonEvent',
						SessionID: this.sessionID,
						Params: { Kind: 'Gain', Button: opt.button },
					},
				}
				break

			case 'whb':
				jvcPTZObj = {
					Request: {
						Command: 'SetWebButtonEvent',
						SessionID: this.sessionID,
						Params: { Kind: 'Whb', Button: opt.button },
					},
				}
				break

			case 'zoom':
				jvcPTZObj = {
					Request: {
						Command: 'SetWebButtonEvent',
						SessionID: this.sessionID,
						Params: { Kind: 'Zoom', Button: opt.button },
					},
				}
				break

			case 'focus':
				jvcPTZObj = {
					Request: {
						Command: 'SetWebButtonEvent',
						SessionID: this.sessionID,
						Params: { Kind: 'Focus', Button: opt.button },
					},
				}
				break

			case 'iris':
				jvcPTZObj = {
					Request: {
						Command: 'SetWebButtonEvent',
						SessionID: this.sessionID,
						Params: { Kind: 'Iris', Button: opt.button },
					},
				}
				break

			case 'exposure':
				jvcPTZObj = {
					Request: {
						Command: 'SetWebButtonEvent',
						SessionID: this.sessionID,
						Params: { Kind: 'Exposure', Button: opt.button },
					},
				}
				break

			case 'joyStickOperationPan':
				this.tilt = "Stop"
				this.direction = opt.direction
				switch (opt.direction) {
				case "RightUp":
					this.tilt = "Up"
					this.direction = "Right"
					break
				case "RightDown":
					this.tilt = "Down"
					this.direction = "Right"
					break
				case "LeftUp":
					this.tilt = "Up"
					this.direction = "Left"
					break
				case "LeftDown":
					this.tilt = "Down"
					this.direction = "Left"
					break
				}
				jvcPTZObj = {
					Request: {
						Command: 'JoyStickOperation',
						SessionID: this.sessionID,
						Params: { PanDirection: this.direction, PanSpeed: parseInt(opt.speed), TiltDirection: this.tilt, TiltSpeed: parseInt(opt.speed) },
					},
				}
				break

			case 'joyStickOperationTilt':
				jvcPTZObj = {
					Request: {
						Command: 'JoyStickOperation',
						SessionID: this.sessionID,
						Params: { PanDirection: 'Stop', PanSpeed: 0, TiltDirection: opt.direction, TiltSpeed: parseInt(opt.speed) },
					},
				}
				break

			case 'setPTZPreset':
				jvcPTZObj = {
					Request: {
						Command: 'SetPTZPreset',
						SessionID: this.sessionID,
						Params: { No: parseInt(opt.preset), Operation: opt.operation },
					},
				}
				break

			case 'SetWebSliderEvent':
				jvcPTZObj = {
					Request: {
						Command: 'SetWebSliderEvent',
						SessionID: this.sessionID,
						Params: { Kind: opt.kind, Position: parseInt(opt.position) },
					},
				}
				break

			case 'zoomSwitchOperation':
				jvcPTZObj = {
					Request: {
						Command: 'ZoomSwitchOperation',
						SessionID: this.sessionID,
						Params: { Direction: opt.direction, Speed: parseInt(opt.speed) },
					},
				}
				break

			case 'setCamCtrl':
				jvcPTZObj = { Request: { Command: 'SetCamCtrl', SessionID: this.sessionID, Params: { CamCtrl: opt.ctrl } } }
				break

			case 'setStreamingCtrl':
				jvcPTZObj = { Request: { Command: 'SetStreamingCtrl', SessionID: this.sessionID, Params: { Streaming: opt.ctrl } } }
				break

			case 'setStudioTally':
				jvcPTZObj = {
					Request: { Command: 'SetStudioTally', SessionID: this.sessionID, Params: { Indication: opt.ctrl } },
				}
				this.Tally = opt.ctrl
				this.checkFeedbacks('tally_PGM', 'tally_PVW')
				break

			case 'checkPVWtoPGM':
				if (this.tally == 'Preview') {
					jvcPTZObj = {
						Request: { Command: 'SetStudioTally', SessionID: this.sessionID, Params: { Indication: 'Program' } },
					}
				}
				this.Tally = 'Program'
				this.checkFeedbacks('tally_PGM')
				break

			case 'setStudioPVWTally':
				jvcPTZObj = {
					Request: { Command: 'SetStudioTally', SessionID: this.sessionID, Params: { Indication: 'Preview' } },
				}
				this.Tally = 'Preview'
				this.checkFeedbacks('tally_PVW')
				break

			case 'setStudioPGMTally':
				jvcPTZObj = {
					Request: { Command: 'SetStudioTally', SessionID: this.sessionID, Params: { Indication: 'Program' } },
				}
				this.Tally = 'Program'
				this.checkFeedbacks('tally_PGM')
				break

			case 'setStudioOFFTally':
				jvcPTZObj = { Request: { Command: 'SetStudioTally', SessionID: this.sessionID, Params: { Indication: 'Off' } } }
				this.Tally = 'Off'
				this.checkFeedbacks('tally_PGM')
				break
		}

		if (this.isEmpty(jvcPTZObj)) {
			this.log('error', 'no command, array empty')
		} else {
			this.sendCommand(jvcPTZObj)
			setTimeout(() => {
				this.getCamStatus()
			}, 500)
		}
	}

	getCamStatus() {
		this.sendCommand({ Request: { Command: 'GetCamStatus', SessionID: this.sessionID } })
	}

	sendCommand(jvcPTZObj) {
		//console.log(JSON.stringify(jvcPTZObj))
		urllib
			.request(this.config.host + '/cgi-bin/api.cgi', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				content: JSON.stringify(jvcPTZObj),
			})
			.then((result) => {
				let resObj = result.res.data
				//this.log(resObj)
				this.processIncomingData(resObj)
			})
			.catch((err) => {
				this.log('error', 'Error: ' + err)
			})
	}

	processIncomingData(data) {
		let resultObj = JSON.parse(data)
		console.log(JSON.stringify(resultObj))
		if (resultObj.Response['Requested'] === 'GetSystemInfo') {
			this.setVariable('model', resultObj.Response.Data['Model'])
			this.setVariable('serial', resultObj.Response.Data['Serial'])
		}

		if (resultObj.Response.Data.Camera['Status'] != 'Rec') {
			this.recording = -1
		} else {
			this.recording = 1
		}
		this.checkFeedbacks('recording')

		if (resultObj.Response.Data.Streaming['Status'] != 'Start') {
			this.streaming = -1
		} else {
			this.streaming = 1
		}
		this.checkFeedbacks('streaming')

		if (resultObj.Response.Data.TallyLamp['StudioTally'] == 'Program') {
			this.tally = 'Program'
		} else if (resultObj.Response.Data.TallyLamp['StudioTally'] == 'Preview') {
			this.tally = 'Preview'
		} else {
			this.tally = 'Off'
		}
		this.checkFeedbacks('tally_PGM', 'tally_PVW')
	}

	isEmpty(obj) {
		for (var key in obj) {
			if (obj.hasOwnProperty(key)) return false
		}
		return true
	}

	destroy() {
		this.debug('destroy', this.id)
	}

	init() {
		this.initVariables()
		this.initActions()
		this.initFeedbacks()
		this.checkFeedbacks('tally_PGM', 'tally_PVW', 'recording')
		this.initConnection()
		this.initPresets()
	}

	updateConfig(config) {
		this.config = config
		this.initConnection()
	}

	initVariables() {
		var variables = [
			{ name: 'model', label: 'Camera model' },
			{ name: 'serial', label: 'Camera serial' },
		]
		this.setVariableDefinitions(variables)
	}

	initFeedbacks() {
		this.setFeedbackDefinitions(this.getFeedbacks())
	}

	initPresets() {
		this.setPresetDefinitions(this.getPresets())
	}
}

exports = module.exports = instance
