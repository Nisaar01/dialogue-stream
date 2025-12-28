import { Bookmark, Edit3, Mic, RotateCcw } from "lucide-react";

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
  onOpenRecordings: () => void;
  onReplayLine: () => void;
}

export function SubtitlePanel({
  subtitles,
  currentIndex,
  onLineClick,
  onSaveDialogue,
  onAddNote,
  onOpenRecordings,
  onReplayLine,
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
    if (diff === 1) return "opacity-75";
    if (diff === 2) return "opacity-50";
    return "opacity-35";
  };

  const visibleRange = 3;
  const startIndex = Math.max(0, currentIndex - visibleRange);
  const endIndex = Math.min(subtitles.length - 1, currentIndex + visibleRange);
  const visibleSubtitles = subtitles.slice(startIndex, endIndex + 1);

  const currentLine = subtitles[currentIndex];

  return (
    <div className="flex flex-col h-full bg-card/40 border border-border/30 rounded-lg">
      {/* Header */}
      <div className="px-4 py-3 border-b border-border/30">
        <h2 className="font-medium text-sm text-foreground">Subtitles</h2>
      </div>

      {/* Subtitle Lines */}
      <div className="flex-1 overflow-hidden py-3">
        <div className="h-full flex flex-col justify-center px-2 space-y-1">
          {visibleSubtitles.map((line, idx) => {
            const actualIndex = startIndex + idx;
            const isCurrent = actualIndex === currentIndex;
            
            return (
              <div
                key={line.id}
                onClick={() => onLineClick(line.startTime)}
                className={`subtitle-line ${getLineClass(actualIndex)} ${getLineOpacity(actualIndex)} ${
                  isCurrent ? "bg-secondary/40" : ""
                }`}
              >
                <div className="flex items-start gap-2">
                  <span className="text-xs font-mono text-muted-foreground shrink-0 pt-0.5">
                    {line.timestamp}
                  </span>
                  <p className="leading-relaxed">{line.text}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Dialogue Controls */}
      <div className="p-3 border-t border-border/30 space-y-2">
        <div className="grid grid-cols-2 gap-1.5">
          <button
            onClick={() => currentLine && onSaveDialogue(currentLine)}
            className="control-pill justify-center text-xs"
          >
            <Bookmark className="w-3.5 h-3.5" />
            <span>Save</span>
          </button>
          <button
            onClick={() => currentLine && onAddNote(currentLine)}
            className="control-pill justify-center text-xs"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Note</span>
          </button>
        </div>
        
        <div className="grid grid-cols-2 gap-1.5">
          <button
            onClick={onOpenRecordings}
            className="control-pill justify-center text-xs"
          >
            <Mic className="w-3.5 h-3.5" />
            <span>Record</span>
          </button>
          <button onClick={onReplayLine} className="control-pill justify-center text-xs">
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Replay</span>
          </button>
        </div>
      </div>
    </div>
  );
}
