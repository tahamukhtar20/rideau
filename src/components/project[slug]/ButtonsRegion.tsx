import React from "react";

export default function ButtonsRegion({
  disableButtons,
  handleUploadImage,
  handleReset,
  handleSave,
  handleContact,
}: {
  disableButtons: boolean;
  handleUploadImage: (event: any) => void;
  handleReset: (event: any) => void;
  handleSave: (event: any) => void;
  handleContact: (event: any) => void;
}) {
  return (
    <>
      <section className="lg:grid lg:grid-cols-2 md:flex md:justify-center sm:grid-cols-2 grid grid-cols-1  gap-4 h-full w-full">
        <label
          className={`btn btn-primary bg-primary text-white hover:bg-white hover:text-primary hover:border-primary btn-sm rounded border-primary ${
            disableButtons ? "opacity-50 cursor-not-allowed btn-disabled" : ""
          }`}
        >
          Télécharger une image
          <input
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleUploadImage}
          />
        </label>
        <button
          type="button"
          onClick={handleContact}
          className={`btn btn-primary bg-primary text-white hover:bg-white hover:text-primary hover:border-primary btn-sm rounded border-primary ${
            disableButtons ? "opacity-50 cursor-not-allowed btn-disabled" : ""
          }`}
        >
          Contactez-nous
        </button>
        <button
          type="button"
          onClick={handleReset}
          className={`btn btn-primary bg-primary text-white hover:bg-white hover:text-primary hover:border-primary btn-sm rounded border-primary ${
            disableButtons ? "opacity-50 cursor-not-allowed btn-disabled" : ""
          }`}
        >
          Réinitialiser
        </button>
        <button
          type="button"
          onClick={handleSave}
          className={`btn btn-primary bg-primary text-white hover:bg-white hover:text-primary hover:border-primary btn-sm rounded border-primary ${
            disableButtons ? "opacity-50 cursor-not-allowed btn-disabled" : ""
          }`}
        >
          Sauvegarder
        </button>
      </section>
    </>
  );
}
