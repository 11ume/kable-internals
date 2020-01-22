// import Modules from 'kable-core'

// export interface KableInternals extends Modules.Kable, EventDriver.EventsDriver {
//     /** Get queue of promises, which are waiting to take a node */
//     getPickQueue(): Map<symbol, { id: string }>
//     /** Get node work pool, is a stack of enlisted and organized nodes, used to apply the load balancer algorithm */
//     getNodeWorkPool(): Modules.Orchester.NodeStack
//     /** Get node dependecies */
//     getDepedencies(): Modules.Dependency.NodeDependency[]
// }

// const KableDev = (implement: Modules.Kable.Implementables): KableInternals => {
//     const { eventsDriver, nodePicker, orchester, dependencyManager } = implement
//     const k = Kable(implement)
//     const Kdriver = Object.assign(eventsDriver, k)
//     return Object.assign(Kdriver, {
//         getPickQueue: nodePicker.getPickQueue
//         , getNodeWorkPool: orchester.getNodeWorkPool
//         , getDepedencies() {
//             return Array.from(dependencyManager.getAll().values())
//         }
//     })
// }

// const createKableInternals = (id?: string, options?: Modules.Kable.KableComposedOptions) => {
//     const opts = {
//         id
//         , ...options
//     }

//     return KableDev(Modules.Kable.implementations(opts))
// }

// export default createKableInternals