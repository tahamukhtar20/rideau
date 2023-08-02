interface ILogin {
  title: string;
  options: IOptions[];
  incorrectEmailOrPassword: string;
  submit: {
    label: string;
  };
}

interface IOptions {
  name: string;
  placeholder: string;
  label: string;
  required: boolean;
  type: string;
  regex?: RegExp;
  requiredLabel: string;
}

export const login: ILogin = {
  title: "Connexion",
  options: [
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
      name: "password",
      placeholder: "Votre mot de passe",
      label: "Mot de passe",
      required: true,
      type: "password",
      requiredLabel: "Le mot de passe est requis",
    },
  ],
  incorrectEmailOrPassword: "Email ou mot de passe incorrect",
  submit: {
    label: "Se connecter",
  },
};
