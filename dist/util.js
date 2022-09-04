export const util = {
    createNode(props) {
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
    defaultStyleGen: (id) => util.createNode({ tag: "style", textContent: `
      #${id} {
        box-sizing: border-box;
        width: 100%;
        min-height: 100%;
        padding: 1rem;
        color: #109e2a;
        background-color: black;
        font-size: 1.5rem;
        font-family: monospace;
      }

      #${id} p, #container form {
        margin: 0;
        margin-bottom: 0.5rem
      }

      #${id} input {
        background-color: inherit;
        width: 50%;
        outline: none;
        border: none;
        font-size: inherit;
        color: inherit;
        font-family: inherit;
        margin-left: 1rem;
      }
      #${id} input.isFocused {
        border-bottom: 1px solid #109e2a
      }
    `,
        attributes: [["data-terminal-style", "true"]]
    }),
    sleep: (ms) => new Promise(resolve => setTimeout(resolve, ms)),
    objectListener(object, action) {
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
    },
    genElement(type, props) {
        switch (type) {
            case "print":
                return util.createNode({ tag: "p", textContent: props.textContent });
            case "input":
                return util.createNode({
                    tag: "form",
                    subNodes: {
                        tag: "p",
                        textContent: props.textContent,
                        subNodes: {
                            tag: "input",
                            attributes: [["type", "text"]]
                        }
                    }
                });
        }
    },
    pathReader(path) {
        let newPath = path.replace(/\s/g, "").split(/[\\//:]+/g);
        return newPath;
    },
    compareArrayByIndex(arr1, arr2) {
        for (let i = 0; i < arr2.length; i++) {
            if (!arr1[i] || !arr2[i] || arr1[i] !== arr2[i])
                return false;
        }
        return true;
    },
    pathGen(tree) {
        let treeArr = [];
        let arrGen = (obj, lastArr) => {
            for (const [key, value] of Object.entries(obj)) {
                if (typeof value === "object") {
                    lastArr.push(key);
                    treeArr.push(lastArr.slice());
                    arrGen(value, lastArr);
                }
                else {
                    lastArr.push(value);
                    treeArr.push(lastArr.slice());
                }
                lastArr.pop();
            }
        };
        arrGen(tree, []);
        return treeArr;
    },
    findPathObjByPathArr(tree, pathArr) {
        let finalPathObj = tree;
        let recursiveSearch = (obj, arr, i) => {
            for (const [key, value] of Object.entries(obj)) {
                if (arr[i] && key === arr[i]) {
                    if (typeof value === "object" && Object.entries(value).length) {
                        finalPathObj = value;
                        if (!arr[i + 1]) {
                            return value;
                        }
                        let result = recursiveSearch(finalPathObj, arr, i + 1);
                        if (result)
                            return result;
                    }
                }
            }
        };
        return recursiveSearch(finalPathObj, pathArr, 0);
    },
    encryptor(mode, data) {
        const count = 8;
        switch (mode) {
            case "encrypt":
                let encrypted = data;
                for (let i = 0; i <= count; i++) {
                    encrypted = btoa(encrypted);
                }
                return encrypted;
            case "decrypt":
                let decrypted = data;
                for (let i = 0; i <= count; i++) {
                    try {
                        decrypted = atob(decrypted);
                    }
                    catch (error) {
                        console.error(error);
                        return decrypted;
                    }
                }
                return decrypted;
        }
    },
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy91dGlsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUdBLE1BQU0sQ0FBQyxNQUFNLElBQUksR0FBRztJQUNwQixVQUFVLENBQUMsS0FBc0I7UUFDL0IsSUFBSSxJQUFJLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsR0FBRyxJQUFJLEtBQUssQ0FBQyxDQUFBO1FBQ3JELElBQUksS0FBSyxDQUFDLFNBQVMsRUFBRTtZQUNuQixJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQztnQkFBRSxLQUFLLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUE7O2dCQUM1RixJQUFJLENBQUMsU0FBUyxHQUFHLEtBQUssQ0FBQyxTQUFTLENBQUE7U0FDdEM7UUFDRCxJQUFJLEtBQUssQ0FBQyxFQUFFLEVBQUU7WUFBRSxJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUE7U0FBRTtRQUNuRCxJQUFJLEtBQUssQ0FBQyxHQUFHLEVBQUU7WUFBRSxJQUFJLENBQUMsWUFBWSxDQUFDLEtBQUssRUFBRSxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUE7U0FBRTtRQUN0RCxJQUFJLEtBQUssQ0FBQyxVQUFVLEVBQUU7WUFDcEIsS0FBSyxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEVBQUU7Z0JBQzlCLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFBO1lBQ3JDLENBQUMsQ0FBQyxDQUFBO1NBQ0g7UUFDRCxJQUFJLEtBQUssQ0FBQyxXQUFXLEVBQUU7WUFBRSxJQUFJLENBQUMsU0FBUyxHQUFHLEtBQUssQ0FBQyxXQUFXLENBQUE7U0FBRTtRQUM3RCxJQUFJLEtBQUssQ0FBQyxRQUFRLEVBQUU7WUFDbEIsSUFBSSxLQUFLLENBQUMsUUFBUSxZQUFZLFdBQVc7Z0JBQUUsSUFBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUE7aUJBQ3RFLElBQUksS0FBSyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDO2dCQUFFLEtBQUssQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxFQUFFO29CQUN2RSxJQUFJLE9BQU8sWUFBWSxXQUFXO3dCQUFFLElBQUksQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDLENBQUE7O3dCQUN4RCxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQTtnQkFDakQsQ0FBQyxDQUFDLENBQUM7O2dCQUFNLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQTtTQUMzRDtRQUNELElBQUcsS0FBSyxDQUFDLEtBQUs7WUFBRSxLQUFJLElBQUksSUFBSSxJQUFJLEtBQUssQ0FBQyxLQUFLLEVBQUU7Z0JBRTNDLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQTthQUNyQztRQUNELElBQUksS0FBSyxDQUFDLE9BQU87WUFBRSxJQUFJLENBQUMsT0FBTyxHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUE7UUFDL0MsT0FBTyxJQUFJLENBQUE7SUFDYixDQUFDO0lBRUQsZUFBZSxFQUFFLENBQUMsRUFBUyxFQUFFLEVBQUUsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLEVBQUMsR0FBRyxFQUFFLE9BQU8sRUFBRSxXQUFXLEVBQUU7U0FDbkUsRUFBRTs7Ozs7Ozs7Ozs7U0FXRixFQUFFOzs7OztTQUtGLEVBQUU7Ozs7Ozs7Ozs7U0FVRixFQUFFOzs7S0FHTjtRQUNELFVBQVUsRUFBRSxDQUFDLENBQUMscUJBQXFCLEVBQUUsTUFBTSxDQUFDLENBQUM7S0FDaEQsQ0FBQztJQUVGLEtBQUssRUFBRSxDQUFDLEVBQVUsRUFBRSxFQUFFLENBQUMsSUFBSSxPQUFPLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxVQUFVLENBQUMsT0FBTyxFQUFFLEVBQUUsQ0FBQyxDQUFDO0lBQ3RFLGNBQWMsQ0FBQyxNQUFjLEVBQUUsTUFBK0I7UUFDNUQsTUFBTSxPQUFPLEdBQUc7WUFDZCxHQUFHLEVBQUUsQ0FBQyxNQUFxQixFQUFFLEdBQXdCLEVBQUUsRUFBRTtnQkFDdkQsSUFBRyxPQUFPLE1BQU0sQ0FBQyxHQUFHLENBQUMsS0FBSyxRQUFRLElBQUksTUFBTSxDQUFDLEdBQUcsQ0FBQyxLQUFLLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUU7b0JBQ3pGLE9BQU8sSUFBSSxLQUFLLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxFQUFFLE9BQU8sQ0FBQyxDQUFBO2lCQUN2QztnQkFDRCxPQUFPLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQTtZQUNwQixDQUFDO1lBQ0QsR0FBRyxFQUFFLENBQUMsTUFBcUIsRUFBRSxHQUF3QixFQUFFLEtBQVUsRUFBRSxFQUFFO2dCQUNuRSxNQUFNLENBQUMsR0FBRyxDQUFDLEdBQUcsS0FBSyxDQUFBO2dCQUNuQixNQUFNLENBQUMsR0FBRyxDQUFDLENBQUE7Z0JBQ1gsT0FBTyxJQUFJLENBQUE7WUFDYixDQUFDO1NBQ0YsQ0FBQTtRQUNELE9BQU8sSUFBSSxLQUFLLENBQUMsTUFBTSxFQUFFLE9BQU8sQ0FBQyxDQUFBO0lBQ25DLENBQUM7SUFDRCxVQUFVLENBQUMsSUFBa0IsRUFBRSxLQUFzQjtRQUNuRCxRQUFRLElBQUksRUFBRTtZQUNaLEtBQUssT0FBTztnQkFDVixPQUFPLElBQUksQ0FBQyxVQUFVLENBQUMsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLFdBQVcsRUFBRSxLQUFLLENBQUMsV0FBVyxFQUFDLENBQUMsQ0FBQTtZQUVyRSxLQUFLLE9BQU87Z0JBQ1YsT0FBTyxJQUFJLENBQUMsVUFBVSxDQUFDO29CQUNyQixHQUFHLEVBQUUsTUFBTTtvQkFDWCxRQUFRLEVBQUU7d0JBQ1IsR0FBRyxFQUFFLEdBQUc7d0JBQ1IsV0FBVyxFQUFFLEtBQUssQ0FBQyxXQUFXO3dCQUM5QixRQUFRLEVBQUU7NEJBQ1IsR0FBRyxFQUFFLE9BQU87NEJBQ1osVUFBVSxFQUFFLENBQUMsQ0FBQyxNQUFNLEVBQUUsTUFBTSxDQUFDLENBQUM7eUJBQy9CO3FCQUNGO2lCQUNGLENBQUMsQ0FBQTtTQUNMO0lBQ0gsQ0FBQztJQUNELFVBQVUsQ0FBQyxJQUFZO1FBQ3JCLElBQUksT0FBTyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsQ0FBQTtRQUN4RCxPQUFPLE9BQU8sQ0FBQTtJQUNoQixDQUFDO0lBQ0QsbUJBQW1CLENBQUMsSUFBZ0IsRUFBRSxJQUFnQjtRQUNwRCxLQUFJLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtZQUNuQyxJQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsS0FBSyxJQUFJLENBQUMsQ0FBQyxDQUFDO2dCQUFFLE9BQU8sS0FBSyxDQUFBO1NBQzdEO1FBQ0QsT0FBTyxJQUFJLENBQUE7SUFDYixDQUFDO0lBQ0QsT0FBTyxDQUFDLElBQVU7UUFDaEIsSUFBSSxPQUFPLEdBQTBCLEVBQUUsQ0FBQTtRQUN2QyxJQUFJLE1BQU0sR0FBRyxDQUFDLEdBQVMsRUFBRSxPQUFpQixFQUFFLEVBQUU7WUFDNUMsS0FBSSxNQUFNLENBQUMsR0FBRyxFQUFFLEtBQUssQ0FBQyxJQUFJLE1BQU0sQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEVBQUU7Z0JBQzdDLElBQUcsT0FBTyxLQUFLLEtBQUssUUFBUSxFQUFFO29CQUM1QixPQUFPLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFBO29CQUNqQixPQUFPLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFBO29CQUM3QixNQUFNLENBQUMsS0FBSyxFQUFFLE9BQU8sQ0FBQyxDQUFBO2lCQUN2QjtxQkFDSTtvQkFDSCxPQUFPLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFBO29CQUNuQixPQUFPLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFBO2lCQUM5QjtnQkFDRCxPQUFPLENBQUMsR0FBRyxFQUFFLENBQUE7YUFDZDtRQUNILENBQUMsQ0FBQTtRQUNELE1BQU0sQ0FBQyxJQUFJLEVBQUUsRUFBRSxDQUFDLENBQUE7UUFDaEIsT0FBTyxPQUFPLENBQUE7SUFDaEIsQ0FBQztJQUNELG9CQUFvQixDQUFDLElBQVUsRUFBRSxPQUFpQjtRQUNoRCxJQUFJLFlBQVksR0FBUyxJQUFJLENBQUE7UUFDN0IsSUFBSSxlQUFlLEdBQUcsQ0FBQyxHQUFTLEVBQUUsR0FBVSxFQUFFLENBQVMsRUFBRSxFQUFFO1lBQ3pELEtBQUksTUFBTSxDQUFDLEdBQUcsRUFBRSxLQUFLLENBQUMsSUFBSSxNQUFNLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxFQUFFO2dCQUM3QyxJQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsSUFBSSxHQUFHLEtBQUssR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFO29CQUMzQixJQUFHLE9BQU8sS0FBSyxLQUFLLFFBQVEsSUFBSSxNQUFNLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLE1BQU0sRUFBRTt3QkFDNUQsWUFBWSxHQUFHLEtBQUssQ0FBQTt3QkFDcEIsSUFBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUU7NEJBQ2QsT0FBTyxLQUFLLENBQUE7eUJBQ2I7d0JBQ0QsSUFBSSxNQUFNLEdBQUcsZUFBZSxDQUFDLFlBQVksRUFBRSxHQUFHLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFBO3dCQUN0RCxJQUFHLE1BQU07NEJBQUUsT0FBTyxNQUFjLENBQUE7cUJBQ2pDO2lCQUNGO2FBQ0Y7UUFDSCxDQUFDLENBQUE7UUFDRCxPQUFPLGVBQWUsQ0FBQyxZQUFZLEVBQUUsT0FBTyxFQUFFLENBQUMsQ0FBQyxDQUFBO0lBQ2xELENBQUM7SUFDRCxTQUFTLENBQUMsSUFBMkIsRUFBRSxJQUFZO1FBQ2pELE1BQU0sS0FBSyxHQUFHLENBQUMsQ0FBQTtRQUNmLFFBQVEsSUFBSSxFQUFFO1lBQ1osS0FBSyxTQUFTO2dCQUNaLElBQUksU0FBUyxHQUFHLElBQUksQ0FBQTtnQkFDcEIsS0FBSSxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxJQUFJLEtBQUssRUFBRSxDQUFDLEVBQUUsRUFBRTtvQkFDOUIsU0FBUyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQTtpQkFDNUI7Z0JBQ0QsT0FBTyxTQUFTLENBQUE7WUFFbEIsS0FBSyxTQUFTO2dCQUNaLElBQUksU0FBUyxHQUFHLElBQUksQ0FBQTtnQkFDcEIsS0FBSSxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxJQUFJLEtBQUssRUFBRSxDQUFDLEVBQUUsRUFBRTtvQkFDOUIsSUFBSTt3QkFDRixTQUFTLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFBO3FCQUM1QjtvQkFBQyxPQUFPLEtBQUssRUFBRTt3QkFDZCxPQUFPLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFBO3dCQUNwQixPQUFPLFNBQVMsQ0FBQTtxQkFDakI7aUJBQ0Y7Z0JBQ0QsT0FBTyxTQUFTLENBQUE7U0FDbkI7SUFDSCxDQUFDO0NBQ0EsQ0FBQSJ9