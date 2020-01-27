import test from 'ava'
import * as EVENTS from 'kable-core/lib/constants/events'
import { NodeEmitter } from 'kable-core/lib/eventsDriver'
import { checkEmitterData } from 'kable-core/lib/utils/helpers'
import kableInternals from '../lib/kableInternals'

test.serial('recibe hello event', async (t) => {
    const foo = kableInternals('foo')
    const bar = kableInternals('bar')
    const check = (): Promise<NodeEmitter> => new Promise((resolve) => {
        foo.on(EVENTS.DISCOVERY.HELLO, resolve)
    })

    await foo.up()
    await bar.up()

    const n = await check()
    checkEmitterData(t, bar.node, n, {
        id: 'bar'
        , port: 5000
        , event: EVENTS.DISCOVERY.HELLO
    })

    foo.down()
    bar.down()
})

test.serial('recibe advertisement event', async (t) => {
    const foo = kableInternals('foo')
    const bar = kableInternals('bar')
    const check = (): Promise<NodeEmitter> => new Promise((resolve) => {
        foo.on(EVENTS.DISCOVERY.ADVERTISEMENT, resolve)
    })

    await foo.up()
    await bar.up()

    const n = await check()
    checkEmitterData(t, bar.node, n, {
        id: 'bar'
        , port: 5000
        , event: EVENTS.DISCOVERY.ADVERTISEMENT
    })

    foo.down()
    bar.down()
})

test.serial('recibe unregistre event', async (t) => {
    const foo = kableInternals('foo')
    const bar = kableInternals('bar')
    const check = (): Promise<NodeEmitter> => new Promise((resolve) => {
        foo.on(EVENTS.DISCOVERY.UNREGISTRE, resolve)
    })

    await foo.up()
    await bar.up()
    await bar.down()

    const n = await check()
    checkEmitterData(t, bar.node, n, {
        id: 'bar'
        , port: 5000
        , event: EVENTS.DISCOVERY.UNREGISTRE
    })

    foo.down()
})