import { redirect } from "next/navigation";
import { getArchivedNotes, getCategories } from "@/lib/queries";
import { auth } from "@/lib/auth";
import { ArchivedNotes } from "./archived-notes";

export default async function ArchivedPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const userId = parseInt(session.user.id);
  const [notes, categories] = await Promise.all([
    getArchivedNotes(userId),
    getCategories(userId),
  ]);

  return (
    <ArchivedNotes
      initialNotes={notes}
      initialCategories={categories}
    />
  );
}
