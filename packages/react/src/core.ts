// TODO: Implement Weaverse SDK class
import fetch from 'isomorphic-unfetch'
import Elements from '@weaverse/elements'
import {useEffect} from 'react'
import {isBrowser} from './utils'


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
	isEditor = false
	currentFrameSubscription: any

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
		this.subscribeMessageEvent()
	}

	subscribe(fn: any) {
		this.listeners.add(fn)
	}

	unsubscribe(fn: any) {
		this.listeners.delete(fn)
	}

	triggerUpdate() {
		this.listeners.forEach(fn => fn())
		this.triggerEditorUpdate()
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
				}
			}).catch(err => {
				console.error(err)
			})
		}
	}

	subscribeMessageEvent() {
		if (typeof this.currentFrameSubscription === 'function') {
			this.currentFrameSubscription()
		}
		isBrowser && window.addEventListener('message', this.handleMessageEvent)
		this.currentFrameSubscription = () => {
			isBrowser && window.removeEventListener('message', this.handleMessageEvent)
		}
		return this.currentFrameSubscription
	}

	triggerEditorUpdate(type = 'weaverse.workspace.init') {
		if (this.isEditor) {
			window.top?.postMessage({
				type, payload: {
					projectKey: this.projectKey,
					projectData: this.projectData
				}
			}, '*')
		}
	}

	handleMessageEvent = (e: MessageEvent) => {
		if (e.data?.type?.startsWith('weaverse.')) {
			let type = e.data.type
			switch (type) {
				case 'weaverse.editor.ready':
					this.isEditor = true
					break
				case 'weaverse.editor.update':
					let {payload} = e.data
					let {itemId, background} = payload
					let instance = this.itemInstances.get(itemId)
					if (instance) {
						instance.setData({
							style: {
								background
							}
						})
					}
			}
		}
	}

	initItemData() {
		let data = this.projectData
		if (data.items) {
			data.items.forEach(item => {
				let itemStore = this.itemInstances.get(item.id) || new WeaverseItemStore(item, this)
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

	setData = (data: any) => {
		this.data = Object.assign(this.data, data)
		this.triggerUpdate()
	}

	subscribe = (fn: any) => {
		this.listeners.add(fn)
	}

	unsubscribe = (fn: any) => {
		this.listeners.delete(fn)
	}

	triggerUpdate = () => {
		this.listeners.forEach(fn => {
			return fn(this.data)
		})
	}

	useSubscription = (fn: any) => {
		useEffect(() => {
			this.subscribe(fn)
			return () => {
				this.unsubscribe(fn)
			}
		}, [])
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