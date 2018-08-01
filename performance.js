const MOCK_PAIR_SIZE = 10000
const MOCK_TARGET_SIZE = 10000000

function generateMockTarget(size) {
  let target = {};
  for (var x = 0; x > size; x++) {
    const key = Math.random() * (size - 1) + 1
    target[key] = () => {}
  }
  // Make sure to have valid methods
  target.on = () => {}
  target.off = () => {}

  return Object.freeze(target)
}

function generateMockPairs(size) {
  const fakeArrays = Array.from(Array(size/2)).map((arg, index) => [index, index])

  const pairs = [
    ...fakeArrays,
    ['addListener', 'removeListener'],
    ['addEventListener', 'removeEventListener'],
    ['on', 'off'],
    ...fakeArrays,
  ]

  return pairs
}

function forLoop(pairs, target) {
  let subscriber, unsubscriber
  for (let i = 0; i < pairs.length; i++) {
    if (
      typeof target[pairs[i][0]] === "function" &&
      typeof target[pairs[i][1]] === "function"
    ) {
      subscriber = pairs[i][0]
      unsubscriber = pairs[i][1]
      break
    }
  }

  if(!subscriber || !unsubscriber) throw new Error('function failed')
}

function findIndex(pairs, target) {
  const pair = pairs.findIndex(
    pair =>
      typeof target[pair[0]] === "function" &&
      typeof target[pair[1]] === "function"
  )

  const subscriber = pairs[pair][0]
  const unsubscriber = pairs[pair][1]

  if(!subscriber || !unsubscriber) throw new Error('function failed')
}

function find(pairs, target) {
  const pair = pairs.find(
    pair =>
      typeof target[pair[0]] === "function" &&
      typeof target[pair[1]] === "function"
  )

  const subscriber = pair[0]
  const unsubscriber = pair[1]

  if(!subscriber || !unsubscriber) throw new Error('function failed')
}

function forEach(pairs, target) {
    let subscriber, unsubscriber
    pairs.forEach(pair => {
      if (
        typeof target[pair[0]] === "function" &&
        typeof target[pair[1]] === "function"
      ) {
        subscriber = pair[0]
        unsubscriber = pair[1]
      }
    })
  
    if(!subscriber || !unsubscriber) throw new Error('function failed')
}

function forEachWithBreak(pairs, target) {
  let BreakException = {}
  let subscriber, unsubscriber
  try {
    pairs.forEach(pair => {
      if (
        typeof target[pair[0]] === "function" &&
        typeof target[pair[1]] === "function"
      ) {
        subscriber = pair[0]
        unsubscriber = pair[1]
        throw BreakException
      }
    })
  } catch(e) {
    if(e !== BreakException) throw e
  }

  if(!subscriber || !unsubscriber) throw new Error('function failed')
}

function forEachSmarter(pairs, target) {
  if(pairs.length > 1000000) {
    forLoop(pairs, target)
  } else {
    forEach(pairs, target)
  }
}

function filter(pairs, target) {
    const [subscriber, unsubscriber] = pairs.filter(   
      pair =>
        typeof target[pair[0]] === "function" &&
        typeof target[pair[1]] === "function"
      )[0]
  
    if(!subscriber || !unsubscriber) throw new Error('function failed')
}

function run() {
    const pairs = generateMockPairs(MOCK_PAIR_SIZE)
    const target = generateMockTarget(MOCK_TARGET_SIZE)

    console.log('\n# Performance Test of Different Array Search Methods.\n')
    console.log('The purpose of this test to to verify the optimal way to find ' + 
                'if an object has event listening methods.')
    console.log(`\n**Using Node ${process.version}**\n`)

    console.time('forLoop')
    forLoop(pairs, target)
    console.timeEnd('forLoop')

    console.time('forEach')
    forEach(pairs, target)
    console.timeEnd('forEach')

    console.time('forEachWithBreak')
    forEachWithBreak(pairs, target)
    console.timeEnd('forEachWithBreak')

    console.time('forEachSmarter')
    forEachSmarter(pairs, target)
    console.timeEnd('forEachSmarter')

    console.time('findIndex')
    findIndex(pairs, target)
    console.timeEnd('findIndex')

    console.time('find')
    find(pairs, target)
    console.timeEnd('find')

    console.time('filter')
    filter(pairs, target)
    console.timeEnd('filter')
}

run()