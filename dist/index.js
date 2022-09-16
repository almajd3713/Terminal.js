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
                let [command, args, flags] = util.commandProcessor(val);
                let desiredCommand = __classPrivateFieldGet(this, _Terminal__privateVars, "f").commands.find(com => com.answer === command);
                if (desiredCommand) {
                    let doCmd = await desiredCommand.action(args, flags, this._createEventUtil);
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
                    action: (args, flags, helper) => {
                        console.log(args);
                        console.log(flags);
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
                    action: (l, m, helper) => {
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
    execute(str) {
        let [command, args, flags] = util.commandProcessor(str);
        let desiredCommand = __classPrivateFieldGet(this, _Terminal__privateVars, "f").commands.find(pred => pred.answer === command);
        desiredCommand ? desiredCommand.action(args, flags, this._createEventUtil) :
            console.error(`command ${command} doesn't exist!`);
    }
}
_Terminal__privateVars = new WeakMap();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBRUEsT0FBTyxFQUFFLElBQUksRUFBRSxNQUFNLFdBQVcsQ0FBQTtBQUVoQyxNQUFNLENBQUMsT0FBTyxPQUFPLFFBQVE7SUE4QzNCLFlBQVksS0FBd0I7UUEzQzVCLHFCQUFnQixHQUFHO1lBQ3pCLEtBQUssRUFBRSxJQUFJLENBQUMsS0FBSztZQUNqQixXQUFXLEVBQUUsQ0FBQyxDQUFTLEVBQUUsTUFBZSxJQUFJLEVBQUUsRUFBRTtnQkFDOUMsSUFBRyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxJQUFJLEtBQUssQ0FBQyxDQUFDO29CQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFBOztvQkFDbkUsT0FBTyxDQUFDLEtBQUssQ0FBQyxZQUFZLENBQUMsZ0JBQWdCLENBQUMsQ0FBQTtZQUNuRCxDQUFDO1lBQ0QsU0FBUyxFQUFFLENBQUMsQ0FBb0IsRUFBRSxFQUFFLENBQ2xDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDdEQsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7U0FDaEIsQ0FBQTtRQUNELGlDQUFnQjtZQUNkLElBQUksRUFBRSxFQUFVO1lBQ2hCLE9BQU8sRUFBRSxFQUEyQjtZQUNwQyxVQUFVLEVBQUUsRUFBYztZQUMxQixzQkFBc0IsRUFBRSxLQUFLO1lBQzdCLFdBQVcsRUFBRSxFQUFrQjtZQUMvQixLQUFLLEVBQUUsRUFBWTtZQUNuQixRQUFRLEVB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