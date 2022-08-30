import { util } from "./util.js";
export default class Terminal {
    constructor(props) {
        this._createEventUtil = {
            sleep: util.sleep
        };
        this._privateVars = {
            tree: {},
            treeArr: [],
            currentDir: []
        };
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
        el.addEventListener("submit", e => {
            e.preventDefault();
            input.disabled = true;
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
    cmd(commands, pre) {
        if (!pre)
            pre = ">";
        let el = util.genElement("input", { textContent: `${this.prefix}${pre}` });
        this.target.appendChild(el);
        this._cmdListener(el, commands, pre);
    }
    _cmdListener(el, commands, pre) {
        let input = el.querySelector("input");
        input.focus();
        el.addEventListener("submit", e => {
            e.preventDefault();
            input.disabled = true;
            let val = input.value;
            if (commands.length)
                commands.forEach(ans => {
                    let command = val.split("/")[0];
                    let args = val.split("/").shift();
                    if (command === ans.answer) {
                        if (ans.action)
                            ans.action(args);
                        else
                            console.log("No function is provided");
                    }
                    else if (val.match(/^\s*$/g)) {
                        this.cmd(commands, pre);
                    }
                    else {
                        this.print("this command doesn't exist!");
                        this.cmd(commands, pre);
                    }
                });
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
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBRUEsT0FBTyxFQUFFLElBQUksRUFBRSxNQUFNLFdBQVcsQ0FBQTtBQUVoQyxNQUFNLENBQUMsT0FBTyxPQUFPLFFBQVE7SUFtQjNCLFlBQVksS0FBd0I7UUFoQjVCLHFCQUFnQixHQUFHO1lBQ3pCLEtBQUssRUFBRSxJQUFJLENBQUMsS0FBSztTQUNsQixDQUFBO1FBQ08saUJBQVksR0FBRztZQUNyQixJQUFJLEVBQUUsRUFBVTtZQUNoQixPQUFPLEVBQUUsRUFBMkI7WUFDcEMsVUFBVSxFQUFFLEVBQWM7U0FDM0IsQ0FBQTtRQUNPLFlBQU8sR0FBb0I7WUFDakMsT0FBTyxFQUFFO2dCQUNQLE9BQU8sRUFBRSxDQUFDO2dCQUNWLE9BQU8sRUFBRSxFQUFFO2FBQ1o7U0FDRixDQUFBO1FBQ08sb0JBQWUsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDLE9BQU8sQ0FBQTtRQUd2RCxJQUFJLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQyxNQUFNLENBQUE7UUFDMUIsSUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFBO1FBQ3BCLElBQUksS0FBSyxDQUFDLEtBQUs7WUFBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQTRCLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQTtJQUMxRSxDQUFDO0lBQ08sb0JBQW9CLENBQUMsS0FBa0M7UUFDN0QsSUFBSSxLQUFLLElBQUksS0FBSyxDQUFDLE9BQU87WUFBRSxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUE7SUFDaEQsQ0FBQztJQUNPLGFBQWE7UUFDbkIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxhQUFhLENBQUMsc0JBQXNCLENBQUM7WUFBRSxRQUFRLENBQUMsYUFBYSxDQUFDLE1BQU0sQ0FBQyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQTtJQUN2SSxDQUFDO0lBQ0QsWUFBWSxDQUFDLElBQVksRUFBRSxNQUFvRTtRQUM3RixJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUM7WUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxHQUFHO2dCQUM1QyxPQUFPLEVBQUUsQ0FBQztnQkFDVixPQUFPLEVBQUUsRUFBRTthQUNaLENBQUE7UUFDRCxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLE9BQU8sSUFBSSxDQUFDLENBQUE7UUFDL0IsSUFBSSxPQUFPLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxPQUFPLENBQUE7UUFDeEMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRTtZQUNuQyxNQUFNLENBQUMsSUFBSSxDQUFDLGdCQUFnQixFQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBbUIsQ0FBQyxDQUFBO1FBQ3ZGLENBQUMsQ0FBQyxDQUFBO0lBQ0osQ0FBQztJQUNELE9BQU8sQ0FBQyxLQUFhO1FBQ25CLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUE7SUFDaEQsQ0FBQztJQUNELEtBQUssQ0FBQyxLQUFLO1FBQ1QsSUFBSSxJQUFJLENBQUMsZUFBZTtZQUFFLElBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQTtJQUNyRCxDQUFDO0lBSUQsS0FBSyxDQUFDLE9BQWM7UUFDbEIsSUFBSSxFQUFFLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxPQUFPLEVBQUUsRUFBQyxXQUFXLEVBQUUsT0FBTyxFQUFDLENBQUMsQ0FBQTtRQUN6RCxJQUFJLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxFQUFFLENBQUMsQ0FBQTtJQUM3QixDQUFDO0lBQ0QsS0FBSyxDQUFDLE9BQWMsRUFBRSxPQUEwQjtRQUM5QyxJQUFJLEVBQUUsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLE9BQU8sRUFBRSxFQUFDLFdBQVcsRUFBRSxPQUFPLEVBQUMsQ0FBQyxDQUFBO1FBQ3pELElBQUksQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLEVBQUUsQ0FBQyxDQUFBO1FBQzNCLElBQUksQ0FBQyxjQUFjLENBQUMsRUFBcUIsRUFBRSxPQUFPLENBQUMsQ0FBQTtJQUNyRCxDQUFDO0lBQ08sY0FBYyxDQUFDLEVBQW1CLEVBQUUsT0FBMEI7UUFDcEUsSUFBSSxLQUFLLEdBQUcsRUFBRSxDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsQ0FBQTtRQUNyQyxLQUFLLENBQUMsS0FBSyxFQUFFLENBQUE7UUFDYixFQUFFLENBQUMsZ0JBQWdCLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQyxFQUFFO1lBQ2hDLENBQUMsQ0FBQyxjQUFjLEVBQUUsQ0FBQTtZQUNsQixLQUFLLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQTtZQUNyQixJQUFHLE9BQU8sQ0FBQyxNQUFNO2dCQUFFLE9BQU8sQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEVBQUU7b0JBQ3ZDLElBQUksR0FBRyxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUE7b0JBQ3JCLElBQUcsR0FBRyxLQUFLLEdBQUcsQ0FBQyxNQUFNLEVBQUU7d0JBQ3JCLElBQUcsR0FBRyxDQUFDLE1BQU07NEJBQUUsR0FBRyxDQUFDLE1BQU0sRUFBRSxDQUFBOzs0QkFDdEIsT0FBTyxDQUFDLEdBQUcsQ0FBQyx5QkFBeUIsQ0FBQyxDQUFBO3FCQUM1Qzt5QkFDSSxJQUFHLEdBQUcsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLEVBQUU7d0JBQ3hCLElBQUksQ0FBQyxLQUFLLENBQUMsd0NBQXdDLENBQUMsQ0FBQTt3QkFDcEQsSUFBSSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsV0FBVyxFQUFFLE9BQU8sQ0FBQyxDQUFBO3FCQUNwQzt5QkFBTTt3QkFDTCxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxXQUFXLEVBQUUsT0FBTyxDQUFDLENBQUE7cUJBQ3BDO2dCQUNILENBQUMsQ0FBQyxDQUFBO1FBQ0osQ0FBQyxDQUFDLENBQUE7SUFDSixDQUFDO0lBSUQsR0FBRyxDQUFDLFFBQTJCLEVBQUUsR0FBWTtRQUMzQyxJQUFHLENBQUMsR0FBRztZQUFFLEdBQUcsR0FBRyxHQUFHLENBQUE7UUFDbEIsSUFBSSxFQUFFLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxPQUFPLEVBQUUsRUFBRSxXQUFXLEVBQUUsR0FBRyxJQUFJLENBQUMsTUFBTSxHQUFHLEdBQUcsRUFBRSxFQUFDLENBQUMsQ0FBQTtRQUN6RSxJQUFJLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxFQUFFLENBQUMsQ0FBQTtRQUMzQixJQUFJLENBQUMsWUFBWSxDQUFDLEVBQXFCLEVBQUUsUUFBUSxFQUFFLEdBQUcsQ0FBQyxDQUFBO0lBQ3pELENBQUM7SUFDTyxZQUFZLENBQUMsRUFBbUIsRUFBRSxRQUEyQixFQUFFLEdBQVc7UUFDaEYsSUFBSSxLQUFLLEdBQUcsRUFBRSxDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsQ0FBQTtRQUNyQyxLQUFLLENBQUMsS0FBSyxFQUFFLENBQUE7UUFDYixFQUFFLENBQUMsZ0JBQWdCLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQyxFQUFFO1lBQ2hDLENBQUMsQ0FBQyxjQUFjLEVBQUUsQ0FBQTtZQUNsQixLQUFLLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQTtZQUNyQixJQUFJLEdBQUcsR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFBO1lBQ3JCLElBQUksUUFBUSxDQUFDLE1BQU07Z0JBQUUsUUFBUSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsRUFBRTtvQkFDMUMsSUFBSSxPQUFPLEdBQUcsR0FBRyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQTtvQkFDL0IsSUFBSSxJQUFJLEdBQUcsR0FBRyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQTtvQkFDakMsSUFBSSxPQUFPLEtBQUssR0FBRyxDQUFDLE1BQU0sRUFBRTt3QkFDMUIsSUFBSSxHQUFHLENBQUMsTUFBTTs0QkFBRSxHQUFHLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFBOzs0QkFDM0IsT0FBTyxDQUFDLEdBQUcsQ0FBQyx5QkFBeUIsQ0FBQyxDQUFBO3FCQUM1Qzt5QkFDSSxJQUFJLEdBQUcsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLEVBQUU7d0JBQzVCLElBQUksQ0FBQyxHQUFHLENBQUMsUUFBUSxFQUFFLEdBQUcsQ0FBQyxDQUFBO3FCQUN4Qjt5QkFBTTt3QkFDTCxJQUFJLENBQUMsS0FBSyxDQUFDLDZCQUE2QixDQUFDLENBQUE7d0JBQ3pDLElBQUksQ0FBQyxHQUFHLENBQUMsUUFBUSxFQUFFLEdBQUcsQ0FBQyxDQUFBO3FCQUN4QjtnQkFDSCxDQUFDLENBQUMsQ0FBQTtRQUNKLENBQUMsQ0FBQyxDQUFBO0lBQ0osQ0FBQztJQUNELFdBQVcsQ0FBQyxJQUFVO1FBQ3BCLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQTtRQUM3QixJQUFJLENBQUMsWUFBWSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFBO0lBQ2hELENBQUM7SUFDRCxPQUFPLENBQUMsSUFBWTtRQUNsQixJQUFJLE9BQU8sR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFBO1FBQ25DLElBQUksV0FBVyxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxHQUE0QixFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUE7UUFDeEgsSUFBRyxXQUFXLEVBQUU7WUFDZCxJQUFJLENBQUMsWUFBWSxDQUFDLFVBQVUsR0FBRyxXQUF1QixDQUFBO1NBQ3ZEOztZQUFNLE1BQU0sS0FBSyxDQUFDLHFEQUFxRCxDQUFDLENBQUE7SUFDM0UsQ0FBQztJQUNELElBQVksTUFBTTtRQUNkLE9BQU8sR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsS0FBSyxJQUFJLENBQUMsWUFBWSxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBRSxFQUFFLENBQUE7SUFDcEcsQ0FBQztDQUVGIn0=