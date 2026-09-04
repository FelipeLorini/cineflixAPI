// Contexto de autenticação (persistência em localStorage).
import { createContext, useCallback, useContext, useMemo, type ReactNode } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { STORAGE_KEYS } from "@/utils/constants";
import { isValidEmail, isValidPassword, uid } from "@/utils/helpers";

export type User = { id: string; name: string; email: string };
type StoredUser = User & { password: string };

type AuthContextValue = {
  user: User | null;
  ready: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string, remember: boolean) => void;
  register: (name: string, email: string, password: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const users = useLocalStorage<StoredUser[]>(STORAGE_KEYS.users, []);
  const session = useLocalStorage<User | null>(STORAGE_KEYS.session, null);

  const register = useCallback(
    (name: string, email: string, password: string) => {
      const cleanEmail = email.trim().toLowerCase();
      if (!name.trim()) throw new Error("Informe seu nome.");
      if (!isValidEmail(cleanEmail)) throw new Error("E-mail inválido.");
      if (!isValidPassword(password))
        throw new Error("A senha deve ter no mínimo 6 caracteres.");
      if (users.value.some((u) => u.email === cleanEmail))
        throw new Error("Este e-mail já está cadastrado.");

      const newUser: StoredUser = {
        id: uid(),
        name: name.trim(),
        email: cleanEmail,
        password,
      };
      users.setValue([...users.value, newUser]);
      session.setValue({ id: newUser.id, name: newUser.name, email: newUser.email });
    },
    [users, session],
  );

  const login = useCallback(
    (email: string, password: string, remember: boolean) => {
      const cleanEmail = email.trim().toLowerCase();
      if (!isValidEmail(cleanEmail)) throw new Error("E-mail inválido.");
      if (!isValidPassword(password))
        throw new Error("A senha deve ter no mínimo 6 caracteres.");

      const found = users.value.find(
        (u) => u.email === cleanEmail && u.password === password,
      );
      if (!found) throw new Error("E-mail ou senha incorretos.");

      const logged = { id: found.id, name: found.name, email: found.email };
      session.setValue(logged);
      if (!remember) sessionStorage.setItem("cineflix:volatile", "1");
    },
    [users, session],
  );

  const logout = useCallback(() => session.setValue(null), [session]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user: session.value,
      ready: session.loaded && users.loaded,
      isAuthenticated: Boolean(session.value),
      login,
      register,
      logout,
    }),
    [session.value, session.loaded, users.loaded, login, register, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth deve ser usado dentro de AuthProvider");
  return ctx;
}
