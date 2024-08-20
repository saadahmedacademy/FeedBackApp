"use clinet"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/components/ui/use-toast";
import { Message } from "@/model/User";
import { AcceptMessageSchema } from "@/schemas/acceptMessageSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";


import React, { useCallback, useState } from 'react'
import { useForm } from "react-hook-form";
import { z } from "zod";

function Dashboard() {

  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSwitching, setIsSwitching] = useState<boolean>(false);

  // To show notification
  const { toast } = useToast();

  // To delete the messages from ui 
  const handleDeleteMessages  = (messagesId : string ) => {
    setMessages(messages.filter(message => message._id !== messagesId));
    
    
    const form = useForm<z.infer<typeof AcceptMessageSchema>>({
      resolver : zodResolver(AcceptMessageSchema)
    })
 

    // destructure some form methods
    const { watch , register , setValue  } = form;

    // now tell the watch method which field should it watch
    const acceptMessages = watch('acceptMessages');
    
    const fetchAcceptMessages = useCallback(async () => {
      setIsLoading(true);
      try {
        const response = await axios.get('/api/accept-messages');
        setValue('acceptMessages', response.data.isAcceptingMessages);

      } catch (error) {
        
      }
    }, [setValue]);
  }
  return (
    
    <div>
      
    </div>
  )
}

export default Dashboard