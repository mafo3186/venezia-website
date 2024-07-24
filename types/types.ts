export interface DetailInterface {
  name: string;
  elements: ElementInterface[];
}

export interface ElementInterface {
  title?: string;
  text?: string;
  images?: string[];
  video?: string;
  sounds?: string[];
  type: string;
}

export interface SiteSettings {
  _type: string;
  title: string;
  subtitle: string;
  credentials: string;
  description: Array<{
    _key: string;
    markDefs: Array<any>;
    children: Array<{
      _type: string;
      marks: Array<any>;
      text: string;
      _key: string;
    }>;
    _type: string;
    style: string;
  }>;
  imageExplorativeNavigation: string;
  imageAlternativeNavigation: string;
}

export interface ProjectMetaData {
  _id: string;
  _type: string;
  title: string;
  author: string;
  slug: string;
  sections_amount: number;
}

export interface ImageCaption {
  image: {
    _type: string;
    asset: {
      _ref: string;
      _type: string;
    };
  };
  caption: string;
}

// TODO: Add more types here
