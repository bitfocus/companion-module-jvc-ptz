let instance_skel = require('../../instance_skel');
let actions       = require('./actions');
let presets       = require('./presets');
let feedbacks     = require('./feedbacks');
let urllib        = require('urllib');

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
	}

	initActions() {
		this.setActions(this.getActions());
	}

	initConnection() {
		if (this.config.host !== undefined && this.config.username !== undefined && this.config.password !== undefined) {
			this.processAuthentication()
		} else {
			this.log('error', 'Apply instance settings')
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
			this.log('info', 'sessionID: ' + this.sessionID)
		}).catch( (err) => {
			this.log('error', 'Error: ' + err)
		});
	}

	tallyOnListener(label, variable, value) {
		const { tallyOnEnabled, tallyOnVariable, tallyOnValue } = this.config;
	
		if (!tallyOnEnabled || `${label}:${variable}` !== tallyOnVariable) {
			return;
		}
	
		this.parseVariables(tallyOnValue, (parsedValue) => {
			this.debug('variable changed... updating tally', { label, variable, value, parsedValue });
			this.action({
				action: (value === parsedValue ? 'setStudioPGMTally' : 'tallysetStudioOFFTally'),
				instance: this.id
			});
		});
	}

	setupEventListeners() {
		if (this.config.tallyOnEnabled && this.config.tallyOnVariable) {
			if (!this.activeTallyOnListener) {
				this.activeTallyOnListener = this.tallyOnListener.bind(this);
				this.system.on('variable_changed', this.activeTallyOnListener);
			}
		} else if (this.activeTallyOnListener) {
			this.system.removeListener('variable_changed', this.activeTallyOnListener);
			delete this.activeTallyOnListener;
		}
	}

	config_fields() {
		const dynamicVariableChoices = [];
		this.system.emit('variable_get_definitions', (definitions) =>
			Object.entries(definitions).forEach(([instanceLabel, variables]) =>
				variables.forEach((variable) =>
					dynamicVariableChoices.push({
						id: `${instanceLabel}:${variable.name}`,
						label: `${instanceLabel}:${variable.name}`
					})
				)
			)
		);
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
			},
			{
				type: 'text',
				id: 'tallyOnInfo',
				width: 12,
				label: 'Tally On',
				value: 'Set camera tally ON when the instance variable equals the value'
			},
			{
				type: 'checkbox',
				id: 'tallyOnEnabled',
				width: 1,
				label: 'Enable',
				default: false
			},
			{
				type: 'dropdown',
				id: 'tallyOnVariable',
				label: 'Tally On Variable',
				width: 6,
				tooltip: 'The instance label and variable name',
				choices: dynamicVariableChoices,
				minChoicesForSearch: 5
			},
			{
				type: 'textinput',
				id: 'tallyOnValue',
				label: 'Tally On Value',
				width: 5,
				tooltip: 'When the variable equals this value, the camera tally light will be turned on.  Also supports dynamic variable references.  For example, $(atem:short_1)'
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
				this.checkFeedbacks('tally_PGM', 'tally_PVW');
				break

			case 'checkPVWtoPGM':
				if (this.tally == "Preview") {
					jvcPTZObj.Request = { "Command": "SetStudioTally", "SessionID": this.sessionID, "Params": { "Indication": 'Program' } }
				}
				this.Tally = 'Program';
				this.checkFeedbacks('tally_PGM');
				break

			case 'setStudioPVWTally':
				jvcPTZObj.Request = { "Command": "SetStudioTally", "SessionID": this.sessionID, "Params": { "Indication": 'Preview' } }
				this.Tally = 'Preview';
				this.checkFeedbacks('tally_PVW');
				break

			case 'setStudioPGMTally':
				jvcPTZObj.Request = { "Command": "SetStudioTally", "SessionID": this.sessionID, "Params": { "Indication": 'Program' } }
				this.Tally = 'Program';
				this.checkFeedbacks('tally_PGM');
				break

			case 'setStudioOFFTally':
				jvcPTZObj.Request = { "Command": "SetStudioTally", "SessionID": this.sessionID, "Params": { "Indication": 'Off' } }
				this.Tally = 'Off';
				this.checkFeedbacks('tally_PGM');
				break
		}

		if (this.isEmpty(jvcPTZObj)) {
			this.log('error', 'no command, array empty');
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
		}).catch( (err) =>{
			this.log('error', 'Error: ' + err);
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
		this.checkFeedbacks('tally_PGM', 'tally_PVW');
	}

	isEmpty(obj) {
		for (var key in obj) {
			if (obj.hasOwnProperty(key))
				return false;
		}
		return true;
	}

	destroy() {
		if (this.activeTallyOnListener) {
			this.system.removeListener('variable_changed', this.activeTallyOnListener);
			delete this.activeTallyOnListener;
		}
		this.debug("destroy", this.id);
	}

	init() {
		this.initVariables();
		this.initActions()
		this.initFeedbacks();
		this.checkFeedbacks('tally_PGM', 'tally_PVW', 'recording');
		this.initConnection();
		this.initPresets();
		this.setupEventListeners();
	}

	updateConfig(config) {
		this.config = config
		this.initConnection()
		this.setupEventListeners();
	}

	initVariables() {
		var variables = [
			{ name: 'model', label: 'Camera model' },
			{ name: 'serial', label: 'Camera serial' }
		]
		this.setVariableDefinitions(variables)
	}

	initFeedbacks() {
		this.setFeedbackDefinitions(this.getFeedbacks());
	}

	initPresets() {
		this.setPresetDefinitions(this.getPresets());
	}

}

exports = module.exports = instance;
