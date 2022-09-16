
import type { EventsInterface, InfiniteArray, Path, TerminalInterface, FileAction, CommandsInterface, User, authParams, MessageTypes } from "./types"
import { util } from "./util.js"

export default class Terminal {

  //! CORE SYSTEM
  private _createEventUtil = {
    sleep: util.sleep,
    setVariable: (v: string, val: boolean = true) => {
      if(Object.keys(this._vars).find(pred => pred === v)) this._vars[v] = val
      else console.error(`variable ${v} doesn't exist`)
    },
    varIsTrue: (v: string | string[]) => 
      Array.isArray(v) ? v.every(pred => this._vars[pred]) :
      this._vars[v]
  }
  #_privateVars = {
    tree: {} as Path,
    treeArr: [] as InfiniteArray<string>,
    currentDir: [] as string[],
    defaultCommandsEnabled: false,
    fileActions: [] as FileAction[],
    users: [] as User[],
    commands: [] as CommandsInterface[]
  }
  private _defaultPermissions: User["auth"] = {commands: [], dirs: []}
  private _vars: {[variable:string]: boolean} = {}
  createVariables(v: string | string[]) {
    let obj = {}
    if(Array.isArray(v)) {
      v.forEach(va => obj[va] = false)
    } else obj[v] = false
    Object.assign(this._vars, obj)
  }
  set defaultPaths(perms: string[]) {
    this._defaultPermissions.dirs = [...this._defaultPermissions.dirs, ...perms]
  } 
  set defaultCommands(perms: string[]) {
    this._defaultPermissions.commands = [...this._defaultPermissions.commands, ...perms]
  }
  private _currentUser: User
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
    this.setPathTree({C: "C"})
    this.setPath("C")
  }
  private _eventTriggerHandler(event: typeof this._events[string]) {
    if (event && event.actions) event.actions[0]()
  }
  private _defaultStyle() {
    if (!document.querySelector("[data-terminal-style")) document.querySelector("head").appendChild(util.defaultStyleGen(this.target.id))
  }
  createEvents(when: string, action: (util: typeof this._createEventUtil, next: Function) => void) {
    if(when.match(/\s/g) || !when.length) when = "default"
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
  print(message:string, type?: MessageTypes) {
    let el = util.genElement("print", {textContent: message}, type)
    this.target.appendChild(el)
    el.scrollIntoView({behavior: "smooth"})
  }
  input(message:string, callback: (answer: string) => void) {
    let el = util.genElement("input", {textContent: message})
    this.target.appendChild(el)
    el.scrollIntoView({behavior: "smooth"})
    let input = el.querySelector("input")
    input.focus()
    input.classList.add("isFocused")
    el.addEventListener("submit", e => {
      e.preventDefault()
      input.disabled = true
      input.classList.remove("isFocused")
      let val = input.value
      if(!val || /\s/.test(val)){this.input(message, callback); return}
      callback(val)
    })
  }
  //! ------------------------------------------------------------

  //! DIRECTORY/FILE SYSTEM
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
    el.addEventListener("submit", async e => {
      e.preventDefault()
      input.disabled = true
      input.classList.remove("isFocused")
      let val = input.value
      if(this.#_privateVars.commands.length) {
        let [command, args, flags] = util.commandProcessor(val)
        let desiredCommand = this.#_privateVars.commands.find(com => com.answer === command)
        if(desiredCommand) {
          let doCmd = await desiredCommand.action(args, flags, this._createEventUtil)
          if (doCmd) this.cmd(pre)
        }
        else if (val.match(/^\s*$/g)) {
          this.cmd(pre)
          // return;
        }
        else {
          this.print("this command doesn't exist!", "error")
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
    this.#_privateVars.tree = path
    this.#_privateVars.treeArr = util.pathGen(path)
  }
  setPath(path: string | string[]) {
    let newPath = Array.isArray(path) ? path : util.pathReader(path)
    let desiredPath = this.#_privateVars.treeArr.find(arr => util.compareArrayByIndex(arr as InfiniteArray<string>, newPath))
    if(desiredPath) {
      this.#_privateVars.currentDir = desiredPath as string[]
    } else throw Error("a directory that was inserted doesn't exist in tree")
  }
  addFileActions(fileActions: FileAction | []) {
    if(Array.isArray(fileActions)) fileActions.forEach(fileAct => this.#_privateVars.fileActions.push(fileAct))
    else this.#_privateVars.fileActions.push(fileActions)
  }
  private get prefix() {
    return `${this.#_privateVars.currentDir[0]}:/${this.#_privateVars.currentDir.slice(1).join("/") }`
  }
  //! ------------------------------------------------------------

  //! CUSTOM COMMANDS [BUILT-IN + EXTERNAL]
  enableDefaultCommands() {
    if(this.#_privateVars.defaultCommandsEnabled) return;
    else {
      let commands: CommandsInterface[] = [
        {
          answer: "CMDtest",
          action: (args, flags, helper) => {
            console.log(args)
            console.log(flags)
            return true
          }
        }, {
          answer: "clear",
          description: "clears the console",
          action: () => {
            this.target.innerHTML = ``
            return true
          }
        }, {
          answer: "ls",
          description: "displays all current files/folders in directory",
          action: () => {
            let dir = util.findPathObjByPathArr(this.#_privateVars.tree, this.#_privateVars.currentDir)
            this.print(Object.keys(dir).map(subdir => typeof dir[subdir] === "object" ? `${subdir}(folder)` : dir[subdir]).join("   "))
            return true
          }
        }, {
          answer: "cd",
          description: "allows for movement in directory tree",
          action: (args) => {
            if(!args[0]) {this.print("no arguments given"); return true}
            let goUps = util.pathReader(args[0])
            goUps = goUps.filter(dir => {
              if (dir === "..") {
                if (this.#_privateVars.currentDir.length > 1) this.#_privateVars.currentDir.pop()
                return false
              } return true
            })
            let newDir = [...this.#_privateVars.currentDir, ...goUps]
            if (this.#_privateVars.treeArr.find(arr => util.compareArrayByIndex(arr as InfiniteArray<string>, newDir))) {
              let newDirObj = util.findPathObjByPathArr(this.#_privateVars.tree, newDir)
              if(typeof newDirObj === "object") this.setPath(newDir)
              else this.print("this is a file !")
            } else this.print("this path is invalid !")
            return true
          }
        },
        {
          answer: "open",
          description: "opens a file in the current directory",
          action: async(args: string[]) => {
            if(!args[0]) {this.print("no arguments given"); return true}
            let fileDir = [...this.#_privateVars.currentDir, ...util.pathReader(args[0])]
            if (this.#_privateVars.treeArr.find(arr => util.compareArrayByIndex(arr as InfiniteArray<string>, fileDir))) {
              let auth = this.auth({user: this._currentUser, command: "open", directory: fileDir})
              if(auth.authCommand && auth.authDir) {
                let fileAction = this.#_privateVars.fileActions.find(act => act.file === args[0])
                if (fileAction) {
                  let returnToCmd = false
                  returnToCmd = await fileAction.action(args.slice[1], this._createEventUtil)
                  return returnToCmd
                } else {this.print("this file is corrupted", "error"); return true}
              } else {
                if(!auth.authCommand) {this.print("you don't have access to this command", "error"); return true}
                if(!auth.authDir) {this.print("you don't have access to this file", "error"); return true}
              }
            
            } else { this.print("this file doesn't exist", "error"); return true }
          }
        }, {
          answer: "help",
          description: "shows this list",
          action: () => {
            let longestLength = this.#_privateVars.commands.reduce((prev, current) => 
              prev.answer.length >= current.answer.length ? prev : current 
            ).answer.length
            this.#_privateVars.commands.forEach(command => {
              this.print(`${command.answer}${command.description ? `:${"&nbsp;".repeat(longestLength - command.answer.length + 1)}${command.description}` : ""}`)
            })
            return true
          }
        }, {
          answer: "login",
          action: (l, m, helper) => {
            let loginSequence = () => {
              this.input("enter username: ", (username) => {
                this.input("enter password: ", async (password) => {
                  let user = this.#_privateVars.users.find(user => user.username === username)
                  if (user && user.password === util.encryptor("encrypt", password)) {
                    this.print(`logged in as ${username}`)
                    this._currentUser = user
                    await helper.sleep(1000)
                    this.cmd(">")
                  } else {
                    this.print("username or don't match")
                    await helper.sleep(1000)
                    loginSequence()
                  }
                })
              })
            }
            loginSequence()
            return false
          }
        }, {
          answer: "logout",
          action: async(args, helper) => {
            if(!this._currentUser) {
              this.print("no user is logged in")
              return true
            }
            this._currentUser = undefined
            this.print("logged out successfuly")
            await helper.sleep(1000)
            return true
          }
        }, {
          answer: "session",
          action: () => {
            let status = this._currentUser ? this._currentUser.username : false
            this.print(`status: ${!status ? "not" : ""} logged in`)
            if(status) this.print(`user logged in: ${status}`)

            return true
          }
        }
      ]
      this.#_privateVars.commands = [...this.#_privateVars.commands, ...commands]
      this.defaultCommands = commands.map(com => com.answer)
    }
  }
  addCommand(command: CommandsInterface | CommandsInterface[]) {
    if (Array.isArray(command)) this.#_privateVars.commands = [...this.#_privateVars.commands, ...command]
    else this.#_privateVars.commands = [...this.#_privateVars.commands, command]
  }
  //! ------------------------------------------------------------

  //! USERS SYSTEM
  addUser(newUser: User) {
    if(!newUser.auth) newUser.auth = {commands: [], dirs: []}
    newUser.password = util.encryptor("encrypt", newUser.password)
    this.#_privateVars.users.push(newUser)
  }
  auth(data: authParams): {authDir: boolean, authCommand: boolean} {
    let isAuth: ReturnType<typeof this.auth> = {authDir: false, authCommand: false}
    let {user, command, directory} = data
    if (typeof user === "string") user = this.#_privateVars.users.find(us => us.username === user) || this._currentUser
    if(typeof directory === "string") directory = util.pathReader(directory)

    if(command) isAuth.authCommand = 
      this._defaultPermissions.commands.length ? !!this._defaultPermissions.commands.find(command => command === command) : user ? !!user.auth.commands.find(command => command === command) : false
    if(directory) isAuth.authDir = 
      this._defaultPermissions.dirs.length ? !!this._defaultPermissions.dirs.find(dir => util.compareArrayByIndex(util.pathReader(dir), directory as string[])): user ? !!user.auth.dirs.find(dir => util.compareArrayByIndex(util.pathReader(dir), directory as string[])) : false

    return isAuth
  }
  setCurrentUser(user: string) {
    let desiredUser = this.#_privateVars.users.find(us => us.username === user)
    this._currentUser = desiredUser
  }
  //! ------------------------------------------------------------

  //! MISC
  reset(full?: boolean) {
    this.target.innerHTML = ``
    if(full) {
      this.#_privateVars = {
        tree: {},
        treeArr: [],
        currentDir: [],
        defaultCommandsEnabled: false,
        fileActions: [],
        users: [],
        commands: []
      }
      this._events = {}
      this._currentUser = {} as User
      this._defaultActions = []
      this._defaultPermissions = {}
    }
  }
  execute(str: string) {
    let [command, args, flags] = util.commandProcessor(str)
    let desiredCommand = this.#_privateVars.commands.find(pred => pred.answer === command)
    desiredCommand ? desiredCommand.action(args, flags, this._createEventUtil) :
    console.error(`command ${command} doesn't exist!`)
  }
}

