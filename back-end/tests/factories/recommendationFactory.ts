import { Recommendation } from "@prisma/client";
import { prisma } from "../../src/database";
import { faker } from '@faker-js/faker';

function recommendation() {
  const name = faker.name.firstName();
  const video = {
    name: name,
    youtubeLink: "https://www.youtube.com/watch?v=EG9t7Wsc9YU",
  };
  return video;
}

function sameRecommendation(){
  const video = {
    name: "glide - mitski",
    youtubeLink: "https://www.youtube.com/watch?v=EG9t7Wsc9YU",
  };
  return video;
}

function wrongRecommendation() {
  const video = {
    name: 1,
    youtubeLink: "https://www.youtube.com/watch?v=EG9t7Wsc9YU",
  };
  return video;
}

export async function newRecomendation() {
  const music = recommendation();
  const result = await prisma.recommendation.create({ data: music });
  return result.id;
}

export async function sameName() {
  const music = sameRecommendation();
  const result = await prisma.recommendation.create({ data: music });
  return result.name;
}

const recommendationFactory = {
  recommendation,
  wrongRecommendation,
  newRecomendation, sameName 
};

export default recommendationFactory;
