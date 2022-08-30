
import { AnswerInterface, EventsInterface, InfiniteArray, Path, TerminalInterface } from "./types"
import { util } from "./util.js"

export default class Terminal {

  //! CORE SYSTEM
  private _createEventUtil = {
    sleep: util.sleep
  }
  private _privateVars = {
    tree: {} as Path,
    treeArr: [] as InfiniteArray<string>,
    currentDir: [] as string[],
    defaultCommandsEnabled: false
  }
  private _commands: AnswerInterface[] = []
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
  private _eventTriggerHandler(event: typeof this._events[string]) {
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
  //! ------------------------------------------------------------

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
    input.classList.add("isFocused")
    el.addEventListener("submit", e => {
      e.preventDefault()
      input.disabled = true
      input.classList.remove("isFocused")
      if(answers.length) answers.forEach(ans => {
        let val = input.value
        if(val === ans.answer) {
          if(ans.action) ans.action()
          else console.log("No function is provided")
        }
        else if(val.match(/\S/g)) {
          this.print("prompt does not match expected answers")
          this.input(el.textContent, answers)
        } else {
          this.input(el.textContent, answers)
        }
      })
    })
  }
  //! ------------------------------------------------------------

  //! DIRECTORY MANAGEMENT
  cmd(pre?: string) {
    if(!pre) pre = ">"
    let el = util.genElement("input", { textContent: `${this.prefix}${pre}`})
    this.target.appendChild(el)
    this._cmdListener(el as HTMLFormElement, pre)
  }
  private _cmdListener(el: HTMLFormElement, pre: string) {
    let input = el.querySelector("input")
    input.focus()
    input.classList.add("isFocused")
    el.addEventListener("submit", e => {
      e.preventDefault()
      input.disabled = true
      input.classList.remove("isFocused")
      let val = input.value
      if(this._commands.length) {
        let command = val.split(/(\s+)/g)[0]
        let args = val.split(/\s+/g).slice(1)
        let desiredCommand = this._commands.find(com => com.answer === command)
        if(desiredCommand) {
          let doCmd = desiredCommand.action(args)
          if(doCmd) this.cmd(pre)
        }
        else if (val.match(/^\s*$/g)) {
          this.cmd(pre)
          return;
        }
        else {
          this.print("this command doesn't exist!")
          this.cmd(pre)
        }
      }
      else {
        this.print("no commands exist !")
        this.cmd(pre)
      }
    })
  }
  setPathTree(path: Path) {
    this._privateVars.tree = path
    this._privateVars.treeArr = util.pathGen(path)
  }
  setPath(path: string) {
    let newPath = util.pathReader(path)
    let desiredPath = this._privateVars.treeArr.find(arr => util.compareArrayByIndex(arr as InfiniteArray<string>, newPath))
    if(desiredPath) {
      this._privateVars.currentDir = desiredPath as string[]
    } else throw Error("a directory that was inserted doesn't exist in tree")
  }
  private get prefix() {
    return `${this._privateVars.currentDir[0]}:/${this._privateVars.currentDir.slice(1).join("/") }`
  }
  //! ------------------------------------------------------------

  //! CUSTOM COMMANDS [BUILT-IN + EXTERNAL]
  enableDefaultCommands() {
    if(this._privateVars.defaultCommandsEnabled) return;
    else {
      let commands: AnswerInterface[] = [
        {
          answer: "CMDtest",
          action: (args) => {
            console.log(args)
            return true
          }
        }, {
          answer: "clear",
          action: () => {
            this.target.innerHTML = ``
            return true
          }
        }




      ]
      this._commands = [...this._commands, ...commands]
    }
  }
  addCommand(command: AnswerInterface | AnswerInterface[]) {
    if (Array.isArray(command)) this._commands = [...this._commands, ...command]
    else this._commands = [...this._commands, command]
  }
}

