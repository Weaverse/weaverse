// TODO: Implement Weaverse SDK class
import fetch from 'isomorphic-unfetch'
import {isBrowser} from './utils'


export interface ProjectDataItemType {
	type: string
	name: string
	id: string | number
}

export interface ProjectDataType {
	items: ProjectDataItemType[]
}

// const isSheetAccessible = (sheet: CSSStyleSheet) => {
// 	if (sheet.href && !sheet.href.startsWith(location.origin)) {
// 		return false
// 	}
//
// 	try {
// 		sheet.cssRules
// 		return true
// 	} catch (e) {
// 		return false
// 	}
// }

// export class WeaverseStyle {
// 	public styleSheets: StyleSheetList
// 	public document: Document
//
// 	constructor(root: Document) {
// 		this.document = root
// 		this.styleSheets = this.document.styleSheets
// 	}
//
// 	// Create styleSheet instance that work both on client and server side
// 	createSheet = (root?: Document) => {
// 		let sheetInstance: any = null
//
// 		const reset = () => {
// 			const sheets = Object(root).styleSheets || []
// 			// iterate all stylesheets until a hydratable stylesheet is found
// 			for (const sheet of sheets) {
// 				if (!isSheetAccessible(sheet)) continue
//
// 				for (let index = 0, rules = sheet.cssRules; rules[index]; ++index) {
// 					// /** @type {CSSStyleRule} Possible indicator rule. */
// 					const check = Object(rules[index])
// 					if (check.selectorText && check.selectorText.includes('@media')) {
// 						if (!sheetInstance) sheetInstance = {sheet, reset, rules: sheet.cssRules}
// 						break
// 					}
//
// 				}
//
// 				// if a hydratable stylesheet is found, stop looking
// 				if (sheetInstance) break
// 			}
// 			// if no hydratable stylesheet is found
// 			if (!sheetInstance) {
// 				const createCSSMediaRule = (sourceCssText: string) => {
// 					let rule: any = {
// 						cssRules: [],
// 						insertRule(cssText: string, index: number) {
// 							this.cssRules.splice(index, 0, createCSSMediaRule(cssText))
// 						},
// 						get cssText() {
// 							return sourceCssText === '@media{}' ? `@media{${[].map.call(this.cssRules, (cssRule: any) => cssRule.cssText).join('')}}` : sourceCssText
// 						}
// 					}
// 					return rule
// 				}
//
// 				sheetInstance = {
// 					sheet: root ? (root.head || root).appendChild(root.createElement('style')).sheet : createCSSMediaRule(''),
// 					rules: {},
// 					reset,
// 					toString() {
// 						const {cssRules} = sheetInstance.sheet
// 						return [].map
// 							.call(cssRules, (cssMediaRule: CSSMediaRule, cssRuleIndex) => {
// 								const {cssText} = cssMediaRule
//
// 								let lastRuleCssText = ''
// 								if (cssRules[cssRuleIndex - 1]) {
// 									if (!cssMediaRule.cssRules.length) return ''
//
// 									for (const name in sheetInstance.rules) {
// 										if (sheetInstance.rules[name].group === cssMediaRule) {
// 											return `--sxs{--sxs:${[...sheetInstance.rules[name].cache].join(' ')}}${cssText}`
// 										}
// 									}
//
// 									return cssMediaRule.cssRules.length ? `${lastRuleCssText}${cssText}` : ''
// 								}
//
// 								return cssText
// 							})
// 							.join('')
// 					}
// 				}
// 			}
// 		}
//
// 	}
//
// }

export type WeaverseType = {
	[key: string]: any
	appUrl?: string,
	projectKey?: string,
	projectData?: ProjectDataType
}

export class Weaverse {
	elementInstances = new Map<string, any>()
	itemInstances = new Map<string | number, WeaverseItemStore>()
	appUrl: string = process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://weaverse.io'
	projectKey: string = ''
	projectData: ProjectDataType = {
		items: []
	}
	listeners: Set<any> = new Set()
	isEditor = false
	currentFrameSubscription: any

	constructor({appUrl, projectKey, projectData}: WeaverseType = {}) {
		this.appUrl = appUrl || this.appUrl
		this.projectKey = projectKey || this.projectKey
		projectData && (this.projectData = projectData)
		this.init()
	}

	registerElement(name: string, element: any) {
		this.elementInstances.set(name, element)
	}

	init() {
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