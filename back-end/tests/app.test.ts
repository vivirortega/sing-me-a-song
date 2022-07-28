import supertest from "supertest";
import app from "../src/app";

const data = {name: "testando4", youtubeLink: "https://www.youtube.com/watch?v=-oP2XaDt300"};


describe("POST/recommendations", () => {
    it("given name and link, add a new music recomendation", async () => {
        const response = await supertest(app).post("/recommendations").send(data);
        expect(response.status).toBe(201);
    })

    it("should return status 422 when sent with name and link", async () => {
        const response = await supertest(app).post("/recommendations").send();
        expect(response.status).toBe(422);
    })

    it("should return status 409 when name is already created", async () => {
        const response = await supertest(app).post("/recommendations").send(data);
        expect(response.status).toBe(409);
    })
})



