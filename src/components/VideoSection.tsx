'use client';

import { useRef, useState } from 'react';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Sparkles,
} from 'lucide-react';

export default function VideoSection() {
  const videoRef = useRef<HTMLVideoElement>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  const togglePlay = async () => {
    const video = videoRef.current;

    if (!video) return;

    if (video.paused) {
      await video.play();
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    const video = videoRef.current;

    if (!video) return;

    video.muted = !video.muted;
    setIsMuted(video.muted);
  };

  const toggleFullscreen = async () => {
    const video = videoRef.current;

    if (!video) return;

    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      } else {
        await video.requestFullscreen();
      }
    } catch {
      // Fullscreen may not be supported in some browsers.
    }
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#fff3f6] via-pink-50/70 to-[#fff8fa] py-20 sm:py-24">
      
      {/* Background Decorations */}

      <div className="pointer-events-none absolute -left-32 top-10 h-80 w-80 rounded-full bg-pink-200/30 blur-3xl" />

      <div className="pointer-events-none absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-rose-200/30 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* ================= HEADER ================= */}

        <div className="mx-auto max-w-2xl text-center">

          <div className="inline-flex items-center gap-2 rounded-full border border-pink-200 bg-pink-50/80 px-4 py-2 shadow-sm backdrop-blur">

            <Sparkles size={14} className="text-pink-600" />

            <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-pink-600">
              The Jannat Experience
            </span>

            <Sparkles size={14} className="text-pink-600" />

          </div>

          <h2 className="mt-5 font-serif text-4xl font-semibold text-maroon-950 sm:text-5xl">

            Elegance In

            <span className="ml-2 bg-gradient-to-r from-rose-900 via-pink-600 to-rose-800 bg-clip-text text-transparent">
              Motion
            </span>

          </h2>

          <div className="mx-auto mt-6 flex items-center justify-center gap-3">

            <span className="h-px w-10 bg-gradient-to-r from-transparent to-pink-300" />

            <Sparkles size={15} className="text-pink-500" />

            <span className="h-px w-10 bg-gradient-to-l from-transparent to-pink-300" />

          </div>

          <p className="mt-5 text-sm leading-7 text-maroon-900/60 sm:text-base">
            Discover the beauty, grace and timeless elegance behind every
            creation from Jannat Elegance.
          </p>

        </div>

        {/* ================= VIDEO ================= */}

        <div className="relative mx-auto mt-12 max-w-6xl sm:mt-16">

          {/* Outer Glow */}

          <div className="pointer-events-none absolute -inset-4 rounded-[40px] bg-gradient-to-r from-pink-300/20 via-rose-300/20 to-pink-300/20 blur-2xl" />

          {/* Video Container */}

          <div className="group relative overflow-hidden rounded-[30px] border border-pink-200/70 bg-maroon-950 p-2 shadow-2xl shadow-maroon-950/20 sm:rounded-[40px] sm:p-3">

            {/* Video */}

            <div className="relative aspect-video overflow-hidden rounded-[24px] bg-maroon-950 sm:rounded-[32px]">

              <video
                ref={videoRef}
                className="h-full w-full object-cover"
                poster="/images/video-poster.jpg"
                muted
                playsInline
                preload="metadata"
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
              >
                {/* CHANGE VIDEO PATH HERE */}

                <source
                  src="/videos/jannat-elegance.mp4"
                  type="video/mp4"
                />

                Your browser does not support the video tag.

              </video>

              {/* Cinematic Overlay */}

              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-maroon-950/70 via-transparent to-maroon-950/10" />

              {/* ================= CENTER PLAY BUTTON ================= */}

              {!isPlaying && (
                <button
                  type="button"
                  onClick={togglePlay}
                  aria-label="Play video"
                  className="absolute left-1/2 top-1/2 flex h-20 w-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 bg-gradient-to-br from-rose-900 to-pink-600 text-white shadow-2xl shadow-black/30 backdrop-blur transition-all duration-300 hover:scale-110 sm:h-24 sm:w-24"
                >
                  <Play
                    size={30}
                    className="ml-1 fill-white sm:h-9 sm:w-9"
                  />
                </button>
              )}

              {/* ================= VIDEO TITLE ================= */}

              <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-8">

                <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">

                  <div>

                    <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-pink-300">
                      Jannat Elegance
                    </p>

                    <h3 className="mt-2 font-serif text-2xl font-semibold text-white sm:text-4xl">
                      Where Tradition Meets Modern Grace
                    </h3>

                  </div>

                  {/* Controls */}

                  <div className="flex items-center gap-2">

                    {/* Play / Pause */}

                    <button
                      type="button"
                      onClick={togglePlay}
                      aria-label={isPlaying ? 'Pause video' : 'Play video'}
                      className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur transition hover:bg-pink-500 sm:h-11 sm:w-11"
                    >
                      {isPlaying ? (
                        <Pause size={17} className="fill-white" />
                      ) : (
                        <Play size={17} className="ml-0.5 fill-white" />
                      )}
                    </button>

                    {/* Mute */}

                    <button
                      type="button"
                      onClick={toggleMute}
                      aria-label={isMuted ? 'Unmute video' : 'Mute video'}
                      className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur transition hover:bg-pink-500 sm:h-11 sm:w-11"
                    >
                      {isMuted ? (
                        <VolumeX size={17} />
                      ) : (
                        <Volume2 size={17} />
                      )}
                    </button>

                    {/* Fullscreen */}

                    <button
                      type="button"
                      onClick={toggleFullscreen}
                      aria-label="Fullscreen video"
                      className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur transition hover:bg-pink-500 sm:h-11 sm:w-11"
                    >
                      <Maximize size={17} />
                    </button>

                  </div>

                </div>

              </div>

            </div>

          </div>

          {/* Bottom Caption */}

          <div className="mx-auto mt-7 max-w-2xl text-center">

            <p className="font-serif text-lg italic text-maroon-900/70 sm:text-xl">
              “Every outfit is designed to make your moment feel unforgettable.”
            </p>

          </div>

        </div>

      </div>
    </section>
  );
}