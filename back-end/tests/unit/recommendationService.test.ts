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

describe("post/recommendations/:id/upvote", () => {
  it("should vote if sucessfull", async () => {
    jest
      .spyOn(recommendationRepository, "find")
      .mockResolvedValueOnce(recommendation);
    jest
      .spyOn(recommendationRepository, "updateScore")
      .mockResolvedValueOnce({ ...recommendation, score: 6 });
    await recommendationService.upvote(recommendation.id);
    expect(recommendationRepository.updateScore).toBeCalledTimes(1);
  });

  it("should throw not found if recommendation does not exist", async () => {
    jest.spyOn(recommendationRepository, "find").mockResolvedValueOnce(null);
    expect(recommendationService.upvote(1)).rejects.toEqual({
      type: "not_found",
      message: "",
    });
  });
});

describe("post/recommendations/:id/downvote", () => {
  it("should downvote if sucessfull", async () => {
    jest
      .spyOn(recommendationRepository, "find")
      .mockResolvedValueOnce(recommendation);
    const update = jest
      .spyOn(recommendationRepository, "updateScore")
      .mockResolvedValueOnce({ ...recommendation, score: -3 });

    await recommendationService.downvote(recommendation.id);

    expect(update).toBeCalledTimes(2);
  });

  it("should throw not found if recommendation does not exist", async () => {
    jest.spyOn(recommendationRepository, "find").mockResolvedValueOnce(null);
    expect(recommendationService.upvote(1)).rejects.toEqual({
      type: "not_found",
      message: "",
    });
  });

  it("should remove a recommendation when score is -5", async () => {
    const recommendationBellow = {
        ...recommendation, score: -5
    }
    jest.spyOn(recommendationRepository, "find").mockResolvedValueOnce(recommendationBellow);
    jest.spyOn(recommendationRepository, "updateScore").mockResolvedValueOnce({...recommendation, score: -6});
    jest.spyOn(recommendationRepository, "remove").mockResolvedValueOnce();
    await recommendationService.downvote(recommendation.id);
    expect(recommendationRepository.remove).toBeCalledTimes(1);
  });
});
