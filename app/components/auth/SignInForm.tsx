import { useCallback } from "react";
import { valibotResolver } from "@hookform/resolvers/valibot";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import type { LoginSchemaOutput } from "~/schema/auth";
import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import * as m from "~/i18n/messages";
import { loginSchema } from "~/schema/auth";
import { login } from "~/server/auth.server";

export function SignInForm() {
  const router = useRouter();
  const { mutateAsync } = useMutation({
    mutationFn: login,
    mutationKey: ["user/login"],
    onSuccess: async () => {
      toast(m.authSignInSuccessTitle(), {
        description: m.authSignInSuccessMessage(),
      });
      await router.invalidate();
      router.navigate({ to: "/dashboard" });
    },
  });

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: valibotResolver(loginSchema),
  });

  const onSubmit = async (data: LoginSchemaOutput) => {
    await mutateAsync(data);
  };
  const isSubmitting = form.formState.isSubmitting;
  const handleSignUp = useCallback(() => {
    router.navigate({ to: "/sign-up" });
  }, [router]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-foreground">
                {m.authSignInFormEmail()}
              </FormLabel>
              <FormControl>
                <Input
                  type="email"
                  className="border-border bg-muted/50 text-foreground placeholder:text-neutral-600"
                  placeholder="Enter your email"
                  autoComplete="username"
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-sm text-destructive" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{m.authSignInFormPassword()}</FormLabel>
              <FormControl>
                <Input
                  className="border-border bg-muted/50 text-foreground placeholder:text-neutral-600"
                  type="password"
                  placeholder="••••••••"
                  autoComplete="current-password"
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-sm text-destructive" />
            </FormItem>
          )}
        />
        <div className="text-left">
          <Button
            variant="link"
            className="h-auto p-0 font-medium text-muted-foreground hover:text-foreground"
          >
            {m.authSignInFormForgotPassword()}
          </Button>
        </div>
        <Button
          type="submit"
          className="w-full bg-[#FF5B5B] font-medium text-foreground hover:bg-[#FF4D4D]"
          disabled={isSubmitting}
        >
          {isSubmitting
            ? m.authSignInFormSubmitting()
            : m.authSignInFormSubmit()}
        </Button>

        <p className="text-center text-sm text-muted-foreground">
          {m.authSignInFormCreateAccount()}{" "}
          <Button
            type="button"
            variant="link"
            className="h-auto p-0 font-normal text-[#FF5B5B]"
            onClick={handleSignUp}
          >
            {m.authSignInFormSignUp()}
          </Button>
        </p>
      </form>
    </Form>
  );
}
