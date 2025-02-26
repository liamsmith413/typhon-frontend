import { createContext, useContext, useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

interface User {
  name: string;
  email: string;
  sub: string;
  avatar: string;
  role: string;
  status: number;
  permission: boolean;
  system: string;
  userMsg: string;
  aiAnswer: string;
  joinedAt: string;
}

interface AuthContextProps {
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
        if (pathname === '/') {
          router.replace('/home');
        }
      } catch (error) {
        console.error("Invalid user data in localStorage:", error);
        localStorage.removeItem("user");  
        router.replace("/");  
      }
    } else {
      if (pathname !== '/') {
        router.replace("/");
      }
    }
    setLoading(false);
  }, [router, pathname]);

  const login = (userData: User) => {
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
    router.push("/home");  
  };

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
    router.replace("/");  
  };

  if (loading) {
    return null;  
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};


export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
