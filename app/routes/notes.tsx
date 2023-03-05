import { ActionArgs, redirect } from '@remix-run/node';
import { Link, useLoaderData } from '@remix-run/react';

//* surfacing styles approach
import NewNote, { links as newNoteLinks } from '~/components/NewNote';
import NoteList, { links as noteListLinks } from '~/components/NoteList';
//* direct import styles approach
// import newNoteStyles from '~/components/NewNote.css';

import { getStoredNotes, storeNotes } from '~/data/notes';

type Note = {
  id: number;
  title: string;
  content: string;
};

export default function NotesPage() {
  const notes: Note[] = useLoaderData<typeof loader>();

  return (
    <main>
      <NewNote />
      <NoteList notes={notes} />
    </main>
  );
}

export async function loader() {
  const notes: Note[] = await getStoredNotes();
  return notes;
}

export async function action({ request }: ActionArgs) {
  const formData = await request.formData();
  const noteData = Object.fromEntries(formData);
  //* Optional noteData extraction
  // const noteData = {
  //   title: formData.get('title'),
  //   content: formData.get('content'),
  // };

  if (noteData.title !== null) {
    if (String(noteData.title).trim().length < 5) {
      return { message: 'Invalid title - must be at least 5 characters long.' };
    }
  }

  const existingNotes = await getStoredNotes();
  noteData.id = new Date().toISOString();
  const updatedNotes = existingNotes.concat(noteData);
  await storeNotes(updatedNotes);
  //* Test code for 'isSubmitting'
  // await new Promise<void>((resolve, reject) =>
  //   setTimeout(() => resolve(), 2000)
  // );
  return redirect('/notes');
}

//* surfacing styles approach
export function links() {
  return [...newNoteLinks(), ...noteListLinks()];
}

type ErrorProps = {
  error: {
    message: string;
  };
};

export function ErrorBoundary({ error }: ErrorProps) {
  return (
    <main className='error'>
      <h1>An error related to your notes occurred!</h1>
      <p>{error.message}</p>
      <p>
        Back to <Link to='/'>safety</Link>!
      </p>
    </main>
  );
}
