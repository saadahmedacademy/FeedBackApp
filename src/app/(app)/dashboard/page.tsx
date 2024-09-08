"use client";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import { Message } from "@/model/User";
import { useSession } from "next-auth/react";
import { AcceptMessageSchema } from "@/schemas/acceptMessageSchema";
import { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";

import React, { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Loader2, RefreshCcw } from "lucide-react";
import MessageCard from "@/components/MessageCard";
import { User } from "next-auth";


function Dashboard() {


  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSwitching, setIsSwitching] = useState<boolean>(false);

  const { toast } = useToast();
  const { data: session } = useSession();

  // Your existing code to handle the session
  const user = session?.user as User;
  const username = user?.username || "Unknown User"; 

  const form = useForm<z.infer<typeof AcceptMessageSchema>>({
    resolver: zodResolver(AcceptMessageSchema),
  });

  const { watch, register, setValue } = form;
  const acceptMessages = watch("acceptMessages");

  const handleDeleteMessages = (messageId: string) => {
    setMessages(messages.filter((message) => message._id !== messageId));

  };

  const fetchAcceptMessages = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await axios.get<ApiResponse>("/api/accept-messages");
      setValue("acceptMessages", response.data.isAcceptingMessages ?? false);
    } catch (error) {
      const showError = error as AxiosError<ApiResponse>;
      toast({
        title: "Error",
        description:
          showError.response?.data.message || "Error while fetching messages",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [setValue, toast]);

  const fetchAllMessages = useCallback(
    async (refresh: boolean = false) => {
      setIsLoading(true);
      try {
        const response = await axios.get<ApiResponse>("/api/get-messages");
        setMessages(response.data.messages || []);
        if (refresh) {
          toast({
            title: "Refreshed Messages",
            description: "Messages refreshed successfully",
          });
        }
      } catch (error) {
        const showError = error as AxiosError<ApiResponse>;
        toast({
          title: "Error",
          description:
            showError.response?.data.message || "Error while fetching messages",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    },
    [toast]
  );

  useEffect(() => {
    if (!session || !session.user) return;

    fetchAcceptMessages();
    fetchAllMessages();
  }, [session, fetchAcceptMessages, fetchAllMessages]);

  const handleSwitchChange = async () => {
    setIsSwitching(true);
    try {
      const response = await axios.post<ApiResponse>("/api/accept-messages", {
        acceptMessages: !acceptMessages,
      });

      setValue("acceptMessages", !acceptMessages);

      if (response.data.success) {
        toast({
          title: "Success",
          description: response.data.message,
        });
      }
    } catch (error) {
      const showError = error as AxiosError<ApiResponse>;
      toast({
        title: "Error",
        description:
          showError.response?.data.message ||
          "Error while switching to accept the messages",
        variant: "destructive",
      });
    } finally {
      setIsSwitching(false);
    }
  };

  // if (session === undefined) {
  //   return (
  //     <div className="flex justify-center items-center h-screen bg-gray-100 text-black">
  //       <h1 className="text-2xl font-bold">Loading...</h1>
  //     </div>
  //   );
  // }

  // Handle the case where the user is not authenticated
  if (!session?.user) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100 text-black">
        <h1 className="text-2xl font-bold">
          Please login to access the dashboard
        </h1>
      </div>
    );
  }

  // Construct URL and other code logic
  const baseUrl = `${window.location.protocol}//${window.location.host}`;
  const profileUrl = `${baseUrl}/u/${username}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl);
    toast({
      title: "Copied",
      description: "Link copied to clipboard",
    });
  };

  return (
    <div className="my-8 mx-3 p-6 bg-white rounded shadow-lg max-w-6xl md:mx-8 lg:mx-auto">
      <h1 className="text-2xl md:text-4xl font-bold mb-4">User Dashboard</h1>

      <div className="mb-4">
        <h2 className="text-base md:text-lg font-semibold mb-2">
          Copy Your Unique Link
        </h2>
        <div className="flex flex-col md:flex-row items-start md:items-center">
          <input
            type="text"
            value={profileUrl}
            disabled
            className="input input-bordered w-full p-2 mb-2 md:mb-0 md:mr-2"
          />
          <Button className="w-full md:w-auto" onClick={copyToClipboard}>
            Copy
          </Button>
        </div>
      </div>

      <div className="mb-4">
        <Switch
          {...register("acceptMessages")}
          checked={acceptMessages}
          onCheckedChange={handleSwitchChange}
          disabled={isSwitching}
        />
        <span className="ml-2 text-sm md:text-base">
          Accept Messages: {acceptMessages ? "On" : "Off"}
        </span>
      </div>
      <Separator />

      <Button
        className="mt-4 w-full md:w-auto"
        variant="outline"
        onClick={(e) => {
          e.preventDefault();
          fetchAllMessages(true);
        }}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <RefreshCcw className="h-4 w-4" />
        )}
      </Button>

      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {messages.length > 0 ? (
          messages.map((message) => (
            <MessageCard
              key={message._id}
              message={message}
              onMessageDelete={handleDeleteMessages}
              username={username}
            />
          ))
        ) : (
<p className="text-center text-gray-500">No messages yet. Try refreshing or check back later!</p>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
