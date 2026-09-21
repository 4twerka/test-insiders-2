import "server-only";
import { resend } from "@/lib/email/resend";
import type { ExchangeRequestStatus } from "@/types/exchangeRequest";

type ExchangeResponseEmailInput = {
  requesterEmail: string;
  requesterName: string;
  bookName: string;
  ownerName: string;
  ownerEmail: string;
  status: Extract<ExchangeRequestStatus, "accepted" | "declined">;
};

export async function sendExchangeResponseEmail(input: ExchangeResponseEmailInput) {
  const isAccepted = input.status === "accepted";

  await resend.emails.send({
    from: process.env.EMAIL_FROM ?? "onboarding@resend.dev",
    to: input.requesterEmail,
    subject: isAccepted
      ? `${input.ownerName} погодився на обмін книгою «${input.bookName}»`
      : `Запит на обмін книгою «${input.bookName}» відхилено`,
    text: isAccepted
      ? `Вітаємо, ${input.requesterName}!

${input.ownerName} погодився обмінятися книгою «${input.bookName}» — тепер вона у списку ваших книг.

Зв'яжіться з ${input.ownerName} за адресою ${input.ownerEmail}, щоб домовитися про передачу книги.`
      : `Вітаємо, ${input.requesterName}.

На жаль, ${input.ownerName} відхилив ваш запит на обмін книгою «${input.bookName}».`,
  });
}
