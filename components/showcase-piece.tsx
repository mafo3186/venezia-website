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
    <figure style={{ position: "relative", height: "100%", width: "100%", background: "black" }}>
      {showcase.type === "image" && (
        <Image
          fill
          blurDataURL={blurhashToBase64(showcase.blurHash!)}
          placeholder="blur"
          src={showcase.content} alt={showcase.description ?? ""}
          style={{ objectFit: "contain" }} // Ensure the image fits within the container
        />
      )}
      {showcase.type === "video" && (
        <video
          controls autoPlay muted loop
          style={{ width: "100%", height: "100%", objectFit: "contain" }} // Ensure the video fits within the container
        >
          <source
            src={showcase.content}
            type={showcase.mimeType!}
          />
        </video>
      )}
      {showcase.type === "audio" && (
        <audio controls style={{ width: "100%" }}>
          <source src={showcase.content} type={showcase.mimeType!} />
        </audio>
      )}
      {showcase.type === "text" &&
        <pre style={{ width: "100%", height: "100%", overflow: "auto" }}>{showcase.content}</pre>
      }
      {showcase.type === "website" &&
        <a href={showcase.content} target="_blank" style={{ pointerEvents: "auto", width: "100%", height: "100%" }}>
          <iframe style={{
            width: "100%",
            height: "100%",
            border: "none",
            pointerEvents: "none",
            overflow: "hidden",
          }} scrolling="no" src={showcase.content}></iframe>
        </a>
      }
      {showcase.description && <figcaption>{showcase.description}</figcaption>}
    </figure>
  );
}
