"use client";
import { productsTitle } from "@/data/projects/projects";
import Link from "next/link";
import { FolderIcon } from "@/utils/Images";
import authProtection from "@/components/HOC/authProtection";
import { auth, database } from "@/firebase/config";
import { Suspense, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { collection, doc, getDoc, updateDoc } from "@firebase/firestore";

function Projects() {
  const [folders, setFolders] = useState<any>(null);
  const fetchData = async () => {
    if (auth.currentUser) {
      const user = auth.currentUser.uid;
      const userCollection = collection(database, "users");
      const userDocRef = doc(userCollection, user);
      const projects = await getDoc(userDocRef)
        .then((doc) => {
          if (doc.exists()) {
            return doc.data().projects;
          } else {
            toast.error("Aucun projet trouvé!", {
              theme: "colored",
              position: "top-center",
            });
            return null;
          }
        })
        .catch((error) => {
          if (error.code === "permission-denied") {
            toast.error("Permission refusée!", {
              theme: "colored",
              position: "top-center",
            });
            return;
          } else {
            toast.error("Erreur lors de la récupération des projets!", {
              theme: "colored",
              position: "top-center",
            });
          }
        });
      if (projects) {
        setFolders(projects);
      } else {
        setFolders([]);
      }
    }
  };
  useEffect(() => {
    fetchData().then();
  }, []);
  const handleDeletion = (id: string) => {
    const deleteProject = async () => {
      if (auth.currentUser) {
        const toastId = toast.loading("Suppression du projet...", {
          position: "top-center",
        });
        const user = auth.currentUser.uid;
        const userCollection = collection(database, "users");
        const userDocRef = doc(userCollection, user);
        await updateDoc(userDocRef, {
          projects: [...folders.filter((folder: any) => folder.id !== id)],
        })
          .then(() => {
            fetchData().then(() => {
              toast.update(toastId, {
                render: "Projet supprimé!",
                type: "success",
                theme: "colored",
                isLoading: false,
                autoClose: 2000,
              });
            });
          })
          .catch((error) => {
            if (error.code === "permission-denied") {
              toast.update(toastId, {
                render: "Permission refusée!",
                type: "error",
                theme: "colored",
                isLoading: false,
                autoClose: 2000,
              });
              return;
            } else {
              toast.update(toastId, {
                render: "Erreur lors de la suppression du projet!",
                type: "error",
                theme: "colored",
                isLoading: false,
                autoClose: 2000,
              });
            }
          });
      }
    };
    deleteProject().then();
  };
  const newProjectHandler = () => {
    const updateProjects = async () => {
      if (auth.currentUser) {
        const toastId = toast.loading("Création d'un nouveau projet...", {
          position: "top-center",
        });
        const user = auth.currentUser.uid;
        const userCollection = collection(database, "users");
        const userDocRef = doc(userCollection, user);
        await updateDoc(userDocRef, {
          projects: [
            ...folders,
            {
              id: `${new Date().getTime()}-project`,
              name: `${new Date().getTime()}-project`,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              canvasURL: "",
              ironCurtainURL: "",
              bgURL: "",
              surfaceArea: 0,
              surfaceAreaPrice: 0,
            },
          ],
        })
          .then(() => {
            fetchData().then(() => {
              toast.update(toastId, {
                render: "Nouveau projet créé!",
                type: "success",
                theme: "colored",
                isLoading: false,
                autoClose: 2000,
              });
            });
          })
          .catch((error) => {
            toast.update(toastId, {
              render: `Erreur lors de la création d'un nouveau projet: ${error}`,
              type: "error",
              theme: "colored",
              isLoading: false,
              autoClose: 2000,
            });
          });
      }
    };
    updateProjects().then();
  };
  return (
    <>
      <h1 className=" w-full text-center text-4xl p-2 shadow-lg capitalize">
        {productsTitle}
      </h1>
      <section className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 h-full gap-6 self-center w-full justify-center p-6">
        <Suspense fallback={<Loader />}>
          {folders === null ? (
            <Loader />
          ) : (
            folders.map((key: any, index: number) => (
              <div key={index} className="aspect-square flex flex-col">
                <button
                  onClick={() => {
                    handleDeletion(key.id);
                  }}
                  className="bg-red-600 w-7 h-7 p-2 flex justify-center items-center rounded-badge transition-all hover:scale-105"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="#fff"
                    version="1.1"
                    id="Capa_1"
                    viewBox="0 0 460.775 460.775"
                  >
                    <path d="M285.08,230.397L456.218,59.27c6.076-6.077,6.076-15.911,0-21.986L423.511,4.565c-2.913-2.911-6.866-4.55-10.992-4.55  c-4.127,0-8.08,1.639-10.993,4.55l-171.138,171.14L59.25,4.565c-2.913-2.911-6.866-4.55-10.993-4.55  c-4.126,0-8.08,1.639-10.992,4.55L4.558,37.284c-6.077,6.075-6.077,15.909,0,21.986l171.138,171.128L4.575,401.505  c-6.074,6.077-6.074,15.911,0,21.986l32.709,32.719c2.911,2.911,6.865,4.55,10.992,4.55c4.127,0,8.08-1.639,10.994-4.55  l171.117-171.12l171.118,171.12c2.913,2.911,6.866,4.55,10.993,4.55c4.128,0,8.081-1.639,10.992-4.55l32.709-32.719  c6.074-6.075,6.074-15.909,0-21.986L285.08,230.397z" />
                  </svg>
                </button>
                <Link href={"/project/" + key.id} className="h-full">
                  <FolderIcon />
                </Link>
                <h1 className="text-center truncate">{key.name}</h1>
              </div>
            ))
          )}
        </Suspense>
        <button
          onClick={newProjectHandler}
          className="border-4 border-primary border-dashed aspect-square my-8 justify-center items-center flex-col flex"
        >
          <span className="font-quaternary text-7xl">+</span>
        </button>
      </section>
    </>
  );
}

const Loader = () => (
  <>
    <div className="animate-pulse flex flex-col items-center justify-center bg-gray-200 rounded-box aspect-square my-8">
      <div className="w-16 h-2 bg-gray-300 rounded-full mt-2"></div>
      <div className="w-20 h-20 bg-gray-300 rounded"></div>
    </div>
    <div className="animate-pulse flex flex-col items-center justify-center bg-gray-200 rounded-box aspect-square my-8">
      <div className="w-16 h-2 bg-gray-300 rounded-full mt-2"></div>
      <div className="w-20 h-20 bg-gray-300 rounded"></div>
    </div>
    <div className="animate-pulse flex flex-col items-center justify-center bg-gray-200 rounded-box aspect-square my-8">
      <div className="w-16 h-2 bg-gray-300 rounded-full mt-2"></div>
      <div className="w-20 h-20 bg-gray-300 rounded"></div>
    </div>
  </>
);

export default authProtection(Projects);
