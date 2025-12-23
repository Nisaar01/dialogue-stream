import { useState } from "react";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  SkipBack,
  SkipForward,
  RotateCcw,
} from "lucide-react";
import { Slider } from "@/components/ui/slider";

interface TimelineMarker {
  position: number;
  type: "note" | "recording";
}

interface VideoPlayerProps {
  isPlaying: boolean;
  onPlayPause: () => void;
  currentTime: number;
  duration: number;
  onSeek: (time: number) => void;
  markers: TimelineMarker[];
  isRecording: boolean;
}

export function VideoPlayer({
  isPlaying,
  onPlayPause,
  currentTime,
  duration,
  onSeek,
  markers,
  isRecording,
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
      className="relative w-full h-full bg-black rounded-xl overflow-hidden group"
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      {/* Letterbox Top */}
      <div className="letterbox top-0" />

      {/* Video Placeholder */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-full h-full bg-gradient-to-br from-secondary/20 to-background flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="w-24 h-24 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center mx-auto">
              <Play className="w-10 h-10 text-primary ml-1" />
            </div>
            <div>
              <h3 className="font-display text-xl text-foreground">Breaking Bad</h3>
              <p className="text-sm text-muted-foreground">S5 E14 · "Ozymandias"</p>
            </div>
          </div>
        </div>
      </div>

      {/* Letterbox Bottom */}
      <div className="letterbox bottom-0" />

      {/* Recording Indicator */}
      {isRecording && (
        <div className="absolute top-6 left-6 flex items-center gap-2 px-3 py-1.5 rounded-full bg-recording/20 border border-recording/50 animate-recording">
          <div className="w-2 h-2 rounded-full bg-recording" />
          <span className="text-sm font-medium text-recording">Recording Dialogue</span>
        </div>
      )}

      {/* Gradient Overlay */}
      <div
        className={`absolute inset-0 transition-opacity duration-300 pointer-events-none ${
          showControls ? "opacity-100" : "opacity-0"
        }`}
        style={{ background: "var(--gradient-cinematic)" }}
      />

      {/* Controls */}
      <div
        className={`absolute bottom-0 left-0 right-0 p-6 transition-all duration-300 ${
          showControls ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
      >
        {/* Timeline */}
        <div className="relative mb-4">
          <div className="relative h-1 bg-secondary/50 rounded-full cursor-pointer group/timeline">
            {/* Progress */}
            <div
              className="absolute left-0 top-0 h-full bg-primary rounded-full transition-all"
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
              className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-primary rounded-full opacity-0 group-hover/timeline:opacity-100 transition-opacity shadow-glow"
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
          <div className="flex items-center gap-4">
            {/* Play Controls */}
            <button className="text-foreground hover:text-primary transition-colors">
              <SkipBack className="w-5 h-5" />
            </button>
            <button
              onClick={onPlayPause}
              className="w-12 h-12 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center text-foreground hover:bg-primary/20 hover:border-primary/50 transition-all"
            >
              {isPlaying ? (
                <Pause className="w-5 h-5" />
              ) : (
                <Play className="w-5 h-5 ml-0.5" />
              )}
            </button>
            <button className="text-foreground hover:text-primary transition-colors">
              <SkipForward className="w-5 h-5" />
            </button>

            {/* Replay Last Line */}
            <button className="control-pill ml-4">
              <RotateCcw className="w-4 h-4" />
              <span>Replay Line</span>
            </button>
          </div>

          {/* Center - Time */}
          <div className="text-sm font-mono text-muted-foreground">
            <span className="text-foreground">{formatTime(currentTime)}</span>
            <span className="mx-2">/</span>
            <span>{formatTime(duration)}</span>
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-4">
            {/* Volume */}
            <div className="flex items-center gap-2 group/volume">
              <button
                onClick={() => setIsMuted(!isMuted)}
                className="text-foreground hover:text-primary transition-colors"
              >
                {isMuted ? (
                  <VolumeX className="w-5 h-5" />
                ) : (
                  <Volume2 className="w-5 h-5" />
                )}
              </button>
              <div className="w-0 group-hover/volume:w-20 overflow-hidden transition-all duration-300">
                <Slider
                  value={[isMuted ? 0 : volume]}
                  max={100}
                  step={1}
                  onValueChange={(value) => {
                    setVolume(value[0]);
                    setIsMuted(value[0] === 0);
                  }}
                  className="w-20"
                />
              </div>
            </div>

            {/* Fullscreen */}
            <button className="text-foreground hover:text-primary transition-colors">
              <Maximize className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
