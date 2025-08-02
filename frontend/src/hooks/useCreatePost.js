import React from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createPost } from "../lib/api";
import toast from "react-hot-toast";

export const useCreatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createPost,
    onSuccess: () => {
      toast.success("Post Created Successfully");
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Failed to create post");
    },
  });
};
