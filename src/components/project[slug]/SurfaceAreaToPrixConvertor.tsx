"use client";
import React, { useState } from "react";
import { toast } from "react-toastify";

const SurfaceAreaToPrixConvertor = ({
  surfaceArea,
  setSurfaceArea,
  price,
  setPrice,
}: {
  surfaceArea: string;
  setSurfaceArea: React.Dispatch<React.SetStateAction<string>>;
  price: number | null;
  setPrice: React.Dispatch<React.SetStateAction<number | null>>;
}) => {
  const [unit, setUnit] = useState("cm");
  const [height, setHeight] = useState<string | null>(null);
  const [width, setWidth] = useState<string | null>(null);
  const calculatePrice = () => {
    if (
      !height ||
      !width ||
      isNaN(parseFloat(height)) ||
      isNaN(parseFloat(width)) ||
      parseFloat(height) <= 0 ||
      parseFloat(width) <= 0 ||
      !isFinite(parseFloat(height)) ||
      !isFinite(parseFloat(width))
    ) {
      toast.warning("Veuillez entrer des dimensions valides.", {
        position: "top-center",
        theme: "colored",
      });
      return;
    }

    let convertedHeight = parseFloat(height);
    let convertedWidth = parseFloat(width);

    if (unit === "mm") {
      convertedHeight = convertedHeight / 10; // Convert mm to cm
      convertedWidth = convertedWidth / 10; // Convert mm to cm
    } else if (unit === "m") {
      convertedHeight = convertedHeight * 100; // Convert m to cm
      convertedWidth = convertedWidth * 100; // Convert m to cm
    }

    const area = convertedHeight * convertedWidth;
    setSurfaceArea(area.toString());
    const priceFactor = 1.5;
    const calculatedPrice = area * priceFactor;
    setPrice(parseFloat(calculatedPrice.toFixed(2)));
  };

  return (
    <div className="rounded bg-primary h-full p-4">
      <h1 className="text-white text-center font-secondary">
        Dimensions à Prix
      </h1>
      <div className="flex flex-col items-center mt-4">
        <label htmlFor="heightInput" className="text-white mb-2">
          Hauteur:
        </label>
        <input
          type="number"
          id="heightInput"
          className="border rounded p-1"
          value={height?.toString()}
          onChange={(e) => setHeight(e.target.value)}
        />
        <label htmlFor="widthInput" className="text-white mb-2">
          Largeur:
        </label>
        <input
          type="number"
          id="widthInput"
          className="border rounded p-1"
          value={width?.toString()}
          onChange={(e) => setWidth(e.target.value)}
        />
        <div className="flex items-center mt-2">
          <label htmlFor="unitSelect" className="text-white mr-2">
            Unité:
          </label>
          <select
            id="unitSelect"
            className="border rounded p-1"
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
          >
            <option value="cm">cm</option>
            <option value="mm">mm</option>
            <option value="m">m</option>
          </select>
        </div>
        <button
          className="btn btn-primary bg-primary mt-4 text-white hover:bg-white hover:text-primary hover:border-primary btn-sm rounded border-primary"
          onClick={calculatePrice}
        >
          Calculer le prix
        </button>
        {price !== null && (
          <div className="mt-4 text-white">Price: {price} EUR</div>
        )}
      </div>
    </div>
  );
};

export default SurfaceAreaToPrixConvertor;
