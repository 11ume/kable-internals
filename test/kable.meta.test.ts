import test from 'ava'
import * as EVENTS from 'kable-core/lib/constants/events'
import { NodeEmitter } from 'kable-core/lib/eventsDriver'
import kableInternals from '../lib/kableInternals'

test.serial('state: send and recibe metadata', async (t) => {
    const foo = kableInternals('foo', { meta: { id: 'foo', description: 'im foo' } })
    const bar = kableInternals('bar')
    await foo.up()
    await bar.up()

    const recibe = (): Promise<NodeEmitter> => new Promise((resolve) => {
        bar.on(EVENTS.DISCOVERY.ADVERTISEMENT, resolve)
    })

    const data = await recibe()
    t.deepEqual(data.meta, { id: 'foo', description: 'im foo' })

    foo.down()
    bar.down()
})