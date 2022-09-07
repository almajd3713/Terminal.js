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
    genElement(type, props, messageType = "default") {
        switch (type) {
            case "print":
                return util.createNode({ tag: "p", textContent: props.textContent, style: {
                        backgroundColor: messageType === "error" ? "#d90d0d" :
                            messageType === "warning" ? "#ced416" :
                                "initial",
                        color: messageType !== "default" ? "black" :
                            "inheret"
                    } });
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy91dGlsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUdBLE1BQU0sQ0FBQyxNQUFNLElBQUksR0FBRztJQUNwQixVQUFVLENBQUMsS0FBc0I7UUFDL0IsSUFBSSxJQUFJLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsR0FBRyxJQUFJLEtBQUssQ0FBQyxDQUFBO1FBQ3JELElBQUksS0FBSyxDQUFDLFNBQVMsRUFBRTtZQUNuQixJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQztnQkFBRSxLQUFLLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUE7O2dCQUM1RixJQUFJLENBQUMsU0FBUyxHQUFHLEtBQUssQ0FBQyxTQUFTLENBQUE7U0FDdEM7UUFDRCxJQUFJLEtBQUssQ0FBQyxFQUFFLEVBQUU7WUFBRSxJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUE7U0FBRTtRQUNuRCxJQUFJLEtBQUssQ0FBQyxHQUFHLEVBQUU7WUFBRSxJQUFJLENBQUMsWUFBWSxDQUFDLEtBQUssRUFBRSxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUE7U0FBRTtRQUN0RCxJQUFJLEtBQUssQ0FBQyxVQUFVLEVBQUU7WUFDcEIsS0FBSyxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEVBQUU7Z0JBQzlCLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFBO1lBQ3JDLENBQUMsQ0FBQyxDQUFBO1NBQ0g7UUFDRCxJQUFJLEtBQUssQ0FBQyxXQUFXLEVBQUU7WUFBRSxJQUFJLENBQUMsU0FBUyxH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