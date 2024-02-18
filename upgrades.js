const { CreateConvertToBooleanFeedbackUpgradeScript } = require('@companion-module/base')

module.exports = [
	/*
	 * Place your upgrade scripts here
	 * Remember that once it has been added it cannot be removed!
	 */
	CreateConvertToBooleanFeedbackUpgradeScript({
		recording: true,
		streaming: true,
		tally_PGM: true,
        tally_PVW: true,
	}),
    function IntroducePolling(context, props) {
        let config = props.config
        let update = false
        if (typeof config.polling !== 'boolean') { 
            config.polling = false 
            update = true
        }
        if (typeof config.interval !== 'number' || config.interval < 0.5 || config.interval < 5000) {
            config.interval = 2
            update = true
        }
        if (update) {
            return { 
                updatedConfig: config,
                updatedActions: [],
			    updatedFeedbacks: [],
            }
        }
        return { 
            updatedConfig: null,
            updatedActions: [],
            updatedFeedbacks: [],
        }
    },
]