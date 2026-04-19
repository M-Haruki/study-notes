import type { Note } from "../types";

const storageId = "notes";

export function load() {
  if (!localstorageAvailable) alert("localstorage is anavilable");
  const notesJson = localStorage.getItem(storageId);
  if (!notesJson) return [];
  return JSON.parse(notesJson) as Note[];
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
  localStorage.setItem(storageId, JSON.stringify(notes));
  return updatedNote;
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
