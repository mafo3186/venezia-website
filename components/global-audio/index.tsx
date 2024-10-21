"use client";
import {
  AudioHTMLAttributes,
  createContext,
  DetailedHTMLProps,
  forwardRef,
  PropsWithChildren,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";
import { cls } from "../utilities";
import { AudioPlayer } from "./player";
import { PiX } from "react-icons/pi";
import styles from "./styles.module.css";

type GlobalAudioPlayerProps = {
  className?: string;
  title?: string;
  author?: string;
  type?: string;
  onClose?: () => void;
} & DetailedHTMLProps<AudioHTMLAttributes<HTMLAudioElement>, HTMLAudioElement>;

export const GlobalAudioPlayer = forwardRef<
  HTMLAudioElement,
  GlobalAudioPlayerProps
>(function GlobalAudioPlayer(
  { title, author, className, src, type, onClose, ...props },
  ref,
) {
  const computedAuthor = author && (title ? ` von ${author}` : `Von ${author}`);
  return (
    <div className={cls(styles.parent, className)}>
      <AudioPlayer
        ref={ref}
        src={src}
        className={styles.globalPlayer}
        showVolume={false}
        {...props}
      />
      <div className={styles.info}>
        <div className={styles.line}>
          <strong>{title}</strong>
        </div>
        <div className={styles.line}>{computedAuthor}</div>
      </div>
      <PiX size="1.5rem" onClick={onClose} className={styles.close} />
    </div>
  );
});

export type AudioResource = {
  url: string;
  mimeType?: string;
  title?: string;
  author?: string;
};

type GlobalAudioContextValue = {
  playing: boolean;
  source?: AudioResource;
  play: (source: AudioResource) => void;
  pause: () => void;
};

const GlobalAudioContext = createContext<GlobalAudioContextValue>({
  playing: false,
  play() {},
  pause() {},
});

export const useGlobalAudio = () => useContext(GlobalAudioContext);

export const useAudioPlayer = (audio: AudioResource) => {
  const { playing, source, play, pause } = useGlobalAudio();
  return useMemo(
    () => ({
      playing: playing && source?.url === audio.url,
      play: () => play(audio),
      pause,
    }),
    [audio, pause, play, playing, source?.url],
  );
};

export const GlobalAudioProvider = ({ children }: PropsWithChildren) => {
  const element = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [source, setSource] = useState<AudioResource | undefined>();
  const value = useMemo(() => {
    const play = (audio: AudioResource) => {
      setSource(audio);
      if (source?.url === audio.url) {
        const player = element.current;
        if (!player) {
          throw new Error("audio player not found");
        }
        player.play();
      }
    };
    const pause = () => {
      const player = element.current;
      if (!player) {
        throw new Error("audio player not found");
      }
      player.pause();
    };
    return { playing, source, play, pause };
  }, [playing, source]);
  return (
    <GlobalAudioContext.Provider value={value}>
      {children}
      <GlobalAudioPlayer
        ref={element}
        className={cls(source == null && styles.hidden)}
        title={source?.title}
        author={source?.author}
        src={source?.url}
        type={source?.mimeType}
        autoPlay
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onClose={() => {
          value.pause();
          setSource(undefined);
        }}
      />
    </GlobalAudioContext.Provider>
  );
};
