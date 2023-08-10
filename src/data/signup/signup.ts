interface IOptions {
  name: string;
  placeholder: string;
  label: string;
  required: boolean;
  type: string;
  regex?: RegExp;
  requiredLabel: string;
}
interface ISignup {
  title: string;
  options: IOptions[];
  passwordDontMatch: string;
  alreadyHaveAccount: string;
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
      type: "text",
      requiredLabel: "Le prénom est requis",
    },
    {
      name: "lastName",
      placeholder: "Votre nom",
      label: "Nom",
      required: true,
      type: "text",
      requiredLabel: "Le nom est requis",
    },
    {
      name: "email",
      placeholder: "Votre email",
      label: "Email",
      regex: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/i,
      required: true,
      type: "email",
      requiredLabel: "L'email est requis",
    },
    {
      name: "phone",
      placeholder: "Votre téléphone",
      label: "Téléphone",
      required: true,
      type: "tel",
      requiredLabel: "Le téléphone est requis",
    },
    {
      name: "company",
      placeholder: "Votre entreprise",
      label: "Entreprise",
      type: "text",
      required: true,
      requiredLabel: "L'entreprise est requise",
    },
    {
      name: "website",
      placeholder: "Votre site web",
      label: "Site web",
      required: false,
      type: "url",
      requiredLabel: "",
    },
    {
      name: "password",
      placeholder: "Votre mot de passe",
      label: "Mot de passe",
      required: true,
      type: "password",
      requiredLabel: "Le mot de passe est requis",
    },
    {
      name: "confirmPassword",
      placeholder: "Confirmez votre mot de passe",
      label: "Confirmation",
      required: true,
      type: "password",
      requiredLabel: "La confirmation est requise",
    },
  ],
  passwordDontMatch: "Les mots de passe ne correspondent pas",
  alreadyHaveAccount: "Vous avez déjà un compte ? Connectez-vous",
  submit: {
    label: "S'inscrire",
  },
};
