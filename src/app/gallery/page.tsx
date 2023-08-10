"use client";
import React, { useEffect, useState } from "react";
import { galleryTitle } from "@/data/gallery/gallery";
import Lightbox from "react-image-lightbox";
import "react-image-lightbox/style.css";
import Image from "next/image";
import { getDownloadURL, getStorage, listAll, ref } from "@firebase/storage"; // Import the styles

export default function Gallery() {
  const [photoIndex, setPhotoIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  useEffect(() => {
    const fetchData = async () => {
      const storage = getStorage();
      const storageRef = ref(storage, "Gallery/");
      try {
        const images = await listAll(storageRef);
        const urls = await Promise.all(
          images.items.map((image) => getDownloadURL(image))
        );
        setImages(urls);
      } catch (error) {
        console.error("Error loading images:", error);
      }
    };
    fetchData().then();
  }, []);

  const openLightbox = (index: number) => {
    setPhotoIndex(index);
    setIsOpen(true);
  };

  return (
    <main className="min-h-[calc(100vh-15.5rem)] font-secondary text-primary bg-white flex flex-col">
      <section className="flex flex-col items-center justify-center h-full py-4">
        <h1 className="text-4xl font-bold uppercase">{galleryTitle}</h1>
      </section>
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4">
        {images.length === 0 ? (
          <>
            <div className="animate-pulse flex flex-col items-center justify-center bg-gray-200 rounded-box aspect-video my-8">
              <div className="w-16 h-2 bg-gray-300 rounded-full mt-2"></div>
              <div className="w-20 h-20 bg-gray-300 rounded"></div>
            </div>
            <div className="animate-pulse flex flex-col items-center justify-center bg-gray-200 rounded-box aspect-video my-8">
              <div className="w-16 h-2 bg-gray-300 rounded-full mt-2"></div>
              <div className="w-20 h-20 bg-gray-300 rounded"></div>
            </div>
            <div className="animate-pulse flex flex-col items-center justify-center bg-gray-200 rounded-box aspect-video my-8">
              <div className="w-16 h-2 bg-gray-300 rounded-full mt-2"></div>
              <div className="w-20 h-20 bg-gray-300 rounded"></div>
            </div>
          </>
        ) : (
          images.map((image, index) => (
            <div key={index}>
              <Image
                key={index}
                onClick={() => openLightbox(index)}
                className="rounded-lg cursor-pointer object-cover"
                width={500}
                height={500}
                src={image}
                alt=""
              />
            </div>
          ))
        )}
      </section>
      {isOpen && (
        <Lightbox
          mainSrc={images[photoIndex]}
          nextSrc={images[(photoIndex + 1) % images.length]}
          prevSrc={images[(photoIndex + images.length - 1) % images.length]}
          onCloseRequest={() => setIsOpen(false)}
          onMovePrevRequest={() =>
            setPhotoIndex((photoIndex + images.length - 1) % images.length)
          }
          onMoveNextRequest={() =>
            setPhotoIndex((photoIndex + 1) % images.length)
          }
        />
      )}
    </main>
  );
}
