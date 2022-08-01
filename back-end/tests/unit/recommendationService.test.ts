import { faker } from "@faker-js/faker";
import { jest } from "@jest/globals";

import { recommendationRepository } from "../../src/repositories/recommendationRepository";
import { recommendationService } from "../../src/services/recommendationsService";

const video = {
  name: "glide - mitski",
  youtubeLink: "https://www.youtube.com/watch?v=EG9t7Wsc9YU",
};

const recommendation = {
  id: 1,
  name: "glide - mitski",
  youtubeLink: "https://www.youtube.com/watch?v=EG9t7Wsc9YU",
  score: 100,
};

describe("post/recommendations", () => {
  it("should create recommendation", async () => {
    jest
      .spyOn(recommendationRepository, "findByName")
      .mockResolvedValueOnce(null);
    jest.spyOn(recommendationRepository, "create").mockResolvedValueOnce();
    await recommendationService.insert(video);
    expect(recommendationRepository.create).toBeCalledTimes(1);
  });

  it("should return error when name is already created", async () => {
    jest
      .spyOn(recommendationRepository, "findByName")
      .mockResolvedValueOnce(recommendation);
    expect(recommendationService.insert(recommendation)).rejects.toEqual({
      type: "conflict",
      message: "Recommendations names must be unique",
    });
  });
});
