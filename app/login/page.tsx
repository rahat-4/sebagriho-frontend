import { Metadata } from "next";

import LoginForm from "./_components/LoginForm";

export const metadata: Metadata = {
  title: "Login | Sebagriho",
  description: "Login to your Sebagriho account",
};

export default function LoginPage() {
  return <LoginForm />;
}
