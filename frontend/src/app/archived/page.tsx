import { redirect } from "next/navigation";
import { getArchivedNotes, getCategories } from "@/lib/api";
import { auth } from "@/lib/auth";
import { ArchivedNotes } from "./archived-notes";

export default async function ArchivedPage() {
  const session = await auth();

  if (!session?.accessToken) {
    redirect("/login");
  }

  const token = session.accessToken;
  const [notes, categories] = await Promise.all([
    getArchivedNotes(token),
    getCategories(token),
  ]);

  return (
    <ArchivedNotes
      initialNotes={notes}
      initialCategories={categories}
      accessToken={token}
    />
  );
}
