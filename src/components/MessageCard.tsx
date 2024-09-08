import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { Message } from "@/model/User";
import { useToast } from "./ui/use-toast";
import axios from "axios";
import { ApiResponse } from "@/types/ApiResponse";

interface MessageCardProps {
  message: Message;
  onMessageDelete: (messageId: string) => void;
  username?: string;  // Make username optional
}

const MessageCard: React.FC<MessageCardProps> = ({ message, onMessageDelete, username }) => {
  const { toast } = useToast();

  const handleDeleteConfirm = async () => {
    const response = await axios.delete<ApiResponse>(
      `/api/delete-message/${message._id}`
    );
    console.log(response.data);
    if (response.data.success) {
      onMessageDelete(message._id);
      toast({
        title: "Success",
        description: response.data.message,
      });
    }
  };

  return (
    <Card className='px-5 py-4'>
      <CardHeader>
        <CardTitle>{username || "Anonymous"}</CardTitle>  {/* Handle undefined username */}
        <AlertDialog>
          <AlertDialogTrigger>
            <Button variant="destructive"><X className="h-2 w-2" /></Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your message and remove it from our servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteConfirm}>Continue</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        <CardDescription>{message.content}</CardDescription>
      </CardHeader>
      <CardContent>
      </CardContent>
    </Card>
  );
};

export default MessageCard;
