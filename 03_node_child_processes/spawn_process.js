const { spawn } = require("child_process");

const child = spawn("ls", ["-l", "-a", "-h"]);

child.on("exit", (code, signal) => {
  console.log(`Child process exited with code ${code} and signal ${signal}`);
});

child.stdout.on("data", (data) => {
  console.log(`child stdout:\n${data}`);
});

child.stderr.on("data", (data) => {
  console.error(`child stderr:\n${data}`);
});
