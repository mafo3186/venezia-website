/**
 * ---------------------------------------------------------------------------------
 * This file has been generated by Sanity TypeGen.
 * Command: `sanity typegen generate`
 *
 * Any modifications made directly to this file will be overwritten the next time
 * the TypeScript definitions are generated. Please make changes to the Sanity
 * schema definitions and/or GROQ queries if you need to update these types.
 *
 * For more information on how to use Sanity TypeGen, visit the official documentation:
 * https://www.sanity.io/docs/sanity-typegen
 * ---------------------------------------------------------------------------------
 */

// Source: schema.json
export type SanityImagePaletteSwatch = {
  _type: "sanity.imagePaletteSwatch";
  background?: string;
  foreground?: string;
  population?: number;
  title?: string;
};

export type SanityImagePalette = {
  _type: "sanity.imagePalette";
  darkMuted?: SanityImagePaletteSwatch;
  lightVibrant?: SanityImagePaletteSwatch;
  darkVibrant?: SanityImagePaletteSwatch;
  vibrant?: SanityImagePaletteSwatch;
  dominant?: SanityImagePaletteSwatch;
  lightMuted?: SanityImagePaletteSwatch;
  muted?: SanityImagePaletteSwatch;
};

export type SanityImageDimensions = {
  _type: "sanity.imageDimensions";
  height?: number;
  width?: number;
  aspectRatio?: number;
};

export type Geopoint = {
  _type: "geopoint";
  lat?: number;
  lng?: number;
  alt?: number;
};

export type Showcase = {
  _type: "showcase";
  type?: "image" | "video" | "audio" | "text" | "website";
  showcaseImage?: {
    asset?: {
      _ref: string;
      _type: "reference";
      _weak?: boolean;
      [internalGroqTypeReferenceTo]?: "sanity.imageAsset";
    };
    hotspot?: SanityImageHotspot;
    crop?: SanityImageCrop;
    _type: "image";
  };
  showcaseVideo?: {
    asset?: {
      _ref: string;
      _type: "reference";
      _weak?: boolean;
      [internalGroqTypeReferenceTo]?: "sanity.fileAsset";
    };
    _type: "file";
  };
  showcaseAudio?: {
    asset?: {
      _ref: string;
      _type: "reference";
      _weak?: boolean;
      [internalGroqTypeReferenceTo]?: "sanity.fileAsset";
    };
    _type: "file";
  };
  showcaseText?: string;
  showcaseWebsite?: string;
  description?: string;
};

export type Project = {
  _id: string;
  _type: "project";
  _createdAt: string;
  _updatedAt: string;
  _rev: string;
  title?: string;
  slug?: Slug;
  author?: string;
  description?: string;
  showcase?: Array<{
    _key: string;
  } & Showcase>;
  documentation?: Array<{
    children?: Array<{
      marks?: Array<string>;
      text?: string;
      _type: "span";
      _key: string;
    }>;
    style?: "normal" | "h3" | "blockquote";
    listItem?: "bullet" | "number";
    markDefs?: Array<{
      href?: string;
      _type: "link";
      _key: string;
    }>;
    level?: number;
    _type: "block";
    _key: string;
  } | {
    asset?: {
      _ref: string;
      _type: "reference";
      _weak?: boolean;
      [internalGroqTypeReferenceTo]?: "sanity.imageAsset";
    };
    hotspot?: SanityImageHotspot;
    crop?: SanityImageCrop;
    caption?: string;
    attribution?: string;
    _type: "image";
    _key: string;
  } | {
    asset?: {
      _ref: string;
      _type: "reference";
      _weak?: boolean;
      [internalGroqTypeReferenceTo]?: "sanity.fileAsset";
    };
    caption?: string;
    attribution?: string;
    _type: "file";
    _key: string;
  }>;
};

export type SanityFileAsset = {
  _id: string;
  _type: "sanity.fileAsset";
  _createdAt: string;
  _updatedAt: string;
  _rev: string;
  originalFilename?: string;
  label?: string;
  title?: string;
  description?: string;
  altText?: string;
  sha1hash?: string;
  extension?: string;
  mimeType?: string;
  size?: number;
  assetId?: string;
  uploadId?: string;
  path?: string;
  url?: string;
  source?: SanityAssetSourceData;
};

export type Settings = {
  _id: string;
  _type: "settings";
  _createdAt: string;
  _updatedAt: string;
  _rev: string;
  title?: string;
  description?: Array<{
    children?: Array<{
      marks?: Array<string>;
      text?: string;
      _type: "span";
      _key: string;
    }>;
    style?: "normal";
    listItem?: never;
    markDefs?: Array<{
      href?: string;
      _type: "link";
      _key: string;
    }>;
    level?: number;
    _type: "block";
    _key: string;
  }>;
  footer?: Array<{
    children?: Array<{
      marks?: Array<string>;
      text?: string;
      _type: "span";
      _key: string;
    }>;
    style?: "normal" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "blockquote";
    listItem?: "bullet" | "number";
    markDefs?: Array<{
      href?: string;
      _type: "link";
      _key: string;
    }>;
    level?: number;
    _type: "block";
    _key: string;
  }>;
  ogImage?: {
    asset?: {
      _ref: string;
      _type: "reference";
      _weak?: boolean;
      [internalGroqTypeReferenceTo]?: "sanity.imageAsset";
    };
    hotspot?: SanityImageHotspot;
    crop?: SanityImageCrop;
    alt?: string;
    metadataBase?: string;
    _type: "image";
  };
};

export type SanityImageCrop = {
  _type: "sanity.imageCrop";
  top?: number;
  bottom?: number;
  left?: number;
  right?: number;
};

export type SanityImageHotspot = {
  _type: "sanity.imageHotspot";
  x?: number;
  y?: number;
  height?: number;
  width?: number;
};

export type SanityImageAsset = {
  _id: string;
  _type: "sanity.imageAsset";
  _createdAt: string;
  _updatedAt: string;
  _rev: string;
  originalFilename?: string;
  label?: string;
  title?: string;
  description?: string;
  altText?: string;
  sha1hash?: string;
  extension?: string;
  mimeType?: string;
  size?: number;
  assetId?: string;
  uploadId?: string;
  path?: string;
  url?: string;
  metadata?: SanityImageMetadata;
  source?: SanityAssetSourceData;
};

export type SanityAssetSourceData = {
  _type: "sanity.assetSourceData";
  name?: string;
  id?: string;
  url?: string;
};

export type SanityImageMetadata = {
  _type: "sanity.imageMetadata";
  location?: Geopoint;
  dimensions?: SanityImageDimensions;
  palette?: SanityImagePalette;
  lqip?: string;
  blurHash?: string;
  hasAlpha?: boolean;
  isOpaque?: boolean;
};

export type MediaTag = {
  _id: string;
  _type: "media.tag";
  _createdAt: string;
  _updatedAt: string;
  _rev: string;
  name?: Slug;
};

export type Slug = {
  _type: "slug";
  current?: string;
  source?: string;
};

export type AllSanitySchemaTypes = SanityImagePaletteSwatch | SanityImagePalette | SanityImageDimensions | Geopoint | Showcase | Project | SanityFileAsset | Settings | SanityImageCrop | SanityImageHotspot | SanityImageAsset | SanityAssetSourceData | SanityImageMetadata | MediaTag | Slug;
export declare const internalGroqTypeReferenceTo: unique symbol;
// Source: ./sanity/lib/queries.ts
// Variable: settingsQuery
// Query: *[_type == "settings"][0]
export type SettingsQueryResult = {
  _id: string;
  _type: "settings";
  _createdAt: string;
  _updatedAt: string;
  _rev: string;
  title?: string;
  description?: Array<{
    children?: Array<{
      marks?: Array<string>;
      text?: string;
      _type: "span";
      _key: string;
    }>;
    style?: "normal";
    listItem?: never;
    markDefs?: Array<{
      href?: string;
      _type: "link";
      _key: string;
    }>;
    level?: number;
    _type: "block";
    _key: string;
  }>;
  footer?: Array<{
    children?: Array<{
      marks?: Array<string>;
      text?: string;
      _type: "span";
      _key: string;
    }>;
    style?: "blockquote" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "normal";
    listItem?: "bullet" | "number";
    markDefs?: Array<{
      href?: string;
      _type: "link";
      _key: string;
    }>;
    level?: number;
    _type: "block";
    _key: string;
  }>;
  ogImage?: {
    asset?: {
      _ref: string;
      _type: "reference";
      _weak?: boolean;
      [internalGroqTypeReferenceTo]?: "sanity.imageAsset";
    };
    hotspot?: SanityImageHotspot;
    crop?: SanityImageCrop;
    alt?: string;
    metadataBase?: string;
    _type: "image";
  };
} | null;
// Variable: projectsQuery
// Query: *[_type == "project" && defined(slug.current)] | order(_createdAt asc, _id asc) {  content,  _id,  "status": select(_originalId in path("drafts.**") => "draft", "published"),  "title": coalesce(title, "Untitled"),  "slug": slug.current,  excerpt,  author,}
export type ProjectsQueryResult = Array<{
  content: null;
  _id: string;
  status: "draft" | "published";
  title: string | "Untitled";
  slug: string | null;
  excerpt: null;
  author: string | null;
}>;
// Variable: projectSlugs
// Query: *[_type == "project"]{slug}
export type ProjectSlugsResult = Array<{
  slug: Slug | null;
}>;
// Variable: projectBySlugQuery
// Query: *[_type == "project" && slug.current == $slug] [0] {  "documentation": documentation[] {    ...,    _type == "file" => {      asset->    }  },  description,  _id,  "status": select(_originalId in path("drafts.**") => "draft", "published"),  "title": coalesce(title, "Untitled"),  "slug": slug.current,  author,  type,  "showcases": showcase[] {    type,    type == 'image' => showcaseImage.asset->{      "content": url,      "blurHash": metadata.blurHash,      "palette": metadata.palette,      "location": metadata.location,      "exif": metadata.exif,      "dimensions": metadata.dimensions,      mimeType    },    type == 'audio' => showcaseAudio.asset->{"content": url, mimeType},    type == 'video' => showcaseVideo.asset->{"content": url, mimeType},    type == 'text' => @{"content": showcaseText},    type == 'website' => @{"content": showcaseWebsite},    description  }}
export type ProjectBySlugQueryResult = {
  documentation: Array<{
    children?: Array<{
      marks?: Array<string>;
      text?: string;
      _type: "span";
      _key: string;
    }>;
    style?: "blockquote" | "h3" | "normal";
    listItem?: "bullet" | "number";
    markDefs?: Array<{
      href?: string;
      _type: "link";
      _key: string;
    }>;
    level?: number;
    _type: "block";
    _key: string;
  } | {
    asset: {
      _id: string;
      _type: "sanity.fileAsset";
      _createdAt: string;
      _updatedAt: string;
      _rev: string;
      originalFilename?: string;
      label?: string;
      title?: string;
      description?: string;
      altText?: string;
      sha1hash?: string;
      extension?: string;
      mimeType?: string;
      size?: number;
      assetId?: string;
      uploadId?: string;
      path?: string;
      url?: string;
      source?: SanityAssetSourceData;
    } | null;
    caption?: string;
    attribution?: string;
    _type: "file";
    _key: string;
  } | {
    asset?: {
      _ref: string;
      _type: "reference";
      _weak?: boolean;
      [internalGroqTypeReferenceTo]?: "sanity.imageAsset";
    };
    hotspot?: SanityImageHotspot;
    crop?: SanityImageCrop;
    caption?: string;
    attribution?: string;
    _type: "image";
    _key: string;
  }> | null;
  description: string | null;
  _id: string;
  status: "draft" | "published";
  title: string | "Untitled";
  slug: string | null;
  author: string | null;
  type: null;
  showcases: Array<{
    type: "audio" | "image" | "text" | "video" | "website" | null;
    content: string | null;
    blurHash: string | null;
    palette: SanityImagePalette | null;
    location: Geopoint | null;
    exif: null;
    dimensions: SanityImageDimensions | null;
    mimeType: string | null;
    description: string | null;
  } | {
    type: "audio" | "image" | "text" | "video" | "website" | null;
    content: string | null;
    mimeType: string | null;
    description: string | null;
  } | {
    type: "audio" | "image" | "text" | "video" | "website" | null;
    content: string | null;
    description: string | null;
  } | {
    type: "audio" | "image" | "text" | "video" | "website" | null;
    description: string | null;
  }> | null;
} | null;
// Variable: projectsListQuery
// Query: *[_type == "project"] |   order(select($orderBy == "title" => title, $orderBy == "author" => author, $orderBy == "_updatedAt" => _updatedAt)) {    _id,     title,     _updatedAt,     description,     "slug": slug.current,     author  }
export type ProjectsListQueryResult = Array<{
  _id: string;
  title: string | null;
  _updatedAt: string;
  description: string | null;
  slug: string | null;
  author: string | null;
}>;

// Query TypeMap
import "@sanity/client";
declare module "@sanity/client" {
  interface SanityQueries {
    "*[_type == \"settings\"][0]": SettingsQueryResult;
    "*[_type == \"project\" && defined(slug.current)] | order(_createdAt asc, _id asc) {\n  content,\n  _id,\n  \"status\": select(_originalId in path(\"drafts.**\") => \"draft\", \"published\"),\n  \"title\": coalesce(title, \"Untitled\"),\n  \"slug\": slug.current,\n  excerpt,\n  author,\n}": ProjectsQueryResult;
    "*[_type == \"project\"]{slug}": ProjectSlugsResult;
    "*[_type == \"project\" && slug.current == $slug] [0] {\n  \"documentation\": documentation[] {\n    ...,\n    _type == \"file\" => {\n      asset->\n    }\n  },\n  description,\n  _id,\n  \"status\": select(_originalId in path(\"drafts.**\") => \"draft\", \"published\"),\n  \"title\": coalesce(title, \"Untitled\"),\n  \"slug\": slug.current,\n  author,\n  type,\n  \"showcases\": showcase[] {\n    type,\n    type == 'image' => showcaseImage.asset->{\n      \"content\": url,\n      \"blurHash\": metadata.blurHash,\n      \"palette\": metadata.palette,\n      \"location\": metadata.location,\n      \"exif\": metadata.exif,\n      \"dimensions\": metadata.dimensions,\n      mimeType\n    },\n    type == 'audio' => showcaseAudio.asset->{\"content\": url, mimeType},\n    type == 'video' => showcaseVideo.asset->{\"content\": url, mimeType},\n    type == 'text' => @{\"content\": showcaseText},\n    type == 'website' => @{\"content\": showcaseWebsite},\n    description\n  }\n}": ProjectBySlugQueryResult;
    "\n  *[_type == \"project\"] | \n  order(select($orderBy == \"title\" => title, $orderBy == \"author\" => author, $orderBy == \"_updatedAt\" => _updatedAt)) {\n    _id, \n    title, \n    _updatedAt, \n    description, \n    \"slug\": slug.current, \n    author\n  }\n": ProjectsListQueryResult;
  }
}
