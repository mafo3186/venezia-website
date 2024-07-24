
export const getPageData = groq`
*[_type == "siteSettings"]{
    _type,
    title,
    subtitle,
    credentials,
    description,
    "imageExplorativeNavigation": imageExplorativeNavigation.image,
    "imageAlternativeNavigation": imageAlternativeNavigation.image
  }
`;