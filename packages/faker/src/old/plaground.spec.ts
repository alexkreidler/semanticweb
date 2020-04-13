import { version, match } from "./playground";

test("exports version", () => {
  expect(version).toBeDefined();
});


test("exports version", async () => {
    expect(match()).toBeDefined();
  });