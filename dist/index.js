  

class Terminal {
  constructor({
    target,
    color = "#13781D",
    backgroundColor = "black",
    padding = "1rem",
    fontSize = "2rem",
    fontFamily = "monospace"
  } = {}) {
    if(target) {this.target = target} else {console.clear(); console.error("ERR: no target container specified")}
    this.timerOrg = Date.now()
    this.timer = this.timerOrg
    this.calcTime = (timer) => {
      this.timer += timer; 
      return this.timer - this.timerOrg
    }
    this.users = []
    this.sessionInfo = {
      user: ""
    }

    this.promptFix = true
    this.userExist = false
    this.defaults = [
      ["clear", () => { this.target.innerHTML = ""; return true}, [false], true],
      ["login", () => {
        if (this.sessionInfo.user !== "") {
          this.userExist = true
          this.print({ text: `err: there is already a user in the session. please logout and then try again`, timer: 0 })
          this.prompt({ prefix: this.currentPromptInfo.prefix, def: this.currentPromptInfo.def, timer: this.currentPromptInfo.timer, commands: this.currentPromptInfo.commands, returnPrompt: this.currentPromptInfo.returnPrompt })
          return 0
        }
        this.auth({ callback: () => this.prompt({ prefix: this.currentPromptInfo.prefix, def: this.currentPromptInfo.def, timer: this.currentPromptInfo.timer, commands: this.currentPromptInfo.commands, returnPrompt: true }) })
      }, [false], this.userExist],
      ["logout", () => {
        if (this.sessionInfo.user === "") { this.print({ text: `err: there is no user logged in`, timer: 0 }) } else { this.sessionInfo.user = "" }
      }, [false], true],
      ["session", () => {
        if (this.sessionInfo.user !== "") {
          this.print({ text: `current user: ${this.sessionInfo.user}`, timer: 0 })
        } else {
          this.print({ text: "you are not logged in as any user, please login to access extended functionality", timer: 0 })
        }
      },[false], true],
      ["ls", (params) => {
        let str = ""
        if(params.length) {
          let path = this.readPath(params[0])
          if(!path) {this.print({text: `err: this directory doesn't exist`, timer: 0}); return true}
          else {
            path[0][path[0].length - 1].subs.forEach((sub) => {
              str += sub.value
              if (sub.subs.length) str += `(folder)`
              str += "   "
            })
            str = str.replace(" ", "\u00A0")
            this.print({ text: str, timer: 0 })
            return true
          }
        }
        else if(this.currentPath.subs.length) {
          this.currentPath.subs.forEach((sub) => {
            str += sub.value
            if(sub.subs.length) str += `(folder)`
            str += "   "
          })
          str = str.replace(" ", "\u00A0")
          this.print({text: str, timer: 0})
          return true
        } else {
          this.print({text: `there are no folders or files in this directorly...`, timer: 0})
          return true
        }
      }, [true, true], true],
      ["cd", (params) => {
        if(params[0].includes("..")) {
          let str = params[0]
          str = str.replaceAll("/", "")
          let levelsUp = (str.length / 2) + 1
          if (this.currentPath.path[this.currentPath.path.length - levelsUp]) {
           this.setPath(this.currentPath.path[this.currentPath.path.length - levelsUp].value); return true
          } else {
            this.print({text: `err: you are already in the root directory`, timer: 0})
            return true
          }
        } else {
          if(this.sessionInfo.user === "") {
            if(this.proPathNames.length) {
              if (Terminal.checkExist(this.proPathNames, params[0])) {
                let path = this.readPath(params[0])
                if(path[0][path[0].length - 1].subs.length) {
                  this.setPath(params[0])
                  return true
                } else {
                  this.print({text: `err: cannot access a directory that is a file`, timer: 0})
                  return true
                }
              } else if(Terminal.checkExist(this.pathNames, params[0])) {
                this.print({ text: `err: You do not have sufficient permission to access this directory or file`, timer: 0 })
                return true
              } else {
                this.print({ text: `err: this directory doesn't exist`, timer: 0 })
                return true
              }
            } else {
              this.print({ text: `err: this directory doesn't exist`, timer: 0 })
              return true
          }
        } else {
            let success = this.users.every((user) => {
              if(user.username === this.sessionInfo.user) {
                if(Terminal.checkExist(user.allowed.paths, params[0])) {
                  let path = this.readPath(params[0])
                  if (path[0][path[0].length - 1].subs.length) {
                    this.setPath(params[0])
                    return false
                  } else {
                    this.print({ text: `err: cannot access a directory that is a file`, timer: 0 })
                    return false
                  }
                } else {
                  if(Terminal.checkExist(this.pathNames, params[0])) {
                    this.print({ text: `err: You do not have sufficient permission to access this directory or file`, timer: 0 })
                    return false
                  } else {
                    this.print({ text: `err: this directory doesn't exist`, timer: 0 })
                    return false
                  }
                }
              }
              else return true
            })
            return !success
          }
        }
      }, [true], false],
      ["open", (params) => {
        if(params[0] === "execute1.py") this.promptFix = false
        if (this.sessionInfo.user === "") {
          if (this.proPathNames.length) {
            if (Terminal.checkExist(this.proPathNames, params[0])) {
              let path = this.readPath(params[0])
              if (path[0][path[0].length - 1].subs.length) {
                this.print({ text: `err: can't execute this command on a folder. make sure that it's a file`, timer: 0 })
                return true
              } else {
                let fileCommandExist = this.files.every((file) => {
                  if(file[0] === params[0]) {
                    file[1]()
                    return false
                  }
                  else return true
                })
                if (fileCommandExist) {
                  if (Terminal.checkExist(this.pathNames, params[0])) {
                    this.print({ text: `err: this file is locked and can't be viewed or launched`, timer: 0 })
                  } else {
                    this.print({ text: `err: this file doesn't exist`, timer: 0 })
                  }
                }
                return true
              }
            } else if (Terminal.checkExist(this.pathNames, params[0])) {
              this.print({ text: `err: You do not have sufficient permission to access this directory or file`, timer: 0 })
              return true
            } else {
              this.print({ text: `err: this directory doesn't exist`, timer: 0 })
              return true
            }
          } else {
            this.print({ text: `err: this directory doesn't exist`, timer: 0 })
            return true
          }
        } else {
          let success = this.users.every((user) => {
            if (user.username === this.sessionInfo.user) {
              if (Terminal.checkExist(user.allowed.paths, params[0])) {
                let path = this.readPath(params[0])
                if (path[0][path[0].length - 1].subs.length) {
                  this.print({ text: `err: can't execute this command on a folder. make sure that it's a file`, timer: 0 })
                  return false
                } else {
                  let fileCommandExist = this.files.every((file) => {
                    if (file[0] === params[0]) {
                      file[1]()
                      return false
                    }
                    else return true
                  })
                  if (fileCommandExist) {
                    if(Terminal.checkExist(this.pathNames, params[0])) {
                      this.print({ text: `err: this file is locked and can't be viewed or launched`, timer: 0})
                      return false
                    } else {
                      this.print({ text: `err: this file doesn't exist`, timer: 0})
                    }
                  }
                  return false
                }
              } else {
                if (Terminal.checkExist(this.pathNames, params[0])) {
                  this.print({ text: `err: You do not have sufficient permission to access this directory or file`, timer: 0 })
                  return false
                } else {
                  let fileCommandExist = this.files.every((file) => {
                    if (file[0] === params[0]) {
                      file[1]()
                      return false
                    }
                    else return true
                  })
                  if(fileCommandExist) {
                    if (Terminal.checkExist(this.pathNames, params[0])) {
                      this.print({ text: `err: this file is locked and can't be viewed or launched`, timer: 0 })
                      return false
                    } else {
                      this.print({ text: `err: this file doesn't exist`, timer: 0})
                      return false
                    }
                  }
                  return false
                }
              }
            }
            else return true
          })
          return !success
        }
      }, [true], this.promptFix]
    ]
    this.defaultNames = []
    for(let i = 0; i < this.defaults.length; i++) {
      this.defaultNames[i] = this.defaults[i][0]
    }

    this.files = [
      ["yee", () => {
        console.log(" YOU DID IT !  ")
      }]
    ]
    
    this.currentPromptInfo = {prefix: String(), timer: Number(), def: true, commands: Array(), returnPrompt: Boolean}

    this.pathNames = []
    this.proPathNames = []
    this.currentPath = {
      path: [],
      value: "",
      subs: []
    }
    document.querySelector("head").innerHTML += `
    <style bruh = "true">
      #container {
        width: calc(100% - ${padding});
        min-height: calc(100% - ${padding});
        padding: ${padding} 0 0 ${padding};
        color: ${color};
        background-color: ${backgroundColor};
        font-size: ${fontSize};
        font-family: ${fontFamily};
      }

      #container p, #container form {
        margin: 0;
        margin-bottom: 0.5rem
      }

      #container input {
        background-color: inherit;
        width: 50%;
        outline: none;
        border: none;
        font-size: inherit;
        color: inherit;
        font-family: inherit;
      }
    </style>
    `
    let bruh = 0
    document.querySelectorAll("style").forEach((style) => {
      if(style.hasAttribute("bruh")) {bruh += 1}
      if(bruh === 2) {style.remove(); bruh -= 1}
    })
      
    
  }

  reset() {
    this.target.innerHTML = ""
    return undefined
  }

  static createNode({
    tag,
    id,
    text,
    className,
    type,
    subNodes
  } = {}) {
    let node = document.createElement(tag)
    if (className) {node.className = className}
    if (id) {node.setAttribute("id", id)}
    if (text) {node.textContent = text}
    if (type) {node.type = type}
    if (subNodes) {
      let child = Terminal.createNode({
        tag: subNodes.tag, 
        id: subNodes.id, 
        className: subNodes.className, 
        text: subNodes.text,
        type: subNodes.type, 
        subNodes: subNodes.subNodes
      })
      node.appendChild(child)
    }
    return node
  }

  static createForm(prefix = ">") {
    let el = Terminal.createNode({
      tag: "form",
      subNodes: {
        tag: "p",
        text: prefix,
        subNodes: {
          tag: "input",
          type: "text"
        }
      }
    })
    return el
  }
  

  static submit(form, action) {
    form.addEventListener("keyup", (event) => {
      if (event.code === "Enter") {
        event.preventDefault()
      }
    })
    form.addEventListener("submit", (event) => {
      event.preventDefault()
      action()
    })
  }

  static params(inp) {
    inp = inp.split(" ")
    return new Object({
      command: inp[0],
      params: inp.slice(1)
    })
  }

  static checkExist(items, item) {
    let bruh = items.some((ite) => {
      if(item === ite) return true
      else return false
    })
    return bruh
  }

  static pathReturn(path) {
    if(!path.length) return false
    else {
      let str = ""
      path.forEach((pa) => str += `${pa.value}\\`)
      str = str.slice(0, -1)
      str = str.substring(0, 1).toUpperCase() + ":" + str.substring(1)
      return str
    }
  }

  static pathLoop(start, end, index, path) {
    if(start[index].value === end) {
      path.push({value: start[index].value, subs: start[index].subs})
    }
    else if(start[index].subs.length > 0) {
      path.push({value: start[index].value, subs: start[index].subs})
      start[index].subs.forEach((val, index, arr) => {
        Terminal.pathLoop(arr, end, index, path)
      })
      if(path[path.length - 1].value === start[index].value) path.pop()
    }
  }
  

  readPath(endValue, callback, def = true) {
    let path = []
    this.paths.forEach((val, index, arr) => Terminal.pathLoop(arr, endValue, index, path))
    let str = Terminal.pathReturn(path)
    if(!str) return false
    if(callback) callback(path, str)
    return [path, str]
  }

  setPath(value, def = false) {
    let path = this.readPath(value, false, true)
    if(!path) {this.print({text: `err: this directory doesn't exist`, timer: 0})} else {
      this.currentPath.path = path[0]
      this.currentPath.value = path[1]
      this.currentPath.valueRaw = path[0][path[0].length - 1].value
      this.currentPath.subs = path[0][path[0].length - 1].subs
    }
    if (def) this.prompt({ prefix: `${this.currentPath.value}> `, def: this.currentPromptInfo.def, timer: this.currentPromptInfo.timer, commands: this.currentPromptInfo.commands, returnPrompt: this.currentPromptInfo.returnPrompt })
  }

  addFileAction(fileAction) {
    fileAction.forEach((file) => {
      if (file.length === 2) {
        this.files.push(file)
      } else console.error("ERR: file/s action can be processed")
    })
  }

  setPathTree(path) {
    this.paths = path
    let iterator = (obj) => {
      if(typeof obj === "object") {
        for(let key in obj) {
          iterator(obj[key])
        }
      } else {
        this.pathNames.push(obj)
      }
    }
    iterator(path)
    this.users.forEach((user) => {
      user.allowed.paths = this.pathNames
    })
  }

  DefProPaths(paths) {
    this.users.forEach((user) => {
      user.allowed.paths = paths
    })
  }

  addProhibit(username, paths) {
    let userDontExist = this.users.every((user) => {
      if(username === "") {
        paths.forEach((path) => {
          this.proPathNames.push(path)
          return false
        })
      }
      else if(username === user.username) {
        paths.forEach((path) => {
          user.allowed.paths = user.allowed.paths.filter(item => item !== path)
        })
        return false
      }
      else return true
    })
    if (userDontExist) console.log(`err: ${username} doesn't exist in the database. be sure to add him first`)
  }

  addUsers(arr) {
    arr.forEach((userPass) => {
      let username = userPass[0]
      let password = btoa(userPass[1])
      let allowed = {
        commands: this.defaultNames,
        paths: this.pathNames
      }
      this.users.push({ username: username, password: password, allowed: allowed})
    })
  }
  

  userAllow(username, commands = []) {
    let userDontExist = this.users.every((user) => {
      if(username === "") {
        this.defaultNames = this.defaultNames.concat(commands)
      }
      else if (username === user.username) {
        user.allowed.commands = user.allowed.commands.concat(commands)
        return false
      } else return true
    })
    if(userDontExist) {console.error(`err: ${username} doesn't exist in the database. be sure to add him first`)}
  }


  static prohibitionCommand(userList, username, command, defau, defaultNames) {
    let prohibited = userList.every((user) => {
      if (username === "") {
        let defaul = defaultNames.every((name) => {
          if (command === name) { return false } else return true
        })
        return defaul
      } else if(user.username === username) {
        let found = user.allowed.commands.every((com) => {
          if(command === com) {return false}
          else return true
        })
        return found
      } 
      else return true
    })
    return prohibited
  }

  static prohibitionPath(userList, username, command, defProPath) {
    if (username === "") {
      let found = defProPath.some((path) => {
        if (command === path) return false
        else return true
      })
      return found
    } else {
      let prohibited = userList.every((user) => {
        if (user.username === username) {
          let found = user.allowed.paths.some((path) => {
            if (command === path) return false
            else return true
          })
          return found
        }  
      })
      return prohibited
    }
  }

  execute(commands, params, val, returnPrompt, defau, dev) {
    let done = false;
    let tempReturnPrompt = false;
    if(typeof(commands) === "string") {
      commands = [commands]
    }
    commands.every((command) => {
      if (val.command === command[0]) {
        if(dev) {command[1](params); return false}
        if (Terminal.prohibitionCommand(this.users, this.sessionInfo.user, command[0], defau, this.defaultNames)) {
          this.print({ text: `err: You do not have sufficient permission to use this command`, timer: 0 })
          done = true
          tempReturnPrompt = true
          return false
        }
        if(command[3]) tempReturnPrompt = true
        if (params.length > 0) {
          if (!command[2][0]) {
            this.print({ text: `error: this command doesn't accept any parameters`, timer: 0 })
            done = true
            tempReturnPrompt = true
            return false
          } else {
            if (!command[1](params)) {
              this.print({ text: `error: parameters are not recognized`, timer: 0 })
              done = true;
              tempReturnPrompt = true
              return false;
            } else {
              done = true
              return false
            }
          }
        } else {
          if (command[2][0] === true && command[2][1] === true) {
            command[1](params)
            done = true;
            tempReturnPrompt = true
            return false
          } else if (command[2][0] === true) {
            this.print({ text: `err: this command expects parameters but has none`, timer: 0 })
            done = true;
            tempReturnPrompt = true
            return false
          }
          else {
            let prompt = command[1]();
            if (prompt) { tempReturnPrompt = true } else {returnPrompt = false}
            done = true;
            return false;
          }
        }
      }
      else return true
    })
    return [done, returnPrompt, tempReturnPrompt]
  }

  print({text = "fill me !", timer = 1000} = {}) {
      let el = Terminal.createNode({ tag: "p", text: text })
      setTimeout(() => {
        this.target.appendChild(el)
    }, timer);
  }

  confirm({text = "fill me !", timer = 1000, aye = () => console.log("aye"), nay = () => console.log("nay")} = {}) {
    let el = Terminal.createForm(`${text} (Y/N)  `)
    Terminal.submit(el, () => {
      let inp = el.firstChild.children[0]
      inp.disabled = true;
      let val = inp.value.toLowerCase()
      if(val === "y" || val === "yes") {aye()}
      else if(val === "n" || val === "no") {nay()}
      else if(val.includes(" ", val.length - 1 )) {this.confirm({text: text, timer: 0, aye: aye, nay: nay})}
      else {
        this.print({text: `${val} isn't expected as input. either y/yes or n/no can be accepted`, timer: 0})
        this.confirm({text: text, timer: 0, aye: aye, nay: nay})
      }
    })
    setTimeout(() => {
      this.target.appendChild(el)
      el.firstChild.children[0].focus()
    }, timer);
  }

  question({text = "question? ", timer = 1000, callback = (arg) => console.log(arg)} = {}) {
    let el = Terminal.createForm(text)
    Terminal.submit(el, () => {
      let inp = el.firstChild.children[0]
      callback(inp.value)
    })
    setTimeout(() => {
      this.target.appendChild(el)
      el.firstChild.children[0].focus()
    }, timer);
  }

  auth({usernameText = "username: ", passwordText = "password: ", callback = () => console.log("ey")}) {
    let auth = false
    this.question({
      text: usernameText, timer: 0, callback: (username) => {
        if(username === "EXIT") callback()
        else {
          this.question({
            text: passwordText, timer: 0, callback: (password) => {
              if (password === "EXIT") callback()
              else {
                this.users.every(user => {
                  if (username === user.username && password === atob(user.password)) { auth = true; return false } else { return true }
                });
                if (auth) {
                  this.sessionInfo.user = username
                  this.execute(this.defaults, [], {command: "clear"}, true)
                  this.print({text: `you have successfully logged in as ${username}`, timer: 0})
                  callback()
                } else {
                  this.print({ text: `err: username or password were incorrect. please try again`, timer: 0 })
                  this.auth({usernameText: usernameText, passwordText: passwordText, callback: callback})
                }
              }
            }
          })
        }
      }
    })
  }

  prompt({prefix = `${this.currentPath.value}> `, def = false, timer = 1000, commands = [], returnPrompt = true} = {}) {
    this.currentPromptInfo = {
      prefix: prefix,
      def: def,
      timer: timer,
      commands: commands,
      returnPrompt: returnPrompt
    }
    let el = Terminal.createForm(prefix)
    let defau = []
    if(def) {
      commands = this.defaults.concat(commands)
      for (let i = 0; i < commands.length; i++) {
        defau[i] = commands[i][0]
      }
    }
    Terminal.submit(el, () => {
      let inp = el.firstChild.children[0]
      inp.disabled = true;
      let val = inp.value.toLowerCase()
      val = Terminal.params(val)
      let params = val.params
      let executed = this.execute(commands, params, val, returnPrompt, defau)
      let done = executed[0]
      returnPrompt = executed[1]
      let tempReturnPrompt = executed[2]
      if(!done) {
        if (val.command.includes(" ", val.commandlength - 1) || val === "") { 
          return false 
        }
        else {
          this.print({ text: `error: ${val.command} is not recognized as a command`, timer: 0 })
          tempReturnPrompt = true
        }
      }
      if(returnPrompt || tempReturnPrompt) {
        this.prompt({prefix: `${this.currentPath.value}> `, timer: 0, def: this.currentPromptInfo.def, commands: this.currentPromptInfo.commands, returnPrompt: this.currentPromptInfo.returnPrompt})
      }
    })
    setTimeout(() => {
      this.target.appendChild(el)
      el.firstChild.children[0].focus()
    }, timer);
  }
}
