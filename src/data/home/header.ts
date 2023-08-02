/*** exports ***/

export const options: IOption[] = [
  {
    name: "Créer votre projet",
    slug: "projects",
  },
  {
    name: "Galerie",
    slug: "gallery",
  },
];

/*** Interfaces ***/

interface IOption {
  name: string;
  slug: string;
}
