import { Config } from '../src/.' // eslint-disable-line node/no-unpublished-import

export const config: Config = {
	mosConnection: {
		// This is the NCS-id, you might need to specify it in your mos-client that connects to Quick-MOS.
		mosID: 'quick.mos',
		acceptsConnections: true,
		openRelay: true,
		profiles: {
			'0': true,
			'1': true,
			'2': true,
			'3': true,
		},
		// Set these if you want quick-mos to run on other ports than standard:
		// ports: {
		// 	lower: 11540,
		// 	upper: 11541,
		// 	query: 11542,
		// },

		// Set to true to turn on debug-logging:
		debug: false,
	},
	devices: [],
}
