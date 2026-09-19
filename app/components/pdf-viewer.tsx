"use client";

import { useEffect, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";

type PdfViewerProps = {
  file: string;
  title: string;
  onClose: () => void;
};

export default function PdfViewer({ file, title, onClose }: PdfViewerProps) {
  const pdfUrl = `/pdfs/${file}`;
  const isMounted = useSyncExternalStore(() => () => {}, () => true, () => false);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  if (!isMounted) return null;

  return createPortal(
    <div className="pdf-viewer-backdrop" role="presentation">
      <section className="pdf-viewer" role="dialog" aria-modal="true" aria-labelledby="pdf-viewer-title">
        <header className="pdf-viewer-header">
          <div>
            <p className="eyebrow">Free sample</p>
            <h2 id="pdf-viewer-title">{title}</h2>
          </div>
          <div className="pdf-viewer-actions">
            <a className="pdf-viewer-download" href={pdfUrl} download>
              Download PDF <span aria-hidden="true">&#8595;</span>
            </a>
            <button className="pdf-viewer-close" type="button" onClick={onClose} aria-label="Close PDF viewer">
              &times;
            </button>
          </div>
        </header>
        <div className="pdf-viewer-container">
          <iframe className="pdf-viewer-frame" src={pdfUrl} title={`${title} PDF preview`} />
        </div>
      </section>
    </div>,
    document.body,
  );
}
