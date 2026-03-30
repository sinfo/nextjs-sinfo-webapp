"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import styles from "@/styles/redeem-code.module.css";

interface RedeemCodeProps {
  code: string;
  isUrl: boolean;
}

type CopyState = "idle" | "copied" | "error";

function copyWithFallback(text: string): Promise<void> {
  if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
    return navigator.clipboard.writeText(text);
  }

  return new Promise((resolve, reject) => {
    try {
      const textArea = document.createElement("textarea");
      textArea.value = text;
      textArea.className = styles.copyTextarea;
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      const didCopy = document.execCommand("copy");
      document.body.removeChild(textArea);

      if (didCopy) {
        resolve();
      } else {
        reject(new Error("Clipboard copy command failed."));
      }
    } catch (error) {
      reject(error);
    }
  });
}

export default function RedeemCode({ code, isUrl }: RedeemCodeProps) {
  const [copyState, setCopyState] = useState<CopyState>("idle");
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const resetStateLater = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      setCopyState("idle");
    }, 1800);
  }, []);

  const handleRedeemClick = useCallback(async () => {
    try {
      await copyWithFallback(code);
      setCopyState("copied");
    } catch {
      setCopyState("error");
    } finally {
      resetStateLater();
    }
  }, [code, resetStateLater]);

  return (
    <details className="group">
      <summary
        onClick={handleRedeemClick}
        className="cursor-pointer list-none rounded-md border border-dashed border-sinfo-primary bg-sinfo-primary/10 px-3 py-2 text-center text-sm font-bold tracking-wide text-sinfo-primary transition-all duration-300 hover:bg-sinfo-primary/15 group-open:hidden"
      >
        Click to redeem
      </summary>

      <div className="grid opacity-0 transition-all duration-300 [grid-template-rows:0fr] group-open:mt-2 group-open:opacity-100 group-open:[grid-template-rows:1fr]">
        <div className="overflow-hidden">
          <div className="rounded-md border border-sinfo-primary/20 bg-white px-3 py-2 text-center">
            {isUrl ? (
              <a
                href={code}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-semibold text-sinfo-primary underline"
              >
                Open redeem link
              </a>
            ) : (
              <span className="block truncate text-sm font-bold tracking-wide text-sinfo-primary">
                {code}
              </span>
            )}
          </div>

          {copyState === "copied" && (
            <p className="mt-2 text-center text-xs text-emerald-600">
              Copied to clipboard
            </p>
          )}

          {copyState === "error" && (
            <p className="mt-2 text-center text-xs text-red-600">
              Could not copy automatically
            </p>
          )}
        </div>
      </div>
    </details>
  );
}
