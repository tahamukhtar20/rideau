"use client";
import React, { Suspense, useEffect, useState } from "react";
import { project } from "@/data/project/project";
import Image from "next/image";
import { Rnd } from "react-rnd";
import Compressor from "compressorjs";
import projectExistenceCheck from "@/components/HOC/projectExistenceCheck";
import {
  getDownloadURL,
  getStorage,
  listAll,
  ref,
  uploadBytesResumable,
} from "@firebase/storage";
import { auth, database } from "@/firebase/config";
import html2canvas from "html2canvas";
import authProtection from "@/components/HOC/authProtection";
import { toast } from "react-toastify";
import { collection, doc, getDoc, updateDoc } from "@firebase/firestore";

const DraggableImage = ({ src }: { src: string }) => {
  return (
    <Rnd
      default={{
        x: 0,
        y: 0,
        width: 320,
        height: 200,
      }}
      bounds="parent"
    >
      <div className="border-black outline-2 outline-white border-2 w-full h-full bg-contain bg-center bg-repeat relative">
        <Image
          src={src}
          unoptimized={true}
          alt={"dndImage"}
          draggable={false}
          fill={true}
        />
      </div>
    </Rnd>
  );
};

function Project({ params: { id } }: { params: { id: string } }) {
  const [images, setImages] = useState<any[]>([]);
  const [draggable, setDraggable] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentImage, setCurrentImage] = useState<any>(null);
  const [surfaceArea, setSurfaceArea] = useState<number | null>(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [imageFile, setImageFile] = useState<File | Blob | null | undefined>(
    null
  );
  const html2canvasRef = React.useRef<HTMLDivElement>(null);
  const inputSurfaceAreaRef = React.useRef<HTMLInputElement>(null);
  const handleDrop = (e: any) => {
    e.preventDefault();
    const data = e.dataTransfer.getData("text/plain");
    setCurrentImage(data);
  };
  const toggleSaving = () => {
    setSaving((prev) => !prev);
  };
  const handleSave = async () => {
    if (!imageFile) return;
    const toastId = toast.loading("la sauvegarde des données", {
      position: "top-center",
      theme: "colored",
    });
    try {
      setUploading(true);

      toggleSaving();

      const serializedData = await serializeProjectState();
      const userCollection = collection(database, "users");
      const userDoc = doc(userCollection, auth.currentUser?.uid);
      const projects = await getDoc(userDoc).then(
        (doc: any) => doc.data()?.projects
      );
      const projectsUpdated = projects.map((project: any) => {
        if (project.id === id) {
          return {
            ...project,
            ...serializedData,
          };
        }
        return project;
      });
      await updateDoc(userDoc, {
        projects: projectsUpdated,
      });
      setUploading(false);
      toggleSaving();
      toast.update(toastId, {
        render: "les données ont été sauvegardées",
        type: "success",
        isLoading: false,
        autoClose: 2000,
      });
    } catch (error) {
      setUploading(false);
      toggleSaving();
      toast.update(toastId, {
        render: "une erreur est survenue",
        type: "error",
        isLoading: false,
        autoClose: 2000,
      });
    }
  };
  const uploadImageToFireBase = async (file: File | Blob) => {
    const storage = getStorage();
    const storageRef = ref(
      storage,
      `User Scrap Data/${auth.currentUser?.uid}/${id}/` + file.name
    );
    const uploadTask = uploadBytesResumable(storageRef, file);

    return new Promise((resolve, reject) => {
      uploadTask.on(
        "state_changed",
        (snapshot: any) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
        },
        (error: any) => {
          console.log(error);
          reject(error);
        },
        async () => {
          try {
            const imageUrl = await getDownloadURL(storageRef);
            resolve(imageUrl);
          } catch (error) {
            console.log(error);
            reject(error);
          }
        }
      );
    });
  };

  const calculatePrice = () => {
    if (surfaceArea) {
      if (surfaceArea < 0) return 0;
      return Math.round((surfaceArea / 100) * 1.5 * 100) / 100;
    }
    return 0;
  };

  const handleReset = () => {
    setUploadedImage(null);
    setDraggable(false);
    setCurrentImage(null);
    setSurfaceArea(null);
    setImageFile(null);
    setUploading(false);
    inputSurfaceAreaRef.current!.value = "";
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    toggleUpload();
    let file: File | Blob | undefined = e.target.files?.[0];
    const uniqueIdentifier = new Date().getTime(); // Generate a unique identifier
    const originalFileName = file?.name || "image";
    const newFileName = "backgroundImage";
    file = new File([file as Blob], newFileName, {
      type: file?.type,
    });
    setImageFile(file);
    if (file) {
      new Compressor(file, {
        quality: 0.6,
        convertSize: 500 * 1024,
        success(result) {
          file = result;
        },
      });
      const url = URL.createObjectURL(file);
      setUploadedImage(url);
      toggleDraggable();
    }
    toggleUpload();
  };
  async function serializeProjectState() {
    if (!imageFile) return;
    let imageUrl = "";
    let wholeImage = "";
    if (inputSurfaceAreaRef.current) {
      const surfaceArea = inputSurfaceAreaRef.current.value;
      if (surfaceArea) {
        setSurfaceArea(parseInt(surfaceArea));
      }
    }
    await uploadImageToFireBase(imageFile)
      .then((url: any) => {
        imageUrl = url;
      })
      .catch((error) => {
        imageUrl = "";
      });
    if (imageUrl === "") return;
    const canvas = html2canvasRef.current;
    if (!canvas) return;
    const canvasData = await html2canvas(canvas, {
      useCORS: true,
      allowTaint: true,
    });
    if (canvasData) {
      const canvasURL = canvasData.toDataURL("image/png");
      const image = await fetch(canvasURL);
      const blob = await image.blob();
      let file: File = new File([blob], "wholeImage", {
        type: "image/jpeg",
      });
      new Compressor(file, {
        quality: 0.6,
        convertSize: 500 * 1024,
        success(result: File) {
          file = result;
        },
      });
      if (file) {
        await uploadImageToFireBase(file)
          .then((url: any) => {
            wholeImage = url;
          })
          .catch((error) => {
            wholeImage = "";
            console.error(error);
          });
      }
    }
    return {
      canvasURL: wholeImage,
      ironCurtainURL: currentImage,
      bgURL: imageUrl,
      surfaceArea,
      surfaceAreaPrice: calculatePrice(),
    };
  }

  const toggleUpload = () => {
    setUploading(!uploading);
  };
  const toggleDraggable = () => {
    setDraggable(!draggable);
  };
  useEffect(() => {
    const setImagesFirebase = async () => {
      const storage = getStorage();
      const storageRef = ref(storage, "Iron Curtains/");
      try {
        const images = await listAll(storageRef);
        const urls = await Promise.all(
          images.items.map((image) => getDownloadURL(image))
        );
        setImages(urls);
        setIsLoading(false);
      } catch (error) {
        toast.error("Error loading images: " + error, {
          position: "top-center",
          theme: "colored",
        });
        setIsLoading(false);
      }
    };
    const fetchProject = async () => {
      const userCollection = collection(database, "users");
      const userDoc = doc(userCollection, auth.currentUser?.uid);
      const projects = await getDoc(userDoc).then(
        (doc: any) => doc.data()?.projects
      );
      if (projects) {
        const project = projects.find((project: any) => project.id === id);
        if (project) {
          setSurfaceArea(project.surfaceArea);
          setCurrentImage(project.ironCurtainURL);
          setUploadedImage(project.bgURL);
          if (project.bgURL !== "" || project.ironCurtainURL !== "") {
            setImageFile(await fetch(project.bgURL).then((res) => res.blob()));
          }
          inputSurfaceAreaRef.current!.value = project.surfaceArea;
          if (project.ironCurtainURL !== "" || project.bgURL !== "") {
            setDraggable(true);
          }
        }
      }
    };
    fetchProject().then();
    setImagesFirebase().then();
  }, []);

  const contactSales = () => {
    const toastId = toast.loading("S'il vous plaît, attendez...", {
      position: "top-center",
      theme: "colored",
    });
    const fetchSalesEmail = async () => {
      try {
        const response = await fetch("/api/mail", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: auth.currentUser?.uid,
            email: auth.currentUser?.email,
          }),
        });
        const data = await response.json();
        toast.update(toastId, {
          render: "Les ventes vous répondront rapidement! Merci.",
          type: "success",
          position: "top-center",
          theme: "colored",
          isLoading: false,
        });
      } catch (error) {
        toast.update(toastId, {
          render: "Erreur lors de l'envoi du courriel : " + error,
          position: "top-center",
          theme: "colored",
          isLoading: false,
        });
      }
    };
    fetchSalesEmail().then();
  };
  return (
    <section className="w-full h-full">
      <div className="flex flex-row w-full h-full ">
        <div className="lg:w-2/3 w-3/4 flex flex-col lg:p-12 p-3">
          <h1>Project {id}</h1>
          <div
            ref={html2canvasRef}
            className="border-primary-dark border-2 border-dashed flex flex-col justify-center items-center h-full relative overflow-hidden"
            style={{
              backgroundImage: `url(${uploadedImage})`,
              backgroundSize: "contain",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
            }}
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
          >
            {!uploadedImage && (
              <label
                className={`btn btn-primary bg-primary text-white hover:bg-white hover:text-primary hover:border-primary btn-sm rounded border-primary ${
                  uploading ? "cursor-not-allowed btn-disabled" : ""
                }`}
              >
                {
                  <span>
                    {uploading ? project.uploading : project.uploadImage}
                  </span>
                }
                <input
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={handleImageUpload}
                />
              </label>
            )}
            {currentImage && <DraggableImage src={currentImage} />}
          </div>
          <div className="bg-primary text-white flex flex-row p-2 self-center rounded mt-2">
            <h1 className="w-full items-center flex">
              <span className="">Surface&nbsp;</span>
              <span className="">Area</span>
            </h1>
            <input
              className="input join-item input-sm rounded mx-2 text-black"
              type="number"
              ref={inputSurfaceAreaRef}
              pattern={"[0-9]*"}
              inputMode={"numeric"}
              placeholder=""
              onChange={(e) => setSurfaceArea(parseFloat(e.target.value))}
            />
            <h1 className="w-full items-center flex">
              <span>cm</span>
              <span className="text-xs align-top">2</span>
              <span>&nbsp;:</span>
            </h1>
            &nbsp;&nbsp;&nbsp;&nbsp;
            <h1 className="h-full flex items-center">prix</h1>
            &nbsp;&nbsp;&nbsp;&nbsp;
            <h1 className="h-full flex items-center">€</h1>
            &nbsp;&nbsp;
            <h1 className="h-full flex items-center">{calculatePrice()}</h1>
          </div>
          <div className="flex justify-center mt-6 gap-2">
            <button
              type="button"
              className={`btn btn-primary bg-primary text-white hover:bg-white hover:text-primary hover:border-primary btn-sm rounded border-primary ${
                imageFile ? "" : " cursor-not-allowed btn-disabled"
              } ${saving ? " cursor-not-allowed btn-disabled" : ""} `}
              onClick={handleSave}
            >
              {project.save}
            </button>
            <button
              type="button"
              className={`btn btn-primary bg-primary text-white hover:bg-white hover:text-primary hover:border-primary btn-sm rounded border-primary ${
                imageFile ||
                (inputSurfaceAreaRef.current?.value !== "" &&
                  inputSurfaceAreaRef.current?.value !== "0")
                  ? ""
                  : " cursor-not-allowed btn-disabled"
              } ${saving ? " cursor-not-allowed btn-disabled" : ""} `}
              onClick={handleReset}
            >
              {project.reset}
            </button>
            <button
              type="button"
              className={`btn btn-primary bg-primary text-white hover:bg-white hover:text-primary hover:border-primary btn-sm rounded border-primary ${
                imageFile &&
                currentImage &&
                inputSurfaceAreaRef.current?.value !== "" &&
                inputSurfaceAreaRef.current?.value !== "0"
                  ? ""
                  : " cursor-not-allowed btn-disabled"
              } ${saving ? " cursor-not-allowed btn-disabled" : ""} `}
              onClick={contactSales}
            >
              {project.contactSales}
            </button>
          </div>
        </div>
        <div
          className={`lg:w-1/3 w-1/4 bg-secondary h-[calc(100vh-3.5rem)] relative`}
        >
          {isLoading && (
            <div className="overlay flex justify-center items-center">
              <h1 className="text-xl text-red-500 uppercase">Loading...</h1>
            </div>
          )}
          {!isLoading && !draggable && (
            <div className="overlay flex justify-center items-center">
              <h1 className="text-xl text-red-500 uppercase">
                {project.uploadImage}
              </h1>
            </div>
          )}
          {!isLoading && (
            <div
              className={
                "h-full w-full overflow-auto grid grid-cols-1 lg:grid-cols-2 lg:gap-4 gap-y-4 p-4"
              }
            >
              <div className="col-span-2 h-10 rounded-lg bg-primary-dark hidden  text-white lg:flex justify-center items-center">
                <h4>{project.dragAndDropImages}</h4>
              </div>
              {images.map((key, index) => (
                <div className="flex justify-center aspect-square" key={index}>
                  <Image
                    unoptimized={true}
                    id={
                      index.toString() + "image" + "project" + id + "draggable"
                    }
                    draggable={draggable}
                    src={key}
                    alt="Picture of the author"
                    key={index}
                    style={{
                      objectFit: "cover",
                      objectPosition: "center",
                      width: "100%",
                      height: "100%",
                    }}
                    width={200}
                    height={200}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default projectExistenceCheck(authProtection(Project));
