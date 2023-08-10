"use client";
import { signup } from "@/data/signup/signup";
import React from "react";
import SignupForm from "@/components/signup/client/SignupForm";
import unAuthProtection from "@/components/HOC/unAuthProtection";

function Signup() {
  return (
    <main className="min-h-[calc(100vh-15.5rem)] py-7 flex flex-col items-center lg:justify-center">
      <h1 className="font-secondary text-4xl mt-10 lg:mt-2">{signup.title}</h1>
      <SignupForm />
    </main>
  );
}

export default unAuthProtection(Signup);
