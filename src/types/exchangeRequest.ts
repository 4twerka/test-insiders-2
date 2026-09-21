export type ExchangeRequestStatus = "pending" | "accepted" | "declined";

export type ExchangeRequest = {
  id: string;
  bookId: string;
  bookName: string;
  bookOwnerId: string;
  requesterId: string;
  requesterName: string;
  requesterEmail: string;
  status: ExchangeRequestStatus;
  createdAt: number;
};
