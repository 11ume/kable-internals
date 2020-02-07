import { NodePoolStackEntries } from 'kable-core/lib/orchester'
import { EventsDriver } from 'kable-core/lib/eventsDriver'
import { NodeDependency } from 'kable-core/lib/dependency'
import {
    Kable
    , KableCore
    , Implementables
    , KableComposedOptions
    , implementables
} from 'kable-core/lib/kable'

export interface KableInternals extends Kable, EventsDriver {
    /** Get queue of promises, which are waiting to take a node */
    getPickQueue(): Map<symbol, { id: string }>
    /** Get node work pool, is a stack of enlisted and organized nodes, used to apply the load balancer algorithm */
    getNodePoolStack(): NodePoolStackEntries
    /** Get node dependecies */
    getDepedencies(): NodeDependency[]
}

const KableInternals = (implement: Implementables): KableInternals => {
    const { eventsDriver, nodePicker, orchester, dependencyManager } = implement
    const k = KableCore(implement)
    const Kdriver = Object.assign(eventsDriver, k)
    return Object.assign(Kdriver, {
        getPickQueue: nodePicker.getPickQueue
        , getNodePoolStack: orchester.getNodePoolStack
        , getDepedencies() {
            return Array.from(dependencyManager.getAll().values())
        }
    })
}

const createKableInternals = (id?: string, options?: KableComposedOptions) => {
    const opts = {
        id
        , ...options
    }

    return KableInternals(implementables(opts))
}

export default createKableInternals