import { signup } from "@/data/signup/signup";
import React from "react";
import SignupForm from "@/components/signup/client/SignupForm";

export default function Signup() {
  return (
    <main className="min-h-[calc(100vh-3.5rem)] flex flex-col items-center lg:justify-center">
      <h1 className="font-secondary text-4xl mt-10 lg:mt-2">{signup.title}</h1>
      <SignupForm />
    </main>
  );
}
