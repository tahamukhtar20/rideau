"use client";
import React, { useState } from "react";
import { project } from "@/data/project/project";
import Image from "next/image";
import { Rnd } from "react-rnd";

const DraggableImage = ({ src }: { src: string }) => {
  return (
    <div
      className="absolute top-0 left-0 h-[50%] w-[50%]"
      id={"uniqueID"}
      draggable={false}
    >
      <Rnd
        default={{
          x: 0,
          y: 0,
          width: 320,
          height: 200,
        }}
      >
        <img
          src={src}
          className="w-full h-full"
          alt={"img" + src}
          draggable={false}
        />
      </Rnd>
    </div>
  );
};

export default function Project({
  params: { id },
}: {
  params: { id: string };
}) {
  const [draggable, setDraggable] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [currentImage, setCurrentImage] = useState<string | null>(null);

  const handleDrop = (e: any) => {
    e.preventDefault();
    const data = e.dataTransfer.getData("text/plain");
    setCurrentImage(data);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setUploadedImage(imageUrl);
    }
    toggleDraggable();
  };

  const toggleDraggable = () => {
    setDraggable(!draggable);
  };

  const images = Array.from(Array(10).keys()).map(
    (key, index) => "https://picsum.photos/1000/300?random=" + index
  );

  return (
    <section className="w-full h-full">
      <div className="flex flex-row w-full h-full ">
        <div className="w-2/3 flex flex-col p-12">
          <h1>Project {id}</h1>
          <div
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
              <label className="btn btn-primary bg-primary text-white hover:bg-white hover:text-primary hover:border-primary btn-sm rounded border-primary">
                {project.uploadImage}
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
          <div className="flex justify-center mt-6">
            <button
              type="submit"
              className="btn btn-primary bg-primary text-white hover:bg-white hover:text-primary hover:border-primary btn-sm rounded border-primary"
            >
              {project.save}
            </button>
          </div>
        </div>
        <div
          className={`w-1/3 bg-secondary max-h-[calc(100vh-3.5rem)] relative`}
        >
          {!draggable && (
            <div className="overlay flex justify-center items-center">
              <h1 className="text-xl text-red-500 uppercase">
                {project.uploadImage}
              </h1>
            </div>
          )}
          <div
            className={
              "h-full w-full overflow-auto  grid grid-cols-2 gap-4 p-4"
            }
          >
            <div className="col-span-2 h-10 rounded-lg bg-primary-dark text-white flex justify-center  items-center">
              <h4>{project.dragAndDropImages}</h4>
            </div>
            {images.map((key, index) => (
              <div className="flex justify-center aspect-square" key={index}>
                <Image
                  id={index.toString() + "image" + "project" + id + "draggable"}
                  draggable={draggable}
                  src={key}
                  alt="Picture of the author"
                  key={index}
                  width={200}
                  height={200}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
