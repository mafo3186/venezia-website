import { DocumentTextIcon } from "@sanity/icons";
import { format, parseISO } from "date-fns";
import { defineField, defineType } from "sanity";

export default defineType({
  name: "project",
  title: "Projekt",
  description: "Ein Projekt, das du auf dieser Website präsentieren möchtest.",
  icon: DocumentTextIcon,
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      description: "Der Name deines Projekts. Wird als Überschrift und in der Liste aller Projekte verwendet.",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Linkadresse (Slug)",
      type: "slug",
      description: "A slug is required for the project to show up in the preview",
      options: {
        source: "title",
        maxLength: 96,
        isUnique: (value, context) => context.defaultIsUnique(value, context),
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "author",
      title: "Autor",
      type: "string",
    }),
    defineField({
      name: "description",
      title: "Kurzbeschreibung",
      description: "Beschreibe dein Projekt in einem Satz. Kann als Metatag, für Accessibility oder als Vorschau verwendet werden.",
      type: "text",
    }),
    defineField({
      name: "type",
      title: "Showcase-Typ",
      description: "Wähle den Typ deines Showcase-Pieces.",
      type: "string",
      options: {
        list: [
          { title: 'Bild', value: 'image' },
          { title: 'Video', value: 'video' },
          { title: 'Audio', value: 'audio' },
          { title: 'Text', value: 'text' },
          { title: 'Website', value: 'website' },
        ],
      },
    }),
    defineField({
      name: "showcaseImage",
      title: "Showcase-Bild",
      type: "image",
      hidden: ({ document }) => document?.type !== "image",
    }),
    defineField({
      name: "showcaseVideo",
      title: "Showcase-Video",
      type: "file",
      hidden: ({ document }) => document?.type !== "video",
    }),
    defineField({
      name: "showcaseAudio",
      title: "Showcase-Audio",
      type: "file",
      hidden: ({ document }) => document?.type !== "audio",
    }),
    defineField({
      name: "showcaseText",
      title: "Showcase-Text",
      type: "text",
      hidden: ({ document }) => document?.type !== "text",
    }),
    defineField({
      name: "showcaseWebsite",
      title: "Showcase-Website",
      type: "url",
      hidden: ({ document }) => document?.type !== "website",
    }),
    defineField({
      name: "documentation",
      title: "Projektdokumentation",
      description: "Hier kommt deine Projektdokumentation / -beschreibung hin.",
      type: "array",
      of: [{ type: "block" }, { type: "image" }, { type: "file" }],
    }),
  ],
  preview: {
    select: {
      title: "title",
      author: "author",
      type: "type",
      showcaseImage: "showcaseImage",
    },
    prepare({ title, author, type, showcaseImage }) { 
      const subtitles = [
        author && `von ${author}`,
      ].filter(Boolean);
      const media = type === "image" ? showcaseImage : undefined;
      return { title, media, subtitle: subtitles.join(" ") };
    },
  },
});
