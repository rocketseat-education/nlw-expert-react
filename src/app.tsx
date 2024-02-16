import { ChangeEvent, useEffect, useState } from "react";
import logo from "./assets/logo-nlw-expert.svg";
import { NewNoteCard } from "./components/new-note-card";
import { NoteCard } from "./components/note-card";
import { tursoClient } from "./lib";

interface Note {
  id: string;
  date_created: Date;
  content: string;
}

export function App() {
  const [search, setSearch] = useState("");
  const [notes, setNotes] = useState<Note[]>([]);

  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      try {
        const result = await tursoClient.execute("SELECT * FROM frameworks");
        const notes: Note[] = result.rows.map((row): Note => {
          const { id, date_created, note } = row;
          return {
            id: id?.toString() || "",
            date_created: new Date(Number(date_created)),
            content: note?.toString() || "",
          };
        });

        setNotes(notes);
      } catch (error: any) {
        console.log("Error fetching data:", error.message);
      }
    };

    fetchData();
  }, []);


  async function onNoteCreated(content: string) {
    const newNote = {
      id: crypto.randomUUID(),
      date_created: new Date(),
      content,
    };

    const notesArray = [newNote, ...notes];
    try {
      await tursoClient.execute({
        sql:"INSERT INTO frameworks (date_created, note) VALUES (?, ?)",
        args: [newNote.date_created, newNote.content]
      });
    } catch (error: any) {
      console.log('Somenthing goes wrong!',error.message);
    }

    setNotes(notesArray);

  }

  async function onNoteDeleted(id: string) {
    try {
      await tursoClient.execute({
        sql:"DELETE FROM frameworks WHERE id = ?",
        args: [id]
      });
    } catch (error) {
      console.log(error);
    }
    const notesArray = notes.filter((note) => {
      return note.id !== id;
    });

    setNotes(notesArray);
  }

  function handleSearch(event: ChangeEvent<HTMLInputElement>) {
    const query = event.target.value;

    setSearch(query);
  }

  const filteredNotes =
    search !== ""
      ? notes.filter((note) =>
          note.content.toLocaleLowerCase().includes(search.toLocaleLowerCase())
        )
      : notes;


  return (
    <div className="mx-auto max-w-6xl my-12 space-y-6 px-5">
      <img src={logo} alt="NLW Expert" />

      <form className="w-full">
        <input
          type="text"
          placeholder="Busque em suas notas..."
          className="w-full bg-transparent text-3xl font-semibold tracking-tight outline-none placeholder:text-state-500"
          onChange={handleSearch}
        />
      </form>

      <div className="h-px bg-slate-700" />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[250px]">
        <NewNoteCard onNoteCreated={onNoteCreated} />

        {notes.length !== 0 ? filteredNotes.map((note) => {
          return (
            <NoteCard onNoteDeleted={onNoteDeleted} key={note.id} note={note} />
          );
        }) : <span>Nenhuma nota encontrada</span>}
      </div>
    </div>
  );
}
