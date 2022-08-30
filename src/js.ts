import Terminal from "./index.js"

let terminal = new Terminal({
  target: document.getElementById("root")
})
terminal.createEvents("bruh", async (helper, next) => {
  // await helper.sleep(2000)
  // terminal.print("Hello there !")
  // await helper.sleep(1500)
  // terminal.print("AAA")
  await helper.sleep(500)
  next()
})

terminal.createEvents("bruh", async (helper, next) => {
  terminal.input("Aloo", [
    {answer: "Aa", action: () => terminal.trigger("floppa")}
  ])
})

terminal.createEvents("floppa", (helper, next) => {
  console.log("Bruh")
})


terminal.trigger("bruh")

// @ts-ignore
window.terminal = terminal