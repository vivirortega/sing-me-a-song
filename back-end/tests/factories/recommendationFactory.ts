function recommendation() {
  const video = {
    name: "mitski-glide(cover)",
    youtubeLink: "https://www.youtube.com/watch?v=EG9t7Wsc9YU",
  };
  return video;
}

function wrongRecommendation(){
  const video = {
    name: 1,
    youtubeLink: "https://www.youtube.com/watch?v=EG9t7Wsc9YU"
  };
  return video;
}

const recommendationFactory = { recommendation, wrongRecommendation };

export default recommendationFactory;
