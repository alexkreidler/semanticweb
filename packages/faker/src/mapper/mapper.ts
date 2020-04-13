import * as faker from "faker";

const schemaOrgMap: {
  [subjectKey: string]: { [predicateKey: string]: Function };
} = {
  "https://schema.org/Person": {
    email: faker.internet.email,
    //   image: "janedoe.jpg",
    jobTitle: faker.name.jobTitle,
    name: faker.name.findName,
    //   alumniOf: "Dartmouth",
    //   birthPlace: "Philadelphia, PA",
    //   birthDate: "1979-10-12",
    height: () => faker.random.number.apply({}, { max: 72 }) + " inches",
    //   gender: ,
    //   memberOf: "Republican Party",
    nationality: faker.address.country,
    telephone: faker.phone.phoneNumber,
    url: faker.internet.url,
  },
};

export const data = {
  "@type": "https://schema.org/Person",
  email: faker.internet.email,
  //   image: "janedoe.jpg",
  jobTitle: faker.name.jobTitle,
  name: faker.name.findName,
  //   alumniOf: "Dartmouth",
  //   birthPlace: "Philadelphia, PA",
  //   birthDate: "1979-10-12",
  height: () => faker.random.number.apply({}, { max: 72 }) + " inches",
  //   gender: ,
  //   memberOf: "Republican Party",
  nationality: faker.address.country,
  telephone: faker.phone.phoneNumber,
  url: faker.internet.url,
};
