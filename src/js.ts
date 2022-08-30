import Terminal from "./index.js"

let terminal = new Terminal({
  target: document.getElementById("root")
})
terminal.createEvents("bruh", async (helper, next) => {
  await helper.sleep(1000)
  console.log("aye")
  await helper.sleep(1500)
  console.log("LLL")
  await helper.sleep(2000)
  next()
})

terminal.createEvents("bruh", async (helper) => {
  console.log("holy shit am from another function !")
  await helper.sleep(1000)
})

terminal.trigger("bruh")

// @ts-ignore
window.terminal = terminal