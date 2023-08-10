interface IProfileData {
  "First Name": string;
  "Last Name": string;
  email: string;
  phone: string;
  company: string;
  website: string;
  password: string;
}
interface IPageContent {
  title: string;
  formFields: IFormField[];
  modalContent: IModalContent;
}
interface IFormField {
  label: string;
  inputType: string;
  inputId: string;
  placeholder?: string;
  options?: IOption[];
}

interface IOption {
  value: string;
  text: string;
}

interface IModalContent {
  titlePrefix: string;
  cancelButton: string;
}
export const jsonData = {
  profileData: {
    "First Name": "...",
    "Last Name": "...",
    email: "...",
    phone: "...",
    company: "...",
    website: "...",
    password: "••••••••••",
  },
  countryCode: "+1",
  pageContent: {
    title: "Edit Profile",
    formFields: [
      {
        label: "Nom",
        inputType: "text",
        inputId: "First Name",
        placeholder: "First Name",
      },
      {
        label: "Prénom",
        inputType: "text",
        inputId: "Last Name",
        placeholder: "Last Name",
      },
      {
        label: "email",
        inputType: "email",
        inputId: "email",
        placeholder: "Email",
      },
      {
        label: "téléphone",
        inputType: "select",
        inputId: "phone",
        placeholder: "Phone",
      },
      {
        label: "entreprise",
        inputType: "text",
        inputId: "company",
        placeholder: "Company",
      },
      {
        label: "Site Web",
        inputType: "text",
        inputId: "website",
        placeholder: "Website",
      },
      {
        label: "Mot De Passe",
        inputType: "password",
        inputId: "password",
        placeholder: "Password",
      },
    ],
    modalContent: {
      titlePrefix: "Change ",
      cancelButton: "Cancel",
    },
  },
};
