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

// https://schema.org/version/latest/schemaorg-current-http.jsonld
// "@base": "http://schema.org",
// "@vocab": "http://schema.org",
const dat = {
    "@context": "http://schema.org",
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

// test("renders", async () => {
//     // let exp = await JsonLdProcessor.expand(dat)
//     console.log(dat)

//     const App = () => (
//         <div className="app">
//             <Registry data={dat} doExpand={true}>
//                 <Component
//                     iri="https://schema.org/Person"
//                     data-testid="person"
//                     component={({ data }) => (
//                         <div className="person">
//                             {[console.log("got data"), console.log(data)]}
//                             <h1>Person: {data.name ? data.name : "NONE"}</h1>
//                             <p>PersonP</p>
//                         </div>
//                     )}
//                 ></Component>
//                 <Component iri="https://schema.org/Article">
//                     {({ data }) => (
//                         <div>
//                             <h1>Article: {data.name}</h1>
//                         </div>
//                     )}
//                 </Component>
//             </Registry>
//         </div>
//     )
//     // We aren't doing snapshot testing RN b/c our code is highly dynamic and logic-focused

//     let { container } = render(<App></App>)
//     screen.debug()

//     let ld = getByText(container, "Loading")

//     console.log("Test completed")

//     // await waitForElementToBeRemoved(ld, {
//     //     timeout: 3000,
//     // })

//     await waitFor(
//         () => {
//             console.log("calling waiting function")
//             screen.debug()

//             expect(getByText(container, "PersonP")).toBeDefined()
//             expect(getByText(container, "Person: NONE")).toBeUndefined()
//         },
//         {
//             interval: 100,
//             timeout: 200,
//             // onT
//         }
//     )
//     // const el = await waitForElement(() => getByTestId(container, "person"))

//     // await waitFor(() => {
//     //     expect()
//     // })
//     // console.log(container)
// })
