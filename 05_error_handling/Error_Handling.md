# Background

- You should know why this pattern:

```JavaScript
function myApiFunc(callback) {
    /*
    * This pattern does NOT work!
    */
    try {
        doSomeAsyncOperation((err) => {
            if (err) {
                throw (err);
            }
            /* continue as normal */
        });
    } catch (ex) {
        callback(ex);
    }
}
```

- does not work to handle errors.
- In Node.js there's a difference between an error and an exception. An error is any instance of the `Error` class. Errors may be constructed and then passed directly to another function or thrown. When you `throw` an error, it becomes an exception.

## Operational errors vs. programmer errors

- **Operational errors** represent run-time problems experienced by correctly-written programs. These are not bugs in the program. In fact, these are usually problems with something else: the system itself(e.g. out of memory or too many open files), the system's configuration (e.g. no route to a remote host), the network (e.g. socket hang-up), or a remote service (e.g. a 500 error, failure to connect, or the like)
- **Programmer errors** are bugs in the program. These are things that can always be avoided by changing the code. They can never be handled properly.
  - tried to read property of `undefined`
  - called an async function without callback
  - passed a `string` where an object was expected
  - passed an object where an IP address string was expected

## Handling operational errors

- For any given error, there are a few things you might do:
  - **Deal with the failure directly**
    - Sometimes, it's clear what you have to do to handle an error. If you get an `ENOENT` error trying to open a log file, maybe this is the first time.
  - **Propagate the failure to your client**
    - If you don't know how to deal with the error, the simplest thing to do is to abort whatever operation you're trying to do, clean up whatever you've started, and deliver an error back to your client.
  - **Retry the operation**
    - For errors from the network and remote services (e.g. a web service), it's sometimes useful to retry an operation that returns an error. For example, if a remote service gives a 503 (Service Unavailable error), you may want to retry in a few seconds. _If you're going to retry, you should clearly document that you may retry multiple times, how many times you'll try before failing, and how long you'll wait between retries._
  - **Blow up**
    - For errors that truly cannot happen, or would effectively represent programmer errors if they ever did, it's fine to log an error message an crash.
  - **Log the error - and do nothing else**
    - Sometimes, there's nothing you can do about something, there's nothing to retry or abort, and there's also no reason to crash the program.

# Patterns for writing functions

- The single most important thing to do is **document** what your function does, including what arguments it takes (including their types and any other constraints), what it returns, what errors can happen, and what those errors mean. _If you don't know what errors can happen or don't know what they mean, then your program cannot be correct except by accident._. So if you're writing a new function, you have to tell your callers what errors can happen and what they mean.

## Throw, Callback, Reject, or EventEmiiter?

- `throw` delivers an error synchronously
- Callbacks are the most basic way of delivering an error asynchronously. The user passes you a function (the callback), and you invoke it sometimes later when the asynchronous operation completes. The usual pattern is that the callback is invoked as `callback(err, result)`, where only one of `err` and `result` is non-null, depeding on whether the operation succeeded or failed
- Promise rejections are a common way to deliver an error asynchrously.
- For more complicated cases, instead of using a callback, the function itself can return an `EvenEmiiter` object, and the caller would be expected to listen for `error` events on the emitter. This is useful in two particular cases:
  - When you're doing a complicated operation that may produce multiple errors or multiple results
  - For objects that represent complex state machines, where a lot of different asynchronous things can happen.

> The general rule is that _a function may deliver operational errors synchronously (e.g. by `throw`ing) or asynchronously (by passing them to a callback or emitting `error` on an `EventEmitter`), but is should not do both._
