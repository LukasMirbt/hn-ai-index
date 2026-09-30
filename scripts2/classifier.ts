import {
  fetchBottomFiveComments,
  fetchStory,
  fetchTopFiveComments,
} from "./domain/hnRepository.ts";
import { fetchArticleData } from "./feature/data.ts";

const data = fetchArticleData(49854219);
