"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { useAppDispatch } from "@/providers/toolkit/hooks/hooks";
import { registerUser } from "@/providers/toolkit/features/RegisterUserSlice";

import TestUser from "../(pages)/login/Testuser";

interface AuthForm {
  name?: string;
  email: string;
  password: string;
}

export default function RegisterLoginUser() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const { toast } = useToast();
  const dispatch = useAppDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<AuthForm>();

  const onSubmit = async (data: AuthForm) => {
    setIsLoading(true);

    if (isLogin) {
      const res = await signIn("credentials", {
        redirect: false,
        email: data.email,
        password: data.password,
      });

      if (res?.error) {
        toast({
          title: "Login failed",
          description: res.error,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Welcome back 🌱",
          description: "Logged in successfully",
        });
        router.push("/");
      }
    } else {
      try {
        if (!data.name) {
          throw new Error("Name is required");
        }

        await dispatch(
          registerUser({
            name: data.name,
            email: data.email,
            password: data.password,
          })
        ).unwrap();

        toast({
          title: "Account created",
          description: "Please login to continue",
        });

        reset();
        setIsLogin(true);
      } catch (error) {
        toast({
          title: "Registration failed",
          description: error instanceof Error ? error.message : "Try again",
          variant: "destructive",
        });
      }
    }

    setIsLoading(false);
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-background p-4">
      {/* Background gradient */}
      <div
        className="
          absolute inset-0 -z-10
          bg-linear-to-br
          from-green-50/70 via-transparent to-emerald-100/40
          dark:from-green-950/40 dark:to-emerald-900/30
        "
      />

      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="space-y-2 text-center">
          <span
            className="
              inline-block mx-auto rounded-full px-4 py-1 text-sm font-medium
              bg-green-200 text-green-700
              dark:bg-green-900 dark:text-green-300
            "
          >
            Harsh Enterprises
          </span>

          <h1 className="text-2xl font-extrabold">
            {isLogin ? "Welcome Back" : "Create an Account"}
          </h1>

          <p className="text-sm text-muted-foreground">
            {isLogin
              ? "Login to continue growing with us"
              : "Join us for premium agricultural products"}
          </p>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {!isLogin && (
              <div className="space-y-1">
                <Label>Name</Label>
                <Input
                  placeholder="Your full name"
                  {...register("name", { required: !isLogin })}
                />
                {errors.name && (
                  <p className="text-xs text-red-500">Name is required</p>
                )}
              </div>
            )}

            <div className="space-y-1">
              <Label>Email</Label>
              <Input
                type="email"
                placeholder="you@example.com"
                {...register("email", { required: true })}
              />
              {errors.email && (
                <p className="text-xs text-red-500">Valid email required</p>
              )}
            </div>

            <div className="space-y-1 relative">
              <Label>Password</Label>
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                {...register("password", { required: true, minLength: 8 })}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-9 text-muted-foreground"
              >
                {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
              </button>
              {errors.password && (
                <p className="text-xs text-red-500">
                  Password must be at least 8 characters
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700"
              disabled={isLoading}
            >
              {isLoading
                ? "Please wait..."
                : isLogin
                ? "Login"
                : "Create Account"}
            </Button>

            <p className="text-sm text-center text-muted-foreground">
              {isLogin ? "New here?" : "Already have an account?"}{" "}
              <span
                onClick={() => setIsLogin(!isLogin)}
                className="text-green-600 cursor-pointer font-medium"
              >
                {isLogin ? "Sign up" : "Login"}
              </span>
            </p>

            <TestUser />
          </form>
        </CardContent>
      </Card>
    </section>
  );
}
