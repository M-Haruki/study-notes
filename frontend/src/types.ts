export interface Note {
  id: string;
  title: string;
  content: string;
  updated_at: Date;
  created_at: Date;
}

export interface NoteSmall {
  id: string;
  title: string;
  updated_at: Date;
}
