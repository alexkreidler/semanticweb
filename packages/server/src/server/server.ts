import { DynamicServer, APIFrontend, Backend } from "../api/services"
import { ResultAsync, ok, Result, okAsync } from "neverthrow"
import { QuadStore } from "../backends/node-quadstore"

class SemanticServer implements DynamicServer {
    private frontends: APIFrontend<any>[]
    private backends: Backend[]

    private version = "0.1.0"

    registerFrontend<C>(f: APIFrontend<C>): Result<{}, {}> {
        this.frontends.push(f)
        return ok({})
    }
    registerBackend(b: Backend): Result<{}, {}> {
        this.backends.push(b)
        return ok({})
    }
    start(): ResultAsync<{}, {}> {
        console.log("Starting Semantic Server v" + this.version)

        for (const frontend of this.frontends) {
            console.log(frontend)
        }
        for (const backend of this.backends) {
            console.log(backend)
        }
        return okAsync({})
    }
}

export const BasicServer = new SemanticServer()
BasicServer.registerBackend(new QuadStore())
