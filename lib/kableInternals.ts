import { NodeStack } from 'kable-core/lib/orchester'
import { EventsDriver } from 'kable-core/lib/eventsDriver'
import { NodeDependency } from 'kable-core/lib/dependency'
import { Node } from 'kable-core/lib/node'
import {
    Kable
    , KableCore
    , Implementables
    , KableComposedOptions
    , implementations
} from 'kable-core/lib/kable'

export interface KableInternals extends Kable, EventsDriver {
    node: Node
    /** Get queue of promises, which are waiting to take a node */
    getPickQueue(): Map<symbol, { id: string }>
    /** Get node work pool, is a stack of enlisted and organized nodes, used to apply the load balancer algorithm */
    getNodeWorkPool(): NodeStack
    /** Get node dependecies */
    getDepedencies(): NodeDependency[]
}

const KableInternals = (implement: Implementables): KableInternals => {
    const { eventsDriver, nodePicker, orchester, dependencyManager, node } = implement
    const k = KableCore(implement)
    const Kdriver = Object.assign(eventsDriver, k)
    return Object.assign(Kdriver, {
        getPickQueue: nodePicker.getPickQueue
        , getNodeWorkPool: orchester.getNodeWorkPool
        , getDepedencies() {
            return Array.from(dependencyManager.getAll().values())
        }
        , get node() {
            return node
        }

    })
}

const createKableInternals = (id?: string, options?: KableComposedOptions) => {
    const opts = {
        id
        , ...options
    }

    return KableInternals(implementations(opts))
}

export default createKableInternals