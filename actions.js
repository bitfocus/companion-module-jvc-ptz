exports.getActions  = function() {

	var actions = {}
/*
	actions['pspeed'] = {
		label: 'Set pan speed',
		options: [{
			label: 'Speed',
			type: 'textinput',
			id: 'speed',
			default: '100'
		}]
	}

	actions['zspeed'] = {
		label: 'Set zoom speed',
		options: [{
			label: 'Speed',
			type: 'textinput',
			id: 'speed',
			default: '100'
		}]
	}

	actions['setGain'] = {
		label: 'Set Gain',
		options: [{
			label: 'gain',
			type: 'textinput',
			id: 'gain',
			default: '3'
		}]
	}
*/
	actions['setZoomCtrl'] = {
		label: 'Set zoom position',
		options: [{
			label: 'postion 0-499',
			type: 'textinput',
			id: 'position',
			default: '350',
			regex: '/([0-9]|[1-8][0-9]|9[0-9]|[1-3][0-9]{2}|4[0-8][0-9]|49[0-9])/i'
		}]
	}

	actions['setPresetZoomPosition'] = {
		label: 'Set preset zoom position in memory',
		options: [
		{
			label: 'postion A B C D',
			type: 'dropdown',
			id: 'positionStore',
			default: 'A',
			choices: [{label:'A', id:'A'},{label:'B', id:'B'},{label:'C', id:'C'},{label:'D', id:'D'}]
		},{
			label: 'postion 0-499',
			type: 'textinput',
			id: 'position',
			default: '350',
			regex: '/([0-9]|[1-8][0-9]|9[0-9]|[1-3][0-9]{2}|4[0-8][0-9]|49[0-9])/i'
		}]
	}

	actions['gain'] = {
		label: 'Gain control',
		options: [
			{
				label: 'Select value',
				type: 'dropdown',
				id: 'button',
				default: 'M',
				choices: [{ label: '+1', id: 'Up1'},{ label: '-1', id: 'Down1'}]
			}
		]
	}

	actions['whb'] = {
		label: 'White balance control',
		options: [
			{
				label: 'Select value',
				type: 'dropdown',
				id: 'button',
				default: 'Awb',
				choices: [{ label: 'Auto WB', id: 'Awb'},{ label: '3200K', id: '3200K'},{ label: '5600K', id: '5600K'}]
			}
		]
	}

	actions['zoom'] = {
		label: 'Zoom, alway program stop on up action!',
		options: [
			{
				label: 'Select value',
				type: 'dropdown',
				id: 'button',
				default: 'stop',
				choices: [{ label: 'Stop', id: 'Stop'},{ label: 'Tele1', id: 'Tele1'},{ label: 'Tele2', id: 'Tele2'},{ label: 'Tele3', id: 'Tele3'},{ label: 'Wide1', id: 'Wide1'},{ label: 'Wide2', id: 'Wide2'},{ label: 'Wide3', id: 'Wide3'}]
			}
		]
	}

	actions['focus'] = {
		label: 'Focus, alway program stop on up action!',
		options: [
			{
				label: 'Select value',
				type: 'dropdown',
				id: 'button',
				default: 'Stop',
				choices: [{ label: 'Stop', id: 'Stop'},{ label: 'PushAuto', id: 'PushAuto'},{ label: 'Far1', id: 'Far1'},{ label: 'Far2', id: 'Far2'},{ label: 'Far3', id: 'Far3'},{ label: 'Near1', id: 'Near1'},{ label: 'Near2', id: 'Near2'},{ label: 'Near3', id: 'Near3'}]
			}
		]
	}

	actions['exposure'] = {
		label: 'Exposure settings',
		options: [
			{
				label: 'Select value',
				type: 'dropdown',
				id: 'button',
				default: 'Manual',
				choices: [{ label: 'Manual', id: 'Manual'},{ label: 'Auto', id: 'Auto'},{ label: 'IrisPriority', id: 'IrisPriority'},{ label: 'ShutterPriority', id: 'ShutterPriority'}]
			}
		]
	}

	actions['getCamStatus'] = { label: 'Get camera status'}

	return actions
}
