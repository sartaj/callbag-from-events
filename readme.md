
# callbag-from-events

Create a Callbag from:

- any object with on/off methods,
- a DOM EventTarget,
- or a Node.JS EventEmitter.

```javascript
import fromEvents from 'callbag-from-events'
import { map, filter } from 'callbag-basics'
import { ipcMain } from 'electron'
import { nodeEvents } from './server'

const chatReceived = fromEvents(nodeEvents, 'chat-received')
  |> filter(message => message.length > 0)
  |> map(message => ({ chat: message }))

const buttonClicked = fromEvents(document.getElementById('start'), 'click')

const processCompleted = fromEvents(ipcMain, 'process-completed')
```