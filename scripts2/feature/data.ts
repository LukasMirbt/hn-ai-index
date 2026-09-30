import { fetchStory } from "../api/hnApi.ts";
import { fetchCommentList } from "../domain/hnRepository.ts";
import * as StoryModel from "../domain/hnRepository.ts";

/* const story = await fetchStory(49854219);

const topFiveComments = await fetchTopFiveComments(story);
console.log("top five comments", topFiveComments);

const bottomFiveComments = await fetchBottomFiveComments(story); */

export async function fetchArticleData(id: number): ArticleData {
  const urlContent = await fetchUrlContent(id);

  const story = await fetchStory(id);
  const topFiveCommentIds = StoryModel.topFiveCommentIds(story);
  const bottomFiveCommentIds = StoryModel.bottomFiveCommentIds(story);

  const topFiveComments = await fetchCommentList(topFiveCommentIds);
  const bottomFiveComments = await fetchCommentList(bottomFiveCommentIds);

  return {
    urlContent,
    topFiveComments,
    bottomFiveComments,
  };
}
