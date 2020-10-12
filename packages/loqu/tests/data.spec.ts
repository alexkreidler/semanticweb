import { Strictness } from "../src/index"
import { FramedForm, SemanticComponent } from "../src/data"

describe("data types", () => {
    it("JSON-LD framed form", () => {
        const sc = {
            hey: "yherte",
        }

        const ds: FramedForm<typeof sc> = {
            format: "jsonld",
            form: "framed",
            frameSpec: sc,
        }
        const GL: SemanticComponent<typeof ds> = {
            selector: {
                iri: /.*/,
            },
            data: {
                strictness: Strictness.NoChecks,
                spec: ds,
            },

            component: ({ data }) => {
                console.log(data.data.hey)

                return "hey"
            },
        }
    })
})
