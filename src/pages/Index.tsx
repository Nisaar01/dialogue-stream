import { useState, useEffect, useCallback } from "react";
import { Sidebar } from "@/components/Sidebar";
import { VideoPlayer } from "@/components/VideoPlayer";
import { SubtitlePanel } from "@/components/SubtitlePanel";
import { NotesDrawer } from "@/components/NotesDrawer";
import { KeyboardShortcuts } from "@/components/KeyboardShortcuts";
import { toast } from "sonner";

// Sample subtitle data
const sampleSubtitles = [
  { id: "1", text: "You clearly don't know who you're talking to.", timestamp: "00:42:15", startTime: 2535 },
  { id: "2", text: "So let me clue you in.", timestamp: "00:42:18", startTime: 2538 },
  { id: "3", text: "I am not in danger, Skyler.", timestamp: "00:42:21", startTime: 2541 },
  { id: "4", text: "I am the danger.", timestamp: "00:42:24", startTime: 2544 },
  { id: "5", text: "A guy opens his door and gets shot, and you think that of me?", timestamp: "00:42:28", startTime: 2548 },
  { id: "6", text: "No.", timestamp: "00:42:33", startTime: 2553 },
  { id: "7", text: "I am the one who knocks.", timestamp: "00:42:35", startTime: 2555 },
  { id: "8", text: "Walt...", timestamp: "00:42:40", startTime: 2560 },
  { id: "9", text: "I... I don't know what to say.", timestamp: "00:42:43", startTime: 2563 },
];

// Sample saved dialogues
const initialSavedDialogues = [
  {
    id: "saved-1",
    text: "Say my name.",
    timestamp: "00:38:42",
    episode: "S5 E7 · Say My Name",
    note: "Iconic moment of Heisenberg's power",
    hasRecording: true,
  },
  {
    id: "saved-2",
    text: "I watched Jane die.",
    timestamp: "00:51:23",
    episode: "S5 E14 · Ozymandias",
    hasRecording: false,
  },
];

export default function Index() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeNavItem, setActiveNavItem] = useState("library");
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(2544);
  const [currentSubtitleIndex, setCurrentSubtitleIndex] = useState(3);
  const [isRecording, setIsRecording] = useState(false);
  const [notesDrawerOpen, setNotesDrawerOpen] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [savedDialogues, setSavedDialogues] = useState(initialSavedDialogues);

  const duration = 2820; // 47 minutes

  const timelineMarkers = [
    { position: 35, type: "note" as const },
    { position: 52, type: "recording" as const },
    { position: 78, type: "note" as const },
  ];

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      switch (e.key.toLowerCase()) {
        case " ":
          e.preventDefault();
          setIsPlaying(!isPlaying);
          break;
        case "r":
          toast.success("Replaying line...");
          break;
        case "s":
          handleSaveDialogue(sampleSubtitles[currentSubtitleIndex]);
          break;
        case "n":
          toast.info("Opening note editor...");
          break;
        case "m":
          setIsRecording(!isRecording);
          toast.success(isRecording ? "Recording stopped" : "Recording started");
          break;
        case "d":
          setNotesDrawerOpen(!notesDrawerOpen);
          break;
        case "?":
          setShowShortcuts(true);
          break;
        case "escape":
          setShowShortcuts(false);
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isPlaying, isRecording, notesDrawerOpen, currentSubtitleIndex]);

  const handleSaveDialogue = useCallback((line: typeof sampleSubtitles[0]) => {
    const newDialogue = {
      id: `saved-${Date.now()}`,
      text: line.text,
      timestamp: line.timestamp,
      episode: "S5 E14 · Ozymandias",
      hasRecording: false,
    };
    setSavedDialogues((prev) => [newDialogue, ...prev]);
    toast.success("Dialogue saved!");
  }, []);

  const handleSeek = (time: number) => {
    setCurrentTime(time);
    // Find the corresponding subtitle
    const index = sampleSubtitles.findIndex(
      (s, i) =>
        s.startTime <= time &&
        (i === sampleSubtitles.length - 1 || sampleSubtitles[i + 1].startTime > time)
    );
    if (index !== -1) {
      setCurrentSubtitleIndex(index);
    }
  };

  const handleLineClick = (startTime: number) => {
    handleSeek(startTime);
    toast.info(`Jumped to ${sampleSubtitles.find(s => s.startTime === startTime)?.timestamp}`);
  };

  return (
    <div className="flex h-screen w-full bg-background overflow-hidden">
      {/* Sidebar */}
      <Sidebar
        isCollapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        activeItem={activeNavItem}
        onItemClick={setActiveNavItem}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className="h-14 flex items-center justify-between px-6 border-b border-border/30">
          <div className="flex items-center gap-4">
            <h1 className="font-display text-lg font-semibold text-foreground">
              Breaking Bad
            </h1>
            <span className="text-sm text-muted-foreground">S5 E14 · "Ozymandias"</span>
          </div>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span>Press</span>
            <kbd className="px-1.5 py-0.5 bg-secondary rounded font-mono">?</kbd>
            <span>for shortcuts</span>
          </div>
        </header>

        {/* Main Area */}
        <div className="flex-1 flex min-h-0">
          {/* Player Section */}
          <div className="flex-1 p-6 min-w-0 relative">
            <div className="h-full flex flex-col">
              <VideoPlayer
                isPlaying={isPlaying}
                onPlayPause={() => setIsPlaying(!isPlaying)}
                currentTime={currentTime}
                duration={duration}
                onSeek={handleSeek}
                markers={timelineMarkers}
                isRecording={isRecording}
              />
            </div>

            {/* Notes Drawer */}
            <NotesDrawer
              isOpen={notesDrawerOpen}
              onToggle={() => setNotesDrawerOpen(!notesDrawerOpen)}
              savedDialogues={savedDialogues}
              onJumpTo={(id) => toast.info(`Jumping to dialogue: ${id}`)}
              onEditNote={(id) => toast.info(`Editing note: ${id}`)}
              onDelete={(id) => {
                setSavedDialogues((prev) => prev.filter((d) => d.id !== id));
                toast.success("Dialogue deleted");
              }}
              onPlayRecording={(id) => toast.info(`Playing recording: ${id}`)}
            />
          </div>

          {/* Subtitle Panel */}
          <div className="w-80 p-6 pl-0">
            <SubtitlePanel
              subtitles={sampleSubtitles}
              currentIndex={currentSubtitleIndex}
              onLineClick={handleLineClick}
              onSaveDialogue={handleSaveDialogue}
              onAddNote={(line) => toast.info(`Adding note to: "${line.text}"`)}
              onStartRecording={() => {
                setIsRecording(true);
                toast.success("Recording started");
              }}
              onStopRecording={() => {
                setIsRecording(false);
                toast.success("Recording saved!");
              }}
              onReplayLine={() => toast.info("Replaying line...")}
              isRecording={isRecording}
            />
          </div>
        </div>
      </div>

      {/* Keyboard Shortcuts Modal */}
      <KeyboardShortcuts
        isOpen={showShortcuts}
        onClose={() => setShowShortcuts(false)}
      />
    </div>
  );
}
