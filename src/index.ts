
import { AnswerInterface, EventsInterface, TerminalInterface } from "./types"
import { util } from "./util.js"

export default class Terminal {

  //! CORE SYSTEM
  private _createEventUtil = {
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
    if (!document.querySelector("[data-terminal-style")) document.querySelector("head").appendChild(util.defaultStyleGen(this.target.id))
  }
  createEvents(when: string, action: (util: typeof this._createEventUtil, next: Function) => void) {
    if (!this._events[when]) this._events[when] = {
      pointer: 0,
      actions: []
    }
    this._events[when].pointer += 1
    let pointer = this._events[when].pointer
    this._events[when].actions.push(() => {
      action(this._createEventUtil, (this._events[when].actions[pointer] as typeof action))
    })
  }
  trigger(event: string) {
    this._eventTriggerHandler(this._events[event])
  }
  async start() {
    if (this._defaultActions) this._defaultActions[0]()
  }
  //! -----------------------------------------

  //! COMMON METHODS
  print(message:string) {
    let el = util.genElement("print", {textContent: message})
    this.target.appendChild(el)
  }
  input(message:string, answers: AnswerInterface[]) {
    let el = util.genElement("input", {textContent: message})
    this.target.appendChild(el)
    this._inputListener(el as HTMLFormElement, answers)
  }
  private _inputListener(el: HTMLFormElement, answers: AnswerInterface[]) {
    let input = el.querySelector("input")
    input.focus()
    el.addEventListener("submit", e => {
      e.preventDefault()
      input.disabled = true
      if(answers.length) answers.forEach(ans => {
        let val = input.value
        if(val === ans.answer) {
          if(ans.action) ans.action()
          else console.log("No function is provided")
        }
        else if(val.match(/\S/g)) {
          this.print("message does not match expected answers")
          this.input(el.textContent, answers)
        } else {
          this.input(el.textContent, answers)
        }
      })
    })
  }


}

