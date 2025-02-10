"use client";

import List from "@/components/List";
import { Save } from "lucide-react";
import { useRef } from "react";

interface NotesProps {
  notes?: string;
  onNotesUpdate(notes: string): Promise<void>;
}

export default function Notes({ notes, onNotesUpdate }: NotesProps) {
  const inputRef = useRef<HTMLTextAreaElement>(null);

  return (
    <List title="Notes">
      <textarea
        ref={inputRef}
        className="input resize-y min-h-16 max-h-32"
        placeholder="Write a note"
        defaultValue={notes}
      />
      <button
        className="button-tertiary"
        onClick={() =>
          inputRef.current && onNotesUpdate(inputRef.current.value)
        }
      >
        <Save size={16} />
        Save note
      </button>
    </List>
  );
}
