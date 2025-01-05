import { test, expect, mock } from "bun:test";
import { fileUpload } from "../src/utils/file-upload";

test("valid zod file upload validation", () => {
  const validImage = new File(["test"], "test.jpeg", {
    type: "image/jpeg",
  });

  const result = fileUpload().safeParse(validImage);

  console.log(result.error);

  expect(result.success).toBe(true);
});
