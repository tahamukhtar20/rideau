"use client";
import React, { useState } from "react";
import { galleryTitle } from "@/data/gallery/gallery";
import Lightbox from "react-image-lightbox";
import "react-image-lightbox/style.css"; // Import the styles

export default function Gallery() {
  const images = [
    "https://flowbite.s3.amazonaws.com/docs/gallery/masonry/image.jpg",
    "https://flowbite.s3.amazonaws.com/docs/gallery/masonry/image-1.jpg",
    "https://flowbite.s3.amazonaws.com/docs/gallery/masonry/image-2.jpg",
  ];

  const [photoIndex, setPhotoIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

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
        {images.map((image, index) => (
          <div key={index} onClick={() => openLightbox(index)}>
            <img
              className="h-auto max-w-full rounded-lg cursor-pointer"
              src={image}
              alt=""
            />
          </div>
        ))}
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
