var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
export const util = {
    createNode: (props) => {
        let node = document.createElement(props.tag || "div");
        if (props.className) {
            if (Array.isArray(props.className))
                props.className.forEach(classN => node.classList.add(classN));
            else
                node.className = props.className;
        }
        if (props.id) {
            node.setAttribute("id", props.id);
        }
        if (props.src) {
            node.setAttribute("src", props.src);
        }
        if (props.attributes) {
            props.attributes.forEach(attr => {
                node.setAttribute(attr[0], attr[1]);
            });
        }
        if (props.textContent) {
            node.innerHTML = props.textContent;
        }
        if (props.subNodes) {
            if (props.subNodes instanceof HTMLElement)
                node.appendChild(props.subNodes);
            else if (Array.isArray(props.subNodes))
                props.subNodes.forEach(subNode => {
                    if (subNode instanceof HTMLElement)
                        node.appendChild(subNode);
                    else
                        node.appendChild(util.createNode(subNode));
                });
            else
                node.appendChild(util.createNode(props.subNodes));
        }
        if (props.style)
            for (let prop in props.style) {
                node.style[prop] = props.style[prop];
            }
        if (props.onClick)
            node.onclick = props.onClick;
        return node;
    },
    defaultStyleGen: () => util.createNode({ tag: "style", textContent: `<style>
      #container {
        width: 100%;
        min-height: 100%;
        padding: 100%;
        color: #109e2a;
        background-color: black;
        font-size: 1.5rem;
        font-family: monospace;
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
    </style>`,
        attributes: [["data-terminal-style", "true"]]
    }),
    sleep: (time) => __awaiter(void 0, void 0, void 0, function* () {
        return new Promise(resolve => setTimeout(resolve, time));
    }),
    objectListener: (object, action) => {
        const handler = {
            get: (target, key) => {
                if (typeof target[key] === "object" && target[key] !== null && !Array.isArray(target[key])) {
                    return new Proxy(target[key], handler);
                }
                return target[key];
            },
            set: (target, key, value) => {
                target[key] = value;
                action(key);
                return true;
            }
        };
        return new Proxy(object, handler);
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy91dGlsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUdBLE1BQU0sQ0FBQyxNQUFNLElBQUksR0FBRztJQUNwQixVQUFVLEVBQUUsQ0FBQyxLQUFzQixFQUFlLEVBQUU7UUFDbEQsSUFBSSxJQUFJLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsR0FBRyxJQUFJLEtBQUssQ0FBQyxDQUFBO1FBQ3JELElBQUksS0FBSyxDQUFDLFNBQVMsRUFBRTtZQUNuQixJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQztnQkFBRSxLQUFLLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUE7O2dCQUM1RixJQUFJLENBQUMsU0FBUyxHQUFHLEtBQUssQ0FBQyxTQUFTLENBQUE7U0FDdEM7UUFDRCxJQUFJLEtBQUssQ0FBQyxFQUFFLEVBQUU7WUFBRSxJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUE7U0FBRTtRQUNuRCxJQUFJLEtBQUssQ0FBQyxHQUFHLEVBQUU7WUFBRSxJQUFJLENBQUMsWUFBWSxDQUFDLEtBQUssRUFBRSxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUE7U0FBRTtRQUN0RCxJQUFJLEtBQUssQ0FBQyxVQUFVLEVBQUU7WUFDcEIsS0FBSyxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEVBQUU7Z0JBQzlCLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFBO1lBQ3JDLENBQUMsQ0FBQyxDQUFBO1NBQ0g7UUFDRCxJQUFJLEtBQUssQ0FBQyxXQUFXLEVB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