import { useCallback } from "react";
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
import * as m from "~/i18n/messages";
import { registerSchema } from "~/schema/auth";
import { register } from "~/server/auth.server";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

export function SignUpForm() {
  const router = useRouter();
  const { mutateAsync } = useMutation({
    mutationFn: register,
    mutationKey: ["user/register"],
    onSuccess: async () => {
      toast(m.authSignUpSuccessTitle(), {
        description: m.authSignUpSuccessMessage(),
      });
      await router.invalidate();
      router.navigate({ to: "/dashboard" });
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
    resolver: valibotResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterSchemaOutput) => {
    await mutateAsync(data);
  };

  const isSubmitting = form.formState.isSubmitting;
  const handleSignIn = useCallback(() => {
    router.navigate({ to: "/sign-in" });
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
                {m.authSignUpFormEmail()}
              </FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder={m.authSignUpFormEmailPlaceholder()}
                  autoComplete="email"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-foreground">
                {m.authSignUpFormName()}
              </FormLabel>
              <FormControl>
                <Input
                  placeholder={m.authSignUpFormNamePlaceholder()}
                  className="border-border bg-muted/50 text-foreground placeholder:text-neutral-600"
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
          name="mobile"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-foreground" htmlFor="mobile">
                {m.authSignUpFormMobile()}
              </FormLabel>
              <div className="flex gap-2">
                <FormControl>
                  <Select defaultValue="+20">
                    <SelectTrigger className="w-[80px] border-border bg-muted/50 text-foreground">
                      <SelectValue placeholder={m.authSignUpFormPhoneCode()} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="+1">+1</SelectItem>
                      <SelectItem value="+20">+20</SelectItem>
                      <SelectItem value="+44">+44</SelectItem>
                      <SelectItem value="+91">+91</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormControl>
                  <div className="flex-1">
                    <Input
                      id="mobile"
                      type="tel"
                      placeholder={m.authSignUpFormMobilePlaceholder()}
                      className="border-border bg-muted/50 text-foreground placeholder:text-neutral-600"
                      autoComplete="tel"
                      {...field}
                    />
                    <FormMessage className="mt-1 text-sm text-destructive" />
                  </div>
                </FormControl>
              </div>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="company"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-foreground">
                {m.authSignUpFormCompany()}
              </FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder={m.authSignUpFormCompanyPlaceholder()}
                  className="border-border bg-muted/50 text-foreground placeholder:text-neutral-600"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="jobTitle"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-foreground">
                {m.authSignUpFormJobTitle()}
              </FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder={m.authSignUpFormJobTitlePlaceholder()}
                  className="border-border bg-muted/50 text-foreground placeholder:text-neutral-600"
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
              <FormLabel className="text-foreground">
                {m.authSignUpFormPassword()}
              </FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="••••••••"
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
              <FormLabel className="text-foreground">
                {m.authSignUpFormConfirmPassword()}
              </FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="••••••••"
                  autoComplete="current-password"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="w-full bg-[#FF5B5B] font-medium text-foreground hover:bg-[#FF4D4D]"
          disabled={isSubmitting}
        >
          {isSubmitting
            ? m.authSignUpFormSubmitting()
            : m.authSignUpFormSubmit()}
        </Button>

        <p className="text-center text-sm text-muted-foreground">
          {m.authSignUpFormHaveAccount()}{" "}
          <Button
            type="button"
            variant="link"
            className="h-auto p-0 font-medium text-[#FF5B5B]"
            onClick={handleSignIn}
          >
            {m.authSignUpFormSignIn()}
          </Button>
        </p>
      </form>
    </Form>
  );
}
