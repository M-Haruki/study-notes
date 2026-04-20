import type { Note } from "../types";

const storageId = "notes";

export function load() {
  if (!localstorageAvailable) alert("localstorage is anavilable");
  const notesJson = localStorage.getItem(storageId);
  if (!notesJson) return [];
  return JSON.parse(notesJson) as Note[];
}

function save(notes: Note[]) {
  localStorage.setItem(storageId, JSON.stringify(notes));
}

export function loadNote(id: string) {
  const notes = load();
  return notes.filter((note) => note.id == id)[0];
}

export function updateNote(newNote: Note): Note {
  console.log("saves");
  const notes = load();
  const index = notes.findIndex((note) => note.id === newNote.id);
  if (index === -1) return newNote;
  const updatedNote = { ...newNote, date: getDate() };
  notes[index] = updatedNote;
  save(notes);
  return updatedNote;
}

export function createNote() {
  const note: Note = {
    id: generateID(6),
    title: "",
    date: getDate(),
    content: "",
  };
  let notes = load();
  notes = [...notes, note];
  save(notes);
  return note;
}

export function deleteNote(id: string) {
  const notes = load();
  const index = notes.findIndex((note) => note.id === id);
  if (index == -1) return;
  notes.splice(index, 1);
  save(notes);
}

// sample date
// [
//   {
//     "id": "qwertyuio",
//     "title": "sample memo",
//     "date": "2026-4-17-22:25",
//     "content": "hogehoge"
//   },
//   {
//     "id": "oiuytr",
//     "title": "example memo",
//     "date": "2026-4-17-22:26",
//     "content": "piyopiyo"
//   }
// ]

function localstorageAvailable() {
  let storage;
  try {
    storage = window["localStorage"];
    const x = "__storage_test__";
    storage.setItem(x, x);
    storage.removeItem(x);
    return true;
  } catch {
    return false;
  }
}

function getDate() {
  const date = new Date();
  return `${date.getFullYear()}/${("0" + (date.getMonth() + 1)).slice(-2)}/${("0" + date.getDate()).slice(-2)}/${("0" + date.getHours()).slice(-2)}:${("0" + date.getMinutes()).slice(-2)}:${("0" + date.getSeconds()).slice(-2)}`;
}

function generateID(length: number) {
  let text = "";
  const possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }

  return text;
}
