"use client";

import { useRouter } from "next/navigation";
import { useSyncExternalStore, useTransition } from "react";

import { disableDraftMode } from "./actions";

const emptySubscribe = () => () => { };

export default function AlertBanner() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const shouldShow = useSyncExternalStore(
    emptySubscribe,
    () => window.top === window,
    () => false,
  );

  if (!shouldShow) return null;

  return (
    <div>
      {pending ? (
        "Disabling draft mode..."
      ) : (
        <>
          {"Previewing drafts. "}
          <button
            type="button"
            onClick={() =>
              startTransition(() =>
                disableDraftMode().then(() => {
                  router.refresh();
                }),
              )
            }
          >
            Back to published
          </button>
        </>
      )}
    </div>
  );
}