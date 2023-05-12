import { Config } from '../src/.' // eslint-disable-line node/no-unpublished-import

export const config: Config = {
	primary: {
		enable: false,
		mosConnection: {
			// This is the NCS-id, you might need to specify it in your mos-client that connects to Quick-MOS.
			mosID: 'MAENPSOSLO02',
			acceptsConnections: true,
			openRelay: true,
			profiles: {
				'0': true,
				'1': true,
				'2': true,
				'3': true,
			},
			host: '192.168.1.201',
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
	},
	buddy: {
		enable: true,
		mosConnection: {
			// This is the NCS-id, you might need to specify it in your mos-client that connects to Quick-MOS.
			mosID: 'DRENPSOSLO02',
			acceptsConnections: true,
			openRelay: true,
			profiles: {
				'0': true,
				'1': true,
				'2': true,
				'3': true,
			},
			host: '192.168.1.159',
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
	},
}
