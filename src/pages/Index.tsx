import { useState, useEffect, useCallback } from "react";
import { Sidebar } from "@/components/Sidebar";
import { VideoPlayer } from "@/components/VideoPlayer";
import { SubtitlePanel } from "@/components/SubtitlePanel";
import { KeyboardShortcuts } from "@/components/KeyboardShortcuts";
import { RecordingsPanel } from "@/components/RecordingsPanel";
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
  { id: "10", text: "What happened to you?", timestamp: "00:42:47", startTime: 2567 },
  { id: "11", text: "You used to be so different.", timestamp: "00:42:50", startTime: 2570 },
  { id: "12", text: "I did what I had to do.", timestamp: "00:42:54", startTime: 2574 },
  { id: "13", text: "For the family.", timestamp: "00:42:57", startTime: 2577 },
  { id: "14", text: "This isn't about family anymore.", timestamp: "00:43:01", startTime: 2581 },
  { id: "15", text: "This is about you.", timestamp: "00:43:04", startTime: 2584 },
  { id: "16", text: "Everything I did, I did for us.", timestamp: "00:43:08", startTime: 2588 },
  { id: "17", text: "You need to understand that.", timestamp: "00:43:12", startTime: 2592 },
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

// Sample recordings
const initialRecordings = [
  {
    id: "rec-1",
    timestamp: "00:38:42",
    duration: "0:04",
    dialogue: "Say my name.",
    episode: "S5 E7 · Say My Name",
  },
  {
    id: "rec-2",
    timestamp: "00:42:24",
    duration: "0:02",
    dialogue: "I am the danger.",
    episode: "S5 E14 · Ozymandias",
  },
];

const videoInfo = {
  title: "Breaking Bad",
  season: 5,
  episode: 14,
  episodeTitle: "Ozymandias",
};

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
  const [recordingsPanelOpen, setRecordingsPanelOpen] = useState(false);
  const [recordings, setRecordings] = useState(initialRecordings);

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
          toast.info("Replaying line...");
          break;
        case "s":
          handleSaveDialogue(sampleSubtitles[currentSubtitleIndex]);
          break;
        case "n":
          toast.info("Opening note editor...");
          break;
        case "m":
          if (isRecording) {
            handleStopRecording();
          } else {
            handleStartRecording();
          }
          break;
        case "d":
          setNotesDrawerOpen(!notesDrawerOpen);
          break;
        case "?":
          setShowShortcuts(true);
          break;
        case "escape":
          setShowShortcuts(false);
          setRecordingsPanelOpen(false);
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
    toast.success("Dialogue saved");
  }, []);

  const handleStartRecording = () => {
    setIsRecording(true);
    setRecordingsPanelOpen(true);
    toast.info("Recording started");
  };

  const handleStopRecording = () => {
    const currentLine = sampleSubtitles[currentSubtitleIndex];
    const newRecording = {
      id: `rec-${Date.now()}`,
      timestamp: currentLine.timestamp,
      duration: "0:03",
      dialogue: currentLine.text,
      episode: "S5 E14 · Ozymandias",
    };
    setRecordings((prev) => [newRecording, ...prev]);
    setIsRecording(false);
    toast.success("Recording saved");
  };

  const handleSeek = (time: number) => {
    setCurrentTime(time);
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
        {/* Main Area */}
        <div className="flex-1 flex min-h-0">
          {/* Player Section */}
          <div className="flex-1 p-4 min-w-0 relative">
            <div className="h-full flex flex-col">
              <VideoPlayer
                isPlaying={isPlaying}
                onPlayPause={() => setIsPlaying(!isPlaying)}
                currentTime={currentTime}
                duration={duration}
                onSeek={handleSeek}
                markers={timelineMarkers}
                isRecording={isRecording}
                videoInfo={videoInfo}
              />
            </div>
          </div>

          {/* Subtitle Panel */}
          <div className="w-72 p-4 pl-0">
            <SubtitlePanel
              subtitles={sampleSubtitles}
              currentIndex={currentSubtitleIndex}
              onLineClick={handleLineClick}
              onSaveDialogue={handleSaveDialogue}
              onAddNote={(line) => toast.info(`Adding note to: "${line.text}"`)}
              onOpenRecordings={() => setRecordingsPanelOpen(true)}
              onReplayLine={() => toast.info("Replaying line...")}
            />
          </div>
        </div>

      </div>

      {/* Recordings Panel */}
      <RecordingsPanel
        isOpen={recordingsPanelOpen}
        onClose={() => setRecordingsPanelOpen(false)}
        recordings={recordings}
        onPlay={(id) => toast.info(`Playing recording: ${id}`)}
        onDelete={(id) => {
          setRecordings((prev) => prev.filter((r) => r.id !== id));
          toast.success("Recording deleted");
        }}
        onStartNewRecording={handleStartRecording}
        isRecording={isRecording}
        onStopRecording={handleStopRecording}
      />

      {/* Keyboard Shortcuts Modal */}
      <KeyboardShortcuts
        isOpen={showShortcuts}
        onClose={() => setShowShortcuts(false)}
      />
    </div>
  );
}
