"use client";

import { TiTick } from "react-icons/ti";
import { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDebounceCallback } from 'usehooks-ts'
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import axios, { AxiosError } from "axios";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { signUpSchema } from "@/schemas/signUpSchema";
import Email from "next-auth/providers/email";
import { signInSchema } from "@/schemas/signInSchema";
import { signIn } from "next-auth/react";

export default function SignUpForm() {

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [passwordShowToggle, setPasswordShowToggle] = useState(false);

  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });


  // To password show and hide toggle
  const showPassword = () => {
    setPasswordShowToggle(!passwordShowToggle);
  };


  // to handle the auth sign in credentials
  const onSubmit = async (data : z.infer<typeof signInSchema>) => {
    setIsSubmitting(true);
    try {
      const authSignIn = await signIn("credentials", {
        redirect : false,
        identifier : data.identifier,
        password : data.password
      })

      if(authSignIn?.error) {

        toast({
          title: "Error",
          description: authSignIn?.error,
          variant: "destructive",
        })
      }

      if(authSignIn?.url){
        router.replace('/dashboard')
      }

    } catch (error) {
      console.log(`Somthing went wrong during sign-in: ${error}`);
    }finally{
      setIsSubmitting(false);
    }
  }

  
  return (
    <div className="flex justify-center items-center min-h-screen bg-blue-700">
      <div className="lg:w-full sm:max-w-md p-8 bg-white rounded-lg space-y-2 shadow-lg ">
        <div className="text-center">
          <p className="mb-4">Sign In to get started</p>
        </div>

        <div>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col space-y-3"
            >
            
              <FormField
                name="identifier"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="ml-2">Email Address</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="Enter Your Email"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="password"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="ml-2">Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={passwordShowToggle ? "text" : "password"}
                          placeholder="Enter Your Password"
                          {...field}
                        />
                        <span
                          className="text-2 text-[#333] absolute right-4 top-2 cursor-pointer"
                          onClick={showPassword}
                        >
                          {passwordShowToggle ? "Hide" : "Show"}
                        </span>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Please wait ...
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>
          </Form>
          <div className="text-center my-2">
            <p>
              If you don't have an account?{" "}
              <Link href="/sign-up" className="text-blue-500">
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
