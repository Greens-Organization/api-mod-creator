interface User {
  id: string;
  name: string;
  email: string;
  state: "active" | "inactive";
  level: "admin" | "manager" | "user";
  password: string;
  create_at: Date;
  update_at: Date;
  refreshToken: string;
}
