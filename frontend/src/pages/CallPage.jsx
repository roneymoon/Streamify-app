import React from "react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import useAuthUser from "../hooks/useAuthUser";
import { useQuery } from "@tanstack/react-query";
import { getStreamToken } from "../lib/api";

import {
  StreamVideo,
  StreamVideoClient,
  StreamCall,
  CallControls,
  SpeakerLayout,
  StreamTheme,
  CallingState,
  useCallStateHooks,
  Call,
} from "@stream-io/video-react-sdk";

import "@stream-io/video-react-sdk/dist/css/styles.css";
import PageLoader from "../components/PageLoader";
import { Speaker } from "lucide-react";

const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;

const CallPage = () => {
  const { id: callId } = useParams();
  const [client, setClient] = useState(null);
  const [call, setCall] = useState(null);
  const [connecting, setConnecting] = useState(true);

  const { authUser, isLoading } = useAuthUser();

  const { data: tokenData } = useQuery({
    queryKey: ["streamToken"],
    queryFn: getStreamToken,
    enabled: !!authUser,
  });

  useEffect(() => {
    const initCall = async () => {
      if (!tokenData || !authUser || !callId) return;

      try {
        console.log("Initializing Stream Chat Video Client...");

        const user = {
          id: authUser._id,
          name: authUser.fullName,
          image: authUser.profilePic,
        };

        const videoClient = new StreamVideoClient({
          apiKey: STREAM_API_KEY,
          user,
          token: tokenData.token,
        });

        const callInstance = videoClient.call("default", callId);

        await callInstance.join({ create: true });

        console.log("joined call successfully");

        setClient(videoClient);
        setCall(callInstance);
      } catch (error) {
        console.error("Error joining the call", error);
        toast.error("Could not Join the Call. Please Try Again!");
      } finally {
        setConnecting(false);
      }
    };
    initCall();
  }, [tokenData, authUser, callId]);

  if (isLoading || connecting) return <PageLoader />;

  return (
    <div className="h-screen flex flex-col items-center justify-center">
      <div className="relative">
        {client && call ? (
          <StreamVideo client={client}>
            <StreamCall call={call}>
              <CallContent />
            </StreamCall>
          </StreamVideo>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p>Could not Initialize call. Please Refresh or Try Again Later.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CallPage;

const CallContent = () => {
  const { useCallCallingState } = useCallStateHooks()
  const callingState = useCallCallingState()

  const navigate = useNavigate()

  if(callingState === CallingState.LEFT) return navigate("/")

  return (
    <StreamTheme>
      <SpeakerLayout/>
      <CallControls/>
    </StreamTheme>
  )
}
