"use client";
import DraggableImage from "@/components/project[slug]/DraggableImage";

export default function DropableRegion({
  wholeImageRef,
  uploadedImage,
  selectedImage,
}: {
  wholeImageRef: React.MutableRefObject<HTMLDivElement | null>;
  uploadedImage: string | null;
  selectedImage: string | null;
}) {
  const backgroundStyle =
    !uploadedImage || uploadedImage === "Loading..."
      ? {}
      : { backgroundImage: `url(${uploadedImage})` };

  return (
    <>
      <section
        ref={wholeImageRef}
        className={`aspect-video w-full border-primary bg-no-repeat bg-contain bg-center ${
          selectedImage ? "" : "border-dashed"
        } border-2`}
        style={backgroundStyle}
      >
        {selectedImage ? (
          <DraggableImage src={selectedImage} />
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="bg-gray-200 p-3 rounded">
              {uploadedImage ? (
                uploadedImage === "Loading..." ? (
                  <span className="text-secondary text-2xl">Chargement...</span>
                ) : (
                  <span className="text-secondary text-2xl">
                    Sélectionnez une image
                  </span>
                )
              ) : (
                <span className="text-secondary text-2xl">
                  Téléchargez une image
                </span>
              )}
            </div>
          </div>
        )}
      </section>
    </>
  );
}
