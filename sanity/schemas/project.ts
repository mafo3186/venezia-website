import { DocumentTextIcon, DocumentVideoIcon } from "@sanity/icons";
import { format, parseISO } from "date-fns";
import { metadata } from "next-sanity/studio";
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
      initialValue: "Mein Projekt",
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
      initialValue: "Karla Kolumna",
      description: "Dein (Künstler-)Name",
    }),
    defineField({
      name: "description",
      title: "Kurzbeschreibung",
      description: "Beschreibe dein Projekt in einem Satz. Kann als Metatag, für Accessibility oder als Vorschau verwendet werden.",
      type: "text",
      initialValue: "Mein Projekt behandelt die Intersektion von Venn-Diagrammen und Kuchen.",
    }),
    defineField({
      type: "array",
      name: "showcase",
      title: "Showcase-Pieces",
      description: "Das / die Projektergebnis(se), die du präsentieren möchtest.",
      of: [{ type: "showcase" }],
    }),
    defineField({
      name: "documentation",
      title: "Projektdokumentation",
      description: "Hier kommt deine Projektdokumentation / -beschreibung hin.",
      type: "array",
      of: [{ type: "block" },
      {
        type: "image",
        title: "Bild",
        fields: [
          {
            name: 'caption',
            type: 'string',
            title: 'Caption',
            description: "Eine kurze Bildunterschrift / Bildbeschreibung"
          },
          {
            name: 'attribution',
            type: 'string',
            title: 'Attribution',
            description: "Wer hat das Bild erstellt?"
          }
        ],
        options: { metadata: ["blurhash"], }
      },
      {
        type: "file", title: "Video & Audio", icon: DocumentVideoIcon, options: { accept: "video/*,audio/*" },
        fields: [
          { name: "caption", type: "string", title: "Caption", description: "Eine kurze Beschreibung des Inhalts" },
          { name: 'attribution', type: 'string', title: 'Attribution', description: "Wer hat das Video / Audio erstellt?" }
        ]
      },
      ],
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
