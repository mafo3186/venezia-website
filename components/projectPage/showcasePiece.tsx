"use client";
import { Image } from "next-sanity/image";
import { blurhashToBase64 } from "blurhash-base64";
import styles from "./showcasePiece.module.css";
import { FaExpandArrowsAlt } from 'react-icons/fa';
import {SanityImagePalette} from "next-sanity";



interface ShowcasePieceProps {
  showcase: {
    type: "image" | "video" | "audio" | "text" | "website" | null;
    description: string | null;
    content: string;
    mimeType: string | null;
    blurHash?: string;
    palette?: SanityImagePalette;
  };
}

export default function ShowcasePiece(props: ShowcasePieceProps) {
  const { showcase } = props;

  const hexToRgba = (hex: string, alpha: number) => {
    // Hex-Farbwert in RGB umwandeln
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`; // Alpha-Wert hinzufügen
  };

  const getDominantColor = (palette: SanityImagePalette | undefined): string => {
    const dominantBackground = palette?.dominant?.background || "transparent"; // Fallback-Farbe
    return hexToRgba(dominantBackground, 0.2);
  };

  return (
    <figure className={styles.figure}>
      <div 
        className={styles.contentContainer}
      >
        {showcase.type === "image" && (
          <Image
            fill
            blurDataURL={blurhashToBase64(showcase.blurHash!)}
            placeholder="blur"
            src={showcase.content}
            alt={showcase.description ?? ""}
            className={styles.image}
            style={{ backgroundColor: getDominantColor(showcase.palette) }}
          />
        )}
        {showcase.type === "video" && (
          <video controls autoPlay muted loop className={styles.video}>
            <source src={showcase.content} type={showcase.mimeType!}/>
          </video>
        )}
        {showcase.type === "audio" && (
          <div className={styles.audio}>
            <audio controls>
              <source src={showcase.content} type={showcase.mimeType!}/>
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
              onClick={() => window.open(showcase.content, "_blank", "noopener noreferrer")}
              aria-label={"Öffne Webseite auf neuer Seite"}
            >
              <FaExpandArrowsAlt/>
            </button>
          </div>
        )}
      </div>
        {showcase.description && <figcaption className={styles.description}>{showcase.description}</figcaption>}
    </figure>
);
}
