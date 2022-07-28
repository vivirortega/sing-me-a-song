import supertest from "supertest";
import app from "../src/app";
import recommendationFactory from "./factories/recommendationFactory";
import { prisma } from "../src/database";

describe("POST/recommendations", () => {
    it("given name and link, add a new music recomendation", async () => {
        const recommendation = recommendationFactory.recommendation();
        const response = await supertest(app).post("/recommendations").send(recommendation);
        expect(response.status).toBe(201);
    })

    it("should return status 422 when sent with no name and link", async () => {
        const response = await supertest(app).post("/recommendations").send();
        expect(response.status).toBe(422);
    })

    it("should return status 409 when name is already created", async () => {
        const recommendation = recommendationFactory.recommendation();
        const response = await supertest(app).post("/recommendations").send(recommendation);
        expect(response.status).toBe(409);
    })

    it("should return status 422 when sent with wrong input values", async () => {
        const recommendation = recommendationFactory.wrongRecommendation();
        const response = await supertest(app).post("/recommendations").send(recommendation);
        expect(response.status).toBe(422);
    })
})

afterAll(async () => {
    await prisma.recommendation.deleteMany();
    await prisma.$disconnect();
  });


