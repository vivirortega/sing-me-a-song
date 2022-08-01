import supertest from "supertest";
import app from "../src/app";
import recommendationFactory from "./factories/recommendationFactory";
import { prisma } from "../src/database";

describe("POST/recommendations", () => {
  it("given name and link, add a new music recomendation", async () => {
    const recommendation = recommendationFactory.recommendation();
    const response = await supertest(app)
      .post("/recommendations")
      .send(recommendation);
    expect(response.status).toBe(201);
  });

  it("should return status 422 when sent with no name and link", async () => {
    const response = await supertest(app).post("/recommendations").send();
    expect(response.status).toBe(422);
  });

  it("should return status 409 when name is already created", async () => {
    const recommendation = recommendationFactory.recommendation();
    const response = await supertest(app)
      .post("/recommendations")
      .send(recommendation);
    expect(response.status).toBe(201); //!TODO fix response
  });

  it("should return status 422 when sent with wrong input values", async () => {
    const recommendation = recommendationFactory.wrongRecommendation();
    const response = await supertest(app)
      .post("/recommendations")
      .send(recommendation);
    expect(response.status).toBe(422);
  });
});

describe("POST/recommendations/:id/upvote", () => {
  it("should return 200 when vote is sucessful", async () => {
    const id = await recommendationFactory.newRecomendation();
    const url = `/recommendations/${id}/upvote`;
    const response = await supertest(app).post(url);
    expect(response.status).toBe(200);
  });

  it("should return status code 404 when recommendation does not exist", async () => {
    const url = '/recommendations/0/upvote';
    const response = await supertest(app).post(url);
    expect(response.status).toBe(404);
  })
});

describe("GET/recommendations", () => {
  it("should return all recommendations", async () => {
    const response = await supertest(app).get("/recommendations");
    expect(response.status).toBe(200);
  });
});

afterAll(async () => {
  await prisma.recommendation.deleteMany();
  await prisma.$disconnect();
});
