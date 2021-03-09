# Node's Child Processes

- Single-threaded, non-blocking performance in Node works great for a single process.
- No matter how powerful your server may be, a single thread can only support a limited load.
- The fact that Node runs in a single thread does not mean that we can't take advantage of multiple processes and, of course, multiple machines as well.
- Using multiple processes is the best way to scale a Node application. Node is designed for building distributed applications with many nodes. This is why it's named **Node**.

# The Child Processes Module

- We can easily spin a `child process` using Node's child_process module and those child processes can easily communicate with each other with a messaging system.
- The `child_process` module enables us to access OS functionalities by running any system command inside a, well, child process.
- There are four different ways to create a child process in Node: `spawn()`, `fork()`, `exec()`, and `execFile()`

## Spawned Child Processes

- The `spawn` function launches a command in a new process and we can use it to pass that command any arguments.

```JavaScript
const { spawn } = require("child_process");

const child = spawn("pwd");
```

- The result of executing the `spawn` function is a `ChildProcess` instance, which implements the `EventEmitter` API. This means we can register handlers for events on this child object directly. For example, we can do something when the child process exits by registering a handler for the `exit` event:

```JavaScript
child.on("exit", function(code, singal) {
  console.log(
    "child process exited with " + `code ${code} and signal ${signal}`
  );
});
```

- The other events that we can register handlers for with the `ChildProcess` instance are `disconnect`, `error`, `close`, and `message`
  - The `disconnect` event is emitted when the parent process manually calls the `child.disconnect` method
  - The `error` event is emitted if the process could not be spawned or killed
  - The `close` event is emitted when the `stdio` streams of a child process get closed
  - The `message` event is the most important one. It's emitted when the child process uses the `process.send()` function to send messages. This is how parent/child processes can communicate with each other.
- Every child process also gets the three standard `stdio` streams, which we can access using `child.stdin`, `child.stdout`, and `child.stderr`

- Since all streams are event emitters, we can listen to different events on those `stdio` streams that are attached to every child process. Unlike in a normal process though, in a child process the `stdout/stderr` streams are readable streams while the `stdin` stream is a writable one. This is basically the inverse of those types found in a main process. The events we can use for those streams are the standard ones. Most importantly, on the readable streams we can listen to the `data` event, which will have the output of the command or any error encountered while executing the command:

```JavaScript
child.stdout.on("data", (data) => {
  console.log(`child stdout:\t${data}`);
});

child.stderr.on("data", (data) => {
  console.error(`child stderr:\t${data}`);
});
```

- We can pass arguments to the command that's executed by the `spawn` function using the second arguments fo the `spawn` function, which is an array of all the arguments to be passed to the command. For example,

```JavaScript
const child = spawn("find", [".", "-type", "f"])
```

- A child process `stdin` si a writable stream. We can use it to send a command some input. Just like any writable stream, the easiest way to consume it is using the `pipe` function.

```JavaScript
const { spawn } = require("child_process");

const child = spawn("wc");

process.stdin.pipe(child.stdin);

child.stdout.on("data", (data) => {
  console.log(`child stdout:\n${data});
});
```

- We can also pipe the standard input/output of multiple processes on each other, just like we can do with Linux commands. For example, we can pipe the `stdout` of the `find` command to the `stdin` of the `wc` command to count all the files in the current directory:

```JavaScript
const { spawn } = require("child_process");

const find = spawn("find", [".", "-type", "f"]);
const wc = spawn("wc", ["-l"]);

wc.stdout.on("data", (data) => {
  console.log(`Number of files ${data}`);
});
```

## Shell Syntax and the exec Function

- By default, the `spawn` function does not create a **shell** to execute the command we pass into it. This makes it slightly more efficient than the `exec` function, which does create a shell.
- The exec function has one other majore difference. It bufferes the command's generated output and passes the whole output value to a callback function.
- Here's the previous `find|wc` example implemented with an `exec` function.

```JavaScript
const { exec } = require("child_process");

exec("find . -type f | wc -l", (err, stdout, stderr) => {
  if (err) {
    console.error(`exec error: ${err}`);
    return;
  }

  console.log(`Number of files ${stdout}`);
});
```

- Since the `exec` function uses a shell to execute the command, we can use the **shell syntax** directly here, making use of the shell **pipe** feature.

Note:

> Note that using the shell syntax comes with a security risk if you’re executing any kind of dynamic input provided externally. A user can simply do a command injection attack using shell syntax characters like ; and $ (for example, `command + '; rm -rf ~'` )

- We can make the spawned child process inherite the standard IO objects of its parents if we want to, but more importantly, we can make the `spawn` function use the shell syntax as well. Here's the same `find | wc` command implemented with the `spawn` function:

```JavaScript
const child = spawn("find . -type f | wc -l", {
  stdio: "inherit",
  shell: true,
});
```

- Because of the `stdio: 'inherit'` option above, when we execute the code, the child process inherites the main process `stdin`, `stdout`, and `stderr`. This causes the child process data events handlers to be triggered on the main `process.stdout` stream, making the script output the result right away.

- Because of the `shell: true` option above, we were able to use the shell syntax in the executedd command, just like we did with `exec`. But with this code, we still get the advantage of the streaming of data that the `spawn` function gives us. **This is really the best of both worlds.**
