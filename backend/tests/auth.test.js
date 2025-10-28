process.env.NODE_ENV = "test";
require("dotenv").config({ path: ".env.test" });

const request = require("supertest");
const { app, startServer, closeServer } = require("../app");
let server; // Pour stocker l'instance du serveur

let token;

describe("Auth API", () => {
    beforeAll(async () => {
        // Démarrer le serveur et initialiser la base de données
        server = await startServer();
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
        // Fermer le serveur et le pool de connexion
        await closeServer();
    });
});



