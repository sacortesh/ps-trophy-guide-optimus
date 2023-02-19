function cleanTrophies(trophiesData) {
  trophiesData = trophiesData.filter((element) => element.title !== "");
  return trophiesData;
}

function completeMissingQueries(title, trophiesData) {
  trophiesData.forEach((element) => {
    if (!element.youtubeQuery) {
      let youtubeQuery =
        "https://www.youtube.com/results?search_query=" +
        title +
        " " +
        element.title +
        " trophy guide";
      youtubeQuery = youtubeQuery.replace(/\s/g, "+");
      element.youtubeQuery = youtubeQuery;
    }
  });
  return trophiesData;
}

function appendGuideUrl(url, trophiesData) {
  trophiesData.forEach((element) => {
    element.guideUrl = url + element.guideUrl;
  });
  return trophiesData;
}

module.exports = {
  cleanTrophies,
  completeMissingQueries,
  appendGuideUrl
};
