import { useState, useContext, createContext } from "react"
import React from "react"

const chatWidgetContext = createContext();

export const ChatWidgetProvider = ({children}) => {
    const [selectedUser, setSelectedUser] = useState(null)
    const [isChatOpen, setChatOpen] = useState(false)

    const openChat = (user) => {
        setChatOpen(true)
        setSelectedUser(user)
    }

    const closeChat = (user) => {
        setSelectedUser(null);
        setChatOpen(false)
    }

    return (
        <chatWidgetContext.Provider value={{isChatOpen, selectedUser, openChat, closeChat}}>
            {children}
        </chatWidgetContext.Provider>
    )
}

export const useChatContext = () => useContext(chatWidgetContext)