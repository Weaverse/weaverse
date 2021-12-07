// TODO: Implement Weaverse SDK class
import fetch from 'isomorphic-unfetch'
import Elements from '@weaverse/elements'

export interface ProjectDataItemType {
	type: string
	name: string
	id: string | number
}

export interface ProjectDataType {
	items: ProjectDataItemType[]
}

export class Weaverse {
	elementInstances = new Map<string, any>()
	itemInstances = new Map<string | number, WeaverseItemStore>()
	appUrl: string = 'http://localhost:3000'
	projectKey: string = ''
	projectData: ProjectDataType = {
		items: []
	}
	listeners: Set<any> = new Set()

	constructor({
					appUrl,
					projectKey,
					projectData
				}: { appUrl?: string, projectKey?: string, projectData?: ProjectDataType } = {}) {
		this.appUrl = appUrl || this.appUrl
		this.projectKey = projectKey || this.projectKey
		projectData && (this.projectData = projectData)
		this.init()
	}

	registerElement(name: string, element: any) {
		this.elementInstances.set(name, element)
	}

	init() {
		Object.keys(Elements).forEach(key => {
			// @ts-ignore
			Elements[key]?.configs?.type && this.registerElement(Elements[key].configs.type, Elements[key])
		})

	}

	subscribe(fn: any) {
		this.listeners.add(fn)
	}

	unsubscribe(fn: any) {
		this.listeners.delete(fn)
	}

	triggerUpdate() {
		this.listeners.forEach(fn => fn())
	}

	fetchProjectData() {
		return fetch(this.appUrl + `/api/public/${this.projectKey}`).then(r => r.json())
	}

	updateProjectData() {
		if (this.projectKey) {
			this.fetchProjectData().then(data => {
				if (data) {
					this.projectData = data
					this.initItemData()
					this.triggerUpdate()
					window.top?.postMessage({
						type: 'weaverse.workspace.init', payload: this.projectData
					}, '*')
				}
				console.log('this.projectData', this.projectData)
			}).catch(err => {
				console.error(err)
			})
		}
	}

	initItemData() {
		let data = this.projectData
		if (data.items) {
			data.items.forEach(item => {
				let itemStore = new WeaverseItemStore(item, this)
				this.itemInstances.set(item.id, itemStore)
			})
		}
	}
}

export class WeaverseItemStore {
	data: any = {}
	listeners: Set<any> = new Set()
	Component: any

	constructor(itemData: any = {}, weaverse: Weaverse) {
		this.data = itemData
		let {type} = itemData
		if (type) {
			this.Component = weaverse.elementInstances.get(type)
		}
	}

	subscribe(fn: any) {
		this.listeners.add(fn)
	}

	unsubscribe(fn: any) {
		this.listeners.delete(fn)
	}

	triggerUpdate() {
		this.listeners.forEach(fn => fn())
	}


	// addItem(item: any) {
	// 	this.items.push(item)
	// 	this.triggerUpdate()
	// }
	//
	// removeItem(item: any) {
	// 	this.items = this.items.filter(i => i !== item)
	// 	this.triggerUpdate()
	// }
}