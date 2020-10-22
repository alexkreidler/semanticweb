Log after adding multiple people to the graph

It seems we've learned that we need to add once to our graph at least, maybe other.

However identifying by ID in the frame itself would get rid of this problem

```json
{
    "@context": "https://schema.org",
    "@type": "Person",
    "address": {
        "@type": "PostalAddress",
        "addressLocality": "Colorado Springs",
        "addressRegion": "CO",
        "postalCode": "80840",
        "streetAddress": "100 Main Street"
    },
    "colleague": ["http://www.example.com/JohnColleague.html", "http://www.example.com/JameColleague.html"],
    "email": "info@example.com",
    "image": "janedoe.jpg",
    "jobTitle": "Research Assistant",
    "name": "Jane Doe",
    "alumniOf": "Dartmouth",
    "birthPlace": "Philadelphia, PA",
    "birthDate": "1979-10-12",
    "height": "72 inches",
    "gender": "female",
    "memberOf": "Republican Party",
    "nationality": "Albanian",
    "telephone": "(123) 456-6789",
    "url": "http://www.example.com",
    "sameAs": [
        "https://www.facebook.com/",
        "https://www.linkedin.com/",
        "http://twitter.com/",
        "http://instagram.com/",
        "https://plus.google.com/"
    ],
    "worksFor": {
        "@type": "Organization",
        "address": {
            "@type": "PostalAddress",
            "addressLocality": "Paris, France",
            "postalCode": "F-75002",
            "streetAddress": "38 avenue de l'Opera"
        },
        "email": "secretariat(at)google.org",
        "faxNumber": "( 33 1) 42 68 53 01",
        "member": [
            {
                "@type": "Organization"
            },
            {
                "@type": "Organization"
            }
        ],
        "alumni": [
            {
                "@type": "Person",
                "name": "Jack Dan"
            },
            {
                "@type": "Person",
                "name": "John Smith"
            }
        ],
        "name": "Google.org (GOOG)",
        "telephone": "( 33 1) 42 68 53 00"
    }
}
```

```
yarn run v1.22.0
warning package.json: No license field
$ /home/alex/c2/semanticweb/node_modules/.bin/jest --runInBand
  console.log
    {
        "@graph": [
            {
                "@type": "http://schema.org/Person",
                "http://schema.org/address": {
                    "@id": "_:b1",
                    "@type": "http://schema.org/PostalAddress",
                    "http://schema.org/addressLocality": "Colorado Springs",
                    "http://schema.org/addressRegion": "CO",
                    "http://schema.org/postalCode": "80840",
                    "http://schema.org/streetAddress": "100 Main Street"
                },
                "http://schema.org/alumniOf": "Dartmouth",
                "http://schema.org/birthDate": {
                    "@type": "http://schema.org/Date",
                    "@value": "1979-10-12"
                },
                "http://schema.org/birthPlace": "Philadelphia, PA",
                "http://schema.org/colleague": [
                    {
                        "@id": "http://www.example.com/JohnColleague.html"
                    },
                    {
                        "@id": "http://www.example.com/JameColleague.html"
                    }
                ],
                "http://schema.org/email": "info@example.com",
                "http://schema.org/gender": "female",
                "http://schema.org/height": "72 inches",
                "http://schema.org/image": {
                    "@id": "janedoe.jpg"
                },
                "http://schema.org/jobTitle": "Research Assistant",
                "http://schema.org/memberOf": "Republican Party",
                "http://schema.org/name": "Jane Doe",
                "http://schema.org/nationality": "Albanian",
                "http://schema.org/sameAs": [
                    {
                        "@id": "https://www.facebook.com/"
                    },
                    {
                        "@id": "https://www.linkedin.com/"
                    },
                    {
                        "@id": "http://twitter.com/"
                    },
                    {
                        "@id": "http://instagram.com/"
                    },
                    {
                        "@id": "https://plus.google.com/"
                    }
                ],
                "http://schema.org/telephone": "(123) 456-6789",
                "http://schema.org/url": {
                    "@id": "http://www.example.com"
                },
                "http://schema.org/worksFor": {
                    "@id": "_:b2",
                    "@type": "http://schema.org/Organization",
                    "http://schema.org/address": {
                        "@id": "_:b3",
                        "@type": "http://schema.org/PostalAddress",
                        "http://schema.org/addressLocality": "Paris, France",
                        "http://schema.org/postalCode": "F-75002",
                        "http://schema.org/streetAddress": "38 avenue de l'Opera"
                    },
                    "http://schema.org/alumni": [
                        {
                            "@id": "_:b4",
                            "@type": "http://schema.org/Person",
                            "http://schema.org/name": "Jack Dan"
                        },
                        {
                            "@id": "_:b5",
                            "@type": "http://schema.org/Person",
                            "http://schema.org/name": "John Smith"
                        }
                    ],
                    "http://schema.org/email": "secretariat(at)google.org",
                    "http://schema.org/faxNumber": "( 33 1) 42 68 53 01",
                    "http://schema.org/member": [
                        {
                            "@id": "_:b6",
                            "@type": "http://schema.org/Organization"
                        },
                        {
                            "@id": "_:b7",
                            "@type": "http://schema.org/Organization"
                        }
                    ],
                    "http://schema.org/name": "Google.org (GOOG)",
                    "http://schema.org/telephone": "( 33 1) 42 68 53 00"
                }
            },
            {
                "@id": "_:b1",
                "@type": "http://schema.org/PostalAddress",
                "http://schema.org/addressLocality": "Colorado Springs",
                "http://schema.org/addressRegion": "CO",
                "http://schema.org/postalCode": "80840",
                "http://schema.org/streetAddress": "100 Main Street"
            },
            {
                "@id": "_:b2",
                "@type": "http://schema.org/Organization",
                "http://schema.org/address": {
                    "@id": "_:b3",
                    "@type": "http://schema.org/PostalAddress",
                    "http://schema.org/addressLocality": "Paris, France",
                    "http://schema.org/postalCode": "F-75002",
                    "http://schema.org/streetAddress": "38 avenue de l'Opera"
                },
                "http://schema.org/alumni": [
                    {
                        "@id": "_:b4",
                        "@type": "http://schema.org/Person",
                        "http://schema.org/name": "Jack Dan"
                    },
                    {
                        "@id": "_:b5",
                        "@type": "http://schema.org/Person",
                        "http://schema.org/name": "John Smith"
                    }
                ],
                "http://schema.org/email": "secretariat(at)google.org",
                "http://schema.org/faxNumber": "( 33 1) 42 68 53 01",
                "http://schema.org/member": [
                    {
                        "@id": "_:b6",
                        "@type": "http://schema.org/Organization"
                    },
                    {
                        "@id": "_:b7",
                        "@type": "http://schema.org/Organization"
                    }
                ],
                "http://schema.org/name": "Google.org (GOOG)",
                "http://schema.org/telephone": "( 33 1) 42 68 53 00"
            },
            {
                "@id": "_:b3",
                "@type": "http://schema.org/PostalAddress",
                "http://schema.org/addressLocality": "Paris, France",
                "http://schema.org/postalCode": "F-75002",
                "http://schema.org/streetAddress": "38 avenue de l'Opera"
            },
            {
                "@id": "_:b4",
                "@type": "http://schema.org/Person",
                "http://schema.org/name": "Jack Dan"
            },
            {
                "@id": "_:b5",
                "@type": "http://schema.org/Person",
                "http://schema.org/name": "John Smith"
            },
            {
                "@id": "_:b6",
                "@type": "http://schema.org/Organization"
            },
            {
                "@id": "_:b7",
                "@type": "http://schema.org/Organization"
            },
            {
                "@id": "http://instagram.com/"
            },
            {
                "@id": "http://twitter.com/"
            },
            {
                "@id": "http://www.example.com"
            },
            {
                "@id": "http://www.example.com/JameColleague.html"
            },
            {
                "@id": "http://www.example.com/JohnColleague.html"
            },
            {
                "@id": "https://plus.google.com/"
            },
            {
                "@id": "https://www.facebook.com/"
            },
            {
                "@id": "https://www.linkedin.com/"
            },
            {
                "@id": "janedoe.jpg"
            }
        ]
    }

      at Object.<anonymous> (src/main.test.ts:20:17)

  console.log
    {
        "@context": "https://schema.org",
        "@graph": [
            {
                "type": "Person",
                "address": {
                    "type": "PostalAddress",
                    "addressLocality": "Colorado Springs",
                    "addressRegion": "CO",
                    "postalCode": "80840",
                    "streetAddress": "100 Main Street"
                },
                "alumniOf": "Dartmouth",
                "birthDate": "1979-10-12",
                "birthPlace": "Philadelphia, PA",
                "colleague": [
                    "http://www.example.com/JohnColleague.html",
                    "http://www.example.com/JameColleague.html"
                ],
                "email": "info@example.com",
                "gender": "female",
                "height": "72 inches",
                "image": "janedoe.jpg",
                "jobTitle": "Research Assistant",
                "memberOf": "Republican Party",
                "name": "Jane Doe",
                "nationality": "Albanian",
                "sameAs": [
                    "https://www.facebook.com/",
                    "https://www.linkedin.com/",
                    "http://twitter.com/",
                    "http://instagram.com/",
                    "https://plus.google.com/"
                ],
                "telephone": "(123) 456-6789",
                "url": "http://www.example.com",
                "worksFor": {
                    "type": "Organization",
                    "address": {
                        "type": "PostalAddress",
                        "addressLocality": "Paris, France",
                        "postalCode": "F-75002",
                        "streetAddress": "38 avenue de l'Opera"
                    },
                    "alumni": [
                        {
                            "id": "_:b4",
                            "type": "Person",
                            "name": "Jack Dan"
                        },
                        {
                            "id": "_:b5",
                            "type": "Person",
                            "name": "John Smith"
                        }
                    ],
                    "email": "secretariat(at)google.org",
                    "faxNumber": "( 33 1) 42 68 53 01",
                    "member": [
                        {
                            "type": "Organization"
                        },
                        {
                            "type": "Organization"
                        }
                    ],
                    "name": "Google.org (GOOG)",
                    "telephone": "( 33 1) 42 68 53 00"
                }
            },
            {
                "id": "_:b4",
                "type": "Person",
                "name": "Jack Dan"
            },
            {
                "id": "_:b5",
                "type": "Person",
                "name": "John Smith"
            }
        ]
    }

      at Object.<anonymous> (src/main.test.ts:29:17)

  console.log
    {
        "@context": "https://schema.org",
        "@graph": [
            {
                "type": "Person",
                "name": "Jane Doe"
            },
            {
                "type": "Person",
                "name": "Jack Dan"
            },
            {
                "type": "Person",
                "name": "John Smith"
            }
        ]
    }

      at Object.<anonymous> (src/main.test.ts:45:17)

  console.log
    {
        "@context": "https://schema.org",
        "@graph": [
            {
                "type": "Person",
                "address": {
                    "type": "PostalAddress",
                    "addressLocality": "Colorado Springs",
                    "addressRegion": "CO",
                    "postalCode": "80840",
                    "streetAddress": "100 Main Street"
                },
                "alumniOf": "Dartmouth",
                "birthDate": "1979-10-12",
                "birthPlace": "Philadelphia, PA",
                "colleague": [
                    "http://www.example.com/JohnColleague.html",
                    "http://www.example.com/JameColleague.html"
                ],
                "email": "info@example.com",
                "gender": "female",
                "height": "72 inches",
                "image": "janedoe.jpg",
                "jobTitle": "Research Assistant",
                "memberOf": "Republican Party",
                "name": "Jane Doe",
                "nationality": "Albanian",
                "sameAs": [
                    "https://www.facebook.com/",
                    "https://www.linkedin.com/",
                    "http://twitter.com/",
                    "http://instagram.com/",
                    "https://plus.google.com/"
                ],
                "telephone": "(123) 456-6789",
                "url": "http://www.example.com",
                "worksFor": {
                    "type": "Organization",
                    "address": {
                        "type": "PostalAddress",
                        "addressLocality": "Paris, France",
                        "postalCode": "F-75002",
                        "streetAddress": "38 avenue de l'Opera"
                    },
                    "alumni": [
                        {
                            "id": "_:b4",
                            "type": "Person",
                            "name": "Jack Dan"
                        },
                        {
                            "id": "_:b5",
                            "type": "Person",
                            "name": "John Smith"
                        }
                    ],
                    "email": "secretariat(at)google.org",
                    "faxNumber": "( 33 1) 42 68 53 01",
                    "member": [
                        {
                            "type": "Organization"
                        },
                        {
                            "type": "Organization"
                        }
                    ],
                    "name": "Google.org (GOOG)",
                    "telephone": "( 33 1) 42 68 53 00"
                }
            },
            {
                "id": "_:b4",
                "type": "Person",
                "name": "Jack Dan"
            },
            {
                "id": "_:b5",
                "type": "Person",
                "name": "John Smith"
            }
        ]
    }

      at Object.<anonymous> (src/main.test.ts:61:17)

 FAIL  src/main.test.ts
  JSON-LD framing tests
    ✓ to flat graph (118 ms)
    ✓ to sameish graph (93 ms)
    ✓ to explicitized graph (54 ms)
    ✕ with Require-All, true match (56 ms)
    ✓ with Require-All, false match (52 ms)

  ● JSON-LD framing tests › with Require-All, true match

    expect(received).toContain(expected) // indexOf

    Matcher error: received value must not be null nor undefined

    Received has value: undefined

      61 |         console.log(prettyPrint(framed))
      62 |         expect(framed).toBeDefined()
    > 63 |         expect(framed["name"]).toContain("Doe")
         |                                ^
      64 |     })
      65 |
      66 |     test("with Require-All, false match", async () => {

      at Object.<anonymous> (src/main.test.ts:63:32)

Test Suites: 1 failed, 1 total
Tests:       1 failed, 4 passed, 5 total
Snapshots:   0 total
Time:        1.833 s, estimated 2 s
Ran all test suites.
  console.log
    {
        "@context": "https://schema.org"
    }

      at Object.<anonymous> (src/main.test.ts:80:17)

error Command failed with exit code 1.
info Visit https://yarnpkg.com/en/docs/cli/run for documentation about this command.
```
