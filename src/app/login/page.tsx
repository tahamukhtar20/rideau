"use client";
import { login } from "@/data/login/login";
import React from "react";
import LoginForm from "@/components/login/client/LoginForm";
import unAuthProtection from "@/components/HOC/unAuthProtection";

function Login() {
  return (
    <>
      <h1 className="font-secondary text-4xl mt-10 lg:mt-2">{login.title}</h1>
      <LoginForm />
    </>
  );
}

export default unAuthProtection(Login);
