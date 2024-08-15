'use client'
import { useParams, useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import  { useForm } from 'react-hook-form'
import React from 'react'
import * as z from 'zod'
import { verifySchema } from '@/schemas/verifySchema';
import { useToast } from '@/components/ui/use-toast'
import axios, { AxiosError } from 'axios'
import { ApiResponse } from '@/types/ApiResponse'
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

function verifypage() {
 const router = useRouter();
 const params = useParams<{ username: string }>();
 const { toast } = useToast();

 
 const form = useForm<z.infer<typeof verifySchema>>({
  resolver: zodResolver(verifySchema),
});

const onSubmit = async (data : z.infer<typeof verifySchema>) => {
  try {

    const reponse = await axios.post('/api/verify-code' , {
      code : data.code,
      username : params.username
    });

    if(reponse.data.success) {
      toast({
        title: "Success",
        description: reponse.data.message,
      })

      router.push(`sign-in`);   
    }
    
  } catch (error) {
    console.error("Error during verificaton by code:", error);

    const axiosError = error as AxiosError<ApiResponse>;

    // Default error message
    let errorMessage = axiosError.response?.data.message ?? "Error during verification by code";

    toast({
      title: "Verification Failed",
      description: errorMessage,
      variant: "destructive",
    });

  }
}
  return (
    <div className="flex justify-center items-center min-h-screen bg-blue-700">
      <div className="w-full max-w-md p-8 bg-white rounded-lg space-y-2 shadow-lg ">

      <div className="text-center">
          <h1 className="font-extrabold tracking-tight lg:text-4xl my-6">
            Verify Your Account
          </h1>
          <p className="mb-4">Enter The Code Sent To Your Email</p>
        </div>

        <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="code"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Verification Code</FormLabel>
              <FormControl>
                <Input placeholder="Enter Your Code" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Send</Button>
      </form>
    </Form>
        
      </div>
    </div>
  )
}

export default verifypage