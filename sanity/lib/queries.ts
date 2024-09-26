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

export const projectSlugs = groq`*[_type == "project"]{slug}`;

export const projectBySlugQuery = groq`*[_type == "project" && slug.current == $slug] [0] {
  "documentation": documentation[] {
    ...,
    _type == "file" => {
      asset->
    }
  },
  description,
  _id,
  "status": select(_originalId in path("drafts.**") => "draft", "published"),
  "title": coalesce(title, "Untitled"),
  "slug": slug.current,
  author,
  type,
  "showcases": showcase[] {
    type,
    type == 'image' => showcaseImage.asset->{"content": url, "blurHash": metadata.blurHash, mimeType},
    type == 'audio' => showcaseAudio.asset->{"content": url, mimeType},
    type == 'video' => showcaseVideo.asset->{"content": url, mimeType},
    type == 'text' => @{"content": showcaseText},
    type == 'website' => @{"content": showcaseWebsite},
    description
  }
}`;
