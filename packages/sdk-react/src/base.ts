// TODO: Implement Weaverse SDK class

import Elements from '@weaverse/elements'

export class Weaverse {
	elementInstances = new Map<string, any>()
	appUrl: string = 'http://localhost:3000'
	projectKey: string = ''
	projectData: any = {}
	listeners: Set<any> = new Set()

	constructor({appUrl, projectKey, projectData}: { appUrl?: string, projectKey?: string, projectData?: any } = {}) {
		this.appUrl = appUrl || this.appUrl
		this.projectKey = projectKey || this.projectKey
		this.projectData = projectData || this.projectData
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
				this.projectData = data
				this.triggerUpdate()
				console.log('this.projectData', this.projectData)
			}).catch(err => {
				console.error(err)
			})
		}
	}
}