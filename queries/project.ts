
// all projects with id, title, author
export const getAllProjectsMetaData = groq`
*[_type == "projects"]{
    _id, //426179d8-a762-45c9-8000-cc401e1b433e
    _type,
    title,
    author,
    "slug": slug.current,
    "sections_amount": count(sections),
  }
`;

// one project by id
export const getProjectById = (projectId: String) =>  groq`
*[_type == "projects" && _id == "${projectId}"]{
    _id,
    _type,
    title,
    author,
    "slug": slug.current,
    sections,
    "sections_amount": count(sections),
  }
`;

// all images

export const getAllImages = groq`
*[_type == 'projects' && count(sections[_type == 'sectionImage'].gallery) > 0].sections[_type == 'sectionImage'].image{
    caption,
    "url": image.asset->url,
    "project": ^{_id, title, "slug": slug.current}
}
`;

// all images from gallery
export const getAllImagesFromGallery = groq`
*[_type == 'projects' && count(sections[_type == 'sectionGallery'].gallery) > 0].sections[_type == 'sectionGallery'].images[]{
    caption,
    "url": image.asset->url,
    "project": ^{_id, title, "slug": slug.current }
   
}
`;

export const getAllProjectsData = groq`
*[_type == "projects"]{
    _id, //426179d8-a762-45c9-8000-cc401e1b433e
    _type,
    title,
    author,
    "slug": slug.current,
    sections,
    "sections_amount": count(sections),
  }
`;


// all audios TODO
// all videos TODO