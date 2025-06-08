import React, { useEffect } from 'react'
import { useState } from 'react'
import { useParams } from 'react-router'
import useAuthUser from '../hooks/useAuthUser'
import { useQuery } from '@tanstack/react-query'
import { getStreamToken } from '../lib/api'
import {
  Channel,
  ChannelHeader,
  Chat,
  MessageInput,
  MessageList,
  StreamEmoji,
  Thread,
  Window
} from "stream-chat-react"

import toast, { Toaster } from 'react-hot-toast'
import ChatLoader from '../components/ChatLoader'
import { StreamChat } from 'stream-chat'

import CallButton from '../components/CallButton'

const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY

const ChatPage = () => {

  const {id: targetUserId} = useParams()

  const [chatClient, setChatClient] = useState(null)
  const [channel, setChannel] = useState(null)
  const [loading, setLoading] = useState(null)

  const { authUser } = useAuthUser()

  const {data:tokenData } = useQuery({
    queryKey: ["streamToken"],
    queryFn: getStreamToken,
    enabled: !!authUser // queryFn will be executed only if there is authUser
  })

  useEffect(() => {
    const initChat = async () => {
      if(!tokenData || !authUser) return;

      try {
        console.log("Initializing the Stream Chat Client...")
        console.log(tokenData.token)
  
        const client = StreamChat.getInstance(STREAM_API_KEY)

        await client.connectUser({
          id: authUser._id,
          name: authUser.fullName,
          image: authUser.profilePic,
        }, tokenData.token)

        // creating a channel-ID
        const channelID = [authUser._id, targetUserId].sort().join("-")

        // you and me
        // if i start the stream => [myId, YourId]
        // if You Start the stream => [yourId, myId] => sort => [myId, yourId]
        // so that we both can chat in one single channel

        const currChannel = client.channel("messaging", channelID, {
          members: [authUser._id, targetUserId]
        })

        await currChannel.watch()
        setChatClient(client)
        setChannel(currChannel)

      } catch (error) {
        console.log("Error initializing Chat", error);
        toast.error("Could not connect to Chat. Please Try Again!")
      } finally{
        setLoading(false)
      }
    }

    initChat()
  }, [tokenData, targetUserId, authUser])

  const handleVideoCall = async () => {
    if(channel){
      const callURL = `${window.location.origin}/call/${channel.id}`

      channel.sendMessage({
        text: `I've started a video call. Join me here ${callURL}`
      })

      toast.success("Video Call Link sent Successfully")
    }
  }
  
  if(loading || !chatClient || !channel) return <ChatLoader/>

  return (
    <div className='h-[93vh]'>
      <Toaster/>
      <Chat client={chatClient}>
        <Channel channel={channel}>
          <div className='w-full relative'>
            <Window>
              <CallButton handleVideoCall={handleVideoCall}/>
              <ChannelHeader/>
              <MessageList/>
              <MessageInput focus/>

              <Thread/>
            </Window>
          </div>
        </Channel>
      </Chat>
    </div>
  )
}

export default ChatPage
