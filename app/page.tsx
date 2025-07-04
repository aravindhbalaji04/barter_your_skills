"use client"

import type React from "react"

import { useEffect, useState, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Send, User, Wifi } from "lucide-react"

interface Message {
  id: string
  text: string
  userId: string
  timestamp: string
}

interface UserSession {
  userId: string
  lastSeen: number
}

const STORAGE_KEYS = {
  MESSAGES: "chat-messages",
  USERS: "chat-users",
  USER_ID: "chat-user-id",
}

export default function ChatApp() {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState("")
  const [userId, setUserId] = useState("")
  const [connectedUsers, setConnectedUsers] = useState<string[]>([])
  const [isLocalMode, setIsLocalMode] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Initialize user and load existing data
  useEffect(() => {
    // Get or create user ID
    let storedUserId = localStorage.getItem(STORAGE_KEYS.USER_ID)
    if (!storedUserId) {
      storedUserId = `User${Math.floor(Math.random() * 1000)}`
      localStorage.setItem(STORAGE_KEYS.USER_ID, storedUserId)
    }
    setUserId(storedUserId)

    // Load existing messages
    const storedMessages = localStorage.getItem(STORAGE_KEYS.MESSAGES)
    if (storedMessages) {
      try {
        const parsedMessages = JSON.parse(storedMessages)
        setMessages(parsedMessages)
      } catch (error) {
        console.error("Error loading messages:", error)
      }
    }

    // Register this user as active
    registerUser(storedUserId)

    // Update user list
    updateUserList()

    console.log(`🏠 Local mode initialized for ${storedUserId}`)
  }, [])

  // Listen for storage changes (messages from other tabs)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEYS.MESSAGES && e.newValue) {
        try {
          const newMessages = JSON.parse(e.newValue)
          setMessages(newMessages)
          console.log("📨 Messages updated from another tab")
        } catch (error) {
          console.error("Error parsing messages from storage:", error)
        }
      }

      if (e.key === STORAGE_KEYS.USERS) {
        updateUserList()
      }
    }

    window.addEventListener("storage", handleStorageChange)
    return () => window.removeEventListener("storage", handleStorageChange)
  }, [])

  // Update user activity every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (userId) {
        registerUser(userId)
        updateUserList()
      }
    }, 5000)

    return () => clearInterval(interval)
  }, [userId])

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const registerUser = (userId: string) => {
    const users = getUserSessions()
    users[userId] = {
      userId,
      lastSeen: Date.now(),
    }
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users))
  }

  const getUserSessions = (): Record<string, UserSession> => {
    const stored = localStorage.getItem(STORAGE_KEYS.USERS)
    if (!stored) return {}

    try {
      return JSON.parse(stored)
    } catch {
      return {}
    }
  }

  const updateUserList = () => {
    const users = getUserSessions()
    const now = Date.now()
    const activeUsers: string[] = []

    // Consider users active if they were seen in the last 10 seconds
    Object.values(users).forEach((user) => {
      if (now - user.lastSeen < 10000) {
        activeUsers.push(user.userId)
      }
    })

    // Clean up old users
    const cleanUsers: Record<string, UserSession> = {}
    Object.values(users).forEach((user) => {
      if (now - user.lastSeen < 30000) {
        // Keep users for 30 seconds
        cleanUsers[user.userId] = user
      }
    })

    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(cleanUsers))
    setConnectedUsers(activeUsers)
  }

  const sendMessage = useCallback(() => {
    if (inputMessage.trim()) {
      const message: Message = {
        id: `${Date.now()}-${Math.random()}`,
        text: inputMessage.trim(),
        userId,
        timestamp: new Date().toISOString(),
      }

      console.log("📤 Sending message:", message)

      // Update messages in localStorage
      const currentMessages = [...messages, message]
      localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(currentMessages))

      // Update local state
      setMessages(currentMessages)
      setInputMessage("")

      // Update user activity
      registerUser(userId)
    }
  }, [inputMessage, userId, messages])

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      sendMessage()
    }
  }

  const clearChat = () => {
    localStorage.removeItem(STORAGE_KEYS.MESSAGES)
    setMessages([])
    console.log("🧹 Chat cleared")
  }

  const generateNewUserId = () => {
    const newUserId = `User${Math.floor(Math.random() * 1000)}`
    localStorage.setItem(STORAGE_KEYS.USER_ID, newUserId)
    setUserId(newUserId)
    registerUser(newUserId)
    console.log(`🔄 New user ID: ${newUserId}`)
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-2xl mx-auto">
        <Card className="h-[600px] flex flex-col">
          <CardHeader className="flex-shrink-0">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Local Chat
              </CardTitle>
              <div className="flex items-center gap-2">
                <Badge variant="default" className="flex items-center gap-1">
                  <Wifi className="h-3 w-3" />
                  Local Mode
                </Badge>
                <Badge variant="outline">{connectedUsers.length} active</Badge>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                You are: <span className="font-medium">{userId}</span>
              </p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={generateNewUserId}>
                  New User
                </Button>
                <Button variant="outline" size="sm" onClick={clearChat}>
                  Clear Chat
                </Button>
              </div>
            </div>
            <p className="text-xs text-green-600">
              ✅ Real-time sync active! Open multiple tabs to test messaging between them.
            </p>
          </CardHeader>

          <CardContent className="flex-1 flex flex-col p-0">
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.length === 0 ? (
                  <div className="text-center text-muted-foreground py-8">
                    No messages yet. Start the conversation!
                    <br />
                    <span className="text-xs">Open multiple tabs to see real-time local messaging</span>
                  </div>
                ) : (
                  messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.userId === userId ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[70%] rounded-lg px-3 py-2 ${
                          message.userId === userId ? "bg-primary text-primary-foreground" : "bg-muted"
                        }`}
                      >
                        <div className="text-xs opacity-70 mb-1">{message.userId}</div>
                        <div>{message.text}</div>
                        <div className="text-xs opacity-70 mt-1">
                          {new Date(message.timestamp).toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            <div className="border-t p-4">
              <div className="flex gap-2">
                <Input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  className="flex-1"
                />
                <Button onClick={sendMessage} disabled={!inputMessage.trim()} size="icon">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              {connectedUsers.length > 0 && (
                <div className="mt-2 text-xs text-muted-foreground">Active users: {connectedUsers.join(", ")}</div>
              )}
              <div className="mt-1 text-xs text-green-600">
                🏠 Local mode - messages sync between tabs using localStorage
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
