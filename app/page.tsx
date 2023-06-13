"use client";

import { FieldValues, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Error } from "@/components/ui/error";
import Link from "next/link";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/lib/auth-context";
import { HTTPException } from "@/types/api";
import { useRouter } from "next/navigation";

const SignInSchema = z.object({
  email: z.string().email(),
});

const Login = () => {
  const { toast } = useToast();
  const { login } = useAuth();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(SignInSchema),
  });

  const onSubmit = async (data: FieldValues) => {
    try {
      await login(data.email);
      router.push(`/home`);
    } catch (axiosErr: any) {
      const error = axiosErr?.response?.data as HTTPException;
      toast({
        title: "Unable to login",
        description: error.message,
        duration: 5000,
      });
    }
  };

  return (
    <div className="flex-1 flex flex-col justify-center items-center">
      <div className="w-72">
        <h1 className="text-2xl font-bold mb-4">Sign in</h1>
        <form onSubmit={handleSubmit((data) => onSubmit(data))}>
          <div className="pb-4">
            <Label htmlFor="email">Your email address</Label>
            <Input {...register("email")} />
            {errors.email && (
              <Error className="mt-2">{errors.email.message?.toString()}</Error>
            )}
          </div>
          <Button type="submit" className="w-full">
            Login
          </Button>
        </form>
        <div className="mt-4 text-center">
          <span className="text-xs text-primary/50">
            You don&apos;t have an account?{" "}
            <Link href="/sign-up" className="underline">
              Create one
            </Link>
          </span>
        </div>
      </div>
    </div>
  );
};

export default Login;
