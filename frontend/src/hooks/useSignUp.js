import React from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
import { signup } from "../lib/api";


const useSignUp = () => {
  const queryClient = useQueryClient();

  const {
    mutate,
    isPending,
    error,
  } = useMutation({
    mutationFn: signup,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["authUser"] }),
    onError: (error) => {
      toast.error("Error reached onError handler!"); // just test if this runs
      console.error("Error object:", error);
    },
  });
  return {error, isPending, signUpMutation: mutate};
};

export default useSignUp;
