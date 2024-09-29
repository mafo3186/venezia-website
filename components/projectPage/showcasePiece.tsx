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
    aspectRatio?: number; // Füge das aspectRatio-Attribut hinzu
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
          src={showcase.content}
          alt={showcase.description ?? ""}
          className={styles.image}
          style={{ aspectRatio: "auto" }}
        />
      )}
      {showcase.type === "video" && (
        <video controls autoPlay muted loop className={styles.video}>
          <source src={showcase.content} type={showcase.mimeType!} />
        </video>
      )}
      {showcase.type === "audio" && (
        <div className={styles.audio}>
          <audio controls>
            <source src={showcase.content} type={showcase.mimeType!} />
          </audio>
        </div>
      )}
      {showcase.type === "text" && (
        <pre className={styles.text}>{showcase.content}</pre>
      )}
      {showcase.type === "website" && (
        <a href={showcase.content} target="_blank" rel="noopener noreferrer" className={styles.websiteLink}>
          <iframe
            className={styles.website}
            src={showcase.content}
            title={showcase.description ?? "Website"}
            scrolling="yes"
          />
          <button className={styles.link}>Webseite extern öffnen</button>
        </a>
      )}
      {showcase.description && <figcaption>{showcase.description}</figcaption>}
    </figure>
  );
}
