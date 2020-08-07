# Developer Notes

Streams and EventEmitters are a little too complex to add for now.

EventEmitters are implemented really simply in Node

Beware of the difference between:

-   `async () => {}` - this has to be called to return something Promise-like. Sometimes, it is even compiled down further when the runtime doesn't support promises
-   `new Promise()`

Usually, when using a callback-based API, your only option is to wrap in a Promise and then call resolve in callback.
