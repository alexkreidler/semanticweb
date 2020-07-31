import { version, rexp, process } from "./index";

import { data } from "./mapper/mapper";

import { parseJSON } from "./input";

test("exports version", () => {
  expect(version).toBeDefined();
});

test("reads json file", () => {
  expect(parseJSON("../data/empty-person.jsonld")).toBeDefined();
});

test("reads json file", async () => {
  const ret = await rexp("../data/empty-person.jsonld");
  expect(ret).toBeDefined();
});

test("works on JS data", async () => {
  process(data);
});
