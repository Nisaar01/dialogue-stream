import { X } from "lucide-react";

interface KeyboardShortcutsProps {
  isOpen: boolean;
  onClose: () => void;
}

const shortcuts = [
  { keys: ["Space"], action: "Play / Pause" },
  { keys: ["R"], action: "Replay last line" },
  { keys: ["S"], action: "Save current subtitle" },
  { keys: ["N"], action: "Add note to current line" },
  { keys: ["M"], action: "Start / Stop recording" },
  { keys: ["T"], action: "Toggle subtitle panel" },
  { keys: ["D"], action: "Toggle notes drawer" },
  { keys: ["←"], action: "Skip back 5 seconds" },
  { keys: ["→"], action: "Skip forward 5 seconds" },
  { keys: ["↑ / ↓"], action: "Volume up / down" },
  { keys: ["F"], action: "Fullscreen" },
  { keys: ["?"], action: "Show shortcuts" },
];

export function KeyboardShortcuts({ isOpen, onClose }: KeyboardShortcutsProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative glass-panel rounded-2xl p-6 w-full max-w-md shadow-card animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-xl font-semibold text-foreground">
            Keyboard Shortcuts
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Shortcuts List */}
        <div className="space-y-2">
          {shortcuts.map((shortcut, index) => (
            <div
              key={index}
              className="flex items-center justify-between py-2 border-b border-border/30 last:border-0"
            >
              <span className="text-sm text-muted-foreground">{shortcut.action}</span>
              <div className="flex items-center gap-1">
                {shortcut.keys.map((key, keyIndex) => (
                  <kbd
                    key={keyIndex}
                    className="px-2 py-1 text-xs font-mono bg-secondary rounded border border-border text-foreground"
                  >
                    {key}
                  </kbd>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <p className="mt-6 text-xs text-muted-foreground text-center">
          Press <kbd className="px-1.5 py-0.5 bg-secondary rounded text-xs font-mono">Esc</kbd> to close
        </p>
      </div>
    </div>
  );
}
