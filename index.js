let instance_skel = require('../../instance_skel');
let actions       = require('./actions');
let presets       = require('./presets');
let feedbacks     = require('./feedbacks');
let urllib        = require('urllib');
let log;
let debug;

class instance extends instance_skel {

	constructor(system, id, config) {
		super(system, id, config)

		Object.assign(this, {
			...actions,
			...presets,
			...feedbacks
		});

		this.tally = 'Off';
		this.record = -1;
		this.sessionID = null;
		this.actions()
	}

	actions(system) {
		this.setActions(this.getActions());
	}

	initConnection() {
		if (this.config.host !== undefined && this.config.username !== undefined && this.config.password !== undefined) {
			this.processAuthentication()
		} else {
			this.system.emit('log', 'jvc', 'error', 'Apply instance settings')
		}
	}

	processAuthentication() {
		this.status(this.STATUS_WARNING, 'Logging in');
		urllib.request(this.config.host + '/api.php', { digestAuth: `${this.config.username}:${this.config.password}` }).then((result) => {
			// store header information
			let headersObj = result.res.headers
			this.sessionID = headersObj['set-cookie'][1].slice(10)

			this.status(this.STATUS_OK);
			let getSystemInfo = {}
			this.sendCommand(getSystemInfo.Request = { "Command": "GetSystemInfo", "SessionID": this.sessionID })
			setTimeout(() => { this.getCamStatus() }, 500);
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
				value: 'This module is for the JVC PTZ KZ100 camera\'s. Some functions may not work on different models.'
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

		switch (id) {
			case 'getCamStatus':
				jvcPTZObj.Request = { "Command": "GetCamStatus", "SessionID": this.sessionID }
				break

			case 'setGain':
				jvcPTZObj.Request = { "Command": "Gain" }
				break

			case 'setZoomCtrl':
				jvcPTZObj.Request = { "Command": "SetZoomCtrl", "SessionID": this.sessionID, "Params": { "Position": opt.position } }
				break

			case 'setPresetZoomPosition':
				jvcPTZObj.Request = { "Command": "SetPresetZoomPosition", "SessionID": this.sessionID, "Params": { "ID": opt.positionStore, "Position": opt.position } }
				break

			case 'gain':
				jvcPTZObj.Request = { "Command": "SetWebButtonEvent", "SessionID": this.sessionID, "Params": { "Kind": "Gain", "Button": opt.button } }
				break

			case 'whb':
				jvcPTZObj.Request = { "Command": "SetWebButtonEvent", "SessionID": this.sessionID, "Params": { "Kind": "Whb", "Button": opt.button } }
				break

			case 'zoom':
				jvcPTZObj.Request = { "Command": "SetWebButtonEvent", "SessionID": this.sessionID, "Params": { "Kind": "Zoom", "Button": opt.button } }
				break

			case 'focus':
				jvcPTZObj.Request = { "Command": "SetWebButtonEvent", "SessionID": this.sessionID, "Params": { "Kind": "Focus", "Button": opt.button } }
				break

			case 'iris':
				jvcPTZObj.Request = { "Command": "SetWebButtonEvent", "SessionID": this.sessionID, "Params": { "Kind": "Iris", "Button": opt.button } }
				break

			case 'exposure':
				jvcPTZObj.Request = { "Command": "SetWebButtonEvent", "SessionID": this.sessionID, "Params": { "Kind": "Exposure", "Button": opt.button } }
				break

			case 'joyStickOperationPan':
				jvcPTZObj.Request = { "Command": "JoyStickOperation", "SessionID": this.sessionID, "Params": { "PanDirection": opt.direction, "PanSpeed": opt.speed, "TiltDirection": "stop", "TiltSpeed": "0" } }
				break

			case 'joyStickOperationTilt':
				jvcPTZObj.Request = { "Command": "JoyStickOperation", "SessionID": this.sessionID, "Params": { "PanDirection": "Stop", "PanSpeed": "0", "TiltDirection": opt.direction, "TiltSpeed": opt.speed } }
				break

			case 'setPTZPreset':
				jvcPTZObj.Request = { "Command": "SetPTZPreset", "SessionID": this.sessionID, "Params": { "No": opt.preset, "Operation": opt.operation } }
				break

			case 'zoomSwitchOperation':
				jvcPTZObj.Request = { "Command": "ZoomSwitchOperation", "SessionID": this.sessionID, "Params": { "Direction": opt.direction, "Speed": opt.speed } }
				break

			case 'setCamCtrl':
				jvcPTZObj.Request = { "Command": "SetCamCtrl", "SessionID": this.sessionID, "Params": { "CamCtrl": opt.ctrl } }
				break

			case 'setStudioTally':
				jvcPTZObj.Request = { "Command": "SetStudioTally", "SessionID": this.sessionID, "Params": { "Indication": opt.ctrl } }
				this.Tally = opt.ctrl;
				this.checkFeedbacks('tally_PGM');
				this.checkFeedbacks('tally_PVW');
				break
		}

		if (this.isEmpty(jvcPTZObj)) {
			this.system.emit('log', 'jvc', 'error', 'no command, array empty');
		} else {
			this.sendCommand(jvcPTZObj);
			setTimeout(() => { this.getCamStatus() }, 500)
		}
	}

	getCamStatus() {
		let getCamStatus = {};
		this.sendCommand(getCamStatus.Request = { "Command": "GetCamStatus", "SessionID": this.sessionID });
	}

	sendCommand(jvcPTZObj) {
		urllib.request(this.config.host + '/cgi-bin/api.cgi', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			content: JSON.stringify(jvcPTZObj)
		}).then((result) => {
			let resObj = result.res.data
			this.processIncomingData(resObj)
		}).catch(function (err) {
			log('log', 'jvc', 'error', 'Error: ' + err);
		});
	}

	processIncomingData(data) {
		let resultObj = JSON.parse(data);
		if (resultObj.Response['Requested'] === 'GetSystemInfo') {
			this.setVariable('model', resultObj.Response.Data['Model'])
			this.setVariable('serial', resultObj.Response.Data['Serial'])
		}

		if (resultObj.Response.Data.Camera['Status'] != 'Rec') {
			this.recording = -1;
		} else {
			this.recording = 1;
		}
		this.checkFeedbacks('recording');

		if (resultObj.Response.Data.TallyLamp['StudioTally'] == 'Program') {
			this.tally = 'Program';
		} else if (resultObj.Response.Data.TallyLamp['StudioTally'] == 'Preview') {
			this.tally = 'Preview';
		} else {
			this.tally = 'Off';
		}
		this.checkFeedbacks('tally_PGM');
		this.checkFeedbacks('tally_PVW');
	}

	isEmpty(obj) {
		for (var key in obj) {
			if (obj.hasOwnProperty(key))
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
		this.initVariables();
		this.initFeedbacks();
		this.checkFeedbacks('tally_PGM');
		this.checkFeedbacks('tally_PVW');
		this.checkFeedbacks('recording');
		this.initConnection();
		this.initPresets();
	}

	updateConfig(config) {
		this.config = config
		this.initConnection()
		this.actions()
	}

	initVariables() {
		var variables = [
			{ name: 'model', label: 'Camera model' },
			{ name: 'serial', label: 'Camera serial' }
		]
		this.setVariableDefinitions(variables)
	}

	initFeedbacks() {
		var feedbacks = this.getFeedbacks();
		this.setFeedbackDefinitions(feedbacks);
	}

	initPresets(updates) {
		this.setPresetDefinitions(this.getPresets());
	}

}

exports = module.exports = instance;
