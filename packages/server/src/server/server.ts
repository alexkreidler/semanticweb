import { DynamicServer, APIFrontend, Backend } from "../api/services"
import { Ok, Result } from "ts-results"

class SemanticServer implements DynamicServer {
    private frontends: APIFrontend<any>[] = []
    // private backends: Backend[] = []
    private mapping: { [frontend: string]: Backend } = {}

    private version = "0.1.0"

    registerFrontend<C>(f: APIFrontend<C>): Result<undefined, undefined> {
        this.frontends.push(f)
        return Ok(undefined)
    }
    registerBackend(
        frontendName: string,
        b: Backend
    ): Result<undefined, undefined> {
        this.mapping[frontendName] = b
        return Ok(undefined)
    }
    async stop(): Promise<Result<undefined, undefined>> {
        for (const frontend of this.frontends) {
            console.log("stopping frontend", frontend.name)
            await frontend.stop()
        }
        for (const backend of Object.values(this.mapping)) {
            console.log("stopping backend", backend.name)
            await backend.stop()
        }
        return Ok(undefined)
    }
    async start(): Promise<Result<undefined, undefined>> {
        console.log("Starting Semantic Server v" + this.version)

        for (const backend of Object.values(this.mapping)) {
            console.log("starting backend:", backend.name)
            await backend.start()
        }
        for (const frontend of this.frontends) {
            console.log("starting frontend:", frontend.name)
            frontend.backend = this.mapping[frontend.name]
            await frontend.start()
        }
        console.log("done starting")
        return Ok(undefined)
    }
}

export const BasicServer = new SemanticServer()
