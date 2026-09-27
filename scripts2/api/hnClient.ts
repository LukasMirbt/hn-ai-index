import { commentSchema, type Comment } from "./models/commentSchema.ts";
import { itemSchema, type Item } from "./models/itemSchema.ts";
import { jobSchema, type Job } from "./models/jobSchema.ts";
import { storySchema, type Story } from "./models/storySchema.ts";

export const baseUrl = "https://hacker-news.firebaseio.com/v0";

export async function fetchItem(id: number): Promise<Item> {
  const response = await fetch(`${baseUrl}/item/${id}.json`);
  const json = await response.json();
  const item = itemSchema.parse(json);
  return item;
}

export async function fetchStory(id: number): Promise<Story> {
  const response = await fetch(`${baseUrl}/item/${id}.json`);
  const json = await response.json();
  const story = storySchema.parse(json);
  return story;
}

export async function fetchComment(id: number): Promise<Comment> {
  const response = await fetch(`${baseUrl}/item/${id}.json`);
  const json = await response.json();
  const comment = commentSchema.parse(json);
  return comment;
}

export async function fetchJob(id: number): Promise<Job> {
  const response = await fetch(`${baseUrl}/item/${id}.json`);
  const json = await response.json();
  const job = jobSchema.parse(json);
  return job;
}
