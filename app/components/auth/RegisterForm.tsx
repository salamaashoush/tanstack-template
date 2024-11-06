import { valibotResolver } from "@hookform/resolvers/valibot";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import type { RegisterSchemaOutput } from "~/schema/auth";
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
import { registerSchema } from "~/schema/auth";
import { register } from "~/server/auth.server";

export function RegisterForm() {
  const { t } = useTranslation();
  const router = useRouter();
  const { mutateAsync } = useMutation({
    mutationFn: register,
    mutationKey: ["user/register"],
    onSuccess: async () => {
      toast(t("auth.register.success.title"), {
        description: t("auth.register.success.message"),
      });
      await router.invalidate();
      router.navigate({ to: "/home" });
    },
  });

  const form = useForm({
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    resolver: valibotResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterSchemaOutput) => {
    await mutateAsync(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("auth.register.form.username")}</FormLabel>
              <FormControl>
                <Input
                  placeholder="Your username"
                  autoComplete="username"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("auth.register.form.email")}</FormLabel>
              <FormControl>
                <Input
                  placeholder="email@provider.com"
                  autoComplete="username"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("auth.register.form.password")}</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  autoComplete="current-password"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("auth.register.form.confirmPassword")}</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  autoComplete="current-password"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">{t("auth.register.form.submit")}</Button>
      </form>
    </Form>
  );
}
