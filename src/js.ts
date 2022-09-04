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
terminal.addFileActions({
  file: "mission2.txt",
  action: async(args, helper) => {
    for(let i = 1; i <= 25; i++) {
      await helper.sleep(50)
      terminal.print(`loading...${i * 4}%`)
    }
    await helper.sleep(1000)
    terminal.print("OYA!")
    return true
  }
})
terminal.addCommand({
  answer: "bruh",
  description: "testing purposes",
  async action(args, helper) {
    terminal.print("started at t-0")
    await helper.sleep(2000)
    terminal.print("this is at t-2")
    await helper.sleep(3000)
    terminal.print("done !")
    return true
  }
})

terminal.createEvents("bruh", (helper, next) => {
  terminal.cmd(">")
})

terminal.createEvents("floppa", (helper, next) => {
  console.log("Bruh")
})
terminal.addUser({
  username: "galunga",
  password: "aloha",
  auth: {
    commands: ["open"],
    dirs: ["D:/mission2/mission2.txt"]
  }
})
terminal.setCurrentUser("galunga")
terminal.auth({user: "galunga", command: "open", directory: "D:/mission2"})

terminal.trigger("bruh")

// @ts-ignore
window.terminal = terminal