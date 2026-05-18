const request = require("supertest");
const app = require("../server");

describe("K8S Demo App", () => {
  test("GET /health should return OK", async () => {
    const response = await request(app).get("/health");

    expect(response.statusCode).toBe(200);
    expect(response.text).toBe("OK");
  });

  test("GET / should return the app message", async () => {
    const response = await request(app).get("/");

    expect(response.statusCode).toBe(200);
    expect(response.text).toContain("Hello from Fares Kubernetes CI/CD app");
  });
});