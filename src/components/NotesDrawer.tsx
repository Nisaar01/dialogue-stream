import { useState } from "react";
import { ChevronUp, ChevronDown, Play, Edit3, Trash2, X } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface SavedDialogue {
  id: string;
  text: string;
  timestamp: string;
  episode: string;
  note?: string;
  hasRecording?: boolean;
}

interface NotesDrawerProps {
  isOpen: boolean;
  onToggle: () => void;
  savedDialogues: SavedDialogue[];
  onJumpTo: (id: string) => void;
  onEditNote: (id: string) => void;
  onDelete: (id: string) => void;
  onPlayRecording: (id: string) => void;
}

export function NotesDrawer({
  isOpen,
  onToggle,
  savedDialogues,
  onJumpTo,
  onEditNote,
  onDelete,
  onPlayRecording,
}: NotesDrawerProps) {
  const [editingId, setEditingId] = useState<string | null>(null);

  return (
    <div
      className={`absolute bottom-0 left-0 right-0 glass-panel rounded-t-xl transition-all duration-300 ease-out ${
        isOpen ? "h-72" : "h-12"
      }`}
    >
      {/* Toggle Bar */}
      <button
        onClick={onToggle}
        className="w-full h-12 flex items-center justify-between px-5 border-b border-border/50 hover:bg-secondary/30 transition-colors"
      >
        <div className="flex items-center gap-3">
          <h3 className="font-display font-medium text-foreground">Saved Dialogues</h3>
          <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
            {savedDialogues.length}
          </span>
        </div>
        {isOpen ? (
          <ChevronDown className="w-5 h-5 text-muted-foreground" />
        ) : (
          <ChevronUp className="w-5 h-5 text-muted-foreground" />
        )}
      </button>

      {/* Content */}
      {isOpen && (
        <ScrollArea className="h-60">
          <div className="p-4 space-y-3">
            {savedDialogues.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground text-sm">No saved dialogues yet</p>
                <p className="text-muted-foreground/60 text-xs mt-1">
                  Click "Save" on any subtitle line to capture it
                </p>
              </div>
            ) : (
              savedDialogues.map((dialogue, index) => (
                <div
                  key={dialogue.id}
                  className="group p-4 rounded-lg bg-secondary/30 border border-border/50 hover:border-primary/30 transition-all animate-fade-in"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <p className="text-foreground leading-relaxed">"{dialogue.text}"</p>
                      <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                        <span className="font-mono">{dialogue.timestamp}</span>
                        <span className="w-1 h-1 rounded-full bg-muted-foreground/50" />
                        <span>{dialogue.episode}</span>
                      </div>
                      {dialogue.note && (
                        <p className="mt-2 text-sm text-muted-foreground italic border-l-2 border-primary/30 pl-3">
                          {dialogue.note}
                        </p>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => onJumpTo(dialogue.id)}
                        className="p-2 rounded-lg hover:bg-secondary text-muted-foreground hover:text-primary transition-colors"
                        title="Jump to scene"
                      >
                        <Play className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onEditNote(dialogue.id)}
                        className="p-2 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
                        title="Edit note"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDelete(dialogue.id)}
                        className="p-2 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Recording Badge */}
                  {dialogue.hasRecording && (
                    <button
                      onClick={() => onPlayRecording(dialogue.id)}
                      className="mt-3 inline-flex items-center gap-2 text-xs text-primary hover:text-primary/80 transition-colors"
                    >
                      <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                      <span>Play recorded clip</span>
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      )}
    </div>
  );
}
