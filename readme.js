

/**
  # callbag-from-events
 
  Create a Callbag from:
  - any object with on/off methods,
  - a DOM EventTarget,
  - or a Node.JS EventEmitter.

  ```
  import fromEvents from 'callbag-from-events'
  import { serverEvents } from './server'
  
  const chatReceived = fromEvents(serverEvents, 'chat-received')
    |> filter(message => message.length > 0)
    |> map(message => ({ chat: message })) 
  ```
 */
const fromEvents = (target, eventToListen) => {
  const pairs = [
    ['on', 'off'],
    ['addListener', 'removeListener'],
    ['addEventListener', 'removeEventListener']
  ]
  
  // Find which pair of functions this target has
  let subscriber, unsubscriber;
  for (let i = 0; i < pairs.length; i++) {
    if (
      typeof target[pairs[i][0]] === 'function' &&
      typeof target[pairs[i][1]] === 'function'
    ) {
      subscriber = pairs[i][0]
      unsubscriber = pairs[i][1]
      break;
    }
  }
  if(!subscriber || !unsubscriber) {
    throw new Error(
      "fromEvents can't find an event method pair: " + 
      "on/off, addListener/removeListener, addEventListener/removeEventListener"
    )
  }

  return (start, sink) => {
    if (start !== 0) return;

    const handler = value => {
      sink(1, value)
    }

    sink(0, t => {
      if(t === 2) target[unsubscriber](eventToListen, handler)
    })

    target[subscriber](eventToListen, handler)
  }
}

module.exports = fromEvents
