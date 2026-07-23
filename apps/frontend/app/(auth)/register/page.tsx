"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, AlertCircle, Loader2 } from "lucide-react";

import { registerAction } from "@/actions/auth.actions";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const registerSchema = z.object({
  username: z
    .string()
    .min(6, "Username must be at least 6 characters")
    .max(16, "Username cannot exceed 16 characters")
    .regex(
      /^[a-zA-Z0-9.-]+$/,
      "Username can only contain letters, numbers, dots, and dashes without spaces",
    )
    .toLowerCase(),
  email: z.string().email("Please enter a valid university email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["STUDENT", "ALUMNI", "ADMIN", "SUPER_ADMIN"]),
  universityId: z.string().optional(),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [serverError, setServerError] = useState<string | null>(null);

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      role: "STUDENT",
      universityId: "",
    },
  });

  const onSubmit = (data: RegisterFormValues) => {
    setServerError(null);
    startTransition(async () => {
      const result = await registerAction(data);
      if (!result.success) {
        setServerError(result.error || "Registration failed.");
        return;
      }
      router.push("/feed");
    });
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-muted/40 py-12">
      <Card className="w-full max-w-md shadow-lg border-border">
        <CardHeader className="space-y-1 items-center">
          <CardTitle className="uppercase text-2xl font-bold font-mono tracking-tighter">
            R3g1st3r Acc0unt
          </CardTitle>
          <CardDescription>Join the campus network</CardDescription>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="cicada3301"
                        disabled={isPending}
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
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="name@yourmail.com"
                        disabled={isPending}
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
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={isVisible ? "text" : "password"}
                          placeholder="••••••••"
                          disabled={isPending}
                          {...field}
                        />
                        <button
                          type="button"
                          onClick={() => setIsVisible(!isVisible)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground focus:outline-none"
                          disabled={isPending}
                        >
                          {isVisible ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Role</FormLabel>
                      <FormControl>
                        <select
                          disabled={isPending}
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 font-mono text-foreground"
                          {...field}
                        >
                          <option value="STUDENT">STUDENT</option>
                          <option value="ALUMNI">ALUMNI</option>
                        </select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="universityId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Student ID</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Optional"
                          disabled={isPending}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {serverError && (
                <div className="flex items-center gap-2 p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md">
                  <AlertCircle size={16} />
                  <p>{serverError}</p>
                </div>
              )}

              <Button
                type="submit"
                className="w-full font-mono uppercase tracking-widest mt-4"
                disabled={isPending}
              >
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  "Create Account"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>

        <CardFooter className="flex justify-center border-t border-border pt-4 mt-2">
          <div className="text-sm text-muted-foreground">
            Already in the system?{" "}
            <Link
              href="/login"
              className="text-primary hover:underline font-medium font-mono"
            >
              /login
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
