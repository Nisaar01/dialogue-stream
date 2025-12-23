import { useState } from "react";
import {
  Library,
  Play,
  Bookmark,
  FileText,
  Mic,
  Settings,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
  activeItem: string;
  onItemClick: (item: string) => void;
}

const navItems = [
  { id: "library", label: "Library", icon: Library },
  { id: "continue", label: "Continue Watching", icon: Play },
  { id: "dialogues", label: "Saved Dialogues", icon: Bookmark },
  { id: "notes", label: "Notes", icon: FileText },
  { id: "recordings", label: "Recordings", icon: Mic },
  { id: "settings", label: "Settings", icon: Settings },
];

export function Sidebar({ isCollapsed, onToggle, activeItem, onItemClick }: SidebarProps) {
  return (
    <aside
      className={`relative flex flex-col h-full border-r border-border/50 transition-all duration-300 ease-out ${
        isCollapsed ? "w-16" : "w-56"
      }`}
      style={{ background: "var(--gradient-sidebar)" }}
    >
      {/* Logo */}
      <div className="flex items-center h-16 px-4 border-b border-border/30">
        {!isCollapsed && (
          <span className="font-display font-semibold text-lg text-foreground tracking-tight">
            Dialogue<span className="text-primary">.</span>
          </span>
        )}
        {isCollapsed && (
          <span className="font-display font-bold text-xl text-primary mx-auto">D</span>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-2 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeItem === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onItemClick(item.id)}
              className={`nav-item w-full ${isActive ? "nav-item-active" : ""} ${
                isCollapsed ? "justify-center px-2" : ""
              }`}
              title={isCollapsed ? item.label : undefined}
            >
              <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? "text-primary" : ""}`} />
              {!isCollapsed && <span className="text-sm font-medium">{item.label}</span>}
            </button>
          );
        })}
      </nav>

      {/* Toggle Button */}
      <button
        onClick={onToggle}
        className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-surface-elevated border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/50 transition-colors"
      >
        {isCollapsed ? (
          <ChevronRight className="w-3 h-3" />
        ) : (
          <ChevronLeft className="w-3 h-3" />
        )}
      </button>

      {/* Keyboard Shortcuts Hint */}
      {!isCollapsed && (
        <div className="p-4 border-t border-border/30">
          <p className="text-xs text-muted-foreground">
            Press <kbd className="px-1.5 py-0.5 bg-secondary rounded text-xs font-mono">?</kbd> for shortcuts
          </p>
        </div>
      )}
    </aside>
  );
}
