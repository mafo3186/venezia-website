import { DocumentTextIcon, ImageIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export default defineType({
  name: "showcase",
  title: "Showcase-Piece",
  description: "Ein Projektergebnis, dass du präsentieren möchtest.",
  type: "object",
  icon: ImageIcon,
  fields: [
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
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "showcaseImage",
      title: "Showcase-Bild",
      type: "image",
      hidden: ({ parent }) => parent?.type !== "image",
      validation: (rule) => rule.custom((current, { parent }) => {
        return (parent as any)?.type === "image" && !current ? "Ein Bild ist erforderlich." : true;
      }),
      options: {
        metadata: ["blurhash", "palette", "location", "exif", "image"],
      },
    }),
    defineField({
      name: "showcaseVideo",
      title: "Showcase-Video",
      type: "file",
      hidden: ({ parent }) => parent?.type !== "video",
      validation: (rule) => rule.custom((current, { parent }) => {
        return (parent as any)?.type === "video" && !current ? "Ein Video ist erforderlich." : true;
      }),
      options: {
        accept: "video/*",
      }
    }),
    defineField({
      name: "showcaseAudio",
      title: "Showcase-Audio",
      type: "file",
      hidden: ({ parent }) => parent?.type !== "audio",
      validation: (rule) => rule.custom((current, { parent }) => {
        return (parent as any)?.type === "audio" && !current ? "Ein Audio ist erforderlich." : true;
      }),
      options: {
        accept: "audio/*",
      },
    }),
    defineField({
      name: "showcaseText",
      title: "Showcase-Text",
      type: "text",
      hidden: ({ parent }) => parent?.type !== "text",
      validation: (rule) => rule.custom((current, { parent }) => {
        return (parent as any)?.type === "text" && !current ? "Ein Text ist erforderlich." : true;
      }),

    }),
    defineField({
      name: "showcaseWebsite",
      title: "Showcase-Website",
      type: "url",
      hidden: ({ parent }) => parent?.type !== "website",
      validation: (rule) => rule.custom((current, { parent }) => {
        return (parent as any)?.type === "website" && !current ? "Ein Link zu einer Webseite ist erforderlich." : true;
      }),
    }),
    defineField({
      name: "description",
      title: "Beschreibung",
      description: "Beschreibe das Projektergebnis kurz. Kann als Untertitel oder für Accessibility verwendet werden.",
      type: "string",
    }),
  ]
});
