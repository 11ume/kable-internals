import { ExecutionContext } from 'ava'
import * as os from 'os'
import * as EVENTS from 'kable-core/lib/constants/events'
import { NodeEmitter } from 'kable-core/lib/eventsDriver'
import { KableInternals } from '../../lib/kableInternals'
import { pid } from 'kable-core/lib/constants/core'
import { createUuid, genRandomNumber } from 'kable-core/lib/utils'
import { NodeRegistre, NODE_STATES } from 'kable-core/lib/node'

export const checkNodeRegistre = (t: ExecutionContext, r: NodeRegistre, k: KableInternals) => {
    t.is(r.id, k.id)
    t.is(r.port, k.port)
    t.truthy(r.host)
    t.is(r.pid, k.pid)
    t.is(r.iid, k.iid)
    t.is(r.hostname, os.hostname())
    t.is(typeof r.ensured, 'boolean')
    t.truthy(new Date(r.up.time))
}

export const checkNodeEvent = (t: ExecutionContext
    , p: NodeEmitter
    , k: KableInternals
    , type: EVENTS.DISCOVERY) => {
    t.is(p.event, type)
    t.is(p.id, k.id)
    t.is(p.pid, k.pid)
    t.is(p.iid, k.iid)
    t.is(p.port, k.port)
    t.truthy(p.host)
    t.is(p.hostname, os.hostname())
    t.is(typeof p.ensured, 'boolean')
    t.is(p.rinfo.port, 5000)
    t.truthy(p.rinfo.size)
    t.truthy(p.rinfo.family)
    t.truthy(p.rinfo.address)
}

export const createNodeRegistre = (id: string, state: NODE_STATES, replica: { is: boolean, of: string } = {
    is: false
    , of: null
}): NodeRegistre => {
    return {
        id
        , port: 5000
        , host: ''
        , pid
        , iid: createUuid()
        , meta: null
        , index: genRandomNumber()
        , replica
        , hostname: ''
        , ensured: false
        , lastSeen: 0
        , state
        , up: null
        , down: null
        , stop: null
    }
}
