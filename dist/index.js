import { util } from "./util.js";
export default class Terminal {
    constructor(props) {
        this._createEventUtil = {
            sleep: util.sleep
        };
        this._privateVars = {
            tree: {},
            treeArr: [],
            currentDir: [],
            defaultCommandsEnabled: false,
            fileActions: []
        };
        this._commands = [];
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
        el.addEventListener("submit", e => {
            e.preventDefault();
            input.disabled = true;
            input.classList.remove("isFocused");
            let val = input.value;
            if (this._commands.length) {
                let command = val.split(/(\s+)/g)[0];
                let args = val.split(/\s+/g).slice(1);
                let desiredCommand = this._commands.find(com => com.answer === command);
                if (desiredCommand) {
                    let doCmd = desiredCommand.action(args);
                    if (doCmd)
                        this.cmd(pre);
                }
                else if (val.match(/^\s*$/g)) {
                    this.cmd(pre);
                    return;
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
        this._privateVars.tree = path;
        this._privateVars.treeArr = util.pathGen(path);
    }
    setPath(path) {
        let newPath = Array.isArray(path) ? path : util.pathReader(path);
        let desiredPath = this._privateVars.treeArr.find(arr => util.compareArrayByIndex(arr, newPath));
        if (desiredPath) {
            this._privateVars.currentDir = desiredPath;
        }
        else
            throw Error("a directory that was inserted doesn't exist in tree");
    }
    addFileActions(fileActions) {
        if (Array.isArray(fileActions))
            fileActions.forEach(fileAct => this._privateVars.fileActions.push(fileAct));
        else
            this._privateVars.fileActions.push(fileActions);
    }
    get prefix() {
        return `${this._privateVars.currentDir[0]}:/${this._privateVars.currentDir.slice(1).join("/")}`;
    }
    enableDefaultCommands() {
        if (this._privateVars.defaultCommandsEnabled)
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
                    action: () => {
                        this.target.innerHTML = ``;
                        return true;
                    }
                }, {
                    answer: "ls",
                    action: () => {
                        let dir = util.findPathObjByPathArr(this._privateVars.tree, this._privateVars.currentDir);
                        this.print(Object.keys(dir).map(subdir => typeof dir[subdir] === "object" ? `${subdir}(folder)` : dir[subdir]).join("   "));
                        return true;
                    }
                }, {
                    answer: "cd",
                    action: (args) => {
                        let goUps = util.pathReader(args[0]);
                        goUps = goUps.filter(dir => {
                            if (dir === "..") {
                                console.log("bruh");
                                if (this._privateVars.currentDir.length > 1)
                                    this._privateVars.currentDir.pop();
                                return false;
                            }
                            else
                                return true;
                        });
                        let newDir = [...this._privateVars.currentDir, ...goUps];
                        if (this._privateVars.treeArr.find(arr => util.compareArrayByIndex(arr, newDir))) {
                            let newDirObj = util.findPathObjByPathArr(this._privateVars.tree, newDir);
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
                    "answer": "open",
                    action: (args) => {
                        let fileDir = [...this._privateVars.currentDir, ...util.pathReader(args[0])];
                        if (this._privateVars.treeArr.find(arr => util.compareArrayByIndex(arr, fileDir))) {
                            let thisDir = util.findPathObjByPathArr(this._privateVars.tree, this._privateVars.currentDir);
                            let fileFound = false;
                            Object.keys(thisDir).forEach(fileKey => {
                                if (thisDir[fileKey] === args[0])
                                    fileFound = true;
                            });
                            if (fileFound) {
                                let fileAction = this._privateVars.fileActions.find(act => act.file === args[0]);
                                if (fileAction) {
                                    let returnToCmd = false;
                                    returnToCmd = fileAction.action(args.slice(1)) || false;
                                    return returnToCmd;
                                }
                                else
                                    this.print("this file is locked");
                            }
                            else
                                this.print("file not found or is a directory. Consider using \"cd\" if it exists");
                        }
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
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBRUEsT0FBTyxFQUFFLElBQUksRUFBRSxNQUFNLFdBQVcsQ0FBQTtBQUVoQyxNQUFNLENBQUMsT0FBTyxPQUFPLFFBQVE7SUFzQjNCLFlBQVksS0FBd0I7UUFuQjVCLHFCQUFnQixHQUFHO1lBQ3pCLEtBQUssRUFBRSxJQUFJLENBQUMsS0FBSztTQUNsQixDQUFBO1FBQ08saUJBQVksR0FBRztZQUNyQixJQUFJLEVBQUUsRUFBVTtZQUNoQixPQUFPLEVBQUUsRUFBMkI7WUFDcEMsVUFBVSxFQUFFLEVBQWM7WUFDMUIsc0JBQXNCLEVBQUUsS0FBSztZQUM3QixXQUFXLEVBQUUsRUFBa0I7U0FDaEMsQ0FBQTtRQUNPLGNBQVMsR0FBc0IsRUFBRSxDQUFBO1FBQ2pDLFlBQU8sR0FBb0I7WUFDakMsT0FBTyxFQUFFO2dCQUNQLE9BQU8sRUFBRSxDQUFDO2dCQUNWLE9BQU8sRUFBRSxFQUFFO2FBQ1o7U0FDRixDQUFBO1FBQ08sb0JBQWUsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDLE9BQU8sQ0FBQTtRQUd2RCxJQUFJLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQyxNQUFNLENBQUE7UUFDMUIsSUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFBO1FBQ3BCLElBQUksS0FBSyxDQUFDLEtBQUs7WUFBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQTRCLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQTtJQUMxRSxDQUFDO0lBQ08sb0JBQW9CLENBQUMsS0FBa0M7UUFDN0QsSUFBSSxLQUFLLElBQUksS0FBSyxDQUFDLE9BQU87WUFBRSxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUE7SUFDaEQsQ0FBQztJQUNPLGFBQWE7UUFDbkIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxhQUFhLENBQUMsc0JBQXNC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