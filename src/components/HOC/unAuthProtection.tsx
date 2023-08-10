"use client";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { auth } from "@/firebase/config";

interface ProtectedRouteProps {}

const InverseAuthenticatedRoute = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [loggedIn, setLoggedIn] = useState<any>(null);
  const router = useRouter();
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setLoggedIn(user);
        setTimeout(() => {
          router.push("/");
        }, 1000);
      } else {
        setLoggedIn(null);
      }
    });

    return () => unsubscribe();
  }, []);

  return loggedIn !== null ? (
    <main className="min-h-[calc(100vh-15.5rem)] w-full grid place-items-center">
      <span className="loading loading-dots loading-lg text-primary"></span>
    </main>
  ) : (
    children
  );
};

const unAuthProtection = <P extends ProtectedRouteProps>(
  WrappedComponent: React.ComponentType<P>
) => {
  const ComponentWithInverseProtectedRoute: React.FC<P> = (props) => {
    return (
      <InverseAuthenticatedRoute>
        <WrappedComponent {...props} />
      </InverseAuthenticatedRoute>
    );
  };

  const displayName =
    WrappedComponent.displayName || WrappedComponent.name || "Component";
  ComponentWithInverseProtectedRoute.displayName = `unAuthProtection(${displayName})`;

  return ComponentWithInverseProtectedRoute;
};

export default unAuthProtection;
