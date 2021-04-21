import { Config } from '../src/.' // eslint-disable-line node/no-unpublished-import

export const config: Config = {
	mosConnection: {
		mosID: 'quick.mos',
		acceptsConnections: true,
		openRelay: true,
		profiles: {
			'0': true,
			'1': true,
			'2': true,
			'3': true,
		},
	},
	devices: [],
}
