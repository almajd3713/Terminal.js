

class Terminal {
  #timer = 0
  #defaultStyle = {
    color: "#13781D",
    backgroundColor: "black",
    padding: "1rem",
    fontSize: "1.5rem",
    fontFamily: "monospace"
  }
  constructor(target, styling) {
    if(!target || !target.nodeType) throw new Error("First argument is not an HTML node")
    this.target = target
    if(styling) this.#initStyling(styling)
    else this.#initStyling({})
  }
  #initStyling(newStyle) {
    let style = {
    color: "#13781D",
    backgroundColor: "black",
    padding: "1rem",
    fontSize: "1.5rem",
    fontFamily: "monospace"
    }
    Object.assign(style, newStyle)
    let container = this.target.id
    document.querySelector("head").innerHTML += `
      <style>
        #${container} {
          width: calc(100% - ${style.padding});
          height: calc(100% - ${style.padding});
          padding: ${style.padding} 0 0 ${style.padding};
          color: ${style.color};
          background-color: ${style.backgroundColor};
          font-size: ${style.fontSize};
          font-family: ${style.fontFamily};
        }

        #${container} p, #${container} form {
          margin: 0;
          margin-bottom: 0.5rem
        }

        #${container} input {
          background-color: inherit;
          width: 50%;
          outline: none;
          border: none;
          font-size: inherit;
          color: inherit;
          font-family: inherit;
        }
      </style>
    `
  }

  #createNode(props) {
    let node = document.createElement(props.tag)
    if (props.className) {
      if(Array.isArray(props.className)) for(let className in props.className) {node.classList.add(className)}
      else node.className = props.className
    } 
    if (props.id) { node.setAttribute("id", props.id) }
    if (props.textContent) { node.textContent = props.textContent }
    if (props.subNodes) {
      if (Array.isArray(props.subNodes)) props.subNodes.forEach(subNode => {
        node.appendChild(this.#createNode(subNode))
      }); else node.appendChild(this.createNode(props.subNodes))
    }
    return node
  }
  #createForm(prefix = ">") {
    let el = this.#createNode({
      tag: "form",
      subNodes: {
        tag: "p",
        textContent: prefix,
        subNodes: {
          tag: "input",
        }
      }
    })
    return el
  }

  print(text = "fill me !", delay = 1000) {
    this.#timer += delay
    let el = this.#createNode({ tag: "p", textContent: text })
    setTimeout(() => {
      this.target.appendChild(el)
    }, this.#timer);
  }
}