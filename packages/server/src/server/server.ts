import {
    DynamicServer,
    APIFrontend,
    Backend,
    ComponentType,
    CommonComponent,
} from "../api/services"
import { Ok, Result } from "ts-results"
import Logger from "bunyan"

const buildLogger = (
    parent: DynamicServer,
    type: ComponentType,
    name: string
) =>
    Logger.createLogger({
        name: parent.name + "-" + type + "-" + name,
        stream: process.stdout,
        level: "debug",
        version: parent.version,
    })

const addLogger = (parent: DynamicServer, component: CommonComponent) => {
    component.log = buildLogger(parent, component.type, component.name)
}

class SemanticServer implements DynamicServer {
    type: ComponentType.Server
    name = "semanticweb"
    log: Logger
    private frontends: APIFrontend<any>[] = []
    // private backends: Backend[] = []
    private mapping: { [frontend: string]: Backend } = {}

    version = "0.1.0"

    constructor() {
        addLogger(this, this)
    }

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
            this.log.info("stopping frontend", frontend.name)
            await frontend.stop()
        }
        for (const backend of Object.values(this.mapping)) {
            this.log.info("stopping backend", backend.name)
            await backend.stop()
        }
        return Ok(undefined)
    }
    async start(): Promise<Result<undefined, undefined>> {
        this.log.info("Starting Semantic Server v" + this.version)

        for (const backend of Object.values(this.mapping)) {
            this.log.info("starting backend:", backend.name)
            addLogger(this, backend)
            await backend.start()
        }
        for (const frontend of this.frontends) {
            this.log.info("starting frontend:", frontend.name)
            frontend.backend = this.mapping[frontend.name]
            addLogger(this, frontend)
            await frontend.start()
        }
        this.log.info("done starting")
        return Ok(undefined)
    }
}

export const BasicServer = new SemanticServer()
