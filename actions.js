exports.getActions  = function() {

	var actions = {}

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

	return actions
}
