export type Category = {
  id: string;
  name: string;
  description: string;
  avatar: string;
  followerCount: number;
  postCount: number;
};

export type Post = {
  id: string;
  categoryId: string;
  category: Category;
  bookTitle: string;
  bookAuthor: string;
  bookYear: number;
  coverColor: string;
  content: string;
  likeCount: number;
  commentCount: number;
  tags: string[];
};
