export default class EventProducer<T> {
    private listeners = new Map()

    public addEventListener(type: T, listener: (event?: any) => void) {
        const list = this.listeners.get(type) ?? []
        list.push(listener)
        this.listeners.set(type, list)
    }

    protected emit(type: T, event?: any) {
        for (const l of (this.listeners.get(type) ?? [])) {
            l(event);
        }
    }
}