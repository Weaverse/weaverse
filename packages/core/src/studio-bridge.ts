import {isBrowser} from './utils'
import type {Weaverse} from '.'

/**
 * When the editor is ready, we'll load this studio-bridge code.
 * This is for processing data between the editor and the workspace project.
 * It will not load in production mode or not running when the editor is not detected/ready.
 */

export class StudioBridge {
  weaverse: Weaverse

  /**
   * instance for subscribing to window message, save it to currentFrameSubscription then can remove it when unmount
   */
  currentFrameSubscription: any
  handleProps: any
  constructor(weaverse: Weaverse) {
    this.weaverse = weaverse
    this.handleProps = {
      onMouseDownCapture: this.handleMouseDown.bind(this)
    }
  }

  /**
   * subscribe to window message event from editor(parent window), and handle the message event
   */
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

  /**
   * handle the message event from editor(parent window)
   * the message type will start with "weavers.",
   * when an item got message to update, get the item instance and setData to it
   * @param event {MessageEvent}
   */
  handleMessageEvent = (event: MessageEvent) => {
    if (event.data?.type?.startsWith('weaverse.')) {
      let type = event.data.type
      switch (type) {
        case 'weaverse.editor.ready':
          this.weaverse.isEditor = true
          break
        case 'weaverse.editor.update':
          let {payload} = event.data
          let {itemId, background} = payload
          let instance = this.weaverse.itemInstances.get(itemId)
          if (instance) {
            instance.setData({
              css: {
                background
              }
            })
          }
      }
    }
  }

  sendMessageToEditor(type: string, payload: any) {
    isBrowser && window.parent.postMessage({type, payload}, '*')
  }

  handleMouseDown = (e: MouseEvent) => {
    console.log('handleMouseDown', e)
    this.sendMessageToEditor('weaverse.editor.mouseDown', {})
  }
}


export default StudioBridge