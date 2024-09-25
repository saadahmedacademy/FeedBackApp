"use client";
import { useToast } from "@/components/ui/use-toast";
import { ApiResponse } from "@/types/ApiResponse";
import axios, { AxiosError } from "axios";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export const ProfilePage  = () => {
  const [allowMessage, setAllowMessage] = useState<boolean>(false);
  const [content, setContent] = useState<string>("");
  const [isSending, setIsSending] = useState<boolean>(false);
  const [suggestedMessages, setSuggestedMessages] = useState<string[]>(["message1","message2","message3"])
  const { username } = useParams();
  const router = useRouter();
  const { toast } = useToast();


  // To allow message to sent to the user
  const handleAllowMessage = async () => {
    try {
      const response = await axios.get<ApiResponse>("/api/accept-messages");

      if (response.data.isAcceptingMessages) {
        setAllowMessage(true);
        toast({
          title: "Success",
          description: response.data.message || "You can send messages",
        });
      } else {
        setAllowMessage(false);
        toast({
          title: "Error",
          description: response.data.message || "You can't send messages",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again later.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    handleAllowMessage();
  }, []);

  // To send message to the user
  const sendMessage = async () => {
    setIsSending(true);
    try {
      const response = await axios.post<ApiResponse>("/api/send-message", {
        username,
        content,
      });
      setContent("");

      if (response.data.success) {
        toast({
          title: "Success",
          description: response.data.message || "Message sent successfully",
        });
        router.push(`/dashboard`);

      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };


  
   // To get the message for edit
   useEffect(() => {
    const fetchContentAndPermissions = async () => {
      try {
        const [contentResponse, permissionResponse] = await Promise.all([
          axios.get(`/api/save-message-content`),
          axios.get<ApiResponse>("/api/accept-messages")
        ]);

        // Set fetched content
        setContent(contentResponse.data.content || "");

        // Check message permissions
        if (permissionResponse.data.isAcceptingMessages) {
          setAllowMessage(true);
          toast({
            title: "Success",
            description: permissionResponse.data.message || "You can send messages",
          });
        } else {
          setAllowMessage(false);
          toast({
            title: "Error",
            description: permissionResponse.data.message || "You can't send messages",
            variant: "destructive",
          });
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Unable to load data.",
          variant: "destructive",
        });
      }
    };

    fetchContentAndPermissions();
  }, [username, toast]);

  // To suggest messages 
  // To suggest messages
const suggestNewMessages = async () => {
  try {
    const response = await axios.post("/api/suggest-messages");

    // Set the suggested messages state with the returned array
    setSuggestedMessages(response.data.suggestions || []);
    
    toast({
      title: "Success",
      description: "New messages suggested successfully.",
    });
  } catch (error) {
    const showError = error as AxiosError<ApiResponse>;

    toast({
      title: "Error",
      description: showError.response?.data.message || "Something went wrong. Please try again later.",
      variant: "destructive",
    });
  }
};


  return (
    <div className="min-w-full min-h-screen bg-blue-600 text-white">
      <div className="container mx-auto py-6">
        <h1 className="text-3xl">Public Profile Link</h1>
      </div>

      <div className="container mx-auto flex flex-col items-center gap-3">
        <h3>Send Anonymous Message to @{username}</h3>
        <input
          type="text"
          className="sm:px-10 w-[90%] text-black px-5 rounded-lg shadow-lg py-4"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />{" "}

        <button
          onClick={sendMessage}
          style={{ opacity: allowMessage ? 1 : 0.5 }}
          className="lg:px-10 px-5 py-2 rounded-md bg-black text-white w-max"
          disabled={!allowMessage} // Fix the disabled logic
        >
          {isSending ? "Sending..." : "Send"}
        </button>
      </div>

      <div className="container md:ml-24 py-4 md:px-7 flex flex-col space-y-2 items-start">
        <button onClick={suggestNewMessages} className="rounded-md py-2 px-4 bg-black text-white w-max">
  Suggest Messages
</button>
        <h3>Select any message to send</h3>

        <section className=" w-[85%] flex flex-col space-y-3 py-3 px-3 bg-white text-black rounded-lg shadow-lg ">
  <h3>Suggested Messages</h3>
  <div className="flex flex-col space-y-1 scroll-y-auto">
    {suggestedMessages.map((item, index) => (
      <p
        key={index}
        onClick={() => setContent(item)}
        className="text-md border-b-2 border-gray-200 pb-1 cursor-pointer"
      >
        {item}
      </p>
    ))}
  </div>
</section>

      </div>
    </div>
  );
};

export default ProfilePage;
