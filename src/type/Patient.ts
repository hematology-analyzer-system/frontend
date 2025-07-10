export interface Patient {
  id: number;
  fullName: string;
  address: string;
  gender: "MALE" | "FEMALE" | "OTHER";
  dateOfBirth: string; // "YYYY-MM-DD"
  phone: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}