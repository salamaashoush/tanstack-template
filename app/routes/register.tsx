import { createFileRoute, redirect } from "@tanstack/react-router";
import { RegisterForm } from "~/components/auth/RegisterForm";

export const Route = createFileRoute("/register")({
  beforeLoad: ({ context }) => {
    if (context.auth.isAuthenticated) {
      throw redirect({
        to: "/home",
      });
    }
  },
  component: RegisterPage,
});

export default function RegisterPage() {
  return <RegisterForm />;
}
