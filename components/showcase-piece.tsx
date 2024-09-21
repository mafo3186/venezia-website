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

  return (
    <figure style={{
      position: "relative",
      width: "100%",
      height: "100%",
      maxWidth: "100vw",
      maxHeight: "100vh",
      background: "red",
      minWidth: "300px", // Minimum width to ensure readability
      minHeight: "200px", // Minimum height to ensure readability
      overflow: "auto",
    }}>
      {showcase.type === "image" && (
        <Image
          fill
          blurDataURL={blurhashToBase64(showcase.blurHash!)}
          placeholder="blur"
          src={showcase.content} alt={showcase.description ?? ""}
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            margin: 0,
            overflow: "hidden", // verhindert übermäßiges Wachstum des Inhalts
            objectFit: "contain", // Fülle den Container ohne das Bild zu beschneiden
            maxWidth: "100%",
            maxHeight: "100%",
          }}
        />
      )}
      {showcase.type === "video" && (
        <video
          controls autoPlay muted loop
          style={{
            objectFit: "contain",
            padding: "10px",
            overflow: "hidden", // verhindert übermäßiges Wachstum des Inhalts
          }}
        >
          <source
            src={showcase.content}
            type={showcase.mimeType!}
          />
        </video>
      )}
      {showcase.type === "audio" && (
        <audio
          controls
          style={{
            position: "relative",
            height: "100%", width: "100%",
            background: "black",
            display: "flex", justifyContent: "center", alignItems: "center",
            maxWidth: "100%",
          }}
        >
          <source src={showcase.content} type={showcase.mimeType!} />
        </audio>
      )}
      {showcase.type === "text" &&
        <pre
          style={{
            width: "100%",
            height: "100%",
            overflow: "auto",
            maxWidth: "100%",
            maxHeight: "100%",
            color: "white",
            background: "black",
            padding: "3rem",

          }}
        >
          {showcase.content}
        </pre>
      }
      {showcase.type === "website" &&
        <a href={showcase.content} target="_blank" style={{ pointerEvents: "auto", width: "100%", height: "100%", maxWidth: "100%", maxHeight: "100%" }}>
          <iframe
            style={{
              position: "relative",
              background: "white",
              width: "100%",
              height: "100%",
              border: "none",
              pointerEvents: "none",
              overflow: "hidden"
            }} scrolling="no"
            src={showcase.content}></iframe>
        </a>
      }
      {showcase.description && <figcaption>{showcase.description}</figcaption>}
    </figure>
  );
}
