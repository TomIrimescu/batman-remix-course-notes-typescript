import { ActionArgs, json, redirect, MetaFunction } from '@remix-run/node';
import { Link, useCatch, useLoaderData } from '@remix-run/react';

//* surfacing styles approach
import NewNote, { links as newNoteLinks } from '~/components/NewNote';
import NoteList, { links as noteListLinks } from '~/components/NoteList';
//* direct import styles approach
// import newNoteStyles from '~/components/NewNote.css';

import { getStoredNotes, storeNotes } from '~/data/notes';

type Note = {
  id: string;
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
  if (!notes || notes.length === 0) {
    throw json(
      { message: 'Could not find any notes.' },
      {
        status: 404,
        statusText: 'Not Found',
      }
    );
  }
  return notes;
}

export async function action({ request }: ActionArgs) {
  const formData = await request.formData();
  const noteData = Object.fromEntries(formData) as Note;
  //* Optional noteData data extraction
  // const noteData = {
  //   title: formData.get('title'),
  //   content: formData.get('content'),
  // };

  if (noteData.title !== null) {
    if (noteData.title.trim().length < 5) {
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

export const meta: MetaFunction = () => {
  return {
    title: 'My Notes',
    description: 'These are all my notes.',
  };
};

//* Route specific error response CatchBoundary
export function CatchBoundary() {
  const caughtResponse = useCatch();

  const message: string = caughtResponse.data?.message || 'Data not found.';

  return (
    <main>
      <NewNote />
      <p className='info-message'>{message}</p>
    </main>
  );
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
