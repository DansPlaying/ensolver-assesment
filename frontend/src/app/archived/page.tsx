import { getArchivedNotes, getCategories } from "@/lib/api";
import { ArchivedNotes } from "./archived-notes";

export default async function ArchivedPage() {
  const [notes, categories] = await Promise.all([
    getArchivedNotes(),
    getCategories(),
  ]);

  return <ArchivedNotes initialNotes={notes} initialCategories={categories} />;
}
