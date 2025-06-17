export interface User {
  id: number;
  email: string;
  rol: string;
  nombre?: string;
  apellido?: string;
}

export interface AddEmployeeData {
  email: string;
  password: string;
  nombre: string;
  apellido: string;
  rol: string;
} 