import test from 'ava'
import * as EVENTS from 'kable-core/lib/constants/events'
import { NodeEmitter } from 'kable-core/lib/eventsDriver'
import { NODE_STATES } from 'kable-core/lib/node'
import kableInternals from '../lib/kableInternals'

test.serial('check up avertisament event payload state', async (t) => {
    const foo = kableInternals('foo')
    const bar = kableInternals('bar')

    await foo.up()
    await bar.up()

    const node = (): Promise<NodeEmitter> => new Promise((resolve) => {
        foo.on(EVENTS.DISCOVERY.ADVERTISEMENT, resolve)
    })

    const n = await node()
    t.is(n.state, NODE_STATES.RUNNING)
    t.truthy(new Date(n.up.time))

    foo.down()
    bar.down()
})

test.serial('check down uregistre event payload state', async (t) => {
    const foo = kableInternals('foo')
    const bar = kableInternals('bar')

    await foo.up()
    await bar.up()
    await foo.down()

    const node = (): Promise<NodeEmitter> => new Promise((resolve) => {
        bar.on(EVENTS.DISCOVERY.UNREGISTRE, resolve)
    })

    const n = await node()
    t.is(n.state, NODE_STATES.DOWN)
    t.truthy(new Date(n.down.time))

    bar.down()
})

test.serial('check up not upning avertisament event payload state', async (t) => {
    const foo = kableInternals('foo')
    const bar = kableInternals('bar')

    await foo.up(false)
    await bar.up()

    const node = (): Promise<NodeEmitter> => new Promise((resolve) => {
        bar.on(EVENTS.DISCOVERY.ADVERTISEMENT, (payload) => {
            resolve(payload)
        })
    })

    const n = await node()
    t.is(n.state, NODE_STATES.UP)
    t.truthy(new Date(n.up.time))

    foo.down()
    bar.down()
})

test.serial('check stop avertisament event payload state', async (t) => {
    const foo = kableInternals('foo')
    const bar = kableInternals('bar')

    const reason = 'any reason'
    await foo.up()
    await bar.up()
    foo.stop(reason)

    const node = (): Promise<NodeEmitter> => new Promise((resolve) => {
        bar.on(EVENTS.DISCOVERY.ADVERTISEMENT, (payload) => {
            payload.stop && resolve(payload)
        })
    })

    const n = await node()
    t.is(n.state, NODE_STATES.STOPPED)
    t.is(n.stop.reason, reason)
    t.truthy(new Date(n.stop.time))

    foo.down()
    bar.down()
})