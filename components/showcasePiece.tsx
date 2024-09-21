import { Image } from "next-sanity/image";
import { blurhashToBase64 } from "blurhash-base64";
import styles from "./showcasePiece.module.css";


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

  return (
    <figure className={styles.figure}>
      {showcase.type === "image" && (
        <Image
          fill
          blurDataURL={blurhashToBase64(showcase.blurHash!)}
          placeholder="blur"
          src={showcase.content} alt={showcase.description ?? ""}
          className={styles.image}
        />
      )}
      {showcase.type === "video" && (
        <video
          controls autoPlay muted loop
          className={styles.video}
        >
          <source
            src={showcase.content}
            type={showcase.mimeType!}
          />
        </video>
      )}
      {showcase.type === "audio" && (
        <audio
          controls className={styles.audio}
        >
          <source src={showcase.content} type={showcase.mimeType!} />
        </audio>
      )}
      {showcase.type === "text" &&
        <pre className={styles.text}>
          {showcase.content}
        </pre>
      }
      {showcase.type === "website" &&
        <a href={showcase.content} target="_blank" style={{ pointerEvents: "auto", width: "100%", height: "100%", maxWidth: "100%", maxHeight: "100%" }}>
          <iframe className={styles.web} scrolling="no" src={showcase.content}></iframe>
        </a>
      }
      {showcase.description && <figcaption>{showcase.description}</figcaption>}
    </figure>
  );
}
