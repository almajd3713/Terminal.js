import { CreateNodeProps } from "./types"


export const util = {
createNode: (props: CreateNodeProps): HTMLElement => {
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

defaultStyleGen: () => util.createNode({tag: "style", textContent: `<style>
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

sleep: (ms: number) => new Promise(resolve => setTimeout(resolve, ms)),
objectListener: (object: Object, action: (value: string) => void) => {
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
}
}
