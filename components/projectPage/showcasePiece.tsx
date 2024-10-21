"use client";
import { Image } from "next-sanity/image";
import { blurhashToBase64 } from "blurhash-base64";
import styles from "./showcasePiece.module.css";
import { FaExpandArrowsAlt } from 'react-icons/fa';
import { SanityImagePalette } from "@/sanity.types";
import { useMemo, useState } from "react";
import Kaleidoscope from "../kaleidoscope/kaleidoscope";
import { useAudioPlayer } from "../global-audio";
import { PiPauseLight, PiPlayLight } from "react-icons/pi";
import { cls } from "../utilities";

interface ShowcasePieceProps {
  author: string | null;
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
  const { author, showcase } = props;

  const hexToRgba = (hex: string, alpha: number) => {
    // Hex-Farbwert in RGB umwandeln
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`; // Alpha-Wert hinzufügen
  };

  const getDominantColor = (palette: SanityImagePalette | undefined): string => {
    const dominantBackground = palette?.dominant?.background;
    if (!dominantBackground) return "rgba(0, 0, 0, 0.4)";
    return hexToRgba(dominantBackground, 0.2);
  };


  let youtubeId: string | null = null;
  if (showcase.type === "website") {
    let match = (/(?:https?:)?(?:\/\/)?(?:[0-9A-Z-]+\.)?(?:youtu\.be\/|youtube(?:-nocookie)?\.com\S*?[^\w\s-])([\w-]{11})(?=[^\w-]|$)(?![?=&+%\w.-]*(?:['"][^<>]*>|<\/a>))[?=&+%\w.-]*/gim).exec(showcase.content);
    if (match) {
      youtubeId = match[1];
    }
  }

  const { playing: isPlaying, play, pause } = useAudioPlayer(useMemo(() => ({
    url: showcase.content,
    mimeType: showcase.mimeType ?? undefined,
    title: showcase.description ?? undefined,
    author: author ?? undefined,
  }), [author, showcase.content, showcase.description, showcase.mimeType]));

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
            <source src={showcase.content} type={showcase.mimeType!} />
          </video>
        )}
        {showcase.type === "audio" && (
          <div className={styles.audio} onClick={() => isPlaying ? pause() : play()}>
            <Kaleidoscope speed={isPlaying ? .33 : 0.02} />
            <div className={cls(styles.playButton, !isPlaying && styles.playButtonPaused)}>
              {isPlaying ? <PiPauseLight size={32} /> : <PiPlayLight size={32} />}
            </div>
          </div>
        )}
        {showcase.type === "text" && (
          <pre className={styles.text}>{showcase.content}</pre>
        )}
        {showcase.type === "website" && (
          <div className={styles.websiteContainer}>
            {
              youtubeId ? (
                <iframe
                  className={styles.iFrame}
                  src={"https://www.youtube-nocookie.com/embed/" + youtubeId}
                  title="YouTube video player" frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen>
                </iframe>
              ) : (<>
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
                  <FaExpandArrowsAlt />
                </button>
              </>)
            }
          </div>
        )}
      </div>
      {showcase.description && <figcaption className={styles.description}>{showcase.description}</figcaption>}
    </figure>
  );
}
