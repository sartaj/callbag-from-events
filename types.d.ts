import { Source } from 'callbag'

type GenericEventEmitter = {
  on(): any,
  off(): any
}

type NodeEventEmitter = {
  addListener(): any,
  removeListener(): any
}

type DOMEventEmitter = {
  addEventListener(): any,
  removeEventListener(): any
}

type FromEventsFunction = GenericEventEmitter | DOMEventEmitter | NodeEventEmitter

declare const fromEvents: (eventFn: FromEventsFunction, eventName: string) => Source<number>
export default fromEvents