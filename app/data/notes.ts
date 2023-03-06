import fs from 'fs/promises';

type Note = {
  id: string;
  title: string;
  content: string;
};

type Data = {
  notes: Note[];
};

export async function getStoredNotes() {
  const rawFileContent = await fs.readFile('notes.json', { encoding: 'utf-8' });
  const data: Data = JSON.parse(rawFileContent);
  const storedNotes = data.notes ?? [];
  return storedNotes;
}

export function storeNotes(notes: Note[]) {
  return fs.writeFile('notes.json', JSON.stringify({ notes: notes || [] }));
}
