import test from 'ava'
import * as EVENTS from 'kable-core/lib/constants/events'
import { NodeEmitter } from 'kable-core/lib/eventsDriver'
import { checkNodeEvent } from './utils/helpers'
import kableInternals from '../lib/kableInternals'

test.serial('discovery: recibe hello event', async (t) => {
    const foo = kableInternals('foo')
    const bar = kableInternals('bar')
    const handleHelloEvent = (): Promise<NodeEmitter> => new Promise((resolve) => {
        foo.on(EVENTS.DISCOVERY.HELLO, resolve)
    })

    await foo.up()
    await bar.up()

    const event = await handleHelloEvent()
    checkNodeEvent(t, event, bar, EVENTS.DISCOVERY.HELLO)

    foo.down()
    bar.down()
})

test.serial('discovery: recibe advertisement event', async (t) => {
    const foo = kableInternals('foo')
    const bar = kableInternals('bar')
    const handleAdvertisementEvent = (): Promise<NodeEmitter> => new Promise((resolve) => {
        foo.on(EVENTS.DISCOVERY.ADVERTISEMENT, resolve)
    })

    await foo.up()
    await bar.up()

    const event = await handleAdvertisementEvent()
    checkNodeEvent(t, event, bar, EVENTS.DISCOVERY.ADVERTISEMENT)

    foo.down()
    bar.down()
})

test.serial('discovery: recibe unregistre event', async (t) => {
    const foo = kableInternals('foo')
    const bar = kableInternals('bar')
    const handleUnregEvent = (): Promise<NodeEmitter> => new Promise((resolve) => {
        foo.on(EVENTS.DISCOVERY.UNREGISTRE, resolve)
    })

    await foo.up()
    await bar.up()
    await bar.down()

    const event = await handleUnregEvent()
    checkNodeEvent(t, event, bar, EVENTS.DISCOVERY.UNREGISTRE)

    foo.down()
})