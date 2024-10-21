import { useThree } from "@react-three/fiber";
import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useMemo,
} from "react";
import { AudioContext, AudioListener } from "three";

const rampDuration = 3;

const AudioListenerContext = createContext<AudioListener | undefined>(
  undefined,
);

export const useAudioListener = () => {
  const listener = useContext(AudioListenerContext);
  if (!listener) {
    throw new Error("AudioListener has not been initialized yet");
  }
  return listener;
};

export const AudioListenerProvider = ({
  audioListener,
  volume,
  children,
}: PropsWithChildren<{ audioListener?: AudioListener; volume?: number }>) => {
  const listener = useMemo(
    () => audioListener ?? new AudioListener(),
    [audioListener],
  );
  const camera = useThree(({ camera }) => camera);
  useEffect(() => {
    camera.add(listener);
    return () => {
      camera.remove(listener);
    };
  }, [camera, listener]);
  useEffect(() => {
    if (volume != undefined) {
      const context = AudioContext.getContext();
      if (context.state === "running" || volume >= 0.01) {
        if (context.state !== "running") {
          context.resume();
          listener.gain.gain.setValueAtTime(0, context.currentTime);
        }
        listener.gain.gain.linearRampToValueAtTime(
          volume,
          context.currentTime + rampDuration,
        );
        if (volume < 0.01) {
          const timeout = setTimeout(() => context.suspend(), 3000);
          return () => {
            clearTimeout(timeout);
          };
        }
      }
    }
  }, [listener, volume]);
  useEffect(() => {
    // work around disabled autoplay
    const interaction = () => {
      const context = AudioContext.getContext();
      if (context.state !== "running" && (volume ?? 1) >= 0.01) {
        context.resume();
        listener.gain.gain.setValueAtTime(0, context.currentTime);
        listener.gain.gain.linearRampToValueAtTime(
          volume ?? 1,
          context.currentTime + rampDuration,
        );
      }
    };
    document.addEventListener("pointerdown", interaction, true);
    document.addEventListener("keydown", interaction, true);
    return () => {
      document.removeEventListener("pointerdown", interaction, true);
      document.removeEventListener("keydown", interaction, true);
    };
  }, [listener, volume]);
  return (
    <AudioListenerContext.Provider value={listener}>
      {children}
    </AudioListenerContext.Provider>
  );
};
