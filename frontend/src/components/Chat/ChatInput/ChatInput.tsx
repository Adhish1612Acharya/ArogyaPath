import React, { FC, useState } from "react";
import { Paper, InputBase, IconButton } from "@mui/material";
import { Send } from "lucide-react";
import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { ChatInputProps } from "./ChatInput.types";
import useSocket from "@/hooks/useSocket/useSocket";

const sendMessageInputSchema = z.object({
  msg: z.string().min(1),
});

export const ChatInput: FC<ChatInputProps> = ({ chatId, currUser }) => {
  // const { socket } = useSocket(chatId, currUser);
  const form = useForm<z.infer<typeof sendMessageInputSchema>>({
    resolver: zodResolver(sendMessageInputSchema),
    defaultValues: {
      msg: "",
    },
  });

  const handleSubmits = async (
    data: z.infer<typeof sendMessageInputSchema>
  ) => {
    // console.log(data);
    // if (chatId && socket) {
    //   const message = data.msg;

    //   socket.emit("chatMessage", { message, chatId });
      // const response: any = await dispatch(
      //   sendChatMessages({ chatId, message: data.msg })
      // );
      // console.log(response);
      // const newMessage = response.payload.addedMessage;
      // console.log(newMessage);

      // if (newMessage) {
      //   socket.emit("new message", newMessage);
      // }
    // } else {
    //   toast.error("Some error occured");
    // }

    // form.reset();
  };

  return (
    <Paper
      component="form"
      onSubmit={form.handleSubmit(handleSubmits)}
      sx={{
        p: "2px 4px",
        display: "flex",
        alignItems: "center",
        borderRadius: 2,
        boxShadow: 2,
      }}
    >
      <InputBase
        sx={{ ml: 1, flex: 1 }}
        placeholder="Type a message..."
        {...form.register("msg")}
        multiline
        maxRows={4}
      />
      <IconButton type="submit" sx={{ p: "10px" }} aria-label="send">
        <Send size={20} />
      </IconButton>
    </Paper>
  );
};
