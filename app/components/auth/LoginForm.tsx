import { valibotResolver } from "@hookform/resolvers/valibot";
import { useMutation } from "@tanstack/react-query";
import { Link, useRouter } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
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
import type { LoginSchemaOutput } from "~/schema/auth";
import { loginSchema } from "~/schema/auth";
import { login } from "~/server/auth.server";

export function LoginForm() {
  const { t } = useTranslation();
  const router = useRouter();
  const { mutateAsync } = useMutation({
    mutationFn: login,
    mutationKey: ["user/login"],
    onSuccess: async () => {
      toast(t("auth.login.success.title"), {
        description: t("auth.login.success.message"),
      });
      await router.invalidate();
      router.navigate({ to: "/home" });
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
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("auth.login.form.email")}</FormLabel>
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
              <FormLabel>{t("auth.login.form.password")}</FormLabel>
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
        <Button type="submit">{t("auth.login.form.submit")}</Button>
        <Link href="/register"> {t("auth.login.form.createAccount")} </Link>
      </form>
    </Form>
  );
}
