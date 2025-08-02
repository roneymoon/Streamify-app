"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus } from "lucide-react";
import { PostForm } from "../../components/post/PostForm";

export default function ExpandableCreatePost() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Expand Button */}
      <div className="w-full max-w-md p-4 z-10 mr-[15rem]">
        <motion.button
          whileHover={{
            scale: 1.05,
            rotate: -1,
            boxShadow: "0px 0px 18px rgba(100, 100, 255, 0.3)",
          }}
          whileTap={{ scale: 0.95, rotate: 0 }}
          onClick={() => setIsOpen(true)}
          className="relative overflow-hidden flex items-center gap-2 px-6 py-3 rounded-2xl bg-white shadow-lg border border-gray-200 transition-all duration-300 group"
        >
          {/* Gradient shimmer effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-indigo-200 via-white to-indigo-200 opacity-10 blur-xl"
            initial={{ x: "-100%" }}
            animate={{ x: "100%" }}
            transition={{
              repeat: Infinity,
              duration: 2,
              ease: "linear",
            }}
          />

          <Plus className="text-indigo-600 group-hover:scale-110 transition duration-300" />
          <span className="text-gray-800 font-semibold tracking-wide group-hover:text-indigo-700 transition">
            Create a Post & Share
          </span>
        </motion.button>
      </div>

      {/* Modal Backdrop & Content */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-gradient-to-br from-black/60 to-gray-800/60 backdrop-blur-sm z-40"
            />

            {/* Modal */}
            <motion.div
              key="modal"
              initial={{ opacity: 0, scale: 0.85, y: -50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -30 }}
              transition={{ duration: 0.35, type: "spring", stiffness: 120 }}
              className="fixed top-1/2 left-1/2 z-50 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-5xl"
            >
              <PostForm onClose={() => setIsOpen(false)} />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
