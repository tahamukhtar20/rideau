"use client";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { auth } from "@/firebase/config";
import { usePathname } from "next/navigation";
import { database } from "@/firebase/config";
import { collection, doc, getDoc } from "@firebase/firestore";

interface IProjectExistence {}
const ProjectExistenceRoute = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const slug = usePathname().split("/")[2];
  const [projectExists, setProjectExists] = useState<boolean | null>(null);

  useEffect(() => {
    const fetchData = async (slug: string) => {
      if (auth.currentUser && slug) {
        let projectExist = false;
        const user = auth.currentUser.uid;
        const userCollection = collection(database, "users");
        const userDocRef = doc(userCollection, user);
        await getDoc(userDocRef)
          .then((doc: any) => {
            if (doc.exists()) {
              doc.data().projects.forEach((project: any) => {
                if (project.id === slug) {
                  projectExist = true;
                }
              });
            } else {
              projectExist = false;
            }
          })
          .catch((error: any) => {
            projectExist = false;
          });
        setProjectExists(projectExist);
        if (!projectExist) router.push("/projects");
      } else {
        setProjectExists(false);
        router.push("/projects");
      }
    };
    fetchData(slug).then();
  }, [router, slug]);

  return projectExists !== null ? (
    projectExists ? (
      children
    ) : (
      <main className="min-h-[calc(100vh-15.5rem)] w-full grid place-items-center">
        <span className="loading loading-infinity loading-lg text-primary"></span>
      </main>
    )
  ) : (
    <main className="min-h-[calc(100vh-15.5rem)] w-full grid place-items-center">
      <span className="loading loading-infinity loading-lg text-primary"></span>
    </main>
  );
};

const projectExistenceCheck = <P extends IProjectExistence>(
  WrappedComponent: React.ComponentType<P>
) => {
  const ComponentWithProjectExistenceRoute: React.FC<P> = (props) => {
    return (
      <ProjectExistenceRoute>
        <WrappedComponent {...props} />
      </ProjectExistenceRoute>
    );
  };

  const displayName =
    WrappedComponent.displayName || WrappedComponent.name || "Component";
  ComponentWithProjectExistenceRoute.displayName = `projectExistenceCheck(${displayName})`;

  return ComponentWithProjectExistenceRoute;
};

export default projectExistenceCheck;
