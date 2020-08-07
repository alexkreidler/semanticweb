import { HTTPFrontend } from "./http"

import { Backend } from "../api/services"
import { mock } from "jest-mock-extended"
import request from "request"

describe("http server", () => {
    const MockedBackend = mock<Backend>()
    beforeEach(() => {
        // Clears the record of calls to the mock constructor function and its methods
        // MockedBackend.mockClear()
    })
    test("can initialize", () => {
        const frontend = new HTTPFrontend()

        frontend.backend = MockedBackend

        frontend.configure({
            mapping: [
                {
                    name: "book",
                    type: "schema:Book",
                },
            ],
        })
    })

    test("makes proper requests", async () => {
        const frontend = new HTTPFrontend()

        frontend.backend = MockedBackend

        frontend.configure({
            mapping: [
                {
                    name: "book",
                    type: "schema:Book",
                },
            ],
        })

        await frontend
            .start()
            .then(() => {
                console.log("started")
            })
            .then(() => {
                console.log("creating")

                return new Promise((resolve, reject) =>
                    request("http://0.0.0.0:9000/book", (err, resp, body) => {
                        console.log("got response")

                        expect(err).toBeNil()
                        expect(resp).toBeDefined()

                        const res = JSON.parse(body)

                        expect(res ? res.error : undefined).toBeNil()

                        expect(
                            MockedBackend.handleMessage
                        ).toHaveBeenCalledTimes(1)
                        resolve()
                    })
                )
            })
            .then(
                () =>
                    new Promise((resolve, reject) => {
                        console.log("stopping")

                        frontend.stop().then(resolve)
                    })
            )
        expect.assertions(4)
    })
})
