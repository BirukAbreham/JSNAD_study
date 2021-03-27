const Logger = require("./logger");
const logger = new Logger();

logger.on("logMessage", (arg) => {
  console.log("Listened value => ", arg);
});

logger.logIt("logMessage", { name: "John", age: 40 });
