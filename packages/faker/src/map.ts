import * as f from "faker"
const a: { [key: string]: () => string } = {
    "http://faker.sh/Name/FirstName": f.name.firstName,
    "http://faker.sh/Name/LastName": f.name.lastName,
    "http://faker.sh/Name/FindName": f.name.findName,
    "http://faker.sh/Name/JobTitle": f.name.jobTitle,
    "http://faker.sh/Name/Prefix": f.name.prefix,
    "http://faker.sh/Name/Suffix": f.name.suffix,
    "http://faker.sh/Name/Title": f.name.title,
    "http://faker.sh/Name/JobDescriptor": f.name.jobDescriptor,
    "http://faker.sh/Name/JobArea": f.name.jobArea,
    "http://faker.sh/Name/JobType": f.name.jobType,
    "http://faker.sh/Address/ZipCode": f.address.zipCode,
    "http://faker.sh/Address/City": f.address.city,
    "http://faker.sh/Address/CityPrefix": f.address.cityPrefix,
    "http://faker.sh/Address/CitySuffix": f.address.citySuffix,
    "http://faker.sh/Address/StreetName": f.address.streetName,
    "http://faker.sh/Address/StreetAddress": f.address.streetAddress,
    "http://faker.sh/Address/StreetSuffix": f.address.streetSuffix,
    "http://faker.sh/Address/StreetPrefix": f.address.streetPrefix,
    "http://faker.sh/Address/SecondaryAddress": f.address.secondaryAddress,
    "http://faker.sh/Address/County": f.address.county,
    "http://faker.sh/Address/Country": f.address.country,
    "http://faker.sh/Address/CountryCode": f.address.countryCode,
    "http://faker.sh/Address/State": f.address.state,
    "http://faker.sh/Address/StateAbbr": f.address.stateAbbr,
    "http://faker.sh/Address/Latitude": f.address.latitude,
    "http://faker.sh/Address/Longitude": f.address.longitude,
    "http://faker.sh/Commerce/Color": f.commerce.color,
    "http://faker.sh/Commerce/Department": f.commerce.department,
    "http://faker.sh/Commerce/ProductName": f.commerce.productName,
    "http://faker.sh/Commerce/Price": f.commerce.price,
    "http://faker.sh/Commerce/ProductAdjective": f.commerce.productAdjective,
    "http://faker.sh/Commerce/ProductMaterial": f.commerce.productMaterial,
    "http://faker.sh/Commerce/Product": f.commerce.product,
    // "http://faker.sh/Company/Suffixes": f.company.suffixes,
    "http://faker.sh/Company/CompanyName": f.company.companyName,
    "http://faker.sh/Company/CompanySuffix": f.company.companySuffix,
    "http://faker.sh/Company/CatchPhrase": f.company.catchPhrase,
    "http://faker.sh/Company/Bs": f.company.bs,
    "http://faker.sh/Company/CatchPhraseAdjective": f.company.catchPhraseAdjective,
    "http://faker.sh/Company/CatchPhraseDescriptor": f.company.catchPhraseDescriptor,
    "http://faker.sh/Company/CatchPhraseNoun": f.company.catchPhraseNoun,
    "http://faker.sh/Company/BsAdjective": f.company.bsAdjective,
    "http://faker.sh/Company/BsBuzz": f.company.bsBuzz,
    "http://faker.sh/Company/BsNoun": f.company.bsNoun,
    "http://faker.sh/Database/Column": f.database.column,
    "http://faker.sh/Database/Type": f.database.type,
    "http://faker.sh/Database/Collation": f.database.collation,
    "http://faker.sh/Database/Engine": f.database.engine,
}
import { DatasetCore } from "@rdfjs/dataset"
export const makeSchemaOrgLayer = () => {
    for (const iri in a) {
        // Create a triple that is
        // IRI is a subclass of schema:Text
        // IRI is subclass of FakedValue -> which indicates that the IRI can be passed to evaluate to get a new value
        // DatasetCore.ad
    }
    // then IRI is either owl:sameAs
    // or subclassOf appropriate schema type
    // if it is a schema predicate, then further restrict schema range to the fake type

    // Then we simply verify that all input types are subclasses of FakedValue and then compute each of them
}

export const evaluate = (iri: string): string => {
    return a[iri]()
}
