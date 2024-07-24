# Venezia Webseite

## Tech-Stack
- wird noch entschieden
- vermutlich Nutzung von Sanity aufgrund des Vorgängerprojekts "Dordogne"

## Sanity

CROQ Cheatsheet: https://www.sanity.io/docs/query-cheat-sheet
Production CMS: https://dordogne.sanity.studio/
Example of Datafetching:
```
const query = groq`*[_type == "post"]`;
const { data } = useSanityQuery(query);
```
