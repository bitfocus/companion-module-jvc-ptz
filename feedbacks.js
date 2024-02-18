const { combineRgb } = require('@companion-module/base')

module.exports = async function (self) {

	let feedbacks = {}
	let defaultStyle = {
		bgcolor: 0xff0000,
		color: 0,
	}

	feedbacks['recording'] = {
		name: 'Recording',
		description: 'Change button style when camera is recording',
		type: 'boolean',
		defaultStyle,
		options: [],
		callback: (feedback) => {
			if (self.recording == 1) {
				return true
			}
			return false
		}
	}

	feedbacks['streaming'] = {
		name: 'Streaming',
		description: 'Change button style when camera is streaming',
		type: 'boolean',
		defaultStyle,
		options: [],
		callback: (feedback) => {
			if (self.streaming == 1) {
				return true
			}
			return false
		}
	}

	feedbacks['tracking'] = {
		name: 'Tracking',
		description: 'Change button style when tracking is active',
		type: 'boolean',
		defaultStyle,
		options: [],
		callback: (feedback) => {
			if (self.tracking === 'On') {
				return true
			}
			return false
		}
	}

	feedbacks['tally_PGM'] = {
		name: 'Tally on PGM',
		description: 'Change button style when camera tally shows Program',
		type: 'boolean',
		defaultStyle,
		options: [],
		callback: (feedback) => {
			if (self.tally == 'Program') {
				return true
			}
			return false
		}
	}

	feedbacks['tally_PVW'] = {
		name: 'Tally on PVW',
		description: 'Change button style when camera tally shows Preview',
		type: 'boolean',
		defaultStyle,
		options: [],
		callback: (feedback) => {
			if (self.tally == "Preview") {
				return true
			}
			return false
		}
	}

	self.setFeedbackDefinitions(feedbacks)

}
