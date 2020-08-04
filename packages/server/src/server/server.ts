import { DynamicServer, APIFrontend, Backend } from "../api/services"
import { ResultAsync, ok, Result, okAsync } from "neverthrow"
import { QuadStore } from "../backends/node-quadstore"

class SemanticServer implements DynamicServer {
    private frontends: APIFrontend<any>[] = []
    private backends: Backend[] = []

    private version = "0.1.0"

    registerFrontend<C>(f: APIFrontend<C>): Result<{}, {}> {
        this.frontends.push(f)
        return ok({})
    }
    registerBackend(b: Backend): Result<{}, {}> {
        this.backends.push(b)
        return ok({})
    }
    stop(): ResultAsync<{}, {}> {
        for (let frontend of this.frontends) {
            console.log("stopping frontend", frontend.name)
            frontend.stop()
        }
        for (const backend of this.backends) {
            console.log("stopping backend", backend.name)
            backend.stop()
        }
        return okAsync({})
    }
    start(): ResultAsync<{}, {}> {
        console.log("Starting Semantic Server v" + this.version)

        for (const frontend of this.frontends) {
            console.log("starting frontend:", frontend.name)
        }
        for (const backend of this.backends) {
            console.log("starting backend:", backend.name)
            backend.start()
        }
        console.log("done starting")
        return okAsync({})
    }
}

export const BasicServer = new SemanticServer()
BasicServer.registerBackend(new QuadStore())
