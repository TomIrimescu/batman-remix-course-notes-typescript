import { json, LoaderArgs, MetaFunction } from '@remix-run/node';
import { Link, useLoaderData } from '@remix-run/react';

import { getStoredNotes } from '~/data/notes';

import noteDetailsStyles from '~/styles/note-details.css';

type Note = {
  id: string;
  title: string;
  content: string;
};

export default function NoteDetailsPage() {
  const note: Note = useLoaderData<typeof loader>();

  return (
    <main id='note-details'>
      <header>
        <nav>
          <Link to='/notes'>Back to all Notes</Link>
        </nav>
        <h1>{note.title}</h1>
      </header>
      <p id='note-details-content'>{note.content}</p>
    </main>
  );
}

export async function loader({ params }: LoaderArgs) {
  const notes: Note[] = await getStoredNotes();
  const noteId = params.noteId;
  const selectedNote = notes.find((note) => note.id === noteId);

  if (!selectedNote) {
    throw json(
      { message: 'Could not find note for id ' + noteId },
      { status: 404 }
    );
  }

  return selectedNote;
}

export function links() {
  return [{ rel: 'stylesheet', href: noteDetailsStyles }];
}

type MetaFunctionProps = {
  data: {
    title: string;
    description: string;
  };
};

export const meta: MetaFunction = ({ data }: MetaFunctionProps) => {
  return {
    title: data.title,
    description: 'Manage your notes with ease.',
  };
};
