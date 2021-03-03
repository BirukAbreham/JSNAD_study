[Reference](https://www.freecodecamp.org/news/node-js-streams-everything-you-need-to-know-c9141306be93/)

## Buffer and Streams

- Streams are collections of data - just like arrays or strings. The difference is that streams might not be available all at once, and they don't have to fit in memory.

- There are four fundamental stream types in Node.js: Readable, Writable, Duplex and Transform streams.
  - A readable stream is an abstraction for a source from which data can be consumed. An example of that is the `fs.createReadStream` method.
  - A writable stream is an abstraction for a destination to which data can be written. An example of that is the `fs.createWriteStream` method.
  - A duplex streams is both Readable and writable. An example of that is a TCP socket
  - A transform stream is basically a duplex stream that can be used to modify or transform the data as it is written and read. An example of that is the `zib.createGzip` stream to compress the data using gzip.
- All streams are instances of `EventEmitter`. We can consume streams data in a simpler way using the `pipe` method.

### The pipe method

- Here's the magic line that you need to remember

```JavaScript
readableSrc.pipe(writableDest);
```

- For streams `a` (readable), `b` and `c` (duplex), and `d` (writable), we can:

```JavaScript
a.pipe(b).pipe(c).pipe(d)

// which, in Linux, is equivalent to:
// $ a | b | c | d
```

### Stream events

- Streams can also be consumed with events directly. Here's the simplified event-equivalent code of what the `pipe` method mainly does to read and write data:

```JavaScript
// read.pipe(writable)

readable.on('data', (chunk) => {
  writable.write(chunk);
});

readable.on('end', () => {
  writable.end();
})
```

- Here’s a list of the important events and functions that can be used with readable and writable streams:
  ![Read and Write Stream functions](https://cdn-media-1.freecodecamp.org/images/1*HGXpeiF5-hJrOk_8tT2jFA.png)

- The most important events on a readable stream are:
  - The `data` event, which is emitted whenever the stream passes a chunk of data to the consumer
  - The `end` event, which is emitted when there is no more data to be consumed from the stream.
- The most important events on a writable stream are:

  - The `drain` event, which is a signal that the writable stream can receive more data.
  - The `finish` event, which is emitted when all data has been flushed to the underlying system.

- Events and functions can be combined to make for a custom and optimized use of streams. To consume a readable stream, we can use the `pipe/unpipe` methods, or the `read`/`unshift`/`resume` methods. To consume a writable stream, we can make it the destination of `pipe`/`unpipe`, or just write to it with the `write` method and call the `end` method when we're done.

### Paused and Flowing Modes of Readable Streams

- Readable streams have two main modes that affect the way we can consume them:
  - **paused** mode
  - **flowing** mode
- Other name for the modes is pull and push modes
- When a readable stream is in the paused mode, we can use the `read()` method to read from the stream on demand, however, for a readable stream in the flowing mode, the data is continuously flowing and we have to listen to events to consume it.
- To manually switch between these two stream modes, you can use the `resume()` and `pause()` methods.

![Readable Stream Modes](https://cdn-media-1.freecodecamp.org/images/1*HI-mtispQ13qm8ib5yey3g.png)

### Implementing Streams

- There are two main tasks:
  - **Implementing** the streams
  - **consuming** the streams
