export default class EventProducer<T, E> {
    private listeners = new Map()

    public addEventListener(type: T, listener: (event?: E) => void) {
        const list = this.listeners.get(type) ?? []
        list.push(listener)
        this.listeners.set(type, list)
    }

    protected emit(type: T, event?: E) {
        for (const l of this.listeners.get(type) ?? []) {
            l(event)
        }
    }
}
