import { EventsInterface, TerminalInterface } from "./types"
import { util } from "./util.js"


class Terminal {
  createEventUtil = {
    sleep: util.sleep,
  }
  private _privateVars = {
  }
  private _events: EventsInterface = util.objectListener({
    default: {
      is: true,
      actions: []
    }
  }, (event) => this._eventTriggerHandler(event)) as EventsInterface
  private _defaultActions = this._events.default.actions
  target: HTMLElement
  constructor(props: TerminalInterface) {
    this.target= props.target
    this._defaultStyle()
    if(props.style) (this.target.style as typeof props.style) = props.style
  }
  private _eventTriggerHandler(event: typeof this._events[string]) {
    console.log(event)
  }
  private _defaultStyle() {
    if (!document.querySelector("[data-terminal-style")) document.querySelector("head").appendChild(util.defaultStyleGen())
  }
  async createEvent(when: string, action: (util:typeof this.createEventUtil) => void) {
    if(!this._events[when]) this._events[when] = {
      is: false,
      actions: []
    }
    this._events[when].actions.push(async () => {
      await action(this.createEventUtil)
    })
  }
  trigger(event: string) {
    if(this._events[event]) this._events[event].is = true
  }
  async start() {
    if (this._defaultActions.length) this._defaultActions.forEach(action => action(this.createEventUtil))
  }
}

let terminal = new Terminal({
  target: document.getElementById("root")
})
terminal.createEvent("bruh", (helper) => {
  console.log("aye")
  helper.sleep(1500)
  console.log("Aloo")
})

terminal.trigger("bruh")

// @ts-ignore
window.terminal = terminal