import Terminal from "./index.js"

let terminal = new Terminal({
  target: document.getElementById("root")
})
terminal.createEvents("bruh", async (helper, next) => {
  // await helper.sleep(2000)
  // terminal.print("Hello there !")
  // await helper.sleep(1500)
  // terminal.print("AAA")
  await helper.sleep(1000)
  next()
})


terminal.setPathTree({
  D: {
    mission1: {
      mission1: "mission1.txt",
      execute1: "execute1.py"
    },
    mission2: {
      mission2: "mission2.txt",
      execute2: {
        bruh: "Aloo",
        Hello: "there !"
      }
    },
    mission3: {
      mission3: "mission3.txt",
      execute3: "execute3.py"
    },
    }
})
terminal.setPath("D:/mission2")
terminal.enableDefaultCommands()
terminal.createEvents("bruh", async (helper, next) => {
  terminal.cmd(">")
})

terminal.createEvents("floppa", (helper, next) => {
  console.log("Bruh")
})


terminal.trigger("bruh")

// @ts-ignore
window.terminal = terminal