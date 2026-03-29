import { getArchivedNotes, getCategories } from "@/lib/api";
import { ArchivedClient } from "./archived-notes";

export default async function ArchivedPage() {
  const [notes, categories] = await Promise.all([
    getArchivedNotes(),
    getCategories(),
  ]);

  return <ArchivedClient initialNotes={notes} initialCategories={categories} />;
}
