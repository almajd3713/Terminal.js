import Terminal from "./index.js";
let terminal = new Terminal({
    target: document.getElementById("root")
});
terminal.createEvents("bruh", async (helper, next) => {
    await helper.sleep(500);
    next();
});
terminal.createEvents("bruh", async (helper, next) => {
    terminal.input("Aloo", [
        { answer: "Aa", action: () => terminal.trigger("floppa") }
    ]);
});
terminal.createEvents("floppa", (helper, next) => {
    console.log("Bruh");
});
terminal.trigger("bruh");
window.terminal = terminal;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoianMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvanMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxRQUFRLE1BQU0sWUFBWSxDQUFBO0FBRWpDLElBQUksUUFBUSxHQUFHLElBQUksUUFBUSxDQUFDO0lBQzFCLE1BQU0sRUFBRSxRQUFRLENBQUMsY0FBYyxDQUFDLE1BQU0sQ0FBQztDQUN4QyxDQUFDLENBQUE7QUFDRixRQUFRLENBQUMsWUFBWSxDQUFDLE1BQU0sRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxFQUFFO0lBS25ELE1BQU0sTUFBTSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQTtJQUN2QixJQUFJLEVBQUUsQ0FBQTtBQUNSLENBQUMsQ0FBQyxDQUFBO0FBRUYsUUFBUSxDQUFDLFlBQVksQ0FBQyxNQUFNLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsRUFBRTtJQUNuRCxRQUFRLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBRTtRQUNyQixFQUFDLE1BQU0sRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLEdBQUcsRUFBRSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLEVBQUM7S0FDekQsQ0FBQyxDQUFBO0FBQ0osQ0FBQyxDQUFDLENBQUE7QUFFRixRQUFRLENBQUMsWUFBWSxDQUFDLFFBQVEsRUFBRSxDQUFDLE1BQU0sRUFBRSxJQUFJLEVBQUUsRUFBRTtJQUMvQyxPQUFPLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFBO0FBQ3JCLENBQUMsQ0FBQyxDQUFBO0FBR0YsUUFBUSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQTtBQUd4QixNQUFNLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQSJ9