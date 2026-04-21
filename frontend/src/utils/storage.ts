import type { Note } from "../types";

const storageId = "notes";
const init: Note[] = [
  {
    id: generateID(6),
    title: "ようこそ",
    date: getDate(),
    content:
      "これはシンプルなメモアプリです。\n自動保存ではないので、内容を書き換えたら忘れずに保存をしましょう。",
  },
];

export function load() {
  if (!localstorageAvailable) alert("localstorage is anavilable");
  const notesJson = localStorage.getItem(storageId);
  if (notesJson) {
    return JSON.parse(notesJson) as Note[];
  } else {
    save(init);
    return init;
  }
}

function save(notes: Note[]) {
  localStorage.setItem(storageId, JSON.stringify(notes));
}

export function loadNote(id: string) {
  const notes = load();
  return notes.filter((note) => note.id == id)[0];
}

export function updateNote(newNote: Note): Note {
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
