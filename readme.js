
/**
 * # callbag-from-events
 *
 * Create a Callbag from:
 * - an object with on/off methods,
 * - a DOM EventTarget,
 * - or a Node.JS EventEmitter.
 * 
 * ## Example
 * ```
 * import fromEvents from 'callbag-from-events'
 * import { map, filter } from 'callbag-basics'
 * import WebSocket from 'ws'
 * import { server } from './server'
 *
 * const wss = new WebSocket.Server({ server })
 * 
 * const chatReceived = fromEvents(wss, 'chat-received')
 *   |> filter(message => message.length > 0)
 *   |> map(message => ({ chat: message })) 
 * ```
 */

const pairs = [
  ['on', 'off'],
  ['addListener', 'removeListener'],
  ['addEventListener', 'removeEventListener']
]

const getEventMethod = target => {
  for (let i = 0; i < pairs.length; i++) {
    if (
      typeof target[pairs[i][0]] === 'function' &&
      typeof target[pairs[i][1]] === 'function'
    ) return pairs[i]
  }
  throw new Error(
    "fromEvents can't find an event method pair: " + 
    "on/off, addListener/removeListener, addEventListener/removeEventListener"
  )
}

const fromEvents = (target, eventToListen) => {
  const [subscriber, unsubscriber] = getEventMethod(target)

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
