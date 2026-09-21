import "server-only";
import { resend } from "@/lib/email/resend";
import type { Book } from "@/types/book";

type ExchangeRequestEmailInput = {
  ownerEmail: string;
  ownerName: string;
  requesterName: string;
  requesterEmail: string;
  requestedBook: Book;
  offeredBooks: Book[];
};

export async function sendExchangeRequestEmail(input: ExchangeRequestEmailInput) {
  const booksList = input.offeredBooks
    .map((book) => `- ${book.name} (${book.author})`)
    .join("\n");

  await resend.emails.send({
    from: process.env.EMAIL_FROM ?? "onboarding@resend.dev",
    to: input.ownerEmail,
    subject: `Запит на обмін книгою «${input.requestedBook.name}»`,
    text: `Вітаємо, ${input.ownerName}!

${input.requesterName} (${input.requesterEmail}) хоче запропонувати обмін на вашу книгу «${input.requestedBook.name}».

Книги, які пропонує ${input.requesterName}:
${booksList || "— (немає доданих книг)"}

Зв'яжіться з ${input.requesterName} за адресою ${input.requesterEmail}, щоб домовитися про обмін.`,
  });
}
