"use client";
import { Image } from "next-sanity/image";
import { blurhashToBase64 } from "blurhash-base64";
import styles from "./showcasePiece.module.css";
import { FaExpandArrowsAlt } from 'react-icons/fa';  // FontAwesome Icon


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
          <div className={styles.websiteContainer}>
            <iframe
              className={styles.iFrame}
              src={showcase.content}
              title={showcase.description ?? "Website"}
              scrolling="yes"
            />
          <button 
            className={styles.expandButton}
            onClick={() => window.open(showcase.content, "_blank", "noopener noreferrer" )}
            aria-label={"Öffne Webseite auf neuer Seite"}
          >
            <FaExpandArrowsAlt />
          </button>
          </div>
      )}
      {showcase.description && <figcaption className={styles.description}>{showcase.description}</figcaption>}
    </figure>
  );
}
