import test from 'ava'
import * as EVENTS from 'kable-core/lib/constants/events'
import * as EVENTS_TYPES from 'kable-core/lib/constants/eventTypes'
import { ErrorDuplicatedNodeEmitter } from 'kable-core/lib/eventsDriver'
import kableInternals from '../lib/kableInternals'

test.serial('detect duplicated id error event', async (t) => {
    const foo = kableInternals('foo')
    const fooDuplicated = kableInternals('foo')

    await foo.up()
    await fooDuplicated.up()

    const err = (): Promise<ErrorDuplicatedNodeEmitter> => new Promise((resolve) => {
        foo.on(EVENTS.UNIVERSAL.ERROR, (payload) => {
            if (payload.type === EVENTS_TYPES.CUSTOM_ERROR_TYPE.DUPLICATE_NODE_ID) {
                resolve(payload)
            }
        })
    })

    const errEvent = await err()

    t.is(errEvent.payload.id, fooDuplicated.id)
    t.is(errEvent.payload.iid, fooDuplicated.iid)
    t.is(errEvent.payload.port, fooDuplicated.port)
    t.truthy(errEvent.payload.address)

    foo.down()
    fooDuplicated.down()
})