import test from 'ava'
import { NodeStack } from 'kable-core/lib/orchester'
import kableInternals, { KableInternals } from '../lib/kableInternals'

test.serial('orchester: check node work pool', async (t) => {
    const a = kableInternals('a')
    const b = kableInternals('b')
    const c = kableInternals('c')
    const a1 = kableInternals('a', { replica: true })
    const a2 = kableInternals('a', { replica: true })

    await b.up()
    await c.up()
    await a.up()
    await a1.up()
    await a2.up()

    const getStack = (k: KableInternals): Promise<NodeStack> => new Promise((r) => {
        setTimeout(() => r(k.getNodeWorkPool()), 2100)
    })

    const stacka = await getStack(a)
    t.deepEqual(stacka.b.queue, [b.index])
    t.deepEqual(stacka.c.queue, [c.index])

    const stackb = await getStack(b)
    const min = Math.min(...stackb.a.queue)
    const max = Math.max(...stackb.a.queue)

    t.deepEqual(stackb.a.queue, [min, stackb.a.queue[1], max])
    t.deepEqual(stackb.c.queue, [c.index])
    t.true(stackb.a.next instanceof Function)

    const stackc = await getStack(c)
    t.deepEqual(stackc.a.queue, [min, stackc.a.queue[1], max])
    t.deepEqual(stackc.b.queue, [b.index])
    t.true(stackc.a.next instanceof Function)

    b.down()
    c.down()
    a.down()
    a1.down()
    a2.down()
})

test.serial('orchester: check async node work pool', async (t) => {
    const a = kableInternals('a')
    const b = kableInternals('b')
    const c = kableInternals('c')
    const a1 = kableInternals('a', { replica: true })
    const a2 = kableInternals('a', { replica: true })

    b.up()
    setTimeout(c.up, 4000)
    setTimeout(a.up, 3000)
    a1.up()
    a2.up()

    const getStack = (k: KableInternals): Promise<NodeStack> => new Promise((r) => {
        setTimeout(() => r(k.getNodeWorkPool()), 5000)
    })

    const stacka = await getStack(a)
    t.deepEqual(stacka.b.queue, [b.index])
    t.deepEqual(stacka.c.queue, [c.index])

    const stackb = await getStack(b)
    const min = Math.min(...stackb.a.queue)
    const max = Math.max(...stackb.a.queue)

    t.deepEqual(stackb.a.queue, [min, stackb.a.queue[1], max])
    t.deepEqual(stackb.c.queue, [c.index])
    t.true(stackb.a.next instanceof Function)

    const stackc = await getStack(c)
    t.deepEqual(stackc.a.queue, [min, stackc.a.queue[1], max])
    t.deepEqual(stackc.b.queue, [b.index])
    t.true(stackc.a.next instanceof Function)

    b.down()
    c.down()
    a.down()
    a1.down()
    a2.down()
})