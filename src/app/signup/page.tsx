"use client";
import { signup } from "@/data/signup/signup";
import React from "react";
import SignupForm from "@/components/signup/client/SignupForm";
import unAuthProtection from "@/components/HOC/unAuthProtection";

function Signup() {
  return (
    <>
      <h1 className="font-secondary text-4xl mt-10 lg:mt-2">{signup.title}</h1>
      <SignupForm />
    </>
  );
}

export default unAuthProtection(Signup);
