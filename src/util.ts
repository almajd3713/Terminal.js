import { CreateNodeProps, ElementTypes, InfiniteArray, Path } from "./types"


export const util = {
createNode(props: CreateNodeProps): HTMLElement {
  let node = document.createElement(props.tag || "div")
  if (props.className) {
    if (Array.isArray(props.className)) props.className.forEach(classN => node.classList.add(classN))
    else node.className = props.className
  }
  if (props.id) { node.setAttribute("id", props.id) }
  if (props.src) { node.setAttribute("src", props.src) }
  if (props.attributes) {
    props.attributes.forEach(attr => {
      node.setAttribute(attr[0], attr[1])
    })
  }
  if (props.textContent) { node.innerHTML = props.textContent }
  if (props.subNodes) {
    if (props.subNodes instanceof HTMLElement) node.appendChild(props.subNodes)
    else if (Array.isArray(props.subNodes)) props.subNodes.forEach(subNode => {
      if (subNode instanceof HTMLElement) node.appendChild(subNode)
      else node.appendChild(util.createNode(subNode))
    }); else node.appendChild(util.createNode(props.subNodes))
  }
  if(props.style) for(let prop in props.style) {
    // @ts-ignore
    node.style[prop] = props.style[prop]
  }
  if (props.onClick) node.onclick = props.onClick
  return node
},

defaultStyleGen: (id:string) => util.createNode({tag: "style", textContent: `
      #${id} {
        box-sizing: border-box;
        width: 100%;
        height: 100%;
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

sleep: (ms: number) => new Promise(resolve => setTimeout(resolve, ms)),
objectListener(object: Object, action: (value: string) => void) {
  const handler = {
    get: (target: typeof object, key: keyof typeof object) => {
      if(typeof target[key] === "object" && target[key] !== null && !Array.isArray(target[key])) {
        return new Proxy(target[key], handler)
      }
      return target[key]
    },
    set: (target: typeof object, key: keyof typeof object, value: any) => {
      target[key] = value
      action(key)
      return true
    }
  }
  return new Proxy(object, handler)
},
genElement(type: ElementTypes, props: CreateNodeProps) {
  switch (type) {
    case "print":
      return util.createNode({ tag: "p", textContent: props.textContent})
  
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
      })
  }
},
pathReader(path: string) {
  let newPath = path.replace(/\s/g, "").split(/[\\//:]+/g)
  return newPath
},
compareArrayByIndex(arr1: Array<any>, arr2: Array<any>) {
  for(let i = 0; i < arr2.length; i++) {
    if(!arr1[i] || !arr2[i] || arr1[i] !== arr2[i]) return false
  }
  return true
},
pathGen(tree: Path) {
  let treeArr: InfiniteArray<string> = []
  let arrGen = (obj: Path, lastArr: string[]) => {
    for(const [key, value] of Object.entries(obj)) { 
      if(typeof value === "object") {
        lastArr.push(key)
        treeArr.push(lastArr.slice())
        arrGen(value, lastArr)
      }
      else {
        lastArr.push(value)
        treeArr.push(lastArr.slice())
      }
      lastArr.pop()
    }
  }
  arrGen(tree, [])
  return treeArr
}
}