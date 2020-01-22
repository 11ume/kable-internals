import test from 'ava'
import KableCore from 'kable-core'
import kableDev from '../lib/kableInternals'
import { NodeEmitter } from 'kable-core/dist/lib/eventDriver'

test.serial('state: send and recibe metadata', async (t) => {
    const foo = kableDev('foo', { meta: { id: 'foo', description: 'im foo' } })
    const bar = kableDev('bar')
    const { EVENTS: { DISCOVERY } } = KableCore
    await foo.up()
    await bar.up()

    const recibe = (): Promise<NodeEmitter> => new Promise((resolve) => {
        bar.on(DISCOVERY.ADVERTISEMENT, resolve)
    })

    const data = await recibe()
    t.deepEqual(data.meta, { id: 'foo', description: 'im foo' })

    foo.down()
    bar.down()
})