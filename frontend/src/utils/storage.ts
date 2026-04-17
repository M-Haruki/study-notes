import type { Note } from "../types";

export function load() {
  if (!localstorageAvailable) alert("localstorage is anavilable");
  const notesJson = localStorage.getItem("notes");
  if (!notesJson) return [];
  return JSON.parse(notesJson) as Note[];
}

// sample data
// [
//   {
//     "id": "qwertyuio",
//     "title": "sample memo",
//     "data": "2026-4-17-22:25",
//     "content": "hogehoge"
//   },
//   {
//     "id": "oiuytr",
//     "title": "example memo",
//     "data": "2026-4-17-22:26",
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
