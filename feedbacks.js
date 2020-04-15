module.exports = {

	getFeedbacks() {
		var feedbacks = {};

		feedbacks['recording'] = {
			label: 'Change background when recording',
			description: 'When camera is recording, background color will change',
			options: [
				{
					type: 'colorpicker',
					label: 'Foreground color',
					id: 'fg',
					default: this.rgb(255, 255, 255)

				},
				{
					type: 'colorpicker',
					label: 'Background color',
					id: 'bg',
					default: this.rgb(255, 0, 0)
				}
			],
			callback: (feedback, bank) => {
				if (this.recording == 1) {
					return {
						color: feedback.options.fg,
						bgcolor: feedback.options.bg
					};
				}
			}
		};

		feedbacks['tally_PGM'] = {
			label: 'Tally on PGM',
			description: 'When the camera tally is on, change background color',
			options: [
				{
					type: 'colorpicker',
					label: 'Foreground color',
					id: 'fg',
					default: this.rgb(255, 255, 255)

				},
				{
					type: 'colorpicker',
					label: 'Background color',
					id: 'bg',
					default: this.rgb(255, 0, 0)
				}
			],
			callback: (feedback, bank) => {
				if (this.tally == 'Program') {
					return {
						color: feedback.options.fg,
						bgcolor: feedback.options.bg
					};
				}
			}
		};

		feedbacks['tally_PVW'] = {
			label: 'Tally on PVW',
			description: 'When the camera tally is on, change background color',
			options: [
				{
					type: 'colorpicker',
					label: 'Foreground color',
					id: 'fg',
					default: this.rgb(0, 0, 0)

				},
				{
					type: 'colorpicker',
					label: 'Background color',
					id: 'bg',
					default: this.rgb(250, 255, 0)
				}
			],
			callback: (feedback, bank) => {
				if (this.tally == "Preview") {
					return {
						color: feedback.options.fg,
						bgcolor: feedback.options.bg
					};
				}
			}
		};

		return feedbacks;
	}
}
