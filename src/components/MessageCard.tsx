"use client";
import {
  Card,
  CardContent,
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
} from "@/components/ui/alert-dialog";
import { Message } from "@/model/User";
import { useToast } from "./ui/use-toast";
import axios from "axios";
import { ApiResponse } from "@/types/ApiResponse";

interface MessageCardProps {
  message: Message;
  onMessageDelete: (messageId: string) => void;
  onEditMessage: (content: string) => void;
  username?: string;
}

const MessageCard: React.FC<MessageCardProps> = ({
  message,
  onMessageDelete,
  onEditMessage,
  username,
}) => {
  const { toast } = useToast();

  const handleDeleteConfirm = async () => {
    try {
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
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete the message.",
      });
    }
  };

  const handleEditClick = () => {
    onEditMessage(message.content);
  };

  return (
    <Card className="px-5 py-4">
      <CardHeader className="flex flex-col justify-center gap-2">
        <CardTitle>{username || "Anonymous"}</CardTitle> {/* Handle undefined username */}
      </CardHeader>
      <CardContent className="flex justify-center gap-2 items-center">
        {message.content}
      </CardContent>
      <CardFooter className="flex space-x-2 mt-2">
        <button className="px-4 py-2 bg-green-600  rounded-sm text-white" onClick={handleEditClick}>
          Edit 
        </button>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <button className="px-4 py-2 rounded-sm bg-red-500 text-white">Delete</button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your
                message and remove it from our servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteConfirm}>
                Continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardFooter>
    </Card>
  );
};

export default MessageCard;
