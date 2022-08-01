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
  score: 5,
};

const allRecommendations = [
  {
    id: 1,
    name: faker.lorem.words(3),
    youtubeLink: "https://www.youtube.com/watch?v=EG9t7Wsc9YU",
    score: 100,
  },
  {
    id: 2,
    name: faker.lorem.words(3),
    youtubeLink: "https://www.youtube.com/watch?v=NFhJRTdmviA",
    score: 20,
  },
  {
    id: 3,
    name: faker.lorem.words(3),
    youtubeLink: "https://www.youtube.com/watch?v=WCphVz0ZGns",
    score: 300,
  },
];

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

  it("should remove a recommendation when score is bellow -5", async () => {
    const recommendationBellow = {
      ...recommendation,
      score: -5,
    };
    jest
      .spyOn(recommendationRepository, "find")
      .mockResolvedValueOnce(recommendationBellow);
    jest
      .spyOn(recommendationRepository, "updateScore")
      .mockResolvedValueOnce({ ...recommendation, score: -6 });
    jest.spyOn(recommendationRepository, "remove").mockResolvedValueOnce();
    await recommendationService.downvote(recommendation.id);
    expect(recommendationRepository.remove).toBeCalledTimes(1);
  });
});

describe("get/recommendations", () => {
  it("should return all recommendations", async () => {
    const findAll = jest
      .spyOn(recommendationRepository, "findAll")
      .mockResolvedValueOnce(allRecommendations);
    await recommendationService.get();
    expect(findAll).toHaveBeenCalledTimes(1);
  });
});

describe("get/recommendations/top/:amount", () => {
  it("should return top recommendations by amount", async () => {
    const amount = 2;

    const getByAmount = jest
      .spyOn(recommendationRepository, "getAmountByScore")
      .mockResolvedValueOnce(allRecommendations);
    await recommendationService.getTop(amount);
    expect(getByAmount).toBeCalledWith(amount);
  });

  describe("/recommendations/random", () => {
    it("get random recommendation - 70%", async () => {
      jest.spyOn(Math, "random").mockReturnValueOnce(0.5);
      jest
        .spyOn(recommendationRepository, "findAll")
        .mockResolvedValueOnce([allRecommendations[1]]);
      const result = await recommendationService.getRandom();
      expect(result.score).toEqual(allRecommendations[1].score);
    });

    it("should throw not found if recommendation does not exist", async () => {
      jest.spyOn(recommendationRepository, "findAll").mockResolvedValueOnce([]);
      await expect(recommendationService.getRandom()).rejects.toEqual({
        type: "not_found",
        message: "",
      });
    });

    it("get random recommendation - 30%", async () => {
      jest.spyOn(Math, "random").mockReturnValueOnce(0.9);
      jest
        .spyOn(recommendationRepository, "findAll")
        .mockResolvedValueOnce([allRecommendations[0]]);
      const result = await recommendationService.getRandom();
      expect(result.score).toEqual(allRecommendations[0].score);
    });
  });

  it("get random recommendation - 100%", async () => {
    jest.spyOn(Math, "random").mockReturnValueOnce(0.9);
    jest
      .spyOn(recommendationRepository, "findAll")
      .mockResolvedValueOnce(allRecommendations);
    const result = await recommendationService.getRandom();
    expect(result).not.toBeNull();
  });
});
