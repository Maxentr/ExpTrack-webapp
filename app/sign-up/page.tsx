"use client";

import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Error } from "@/components/ui/error";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios, { HttpStatusCode } from "axios";
import { useToast } from "@/components/ui/use-toast";

const schema = z.object({
  email: z.string().email(),
  lastName: z.string().min(2).max(50),
  firstName: z.string().min(2).max(50),
});

const SignUp = () => {
  const router = useRouter();
  const { toast } = useToast();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FieldValues) => {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/v1/users`,
      data,
    );

    if (response.status === HttpStatusCode.Created) {
      toast({
        title: "Account created",
        description:
          "Your account has been created. You can now login with your email",
        duration: 5000,
      });
      router.push("/");
    } else {
      console.log(response.data);
    }
  };

  return (
    <div className="flex-1 flex flex-col justify-center items-center">
      <div className="w-72">
        <h1 className="text-2xl font-bold mb-4">Sign up</h1>
        <form onSubmit={handleSubmit((data) => onSubmit(data))}>
          <div className="pb-2">
            <Label htmlFor="email">Your email address</Label>
            <Input {...register("email")} />
            {errors.email && (
              <Error className="mt-2">{errors.email.message?.toString()}</Error>
            )}
          </div>
          <div className="pb-2">
            <Label htmlFor="lastName">Your last name</Label>
            <Input {...register("lastName")} />
            {errors.lastName && (
              <Error className="mt-2">
                {errors.lastName.message?.toString()}
              </Error>
            )}
          </div>
          <div className="pb-6">
            <Label htmlFor="firstName">Your first name</Label>
            <Input {...register("firstName")} />
            {errors.firstName && (
              <Error className="mt-2">
                {errors.firstName.message?.toString()}
              </Error>
            )}
          </div>

          <Button type="submit" className="w-full">
            Create account
          </Button>
        </form>
        <div className="mt-4 text-center">
          <span className="text-xs text-primary/50">
            Already have an account?{" "}
            <Link href="/" className="underline">
              Login
            </Link>
          </span>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
