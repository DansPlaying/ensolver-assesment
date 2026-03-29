import { getNotes, getCategories } from "@/lib/api";
import { NotesClient } from "./notes";

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const params = await searchParams;
  const categoryId = params.category ? parseInt(params.category) : undefined;

  const [notes, categories] = await Promise.all([
    getNotes(categoryId),
    getCategories(),
  ]);

  return (
    <NotesClient
      initialNotes={notes}
      initialCategories={categories}
      selectedCategoryId={categoryId}
    />
  );
}
