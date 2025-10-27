process.env.NODE_ENV = "test";
require("dotenv").config({ path: ".env.test" });

const pool = require("../config/bd");
const request = require("supertest");
const app = require("../app");

let token;

describe("Auth API", () => {
    beforeAll(async () => {
        const connection = await pool.getConnection();
        await connection.ping(); // optionnel, juste pour tester
        connection.release();
    });

    describe("Auth API", () => {
    const userData = { email: "test@example.com", password: "Password123!" };

    test("REGISTER USER", async () => {
        const res = await request(app).post("/api/auth/register").send(userData);
        expect(res.statusCode).toBe(201);
    });

    test("LOGIN USER", async () => {
        const res = await request(app).post("/api/auth/login").send(userData);
        console.log("LOGIN RESPONSE:", res.body);
        token = res.body.accessToken
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty("accessToken");
      });
    });

    test("ACCESS PROTECTED ROUTE", async () => {
        const res = await request(app)
        .get("/api/auth/me")
        .set("Authorization", `Bearer ${token}`);

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty("email", "test@example.com");
    });

  afterAll(async () => {
    await pool.end();
  });
});

