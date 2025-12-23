import { Bookmark, Edit3, Mic, RotateCcw, StopCircle } from "lucide-react";

interface SubtitleLine {
  id: string;
  text: string;
  timestamp: string;
  startTime: number;
}

interface SubtitlePanelProps {
  subtitles: SubtitleLine[];
  currentIndex: number;
  onLineClick: (startTime: number) => void;
  onSaveDialogue: (line: SubtitleLine) => void;
  onAddNote: (line: SubtitleLine) => void;
  onStartRecording: () => void;
  onStopRecording: () => void;
  onReplayLine: () => void;
  isRecording: boolean;
}

export function SubtitlePanel({
  subtitles,
  currentIndex,
  onLineClick,
  onSaveDialogue,
  onAddNote,
  onStartRecording,
  onStopRecording,
  onReplayLine,
  isRecording,
}: SubtitlePanelProps) {
  const getLineClass = (index: number) => {
    const diff = index - currentIndex;
    
    if (diff === 0) return "subtitle-current";
    if (Math.abs(diff) === 1) return "subtitle-adjacent";
    return "subtitle-distant";
  };

  const getLineOpacity = (index: number) => {
    const diff = Math.abs(index - currentIndex);
    if (diff === 0) return "opacity-100";
    if (diff === 1) return "opacity-70";
    if (diff === 2) return "opacity-50";
    return "opacity-30";
  };

  const visibleRange = 3;
  const startIndex = Math.max(0, currentIndex - visibleRange);
  const endIndex = Math.min(subtitles.length - 1, currentIndex + visibleRange);
  const visibleSubtitles = subtitles.slice(startIndex, endIndex + 1);

  const currentLine = subtitles[currentIndex];

  return (
    <div className="flex flex-col h-full glass-panel rounded-xl">
      {/* Header */}
      <div className="px-5 py-4 border-b border-border/50">
        <h2 className="font-display font-semibold text-foreground">Subtitles</h2>
        <p className="text-xs text-muted-foreground mt-1">Click any line to jump</p>
      </div>

      {/* Subtitle Lines */}
      <div className="flex-1 overflow-hidden py-4">
        <div className="h-full flex flex-col justify-center px-3 space-y-2">
          {visibleSubtitles.map((line, idx) => {
            const actualIndex = startIndex + idx;
            const isCurrent = actualIndex === currentIndex;
            
            return (
              <div
                key={line.id}
                onClick={() => onLineClick(line.startTime)}
                className={`subtitle-line ${getLineClass(actualIndex)} ${getLineOpacity(actualIndex)} ${
                  isCurrent ? "bg-primary/5 border-l-2 border-primary" : ""
                }`}
              >
                <div className="flex items-start gap-3">
                  <span className="text-xs font-mono text-muted-foreground shrink-0 pt-0.5">
                    {line.timestamp}
                  </span>
                  <p className={`leading-relaxed ${isCurrent ? "text-glow" : ""}`}>
                    {line.text}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Dialogue Controls */}
      <div className="p-4 border-t border-border/50 space-y-3">
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => currentLine && onSaveDialogue(currentLine)}
            className="control-pill justify-center"
          >
            <Bookmark className="w-4 h-4" />
            <span>Save</span>
          </button>
          <button
            onClick={() => currentLine && onAddNote(currentLine)}
            className="control-pill justify-center"
          >
            <Edit3 className="w-4 h-4" />
            <span>Add Note</span>
          </button>
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          {isRecording ? (
            <button
              onClick={onStopRecording}
              className="control-pill control-pill-active justify-center col-span-1"
            >
              <StopCircle className="w-4 h-4" />
              <span>Stop</span>
            </button>
          ) : (
            <button
              onClick={onStartRecording}
              className="control-pill justify-center"
            >
              <Mic className="w-4 h-4" />
              <span>Record</span>
            </button>
          )}
          <button onClick={onReplayLine} className="control-pill justify-center">
            <RotateCcw className="w-4 h-4" />
            <span>Replay</span>
          </button>
        </div>
      </div>
    </div>
  );
}
