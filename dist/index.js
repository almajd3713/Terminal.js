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
            sleep: util.sleep
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
    print(message) {
        let el = util.genElement("print", { textContent: message });
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
                    this.print("this command doesn't exist!");
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
                                    this.print("this file is corrupted");
                                    return true;
                                }
                            }
                            else {
                                if (!auth.authCommand) {
                                    this.print("you don't have access to this command");
                                    return true;
                                }
                                if (!auth.authDir) {
                                    this.print("you don't have access to this file");
                                    return true;
                                }
                            }
                        }
                        else {
                            this.print("this file doesn't exist");
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
}
_Terminal__privateVars = new WeakMap();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBRUEsT0FBTyxFQUFFLElBQUksRUFBRSxNQUFNLFdBQVcsQ0FBQTtBQUVoQyxNQUFNLENBQUMsT0FBTyxPQUFPLFFBQVE7SUErQjNCLFlBQVksS0FBd0I7UUE1QjVCLHFCQUFnQixHQUFHO1lBQ3pCLEtBQUssRUFBRSxJQUFJLENBQUMsS0FBSztTQUNsQixDQUFBO1FBQ0QsaUNBQWdCO1lBQ2QsSUFBSSxFQUFFLEVBQVU7WUFDaEIsT0FBTyxFQUFFLEVBQTJCO1lBQ3BDLFVBQVUsRUFBRSxFQUFjO1lBQzFCLHNCQUFzQixFQUFFLEtBQUs7WUFDN0IsV0FBVyxFQUFFLEVBQWtCO1lBQy9CLEtBQUssRUFBRSxFQUFZO1lBQ25CLFFBQVEsRUFBRSxFQUF5QjtTQUNwQyxFQUFBO1FBQ08sd0JBQW1CLEdBQWlCLEVBQUMsUUFBUSxFQUFFLEVBQUUsRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFDLENBQUE7UUFRNUQsWUFBTyxHQUFvQjtZQUNqQyxPQUFPLEVBQUU7Z0JBQ1AsT0FBTyxFQUFFLENBQUM7Z0JBQ1YsT0FBTyxFQUFFLEVBQUU7YUFDWjtTQUNGLENBQUE7UUFDTyxvQkFBZSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUMsT0FBTyxDQUFBO1FBR3ZELElBQUksQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQTtRQUMxQixJQUFJLENBQUMsYUFBYSxFQUFFLENBQUE7UUFDcEIsSUFBSSxLQUFLLENBQUMsS0FBSztZQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBNEIsR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFBO0lBQzFFLENBQUM7SUFuQkQsSUFBSSxZQUFZLENBQUMsS0FBZTtRQUM5QixJQUFJLENBQUMsbUJBQW1CLENBQUMsSUFBSSxHQUFHLENBQUMsR0FBRyxJ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