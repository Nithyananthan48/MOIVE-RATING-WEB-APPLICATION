import React, { useEffect } from "react";
import { X } from "lucide-react";

interface TrailerModalProps {
  isOpen: boolean;
  trailerUrl: string;
  movieTitle: string;
  onClose: () => void;
}

function getEmbedUrl(url: string): string {
  if (!url) return "";
  if (url.includes("/embed/")) return url;

  // Handle standard youtube.com/watch?v=ID
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);

  if (match && match[2].length === 11) {
    return `https://www.youtube-nocookie.com/embed/${match[2]}?autoplay=1&rel=0`;
  }

  return url;
}

export const TrailerModal: React.FC<TrailerModalProps> = ({
  isOpen,
  trailerUrl,
  movieTitle,
  onClose
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "auto";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !trailerUrl) return null;

  const embedUrl = getEmbedUrl(trailerUrl);

  return (
    <div className="modal-backdrop" onClick={onClose} aria-modal="true" role="dialog">
      <div className="trailer-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">Trailer: {movieTitle}</h3>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close trailer">
            <X size={20} />
          </button>
        </div>

        <div className="video-responsive-wrapper">
          <iframe
            src={embedUrl}
            title={`${movieTitle} Official Trailer`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="trailer-iframe"
          />
        </div>
      </div>
    </div>
  );
};
