"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { ConfirmedPasswordEmailSignUpSchema } from "@/schemas";
import type { ConfirmedPasswordEmailSignUpSchemaType } from "@/schemas";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { Lock, Mail, Loader } from "lucide-react";
import { Chip } from "@/components/chip";
import { Checkbox } from "@/components/ui/checkbox";
import { api } from "@/trpc/react";
import { env } from "@/env";

export default function SignUp() {
  const utils = api.useUtils();

  const signUp = api.apps.signup.email_password.useMutation({
    onSuccess: async () => {
      await utils.apps.invalidate();
      console.log("success");
    },
    onError: (error) => console.log(error.message),
  });

  const form = useForm<ConfirmedPasswordEmailSignUpSchemaType>({
    resolver: zodResolver(ConfirmedPasswordEmailSignUpSchema),
    defaultValues: {
      publicKey: env.NEXT_PUBLIC_APPLICATION_PUBLIC_KEY,
    },
  });

  const onSubmit = async (values: ConfirmedPasswordEmailSignUpSchemaType) =>
    signUp.mutate(values);

  return (
    <main className="mx-auto flex h-screen max-w-screen-2xl gap-4 p-4">
      <div className="prose flex flex-1 items-center justify-center rounded-lg">
        <div>
          <h2>Streamline authentication</h2>
          <p>
            Get authentication working quick, fast and easy in your applications
          </p>
          <Chip className="w-fit border-orange-600 bg-orange-50 text-orange-600">
            Insert cool authentication components here
          </Chip>
        </div>
      </div>
      <div className="prose flex flex-1 items-center justify-center">
        <div>
          <h1>Register</h1>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit, (e) => console.log(e))}
              className="grid max-w-sm grid-cols-2 gap-4"
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input disabled={signUp.isPending} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="surname"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Surname</FormLabel>
                    <FormControl>
                      <Input disabled={signUp.isPending} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input disabled={signUp.isPending} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>
                      <Mail className="inline" size={14} /> Email
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled={signUp.isPending}
                        type="email"
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
                  <FormItem className="col-span-2">
                    <FormLabel>
                      <Lock className="inline" size={14} /> Password
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled={signUp.isPending}
                        type="password"
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
                  <FormItem className="col-span-2">
                    <FormLabel>
                      <Lock className="inline" size={14} /> Password
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled={signUp.isPending}
                        type="password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="termsAndConditions"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <div className="flex gap-1">
                      <FormControl>
                        <Checkbox
                          disabled={signUp.isPending}
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <Label htmlFor="terms">
                        <Link href="/terms-and-conditions">
                          Accept terms and conditions
                        </Link>
                      </Label>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button className="col-span-2" disabled={signUp.isPending}>
                {signUp.isPending ? (
                  <Loader className="animate-spin" />
                ) : (
                  "Register"
                )}
              </Button>
            </form>
          </Form>
          <p className="text-sm text-slate-500">
            Already have an account? <Link href="/">Login here.</Link>
          </p>
        </div>
      </div>
    </main>
  );
}
