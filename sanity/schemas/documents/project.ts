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
      date: "date",
      media: "coverImage",
    },
    prepare({ title, media, author, date }) {
      const subtitles = [
        author && `by ${author}`,
        date && `on ${format(parseISO(date), "LLL d, yyyy")}`,
      ].filter(Boolean);

      return { title, media, subtitle: subtitles.join(" ") };
    },
  },
});
