let instance_skel = require('../../instance_skel');
let actions       = require('./actions');
let urllib        = require('urllib');
let log;
let debug;
let sessionID = null;

class instance extends instance_skel {

	constructor(system,id,config) {
		super(system,id,config)

		Object.assign(this, {...actions})

		this.actions()
	}

	actions(system) {
		this.setActions(this.getActions());
	}

	init_connection() {
		if (this.config.host !== undefined && this.config.username !== undefined && this.config.password !== undefined) {
			this.processAuthentication()
		} else {
			this.system.emit('error', 'Apply instance settings')
		}
	}

	processAuthentication() {
		this.status(this.STATUS_WARNING,'Logging in');
		urllib.request(this.config.host + '/api.php',{digestAuth:`${this.config.username}:${this.config.password}`}).then((result) => {
			// store header information
			let headersObj = result.res.headers
			this.sessionID = headersObj['set-cookie'][1].slice(10)

			this.status(this.STATUS_OK);
			let getSystemInfo = {}
			this.sendCommand(getSystemInfo.Request = {"Command":"GetSystemInfo","SessionID":this.sessionID})
			this.system.emit('log', 'JVC', 'info', 'sessionID: ' + this.sessionID)
		}).catch(function (err) {
			this.system.emit('error', 'Error: ' + err)
		});
	}

	config_fields() {
		return [
			{
				type: 'text',
				id: 'info',
				width: 12,
				label: 'Information',
				value: 'This module is for the JVC PTZ camera\'s.'
			},
			{
				type: 'textinput',
				id: 'host',
				width: 6,
				label: 'Target IP Address',
				regex: this.REGEX_IP
			},
			{
				type: 'textinput',
				id: 'username',
				label: 'Username',
				default: 'jvc',
				width: 5
			},
			{
				type: 'textinput',
				id: 'password',
				label: 'Password',
				default: '0000',
				width: 5
			}
		]
	}

	action(action) {
		let id = action.action;
		let opt = action.options;
		let jvcPTZObj = {}

		switch (id){
			case 'getCamStatus':
				jvcPTZObj.Request = {"Command":"GetCamStatus","SessionID":this.sessionID}
				break

			case 'setGain':
				jvcPTZObj.Request = {"Command":"Gain"}
				break

			case 'setZoomCtrl':
				jvcPTZObj.Request = {"Command":"SetZoomCtrl","SessionID":this.sessionID,"Params":{"Position":opt.position}}
				break

			case 'setPresetZoomPosition':
				jvcPTZObj.Request = {"Command":"SetPresetZoomPosition","SessionID":this.sessionID,"Params":{"ID":opt.positionStore,"Position":opt.position}}
				break

			case 'gain':
				jvcPTZObj.Request = {"Command":"SetWebButtonEvent","SessionID":this.sessionID,"Params":{"Kind":"Gain","Button":opt.button}}
				break

			case 'whb':
				jvcPTZObj.Request = {"Command":"SetWebButtonEvent","SessionID":this.sessionID,"Params":{"Kind":"Whb","Button":opt.button}}
				break

			case 'zoom':
				jvcPTZObj.Request = {"Command":"SetWebButtonEvent","SessionID":this.sessionID,"Params":{"Kind":"Zoom","Button":opt.button}}
				break

			case 'focus':
				jvcPTZObj.Request = {"Command":"SetWebButtonEvent","SessionID":this.sessionID,"Params":{"Kind":"Focus","Button":opt.button}}
				break

			case 'exposure':
				jvcPTZObj.Request = {"Command":"SetWebButtonEvent","SessionID":this.sessionID,"Params":{"Kind":"Exposure","Button":opt.button}}
				break
		}

		if(this.isEmpty(jvcPTZObj)){
			this.system.emit('error','no command, array empty');
		} else {
			this.sendCommand(jvcPTZObj)
		}

	}
	sendCommand(jvcPTZObj) {
		// console.log(JSON.stringify(jvcPTZObj))

		urllib.request(this.config.host + '/cgi-bin/api.cgi',{
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			content: JSON.stringify(jvcPTZObj)
		}).then((result) => {
			// result: {data: buffer, res: response object}
			let resObj = result.res.data
			this.processIncomingData(resObj)
		}).catch(function (err) {
			log('error','JVC Error: '+err);
		});
	}

	processIncomingData(data) {
		let resultObj = JSON.parse(data)
		// console.log(resultObj.Response);
		if(resultObj.Response['Requested'] === 'GetSystemInfo') {
			this.setVariable('model', resultObj.Response.Data['Model'])
			this.setVariable('serial', resultObj.Response.Data['Serial'])
		}
	}

	isEmpty(obj) {
		for(var key in obj) {
				if(obj.hasOwnProperty(key))
						return false;
		}
		return true;
	}

	destroy() {
		debug("destroy", this.id);
	}

	init() {
		debug = this.debug;
		log = this.log;

		this.init_variables()
		this.init_connection()
	}

	updateConfig(config) {

		this.config = config
		this.init_connection()
		this.actions()

	}

	init_variables() {

		var variables = [
			{ name: 'model', label: 'Camera model' },
			{ name: 'serial', label: 'Camera serial' }
		]

		this.setVariableDefinitions(variables)

	}

}

exports = module.exports = instance;
