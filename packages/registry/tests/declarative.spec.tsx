import { Registry, Component } from "../src/index"
import { JsonLdProcessor } from "jsonld"
import React from "react"

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
    let jsx = (
        <div className="app">
            <Registry data={exp}>
                <Component iri="https://schema.org/Person">
                    {({ data }: { data: any }) => (
                        <div className="person">
                            <h1>Person: {data.name}</h1>
                        </div>
                    )}
                </Component>
                <Component iri="https://schema.org/Article">
                    {({ data }: { data: any }) => (
                        <div>
                            <h1>Article: {data.name}</h1>
                        </div>
                    )}
                </Component>
            </Registry>
        </div>
    )
    // TODO: do snapshot testing
    // TODO: validate structure of rendered DOM
})
