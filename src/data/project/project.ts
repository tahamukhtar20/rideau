interface IProject {
  uploadImage: string;
  save: string;
  export: string;
  surfaceArea: string;
  price: string;
  dragAndDropImages: string;
  reset: string;
  uploading: string;
}
export const project: IProject = {
  reset: "réinitialiser",
  uploading: "téléchargement...",
  uploadImage: "télécharger une image",
  save: "sauvegarder",
  export: "exporter",
  surfaceArea: "surface en m²",
  price: "prix",
  dragAndDropImages: "glisser-déposer des images",
};
