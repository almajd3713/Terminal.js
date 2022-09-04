var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
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
            users: []
        });
        this._commands = [];
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
    }
    input(message, answers) {
        let el = util.genElement("input", { textContent: message });
        this.target.appendChild(el);
        this._inputListener(el, answers);
    }
    _inputListener(el, answers) {
        let input = el.querySelector("input");
        input.focus();
        input.classList.add("isFocused");
        el.addEventListener("submit", e => {
            e.preventDefault();
            input.disabled = true;
            input.classList.remove("isFocused");
            if (answers.length)
                answers.forEach(ans => {
                    let val = input.value;
                    if (val === ans.answer) {
                        if (ans.action)
                            ans.action();
                        else
                            console.log("No function is provided");
                    }
                    else if (val.match(/\S/g)) {
                        this.print("prompt does not match expected answers");
                        this.input(el.textContent, answers);
                    }
                    else {
                        this.input(el.textContent, answers);
                    }
                });
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
            if (this._commands.length) {
                let command = val.split(/(\s+)/g)[0];
                let args = val.split(/\s+/g).slice(1);
                let desiredCommand = this._commands.find(com => com.answer === command);
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
                            this.print("you haven't inserted a path");
                            return true;
                        }
                        let goUps = util.pathReader(args[0]);
                        goUps = goUps.filter(dir => {
                            if (dir === "..") {
                                console.log("bruh");
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
                        let fileDir = [...__classPrivateFieldGet(this, _Terminal__privateVars, "f").currentDir, ...util.pathReader(args[0])];
                        if (__classPrivateFieldGet(this, _Terminal__privateVars, "f").treeArr.find(arr => util.compareArrayByIndex(arr, fileDir))) {
                            let thisDir = util.findPathObjByPathArr(__classPrivateFieldGet(this, _Terminal__privateVars, "f").tree, __classPrivateFieldGet(this, _Terminal__privateVars, "f").currentDir);
                            let fileFound;
                            Object.keys(thisDir).forEach(fileKey => {
                                if (thisDir[fileKey] === args[0])
                                    fileFound = true;
                            });
                            if (fileFound) {
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
                    }
                }, {
                    answer: "help",
                    description: "shows this list",
                    action: () => {
                        let longestLength = this._commands.reduce((prev, current) => prev.answer.length >= current.answer.length ? prev : current).answer.length;
                        this._commands.forEach(command => {
                            this.print(`${command.answer}${command.description ? `:${"&nbsp;".repeat(longestLength - command.answer.length + 1)}${command.description}` : ""}`);
                        });
                        return true;
                    }
                }
            ];
            this._commands = [...this._commands, ...commands];
        }
    }
    addCommand(command) {
        if (Array.isArray(command))
            this._commands = [...this._commands, ...command];
        else
            this._commands = [...this._commands, command];
    }
    addUser(newUser) {
        if (!newUser.auth)
            newUser.auth = { commands: [], dirs: [] };
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
            isAuth.authCommand = !!user.auth.commands.find(command => command === command);
        if (directory)
            isAuth.authDir = !!user.auth.dirs.find(dir => util.compareArrayByIndex(util.pathReader(dir), directory));
        return isAuth;
    }
    setCurrentUser(user) {
        let desiredUser = __classPrivateFieldGet(this, _Terminal__privateVars, "f").users.find(us => us.username === user);
        this._currentUser = desiredUser;
    }
}
_Terminal__privateVars = new WeakMap();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBRUEsT0FBTyxFQUFFLElBQUksRUFBRSxNQUFNLFdBQVcsQ0FBQTtBQUVoQyxNQUFNLENBQUMsT0FBTyxPQUFPLFFBQVE7SUF5QjNCLFlBQVksS0FBd0I7UUF0QjVCLHFCQUFnQixHQUFHO1lBQ3pCLEtBQUssRUFBRSxJQUFJLENBQUMsS0FBSztTQUNsQixDQUFBO1FBQ0QsaUNBQWdCO1lBQ2QsSUFBSSxFQUFFLEVBQVU7WUFDaEIsT0FBTyxFQUFFLEVBQTJCO1lBQ3BDLFVBQVUsRUFBRSxFQUFjO1lBQzFCLHNCQUFzQixFQUFFLEtBQUs7WUFDN0IsV0FBVyxFQUFFLEVBQWtCO1lBQy9CLEtBQUssRUFBRSxFQUFZO1NBQ3BCLEVBQUE7UUFDTyxjQUFTLEdBQXdCLEVBQUUsQ0FBQTtRQUNuQyx3QkFBbUIsR0FBaUIsRUFBQyxRQUFRLEVBQUUsRUFBRSxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUMsQ0FBQTtRQUU1RCxZQUFPLEdBQW9CO1lBQ2pDLE9BQU8sRUFBRTtnQkFDUCxPQUFPLEVBQUUsQ0FBQztnQkFDVixPQUFPLEVBQUUsRUFBRTthQUNaO1NBQ0YsQ0FBQTtRQUNPLG9CQUFlLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQyxPQUFPLENBQUE7UUFHdkQsSUFBSSxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFBO1FBQzFCLElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQTtRQUNwQixJQUFJLEtBQUssQ0FBQyxLQUFLO1lBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUE0QixHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUE7SUFDMUUsQ0FBQztJQUNPLG9CQUFvQixDQUFDLEtBQWtDO1FBQzdELElBQUksS0FBSyxJQUFJLEtBQUssQ0FBQyxPQUFPO1lBQUUsS0FBSyxDQUFDLE9B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