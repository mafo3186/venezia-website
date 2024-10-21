/**
 * @see https://github.com/riyaddecoder/react-audio-play/tree/master
 */
import React, {
  AudioHTMLAttributes,
  DetailedHTMLProps,
  forwardRef,
  MouseEvent,
  MouseEventHandler,
  PointerEvent,
  PointerEventHandler,
  PropsWithChildren,
  useCallback,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { cls } from "../utilities";
import {
  PiArrowCounterClockwise as RetryIcon,
  PiPauseFill as PauseIcon,
  PiPlayFill as PlayIcon,
  PiSpeakerHighFill as SpeakerHigh,
  PiSpeakerXFill as SpeakerMute,
  PiSpinner as SpinnerIcon,
} from "react-icons/pi";
import styles from "./player.module.css";

const formatTime = (time: number) => {
  const min = Math.floor(time / 60);
  const sec = Math.floor(time % 60);
  return min + ":" + (sec < 10 ? "0" + sec : sec);
};

export type AudioInterface = {
  className?: string;
  loop?: boolean;
  backgroundColor?: string;
  color?: string;
  width?: number | string;
  style?: React.CSSProperties;
  sliderColor?: string;
  hasKeyBindings?: boolean;
  showVolume?: boolean;
} & DetailedHTMLProps<AudioHTMLAttributes<HTMLAudioElement>, HTMLAudioElement>;

const iconSize = "1.5rem";

export const AudioPlayer = forwardRef<
  HTMLAudioElement,
  PropsWithChildren<AudioInterface>
>(function AudioPlayer(
  {
    className,
    backgroundColor,
    color,
    width,
    style,
    sliderColor,
    hasKeyBindings = true,
    showVolume = true,
    onPlay,
    onPause,
    onEnded,
    onError,
    onCanPlay,
    onLoadedMetadata,
    onTimeUpdate,
    onVolumeChange,
    children,
    ...props
  },
  ref,
) {
  const audioRef = useRef<HTMLAudioElement>(null);
  useImperativeHandle(ref, () => audioRef.current!, [audioRef]);
  const currentlyDragged = useRef<HTMLDivElement | null>(null);
  const rewindPin = useRef<HTMLDivElement | null>(null);
  const rewindRange = useRef<HTMLDivElement | null>(null);
  const [canPlay, setCanPlay] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [dragging, setDragging] = useState<boolean>(false);
  const [previouslyPlaying, setPreviouslyPlaying] = useState<boolean>(false);
  const [progressBarPercent, setProgressBarPercent] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState<string>("0:00");
  const [totalTime, setTotalTime] = useState<string>("0:00");
  const [muted, setMuted] = useState(false);
  const [coefficient, setCoefficient] = useState<number>(0);
  const [hasError, setHasError] = useState<boolean>(false);

  const getTotalDuration = useCallback(() => {
    if (!audioRef.current) {
      return 0;
    }
    return audioRef.current.duration !== Infinity
      ? audioRef.current.duration
      : audioRef.current.buffered.end(0);
  }, []);

  const handleCanPlay: AudioInterface["onCanPlay"] = (event) => {
    setCanPlay(true);
    setHasError(false);
    onCanPlay?.(event);
  };

  const handleReload = () => {
    if (audioRef.current) {
      setCanPlay(false);
      setHasError(false);
      audioRef.current.load();
    }
  };

  const handleOnError: AudioInterface["onError"] = (event) => {
    setHasError(true);
    onError?.(event);
  };

  const handleEnded: AudioInterface["onEnded"] = (e) => {
    setIsPlaying(false);
    onEnded?.(e);
  };

  const handleVolumeChange: AudioInterface["onVolumeChange"] = (event) => {
    setMuted(audioRef.current?.muted ?? false);
    onVolumeChange?.(event);
  };

  const handleTimeUpdate: AudioInterface["onTimeUpdate"] = (event) => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const percent = (current / getTotalDuration()) * 100;
      setProgressBarPercent(percent);
      setCurrentTime(formatTime(current));
    }
    onTimeUpdate?.(event);
  };

  const handleLoadedMetaData: AudioInterface["onLoadedMetadata"] = (event) => {
    if (audioRef.current?.duration && audioRef.current?.duration !== Infinity) {
      setTotalTime(formatTime(audioRef.current.duration ?? 0));
      const currentTime = audioRef.current.duration * coefficient;
      audioRef.current.currentTime = currentTime;
    }
    onLoadedMetadata?.(event);
  };

  const togglePlay = () => {
    if (audioRef.current) {
      if (audioRef.current.paused) {
        audioRef.current.play();
      } else {
        audioRef.current.pause();
      }
    }
  };

  function getCoefficient(
    event:
      | MouseEvent
      | TouchEvent
      | React.MouseEvent<HTMLDivElement, MouseEvent>,
  ) {
    // const slider = getRangeBox(event, currentlyDragged.current);
    const slider = rewindRange.current!;
    const rect = slider.getBoundingClientRect();

    const clientX =
      "touches" in event ? event.touches[0].clientX : event.clientX;
    const offsetX = clientX - rect.left;
    const width = slider.clientWidth;
    const K = offsetX / width;

    return K;
  }

  const rewind = (event: PointerEvent | MouseEvent) => {
    if (audioRef.current) {
      if (!audioRef.current.duration) {
        setCoefficient(getCoefficient(event));
      } else if (audioRef.current.duration) {
        audioRef.current.currentTime =
          getTotalDuration() * getCoefficient(event);
      }
    }
  };

  const handleRewindDragging: PointerEventHandler<HTMLDivElement> = (event) => {
    event.stopPropagation();
    event.currentTarget.setPointerCapture(event.pointerId);
    setDragging(true);
    setPreviouslyPlaying(!audioRef.current?.paused);
    audioRef.current?.pause();
    currentlyDragged.current = rewindPin.current;
    rewind(event);
  };

  const handlePointerMove: PointerEventHandler<HTMLDivElement> = (event) => {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.stopPropagation();
      rewind(event);
    }
  };

  const handlePointerUp: PointerEventHandler = (event) => {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.stopPropagation();
      currentlyDragged.current = null;
      setDragging(false);
      if (previouslyPlaying) {
        audioRef.current?.play();
      }
    }
  };

  const adjustAudioTime = (percentage: number) => {
    if (audioRef.current) {
      const currentTime =
        audioRef.current.currentTime + getTotalDuration() * (percentage / 100);
      audioRef.current.currentTime = Math.min(currentTime, getTotalDuration());
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (!hasKeyBindings) {
      return;
    }
    event.preventDefault();
    switch (event.key) {
      case "ArrowLeft":
        adjustAudioTime(-5);
        break;
      case "ArrowRight":
        adjustAudioTime(5);
        break;
      case " ":
        togglePlay();
        break;
      default:
        //Nothing to do
        break;
    }
  };

  const handleOnPlay: AudioInterface["onPlay"] = (event) => {
    setIsPlaying(true);
    onPlay?.(event);
  };

  const handleOnPause: AudioInterface["onPause"] = (event) => {
    setIsPlaying(false);
    onPause?.(event);
  };
  const handleVolumeClick: MouseEventHandler = useCallback((event) => {
    event.stopPropagation();
    if (audioRef.current) {
      audioRef.current.muted = !audioRef.current.muted;
    }
  }, []);
  const swallowEvent = useCallback((event: MouseEvent | PointerEvent) => {
    event.stopPropagation();
  }, []);
  const SpeakerIcon = muted ? SpeakerMute : SpeakerHigh;
  const PlayPauseIcon = (dragging ? previouslyPlaying : isPlaying)
    ? PauseIcon
    : PlayIcon;
  return (
    <div
      tabIndex={-1}
      onKeyDown={handleKeyPress}
      className={cls(styles.playerContainer, className)}
      style={{
        ...(backgroundColor ? { backgroundColor: backgroundColor } : {}),
        ...(color ? { color: color } : {}),
        ...(width ? { width: width, maxWidth: width } : {}),
        ...style,
      }}
    >
      {hasError && (
        <span
          title="Es ist ein Fehler aufgetreten"
          className={styles.playerPlayPauseButton}
          onClick={handleReload}
          onPointerDown={(event) => event.stopPropagation()}
        >
          <RetryIcon size={iconSize} />
        </span>
      )}
      {!canPlay && !hasError && (
        <SpinnerIcon size={iconSize} className={styles.playerSpinner} />
      )}
      {canPlay && !hasError && (
        <div
          className={styles.playerPlayPauseButton}
          onClick={() => togglePlay()}
          onPointerDown={(event) => event.stopPropagation()}
        >
          <PlayPauseIcon size={iconSize} />
        </div>
      )}
      <div className={styles.playerTime}>
        <span className={styles.playerCurrentTime}>{currentTime}</span>
        <span className={styles.playerTimeSeparator}></span>
        <span className={styles.playerTotalTime}>{totalTime}</span>
      </div>
      <div
        className={styles.playerSliderInteraction}
        onPointerDown={handleRewindDragging}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >
        <div ref={rewindRange} className={styles.playerSlider}>
          <div
            className={styles.playerSliderProgress}
            style={{ width: progressBarPercent + "%" }}
          >
            <div ref={rewindPin} className={styles.playerSliderPin}></div>
          </div>
        </div>
      </div>
      {showVolume && (
        <div
          className={styles.playerVolumeButton}
          onClick={handleVolumeClick}
          onPointerDown={swallowEvent}
        >
          <SpeakerIcon size={iconSize} />
        </div>
      )}
      <audio
        ref={audioRef}
        onPlay={handleOnPlay}
        onPause={handleOnPause}
        onEnded={handleEnded}
        onError={handleOnError}
        onCanPlay={handleCanPlay}
        onLoadedMetadata={handleLoadedMetaData}
        onTimeUpdate={handleTimeUpdate}
        onVolumeChange={handleVolumeChange}
        {...props}
      >
        {children}
      </audio>
    </div>
  );
});
