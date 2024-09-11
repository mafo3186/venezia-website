import { groq } from "next-sanity";

export const settingsQuery = groq`*[_type == "settings"][0]`;

export const projectsQuery = groq`*[_type == "project" && defined(slug.current)] | order(date desc, _updatedAt desc) {
  content,
  _id,
  "status": select(_originalId in path("drafts.**") => "draft", "published"),
  "title": coalesce(title, "Untitled"),
  "slug": slug.current,
  excerpt,
  author,
}`;
