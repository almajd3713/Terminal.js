var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { util } from "./util.js";
class Terminal {
    constructor(props) {
        this.createEventUtil = {
            sleep: util.sleep,
        };
        this._privateVars = {};
        this._events = util.objectListener({
            default: {
                is: true,
                actions: []
            }
        }, (event) => this._eventTriggerHandler(event));
        this._defaultActions = this._events.default.actions;
        this.target = props.target;
        this._defaultStyle();
        if (props.style)
            this.target.style = props.style;
    }
    _eventTriggerHandler(event) {
        console.log(event);
    }
    _defaultStyle() {
        if (!document.querySelector("[data-terminal-style"))
            document.querySelector("head").appendChild(util.defaultStyleGen());
    }
    createEvent(when, action) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this._events[when])
                this._events[when] = {
                    is: false,
                    actions: []
                };
            this._events[when].actions.push(() => __awaiter(this, void 0, void 0, function* () {
                yield action(this.createEventUtil);
            }));
        });
    }
    trigger(event) {
        if (this._events[event])
            this._events[event].is = true;
    }
    start() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._defaultActions.length)
                this._defaultActions.forEach(action => action(this.createEventUtil));
        });
    }
}
let terminal = new Terminal({
    target: document.getElementById("root")
});
terminal.createEvent("bruh", (helper) => {
    console.log("aye");
    helper.sleep(1500);
    console.log("Aloo");
});
terminal.trigger("bruh");
window.terminal = terminal;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQ0EsT0FBTyxFQUFFLElBQUksRUFBRSxNQUFNLFdBQVcsQ0FBQTtBQUdoQyxNQUFNLFFBQVE7SUFjWixZQUFZLEtBQXdCO1FBYnBDLG9CQUFlLEdBQUc7WUFDaEIsS0FBSyxFQUFFLElBQUksQ0FBQyxLQUFLO1NBQ2xCLENBQUE7UUFDTyxpQkFBWSxHQUFHLEVBQ3RCLENBQUE7UUFDTyxZQUFPLEdBQW9CLElBQUksQ0FBQyxjQUFjLENBQUM7WUFDckQsT0FBTyxFQUFFO2dCQUNQLEVBQUUsRUFBRSxJQUFJO2dCQUNSLE9BQU8sRUFBRSxFQUFFO2FBQ1o7U0FDRixFQUFFLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxJQUFJLENBQUMsb0JBQW9CLENBQUMsS0FBSyxDQUFDLENBQW9CLENBQUE7UUFDMUQsb0JBQWUsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUE7UUFHcEQsSUFBSSxDQUFDLE1BQU0sR0FBRSxLQUFLLENBQUMsTUFBTSxDQUFBO1FBQ3pCLElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQTtRQUNwQixJQUFHLEtBQUssQ0FBQyxLQUFLO1lBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUE0QixHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUE7SUFDekUsQ0FBQztJQUNPLG9CQUFvQixDQUFDLEtBQWtDO1FBQzdELE9BQU8sQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUE7SUFDcEIsQ0FBQztJQUNPLGFBQWE7UUFDbkIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxhQUFhLENBQUMsc0JBQXNCLENBQUM7WUFBRSxRQUFRLENBQUMsYUFBYSxDQUFDLE1BQU0sQ0FBQyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsZUFBZSxFQUFFLENBQUMsQ0FBQTtJQUN6SCxDQUFDO0lBQ0ssV0FBVyxDQUFDLElBQVksRUFBRSxNQUFrRDs7WUFDaEYsSUFBRyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDO2dCQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEdBQUc7b0JBQzNDLEVBQUUsRUFBRSxLQUFLO29CQUNULE9BQU8sRUFBRSxFQUFFO2lCQUNaLENBQUE7WUFDRCxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsR0FBUyxFQUFFO2dCQUN6QyxNQUFNLE1BQU0sQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLENBQUE7WUFDcEMsQ0FBQyxDQUFBLENBQUMsQ0FBQTtRQUNKLENBQUM7S0FBQTtJQUNELE9BQU8sQ0FBQyxLQUFhO1FBQ25CLElBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUM7WUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsR0FBRyxJQUFJLENBQUE7SUFDdkQsQ0FBQztJQUNLLEtBQUs7O1lBQ1QsSUFBSSxJQUFJLENBQUMsZUFBZSxDQUFDLE1BQU07Z0JBQUUsSUFBSSxDQUFDLGVBQWUsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUE7UUFDdkcsQ0FBQztLQUFBO0NBQ0Y7QUFFRCxJQUFJLFFBQVEsR0FBRyxJQUFJLFFBQVEsQ0FBQztJQUMxQixNQUFNLEVBQUUsUUFBUSxDQUFDLGNBQWMsQ0FBQyxNQUFNLENBQUM7Q0FDeEMsQ0FBQyxDQUFBO0FBQ0YsUUFBUSxDQUFDLFdBQVcsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxNQUFNLEVBQUUsRUFBRTtJQUN0QyxPQUFPLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFBO0lBQ2xCLE1BQU0sQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUE7SUFDbEIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQTtBQUNyQixDQUFDLENBQUMsQ0FBQTtBQUVGLFFBQVEsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUE7QUFHeEIsTUFBTSxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUEifQ==