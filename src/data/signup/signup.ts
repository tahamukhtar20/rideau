interface IOptions {
  name: string;
  placeholder: string;
  label: string;
  required: boolean;
  requiredLabel: string;
}
interface ISignup {
  title: string;
  options: IOptions[];
  passwordDontMatch: string;
  submit: {
    label: string;
  };
}
export const signup: ISignup = {
  title: "inscription",
  options: [
    {
      name: "firstName",
      placeholder: "Votre prénom",
      label: "Prénom",
      required: true,
      requiredLabel: "Le prénom est requis",
    },
    {
      name: "lastName",
      placeholder: "Votre nom",
      label: "Nom",
      required: true,
      requiredLabel: "Le nom est requis",
    },
    {
      name: "email",
      placeholder: "Votre email",
      label: "Email",
      required: true,
      requiredLabel: "L'email est requis",
    },
    {
      name: "phone",
      placeholder: "Votre téléphone",
      label: "Téléphone",
      required: true,
      requiredLabel: "Le téléphone est requis",
    },
    {
      name: "entreprise",
      placeholder: "Votre entreprise",
      label: "Entreprise",
      required: false,
      requiredLabel: "",
    },
    {
      name: "website",
      placeholder: "Votre site web",
      label: "Site web",
      required: false,
      requiredLabel: "",
    },
    {
      name: "password",
      placeholder: "Votre mot de passe",
      label: "Mot de passe",
      required: true,
      requiredLabel: "Le mot de passe est requis",
    },
    {
      name: "confirmPassword",
      placeholder: "Confirmez votre mot de passe",
      label: "Confirmation",
      required: true,
      requiredLabel: "La confirmation est requise",
    },
  ],
  passwordDontMatch: "Les mots de passe ne correspondent pas",
  submit: {
    label: "S'inscrire",
  },
};
