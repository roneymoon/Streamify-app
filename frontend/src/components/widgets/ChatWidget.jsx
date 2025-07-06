import React, { useState, useEffect } from "react";
import { useChatContext } from "../../contexts/ChatWidgetContext";
import { useQuery } from "@tanstack/react-query";
import useAuthUser from "../../hooks/useAuthUser";
import { getStreamToken } from "../../lib/api";
import {
  Channel,
  ChannelList,
  ChannelHeader,
  Chat,
  MessageInput,
  MessageList,
  StreamEmoji,
  Thread,
  Window,
} from "stream-chat-react";

import { StreamChat } from "stream-chat";
import toast from "react-hot-toast";
import ChatLoader from "../ChatLoader";
import CallButton from "../CallButton";

import { useThemeStore } from "../../store/useThemeStore";
import { lighterThemes, darkerThemes } from "../../constants";

const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;

export default function ChatWidget() {
  const { isChatOpen, selectedUser, closeChat } = useChatContext();

  const { theme } = useThemeStore();

  const [chatClient, setChatClient] = useState(null);
  const [channel, setChannel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [shouldRender, setShouldRender] = useState(false); // NEW FLAG

  const { authUser } = useAuthUser();

  const { data: tokenData } = useQuery({
    queryKey: ["streamToken"],
    queryFn: getStreamToken,
    enabled: !!authUser,
  });
  console.log(theme);

  useEffect(() => {
    const initChat = async () => {
      if (!tokenData || !authUser || !selectedUser) return;

      try {
        const client = StreamChat.getInstance(STREAM_API_KEY);

        await client.connectUser(
          {
            id: authUser._id,
            name: authUser.fullName,
            image: authUser.profilePic,
          },
          tokenData.token
        );

        // you and me
        // if i start the stream => [myId, YourId]
        // if You Start the stream => [yourId, myId] => sort => [myId, yourId]
        // so that we both can chat in one single channel

        const channelID = [authUser._id, selectedUser._id].sort().join("-");
        const currChannel = client.channel("messaging", channelID, {
          members: [authUser._id, selectedUser._id],
        });

        await currChannel.watch();

        setChatClient(client);
        setChannel(currChannel);
        setShouldRender(true); // Only render when ready
      } catch (error) {
        toast.error("Could not connect to Chat. Please Try Again!");
        console.error("Error initializing Chat", error);
      } finally {
        setLoading(false);
      }
    };

    initChat();

    // Cleanup: on unmount or dependency change
    return () => {
      setShouldRender(false); // Prevent render before disconnect
      if (chatClient) {
        chatClient.disconnectUser();
      }
      setChatClient(null);
      setChannel(null);
    };
  }, [tokenData, selectedUser, authUser]);

  const handleClose = async () => {
    setShouldRender(false);
    if (chatClient) {
      await chatClient.disconnectUser();
    }
    setChatClient(null);
    setChannel(null);
    closeChat();
  };

  const handleVideoCall = async () => {
    if (channel) {
      const callURL = `${window.location.origin}/call/${channel.id}`;

      channel.sendMessage({
        text: `I've started a video call. Join me here ${callURL}`,
      });

      toast.success("Video Call Link sent Successfully");
    }
  };

  if (!isChatOpen || !selectedUser) return null;

  if (loading || !chatClient || !channel || !shouldRender)
    return <ChatLoader />;

  console.log(selectedUser);
  console.log(selectedUser._id);

  return (
    <div className="fixed bottom-1 right-4 w-[350px] h-[500px] shadow-lg border-none outline-none overflow-hidden z-50 rounded-xl bg-transparent">
      <div className="h-full">
        <Chat
          client={chatClient}
          theme={
            lighterThemes.includes(theme)
              ? "str-chat__theme-light"
              : "str-chat__theme-dark"
          }
        >
          {channel && (
            <Channel channel={channel}>
              <Window>
                <ChannelHeader />
                <MessageList />
                <MessageInput />
              </Window>
              <Thread />
            </Channel>
          )}
        </Chat>
        <div className="absolute top-2 right-2 flex gap-2">
          {/* Call Button */}
          <button
            onClick={handleVideoCall}
            className="w-9 h-9 flex items-center justify-center rounded-full shadow-md 
            bg-base-200 text-base-content 
            hover:bg-base-300 hover:scale-105 active:scale-95 
            transition-all duration-200 ease-in-out 
            focus:outline-none"
            title="Start Call"
          >
            📞
          </button>

          {/* Close Button */}
          <button
            onClick={handleClose}
            className="w-9 h-9 flex items-center justify-center rounded-full shadow-md 
            bg-base-200 text-base-content 
            hover:bg-red-400 hover:text-white hover:scale-105 
            active:scale-95 transition-all duration-200 ease-in-out 
            focus:outline-none"
            title="Close Chat"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
}
