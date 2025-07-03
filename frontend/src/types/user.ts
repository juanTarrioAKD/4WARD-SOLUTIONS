export interface User {
  id: number;
  email: string;
  rol: string;
  first_name?: string;
  last_name?: string;
}

export interface AddEmployeeData {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  rol: string;
} 