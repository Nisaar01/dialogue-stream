import { useState } from "react";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  SkipBack,
  SkipForward,
} from "lucide-react";
import { Slider } from "@/components/ui/slider";

interface TimelineMarker {
  position: number;
  type: "note" | "recording";
}

interface VideoInfo {
  title: string;
  season: number;
  episode: number;
  episodeTitle: string;
}

interface VideoPlayerProps {
  isPlaying: boolean;
  onPlayPause: () => void;
  currentTime: number;
  duration: number;
  onSeek: (time: number) => void;
  markers: TimelineMarker[];
  isRecording: boolean;
  videoInfo: VideoInfo;
}

export function VideoPlayer({
  isPlaying,
  onPlayPause,
  currentTime,
  duration,
  onSeek,
  markers,
  isRecording,
  videoInfo,
}: VideoPlayerProps) {
  const [showControls, setShowControls] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(80);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const progress = (currentTime / duration) * 100;

  return (
    <div
      className="relative w-full h-full bg-black rounded-lg overflow-hidden group"
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      {/* Video Title Overlay */}
      <div
        className={`video-title-overlay transition-opacity duration-300 ${
          showControls ? "opacity-100" : "opacity-0"
        }`}
      >
        <h2 className="text-lg font-medium text-foreground">{videoInfo.title}</h2>
        <p className="text-sm text-muted-foreground mt-0.5">
          S{videoInfo.season} E{videoInfo.episode} · {videoInfo.episodeTitle}
        </p>
      </div>

      {/* Video Placeholder */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-full h-full bg-gradient-to-br from-secondary/10 to-background flex items-center justify-center">
          <button
            onClick={onPlayPause}
            className="w-16 h-16 rounded-full bg-foreground/10 hover:bg-foreground/20 flex items-center justify-center transition-all"
          >
            {isPlaying ? (
              <Pause className="w-6 h-6 text-foreground" />
            ) : (
              <Play className="w-6 h-6 text-foreground ml-1" />
            )}
          </button>
        </div>
      </div>

      {/* Recording Indicator */}
      {isRecording && (
        <div className="absolute top-4 right-4 flex items-center gap-2 px-3 py-1.5 rounded-md bg-destructive/20 border border-destructive/40 animate-recording">
          <div className="w-2 h-2 rounded-full bg-destructive" />
          <span className="text-sm font-medium text-destructive">Recording</span>
        </div>
      )}

      {/* Controls Overlay */}
      <div
        className={`absolute bottom-0 left-0 right-0 transition-opacity duration-300 ${
          showControls ? "opacity-100" : "opacity-0"
        }`}
        style={{ background: "var(--gradient-cinematic)" }}
      >
        <div className="p-4 pt-12">
          {/* Timeline */}
          <div className="relative mb-3">
            <div className="relative h-1 bg-secondary/60 rounded-full cursor-pointer group/timeline">
              {/* Progress */}
              <div
                className="absolute left-0 top-0 h-full bg-foreground/70 rounded-full transition-all"
                style={{ width: `${progress}%` }}
              />
              
              {/* Markers */}
              {markers.map((marker, index) => (
                <div
                  key={index}
                  className="timeline-marker top-1/2 -translate-y-1/2"
                  style={{ left: `${marker.position}%` }}
                />
              ))}

              {/* Hover indicator */}
              <div
                className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-foreground rounded-full opacity-0 group-hover/timeline:opacity-100 transition-opacity"
                style={{ left: `${progress}%`, transform: "translate(-50%, -50%)" }}
              />
            </div>
            
            <Slider
              value={[currentTime]}
              max={duration}
              step={1}
              onValueChange={(value) => onSeek(value[0])}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
          </div>

          {/* Control Buttons */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Play Controls */}
              <button className="p-1.5 text-foreground/70 hover:text-foreground transition-colors">
                <SkipBack className="w-4 h-4" />
              </button>
              <button
                onClick={onPlayPause}
                className="p-2 rounded-full bg-foreground/10 hover:bg-foreground/20 text-foreground transition-all"
              >
                {isPlaying ? (
                  <Pause className="w-4 h-4" />
                ) : (
                  <Play className="w-4 h-4 ml-0.5" />
                )}
              </button>
              <button className="p-1.5 text-foreground/70 hover:text-foreground transition-colors">
                <SkipForward className="w-4 h-4" />
              </button>

              {/* Time */}
              <div className="text-xs font-mono text-muted-foreground ml-2">
                <span className="text-foreground/80">{formatTime(currentTime)}</span>
                <span className="mx-1.5">/</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            {/* Right Controls */}
            <div className="flex items-center gap-2">
              {/* Volume */}
              <div className="flex items-center gap-1.5 group/volume">
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className="p-1.5 text-foreground/70 hover:text-foreground transition-colors"
                >
                  {isMuted ? (
                    <VolumeX className="w-4 h-4" />
                  ) : (
                    <Volume2 className="w-4 h-4" />
                  )}
                </button>
                <div className="w-0 group-hover/volume:w-16 overflow-hidden transition-all duration-200">
                  <Slider
                    value={[isMuted ? 0 : volume]}
                    max={100}
                    step={1}
                    onValueChange={(value) => {
                      setVolume(value[0]);
                      setIsMuted(value[0] === 0);
                    }}
                    className="w-16"
                  />
                </div>
              </div>

              {/* Fullscreen */}
              <button className="p-1.5 text-foreground/70 hover:text-foreground transition-colors">
                <Maximize className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
