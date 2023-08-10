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

export const profile: IProfile = {
  login: "se connecter",
  logout: "se déconnecter",
  signup: "s'inscrire",
  editProfile: "modifier mon profil",
  projects: "mes projets",
};

/*** Interfaces ***/

interface IOption {
  name: string;
  slug: string;
}

interface IProfile {
  login: string;
  logout: string;
  signup: string;
  editProfile: string;
  projects: string;
}
