# The Node events module

- The `events` module provides us the EventEmitter class, which is key to working with events in Node.

- Initialization

```JavaScript
const EventEmitter = require('events');
const eventEmitter = new EventEmitter();
```

- This object exposes, among many others, the `on` and `emit` methods
  - `emit` is used to trigger an event
  - `on` is used to add a callback function that's going to be executed when the event is triggered

## Emit and listen for events

- Let's create a `start` event, and as a matter of providing a sample, we react to that by just loggin to the console:

```JavaScript
eventEmitter.on('start', () => {
  console.log('started');
});
```

- When we run

```JavaScript
eventEmitter.emit('start');
```

> `addListener()` is an alias for `on()`, in case you see that used.

## Passing arguments to the event

- You can pass arguments to the event handler by passing them as additional arguments to `emit()`:

```JavaScript
eventEmitter.on('start', (start, end) => {
  console.log(`started form ${start} to ${end}`);
});

eventEmitter.emit('start', 1, 100);
```

## Listen for an event just once

- The EvenEmitter object also exposes the `once()` method, which you can use to create a one-time event listener
- _Once that event is fired, the listener stops listening._

```JavaScript
eventEmitter.once('start', () => {
  console.log(`started!`);
});

eventEmitter.emit('start');
eventEmitter.emit('start'); // not going to fire
```

## Removing an event listener

- Once you create an event listener, you can remove it using the `removeListener()` method
- To do so, we must first have a reference to the callback function of `on`

```JavaScript
eventEmitter.on('start', () => {
  console.log('started!');
});

// Extract the callback

const callback = () => {
  console.log('started');
}

eventEmitter.on('start', callback);

// So that later you can call
eventEmitter.removeListener('start', callback);
// You can also remove all listeners at once on an event, using:
eventEmitter.removeAllListeners('start');
```

## Getting the events registered

- The `eventNames()` method, called on an EventEmitter object instance, returns an array of strings taht represent the events registered on the current EventListener:

```JavaScript
const EventEmitter = require('events');
const eventEmiiter = new EventEmitter();

eventEmitter.on('start', () => {
  console.log('started');
});

eventEmitter.eventNames(); // [ 'start' ]
```

- _`listenerCount()` returns the count of listeners of the event passed as parameter:_

```JavaScript
eventEmitter.listenerCount('start') // 1
```

# How to code your own event emitters in Node.js

## Understand Node internals

- The concept is quite simple: emitter objects emit named events that cause previously registered listeners to be called. So, an emitter object basically has two main features:
  - Emitting name events
  - Registering and unregistering listeners functions.

> _It's kind of like a pub/sub or observer design pattern (though not exactly)._
