export interface Pub<T, E> {
    publish(topic: string, message: T): E
}
export interface Sub<T, E> {
    subscribe(topic: string, listener: (message: T) => void): E
}

export interface PubSub<T, E> extends Pub<T, E>, Sub<T, E> {}

type HandlerSync<T> = (message: T) => void
type HandlerAsync<T> = (message: T) => Promise<void>
type Handler<T> = HandlerAsync<T> | HandlerSync<T>
import isPromise from "is-promise"
/** InMemoryPubSub implements a basic pub-sub architecture completely in memory, ignoring any potential errors */
export class InMemoryPubSub<T> implements PubSub<T, void> {
    // TODO: maybe allow for different types on different topics
    private subscribers: Map<string, Handler<T>[]> = new Map()

    async publish(topic: string, message: T, async?: boolean): Promise<void> {
        console.log("publishing")

        // TODO: handle no subscribers?
        const tasks = []
        this.subscribers[topic].forEach((handler: Handler<T>) => {
            try {
                const f = handler(message)
                // We need to be on a target version of JS that supports promises to detect this
                if (isPromise(f)) {
                    if (!async) {
                        console.error(
                            `Provided handler ${handler.toString()} is asynchronous, but you didn't call with async=true`
                        )
                    }
                    console.log("pushing task")

                    tasks.push(f)
                } else {
                    console.log(`Used non-async handler ${handler.toString()}`)
                }
            } catch (err) {
                console.log(
                    "Pub-sub error during InMemoryPubSub.publish(). Continuing"
                )
                console.log(err)
            }
        })
        if (async) {
            console.log("waiting for tasks")

            await Promise.all(tasks)
        }
    }
    /** Subscribes to the given topic. The callback should be a synchronous, fast function that returns quickly, otherwise it will block other subscribers from running */
    subscribe(topic: string, callback: Handler<T>): void {
        if (this.subscribers[topic] == undefined) {
            this.subscribers[topic] = []
        }
        this.subscribers[topic].push(callback)
        return
    }
}
