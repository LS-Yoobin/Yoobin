"use client";

import { useEffect, useRef } from "react";

type AutoHeightIframeProps = {
  title: string;
  srcDoc: string;
  className?: string;
};

function getContentHeight(doc: Document) {
  const body = doc.body;
  const html = doc.documentElement;
  return Math.max(
    body?.scrollHeight ?? 0,
    body?.offsetHeight ?? 0,
    html?.clientHeight ?? 0,
    html?.scrollHeight ?? 0,
    html?.offsetHeight ?? 0,
  );
}

export default function AutoHeightIframe({ title, srcDoc, className }: AutoHeightIframeProps) {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    let observer: ResizeObserver | null = null;
    let rafId = 0;

    const syncHeight = () => {
      const doc = iframe.contentDocument;
      if (!doc) return;
      const nextHeight = getContentHeight(doc);
      iframe.style.height = `${nextHeight}px`;
    };

    const setup = () => {
      syncHeight();

      const doc = iframe.contentDocument;
      if (!doc?.documentElement) return;

      observer = new ResizeObserver(() => syncHeight());
      observer.observe(doc.documentElement);
      if (doc.body) observer.observe(doc.body);

      const start = performance.now();
      const settleLoop = (now: number) => {
        syncHeight();
        if (now - start < 2200) {
          rafId = requestAnimationFrame(settleLoop);
        }
      };
      rafId = requestAnimationFrame(settleLoop);
    };

    iframe.addEventListener("load", setup);
    setup();

    return () => {
      iframe.removeEventListener("load", setup);
      observer?.disconnect();
      cancelAnimationFrame(rafId);
    };
  }, [srcDoc]);

  return <iframe ref={iframeRef} title={title} srcDoc={srcDoc} className={className} />;
}
