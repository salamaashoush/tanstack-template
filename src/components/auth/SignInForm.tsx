import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useCallback } from "react";
import { toast } from "sonner";

import { Button } from "~/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "~/components/ui/field";
import { Input } from "~/components/ui/input";
import * as m from "~/i18n/messages";
import { loginSchema } from "~/schema/auth";
import { login } from "~/server/auth";

export function SignInForm() {
  const router = useRouter();
  const { mutateAsync } = useMutation({
    mutationFn: useServerFn(login),
    mutationKey: ["user/login"],
    onSuccess: async () => {
      toast(m.authSignInSuccessTitle(), {
        description: m.authSignInSuccessMessage(),
      });
      await router.invalidate();
      await router.navigate({ to: "/dashboard" });
    },
  });

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    // valibot implements Standard Schema, so the schema is accepted directly --
    // no @hookform/resolvers-style adapter package.
    validators: { onSubmit: loginSchema },
    onSubmit: async ({ value }) => {
      await mutateAsync({ data: value });
    },
  });

  const handleSignUp = useCallback(() => {
    void router.navigate({ to: "/sign-up" });
  }, [router]);

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        void form.handleSubmit();
      }}
    >
      <FieldGroup>
        <form.Field name="email">
          {(field) => {
            const invalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field data-invalid={invalid}>
                <FieldLabel htmlFor={field.name}>
                  {m.authSignInFormEmail()}
                </FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  type="text"
                  inputMode="email"
                  autoComplete="username"
                  placeholder="Enter your email"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(event) => field.handleChange(event.target.value)}
                  aria-invalid={invalid}
                />
                {invalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        </form.Field>

        <form.Field name="password">
          {(field) => {
            const invalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field data-invalid={invalid}>
                <FieldLabel htmlFor={field.name}>
                  {m.authSignInFormPassword()}
                </FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  type="password"
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(event) => field.handleChange(event.target.value)}
                  aria-invalid={invalid}
                />
                {invalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        </form.Field>

        <div className="text-start">
          <Button
            type="button"
            variant="link"
            className="h-auto p-0 font-medium text-muted-foreground hover:text-foreground"
          >
            {m.authSignInFormForgotPassword()}
          </Button>
        </div>

        <form.Subscribe selector={(state) => state.isSubmitting}>
          {(isSubmitting) => (
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting
                ? m.authSignInFormSubmitting()
                : m.authSignInFormSubmit()}
            </Button>
          )}
        </form.Subscribe>

        <p className="text-center text-sm text-muted-foreground">
          {m.authSignInFormCreateAccount()}{" "}
          <Button
            type="button"
            variant="link"
            className="h-auto p-0 font-normal"
            onClick={handleSignUp}
          >
            {m.authSignInFormSignUp()}
          </Button>
        </p>
      </FieldGroup>
    </form>
  );
}
