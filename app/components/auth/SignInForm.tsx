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
import { useTranslation } from "~/i18n/client";
import { loginSchema } from "~/schema/auth";
import { login } from "~/server/auth.server";

export function SignInForm() {
  const { t } = useTranslation();
  const router = useRouter();
  const { mutateAsync } = useMutation({
    mutationFn: login,
    mutationKey: ["user/login"],
    onSuccess: async () => {
      toast(t("auth.signIn.success.title"), {
        description: t("auth.signIn.success.message"),
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
                {t("auth.signIn.form.email")}
              </FormLabel>
              <FormControl>
                <Input
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
              <FormLabel>{t("auth.signIn.form.password")}</FormLabel>
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
            {t("auth.signIn.form.forgotPassword")}
          </Button>
        </div>
        <Button
          type="submit"
          className="w-full bg-[#FF5B5B] font-medium text-foreground hover:bg-[#FF4D4D]"
          disabled={isSubmitting}
        >
          {isSubmitting
            ? t("auth.signIn.form.submitting")
            : t("auth.signIn.form.submit")}
        </Button>

        <p className="text-center text-sm text-muted-foreground">
          {t("auth.signIn.form.createAccount")}{" "}
          <Button
            variant="link"
            className="h-auto p-0 font-normal text-[#FF5B5B]"
            onClick={handleSignUp}
          >
            {t("auth.signIn.form.signUp")}
          </Button>
        </p>
      </form>
    </Form>
  );
}
