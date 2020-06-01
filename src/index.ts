import * as chokidar from 'chokidar'

import * as fs from 'fs'
import * as _ from 'underscore'
import * as path from 'path'
const clone = require('fast-clone')
import {
	MosConnection,
	IMOSDevice,
	IMOSConnectionStatus,
	IMOSRunningOrder,
	IMOSROAck,
	MosString128,
	IMOSRunningOrderBase,
	IMOSRunningOrderStatus,
	IMOSStoryStatus,
	IMOSItemStatus,
	IMOSStoryAction,
	IMOSROStory,
	IMOSROAction,
	IMOSItemAction,
	IMOSItem,
	IMOSROReadyToAir,
	IMOSROFullStory,
	IConnectionConfig,
	IMOSDeviceConnectionOptions,
	MosDevice,
	IMOSListMachInfo,
	MosTime
} from 'mos-connection'

console.log('Starting Quick-MOS')

const DELAY_TIME = 300 // ms

// const tsr = new TSRHandler(console.log)

const watcher = chokidar.watch('input/**', { ignored: /^\./, persistent: true })

watcher
.on('add', () => {
	triggerReload()
})
.on('change', () => {
	triggerReload()
})
.on('unlink', () => {
	triggerReload()
})
.on('error', error => {
	console.error('Error', error)
})

export interface Config {
	mosConnection: IConnectionConfig,
	devices: IMOSDeviceConnectionOptions[]
}
const config: Config = {
	mosConnection: {
		mosID: 'quick-mos',
		acceptsConnections: true,
		profiles: {
			'0': true,
			'1': true,
			'2': true,
			'3': true
		}
	},
	devices: []
}

const mos: {
	mosConnection?: MosConnection
} = {}

let running = false
let waiting = false
function triggerReload () {
	console.log('triggerReload')
	setTimeout(() => {
		waiting = false
		if (running) {
			waiting = true
		} else {
			running = true
			reloadInner()
			.then(() => {
				running = false
				if (waiting) triggerReload()
			})
			.catch((e) => {
				running = false
				console.error(e)
				if (waiting) triggerReload()
			})
		}
	}, DELAY_TIME)
}
function loadFile (requirePath) {
	delete require.cache[require.resolve(requirePath)]
	return require(requirePath)
}
const monitors: {[ id: string]: MOSMonitor} = {}
const runningOrderIds: {[id: string]: number} = {}

async function reloadInner () {
	console.log('reloadInner')
	const newConfig: Config = loadFile('../input/config.ts').config
	if (
		!_.isEqual(newConfig.mosConnection, config.mosConnection) ||
		!mos.mosConnection
	) {
		console.log('Restarting mosConnection')
		config.mosConnection = newConfig.mosConnection
		if (mos.mosConnection) {
			await mos.mosConnection.dispose()
		}
		mos.mosConnection = new MosConnection(config.mosConnection)

		mos.mosConnection.onConnection((mosDevice: MosDevice) => {
			console.log('new mos connection', mosDevice.ID)

			mosDevice.onGetMachineInfo(async () => {
				const machineInfo: IMOSListMachInfo = {
					manufacturer: new MosString128('<<<Mock Manufacturer>>>'),
					model: new MosString128('<<<Mock model>>>'),
					hwRev: new MosString128('1.0'),
					swRev: new MosString128('1.0'),
					DOM: new MosTime(0),
					SN: new MosString128('<<<Mock SN>>>'),
					ID: new MosString128(config.mosConnection.mosID),
					time: new MosTime(Date.now()),
					// opTime?: MosTime;
					mosRev: new MosString128('0'),
					supportedProfiles: {
						deviceType: 'NCS',
						profile0: true,
						profile1: true,
						profile2: true
						// profile3?: boolean;
						// profile4?: boolean;
						// profile5?: boolean;
						// profile6?: boolean;
						// profile7?: boolean;
					}
					// defaultActiveX?: Array<IMOSDefaultActiveX>;
				// 	mosExternalMetaData?: Array<IMOSExternalMetaData>;
				}
				return machineInfo
			})
			mosDevice.onConnectionChange(() => {
				console.log(mosDevice.ID, 'connection change', mosDevice.getConnectionStatus())
			})

			const mosId = mosDevice.ID.toString()

			if (!monitors[mosId]) {
				monitors[mosId] = new MOSMonitor(mosDevice)
			}
			// mosDevice.onRequestMOSObject((objId: string) => Promise<IMOSObject | null>): void;
			// mosDevice.onRequestAllMOSObjects((pause: number) => Promise<Array<IMOSObject> | IMOSAck>): void;
			// mosDevice.onCreateRunningOrder((ro: IMOSRunningOrder) => Promise<IMOSROAck>): void;
			// mosDevice.onReplaceRunningOrder((ro: IMOSRunningOrder) => Promise<IMOSROAck>): void;
			// mosDevice.onDeleteRunningOrder((runningOrderId: MosString128) => Promise<IMOSROAck>): void;
			// mosDevice.onRequestRunningOrder((runningOrderId: MosString128) => Promise<IMOSRunningOrder | null>): void;
			// mosDevice.onMetadataReplace((metadata: IMOSRunningOrderBase) => Promise<IMOSROAck>): void;
			// mosDevice.onRunningOrderStatus((status: IMOSRunningOrderStatus) => Promise<IMOSROAck>): void;
			// mosDevice.onStoryStatus((status: IMOSStoryStatus) => Promise<IMOSROAck>): void;
			// mosDevice.onItemStatus((status: IMOSItemStatus) => Promise<IMOSROAck>): void;
			// mosDevice.onReadyToAir((Action: IMOSROReadyToAir) => Promise<IMOSROAck>): void;
			// mosDevice.onROInsertStories((Action: IMOSStoryAction, Stories: Array<IMOSROStory>) => Promise<IMOSROAck>): void;
			// mosDevice.onROInsertItems((Action: IMOSItemAction, Items: Array<IMOSItem>) => Promise<IMOSROAck>): void;
			// mosDevice.onROReplaceStories((Action: IMOSStoryAction, Stories: Array<IMOSROStory>) => Promise<IMOSROAck>): void;
			// mosDevice.onROReplaceItems((Action: IMOSItemAction, Items: Array<IMOSItem>) => Promise<IMOSROAck>): void;
			// mosDevice.onROMoveStories((Action: IMOSStoryAction, Stories: Array<MosString128>) => Promise<IMOSROAck>): void;
			// mosDevice.onROMoveItems((Action: IMOSItemAction, Items: Array<MosString128>) => Promise<IMOSROAck>): void;
			// mosDevice.onRODeleteStories((Action: IMOSROAction, Stories: Array<MosString128>) => Promise<IMOSROAck>): void;
			// mosDevice.onRODeleteItems((Action: IMOSStoryAction, Items: Array<MosString128>) => Promise<IMOSROAck>): void;
			// mosDevice.onROSwapStories((Action: IMOSROAction, StoryID0: MosString128, StoryID1: MosString128) => Promise<IMOSROAck>): void;
			// mosDevice.onROSwapItems((Action: IMOSStoryAction, ItemID0: MosString128, ItemID1: MosString128) => Promise<IMOSROAck>): void;
			// mosDevice.onMosObjCreate((object: IMOSObject) => Promise<IMOSAck>): void;
			// mosDevice.onMosItemReplace((roID: MosString128, storyID: MosString128, item: IMOSItem) => Promise<IMOSROAck>): void;
			// mosDevice.onMosReqSearchableSchema((username: string) => Promise<IMOSSearchableSchema>): void;
			// mosDevice.onMosReqObjectList((objList: IMosRequestObjectList) => Promise<IMosObjectList>): void;
			// mosDevice.onMosReqObjectAction((action: string, obj: IMOSObject) => Promise<IMOSAck>): void;
			mosDevice.onROReqAll(() => {
				const ros = fetchRunningOrders()
				return Promise.resolve(ros.map(r => r.ro))
			})
			// mosDevice.onROStory((story: IMOSROFullStory) => Promise<IMOSROAck>): void;
			setTimeout(() => {
				refreshFiles()
			}, 500)
		})
		await mos.mosConnection.init()

		for (const deviceConfig of newConfig.devices) {
			const mosDevice = await mos.mosConnection.connect(deviceConfig)
			console.log('created mosDevice', mosDevice.ID)
		}
		console.log('mos initialized')
	}

	refreshFiles()
}
function refreshFiles () {
	// Check data
	const t = Date.now()
	_.each(fetchRunningOrders(), r => {
		const runningOrder = r.ro
		const stories = r.stories

		const id = runningOrder.ID.toString()
		runningOrderIds[id] = t
		_.each(monitors, (monitor) => {
			monitor.onUpdatedRunningOrder(runningOrder, stories)
		})
	})
	_.each(runningOrderIds, (oldT, id) => {
		if (oldT !== t) {
			_.each(monitors, (monitor) => {
				monitor.onDeletedRunningOrder(id)
			})
		}
	})
}
function fetchRunningOrders () {
	const runningOrders: {ro: IMOSRunningOrder, stories: IMOSROFullStory[]}[] = []
	_.each(getAllFilesInDirectory('input/runningorders'), filePath => {

		const requirePath = '../' + filePath.replace(/\\/g, '/')

		if (requirePath.match(/[\/\\]_/)) {
			// ignore and folders files that begin with "_"
			return
		}
		if (filePath.match(/\.ts$/)) {

			const fileContents = loadFile(requirePath)
			const ro: IMOSRunningOrder = fileContents.runningOrder
			ro.ID = new MosString128(
				filePath.replace(/[\W]/g, '_')
			)

			runningOrders.push({
				ro,
				stories: fileContents.fullStories
			})

		}
	})
	return runningOrders
}
function getAllFilesInDirectory (dir: string): string[] {
	const files = fs.readdirSync(dir)

	let filelist: string[] = []
	files.forEach(file => {

		if (fs.statSync(path.join(dir, file)).isDirectory()) {
			getAllFilesInDirectory(path.join(dir, file)).forEach(innerFile => {
				filelist.push(innerFile)
			})
		} else {
			filelist.push(path.join(dir, file))
		}
	})
	return filelist
}

// ------------
triggerReload()
console.log('Listening to changes in /input...')

type MOSCommand = () => Promise<any>
class MOSMonitor {
	private commands: MOSCommand[] = []

	private ros: {[ roId: string]: IMOSRunningOrder} = {}
	private queueRunning: boolean = false

	constructor (
		private mosDevice: MosDevice
	) {}
	onDeletedRunningOrder (roId: string) {
		console.log('onDeletedRunningOrder', roId)
		if (this.ros[roId]) {
			this.commands.push(() => {
				console.log('sendDeleteRunningOrder')
				return this.mosDevice.sendDeleteRunningOrder(new MosString128(roId))
			})
		}
		// At the end, store the updated RO:
		delete this.ros[roId]
		this.triggerCheckQueue()
	}
	onUpdatedRunningOrder (ro: IMOSRunningOrder, fullStories: IMOSROFullStory[]): void {
		// compare with
		const roId = ro.ID.toString()
		console.log('onUpdatedRunningOrder', roId)

		const localRo = this.ros[roId]

		if (!localRo) {
			// New RO
			this.commands.push(() => {
				console.log('sendCreateRunningOrder', ro.ID)
				return this.mosDevice.sendCreateRunningOrder(ro)
			})
			console.log('stories', fullStories.length)
			fullStories.forEach(story => {
				console.log('a')
				this.commands.push(() => {
					console.log('sendFullStory', story.ID)
					return this.mosDevice.sendROStory(story)
				})
			})
		} else {
			const metadataEqual = _.isEqual(
				localRo.MosExternalMetaData,
				ro.MosExternalMetaData
			)
			const roStoriesEqual = _.isEqual(
				localRo.Stories,
				ro.Stories
			)
			const roBaseDataEqual = _.isEqual(
				_.omit(localRo,	'MosExternalMetaData', 'Stories'),
				_.omit(ro,		'MosExternalMetaData', 'Stories')
			)
			if (
				roBaseDataEqual &&
				metadataEqual &&
				roStoriesEqual
			) {
				// nothing changed, do nothing
			} else if (
				(
					!roBaseDataEqual ||
					!metadataEqual
				) &&
				roStoriesEqual
			) {
				// Only RO metadata has changed
				this.commands.push(() => {
					console.log('sendMetadataReplace', ro.ID)
					return this.mosDevice.sendMetadataReplace(ro)
				})
			} else if (
				roBaseDataEqual &&
				metadataEqual &&
				!roStoriesEqual
			) {
				// Only Stories has changed
				const o = this.storiesChanges(localRo.Stories, ro.Stories)

				console.log('added', o.added)
				console.log('changed', o.changed)
				console.log('moved', o.moved)
				console.log('removed', o.removed)

				if (o.removed.length) {
					console.log('sendRODeleteStories', ro.ID, o.removed.map(r => r.id))
					this.commands.push(() => {
						return this.mosDevice.sendRODeleteStories({
							RunningOrderID: ro.ID
						}, o.removed.map(r => new MosString128(r.id)))
					})
				}
				// const addedGroups = this.groupIndexes(o.added)
				_.each(o.added, (stories, beforeId) => {
					// const index = parseInt(index0, 10)
					this.commands.push(() => {
						console.log('sendROInsertStories', ro.ID)
						return this.mosDevice.sendROInsertStories({
							RunningOrderID: ro.ID,
							StoryID: new MosString128(beforeId)
						}, stories)
					})
				})
				_.each(o.changed, c => {
					this.commands.push(() => {
						console.log('sendROReplaceStories', ro.ID)
						const story = ro.Stories[c.id]
						return this.mosDevice.sendROReplaceStories({
							RunningOrderID: ro.ID,
							StoryID: new MosString128(c.id)
						}, [ c.story ])
					})
				})
				// Swap logic:
				// if (
				// 	o.moved.length === 2 &&
				// 	o.moved[0].ids.length === 1 &&
				// 	o.moved[1].ids.length === 1 &&

				// 	o.moved[0].beforeId

				// 	o.moved[0].beforeId === o.moved[1].oldIndex &&
				// 	o.moved[1].index === o.moved[0].oldIndex
				// ) {
				// 	this.commands.push(() => {
				// 		console.log('sendROSwapStories', ro.ID)
				// 		return this.mosDevice.sendROSwapStories({
				// 			RunningOrderID: ro.ID
				// 		},
				// 		new MosString128(o.moved[0].id),
				// 		new MosString128(o.moved[1].id)
				// 		)
				// 	})
				// } else {
				// const movedGroups = this.groupIndexes(o.moved)
				// console.log('movedGroups', movedGroups)
				_.each(o.moved, (m) => {
					// const index = parseInt(index0, 10)
					this.commands.push(() => {
						console.log('sendROMoveStories', ro.ID, m.afterId, m.ids)
						// const behindStory = index > 0 && ro.Stories[index - 1]
						return this.mosDevice.sendROMoveStories({
							RunningOrderID: ro.ID,
							StoryID: new MosString128(m.afterId)
						}, m.ids.map(m => new MosString128(m)))
					})
				})

				//
				// this.commands.push(() => {
				// 	console.log('sendMetadataReplace')
				// 	return this.mosDevice.sendMetadataReplace(ro)
				// })
			} else {
				// last resort: replace the whole rundown
				this.commands.push(() => {
					console.log('sendReplaceRunningOrder')
					return this.mosDevice.sendReplaceRunningOrder(ro)
				})
			}
		}
		// At the end, store the updated RO:
		this.ros[roId] = ro

		this.triggerCheckQueue()
	}
	groupIndexes<T extends { index: number }> (added: T[]) {
		let groupIndex = -99999
		let nextIndex = -99999
		return _.groupBy(added, a => {
			if (nextIndex !== a.index - 1) {
				groupIndex = a.index
			}
			nextIndex = a.index
			return groupIndex
		})
	}
	storiesChanges (stories0: IMOSROStory[], stories1: IMOSROStory[]) {
		const added: {[afterId: string]: IMOSROStory[]} = {}
		const changed: {id: string, story: IMOSROStory}[] = []
		const moved: {afterId: string, ids: string[]}[] = []
		const removed: {id: string}[] = []

		const oldStories: {[id: string]: {story: IMOSROStory, index: number}} = {}
		const newStories: {[id: string]: {story: IMOSROStory, index: number}} = {}

		const oldPrevNext: {[id: string]: { prev: string, next: string, index: number}} = {}
		const newPrevNext: {[id: string]: { prev: string, next: string, index: number}} = {}

		_.each(stories0, (story, index) => {
			const id = story.ID.toString()
			oldStories[id] = { story, index }

			oldPrevNext[id] = {
				prev: index > 0 ? stories0[index - 1].ID.toString() : '',
				next: (stories0[index + 1] || { ID: '' }).ID.toString(),
				index
			}
		})

		_.each(stories1, (story, index) => {
			const id = story.ID.toString()
			newStories[story.ID.toString()] = { story, index }

			newPrevNext[id] = {
				prev: index > 0 ? stories1[index - 1].ID.toString() : '',
				next: (stories1[index + 1] || { ID: '' }).ID.toString(),
				index
			}

			// const oldStory = oldStories[id]
			// if (!oldStory) {

			// } else {
				// if (!_.isEqual(oldStory.story, story)) {
					// changed.push({ id, story })
				// }
				// if (oldStory.index !== index) {
					// moved.push({ id, index, oldIndex: oldStory.index })
				// }
			// }
		})
		const movedIds: {[id: string]: true} = {}
		_.each(stories1, (story) => {
			const id = story.ID.toString()
			const n = newPrevNext[id]

			const o = oldPrevNext[id]
			const oldStory = oldStories[id]
			if (!o) {
				const afterId = n.next
				if (!added[afterId]) added[afterId] = []
				added[afterId].push(story)
			} else {
				if (!_.isEqual(oldStory.story, story)) {
					changed.push({ id, story })
				}

				if (movedIds[id]) return // already moved this one
				if (
					o.prev !== n.prev &&
					o.next !== n.next
				) {
					// If both the prev och the next reference has changed, it has been moved
					const move = { afterId: n.next, ids: [id] }
					moved.push(move)
					movedIds[id] = true
					// Also move subsequent ones:
					let movedId = id
					let nextId = n.next
					for (let i = _.keys(newPrevNext).length; i > 0; i--) {
						const n2 = newPrevNext[nextId]
						const o2 = oldPrevNext[nextId]
						if (!o2) return
						if (o2.prev === movedId) {
							move.ids.push(nextId)
							movedIds[nextId] = true
							movedId = nextId
							nextId = n2.next
						} else {
							break
						}
					}
				}
			}
		})
		_.each(stories0, (story) => {
			const id = story.ID.toString()
			const n = newPrevNext[id]
			if (!n) {
				removed.push({ id })
			}
		})

		return {
			added,
			changed,
			moved,
			removed
		}

	}

	private triggerCheckQueue () {
		if (!this.queueRunning) {
			if (this.commands.length) {

				const nextCommand = this.commands[0]
				this.queueRunning = true
				nextCommand()
				.then(() => {
					this.queueRunning = false
					this.commands.splice(0, 1) // remove the command from queue, as it has now been executed successfully
					setTimeout(() => this.triggerCheckQueue(), 100)
				})
				.catch((err) => {
					console.log('err', err)
					this.queueRunning = false
					setTimeout(() => this.triggerCheckQueue(), 2000)
				})
			}
		}
	}
}
