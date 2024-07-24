# Nuxt 3 

## Setup
Install dependencies: npm i

Start development server: npm run dev

## Docs
https://nuxt.com/docs/getting-started/introduction

https://tailwindcss.com

## Recommended VS-Code Extensions
Amayakite.aya-vue3-extension-pack

Nuxtr.nuxt-vscode-extentions

# Sanity

CROQ Cheatsheet: https://www.sanity.io/docs/query-cheat-sheet
Production CMS: https://dordogne.sanity.studio/
Example of Datafetching:
```
const query = groq`*[_type == "post"]`;
const { data } = useSanityQuery(query);
```
