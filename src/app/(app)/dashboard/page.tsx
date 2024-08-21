"use clinet"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/components/ui/use-toast";
import { Message } from "@/model/User";
import { AcceptMessageSchema } from "@/schemas/acceptMessageSchema";
import { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";


import React, { useCallback, useState } from 'react'
import { useForm } from "react-hook-form";
import { z } from "zod";

function Dashboard() {

  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSwitching, setIsSwitching] = useState<boolean>(false);

  const { toast } = useToast();

  const handleDeleteMessages = (messagesId: string) => {
    setMessages(messages.filter(message => message._id !== messagesId));
  }

  const form = useForm<z.infer<typeof AcceptMessageSchema>>({
    resolver: zodResolver(AcceptMessageSchema)
  });

  const { watch, register, setValue } = form;
  const acceptMessages = watch('acceptMessages');

  const fetchSingleMessage = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await axios.get<ApiResponse>('/api/accept-messages');
      setValue('acceptMessages', response.data.isAcceptingMessages ?? false);
    } catch (error) {
      const showError = error as AxiosError<ApiResponse>;
      toast({
        title: "Error",
        description: showError.response?.data.message || "Error while fetching messages",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, [setValue, toast]);

  const fetchAllMessages = useCallback(async (refresh: boolean = false) => {
    setIsLoading(true);
    setIsSwitching(false);
    try {
      const response = await axios.get<ApiResponse>('/api/get-messages');
      setMessages(response.data.messages || []);
      if (refresh) {
        toast({
          title: "Refreshed Messages",
          description: "Messages refreshed successfully"
        });
      }
    } catch (error) {
      const showError = error as AxiosError<ApiResponse>;
      toast({
        title: "Error",
        description: showError.response?.data.message || "Error while fetching messages",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
      setIsSwitching(false);
    }
  }, [toast]);

  return (
   
    <div>
      
    </div>
  )
}

export default Dashboard;