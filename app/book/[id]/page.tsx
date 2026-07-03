import { getBookById, books } from "@/data/books";
import { notFound } from "next/navigation";
import BookDetailClient from "./BookDetailClient";

export function generateStaticParams() {
  return books.map((b) => ({ id: b.id }));
}

export default async function BookPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const book = getBookById(id);
  if (!book) notFound();

  const similar = books.filter((b) => book.similar_books.includes(b.title));

  return <BookDetailClient book={book} similarBooks={similar} />;
}
