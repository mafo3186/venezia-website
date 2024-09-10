import { Showcase } from "@/sanity.types";
import { urlForImage } from "@/sanity/lib/utils";
import project from "@/sanity/schemas/project";
import { Image } from "next-sanity/image";
import styles from "./styles.module.css";

interface ShowcasePieceProps {
  showcase: {
    type: "image" | "video" | "audio" | "text" | "website" | null;
    description: string | null;
    content: string;
    mimeType?: string;
  };
  width: number;
  height: number;
}

export default function ShowcasePiece(props: ShowcasePieceProps) {
  const { showcase, width, height } = props;
  return <figure>
    {showcase.type === "image" && (
      <Image
        width={width}
        height={height}
        src={urlForImage(showcase.content)?.width(width).height(height).url() as string} alt="" />
    )}
    {showcase.type === "video" && (
      <video
        controls autoPlay muted loop>
        <source
          src={showcase.content}
          type={showcase.mimeType}
        />
      </video>
    )}
    {showcase.type === "audio" && (
      <audio controls>
        <source src={showcase.content} type={showcase.mimeType} />
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
