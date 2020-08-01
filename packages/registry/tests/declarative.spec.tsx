import { Registry, Component } from "../src/index"
import { JsonLdProcessor } from "jsonld"
import React from "react"

import {
    render,
    fireEvent,
    waitFor,
    screen,
    getByText,
    act,
    waitForElement,
    findByTestId,
    getByTestId,
    waitForElementToBeRemoved,
} from "@testing-library/react"

const dat = {
    "@context": "https://schema.org",
    "@type": "Person",
    address: {
        "@type": "PostalAddress",
        addressLocality: "Colorado Springs",
        addressRegion: "CO",
        postalCode: "80840",
        streetAddress: "100 Main Street",
    },
    colleague: [
        "http://www.example.com/JohnColleague.html",
        "http://www.example.com/JameColleague.html",
    ],
    email: "info@example.com",
    image: "janedoe.jpg",
    jobTitle: "Research Assistant",
    name: "Jane Doe",
}

test("data expands properly", async () => {
    let exp = await JsonLdProcessor.expand(dat)
    console.log(exp)
})

test("renders", async () => {
    let exp = await JsonLdProcessor.expand(dat)
    const App = () => (
        <div className="app" data-testid="person">
            <Registry data={exp}>
                <Component
                    iri="https://schema.org/Person"
                    component={({ data }) => (
                        <div className="person">
                            {console.log(data)}
                            <h1>Person: {data.name}</h1>
                        </div>
                    )}
                ></Component>
                <Component iri="https://schema.org/Article">
                    {({ data }) => (
                        <div>
                            <h1>Article: {data.name}</h1>
                        </div>
                    )}
                </Component>
            </Registry>
        </div>
    )
    // We aren't doing snapshot testing RN b/c our code is highly dynamic and logic-focused

    let { container } = render(<App></App>)
    screen.debug()

    let ld = getByText(container, "Loading")

    console.log("Test completed")

    // await waitForElementToBeRemoved(ld, {
    //     timeout: 3000,
    // })

    await waitFor(
        () => {
            console.log("calling waiting function")
            screen.debug()

            expect(getByTestId(container, "person")).toBeDefined()
        },
        {
            interval: 100,
            timeout: 1000,
            // onT
        }
    )
    // const el = await waitForElement(() => getByTestId(container, "person"))

    // await waitFor(() => {
    //     expect()
    // })
    // console.log(container)
})
