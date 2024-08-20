import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

import { Button } from "@/components/ui/button";
import React from "react";
import { X } from "lucide-react";
import { Message } from "@/model/User";
import { useToast } from "./ui/use-toast";
import axios from "axios";


interface MessageCardProps {
  message: Message;
  onMessageDelete: (messageId : string) => void
}
function MessageCard( { message , onMessageDelete} : MessageCardProps) {
 
  // To show notification
 const { toast } = useToast();

 const handleDeleteConfirm = async () => {
   const response = await axios.delete(`/api/delete_message/${message._id}`);

   if(response.data.success) {
    onMessageDelete(message._id);
    toast({
      title: "Success",
      description: response.data.message,
    });
   }  
   
 }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Card Title</CardTitle>

        <AlertDialog>
  <AlertDialogTrigger>
    <Button variant="destructive"><X className="h-4 w-4" /></Button>
  </AlertDialogTrigger>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
      <AlertDialogDescription>
        This action cannot be undone. This will permanently delete your message
        and remove it from our servers.
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Cancel</AlertDialogCancel>
      <AlertDialogAction onClick={handleDeleteConfirm}>Continue</AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>

        <CardDescription>Card Description</CardDescription>
      </CardHeader>
      <CardContent>
        
      </CardContent>
    </Card>
  );
}

export default MessageCard;
