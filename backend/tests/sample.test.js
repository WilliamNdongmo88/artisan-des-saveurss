process.env.NODE_ENV = "test";
require("dotenv").config({ path: ".env.test" });

test("CI is working", () => {
  expect(1 + 1).toBe(2);
});
