import { redirect } from "next/navigation";
import { getNotes, getCategories } from "@/lib/queries";
import { auth } from "@/lib/auth";
import { Notes } from "./notes";

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const userId = parseInt(session.user.id);
  const params = await searchParams;
  const categoryId = params.category ? parseInt(params.category) : undefined;

  const [notes, categories] = await Promise.all([
    getNotes(userId, categoryId),
    getCategories(userId),
  ]);

  return (
    <Notes
      initialNotes={notes}
      initialCategories={categories}
      selectedCategoryId={categoryId}
    />
  );
}
