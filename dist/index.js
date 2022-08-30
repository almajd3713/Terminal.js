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
            defaultCommandsEnabled: false
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
        let newPath = util.pathReader(path);
        let desiredPath = this._privateVars.treeArr.find(arr => util.compareArrayByIndex(arr, newPath));
        if (desiredPath) {
            this._privateVars.currentDir = desiredPath;
        }
        else
            throw Error("a directory that was inserted doesn't exist in tree");
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBRUEsT0FBTyxFQUFFLElBQUksRUFBRSxNQUFNLFdBQVcsQ0FBQTtBQUVoQyxNQUFNLENBQUMsT0FBTyxPQUFPLFFBQVE7SUFxQjNCLFlBQVksS0FBd0I7UUFsQjVCLHFCQUFnQixHQUFHO1lBQ3pCLEtBQUssRUFBRSxJQUFJLENBQUMsS0FBSztTQUNsQixDQUFBO1FBQ08saUJBQVksR0FBRztZQUNyQixJQUFJLEVBQUUsRUFBVTtZQUNoQixPQUFPLEVBQUUsRUFBMkI7WUFDcEMsVUFBVSxFQUFFLEVBQWM7WUFDMUIsc0JBQXNCLEVBQUUsS0FBSztTQUM5QixDQUFBO1FBQ08sY0FBUyxHQUFzQixFQUFFLENBQUE7UUFDakMsWUFBTyxHQUFvQjtZQUNqQyxPQUFPLEVBQUU7Z0JBQ1AsT0FBTyxFQUFFLENBQUM7Z0JBQ1YsT0FBTyxFQUFFLEVBQUU7YUFDWjtTQUNGLENBQUE7UUFDTyxvQkFBZSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUMsT0FBTyxDQUFBO1FBR3ZELElBQUksQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQTtRQUMxQixJQUFJLENBQUMsYUFBYSxFQUFFLENBQUE7UUFDcEIsSUFBSSxLQUFLLENBQUMsS0FBSztZQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBNEIsR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFBO0lBQzFFLENBQUM7SUFDTyxvQkFBb0IsQ0FBQyxLQUFrQztRQUM3RCxJQUFJLEtBQUssSUFBSSxLQUFLLENBQUMsT0FBTztZQUFFLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQTtJQUNoRCxDQUFDO0lBQ08sYUFBYTtRQUNuQixJQUFJLENBQUMsUUFBUSxDQUFDLGFBQWEsQ0FBQyxzQkFBc0IsQ0FBQztZQUFFLFFBQVEsQ0FBQyxh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