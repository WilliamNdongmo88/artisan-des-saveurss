process.env.NODE_ENV = "test";
require("dotenv").config({ path: ".env.test" });

const request = require("supertest");
const { app, startServer, closeServer } = require("../app");
let server; // Pour stocker l'instance du serveur

let token;
let createdProductId;
let file;
let fileId;


describe("Products API", () => {
    beforeAll(async () => {
        // Démarrer le serveur et initialiser la base de données
        server = await startServer();
    });

    describe("Auth API", () => {
        const userData = { email: "test@example.com", password: "Password123!", role: "admin" };

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

    describe("Products API", () => {
        const productData = {
            name: "Chipolatas",
            description: "Fine saucisse de porc idéale pour le barbecue.",
            price: 523.88,
            category: "saucisses-et-variantes",
            origin: "France",
            preparation: "Griller 10–12 min à feu moyen sans percer, jusqu’à belle coloration uniforme.",
            recette: "Porc, Sel, Sucre, Epices",
            is_available: true,
            stock_quantity: 20,
            unit: "pièce",
            is_featured: false,
            file: "string"
        };

        test("CREATE PRODUCTS", async () => {
            const res = await request(app)
            .post("/api/products").send(productData)
            .set("Authorization", `Bearer ${token}`);

            
            console.log("### res body:: ", res.body);
            createdProductId = res.body.product.id;
            file = res.body.product.file;
            fileId = file.id;
            expect(res.statusCode).toBe(201);
            expect(res.body.product).toHaveProperty("name", "Chipolatas");
        });

        test("GET PRODUCTS", async () => {
            const res = await request(app)
            .get("/api/products").send(productData);

            expect(res.statusCode).toBe(200);
            expect(Array.isArray(res.body)).toBe(true);
            expect(res.body.length).toBe(1);
        });

        test("UPDATE PRODUCT", async () => {
            const updateData = {
                name: "Chipolatas épicées",
                price: 524,
                file: {
                    id: 1,
                    image_url: "https://res.cloudinary.com/dcjjwjheh/image",
                    public_id: "artisan-des-saveurs/products/fvoarfsb3cd4asv"
                }
            };

            const res = await request(app)
                .put(`/api/products/${createdProductId}`)
                .set("Authorization", `Bearer ${token}`)
                .send(updateData);

             console.log("### res body:: ", res.body);
            // ✅ Vérifications
            expect(res.statusCode).toBe(200);
            expect(res.body.message).toBe("Produit mis à jour avec succès");
        });

        test("DELETE PRODUCT", async () => {
            const res = await request(app)
                .delete(`/api/products/${createdProductId}`)
                .set("Authorization", `Bearer ${token}`)

            expect(res.statusCode).toBe(200);
        })

    });

    afterAll(async () => {
        // Fermer le serveur et le pool de connexion
        await closeServer();
    });
});