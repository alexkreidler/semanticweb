export interface Pub<T, E> {
    publish(topic: string, message: T): E
}
export interface Sub<T, E> {
    subscribe(topic: string, listener: (message: T) => void): E
}

export interface PubSub<T, E> extends Pub<T, E>, Sub<T, E> {}

type Handler<T> = (message: T) => void

/** InMemoryPubSub implements a basic pub-sub architecture completely in memory, ignoring any potential errors */
export class InMemoryPubSub<T> implements PubSub<T, void> {
    // TODO: maybe allow for different types on different topics
    private subscribers: Map<string, Handler<T>[]> = new Map()

    publish(topic: string, message: T) {
        // TODO: handle no subscribers?
        this.subscribers[topic].forEach((handler) => {
            try {
                handler(message)
            } catch (err) {
                console.log(
                    "Pub-sub error during InMemoryPubSub.publish(). Continuing"
                )
                console.log(err)
            }
        })
    }
    /** Subscribes to the given topic. The callback should be a synchronous, fast function that returns quickly, otherwise it will block other subscribers from running */
    subscribe(topic: string, callback: Handler<T>) {
        if (this.subscribers[topic] == undefined) {
            this.subscribers[topic] = []
        }
        this.subscribers[topic].push(topic, callback)
        return
    }
}
