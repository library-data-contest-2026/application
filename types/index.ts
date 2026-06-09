export type QuizQuestion = {
  id: string;
  quiz_id: string;
  question: string;
  options: string[];
  correct_index: number;
  explanation: string | null;
  order_index: number;
};

export type Quiz = {
  id: string;
  title: string;
  category_id: string | null;
  difficulty: "easy" | "medium" | "hard";
  categories: Category | null;
  quiz_questions: QuizQuestion[];
};

export type Category = {
  id: string;
  name: string;
  description: string;
  avatar: string;
  follower_count?: number;
  post_count?: number;
  // camelCase aliases (mock data 호환)
  followerCount?: number;
  postCount?: number;
};

export type Post = {
  id: string;
  category_id: string;
  categories: Category;
  book_title: string;
  book_author: string;
  book_year: number;
  cover_color: string;
  content: string;
  like_count: number;
  comment_count: number;
  tags: string[];
};
