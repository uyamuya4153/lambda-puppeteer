import { handler } from "./index";

describe("handler", () => {
  it("should return a response with status code 200 and success message", async () => {
    const response = await handler();
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(JSON.stringify({ success: true }));
  });
});
