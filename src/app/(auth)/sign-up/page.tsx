"use client";

import { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDebounceValue  } from "usehooks-ts";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormControl,
  FormDescription,
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

export default function SignUpForm() {
  const [username, setUsername] = useState("");
  const [usernameMessage, setUsernameMessage] = useState("");
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const debouncedUsername = useDebounceValue(username, 300);
  const [passwordShowToggle, setPasswordShowToggle] = useState(false);

  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    const checkUsernameUnique = async () => {
      if (debouncedUsername) {
        setIsCheckingUsername(true);
        setUsernameMessage(""); // Reset message
        try {
          const response = await axios.get<ApiResponse>(
            `/api/check-username-unique?username=${debouncedUsername}`
          );
          setUsernameMessage(response.data.message);
        } catch (error) {
          const axiosError = error as AxiosError<ApiResponse>;
          setUsernameMessage(
            axiosError.response?.data.message ?? "Error checking username"
          );
        } finally {
          setIsCheckingUsername(false);
        }
      }
    };
    checkUsernameUnique();
  }, [debouncedUsername]);

  // To show password
  const showPassword = () => {
    setPasswordShowToggle(!passwordShowToggle);
  }
    

  // To submit the form
  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post<ApiResponse>("/api/sign-up", data);

      toast({
        title: "Success",
        description: response.data.message,
      });

      router.replace(`/verify/${username}`);

      setIsSubmitting(false);
    } catch (error) {
      console.error("Error during sign-up:", error);

      const axiosError = error as AxiosError<ApiResponse>;

      // Default error message
      let errorMessage = axiosError.response?.data.message;
      ("There was a problem with your sign-up. Please try again.");

      toast({
        title: "Sign Up Failed",
        description: errorMessage,
        variant: "destructive",
      });

      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-blue-700">
      <div className="w-full max-w-md p-8 bg-white rounded-lg space-y-2 shadow-lg ">
        <div className="text-center">
          <h1 className="font-extrabold tracking-tight lg:text-4xl my-6">
            Join The Mystery Message App
          </h1>
          <p className="mb-4">Sign up to get started</p>
        </div>

        <div>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col space-y-4  "
            >
              <FormField
                name="username"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="ml-2">Username</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter Your Username" {...field}  onChange={(e) => { field.onChange(e.target.value)
                          setUsername(e.target.value)}}/>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

            <FormField
                name="email"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="ml-2">Email Address</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="Enter Your Email" {...field} />
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
                      <Input type={passwordShowToggle ? "text" : "password"} placeholder="Enter Your Password" {...field} />
                   <span className="text-2 text-[#333] absolute right-4 top-2 cursor-pointer" onClick={showPassword}>
                  {passwordShowToggle ? "Hide" : "Show"}
                  </span>
                  </div>
                   </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              /> 
              <Button type="submit" className="w-full" disabled={isSubmitting}>{
                isSubmitting ?( <>
                <Loader2 className="w-4 h-4 animate-spin" /> Please wait ...
                </> )
                : "Sign Up" } </Button>
            </form>
          </Form>
          <div className="text-center my-2">
            <p>Already have an account?{" "} 
              <Link href="/sign-in" className="text-blue-500">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
