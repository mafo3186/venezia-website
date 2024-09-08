import { groq } from "next-sanity";

export const settingsQuery = groq`*[_type == "settings"][0]`;

export const projectSlugs = groq`*[_type == "project"]{slug}`;

export const projectBySlugQuery = groq`*[_type == "project" && slug.current == $slug] [0] {
  documentation,
  description,
  _id,
  "status": select(_originalId in path("drafts.**") => "draft", "published"),
  "title": coalesce(title, "Untitled"),
  "slug": slug.current,
  author,
  type,
  showcaseImage,
  showcaseVideo {
    asset-> {
      ...
    },
  },
  showcaseAudio {
    asset-> {
      ...
    },
  },
  showcaseText,
  showcaseWebsite,
}`;
