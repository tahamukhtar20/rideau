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
  const calculatePrice = () => {
    if (
      !surfaceArea ||
      isNaN(parseFloat(surfaceArea)) ||
      parseFloat(surfaceArea) <= 0 ||
      !isFinite(parseFloat(surfaceArea))
    ) {
      toast.warning("Veuillez entrer une superficie valide.", {
        position: "top-center",
        theme: "colored",
      });
      return;
    }
    let convertedArea = parseFloat(surfaceArea);
    convertedArea = convertedArea / 100;
    const priceFactor = 1.5;
    const calculatedPrice = convertedArea * priceFactor;
    setPrice(parseFloat(calculatedPrice.toFixed(2)));
  };

  return (
    <div className="rounded bg-primary h-full p-4">
      <h1 className="text-white text-center font-secondary">Surface à Prix</h1>
      <div className="flex flex-col items-center mt-4">
        <label htmlFor="surfaceAreaInput" className="text-white mb-2">
          Surface Area:
        </label>
        <input
          type="number"
          id="surfaceAreaInput"
          className="border rounded p-1"
          value={surfaceArea}
          onChange={(e) => setSurfaceArea(e.target.value)}
        />
        <div className="flex items-center mt-2">
          <label htmlFor="unitSelect" className="text-white mr-2">
            Unit:
          </label>
          <span className="text-white">cm²</span>
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
