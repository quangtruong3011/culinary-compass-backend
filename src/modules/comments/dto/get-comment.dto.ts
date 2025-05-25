export class GetCommentDto {
  id: number;
  bookingId: number;
  content: string;
  likeCount: number;
}

export interface GetCommentDetailsDto {
  id: number;
  bookingId: number;
  restaurantId: number;
  userId: number;
  userName: string;
  content: string;
  updatedAt: Date;
  likeCount: number;
}

