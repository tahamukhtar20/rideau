"use client";
import React, { useEffect, useState } from "react";
import { getDownloadURL, getStorage, listAll, ref } from "@firebase/storage";
import { toast } from "react-toastify";
import Image from "next/image";

const ImageExplore = ({
  uploadedImage,
  selectedImage,
  setSelectedImage,
}: {
  uploadedImage: string | null;
  selectedImage: string | null;
  setSelectedImage: React.Dispatch<React.SetStateAction<string | null>>;
}) => {
  const [images, setImages] = useState<string[]>([]);
  const setImagesFirebase = async () => {
    const storage = getStorage();
    const storageRef = ref(storage, "Iron Curtains/");
    try {
      const images = await listAll(storageRef);
      const urls = await Promise.all(
        images.items.map((image) => getDownloadURL(image))
      );
      setImages(urls);
    } catch (error) {
      toast.error("Erreur lors du chargement des images :" + error, {
        position: "top-center",
        theme: "colored",
      });
    }
  };

  const imageSelectionHandler = (image: string) => {
    if (uploadedImage !== null) {
      setSelectedImage(image);
    } else {
      toast.info("Veuillez d'abord télécharger une image", {
        position: "top-center",
        theme: "colored",
      });
    }
  };

  useEffect(() => {
    setImagesFirebase().then();
  }, []);

  return (
    <section className="bg-secondary lg:h-36 sm:h-24 h-20 z-0">
      <div className="flex flex-row h-full overflow-auto scroll-smooth">
        {images.length === 0 &&
          Array.from({ length: 10 }, (_, index) => <Loading key={index} />)}
        {images.map((image, index) => (
          <div
            className={`flex aspect-video p-2`}
            key={index}
            onClick={() => imageSelectionHandler(image)}
          >
            <Image
              src={image}
              alt="image"
              unoptimized={true}
              width={0}
              height={0}
              sizes="100vw"
              className={`object-cover h-auto w-full rounded ${
                selectedImage === image ? "border-4 border-primary-dark" : ""
              }`}
            />
          </div>
        ))}
      </div>
    </section>
  );
};

const Loading = () => {
  return (
    <>
      <div className="flex aspect-video p-2 ">
        <div className="animate-pulse bg-gray-400 h-full w-full rounded"></div>
      </div>
    </>
  );
};

export default ImageExplore;
