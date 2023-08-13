"use client";
import ImageExplore from "@/components/project[slug]/ImageExplore";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import DropableRegion from "@/components/project[slug]/DropableRegion";
import ButtonsRegion from "@/components/project[slug]/ButtonsRegion";
import imageCompression from "browser-image-compression";
import SurfaceAreaToPrixConvertor from "@/components/project[slug]/SurfaceAreaToPrixConvertor";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "@firebase/storage";
import { auth, database } from "@/firebase/config";
import html2canvas from "html2canvas";
import { collection, doc, getDoc, updateDoc } from "@firebase/firestore";
import projectExistenceCheck from "@/components/HOC/projectExistenceCheck";
import authProtection from "@/components/HOC/authProtection";

function Project({ params: { id } }: { params: { id: string } }) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [surfaceArea, setSurfaceArea] = useState<string>("");
  const [price, setPrice] = useState<number | null>(null);
  const [uploadedImageData, setUploadedImageData] = useState<
    File | Blob | null
  >(null);
  const [disableButtons, setDisableButtons] = useState<boolean>(false);
  const modalRef = useRef<HTMLDialogElement | null>(null);
  const wholeImageRef = useRef<HTMLDivElement | null>(null);
  const handleUploadImage = (event: any) => {
    let file: File | undefined = event.target.files?.[0];
    if (file) {
      setUploadedImage("Loading...");
      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
      };
      imageCompression(file, options)
        .then((compressedFile) => {
          const reader = new FileReader();
          reader.readAsDataURL(compressedFile);
          reader.onloadend = () => {
            setUploadedImage(reader.result as string);
            setUploadedImageData(compressedFile);
          };
        })
        .catch((error) => {
          console.log(error.message);
          setUploadedImage(null);
          toast.error("Erreur lors du téléchargement de l'image", {
            position: "top-center",
            theme: "colored",
          });
        });
    }
  };
  const handleReset = () => {
    setUploadedImage(null);
    setSelectedImage(null);
    setSurfaceArea("");
    setPrice(null);
    setUploadedImageData(null);
  };
  const handleSave = async () => {
    if (uploadedImageData === null) {
      toast.warning("Veuillez d'abord télécharger l'image", {
        position: "top-center",
        theme: "colored",
      });
      return;
    }
    if (selectedImage === null) {
      toast.warning("Veuillez d'abord choisir l'image", {
        position: "top-center",
        theme: "colored",
      });
      return;
    }
    if (surfaceArea === "") {
      toast.warning("Veuillez entrer la superficie et calculer le prix", {
        position: "top-center",
        theme: "colored",
      });
      return;
    }
    if (price === null) {
      toast.warning("Veuillez d'abord calculer le prix", {
        position: "top-center",
        theme: "colored",
      });
      return;
    }
    const toastId = toast.loading("S'il vous plaît, attendez...", {
      position: "top-center",
      theme: "colored",
    });
    setDisableButtons(true);
    try {
      const storage = getStorage();
      const userId = auth.currentUser?.uid;
      const idPath = `User Scrap Data/${userId}/${id}/`;
      const storageRef = ref(storage, idPath + "backgroundImage");
      await uploadBytesResumable(storageRef, uploadedImageData);
      const canvas = wholeImageRef.current;
      const canvasStorageRef = ref(storage, idPath + "wholeImage");
      if (canvas) {
        const canvasDataURL = await new Promise<string>((resolve) => {
          html2canvas(canvas, {
            allowTaint: true,
            useCORS: true,
          }).then((canvas) => {
            const canvasReal = canvas.toDataURL("image/png");
            resolve(canvasReal);
          });
        });

        const canvasBlob = await fetch(canvasDataURL).then((res) => res.blob());
        const compressedCanvasFile = await imageCompression(
          canvasBlob as File,
          {
            maxSizeMB: 1,
            maxWidthOrHeight: 1920,
            useWebWorker: true,
          }
        );

        await uploadBytesResumable(canvasStorageRef, compressedCanvasFile);
      }
      const downloadURL = await getDownloadURL(storageRef);
      const canvasDownloadURL = await getDownloadURL(canvasStorageRef);
      const data = {
        bgURL: downloadURL,
        canvasURL: canvasDownloadURL,
        ironCurtainURL: selectedImage,
        surfaceArea,
        surfaceAreaPrice: price,
      };
      const userCollection = collection(database, "users");
      const userDoc = doc(userCollection, userId);
      const projects = await getDoc(userDoc).then(
        (doc) => doc.data()?.projects
      );
      if (projects) {
        const projectsUpdated = projects.map((project: any) => {
          if (project.id === id) {
            return {
              ...project,
              ...data,
            };
          }
          return project;
        });
        await updateDoc(userDoc, {
          projects: projectsUpdated,
        });
      }
      toast.update(toastId, {
        render: "Image sauvegardée avec succès",
        type: "success",
        isLoading: false,
        autoClose: 2000,
      });
    } catch (error) {
      toast.update(toastId, {
        render: "Erreur lors de la sauvegarde de l'image",
        type: "error",
        isLoading: false,
        autoClose: 2000,
      });
    } finally {
      setDisableButtons(false);
    }
  };

  const handleContact = () => {
    modalRef.current?.showModal();
  };

  const handleEmail = (e: any) => {
    e.preventDefault();
    modalRef.current?.close();
    const toastId = toast.loading("S'il vous plaît, attendez...", {
      position: "top-center",
      theme: "colored",
    });
  };

  useEffect(() => {
    const fetchProject = async () => {
      const userCollection = collection(database, "users");
      if (!auth.currentUser) return;
      const userDoc = doc(userCollection, auth.currentUser?.uid);
      const projects = await getDoc(userDoc).then(
        (doc) => doc.data()?.projects
      );
      if (projects) {
        const project = projects.find((project: any) => project.id === id);
        if (project) {
          if (
            project.surfaceArea === 0 ||
            project.surfaceAreaPrice === 0 ||
            project.ironCurtainURL === "" ||
            project.bgURL === null
          ) {
          } else {
            setUploadedImage(project.bgURL);
            setSelectedImage(project.ironCurtainURL);
            setSurfaceArea(project.surfaceArea);
            setPrice(project.surfaceAreaPrice);
            const uploadedImageDataTemp = await fetch(project.bgURL).then(
              (res) => res.blob()
            );
            setUploadedImageData(uploadedImageDataTemp);
          }
        }
      }
    };
    fetchProject().then();
  }, [id]);

  return (
    <section className="min-h-[calc(100vh-15.5rem)]">
      <ImageExplore
        uploadedImage={uploadedImage}
        setSelectedImage={setSelectedImage}
        selectedImage={selectedImage}
      />
      <div className="flex lg:flex-row flex-col w-full h-full">
        <div className="lg:p-6 lg:w-2/3 w-full h-full">
          <DropableRegion
            wholeImageRef={wholeImageRef}
            selectedImage={selectedImage}
            uploadedImage={uploadedImage}
          />
        </div>
        <div className="lg:w-1/3 w-full h-full p-6 flex flex-col gap-y-6">
          <ButtonsRegion
            disableButtons={disableButtons}
            handleUploadImage={handleUploadImage}
            handleReset={handleReset}
            handleSave={handleSave}
            handleContact={handleContact}
          />
          <SurfaceAreaToPrixConvertor
            surfaceArea={surfaceArea}
            setSurfaceArea={setSurfaceArea}
            price={price}
            setPrice={setPrice}
          />
        </div>
      </div>
      <dialog ref={modalRef} className="modal modal-bottom sm:modal-middle">
        <div className="modal-box bg-primary text-white">
          <span className="font-secondary">
            Are you sure you want to continue?
          </span>
          <form method="dialog" className="modal-action">
            <button
              className="btn btn-primary bg-primary text-white hover:bg-white hover:text-primary hover:border-primary btn-sm rounded border-primary"
              onClick={handleEmail}
            >
              Yes
            </button>
            <button className="btn btn-primary bg-primary text-white hover:bg-white hover:text-primary hover:border-primary btn-sm rounded border-primary">
              No
            </button>
          </form>
        </div>
      </dialog>
    </section>
  );
}

export default projectExistenceCheck(authProtection(Project));
