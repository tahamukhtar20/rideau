"use client";
import React, { useEffect, useState } from "react";
import { project } from "@/data/project/project";
import Image from "next/image";
import { Rnd } from "react-rnd";
import Compressor from "compressorjs";
import { toPng } from "html-to-image";
import projectExistenceCheck from "@/components/HOC/projectExistenceCheck";
import {
  getDownloadURL,
  getStorage,
  listAll,
  ref,
  uploadBytesResumable,
} from "@firebase/storage";
import { auth } from "@/firebase/config";
import html2canvas from "html2canvas";

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
          className="rounded-md"
        />

        <div className="w-full h-2 border-gray-500 border absolute flex justify-center frameClass gap-0.5 items-center top-0">
          <span className="h-1 aspect-square rounded-full bg-black "></span>
          <span className="h-1 aspect-square rounded-full bg-black "></span>
          <span className="h-1 aspect-square rounded-full bg-black "></span>
        </div>
        <div className="w-2 h-full border-gray-500 border absolute flex flex-col justify-center frameClass gap-0.5 items-center right-0">
          <span className="h-1 aspect-square rounded-full bg-black "></span>
          <span className="h-1 aspect-square rounded-full bg-black "></span>
          <span className="h-1 aspect-square rounded-full bg-black "></span>
        </div>
        <div className="w-2 h-full border-gray-500 border absolute flex flex-col justify-center frameClass gap-0.5 items-center left-0">
          <span className="h-1 aspect-square rounded-full bg-black "></span>
          <span className="h-1 aspect-square rounded-full bg-black "></span>
          <span className="h-1 aspect-square rounded-full bg-black "></span>
        </div>
        <div className="w-full h-2 border-gray-500 border absolute flex justify-center frameClass gap-0.5 items-center bottom-0">
          <span className="h-1 aspect-square rounded-full bg-black "></span>
          <span className="h-1 aspect-square rounded-full bg-black "></span>
          <span className="h-1 aspect-square rounded-full bg-black "></span>
        </div>
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
  const handleSave = async () => {
    if (!imageFile) return;
    serializeProjectState().then((r) => console.log(r));
  };
  const uploadImageToFireBase = async (file: File | Blob) => {
    const storage = getStorage();
    const storageRef = ref(storage, "User Scrap Data/" + file.name);
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
    const basePrice = 100;
    const pricePerSquareMeter = 50;
    if (surfaceArea) {
      if (surfaceArea < 0) return 0;
      return basePrice + surfaceArea * pricePerSquareMeter;
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
    const newFileName = `user_${uniqueIdentifier}_${originalFileName}_${auth.currentUser?.uid}`;
    file = new File([file as Blob], newFileName, {
      type: file?.type,
    });
    setImageFile(file);
    if (file) {
      new Compressor(file, {
        quality: 0.6,
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
    await uploadImageToFireBase(imageFile)
      .then((url: any) => {
        imageUrl = url;
        console.log("Image URL:", url);
      })
      .catch((error) => {
        imageUrl = "";
        console.log("Error:", error);
      });
    if (imageUrl === "") return;
    document.querySelectorAll(".frameClass").forEach((el) => {
      el.classList.add("hidden");
    });
    const canvas = await toPng(html2canvasRef.current!, {
      cacheBust: true,
    }).then((dataUrl) => {
      wholeImage = dataUrl;
      return dataUrl;
    });
    console.log("Canvas:", canvas);
    document.querySelectorAll(".frameClass").forEach((el) => {
      el.classList.remove("hidden");
    });
    let canvasDataURL = await fetch(canvas).then((res) => res.blob());
    const uniqueIdentifier = new Date().getTime(); // Generate a unique identifier
    const originalFileName = canvasDataURL?.name || "image";
    const newFileName = `user_${uniqueIdentifier}_${originalFileName}_${auth.currentUser?.uid}`;
    canvasDataURL = new File([canvasDataURL as Blob], newFileName, {
      type: canvasDataURL?.type,
    });
    const a = document.createElement("a");
    a.style.display = "none";
    document.body.appendChild(a);
    a.href = canvas;
    a.download = `project_export.png`;
    a.click();
    document.body.removeChild(a);
    await uploadImageToFireBase(canvasDataURL)
      .then((url: any) => {
        wholeImage = url;
      })
      .catch((error) => {
        wholeImage = "";
        console.log("Error:", error);
      });
    return {
      wholeImage,
      imageUrl,
      currentImage,
      surfaceArea,
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
        setIsLoading(false); // Set isLoading to false when images are loaded
      } catch (error) {
        console.error("Error loading images:", error);
        setIsLoading(false); // Set isLoading to false on error as well
      }
    };
    setImagesFirebase().then();
  }, []);

  return (
    <section className="w-full h-full">
      <div className="flex flex-row w-full h-full ">
        <div className="w-2/3 flex flex-col p-12">
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
              <span>m</span>
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
              className="btn btn-primary bg-primary text-white hover:bg-white hover:text-primary hover:border-primary btn-sm rounded border-primary"
              onClick={handleSave}
            >
              {project.save}
            </button>
            <button
              type="button"
              className="btn btn-primary bg-primary text-white hover:bg-white hover:text-primary hover:border-primary btn-sm rounded border-primary"
              onClick={handleReset}
            >
              {project.reset}
            </button>
          </div>
        </div>
        <div className={`w-1/3 bg-secondary h-[calc(100vh-3.5rem)] relative`}>
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
                "h-full w-full overflow-auto grid grid-cols-2 gap-4 p-4"
              }
            >
              <div className="col-span-2 h-10 rounded-lg bg-primary-dark text-white flex justify-center  items-center">
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

export default projectExistenceCheck(Project);
