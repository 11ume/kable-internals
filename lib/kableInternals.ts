import core from 'kable-core'
import { NodeStack } from 'kable-core/dist/lib/orchester'
import { EventsDriver } from 'kable-core/dist/lib/eventDriver'
import { NodeDependency } from 'kable-core/dist/lib/dependency'
import { Kable, Implementables, KableComposedOptions } from 'kable-core/dist/lib/kable'

export interface KableInternals extends Kable, EventsDriver {
    /** Get queue of promises, which are waiting to take a node */
    getPickQueue(): Map<symbol, { id: string }>
    /** Get node work pool, is a stack of enlisted and organized nodes, used to apply the load balancer algorithm */
    getNodeWorkPool(): NodeStack
    /** Get node dependecies */
    getDepedencies(): NodeDependency[]
}

const KableDev = (implement: Implementables): KableInternals => {
    const { eventsDriver, nodePicker, orchester, dependencyManager } = implement
    const k = Kable(implement)
    const Kdriver = Object.assign(eventsDriver, k)
    return Object.assign(Kdriver, {
        getPickQueue: nodePicker.getPickQueue
        , getNodeWorkPool: orchester.getNodeWorkPool
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

    return KableDev(core.Kable.implementations(opts))
}

export default createKableInternals