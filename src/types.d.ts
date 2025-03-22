interface ProjectInfo {
  _id?: string;
  title: string;
  description?: string;
  thumbnail?: string;
  link: string;
  role: string;
  category: "personal" | "client" | "";
}
