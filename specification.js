const describe = require('tape')

const { pipe, forEach } = require('callbag-basics') 
const fromEvents = require('./index')

describe('callbag-from-events', assert => {
  const it = assert.test

  it('should create and remove an event from a Node Event event', assert => {
    assert.plan(4)

    const nodeEvents = {  
      addListener: (name, listener) => {
        assert.equals(name, 'beep', 'addListener for beep');
        setTimeout(() => {
          listener('boop')
        }, 50)
      },
      removeListener: (name, listener) => {
        assert.equals(name, 'beep', 'removeListener for beep');
      }
    }

    const fromBeep = fromEvents(nodeEvents, 'beep');

    pipe(
      fromBeep,
      forEach(e => {
        assert.equals(e, 'boop', 'Node Events should have sent a click.')
      })
    )

    fromBeep(0, (type, data) => {
      if(type === 0) {
        data(2)
      }
    })
  })

  it('should create and remove am event from a DOM element', assert => {
    assert.plan(4)

    const elem = {  
      addEventListener: (name, listener) => {
        assert.equals(name, 'click', 'addEventListener for click');
        setTimeout(() => {
          listener('clicked')
        }, 50)
      },
      removeEventListener: (name, listener) => {
        assert.equals(name, 'click', 'removeEventListener for click');
      }
    }

    const fromClick = fromEvents(elem, 'click');

    pipe(
      fromClick,
      forEach(e => {
        assert.equals(e, 'clicked', 'DOM Event should have sent a click.')
      })
    )

    fromClick(0, (type, data) => {
      if(type === 0) {
        data(2)
      }
    })  
  })

  it('should create and remove am event from a off/on object', assert => {
    assert.plan(4)

    const onOffEventEmitter = {  
      on: (name, listener) => {
        assert.equals(name, 'beep', 'on for beep');
        setTimeout(() => {
          listener('boop')
        }, 50)
      },
      off: (name, listener) => {
        assert.equals(name, 'beep', 'off for beep');
      }
    }

    const fromBeep = fromEvents(onOffEventEmitter, 'beep');

    pipe(
      fromBeep,
      forEach(e => {
        assert.equals(e, 'boop', 'emitter should have sent a boop.')
      })
    )

    fromBeep(0, (type, data) => {
      if(type === 0) {
        data(2)
      }
    })  
  })

  it('should throw on an incompatible event object', assert => {
    assert.plan(1)

    const wrongEvent = {  
      ofn: () => {},
      offf: () => {}
    }

    assert.throws(() => {
      fromEvents(wrongEvent, 'beep');
    })
  })

})