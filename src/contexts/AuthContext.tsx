import { createContext, useContext, useState, ReactNode } from "react";

export type UserRole = "usuario" | "supervisor" | "admin";

export interface User {
  id: string;
  nombre: string;
  apellido: string;
  cedula: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  login: (cedula: string, clave: string) => void;
  logout: () => void;
  register: (data: Omit<User, "id"> & { clave: string }) => void;
  resetPassword: (cedula: string, nuevaClave: string) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

// Mock users for demo
const mockUsers: (User & { clave: string })[] = [
  { id: "1", nombre: "Carlos", apellido: "García", cedula: "12345678", role: "usuario", clave: "1234" },
  { id: "2", nombre: "María", apellido: "López", cedula: "87654321", role: "supervisor", clave: "1234" },
  { id: "3", nombre: "Admin", apellido: "Sistema", cedula: "admin", role: "admin", clave: "admin" },
];

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = (cedula: string, clave: string) => {
    const found = mockUsers.find((u) => u.cedula === cedula && u.clave === clave);
    if (found) {
      const { clave: _, ...userData } = found;
      setUser(userData);
    } else {
      throw new Error("Credenciales inválidas");
    }
  };

  const logout = () => setUser(null);

  const register = (data: Omit<User, "id"> & { clave: string }) => {
    const newUser: User = { ...data, id: Date.now().toString() };
    setUser(newUser);
  };

  const resetPassword = (cedula: string, nuevaClave: string) => {
    const found = mockUsers.find((u) => u.cedula === cedula);
    if (found) {
      found.clave = nuevaClave;
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register, resetPassword }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
