export interface Note {
  id: string;
  title: string;
  date: string;
  content: string;
}

export interface NoteSmall {
  id: string;
  title: string;
  updated_at: Date;
}
