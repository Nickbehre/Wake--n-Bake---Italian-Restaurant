'use client';

import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

export interface MenuPhoto {
  src: string;
  alt: string;
  label: string;
  color: string;
}

interface MenuPhotoOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  photos: MenuPhoto[];
  initialIndex?: number;
}

export default function MenuPhotoOverlay({ isOpen, onClose, photos, initialIndex = 0 }: MenuPhotoOverlayProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(initialIndex);
    }
  }, [isOpen, initialIndex]);

  const goNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % photos.length);
  }, [photos.length]);

  const goPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + photos.length) % photos.length);
  }, [photos.length]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') goNext();
      if (e.key === 'ArrowLeft') goPrev();
    };

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose, goNext, goPrev]);

  if (photos.length === 0) return null;

  const current = photos[currentIndex] || photos[0];
  const hasMultiple = photos.length > 1;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-50 flex items-center justify-center"
          onClick={onClose}
        >
          <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" />

          <div
            className="relative z-10 w-full h-full flex items-center justify-center p-4 md:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              onClick={onClose}
              className="absolute top-4 right-4 md:top-6 md:right-6 z-20 w-12 h-12 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </motion.button>

            {/* Label badge */}
            <motion.div
              key={`label-${currentIndex}`}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute top-4 left-1/2 -translate-x-1/2 md:top-6 z-20"
            >
              <span className={`inline-flex items-center gap-2 ${current.color} text-white font-oswald text-sm md:text-base uppercase tracking-wider px-5 py-2.5 rounded-full shadow-lg`}>
                {current.label}
              </span>
            </motion.div>

            {/* Previous arrow */}
            {hasMultiple && (
              <motion.button
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                onClick={goPrev}
                className="absolute left-1.5 md:left-6 z-20 w-11 h-11 md:w-16 md:h-16 bg-white/10 hover:bg-white/25 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-all hover:scale-110"
              >
                <ChevronLeft className="w-6 h-6 md:w-8 md:h-8" />
              </motion.button>
            )}

            {/* Next arrow */}
            {hasMultiple && (
              <motion.button
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                onClick={goNext}
                className="absolute right-1.5 md:right-6 z-20 w-11 h-11 md:w-16 md:h-16 bg-white/10 hover:bg-white/25 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-all hover:scale-110"
              >
                <ChevronRight className="w-6 h-6 md:w-8 md:h-8" />
              </motion.button>
            )}

            {/* Menu image — vult het kader op fotoformaat, met ronde hoeken */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, scale: 0.9, x: 50 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.9, x: -50 }}
                transition={{ duration: 0.35, ease: 'easeInOut' }}
                drag={hasMultiple ? 'x' : false}
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.15}
                onDragEnd={(_, info) => {
                  if (info.offset.x < -60) goNext();
                  else if (info.offset.x > 60) goPrev();
                }}
                className="relative aspect-[715/1000] h-[min(72vh,122vw)] md:h-[85vh] rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl"
              >
                <Image
                  src={current.src}
                  alt={current.alt}
                  fill
                  draggable={false}
                  className="object-cover"
                  sizes="(max-width: 768px) 95vw, 600px"
                  priority
                />
              </motion.div>
            </AnimatePresence>

            {/* Dots indicator */}
            {hasMultiple && (
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3">
                {photos.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentIndex(i)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      i === currentIndex
                        ? 'bg-white scale-125'
                        : 'bg-white/40 hover:bg-white/60'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
