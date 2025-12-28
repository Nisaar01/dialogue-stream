-- Videos table
CREATE TABLE public.videos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  series_name TEXT,
  season INTEGER,
  episode INTEGER,
  video_url TEXT NOT NULL,
  thumbnail_url TEXT,
  duration INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Subtitles table
CREATE TABLE public.subtitles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  video_id UUID REFERENCES public.videos(id) ON DELETE CASCADE NOT NULL,
  start_time DECIMAL NOT NULL,
  end_time DECIMAL NOT NULL,
  text TEXT NOT NULL,
  speaker TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Saved dialogues table (for saved subtitle lines)
CREATE TABLE public.saved_dialogues (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  video_id UUID REFERENCES public.videos(id) ON DELETE CASCADE NOT NULL,
  subtitle_id UUID REFERENCES public.subtitles(id) ON DELETE CASCADE,
  timestamp DECIMAL NOT NULL,
  text TEXT NOT NULL,
  episode_info TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Notes table
CREATE TABLE public.notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  saved_dialogue_id UUID REFERENCES public.saved_dialogues(id) ON DELETE CASCADE,
  video_id UUID REFERENCES public.videos(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  timestamp DECIMAL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Recordings table
CREATE TABLE public.recordings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  video_id UUID REFERENCES public.videos(id) ON DELETE CASCADE NOT NULL,
  start_time DECIMAL NOT NULL,
  end_time DECIMAL NOT NULL,
  duration DECIMAL NOT NULL,
  dialogue_text TEXT,
  audio_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Watch progress table
CREATE TABLE public.watch_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  video_id UUID REFERENCES public.videos(id) ON DELETE CASCADE NOT NULL,
  playback_position DECIMAL DEFAULT 0,
  last_watched_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(video_id)
);

-- Enable RLS on all tables
ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subtitles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_dialogues ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recordings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.watch_progress ENABLE ROW LEVEL SECURITY;

-- Public read access policies (since no auth required per design)
CREATE POLICY "Allow public read on videos" ON public.videos FOR SELECT USING (true);
CREATE POLICY "Allow public insert on videos" ON public.videos FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on videos" ON public.videos FOR UPDATE USING (true);

CREATE POLICY "Allow public read on subtitles" ON public.subtitles FOR SELECT USING (true);
CREATE POLICY "Allow public insert on subtitles" ON public.subtitles FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public read on saved_dialogues" ON public.saved_dialogues FOR SELECT USING (true);
CREATE POLICY "Allow public insert on saved_dialogues" ON public.saved_dialogues FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public delete on saved_dialogues" ON public.saved_dialogues FOR DELETE USING (true);

CREATE POLICY "Allow public read on notes" ON public.notes FOR SELECT USING (true);
CREATE POLICY "Allow public insert on notes" ON public.notes FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on notes" ON public.notes FOR UPDATE USING (true);
CREATE POLICY "Allow public delete on notes" ON public.notes FOR DELETE USING (true);

CREATE POLICY "Allow public read on recordings" ON public.recordings FOR SELECT USING (true);
CREATE POLICY "Allow public insert on recordings" ON public.recordings FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public delete on recordings" ON public.recordings FOR DELETE USING (true);

CREATE POLICY "Allow public read on watch_progress" ON public.watch_progress FOR SELECT USING (true);
CREATE POLICY "Allow public insert on watch_progress" ON public.watch_progress FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on watch_progress" ON public.watch_progress FOR UPDATE USING (true);

-- Create storage bucket for recordings
INSERT INTO storage.buckets (id, name, public) VALUES ('recordings', 'recordings', true);

-- Storage policies for recordings bucket
CREATE POLICY "Allow public read on recordings bucket" ON storage.objects FOR SELECT USING (bucket_id = 'recordings');
CREATE POLICY "Allow public insert on recordings bucket" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'recordings');
CREATE POLICY "Allow public delete on recordings bucket" ON storage.objects FOR DELETE USING (bucket_id = 'recordings');

-- Create indexes for performance
CREATE INDEX idx_subtitles_video_id ON public.subtitles(video_id);
CREATE INDEX idx_subtitles_time ON public.subtitles(start_time, end_time);
CREATE INDEX idx_saved_dialogues_video_id ON public.saved_dialogues(video_id);
CREATE INDEX idx_notes_video_id ON public.notes(video_id);
CREATE INDEX idx_recordings_video_id ON public.recordings(video_id);

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at triggers
CREATE TRIGGER update_videos_updated_at BEFORE UPDATE ON public.videos FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_notes_updated_at BEFORE UPDATE ON public.notes FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();