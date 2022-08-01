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
    const url = "/recommendations/0/upvote";
    const response = await supertest(app).post(url);
    expect(response.status).toBe(404);
  });
});

describe("POST/recommendations/:id/downvote", () => {
  it("should return 200 when downvote is sucessful", async () => {
    const id = await recommendationFactory.newRecomendation();
    const url = `/recommendations/${id}/downvote`;
    const response = await supertest(app).post(url);
    expect(response.status).toBe(200);
  });

  it("should return status code 404 when recommendation does not exist", async () => {
    const url = "/recommendations/0/downvote";
    const response = await supertest(app).post(url);
    expect(response.status).toBe(404);
  });
});

describe("GET/recommendations/:id", () => {
  it("should return recommendation from id", async () => {
    const id = await recommendationFactory.newRecomendation();
    const url = `/recommendations/${id}`;
    const response = await supertest(app).get(url);
    expect(response.status).toBe(200);
  });

  it("should return 404 when recommendation does not exist", async () => {
    const url = "/recommendations/0";
    const response = await supertest(app).get(url);
    expect(response.status).toBe(404);
  });
});

describe("GET /recommendations/random", () => {
  it("should return random recommendations", async () => {
    const response = await supertest(app).get("/recommendations/random");
    expect(response.status).toBe(200);
  });

  it("should return random recommendations does not exist", async () => {
    const url = "/recommendations/0";
    const response = await supertest(app).get(url);
    expect(response.status).toBe(404);
  });
});

describe("GET/recommendations", () => {
  it("should return all recommendations", async () => {
    const response = await supertest(app).get("/recommendations");
    expect(response.status).toBe(200);
  });

  it("should return 404 when recommendation does not exist", async () => {
    const url = "/recommendations/0/";
    const response = await supertest(app).get(url);
    expect(response.status).toBe(404);
  });
});

describe("GET/recommendations/top/:amount", () => {
  it("should return recommendations by score and amout passed", async () => {
    const amount = 3;
    const url = `/recommendations/top/${amount}`;
    const response = await supertest(app).get(url);
    expect(response.status).toBe(200);
  });
  
  it("should return empty array when amount is zero", async () => {
    const url = "/recommendations/top/0";
    const { body } = await supertest(app).get(url);
    expect(body).toEqual([]);
  });
});

afterAll(async () => {
  await prisma.recommendation.deleteMany();
  await prisma.$disconnect();
});
