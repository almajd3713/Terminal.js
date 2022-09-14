var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var _Terminal__privateVars;
import { util } from "./util.js";
export default class Terminal {
    constructor(props) {
        this._createEventUtil = {
            sleep: util.sleep,
            setVariable: (v, val = true) => {
                if (Object.keys(this._vars).find(pred => pred === v))
                    this._vars[v] = val;
                else
                    console.error(`variable ${v} doesn't exist`);
            },
            varIsTrue: (v) => Array.isArray(v) ? v.every(pred => this._vars[pred]) :
                this._vars[v]
        };
        _Terminal__privateVars.set(this, {
            tree: {},
            treeArr: [],
            currentDir: [],
            defaultCommandsEnabled: false,
            fileActions: [],
            users: [],
            commands: []
        });
        this._defaultPermissions = { commands: [], dirs: [] };
        this._vars = {};
        this._events = {
            default: {
                pointer: 0,
                actions: []
            }
        };
        this._defaultActions = this._events["default"].actions;
        this.target = props.target;
        this._defaultStyle();
        if (props.style)
            this.target.style = props.style;
        this.setPathTree({ C: "C" });
        this.setPath("C");
    }
    createVariables(v) {
        let obj = {};
        if (Array.isArray(v)) {
            v.forEach(va => obj[va] = false);
        }
        else
            obj[v] = false;
        Object.assign(this._vars, obj);
        console.log(this._vars);
    }
    set defaultPaths(perms) {
        this._defaultPermissions.dirs = [...this._defaultPermissions.dirs, ...perms];
    }
    set defaultCommands(perms) {
        this._defaultPermissions.commands = [...this._defaultPermissions.commands, ...perms];
    }
    _eventTriggerHandler(event) {
        if (event && event.actions)
            event.actions[0]();
    }
    _defaultStyle() {
        if (!document.querySelector("[data-terminal-style"))
            document.querySelector("head").appendChild(util.defaultStyleGen(this.target.id));
    }
    createEvents(when, action) {
        if (when.match(/\s/g) || !when.length)
            when = "default";
        if (!this._events[when])
            this._events[when] = {
                pointer: 0,
                actions: []
            };
        this._events[when].pointer += 1;
        let pointer = this._events[when].pointer;
        this._events[when].actions.push(() => {
            action(this._createEventUtil, this._events[when].actions[pointer]);
        });
    }
    trigger(event) {
        this._eventTriggerHandler(this._events[event]);
    }
    async start() {
        if (this._defaultActions)
            this._defaultActions[0]();
    }
    print(message, type) {
        let el = util.genElement("print", { textContent: message }, type);
        this.target.appendChild(el);
        el.scrollIntoView({ behavior: "smooth" });
    }
    input(message, callback) {
        let el = util.genElement("input", { textContent: message });
        this.target.appendChild(el);
        el.scrollIntoView({ behavior: "smooth" });
        let input = el.querySelector("input");
        input.focus();
        input.classList.add("isFocused");
        el.addEventListener("submit", e => {
            e.preventDefault();
            input.disabled = true;
            input.classList.remove("isFocused");
            let val = input.value;
            if (!val || /\s/.test(val)) {
                this.input(message, callback);
                return;
            }
            callback(val);
        });
    }
    cmd(pre) {
        if (!pre)
            pre = ">";
        let el = util.genElement("input", { textContent: `${this.prefix}${pre}` });
        this.target.appendChild(el);
        this._cmdListener(el, pre);
    }
    _cmdListener(el, pre) {
        let input = el.querySelector("input");
        input.focus();
        input.classList.add("isFocused");
        el.addEventListener("submit", async (e) => {
            e.preventDefault();
            input.disabled = true;
            input.classList.remove("isFocused");
            let val = input.value;
            if (__classPrivateFieldGet(this, _Terminal__privateVars, "f").commands.length) {
                let command = val.split(/(\s+)/g)[0];
                let args = val.split(/\s+/g).slice(1);
                let desiredCommand = __classPrivateFieldGet(this, _Terminal__privateVars, "f").commands.find(com => com.answer === command);
                if (desiredCommand) {
                    let doCmd = await desiredCommand.action(args, this._createEventUtil);
                    if (doCmd)
                        this.cmd(pre);
                }
                else if (val.match(/^\s*$/g)) {
                    this.cmd(pre);
                }
                else {
                    this.print("this command doesn't exist!", "error");
                    this.cmd(pre);
                }
            }
            else {
                this.print("no commands exist !");
                this.cmd(pre);
            }
        });
    }
    setPathTree(path) {
        __classPrivateFieldGet(this, _Terminal__privateVars, "f").tree = path;
        __classPrivateFieldGet(this, _Terminal__privateVars, "f").treeArr = util.pathGen(path);
    }
    setPath(path) {
        let newPath = Array.isArray(path) ? path : util.pathReader(path);
        let desiredPath = __classPrivateFieldGet(this, _Terminal__privateVars, "f").treeArr.find(arr => util.compareArrayByIndex(arr, newPath));
        if (desiredPath) {
            __classPrivateFieldGet(this, _Terminal__privateVars, "f").currentDir = desiredPath;
        }
        else
            throw Error("a directory that was inserted doesn't exist in tree");
    }
    addFileActions(fileActions) {
        if (Array.isArray(fileActions))
            fileActions.forEach(fileAct => __classPrivateFieldGet(this, _Terminal__privateVars, "f").fileActions.push(fileAct));
        else
            __classPrivateFieldGet(this, _Terminal__privateVars, "f").fileActions.push(fileActions);
    }
    get prefix() {
        return `${__classPrivateFieldGet(this, _Terminal__privateVars, "f").currentDir[0]}:/${__classPrivateFieldGet(this, _Terminal__privateVars, "f").currentDir.slice(1).join("/")}`;
    }
    enableDefaultCommands() {
        if (__classPrivateFieldGet(this, _Terminal__privateVars, "f").defaultCommandsEnabled)
            return;
        else {
            let commands = [
                {
                    answer: "CMDtest",
                    action: (args) => {
                        console.log(args);
                        return true;
                    }
                }, {
                    answer: "clear",
                    description: "clears the console",
                    action: () => {
                        this.target.innerHTML = ``;
                        return true;
                    }
                }, {
                    answer: "ls",
                    description: "displays all current files/folders in directory",
                    action: () => {
                        let dir = util.findPathObjByPathArr(__classPrivateFieldGet(this, _Terminal__privateVars, "f").tree, __classPrivateFieldGet(this, _Terminal__privateVars, "f").currentDir);
                        this.print(Object.keys(dir).map(subdir => typeof dir[subdir] === "object" ? `${subdir}(folder)` : dir[subdir]).join("   "));
                        return true;
                    }
                }, {
                    answer: "cd",
                    description: "allows for movement in directory tree",
                    action: (args) => {
                        if (!args[0]) {
                            this.print("no arguments given");
                            return true;
                        }
                        let goUps = util.pathReader(args[0]);
                        goUps = goUps.filter(dir => {
                            if (dir === "..") {
                                if (__classPrivateFieldGet(this, _Terminal__privateVars, "f").currentDir.length > 1)
                                    __classPrivateFieldGet(this, _Terminal__privateVars, "f").currentDir.pop();
                                return false;
                            }
                            return true;
                        });
                        let newDir = [...__classPrivateFieldGet(this, _Terminal__privateVars, "f").currentDir, ...goUps];
                        if (__classPrivateFieldGet(this, _Terminal__privateVars, "f").treeArr.find(arr => util.compareArrayByIndex(arr, newDir))) {
                            let newDirObj = util.findPathObjByPathArr(__classPrivateFieldGet(this, _Terminal__privateVars, "f").tree, newDir);
                            if (typeof newDirObj === "object")
                                this.setPath(newDir);
                            else
                                this.print("this is a file !");
                        }
                        else
                            this.print("this path is invalid !");
                        return true;
                    }
                },
                {
                    answer: "open",
                    description: "opens a file in the current directory",
                    action: async (args) => {
                        if (!args[0]) {
                            this.print("no arguments given");
                            return true;
                        }
                        let fileDir = [...__classPrivateFieldGet(this, _Terminal__privateVars, "f").currentDir, ...util.pathReader(args[0])];
                        if (__classPrivateFieldGet(this, _Terminal__privateVars, "f").treeArr.find(arr => util.compareArrayByIndex(arr, fileDir))) {
                            let auth = this.auth({ user: this._currentUser, command: "open", directory: fileDir });
                            if (auth.authCommand && auth.authDir) {
                                let fileAction = __classPrivateFieldGet(this, _Terminal__privateVars, "f").fileActions.find(act => act.file === args[0]);
                                if (fileAction) {
                                    let returnToCmd = false;
                                    returnToCmd = await fileAction.action(args.slice[1], this._createEventUtil);
                                    return returnToCmd;
                                }
                                else {
                                    this.print("this file is corrupted", "error");
                                    return true;
                                }
                            }
                            else {
                                if (!auth.authCommand) {
                                    this.print("you don't have access to this command", "error");
                                    return true;
                                }
                                if (!auth.authDir) {
                                    this.print("you don't have access to this file", "error");
                                    return true;
                                }
                            }
                        }
                        else {
                            this.print("this file doesn't exist", "error");
                            return true;
                        }
                    }
                }, {
                    answer: "help",
                    description: "shows this list",
                    action: () => {
                        let longestLength = __classPrivateFieldGet(this, _Terminal__privateVars, "f").commands.reduce((prev, current) => prev.answer.length >= current.answer.length ? prev : current).answer.length;
                        __classPrivateFieldGet(this, _Terminal__privateVars, "f").commands.forEach(command => {
                            this.print(`${command.answer}${command.description ? `:${"&nbsp;".repeat(longestLength - command.answer.length + 1)}${command.description}` : ""}`);
                        });
                        return true;
                    }
                }, {
                    answer: "login",
                    action: (args, helper) => {
                        let loginSequence = () => {
                            this.input("enter username: ", (username) => {
                                this.input("enter password: ", async (password) => {
                                    let user = __classPrivateFieldGet(this, _Terminal__privateVars, "f").users.find(user => user.username === username);
                                    if (user && user.password === util.encryptor("encrypt", password)) {
                                        this.print(`logged in as ${username}`);
                                        this._currentUser = user;
                                        await helper.sleep(1000);
                                        this.cmd(">");
                                    }
                                    else {
                                        this.print("username or don't match");
                                        await helper.sleep(1000);
                                        loginSequence();
                                    }
                                });
                            });
                        };
                        loginSequence();
                        return false;
                    }
                }, {
                    answer: "logout",
                    action: async (args, helper) => {
                        if (!this._currentUser) {
                            this.print("no user is logged in");
                            return true;
                        }
                        this._currentUser = undefined;
                        this.print("logged out successfuly");
                        await helper.sleep(1000);
                        return true;
                    }
                }, {
                    answer: "session",
                    action: () => {
                        let status = this._currentUser ? this._currentUser.username : false;
                        this.print(`status: ${!status ? "not" : ""} logged in`);
                        if (status)
                            this.print(`user logged in: ${status}`);
                        return true;
                    }
                }
            ];
            __classPrivateFieldGet(this, _Terminal__privateVars, "f").commands = [...__classPrivateFieldGet(this, _Terminal__privateVars, "f").commands, ...commands];
            this.defaultCommands = commands.map(com => com.answer);
        }
    }
    addCommand(command) {
        if (Array.isArray(command))
            __classPrivateFieldGet(this, _Terminal__privateVars, "f").commands = [...__classPrivateFieldGet(this, _Terminal__privateVars, "f").commands, ...command];
        else
            __classPrivateFieldGet(this, _Terminal__privateVars, "f").commands = [...__classPrivateFieldGet(this, _Terminal__privateVars, "f").commands, command];
    }
    addUser(newUser) {
        if (!newUser.auth)
            newUser.auth = { commands: [], dirs: [] };
        newUser.password = util.encryptor("encrypt", newUser.password);
        __classPrivateFieldGet(this, _Terminal__privateVars, "f").users.push(newUser);
    }
    auth(data) {
        let isAuth = { authDir: false, authCommand: false };
        let { user, command, directory } = data;
        if (typeof user === "string")
            user = __classPrivateFieldGet(this, _Terminal__privateVars, "f").users.find(us => us.username === user) || this._currentUser;
        if (typeof directory === "string")
            directory = util.pathReader(directory);
        if (command)
            isAuth.authCommand =
                this._defaultPermissions.commands.length ? !!this._defaultPermissions.commands.find(command => command === command) : user ? !!user.auth.commands.find(command => command === command) : false;
        if (directory)
            isAuth.authDir =
                this._defaultPermissions.dirs.length ? !!this._defaultPermissions.dirs.find(dir => util.compareArrayByIndex(util.pathReader(dir), directory)) : user ? !!user.auth.dirs.find(dir => util.compareArrayByIndex(util.pathReader(dir), directory)) : false;
        return isAuth;
    }
    setCurrentUser(user) {
        let desiredUser = __classPrivateFieldGet(this, _Terminal__privateVars, "f").users.find(us => us.username === user);
        this._currentUser = desiredUser;
    }
    reset(full) {
        this.target.innerHTML = ``;
        if (full) {
            __classPrivateFieldSet(this, _Terminal__privateVars, {
                tree: {},
                treeArr: [],
                currentDir: [],
                defaultCommandsEnabled: false,
                fileActions: [],
                users: [],
                commands: []
            }, "f");
            this._events = {};
            this._currentUser = {};
            this._defaultActions = [];
            this._defaultPermissions = {};
        }
    }
    execute(command, args) {
        let desiredCommand = __classPrivateFieldGet(this, _Terminal__privateVars, "f").commands.find(pred => pred.answer === command);
        desiredCommand ? desiredCommand.action(args, this._createEventUtil) :
            console.error(`command ${command} doesn't exist!`);
    }
}
_Terminal__privateVars = new WeakMap();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBRUEsT0FBTyxFQUFFLElBQUksRUFBRSxNQUFNLFdBQVcsQ0FBQTtBQUVoQyxNQUFNLENBQUMsT0FBTyxPQUFPLFFBQVE7SUErQzNCLFlBQVksS0FBd0I7UUE1QzVCLHFCQUFnQixHQUFHO1lBQ3pCLEtBQUssRUFBRSxJQUFJLENBQUMsS0FBSztZQUNqQixXQUFXLEVBQUUsQ0FBQyxDQUFTLEVBQUUsTUFBZSxJQUFJLEVBQUUsRUFBRTtnQkFDOUMsSUFBRyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxJQUFJLEtBQUssQ0FBQyxDQUFDO29CQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFBOztvQkFDbkUsT0FBTyxDQUFDLEtBQUssQ0FBQyxZQUFZLENBQUMsZ0JBQWdCLENBQUMsQ0FBQTtZQUNuRCxDQUFDO1lBQ0QsU0FBUyxFQUFFLENBQUMsQ0FBb0IsRUFBRSxFQUFFLENBQ2xDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDdEQsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7U0FDaEIsQ0FBQTtRQUNELGlDQUFnQjtZQUNkLElBQUksRUFBRSxFQUFVO1lBQ2hCLE9BQU8sRUFBRSxFQUEyQjtZQUNwQyxVQUFVLEVBQUUsRUFBYztZQUMxQixzQkFBc0IsRUFBRSxLQUFLO1lBQzdCLFdBQVcsRUFBRSxFQUFrQjtZQUMvQixLQUFLLEVBQUUsRUFBWTtZQUNuQixRQUFRLEVBQUUsRUFBeUI7U0FDcEMsRUFBQTtRQUNPLHdCQUFtQixHQUFpQixFQUFDLFFBQVEsRUFBRSxFQUFFLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBQyxDQUFBO1FBQzVELFVBQUssR0FBaUMsRUFBRSxDQUFBO1FBZ0J4QyxZQUFPLEdBQW9CO1lBQ2pDLE9BQU8sRUFBRTtnQkFDUCxPQUFPLEVBQUUsQ0FBQztnQkFDVixPQUFPLEVBQUUsRUFBRTthQUNaO1NBQ0YsQ0FBQTtRQUNPLG9CQUFlLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQyxPQUFPLENBQUE7UUFHdkQsSUFBSSxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFBO1FBQzFCLElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQTtRQUNwQixJQUFJLEtBQUssQ0FBQyxLQUFLO1lBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUE0QixHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUE7UUFDeEUsSUFBSSxDQUFDLFdBQVcsQ0FBQyxFQUFDLENBQUMsRUFBRSxHQUFHLEVBQUMsQ0FBQyxDQUFBO1FBQzFCLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUE7SUFDbkIsQ0FBQztJQTdCRCxlQUFlLENBQUMsQ0FBb0I7UUFDbEMsSUFBSSxHQUFHLEdBQUcsRUFBRSxDQUFBO1FBQ1osSUFBRyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFO1lBQ25CLENBQUMsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsS0FBSyxDQUFDLENBQUE7U0FDakM7O1lBQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQTtRQUNyQixNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsR0FBRyxDQUFDLENBQUE7UUFDOUIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUE7SUFDekIsQ0FBQztJQUNELElBQUksWUFBWSxDQUFDLEtBQWU7UUFDOUIsSUFBSSxDQUFDLG1CQUFtQixDQUFDLElBQUksR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDLG1CQUFtQixDQUFDLElBQUksRUFBRSxHQUFHLEtBQUssQ0FBQyxDQUFBO0lBQzlFLENBQUM7SUFDRCxJQUFJLGVBQWUsQ0FBQyxLQUFlO1FBQ2pDLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxRQUFRLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxRQUFRLEVBQUUsR0FBRyxLQUFLLENBQUMsQ0FBQTtJQUN0RixDQUFDO0lBaUJPLG9CQUFvQixDQUFDLEtBQWtDO1FBQzdELElBQUksS0FBSyxJQUFJLEtBQUssQ0FBQyxPQUFPO1lBQUUsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFBO0lBQ2hELENBQUM7SUFDTyxhQUFhO1FBQ25CLElBQUksQ0FBQyxRQUFRLENBQUMsYUFBYSxDQUFDLHNCQUFzQixDQUFDO1lBQUUsUUFBUSxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUE7SUFDdkksQ0FBQztJQUNELFlBQVksQ0FBQyxJQUFZLEVBQUUsTUFBb0U7UUFDN0YsSUFBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU07WUFBRSxJQUFJLEdBQUcsU0FBUyxDQUFBO1FBQ3RELElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQztZQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEdBQUc7Z0JBQzVDLE9BQU8sRUFBRSxDQUFDO2dCQUNWLE9BQU8sRUFBRSxFQUFFO2FBQ1osQ0FBQTtRQUNELElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsT0FBTyxJQUFJLENBQUMsQ0FBQTtRQUMvQixJQUFJLE9BQU8sR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLE9BQU8sQ0FBQTtRQUN4QyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFO1lBQ25DLE1BQU0sQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLEVBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFtQixDQUFDLENBQUE7UUFDdkYsQ0FBQyxDQUFDLENBQUE7SUFDSixDQUFDO0lBQ0QsT0FBTyxDQUFDLEtBQWE7UUFDbkIsSUFBSSxDQUFDLG9CQUFvQixDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQTtJQUNoRCxDQUFDO0lBQ0QsS0FBSyxDQUFDLEtBQUs7UUFDVCxJQUFJLElBQUksQ0FBQyxlQUFlO1lBQUUsSUFBSSxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFBO0lBQ3JELENBQUM7SUFJRCxLQUFLLENBQUMsT0FBYyxFQUFFLElBQW1CO1FBQ3ZDLElBQUksRUFBRSxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsT0FBTyxFQUFFLEVBQUMsV0FBVyxFQUFFLE9BQU8sRUFBQyxFQUFFLElBQUksQ0FBQyxDQUFBO1FBQy9ELElBQUksQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLEVBQUUsQ0FBQyxDQUFBO1FBQzNCLEVBQUUsQ0FBQyxjQUFjLENBQUMsRUFBQyxRQUFRLEVBQUUsUUFBUSxFQUFDLENBQUMsQ0FBQTtJQUN6QyxDQUFDO0lBQ0QsS0FBSyxDQUFDLE9BQWMsRUFBRSxRQUFrQztRQUN0RCxJQUFJLEVBQUUsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLE9BQU8sRUFBRSxFQUFDLFdBQVcsRUFBRSxPQUFPLEVBQUMsQ0FBQyxDQUFBO1FBQ3pELElBQUksQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLEVBQUUsQ0FBQyxDQUFBO1FBQzNCLEVBQUUsQ0FBQyxjQUFjLENBQUMsRUFBQyxRQUFRLEVBQUUsUUFBUSxFQUFDLENBQUMsQ0FBQTtRQUN2QyxJQUFJLEtBQUssR0FBRyxFQUFFLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxDQUFBO1FBQ3JDLEtBQUssQ0FBQyxLQUFLLEVBQUUsQ0FBQTtRQUNiLEtBQUssQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxDQUFBO1FBQ2hDLEVBQUUsQ0FBQyxnQkFBZ0IsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDLEVBQUU7WUFDaEMsQ0FBQyxDQUFDLGNBQWMsRUFBRSxDQUFBO1lBQ2xCLEtBQUssQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFBO1lBQ3JCLEtBQUssQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxDQUFBO1lBQ25DLElBQUksR0FBRyxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUE7WUFDckIsSUFBRyxDQUFDLEdBQUcsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFDO2dCQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxFQUFFLFFBQVEsQ0FBQyxDQUFDO2dCQUFDLE9BQU07YUFBQztZQUNqRSxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUE7UUFDZixDQUFDLENBQUMsQ0FBQTtJQUNKLENBQUM7SUFJRCxHQUFHLENBQUMsR0FBWTtRQUNkLElBQUcsQ0FBQyxHQUFHO1lBQUUsR0FBRyxHQUFHLEdBQUcsQ0FBQTtRQUNsQixJQUFJLEVBQUUsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLE9BQU8sRUFBRSxFQUFFLFdBQVcsRUFBRSxHQUFHLElBQUksQ0FBQyxNQUFNLEdBQUcsR0FBRyxFQUFFLEVBQUMsQ0FBQyxDQUFBO1FBQ3pFLElBQUksQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLEVBQUUsQ0FBQyxDQUFBO1FBQzNCLElBQUksQ0FBQyxZQUFZLENBQUMsRUFBcUIsRUFBRSxHQUFHLENBQUMsQ0FBQTtJQUMvQyxDQUFDO0lBQ08sWUFBWSxDQUFDLEVBQW1CLEVBQUUsR0FBVztRQUNuRCxJQUFJLEtBQUssR0FBRyxFQUFFLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxDQUFBO1FBQ3JDLEtBQUssQ0FBQyxLQUFLLEVBQUUsQ0FBQTtRQUNiLEtBQUssQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxDQUFBO1FBQ2hDLEVBQUUsQ0FBQyxnQkFBZ0IsQ0FBQyxRQUFRLEVBQUUsS0FBSyxFQUFDLENBQUMsRUFBQyxFQUFFO1lBQ3RDLENBQUMsQ0FBQyxjQUFjLEVBQUUsQ0FBQTtZQUNsQixLQUFLLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQTtZQUNyQixLQUFLLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsQ0FBQTtZQUNuQyxJQUFJLEdBQUcsR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFBO1lBQ3JCLElBQUcsdUJBQUEsSUFBSSw4QkFBYyxDQUFDLFFBQVEsQ0FBQyxNQUFNLEVBQUU7Z0JBQ3JDLElBQUksT0FBTyxHQUFHLEdBQUcsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUE7Z0JBQ3BDLElBQUksSUFBSSxHQUFHLEdBQUcsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFBO2dCQUNyQyxJQUFJLGNBQWMsR0FBRyx1QkFBQSxJQUFJLDhCQUFjLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxNQUFNLEtBQUssT0FBTyxDQUFDLENBQUE7Z0JBQ3BGLElBQUcsY0FBYyxFQUFFO29CQUNqQixJQUFJLEtBQUssR0FBRyxNQUFNLGNBQWMsQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFBO29CQUNwRSxJQUFJLEtBQUs7d0JBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQTtpQkFDekI7cUJBQ0ksSUFBSSxHQUFHLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxFQUFFO29CQUM1QixJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFBO2lCQUVkO3FCQUNJO29CQUNILElBQUksQ0FBQyxLQUFLLENBQUMsNkJBQTZCLEVBQUUsT0FBTyxDQUFDLENBQUE7b0JBQ2xELElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUE7aUJBQ2Q7YUFDRjtpQkFDSTtnQkFDSCxJQUFJLENBQUMsS0FBSyxDQUFDLHFCQUFxQixDQUFDLENBQUE7Z0JBQ2pDLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUE7YUFDZDtRQUNILENBQUMsQ0FBQyxDQUFBO0lBQ0osQ0FBQztJQUNELFdBQVcsQ0FBQyxJQUFVO1FBQ3BCLHVCQUFBLElBQUksOEJBQWMsQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFBO1FBQzlCLHVCQUFBLElBQUksOEJBQWMsQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQTtJQUNqRCxDQUFDO0lBQ0QsT0FBTyxDQUFDLElBQXVCO1FBQzdCLElBQUksT0FBTyxHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQTtRQUNoRSxJQUFJLFdBQVcsR0FBRyx1QkFBQSxJQUFJLDhCQUFjLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxHQUE0QixFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUE7UUFDekgsSUFBRyxXQUFXLEVBQUU7WUFDZCx1QkFBQSxJQUFJLDhCQUFjLENBQUMsVUFBVSxHQUFHLFdBQXVCLENBQUE7U0FDeEQ7O1lBQU0sTUFBTSxLQUFLLENBQUMscURBQXFELENBQUMsQ0FBQTtJQUMzRSxDQUFDO0lBQ0QsY0FBYyxDQUFDLFdBQTRCO1FBQ3pDLElBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUM7WUFBRSxXQUFXLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsdUJBQUEsSUFBSSw4QkFBYyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQTs7WUFDdEcsdUJBQUEsSUFBSSw4QkFBYyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUE7SUFDdkQsQ0FBQztJQUNELElBQVksTUFBTTtRQUNoQixPQUFPLEdBQUcsdUJBQUEsSUFBSSw4QkFBYyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsS0FBSyx1QkFBQSxJQUFJLDhCQUFjLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFFLEVBQUUsQ0FBQTtJQUNwRyxDQUFDO0lBSUQscUJBQXFCO1FBQ25CLElBQUcsdUJBQUEsSUFBSSw4QkFBYyxDQUFDLHNCQUFzQjtZQUFFLE9BQU87YUFDaEQ7WUFDSCxJQUFJLFFBQVEsR0FBd0I7Z0JBQ2xDO29CQUNFLE1BQU0sRUFBRSxTQUFTO29CQUNqQixNQUFNLEVBQUUsQ0FBQyxJQUFJLEVBQUUsRUFBRTt3QkFDZixPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFBO3dCQUNqQixPQUFPLElBQUksQ0FBQTtvQkFDYixDQUFDO2lCQUNGLEVBQUU7b0JBQ0QsTUFBTSxFQUFFLE9BQU87b0JBQ2YsV0FBVyxFQUFFLG9CQUFvQjtvQkFDakMsTUFBTSxFQUFFLEdBQUcsRUFBRTt3QkFDWCxJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsR0FBRyxFQUFFLENBQUE7d0JBQzFCLE9BQU8sSUFBSSxDQUFBO29CQUNiLENBQUM7aUJBQ0YsRUFBRTtvQkFDRCxNQUFNLEVBQUUsSUFBSTtvQkFDWixXQUFXLEVBQUUsaURBQWlEO29CQUM5RCxNQUFNLEVBQUUsR0FBRyxFQUFFO3dCQUNYLElBQUksR0FBRyxHQUFHLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyx1QkFBQSxJQUFJLDhCQUFjLENBQUMsSUFBSSxFQUFFLHVCQUFBLElBQUksOEJBQWMsQ0FBQyxVQUFVLENBQUMsQ0FBQTt3QkFDM0YsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLE9BQU8sR0FBRyxDQUFDLE1BQU0sQ0FBQyxLQUFLLFFBQVEsQ0FBQyxDQUFDLENBQUMsR0FBRyxNQUFNLFVBQVUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUE7d0JBQzNILE9BQU8sSUFBSSxDQUFBO29CQUNiLENBQUM7aUJBQ0YsRUFBRTtvQkFDRCxNQUFNLEVBQUUsSUFBSTtvQkFDWixXQUFXLEVBQUUsdUNBQXVDO29CQUNwRCxNQUFNLEVBQUUsQ0FBQyxJQUFJLEVBQUUsRUFBRTt3QkFDZixJQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFOzRCQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsb0JBQW9CLENBQUMsQ0FBQzs0QkFBQyxPQUFPLElBQUksQ0FBQTt5QkFBQzt3QkFDNUQsSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQTt3QkFDcEMsS0FBSyxHQUFHLEtBQUssQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLEVBQUU7NEJBQ3pCLElBQUksR0FBRyxLQUFLLElBQUksRUFBRTtnQ0FDaEIsSUFBSSx1QkFBQSxJQUFJLDhCQUFjLENBQUMsVUFBVSxDQUFDLE1BQU0sR0FBRyxDQUFDO29DQUFFLHVCQUFBLElBQUksOEJBQWMsQ0FBQyxVQUFVLENBQUMsR0FBRyxFQUFFLENBQUE7Z0NBQ2pGLE9BQU8sS0FBSyxDQUFBOzZCQUNiOzRCQUFDLE9BQU8sSUFBSSxDQUFBO3dCQUNmLENBQUMsQ0FBQyxDQUFBO3dCQUNGLElBQUksTUFBTSxHQUFHLENBQUMsR0FBRyx1QkFBQSxJQUFJLDhCQUFjLENBQUMsVUFBVSxFQUFFLEdBQUcsS0FBSyxDQUFDLENBQUE7d0JBQ3pELElBQUksdUJBQUEsSUFBSSw4QkFBYyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsbUJBQW1CLENBQUMsR0FBNEIsRUFBRSxNQUFNLENBQUMsQ0FBQyxFQUFFOzRCQUMxRyxJQUFJLFNBQVMsR0FBRyxJQUFJLENBQUMsb0JBQW9CLENBQUMsdUJBQUEsSUFBSSw4QkFBYyxDQUFDLElBQUksRUFBRSxNQUFNLENBQUMsQ0FBQTs0QkFDMUUsSUFBRyxPQUFPLFNBQVMsS0FBSyxRQUFRO2dDQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUE7O2dDQUNqRCxJQUFJLENBQUMsS0FBSyxDQUFDLGtCQUFrQixDQUFDLENBQUE7eUJBQ3BDOzs0QkFBTSxJQUFJLENBQUMsS0FBSyxDQUFDLHdCQUF3QixDQUFDLENBQUE7d0JBQzNDLE9BQU8sSUFBSSxDQUFBO29CQUNiLENBQUM7aUJBQ0Y7Z0JBQ0Q7b0JBQ0UsTUFBTSxFQUFFLE1BQU07b0JBQ2QsV0FBVyxFQUFFLHVDQUF1QztvQkFDcEQsTUFBTSxFQUFFLEtBQUssRUFBQyxJQUFjLEVBQUUsRUFBRTt3QkFDOUIsSUFBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRTs0QkFBQyxJQUFJLENBQUMsS0FBSyxDQUFDLG9CQUFvQixDQUFDLENBQUM7NEJBQUMsT0FBTyxJQUFJLENBQUE7eUJBQUM7d0JBQzVELElBQUksT0FBTyxHQUFHLENBQUMsR0FBRyx1QkFBQSxJQUFJLDhCQUFjLENBQUMsVUFBVSxFQUFFLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFBO3dCQUM3RSxJQUFJLHVCQUFBLElBQUksOEJBQWMsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLG1CQUFtQixDQUFDLEdBQTRCLEVBQUUsT0FBTyxDQUFDLENBQUMsRUFBRTs0QkFDM0csSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFDLElBQUksRUFBRSxJQUFJLENBQUMsWUFBWSxFQUFFLE9BQU8sRUFBRSxNQUFNLEVBQUUsU0FBUyxFQUFFLE9BQU8sRUFBQyxDQUFDLENBQUE7NEJBQ3BGLElBQUcsSUFBSSxDQUFDLFdBQVcsSUFBSSxJQUFJLENBQUMsT0FBTyxFQUFFO2dDQUNuQyxJQUFJLFVBQVUsR0FBRyx1QkFBQSxJQUFJLDhCQUFjLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxJQUFJLEtBQUssSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUE7Z0NBQ2pGLElBQUksVUFBVSxFQUFFO29DQUNkLElBQUksV0FBVyxHQUFHLEtBQUssQ0FBQTtvQ0FDdkIsV0FBVyxHQUFHLE1BQU0sVUFBVSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFBO29DQUMzRSxPQUFPLFdBQVcsQ0FBQTtpQ0FDbkI7cUNBQU07b0NBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyx3QkFBd0IsRUFBRSxPQUFPLENBQUMsQ0FBQztvQ0FBQyxPQUFPLElBQUksQ0FBQTtpQ0FBQzs2QkFDcEU7aUNBQU07Z0NBQ0wsSUFBRyxDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUU7b0NBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyx1Q0FBdUMsRUFBRSxPQUFPLENBQUMsQ0FBQztvQ0FBQyxPQUFPLElBQUksQ0FBQTtpQ0FBQztnQ0FDakcsSUFBRyxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUU7b0NBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxvQ0FBb0MsRUFBRSxPQUFPLENBQUMsQ0FBQztvQ0FBQyxPQUFPLElBQUksQ0FBQTtpQ0FBQzs2QkFDM0Y7eUJBRUY7NkJBQU07NEJBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyx5QkFBeUIsRUFBRSxPQUFPLENBQUMsQ0FBQzs0QkFBQyxPQUFPLElBQUksQ0FBQTt5QkFBRTtvQkFDeEUsQ0FBQztpQkFDRixFQUFFO29CQUNELE1BQU0sRUFBRSxNQUFNO29CQUNkLFdBQVcsRUFBRSxpQkFBaUI7b0JBQzlCLE1BQU0sRUFBRSxHQUFHLEVBQUU7d0JBQ1gsSUFBSSxhQUFhLEdBQUcsdUJBQUEsSUFBSSw4QkFBYyxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLEVBQUUsT0FBTyxFQUFFLEVBQUUsQ0FDdkUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLElBQUksT0FBTyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUM3RCxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUE7d0JBQ2YsdUJBQUEsSUFBSSw4QkFBYyxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLEVBQUU7NEJBQzVDLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxPQUFPLENBQUMsTUFBTSxHQUFHLE9BQU8sQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLElBQUksUUFBUSxDQUFDLE1BQU0sQ0FBQyxhQUFhLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLEdBQUcsT0FBTyxDQUFDLFdBQVcsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFBO3dCQUNySixDQUFDLENBQUMsQ0FBQTt3QkFDRixPQUFPLElBQUksQ0FBQTtvQkFDYixDQUFDO2lCQUNGLEVBQUU7b0JBQ0QsTUFBTSxFQUFFLE9BQU87b0JBQ2YsTUFBTSxFQUFFLENBQUMsSUFBSSxFQUFFLE1BQU0sRUFBRSxFQUFFO3dCQUN2QixJQUFJLGFBQWEsR0FBRyxHQUFHLEVBQUU7NEJBQ3ZCLElBQUksQ0FBQyxLQUFLLENBQUMsa0JBQWtCLEVBQUUsQ0FBQyxRQUFRLEVBQUUsRUFBRTtnQ0FDMUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxrQkFBa0IsRUFBRSxLQUFLLEVBQUUsUUFBUSxFQUFFLEVBQUU7b0NBQ2hELElBQUksSUFBSSxHQUFHLHVCQUFBLElBQUksOEJBQWMsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLFFBQVEsS0FBSyxRQUFRLENBQUMsQ0FBQTtvQ0FDNUUsSUFBSSxJQUFJLElBQUksSUFBSSxDQUFDLFFBQVEsS0FBSyxJQUFJLENBQUMsU0FBUyxDQUFDLFNBQVMsRUFBRSxRQUFRLENBQUMsRUFBRTt3Q0FDakUsSUFBSSxDQUFDLEtBQUssQ0FBQyxnQkFBZ0IsUUFBUSxFQUFFLENBQUMsQ0FBQTt3Q0FDdEMsSUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUE7d0NBQ3hCLE1BQU0sTUFBTSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQTt3Q0FDeEIsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQTtxQ0FDZDt5Q0FBTTt3Q0FDTCxJQUFJLENBQUMsS0FBSyxDQUFDLHlCQUF5QixDQUFDLENBQUE7d0NBQ3JDLE1BQU0sTUFBTSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQTt3Q0FDeEIsYUFBYSxFQUFFLENBQUE7cUNBQ2hCO2dDQUNILENBQUMsQ0FBQyxDQUFBOzRCQUNKLENBQUMsQ0FBQyxDQUFBO3dCQUNKLENBQUMsQ0FBQTt3QkFDRCxhQUFhLEVBQUUsQ0FBQTt3QkFDZixPQUFPLEtBQUssQ0FBQTtvQkFDZCxDQUFDO2lCQUNGLEVBQUU7b0JBQ0QsTUFBTSxFQUFFLFFBQVE7b0JBQ2hCLE1BQU0sRUFBRSxLQUFLLEVBQUMsSUFBSSxFQUFFLE1BQU0sRUFBRSxFQUFFO3dCQUM1QixJQUFHLENBQUMsSUFBSSxDQUFDLFlBQVksRUFBRTs0QkFDckIsSUFBSSxDQUFDLEtBQUssQ0FBQyxzQkFBc0IsQ0FBQyxDQUFBOzRCQUNsQyxPQUFPLElBQUksQ0FBQTt5QkFDWjt3QkFDRCxJQUFJLENBQUMsWUFBWSxHQUFHLFNBQVMsQ0FBQTt3QkFDN0IsSUFBSSxDQUFDLEtBQUssQ0FBQyx3QkFBd0IsQ0FBQyxDQUFBO3dCQUNwQyxNQUFNLE1BQU0sQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUE7d0JBQ3hCLE9BQU8sSUFBSSxDQUFBO29CQUNiLENBQUM7aUJBQ0YsRUFBRTtvQkFDRCxNQUFNLEVBQUUsU0FBUztvQkFDakIsTUFBTSxFQUFFLEdBQUcsRUFBRTt3QkFDWCxJQUFJLE1BQU0sR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFBO3dCQUNuRSxJQUFJLENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxZQUFZLENBQUMsQ0FBQTt3QkFDdkQsSUFBRyxNQUFNOzRCQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsbUJBQW1CLE1BQU0sRUFBRSxDQUFDLENBQUE7d0JBRWxELE9BQU8sSUFBSSxDQUFBO29CQUNiLENBQUM7aUJBQ0Y7YUFDRixDQUFBO1lBQ0QsdUJBQUEsSUFBSSw4QkFBYyxDQUFDLFFBQVEsR0FBRyxDQUFDLEdBQUcsdUJBQUEsSUFBSSw4QkFBYyxDQUFDLFFBQVEsRUFBRSxHQUFHLFFBQVEsQ0FBQyxDQUFBO1lBQzNFLElBQUksQ0FBQyxlQUFlLEdBQUcsUUFBUSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQTtTQUN2RDtJQUNILENBQUM7SUFDRCxVQUFVLENBQUMsT0FBZ0Q7UUFDekQsSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQztZQUFFLHVCQUFBLElBQUksOEJBQWMsQ0FBQyxRQUFRLEdBQUcsQ0FBQyxHQUFHLHVCQUFBLElBQUksOEJBQWMsQ0FBQyxRQUFRLEVBQUUsR0FBRyxPQUFPLENBQUMsQ0FBQTs7WUFDakcsdUJBQUEsSUFBSSw4QkFBYyxDQUFDLFFBQVEsR0FBRyxDQUFDLEdBQUcsdUJBQUEsSUFBSSw4QkFBYyxDQUFDLFFBQVEsRUFBRSxPQUFPLENBQUMsQ0FBQTtJQUM5RSxDQUFDO0lBSUQsT0FBTyxDQUFDLE9BQWE7UUFDbkIsSUFBRyxDQUFDLE9BQU8sQ0FBQyxJQUFJO1lBQUUsT0FBTyxDQUFDLElBQUksR0FBRyxFQUFDLFFBQVEsRUFBRSxFQUFFLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBQyxDQUFBO1FBQ3pELE9BQU8sQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxTQUFTLEVBQUUsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFBO1FBQzlELHVCQUFBLElBQUksOEJBQWMsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFBO0lBQ3hDLENBQUM7SUFDRCxJQUFJLENBQUMsSUFBZ0I7UUFDbkIsSUFBSSxNQUFNLEdBQWlDLEVBQUMsT0FBTyxFQUFFLEtBQUssRUFBRSxXQUFXLEVBQUUsS0FBSyxFQUFDLENBQUE7UUFDL0UsSUFBSSxFQUFDLElBQUksRUFBRSxPQUFPLEVBQUUsU0FBUyxFQUFDLEdBQUcsSUFBSSxDQUFBO1FBQ3JDLElBQUksT0FBTyxJQUFJLEtBQUssUUFBUTtZQUFFLElBQUksR0FBRyx1QkFBQSxJQUFJLDhCQUFjLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxRQUFRLEtBQUssSUFBSSxDQUFDLElBQUksSUFBSSxDQUFDLFlBQVksQ0FBQTtRQUNuSCxJQUFHLE9BQU8sU0FBUyxLQUFLLFFBQVE7WUFBRSxTQUFTLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxTQUFTLENBQUMsQ0FBQTtRQUV4RSxJQUFHLE9BQU87WUFBRSxNQUFNLENBQUMsV0FBVztnQkFDNUIsSUFBSSxDQUFDLG1CQUFtQixDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsbUJBQW1CLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLE9BQU8sS0FBSyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsT0FBTyxLQUFLLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUE7UUFDaE0sSUFBRyxTQUFTO1lBQUUsTUFBTSxDQUFDLE9BQU87Z0JBQzFCLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLG1CQUFtQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsbUJBQW1CLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsRUFBRSxTQUFxQixDQUFDLENBQUMsQ0FBQSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLG1CQUFtQixDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLEVBQUUsU0FBcUIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQTtRQUUvUSxPQUFPLE1BQU0sQ0FBQTtJQUNmLENBQUM7SUFDRCxjQUFjLENBQUMsSUFBWTtRQUN6QixJQUFJLFdBQVcsR0FBRyx1QkFBQSxJQUFJLDhCQUFjLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxRQUFRLEtBQUssSUFBSSxDQUFDLENBQUE7UUFDM0UsSUFBSSxDQUFDLFlBQVksR0FBRyxXQUFXLENBQUE7SUFDakMsQ0FBQztJQUlELEtBQUssQ0FBQyxJQUFjO1FBQ2xCLElBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxHQUFHLEVBQUUsQ0FBQTtRQUMxQixJQUFHLElBQUksRUFBRTtZQUNQLHVCQUFBLElBQUksMEJBQWlCO2dCQUNuQixJQUFJLEVBQUUsRUFBRTtnQkFDUixPQUFPLEVBQUUsRUFBRTtnQkFDWCxVQUFVLEVBQUUsRUFBRTtnQkFDZCxzQkFBc0IsRUFBRSxLQUFLO2dCQUM3QixXQUFXLEVBQUUsRUFBRTtnQkFDZixLQUFLLEVBQUUsRUFBRTtnQkFDVCxRQUFRLEVBQUUsRUFBRTthQUNiLE1BQUEsQ0FBQTtZQUNELElBQUksQ0FBQyxPQUFPLEdBQUcsRUFBRSxDQUFBO1lBQ2pCLElBQUksQ0FBQyxZQUFZLEdBQUcsRUFBVSxDQUFBO1lBQzlCLElBQUksQ0FBQyxlQUFlLEdBQUcsRUFBRSxDQUFBO1lBQ3pCLElBQUksQ0FBQyxtQkFBbUIsR0FBRyxFQUFFLENBQUE7U0FDOUI7SUFDSCxDQUFDO0lBQ0QsT0FBTyxDQUFDLE9BQWUsRUFBRSxJQUFlO1FBQ3RDLElBQUksY0FBYyxHQUFHLHVCQUFBLElBQUksOEJBQWMsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLE1BQU0sS0FBSyxPQUFPLENBQUMsQ0FBQTtRQUN0RixjQUFjLENBQUMsQ0FBQyxDQUFDLGNBQWMsQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUM7WUFDckUsT0FBTyxDQUFDLEtBQUssQ0FBQyxXQUFXLE9BQU8saUJBQWlCLENBQUMsQ0FBQTtJQUNwRCxDQUFDO0NBQ0YifQ==