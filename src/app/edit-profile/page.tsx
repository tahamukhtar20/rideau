"use client";
import React, { useEffect, useState } from "react";
import { getAuth, updateEmail, updateProfile } from "firebase/auth";
import { collection, doc, getDoc, updateDoc } from "@firebase/firestore";
import { auth, database } from "@/firebase/config";
import authProtection from "@/components/HOC/authProtection";
import { useRouter } from "next/navigation";
import { jsonData } from "@/data/edit-profile/edit-profile-data";
import { useForm } from "react-hook-form";
import {
  EmailAuthProvider,
  reauthenticateWithCredential,
} from "@firebase/auth";
import { toast } from "react-toastify";

function EditProfile() {
  const [profile, setProfile] = useState(jsonData.profileData);
  const [country, setCountry] = useState(jsonData.countryCode);
  const router = useRouter();
  const [Field, setField] = useState<any>(null);
  const [reRender, setReRender] = useState(false);

  useEffect(() => {
    const fetchFirebaseData = async () => {
      const user = auth.currentUser;
      if (!user) return;
      const userCollection = collection(database, "users");
      const userDocRef = doc(userCollection, user.uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();
        setProfile({
          ...profile,
          "First Name": userData.firstName,
          "Last Name": userData.lastName,
          email: userData.email,
          phone: userData.phone,
          company: userData.company,
          website: userData.website,
        });
        setCountry(userData.countryCode);
      }
    };

    fetchFirebaseData().then();
  }, [reRender]);

  useEffect(() => {
    if (!Field) return;
    const editProfileModal = document.querySelector("#editProfileModal");
    if (!editProfileModal) return;
    // @ts-ignore
    editProfileModal.showModal();
  }, [Field]);

  // @ts-ignore
  return (
    <>
      <main className="min-h-[calc(100vh-15.5rem)] flex flex-col items-center py-14">
        <h1 className="font-secondary text-3xl lg:text-4xl my-10 lg:my-2">
          {jsonData.pageContent.title}
        </h1>
        <form className="w-full flex justify-center my-4">
          <div className="w-full max-w-[38rem] flex items-center lg:block px-4 flex-col">
            {jsonData.pageContent.formFields.map((field) => (
              <div
                key={field.label}
                className="flex lg:flex-row flex-col justify-between lg:items-center mb-4"
              >
                <label
                  className="text-sm label font-black"
                  htmlFor={field.inputId}
                >
                  {field.label.charAt(0).toUpperCase() + field.label.slice(1)}
                </label>
                <div className="join max-w-[20rem]">
                  {field.inputId === "phone" ? (
                    <input
                      className="z-0 input join-item w-1/3 pr-0"
                      id="countryCode"
                      name="countryCode"
                      value={country}
                      disabled={true}
                    ></input>
                  ) : (
                    <></>
                  )}
                  <input
                    className="input join-item w-full"
                    type={field.inputType === "password" ? "password" : "text"}
                    id={field.inputId}
                    name={field.inputId}
                    placeholder={field.placeholder}
                    // @ts-ignore
                    value={profile[field.inputId]}
                    disabled={true}
                  />
                  {field.inputType === "password" ? (
                    <button
                      onClick={() => {
                        router.push("/change-password");
                      }}
                      type="button"
                      className="btn btn-primary bg-primary text-white hover:bg-white hover:text-primary hover:border-primary rounded border-primary join-item"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24px"
                        height="24px"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <path
                          d="M20.1497 7.93997L8.27971 19.81C7.21971 20.88 4.04971 21.3699 3.27971 20.6599C2.50971 19.9499 3.06969 16.78 4.12969 15.71L15.9997 3.84C16.5478 3.31801 17.2783 3.03097 18.0351 3.04019C18.7919 3.04942 19.5151 3.35418 20.0503 3.88938C20.5855 4.42457 20.8903 5.14781 20.8995 5.90463C20.9088 6.66146 20.6217 7.39189 20.0997 7.93997H20.1497Z"
                          className="stroke-secondary"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M21 21H12"
                          className="stroke-secondary"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                  ) : (
                    <button
                      className="btn btn-primary flex bg-primary text-white hover:bg-white hover:text-primary hover:border-primary rounded border-primary join-item"
                      type="button"
                      onClick={() => {
                        setField(field);
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24px"
                        height="24px"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <path
                          d="M20.1497 7.93997L8.27971 19.81C7.21971 20.88 4.04971 21.3699 3.27971 20.6599C2.50971 19.9499 3.06969 16.78 4.12969 15.71L15.9997 3.84C16.5478 3.31801 17.2783 3.03097 18.0351 3.04019C18.7919 3.04942 19.5151 3.35418 20.0503 3.88938C20.5855 4.42457 20.8903 5.14781 20.8995 5.90463C20.9088 6.66146 20.6217 7.39189 20.0997 7.93997H20.1497Z"
                          className="stroke-secondary"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M21 21H12"
                          className="stroke-secondary"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </form>
        {Field !== null && (
          <ChangeModal
            field={Field?.label}
            otherFields={Field}
            setReRender={setReRender}
            setField={setField}
          />
        )}
      </main>
    </>
  );
}

export default authProtection(EditProfile);

const ChangeModal = ({
  field,
  otherFields,
  setReRender,
  setField,
}: {
  field: any;
  otherFields: any;
  setReRender: any;
  setField: any;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({});
  const handleFormSubmit = (data: any) => {
    const toastId = toast.loading("Mettre à jour les détails...", {
      position: "top-center",
      autoClose: false,
      theme: "colored",
    });
    const fetcher = async () => {
      try {
        data = {
          password: data["passwordModal"],
          [otherFields.inputId]: data[otherFields.inputId + "Modal"],
        };
        const user = auth.currentUser;
        if (user) {
          if (typeof user.email === "string") {
            const credential = EmailAuthProvider.credential(
              user.email,
              data.password
            );
            await reauthenticateWithCredential(user, credential);
            const userCollection = collection(database, "users");
            const userDocRef = doc(userCollection, user.uid);
            if (otherFields.inputId === "First Name") {
              await updateDoc(userDocRef, {
                firstName: data[otherFields.inputId],
              });
              console.log("first name updated");
            } else if (otherFields.inputId === "Last Name") {
              await updateDoc(userDocRef, {
                lastName: data[otherFields.inputId],
              });
              console.log("last name updated");
            } else if (otherFields.inputId === "email") {
              await updateDoc(userDocRef, {
                email: data[otherFields.inputId],
              });
              await updateEmail(user, data[otherFields.inputId]);
              console.log("email updated");
            } else {
              await updateDoc(userDocRef, {
                [otherFields.inputId]: data[otherFields.inputId],
              });
              console.log(`${otherFields.inputId} field updated`);
            }
          }
        }
        setReRender((prev: boolean) => {
          return !prev;
        });
        toast.update(toastId, {
          render: "Détails mis à jour!",
          type: "success",
          position: "top-center",
          isLoading: false,
          autoClose: 2000,
          hideProgressBar: false,
        });
        const editProfileModal = document.querySelector("#editProfileModal");
        if (!editProfileModal) return;
        // @ts-ignore
        editProfileModal.close();
      } catch (e: any) {
        if (e.code === "auth/wrong-password") {
          toast.update(toastId, {
            render: "Mot de passe incorrect!",
            type: "error",
            position: "top-center",
            isLoading: false,
            autoClose: 2000,
            hideProgressBar: false,
          });
        } else {
          toast.update(toastId, {
            render: "Erreur lors de la mise à jour des détails: " + e,
            type: "error",
            position: "top-center",
            isLoading: false,
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            draggable: true,
            theme: "colored",
          });
        }
      }
    };
    try {
      fetcher().then();
    } catch (e) {
      console.log(e);
    }
    reset();
  };
  useEffect(() => {
    const editProfileModal = document.querySelector("#editProfileModal");
    const handleClose = () => {
      setField(null);
    };
    if (editProfileModal) {
      editProfileModal.addEventListener("close", handleClose);
    }
    return () => {
      if (editProfileModal) {
        editProfileModal.removeEventListener("close", handleClose);
      }
    };
  }, [setField]);
  return (
    <>
      <dialog
        id="editProfileModal"
        className="modal modal-bottom sm:modal-middle"
      >
        <form
          method="dialog"
          className="modal-box bg-primary"
          onSubmit={handleSubmit(handleFormSubmit)}
        >
          <h3 className="font-bold text-lg">
            {jsonData.pageContent.modalContent.titlePrefix + field}
          </h3>
          <div>
            <label className="text-sm label font-black" htmlFor={field}>
              {field?.charAt(0)?.toUpperCase() + field?.slice(1)}
            </label>
            {field === "Phone" ? (
              <div className="flex">
                <select
                  className="input join-item w-full"
                  id="phoneCode"
                  {...register("phoneCodeModal", {
                    required: true,
                  })}
                >
                  <option value="216">+216</option>
                </select>
                <input
                  className="input join-item w-full"
                  type="text"
                  id={otherFields.inputId}
                  placeholder={
                    field?.charAt(0)?.toUpperCase() + field?.slice(1)
                  }
                  {...register(otherFields.inputId + "Modal", {
                    required: true,
                  })}
                />
              </div>
            ) : (
              <input
                className="input join-item w-full"
                type={"text"}
                id={otherFields.inputId}
                placeholder={field?.charAt(0)?.toUpperCase() + field?.slice(1)}
                {...register(otherFields.inputId + "Modal", {
                  required: true,
                })}
              />
            )}
            {errors[otherFields.inputId + "Modal"] && (
              <span className="text-red-500 text-sm">{field} requis</span>
            )}
          </div>
          <div>
            <label className="text-sm label font-black" htmlFor={field}>
              Mot De Passe
            </label>
            <input
              className="input join-item w-full"
              type="password"
              id={"passwordModal"}
              placeholder="Mot De Passe"
              {...register("passwordModal", {
                required: true,
              })}
            />
            {errors["passwordModal"] && (
              <span className="text-red-500 text-sm">Mot de passe requis</span>
            )}
          </div>
          <div className="modal-action">
            <button
              className="btn btn-primary flex bg-primary text-white hover:bg-white hover:text-primary hover:border-primary rounded border-primary join-item"
              type="submit"
            >
              Soumettre
            </button>
            <button
              onClick={() => {
                const editProfileModal =
                  document.querySelector("#editProfileModal");
                if (!editProfileModal) return;
                // @ts-ignore
                editProfileModal.close();
                reset();
              }}
              type="button"
              className="btn btn-primary flex bg-primary text-white hover:bg-white hover:text-primary hover:border-primary rounded border-primary join-item"
            >
              {jsonData.pageContent.modalContent.cancelButton}
            </button>
          </div>
        </form>
      </dialog>
    </>
  );
};
