
import { EventsInterface, TerminalInterface } from "./types"
import { util } from "./util.js"

export default class Terminal {
  createEventUtil = {
    sleep: util.sleep
  }
  private _privateVars = {
  }
  private _events: EventsInterface = {
    default: {
      pointer: 0,
      actions: []
    }
  }
  private _defaultActions = this._events["default"].actions
  target: HTMLElement
  constructor(props: TerminalInterface) {
    this.target = props.target
    this._defaultStyle()
    if (props.style) (this.target.style as typeof props.style) = props.style
  }
  private async _eventTriggerHandler(event: typeof this._events[string]) {
    if (event && event.actions) event.actions[0]()
  }
  private _defaultStyle() {
    if (!document.querySelector("[data-terminal-style")) document.querySelector("head").appendChild(util.defaultStyleGen())
  }
  createEvents(when: string, action: (util: typeof this.createEventUtil, next: Function) => void) {
    if (!this._events[when]) this._events[when] = {
      pointer: 0,
      actions: []
    }
    this._events[when].pointer += 1
    let pointer = this._events[when].pointer
    this._events[when].actions.push(() => {
      action(this.createEventUtil, (this._events[when].actions[pointer] as typeof action))
    })
  }
  trigger(event: string) {
    this._eventTriggerHandler(this._events[event])
  }
  async start() {
    if (this._defaultActions) this._defaultActions[0]()
  }
}

