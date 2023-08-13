import { Rnd } from "react-rnd";
import Image from "next/image";
import React from "react";

const DraggableImage = ({ src }: { src: string }) => {
  return (
    <Rnd
      default={{
        x: 0,
        y: 0,
        width: 100,
        height: 100,
      }}
      bounds="parent"
    >
      <div className="border-black outline-white border-4 w-full h-full bg-contain bg-center bg-repeat relative">
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

export default DraggableImage;
