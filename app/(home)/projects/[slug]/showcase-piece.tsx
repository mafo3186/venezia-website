import { Showcase } from "@/sanity.types";
import { urlForImage } from "@/sanity/lib/utils";
import project from "@/sanity/schemas/project";
import { Image } from "next-sanity/image";
import styles from "./styles.module.css";
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

  return <figure style={{position: "relative", height: "100%"}}>
    {showcase.type === "image" && (
      <Image
        fill
        blurDataURL={blurhashToBase64(showcase.blurHash!)}
        placeholder="blur"
        style={{objectFit: "cover"}}
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
      <a href={showcase.content} target="_blank">
        <iframe className={styles.website} src={showcase.content}></iframe>
      </a>
    }
    {showcase.description && <figcaption>{showcase.description}</figcaption>}
  </figure>;
}
