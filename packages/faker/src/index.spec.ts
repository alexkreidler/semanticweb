import { version, parseJSON, rexp } from "./index";

test("exports version", () => {
  expect(version).toBeDefined();
});

test("reads json file", () => {
  expect(parseJSON("../data/empty-person.jsonld")).toBeDefined();
});

test("reads json file", async () => {
  const ret = await rexp("../data/empty-person.jsonld")
  expect(ret).toBeDefined();
});