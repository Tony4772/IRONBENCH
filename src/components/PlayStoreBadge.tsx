import React from 'react';

const PLAY_STORE_URL =
  'https://play.google.com/store/apps/details?id=com.ebyzom.ironbench&pli=1';

interface PlayStoreBadgeProps {
  className?: string;
}

export const PlayStoreBadge: React.FC<PlayStoreBadgeProps> = ({ className = 'h-14' }) => {
  return (
    <a
      href={PLAY_STORE_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex shrink-0"
    >
      <img
        src="/google-play-badge-es.png"
        alt="Disponible en Google Play"
        className={`w-auto ${className}`}
      />
    </a>
  );
};
