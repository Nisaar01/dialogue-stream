import { X, Play, Trash2, Mic, Clock } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Recording {
  id: string;
  timestamp: string;
  duration: string;
  dialogue: string;
  episode: string;
}

interface RecordingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  recordings: Recording[];
  onPlay: (id: string) => void;
  onDelete: (id: string) => void;
  onStartNewRecording: () => void;
  isRecording: boolean;
  onStopRecording: () => void;
}

export function RecordingsPanel({
  isOpen,
  onClose,
  recordings,
  onPlay,
  onDelete,
  onStartNewRecording,
  isRecording,
  onStopRecording,
}: RecordingsPanelProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 w-80 bg-card border-l border-border/50 z-50 flex flex-col slide-in-right">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border/50">
        <div className="flex items-center gap-2">
          <Mic className="w-4 h-4 text-muted-foreground" />
          <h2 className="font-medium text-foreground">Recordings</h2>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-md hover:bg-secondary/50 text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* New Recording Button */}
      <div className="p-4 border-b border-border/30">
        {isRecording ? (
          <button
            onClick={onStopRecording}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-md bg-destructive/80 text-destructive-foreground transition-colors hover:bg-destructive/90"
          >
            <div className="w-2 h-2 rounded-full bg-current animate-pulse" />
            <span className="text-sm font-medium">Stop Recording</span>
          </button>
        ) : (
          <button
            onClick={onStartNewRecording}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-md bg-secondary/60 hover:bg-secondary/80 text-foreground border border-border/40 transition-colors"
          >
            <Mic className="w-4 h-4" />
            <span className="text-sm font-medium">New Recording</span>
          </button>
        )}
      </div>

      {/* Recordings List */}
      <ScrollArea className="flex-1">
        <div className="p-3 space-y-2">
          {recordings.length === 0 ? (
            <div className="text-center py-8">
              <Mic className="w-8 h-8 text-muted-foreground/40 mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">No recordings yet</p>
              <p className="text-xs text-muted-foreground/60 mt-1">
                Click "New Recording" to capture a dialogue
              </p>
            </div>
          ) : (
            recordings.map((recording) => (
              <div
                key={recording.id}
                className="p-3 rounded-md bg-secondary/30 hover:bg-secondary/50 transition-colors group"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-foreground line-clamp-2 leading-relaxed">
                      "{recording.dialogue}"
                    </p>
                    <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                      <span className="font-mono">{recording.timestamp}</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {recording.duration}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground/60 mt-1">
                      {recording.episode}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => onPlay(recording.id)}
                      className="p-1.5 rounded hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <Play className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onDelete(recording.id)}
                      className="p-1.5 rounded hover:bg-destructive/20 text-muted-foreground hover:text-destructive transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
