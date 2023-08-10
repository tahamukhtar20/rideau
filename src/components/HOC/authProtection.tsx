"use client";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { auth } from "@/firebase/config";

interface ProtectedRouteProps {}
const AuthenticatedRoute = ({ children }: { children: React.ReactNode }) => {
  const [loggedIn, setLoggedIn] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setLoggedIn(user);
      } else {
        setLoggedIn(null);
        setTimeout(() => {
          router.push("/login");
        }, 1000);
      }
    });

    return () => unsubscribe();
  }, [router]);

  return loggedIn !== null ? (
    children
  ) : (
    <main className="min-h-[calc(100vh-15.5rem)] w-full grid place-items-center">
      <span className="loading loading-infinity loading-lg text-primary"></span>
    </main>
  );
};

const authProtection = <P extends ProtectedRouteProps>(
  WrappedComponent: React.ComponentType<P>
) => {
  const ComponentWithProtectedRoute: React.FC<P> = (props) => {
    const router = useRouter();

    return (
      <AuthenticatedRoute>
        <WrappedComponent {...props} />
      </AuthenticatedRoute>
    );
  };

  const displayName =
    WrappedComponent.displayName || WrappedComponent.name || "Component";
  ComponentWithProtectedRoute.displayName = `authProtection(${displayName})`;

  return ComponentWithProtectedRoute;
};

export default authProtection;
