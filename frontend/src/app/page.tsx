import { redirect } from "next/navigation";
import { getNotes, getCategories } from "@/lib/api";
import { auth } from "@/lib/auth";
import { Notes } from "./notes";

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const session = await auth();

  if (!session?.accessToken) {
    redirect("/login");
  }

  const token = session.accessToken;
  const params = await searchParams;
  const categoryId = params.category ? parseInt(params.category) : undefined;

  const [notes, categories] = await Promise.all([
    getNotes(categoryId, token),
    getCategories(token),
  ]);

  return (
    <Notes
      initialNotes={notes}
      initialCategories={categories}
      selectedCategoryId={categoryId}
      accessToken={token}
    />
  );
}
