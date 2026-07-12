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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import * as m from "~/i18n/messages";
import { registerSchema } from "~/schema/auth";
import { register } from "~/server/auth";

const PHONE_CODES = ["+1", "+20", "+44", "+91"];

export function SignUpForm() {
  const router = useRouter();
  const { mutateAsync } = useMutation({
    mutationFn: useServerFn(register),
    mutationKey: ["user/register"],
    onSuccess: async () => {
      toast(m.authSignUpSuccessTitle(), {
        description: m.authSignUpSuccessMessage(),
      });
      await router.invalidate();
      await router.navigate({ to: "/dashboard" });
    },
  });

  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      mobile: "",
      company: "",
      jobTitle: "",
      password: "",
      confirmPassword: "",
    },
    validators: { onSubmit: registerSchema },
    onSubmit: async ({ value }) => {
      await mutateAsync({ data: value });
    },
  });

  const handleSignIn = useCallback(() => {
    void router.navigate({ to: "/sign-in" });
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
                  {m.authSignUpFormEmail()}
                </FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  type="text"
                  inputMode="email"
                  autoComplete="email"
                  placeholder={m.authSignUpFormEmailPlaceholder()}
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

        <form.Field name="name">
          {(field) => {
            const invalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field data-invalid={invalid}>
                <FieldLabel htmlFor={field.name}>
                  {m.authSignUpFormName()}
                </FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  autoComplete="username"
                  placeholder={m.authSignUpFormNamePlaceholder()}
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

        <form.Field name="mobile">
          {(field) => {
            const invalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field data-invalid={invalid}>
                <FieldLabel htmlFor={field.name}>
                  {m.authSignUpFormMobile()}
                </FieldLabel>
                <div className="flex gap-2">
                  <Select defaultValue="+20">
                    <SelectTrigger
                      className="w-[90px]"
                      aria-label={m.authSignUpFormPhoneCode()}
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {PHONE_CODES.map((code) => (
                        <SelectItem key={code} value={code}>
                          {code}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    id={field.name}
                    name={field.name}
                    type="tel"
                    autoComplete="tel"
                    className="flex-1"
                    placeholder={m.authSignUpFormMobilePlaceholder()}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(event) => field.handleChange(event.target.value)}
                    aria-invalid={invalid}
                  />
                </div>
                {invalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        </form.Field>

        <form.Field name="company">
          {(field) => {
            const invalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field data-invalid={invalid}>
                <FieldLabel htmlFor={field.name}>
                  {m.authSignUpFormCompany()}
                </FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  type="text"
                  placeholder={m.authSignUpFormCompanyPlaceholder()}
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

        <form.Field name="jobTitle">
          {(field) => {
            const invalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field data-invalid={invalid}>
                <FieldLabel htmlFor={field.name}>
                  {m.authSignUpFormJobTitle()}
                </FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  type="text"
                  placeholder={m.authSignUpFormJobTitlePlaceholder()}
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
                  {m.authSignUpFormPassword()}
                </FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  type="password"
                  autoComplete="new-password"
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

        <form.Field name="confirmPassword">
          {(field) => {
            const invalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field data-invalid={invalid}>
                <FieldLabel htmlFor={field.name}>
                  {m.authSignUpFormConfirmPassword()}
                </FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  type="password"
                  autoComplete="new-password"
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

        <form.Subscribe selector={(state) => state.isSubmitting}>
          {(isSubmitting) => (
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting
                ? m.authSignUpFormSubmitting()
                : m.authSignUpFormSubmit()}
            </Button>
          )}
        </form.Subscribe>

        <p className="text-center text-sm text-muted-foreground">
          {m.authSignUpFormHaveAccount()}{" "}
          <Button
            type="button"
            variant="link"
            className="h-auto p-0 font-medium"
            onClick={handleSignIn}
          >
            {m.authSignUpFormSignIn()}
          </Button>
        </p>
      </FieldGroup>
    </form>
  );
}
