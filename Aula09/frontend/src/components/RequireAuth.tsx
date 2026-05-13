"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/src/context/AuthContext";
import type { Permission } from "@/src/types/auth";

type Props = {
  children: React.ReactNode;
  requiredPermission?: Permission;
};

const PUBLIC_ROUTES = new Set(["/login", "/cadastro"]);

export function RequireAuth({ children, requiredPermission }: Props) {
  const { user, loading, hasPermission } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (loading) return;

    if (!user && !PUBLIC_ROUTES.has(pathname)) {
      router.replace("/login");
      return;
    }

    if (user && PUBLIC_ROUTES.has(pathname)) {
      router.replace("/");
      return;
    }

    if (user && requiredPermission && !hasPermission(requiredPermission)) {
      router.replace("/");
    }
  }, [loading, user, pathname, requiredPermission, hasPermission, router]);

  if (loading) {
    return <p className="p-6 text-sm text-slate-500">Carregando...</p>;
  }

  if (!user && !PUBLIC_ROUTES.has(pathname)) {
    return null;
  }

  if (requiredPermission && !hasPermission(requiredPermission)) {
    return null;
  }

  return <>{children}</>;
}
