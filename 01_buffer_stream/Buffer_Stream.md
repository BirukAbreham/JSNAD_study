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

- The most important events on a readable stream are:
  - The `data` event, which is emitted whenever the stream passes a chunk of data to the consumer
  - The `end` event, which is emitted when there is no more data to be consumed from the stream.
- The most important events on a writable stream are:
  - The `drain` event, which is a signal that the writable stream can receive more data.
  - The `finish` event, which is emitted when all data has been flushed to the underlying system.
