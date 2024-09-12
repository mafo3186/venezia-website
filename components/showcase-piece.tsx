import { Showcase } from "@/sanity.types";
import { urlForImage } from "@/sanity/lib/utils";
import project from "@/sanity/schemas/project";
import { Image } from "next-sanity/image";
import { blurhashToBase64 } from "blurhash-base64";

interface ShowcasePieceProps {
  showcase: {
    type: "image" | "video" | "audio" | "text" | "website" | null;
    description: string | null;
    content: string;
    mimeType: string | null;
    blurHash?: string;
  };
}

export default function ShowcasePiece(props: ShowcasePieceProps) {
  const { showcase } = props;

  return <figure style={{ position: "relative", height: "100%", background: "black"}}>
    {showcase.type === "image" && (
      <Image
        fill
        blurDataURL={blurhashToBase64(showcase.blurHash!)}
        placeholder="blur"
        src={showcase.content} alt={showcase.description ?? ""}
      />
    )}
    {showcase.type === "video" && (
      <video
        controls autoPlay muted loop>
        <source
          src={showcase.content}
          type={showcase.mimeType!}
        />
      </video>
    )}
    {showcase.type === "audio" && (
      <audio controls>
        <source src={showcase.content} type={showcase.mimeType!} />
      </audio>
    )}
    {showcase.type === "text" &&
      <pre>{showcase.content}</pre>
    }
    {showcase.type === "website" &&
      <a href={showcase.content} target="_blank" style={{pointerEvents: "auto"}}>
        <iframe style={
          {
            width: "100%",
            height: "100%",
            border: "none",
            pointerEvents: "none",
            overflow: "hidden",
          }
        } scrolling="no" src={showcase.content}></iframe>
      </a>
    }
    {showcase.description && <figcaption>{showcase.description}</figcaption>}
  </figure>;
}
