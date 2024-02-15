import request from "supertest";
import express, { Request, Response } from "express";

import { setupSecurityMiddleware } from "../../src/middleware/securityMiddleware";

describe("Security Middleware", () => {
  const app = express();

  setupSecurityMiddleware(app);

  app.get("/test", (req: Request, res: Response) => {
    res.send("Test route");
  });

  it("should set CORS headers for allowed origin", async () => {
    const origin = "http://localhost";
    const response = await request(app).get("/test").set("Origin", origin);

    expect(response.headers["access-control-allow-origin"]).toBe(origin);
    expect(response.headers["access-control-allow-methods"]).toBe(
      "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS"
    );
    expect(response.headers["access-control-allow-headers"]).toBe(
      "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    expect(response.headers["access-control-allow-credentials"]).toBe("true");
  });

  it("should not set CORS headers for disallowed origin", async () => {
    const origin = "http://invalid-origin.com";
    const response = await request(app).get("/test").set("Origin", origin);

    expect(response.headers["access-control-allow-origin"]).toBeFalsy();
    expect(response.headers["access-control-allow-methods"]).toBeFalsy();
    expect(response.headers["access-control-allow-headers"]).toBeFalsy();
    expect(response.headers["access-control-allow-credentials"]).toBeFalsy();
  });
});
