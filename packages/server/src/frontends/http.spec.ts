import { HTTPFrontend } from "./http"

import { Backend } from "../api/services"
import { mock } from "jest-mock-extended"
import request from "request"
import { Ok } from "ts-results"
import { resolve } from "path"
import { MessageType, Message } from "../api/messages"
import superagent from "superagent"
import Logger from "bunyan"

describe("http server", () => {
    // Unfortunately, with this limited of a mock, any response from backend will be undefined, which will not allow the service to return real data
    const MockedBackend = mock<Backend>()

    let frontend
    beforeAll(async () => {
        const debugLogger = Logger.createLogger({
            name: "http-frontend-debug",
            stream: process.stdout,
            level: "debug",
            version: "0.1.0",
        })
        const httpConfig = {
            mapping: [
                {
                    name: "person",
                    type: "schema:Person",
                },
                {
                    name: "book",
                    type: "schema:Book",
                },
            ],
        }
        frontend = new HTTPFrontend(httpConfig, debugLogger)

        frontend.backend = MockedBackend

        await frontend.start().then(() => {
            console.log("started")
        })
    })

    beforeEach(() => {
        MockedBackend.handleMessage.mockClear()
    })

    test("can make a basic request, get no result error", async () => {
        const out = await superagent.get("http://0.0.0.0:9000/book")

        const res = out.body

        expect(res ? res.error : undefined).toBeDefined()

        // Since we don't implement the mock besides undefined, we should get an error
        expect.assertions(1)
    })

    test("gets response for pre-loaded Person objects", async () => {
        MockedBackend.handleMessage.mockReturnValueOnce(
            new Promise((resolve, reject) => {
                resolve(
                    Ok({
                        requestID: "MOCK-01",
                        type: MessageType.Response,
                        quads: [],
                    } as Message)
                )
            })
        )
        const out = await superagent.get("http://0.0.0.0:9000/book")

        const res = out.body

        expect(res ? res.error : undefined).toBeNil()

        console.log("Person", res)

        expect(MockedBackend.handleMessage).toHaveBeenCalledTimes(1)

        expect.assertions(2)
    })

    afterAll(async () => {
        console.log("stopping")

        await frontend.stop()
    })
})
