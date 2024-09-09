import { Showcase } from "@/sanity.types";
import { urlForImage } from "@/sanity/lib/utils";
import project from "@/sanity/schemas/project";
import { Image } from "next-sanity/image";
import styles from "./styles.module.css";

interface ShowcasePieceProps {
  showcase: Showcase;
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
        src={urlForImage(showcase.showcaseImage)?.width(width).height(height).url() as string} alt="" />
    )}
    {showcase.type === "video" && (
      <video
        controls autoPlay muted loop>
        <source
          src={showcase.videoUrl}
          type={showcase.videoMimeType}
        />
      </video>
    )}
    {showcase.type === "audio" && (
      <audio controls>
        <source src={showcase.audioUrl} type={showcase.audioMimeType} />
      </audio>
    )}
    {showcase.type === "text" &&
      <pre>{showcase.showcaseText}</pre>
    }
    {showcase.type === "website" &&
      <a href={showcase.showcaseWebsite} target="_blank">
        <iframe className={styles.website} src={showcase.showcaseWebsite}></iframe>
      </a>
    }
    {showcase.description && <figcaption>{showcase.description}</figcaption>}
  </figure>;
}
