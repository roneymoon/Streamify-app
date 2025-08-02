"use client";
import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Send, Image, Smile, X } from "lucide-react";
import toast from "react-hot-toast";
import { Toaster } from "react-hot-toast";
import EmojiPicker from "emoji-picker-react";
import { cn } from "../../lib/utils";
import { useCreatePost } from "../../hooks/useCreatePost";
import UserAvatar from "../user/UserAvatar";

const MAX_CHARS = 280;

export const PostForm = () => {
  const [content, setContent] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const { mutate: createPost, isPending } = useCreatePost();

  // ✅ Auto-expand textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [content]);

  const handlePost = () => {
    const trimmedContent = content.trim();

    if (!trimmedContent) {
      toast.error("Please write something before posting.");
      return;
    }

    const payload = { content: trimmedContent };

    createPost(payload, {
      onSuccess: () => {
        setContent("");
        setShowEmojiPicker(false);
      },
      onError: () => {
        toast.error("Something went wrong while posting.");
      },
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = () => setSelectedImage(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      toast.error("Only image files are allowed.");
    }
  };

  const handleEmojiClick = (emojiData: any) => {
    const cursor = textareaRef.current?.selectionStart || 0;
    const newText =
      content.slice(0, cursor) + emojiData.emoji + content.slice(cursor);
    setContent(newText);
    setShowEmojiPicker(false);
  };

  return (
    <motion.div
      layout
      className={cn(
        "bg-base-200 text-base-content shadow-lg rounded-3xl p-6 w-full max-w-2xl mx-auto border border-base-content/10"
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <Toaster/>
      <div className="flex items-start gap-4">
        {/* User avatar */}
        <UserAvatar/>

        {/* Post content area */}
        <div className="flex-1 space-y-3 relative">
          <textarea
            ref={textareaRef}
            rows={1}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What's on your mind?"
            maxLength={MAX_CHARS}
            className="w-full resize-none bg-transparent text-base focus:outline-none overflow-hidden"
          />

          {/* Selected image preview */}
          {selectedImage && (
            <div className="relative group w-fit">
              <img
                src={selectedImage}
                alt="Selected"
                className="rounded-xl max-h-72 object-cover border border-base-content/20"
              />
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-2 right-2 bg-white rounded-full p-1 hover:bg-gray-100 transition shadow group-hover:scale-105"
              >
                <X size={16} className="text-gray-600" />
              </button>
            </div>
          )}

          {/* Actions row */}
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-3">
              <label className="cursor-pointer">
                <Image size={20} />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
              <button onClick={() => setShowEmojiPicker((prev) => !prev)}>
                <Smile size={20} />
              </button>
            </div>

            <div className="flex items-center gap-4">
              {/* Char counter */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={cn(
                  "text-sm font-medium",
                  content.length >= MAX_CHARS ? "text-red-500" : "text-gray-500"
                )}
              >
                {content.length}/{MAX_CHARS}
              </motion.div>

              {/* Submit */}
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={handlePost}
                disabled={!content.trim() || isPending}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-full font-medium transition",
                  !content.trim() || isPending
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-primary text-white hover:bg-primary/90"
                )}
              >
                <Send size={16} />
                {isPending ? "Sharing..." : "Share"}
              </motion.button>
            </div>
          </div>

          {/* Emoji Picker */}
          {showEmojiPicker && (
            <div className="absolute z-50 mt-2">
              <EmojiPicker onEmojiClick={handleEmojiClick} />
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};
