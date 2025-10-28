import React, { useState, useEffect, useCallback } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import EmojiPicker, { Emoji } from "emoji-picker-react";
import logo from "../assets/images/pre/logo.png";
import sideIcon from "../assets/images/pre/side.png";
import lilLogo from "../assets/images/pre/lil.png";
import messagesIcon from "../assets/images/pre/messages.png";
import filterIcon from "../assets/images/pre/filter.png";
import ssIcon from "../assets/images/pre/ss.png";
import mainIcon from "../assets/images/pre/main.png";
import avatarIcon from "../assets/images/pre/avatar.png";
import basketIcon from "../assets/images/pre/basket.png";
import leftIcon from "../assets/images/pre/left.png";
import fiIcon from "../assets/images/pre/fi.png";
import faIcon from "../assets/images/pre/fa.png";
import eboAvatar from "../assets/images/pre/ebo.png";
import earthIcon from "../assets/images/pre/earth.png";
import locIcon from "../assets/images/pre/loc.png";
import profileIcon from "../assets/images/pre/profile.png";
import faceIcon from "../assets/images/pre/face.png";
import pinIcon from "../assets/images/pre/pin.png";
import bluIcon from "../assets/images/pre/blu.png";
import audioIcon from "../assets/images/pre/audio.svg";
import swiIcon from "../assets/images/pre/swi.svg";
import messageIcon from "../assets/images/pre/message.svg";
import boxIcon from "../assets/images/pre/box.svg";
import groupIcon from "../assets/images/pre/group.svg";
import frameIcon from "../assets/images/pre/frame.svg";
import podsIcon from "../assets/images/pre/pods.svg";
import settingIcon from "../assets/images/pre/setting.svg";
import reactionIcon from "../assets/images/pre/reaction.svg";
import optionIcon from "../assets/images/pre/option.svg";
import notificationIcon from "../assets/images/pre/notification.svg";
import emoji1 from "../assets/images/pre/s1.svg";
import emoji2 from "../assets/images/pre/s2.svg";
import emoji3 from "../assets/images/pre/s3.svg";
import emoji4 from "../assets/images/pre/s4.svg";
import emoji5 from "../assets/images/pre/s5.svg";
import emoji6 from "../assets/images/pre/s6.svg";
import actionIcon01 from "../assets/images/pre/01.svg";
import actionIcon02 from "../assets/images/pre/02.svg";
import actionIcon03 from "../assets/images/pre/03.svg";
import actionIcon04 from "../assets/images/pre/04.svg";
import actionIcon05 from "../assets/images/pre/05.svg";
import actionIcon06 from "../assets/images/pre/06.svg";
import muteArrowIcon from "../assets/images/pre/mute.svg";
import archiveIcon from "../assets/images/pre/archive.svg";
import starIcon from "../assets/images/pre/star.svg";
import translationToggleIcon from "../assets/images/pre/tt.svg";
import replyIcon from "../assets/images/pre/reply.svg";
import copyIcon from "../assets/images/pre/copy.svg";
import tickIcon from "../assets/images/pre/tick.svg";
import pinMenuIcon from "../assets/images/pre/pin.svg";
import trashIcon from "../assets/images/pre/trash.svg";
import replyCloseIcon from "../assets/images/pre/re.svg";
import productImage1 from "../assets/images/pre/1.png";
import { io, Socket } from "socket.io-client";
import { useToast } from "../contexts/ToastContext";

const Messages: React.FC = () => {
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("EN");
  const [productData, setProductData] = useState<any>(null);
  const [preFilledMessage, setPreFilledMessage] = useState("");
  const [messageText, setMessageText] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const [isMessageSent, setIsMessageSent] = useState(false);
  const [chatEntry, setChatEntry] = useState<any>(null);
  const [selectedTab, setSelectedTab] = useState("All");
  const [messageStatuses, setMessageStatuses] = useState<{
    [key: string]: "sending" | "delivered" | "read";
  }>({});
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [recordingTimer, setRecordingTimer] = useState<NodeJS.Timeout | null>(
    null
  );
  const [soundDetected, setSoundDetected] = useState(false);
  const [soundTimer, setSoundTimer] = useState<NodeJS.Timeout | null>(null);
  const [audioLevels, setAudioLevels] = useState<number[]>([]);
  const [waveformTimer, setWaveformTimer] = useState<NodeJS.Timeout | null>(
    null
  );
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [analyser, setAnalyser] = useState<AnalyserNode | null>(null);
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null
  );
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
  const [playingMessageId, setPlayingMessageId] = useState<string | null>(null);
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(
    null
  );
  const [audioPlaybackTime, setAudioPlaybackTime] = useState<{
    [key: string]: number;
  }>({});
  const [isPreviewPlaying, setIsPreviewPlaying] = useState(false);
  const [previewAudio, setPreviewAudio] = useState<HTMLAudioElement | null>(
    null
  );
  const [previewPlaybackTime, setPreviewPlaybackTime] = useState(0);
  const [isMenuDropdownOpen, setIsMenuDropdownOpen] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [showFilePreview, setShowFilePreview] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectedEmoji, setSelectedEmoji] = useState<string>("");
  const [isAttachActive, setIsAttachActive] = useState(false);
  const [showTypingIndicator, setShowTypingIndicator] = useState(false);
  const [isUserTyping, setIsUserTyping] = useState(false);
  const [typingTimer, setTypingTimer] = useState<NodeJS.Timeout | null>(null);
  const [clickedMessageId, setClickedMessageId] = useState<string | null>(null);
  const [isReplyRead, setIsReplyRead] = useState(false);
  const [isSellerTyping, setIsSellerTyping] = useState(false);
  const [hasIncomingReply, setHasIncomingReply] = useState(false);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [actionsMenuOpen, setActionsMenuOpen] = useState<string | null>(null);
  const [chatSearchQuery, setChatSearchQuery] = useState("");
  const [showCondensedHeader, setShowCondensedHeader] = useState(false);
  const [visibleMessages, setVisibleMessages] = useState<any[]>([]);
  const [fadingOutMessageIds, setFadingOutMessageIds] = useState<number[]>([]);
  const [activeReactionMessageId, setActiveReactionMessageId] = useState<string | null>(null);
  const [showAllMessages, setShowAllMessages] = useState(false);
  const [activeMessageOptionsId, setActiveMessageOptionsId] = useState<string | null>(null);
  const [showReactionEmojiPicker, setShowReactionEmojiPicker] = useState(false);
  const [replyToMessage, setReplyToMessage] = useState<any>(null);
  const messagesEndRef = React.useRef<HTMLDivElement>(null);
  const messagesContainerRef = React.useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();

  const { addToast } = useToast();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isSocketConnected, setIsSocketConnected] = useState(false);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [conversations, setConversations] = useState<any[]>([]);
  const [currentConversation, setCurrentConversation] = useState<any>(null);
  const [joinedRooms, setJoinedRooms] = useState<Set<string>>(new Set());
  const [socketInitialized, setSocketInitialized] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);

  console.log('🔍 Messages Component State:', {
    currentConversation,
    activeConversationId,
    conversations: conversations.length,
    locationState: location.state,
    socketConnected: isSocketConnected
  });

  // Get current user on component mount
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      // Decode JWT to get user info (you might need a proper JWT decoding library)
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setCurrentUser({ id: payload.userId });
        console.log('👤 Current user ID:', payload.userId);
      } catch (error) {
        console.error('Failed to decode user from token:', error);
      }
    }
  }, []);

  // Socket connection
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      console.log("No token available for Socket.io connection");
      return;
    }

    if (socketInitialized && socket) {
      console.log("✅ Socket already initialized, skipping...");
      return;
    }

    // don't create a new socket if one is already connected
    if (socket?.connected) {
      console.log("Socket already connected, skipping reconnection");
      return;
    }

    // if socket exists and is not connected, try to reconnect
    if (socket && !socket.connected) {
      console.log('Socket exists but disconnected, attempting to reconnect');
      socket.connect();
      return;
    }

    if (socketInitialized) {
      console.log('Socket initialization in progress, skipping');
      return;
    }

    console.log("Initializing Socket.io connection");
    setSocketInitialized(true);

    const newSocket = io(process.env.REACT_APP_WS_URL!, {
      auth: { token },
      transports: ["websocket", "polling"],
      timeout: 10000,
      forceNew: true,
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 3,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000
    });

    setSocket(newSocket);
    // setIsSocketConnected(false);

    // Connection events
    newSocket.on("connect", () => {
      console.log("✅ Connected to chat server, socket ID:", newSocket.id);
      setIsSocketConnected(true);
      newSocket.emit("join_conversations");

      // rejoin any active conversation
      if (activeConversationId) {
        console.log(`re-joining conversation room: ${currentConversation.id}`);
        newSocket.emit("join_conversation", currentConversation.id);
      }
    });

    newSocket.on("disconnect", (reason) => {
      console.log("Socket disconnected:", reason);
      setIsSocketConnected(false);
    });

    newSocket.on("connect_error", (error) => {
      console.error("WebSocket connection error:", error);
      setIsSocketConnected(false);

      addToast({
        type: "error",
        title: "Connection Error",
        message: "Unable to connect to chat server. Please refresh the page.",
        duration: 5000,
      });
    });

    newSocket.on("reconnect", (attemptNumber) => {
      console.log(`Reconnected after ${attemptNumber} attempts`);
      setIsSocketConnected(true);
      newSocket.emit("join_conversations");

      if (activeConversationId) {
        newSocket.emit("join_conversation", activeConversationId);
      }
    });

    newSocket.on("reconnect_attempt", (attemptNumber) => {
      console.log(`Reconnection attempt ${attemptNumber}`);
    });

    newSocket.on("reconnect_error", (error) => {
      console.error("Reconnection error:", error);
    });

    newSocket.on("reconnect_failed", () => {
      console.error("Reconnection failed");
      setSocketInitialized(false);
    });

    // message events
    newSocket.on("new_message", (serverMessage) => {
      console.log("📨 New message received:", serverMessage);

      setMessages(prev => {

        const isOurMessage = serverMessage.senderId === currentUser?.id;

        // Check if we already have this message (by ID or tempId)
        const existingMessageIndex = prev.findIndex(msg =>
          msg.id === serverMessage.id ||
          (serverMessage.tempId && msg.tempId === serverMessage.tempId)
        );

        if (existingMessageIndex >= 0) {
          console.log('🔄 Message already exists, updating...');
          // Update existing message
          const updatedMessages = [...prev];
          updatedMessages[existingMessageIndex] = {
            ...serverMessage,
            text: serverMessage.content || serverMessage.text,
            content: serverMessage.content,
            isIncoming: !isOurMessage,
            timestamp: serverMessage.createdAt,
            dateString: new Date(serverMessage.createdAt).toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            }),
            status: isOurMessage ? 'delivered' : 'read'
          };
          return updatedMessages;
        } else {
          // Add new message
          return [...prev, {
            ...serverMessage,
            text: serverMessage.content || serverMessage.text,
            content: serverMessage.content,
            isIncoming: !isOurMessage,
            timestamp: serverMessage.createdAt,
            dateString: new Date(serverMessage.createdAt).toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            }),
            status: isOurMessage ? 'delivered' : 'read'
          }];
        }
      });
    });

    newSocket.on("message_sent", (data) => {
      console.log('✅ Message confirmed by server:', data);
      setIsSending(false);

      setMessages(prev => prev.map(msg => {
        if (msg.id === `temp-${data.tempId}` || msg.tempId === data.tempId) {
          return {
            ...data,
            text: data.content || data.text,
            content: data.content,
            id: data.id,
            isIncoming: false,
            timestamp: data.createdAt,
            dateString: new Date(data.createdAt).toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            }),
            status: 'delivered',
            tempId: undefined
          };
        }
        return msg;
      }));
    });

    newSocket.on("conversation_joined", (data) => {
      console.log(`✅ Joined conversation room: ${data.conversationId}`);
    });

    newSocket.on("conversation_join_error", (errorData) => {
      console.error('❌ Failed to join conversation:', errorData);
    });

    newSocket.on("message_error", (errorData) => {
      console.error('❌ Message failed:', errorData);
      setIsSending(false); // Reset sending state on error
      addToast({
        type: "error",
        title: "Send Failed",
        message: errorData.error || "Failed to send message",
        duration: 4000,
      });
    });

    newSocket.on("messages_read", (data) => {
      console.log("Messages read:", data);
      // Update read status for messages
      setMessages((prev) =>
        prev.map((msg) =>
          data.messageIds && data.messageIds.includes(msg.id)
            ? { ...msg, isRead: true }
            : msg
        )
      );
    });

    newSocket.on("new_message_notification", (data) => {
      console.log("New message notification:", data);
      // Show notification for new message
      if (data.conversationId !== activeConversationId) {
        // Show browser notification or update badge count
        console.log("New message in other conversation:", data);
      }
    });

    newSocket.on("user_typing", (data) => {
      console.log("User typing:", data);
      if (data.conversationId === activeConversationId) {
        setShowTypingIndicator(true);
      }
    });

    newSocket.on("user_stop_typing", (data) => {
      console.log("User stopped typing:", data);
      if (data.conversationId === activeConversationId) {
        setShowTypingIndicator(false);
      }
    });

    // Handle any other events
    newSocket.onAny((event, ...args) => {
      console.log(`Socket event: ${event}`, args);
    });

    return () => {
      console.log("🔄 Socket cleanup - component unmounting");
      if (newSocket) {
        console.log('Disconnecting socket...');
        newSocket.off("connect");
        newSocket.off("disconnect");
        newSocket.off("connect_error");
        newSocket.off("reconnect");
        newSocket.off("new_message");
        newSocket.off("messages_read");
        newSocket.off("new_message_notification");
        newSocket.off("user_typing");
        newSocket.off("user_stop_typing");
        newSocket.offAny();
        newSocket.disconnect();
      }
      setSocketInitialized(false);
    };
  }, []);

  useEffect(() => {
    console.log('📨 Current Messages:', messages.map(msg => ({
      id: msg.id,
      content: msg.content,
      text: msg.text,
      type: msg.type,
      isIncoming: msg.isIncoming
    })));
  }, [messages]);

  const fetchConversations = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/chat/conversations`,
        {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setConversations(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch conversations:", error);

      addToast({
        type: "error",
        title: "Connection Error",
        message: "Unable to load messages. Please try again.",
        duration: 5000,
      });
    } finally {
      setIsLoadingMessages(false);
    }
  };

  // initialization useEffect
  useEffect(() => {
    const loadInitialData = async () => {
      await fetchConversations();

      const locationConversationId = location.state?.conversation?.id;

      if (locationConversationId) {
        console.log('🔄 Loading conversation from navigation:', locationConversationId);
        await fetchConversationMessages(locationConversationId);
      } else {
        console.log('✅ No conversation to load by default');
        // Clear any active conversation state
        setActiveConversationId(null);
        setCurrentConversation(null);
        setMessages([]);
      }
    };

    loadInitialData();
  }, []);

  const fetchConversationMessages = async (conversationId: string) => {
    if (!conversationId) {
      console.log('❌ No conversation ID provided, clearing state');
      setActiveConversationId(null);
      setCurrentConversation(null);
      setMessages([]);
      return;
    }

    if (isLoadingMessages) {
      console.log('Already loading messages, skipping...');
      return;
    }

    if (activeConversationId === conversationId && messages.length > 0) {
      console.log('✅ Already viewing this conversation with messages');
      return;
    }

    try {
      setIsLoadingMessages(true);
      console.log(`Fetching messages for conversation: ${conversationId}`);

      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/chat/conversations/${conversationId}/messages`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log(`Messages loaded: `, data.data);

      const getMessageStatus = (message: any, currentUserId: string) => {
        // For sent messages
        if (message.senderId === currentUserId) {
          // Check if we have status from the server
          if (message.statuses && message.statuses.length > 0) {
            return message.statuses[0].status; // 'sent', 'delivered', 'read'
          }

          // For temporary messages
          if (message.status) {
            return message.status;
          }

          // Default for sent messages
          return 'sent';
        }

        // For received messages, they're always 'read' if we're viewing them
        return 'read';
      };

      // Transform messages for UI
      const transformedMessages = (data.data || []).map((message: any) => ({
        ...message,
        text: message.content || '',
        content: message.content || '',
        isIncoming: message.senderId !== currentUser?.id,
        timestamp: message.createdAt,
        dateString: new Date(message.createdAt).toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }),
        type: message.messageType?.toLowerCase() || 'text',
        status: getMessageStatus(message, currentUser?.id)
      }));

      setMessages(transformedMessages);
      setActiveConversationId(conversationId);

      // Find and set current conversation from conversations list
      const currentConv = conversations.find(c => c.id === conversationId);
      if (currentConv) {
        setCurrentConversation(currentConv);
      }

      // save to localStorage
      localStorage.setItem('activeConversationId', conversationId);
      if (currentConv) {
        localStorage.setItem('currentConversation', JSON.stringify(currentConv));
      }

      // join socket room
      if (socket && socket.connected) {
        console.log(`Joining conversation room: ${conversationId}`);
        socket.emit("join_conversation", conversationId);
      }
    } catch (error) {
      console.error('Failed to fetch messages:', error);
      addToast({
        type: "error",
        title: "Error",
        message: "Failed to load messages",
        duration: 4000
      });
    } finally {
      setIsLoadingMessages(false);
    }
  };

  const closeActiveConversation = () => {
    console.log('🗑️ Closing active conversation');
    setActiveConversationId(null);
    setCurrentConversation(null);
    setMessages([]);
    setReplyToMessage(null);

    // Clear from localStorage as well
    localStorage.removeItem('activeConversationId');
    localStorage.removeItem('currentConversation');
  };

  const getMessageDisplayText = (message: any) => {
    return message.content || message.text || '';
  };

  // Send message function
  const sendMessageViaSocket = useCallback((conversationId: string, messageData: any) => {
    if (!socket || !isSocketConnected) {
      console.error('Socket not connected');
      addToast({
        type: "error",
        title: "Connection Error",
        message: "Unable to send message. Please check your connection.",
        duration: 4000,
      });
      return;
    }

    const tempId = Date.now();
    const tempMessage = {
      id: `temp-${tempId}`,
      tempId: tempId,
      conversationId,
      content: messageData.content,
      messageType: messageData.messageType,
      fileUrl: messageData.fileUrl,
      fileName: messageData.fileName,
      fileSize: messageData.fileSize,
      senderId: currentUser?.id,
      sender: {
        id: currentUser?.id,
        firstName: 'You',
        lastName: '',
        profileImage: null,
        isVerifiedSeller: false
      },
      isIncoming: false,
      timestamp: new Date().toISOString(),
      dateString: 'Just now',
      type: messageData.messageType?.toLowerCase() || 'text',
      status: 'sending',
      text: messageData.content
    };

    console.log('Adding temporary message:', tempMessage);

    // Add message immediately to UI
    setMessages(prev => [...prev, tempMessage]);

    const messageToSend = {
      ...messageData,
      tempId: tempId,
      conversationId,
      timestamp: new Date().toISOString()
    };

    console.log('Sending message via socket:', messageToSend);
    socket.emit('send_message', messageToSend);
  }, [socket, isSocketConnected, currentUser, addToast]);

  // Mark as read function
  const markAsReadViaSocket = (conversationId: string) => {
    if (socket) {
      socket.emit("mark_as_read", conversationId);
    }
  };

  // Typing indicators
  const startTyping = (conversationId: string) => {
    if (socket) {
      socket.emit("typing_start", conversationId);
    }
  };

  const stopTyping = (conversationId: string) => {
    if (socket) {
      socket.emit("typing_stop", conversationId);
    }
  };

  const handleHomepageClick = () => {
    // Navigate to home page while preserving login state
    navigate("/", { replace: false });
  };

  const handleMenuClick = () => {
    // Navigate to home page with menu opened and highlight Chats option
    navigate("/", {
      replace: false,
      state: {
        openMenu: true,
        highlightChats: true,
      },
    });
  };

  // Limit visible messages to last 3 with smooth fade-out (unless showing all)
  useEffect(() => {
    const MAX_VISIBLE_MESSAGES = 10;

    if (messages.length > 0) {
      // If showing all messages, display everything; otherwise show last 10
      const messagesToShow = showAllMessages
        ? messages
        : messages.slice(-MAX_VISIBLE_MESSAGES);
      const newMessageIds = messagesToShow.map((m) => m.id);
      const currentMessageIds = visibleMessages.map((m) => m.id);

      // Find messages that need to fade out (old messages not in new list)
      const messagesToFadeOut = visibleMessages.filter(
        (msg) => !newMessageIds.includes(msg.id)
      );

      if (messagesToFadeOut.length > 0 && !showAllMessages) {
        // Start fade-out animation for old messages
        setFadingOutMessageIds(messagesToFadeOut.map((m) => m.id));

        // After animation completes, remove them and show new messages
        setTimeout(() => {
          setVisibleMessages(messagesToShow);
          setFadingOutMessageIds([]);

          // Auto-scroll to bottom (only if not showing all messages)
          setTimeout(() => {
            if (messagesEndRef.current) {
              messagesEndRef.current.scrollIntoView({
                behavior: "smooth",
                block: "end",
              });
            }
          }, 100);
        }, 500); // Match fade-out animation duration
      } else {
        // No messages to fade out, just update
        setVisibleMessages(messagesToShow);

        // Auto-scroll to bottom (only if not showing all messages)
        if (!showAllMessages) {
          setTimeout(() => {
            if (messagesEndRef.current) {
              messagesEndRef.current.scrollIntoView({
                behavior: "smooth",
                block: "end",
              });
            }
          }, 100);
        }
      }
    }
  }, [messages, showAllMessages]);

  // File attachment handlers
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    // Reset attach button state when file dialog closes (whether files selected or cancelled)
    setIsAttachActive(false);

    if (files && files.length > 0) {
      const newFiles = Array.from(files);
      setSelectedFiles((prev) => [...prev, ...newFiles]);
      setShowFilePreview(true);
    }
  };

  const handleAttachClick = () => {
    setIsAttachActive(true);
    const fileInput = document.getElementById(
      "file-upload"
    ) as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    if (selectedFiles.length === 1) {
      setShowFilePreview(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const handleFileClick = (file: any) => {
    // For now, we'll create a download link since we don't have the actual file data
    // In a real app, you would fetch the file from the server
    const link = document.createElement("a");
    link.href = "#"; // Placeholder - in real app this would be the file URL
    link.download = file.name;
    link.click();

    // Show a message to the user
    alert(`Opening file: ${file.name} (${formatFileSize(file.size)})`);
  };

  const handleIncomingMessageClick = (messageId: string) => {
    // Toggle the clicked message - if already clicked, hide icons; if not clicked, show icons
    setClickedMessageId(clickedMessageId === messageId ? null : messageId);

    // Mark reply as read when user clicks on incoming message
    const message = messages.find((m) => m.id === messageId);
    if (message && message.isIncoming) {
      setIsReplyRead(true);
    }
  };

  const handleActionsMenuClick = (conversationId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    setActionsMenuOpen(actionsMenuOpen === conversationId ? null : conversationId);
  };

  const handleActionSelect = (action: string, conversationId: string) => {
    console.log(`Action: ${action} for chat: ${conversationId}`);
    setActionsMenuOpen(null);
    // Here you would implement the actual action logic
  };

  // Emoji picker handlers
  const handleEmojiClick = () => {
    setShowEmojiPicker(!showEmojiPicker);
  };

  const onEmojiClick = (emojiObject: any) => {
    setSelectedEmoji(emojiObject.emoji);
    // Add the emoji to the message input
    setMessageText((prev) => prev + emojiObject.emoji);
    setShowEmojiPicker(false);
    // Trigger typing detection when emoji is added
    handleTypingDetection();
  };

  // Typing detection logic
  const handleTypingDetection = () => {
    setIsUserTyping(true);

    // Clear existing timer
    if (typingTimer) {
      clearTimeout(typingTimer);
    }

    // Set new timer to stop typing indicator after 1.5 seconds of inactivity
    const timer = setTimeout(() => {
      setIsUserTyping(false);
    }, 1500);

    setTypingTimer(timer);
  };

  const startChatByEmail = async (email: string, message?: string) => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/chat/conversations/email`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            participantEmail: email,
            initialMessage: message,
            productId: productData?.id,
          }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Server response:", errorText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      const conversation = result.data;

      setConversations(prev => [conversation, ...prev]);
      setActiveConversationId(conversation.id); // trigger loading messages

      navigate("/messages", {
        state: {
          ...location.state,
          conversationId: conversation.id,
        },
        replace: true,
      });

      return conversation;
    } catch (error) {
      console.error("Error starting chat:", error);

      let errorMessage = "Failed to start conversation. Please try again.";
      if (error instanceof Error) {
        if (error.message.includes("User not found")) {
          errorMessage = "Seller not found. Please try again later.";
        } else if (
          error.message.includes("Cannot create conversation with yourself")
        ) {
          errorMessage = "You cannot contact yourself.";
        } else if (error.message.includes("HTTP error")) {
          errorMessage =
            "Server connection failed. Please check your internet connection";
        }
      }

      addToast({
        type: "error",
        title: "Connection failed",
        message: errorMessage,
        duration: 5000,
      });
      return null;
    }
  };

  // Render sidebar status indicator
  const renderSidebarStatus = (messageId: string) => {
    const status = messageStatuses[messageId] || "sending";

    switch (status) {
      case "sending":
        return (
          <svg
            className="w-4 h-4 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        );
      case "delivered":
        return (
          <svg
            className="w-4 h-4 text-gray-400"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        );
      case "read":
        return (
          <div className="flex items-center">
            <svg
              className="w-4 h-4"
              style={{ color: "#64B5F6" }}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
            <svg
              className="w-4 h-4 -ml-2.5"
              style={{ color: "#64B5F6" }}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        );
      default:
        return null;
    }
  };

  // Handle reaction button click
  const handleReactionClick = (messageId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    // Close message options popup if open
    setActiveMessageOptionsId(null);
    // Toggle reaction popup
    setActiveReactionMessageId(
      activeReactionMessageId === messageId ? null : messageId
    );
  };

  // Handle reaction selection
  const handleReactionSelect = (reaction: string) => {
    if (activeReactionMessageId !== null) {
      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg.id === activeReactionMessageId ? { ...msg, reaction } : msg
        )
      );
    }
    setActiveReactionMessageId(null);
    setShowReactionEmojiPicker(false);
  };

  // Handle reaction removal
  const handleRemoveReaction = (messageId: number) => {
    setMessages((prevMessages) =>
      prevMessages.map((msg) =>
        msg.id === messageId ? { ...msg, reaction: undefined } : msg
      )
    );
  };

  // Handle message options click
  const handleMessageOptionsClick = (
    messageId: string,
    event: React.MouseEvent
  ) => {
    event.stopPropagation();
    // Close reaction popup and emoji picker if open
    setActiveReactionMessageId(null);
    setShowReactionEmojiPicker(false);
    // Toggle message options popup
    setActiveMessageOptionsId(
      activeMessageOptionsId === messageId ? null : messageId
    );
  };

  // Handle message option selection
  const handleMessageOptionSelect = (action: string, messageId?: number) => {
    console.log("Selected action:", action);

    if (action === "reply" && messageId) {
      // Find the message to reply to
      const message = messages.find((m) => m.id === messageId);
      if (message) {
        setReplyToMessage(message);
      }
    }

    // Close the options menu
    setActiveMessageOptionsId(null);
  };

  // Close message options popup on click outside or Escape key
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (activeMessageOptionsId !== null) {
        const target = event.target as HTMLElement;
        if (!target.closest(".reaction-container")) {
          setActiveMessageOptionsId(null);
        }
      }
    };

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && activeMessageOptionsId !== null) {
        setActiveMessageOptionsId(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscapeKey);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, [activeMessageOptionsId]);

  // Render message status indicator
  const renderMessageStatus = (messageId: number) => {
    const status = messageStatuses[messageId] || "sending";

    switch (status) {
      case "sending":
        return (
          <svg
            className="w-4 h-4 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        );
      case "delivered":
        return (
          <svg
            className="w-4 h-4 text-gray-400"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        );
      case "read":
        return (
          <div className="flex items-center">
            <svg
              className="w-4 h-4"
              style={{ color: "#64B5F6" }}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
            <svg
              className="w-4 h-4 -ml-2.5"
              style={{ color: "#64B5F6" }}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        );
      default:
        return null;
    }
  };

  const handleLanguageSelect = (language: string) => {
    setSelectedLanguage(language);
    setIsLanguageDropdownOpen(false);
  };

  // Handle incoming product data from Product Detail page
  useEffect(() => {
    console.log('Checking location state:', location.state);

    if (location.state?.conversation && !currentConversation) {
      console.log('🔄 Loading conversation from navigation state');
      const conversationId = location.state.conversation.id;

      // Only load if we're not already viewing it
      if (activeConversationId !== conversationId) {
        fetchConversationMessages(conversationId);
      }

      // Clear location state after a short delay
      setTimeout(() => {
        navigate(location.pathname, { replace: true, state: {} });
        console.log('🗑️ Cleared location state');
      }, 100);
    }
  }, [location.state, currentConversation, activeConversationId]);

  // Auto-scroll when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current && messages.length > 0) {
      messagesEndRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'end'
      });
    }
  }, [messages.length, activeConversationId]); // Scroll when messages or conversation changes

  // Cleanup for audio URLs
  useEffect(() => {
    return () => {
      // Clean up audio URLs to prevent memory leaks
      if (previewAudio) {
        previewAudio.pause();
        URL.revokeObjectURL(previewAudio.src);
      }
      if (currentAudio) {
        currentAudio.pause();
        URL.revokeObjectURL(currentAudio.src);
      }

      // Clean up any audio URLs in messages
      messages.forEach(message => {
        if (message.audioUrl && message.audioUrl.startsWith('blob:')) {
          URL.revokeObjectURL(message.audioUrl);
        }
      });
    };
  }, [previewAudio, currentAudio, messages]);

  // Scroll when sending a new message
  useEffect(() => {
    if (isSending && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'end'
      });
    }
  }, [isSending]);

  const handleSendMessage = async () => {
    console.log('handleSendMessage called');

    if (isSending) {
      console.log('Already sending, skipping...');
      return
    }

    if (!currentConversation?.id) {
      console.error('Cannot send: no conversation selected');
      addToast({
        type: "error",
        title: "Error",
        message: "No conversation selected",
        duration: 3000,
      });
      return;
    }

    const textToSend = messageText.trim();
    if (!textToSend && selectedFiles.length === 0) {
      console.log('No content to send')
      return; // Don't send empty messages
    }

    if (!socket || !isSocketConnected) {
      console.error('Cannot send: socket not connected');
      addToast({
        type: "error",
        title: "Connection Error",
        message: "Unable to connect. Please check your internet and try again.",
        duration: 4000,
      });
      return;
    }

    setIsSending(true);

    try {
      const textContent = textToSend;
      const filesToSend = [...selectedFiles];

      // Clear input immediately
      setMessageText("");
      setSelectedFiles([]);
      setShowFilePreview(false);
      setReplyToMessage(null);

      let messageSent = false;

      // Handle file attachments first
      if (filesToSend.length > 0) {
        for (const file of filesToSend) {
          try {
            // Get presigned URL
            const presignedResponse = await fetch(
              `${process.env.REACT_APP_API_URL}/chat/upload-url`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                },
                body: JSON.stringify({
                  fileName: file.name,
                  fileType: file.type,
                }),
              }
            );

            if (!presignedResponse.ok) {
              throw new Error("Failed to get upload URL");
            }

            const { data: uploadData } = await presignedResponse.json();

            // Upload file to S3
            const uploadResponse = await fetch(uploadData.presignedUrl, {
              method: "PUT",
              body: file,
              headers: {
                "Content-Type": file.type,
              },
            });

            if (!uploadResponse.ok) {
              throw new Error("Upload failed");
            }

            // Send message with file reference
            sendMessageViaSocket(currentConversation.id, {
              content: textContent || `Sent ${file.name}`,
              messageType: "FILE",
              fileUrl: uploadData.url,
              fileName: file.name,
              fileSize: file.size,
              productData: currentConversation.product
            });

            messageSent = true;

          } catch (error) {
            console.error("File upload failed:", error);
            addToast({
              type: "error",
              title: "File upload failed",
              message: "Unable to upload attachment. Please try again",
              duration: 4000,
            });
            return; // Stop if file upload fails
          }
        }
      }

      if (textContent && !messageSent) {
        // Send text message
        console.log('Sending text message via socket');
        sendMessageViaSocket(currentConversation.id, {
          content: textContent,
          messageType: "TEXT",
          productData: currentConversation.product
        });
        messageSent = true;
      }
      console.log('Message sent successfuly');

      // Refresh conversations to update last message
      await fetchConversations();

    } catch (error) {
      console.error("Error sending message:", error);
      addToast({
        type: "error",
        title: "Send Failed",
        message: "Failed to send message. Please try again.",
        duration: 4000,
      });
    } finally {
      setIsSending(false);
    }
  };

  // check socket connection
  useEffect(() => {
    if (!socket) return;

    const checkConnection = () => {
      if (!socket.connected && !socketInitialized) {
        console.log("Socket not connected, attempting to reconnect...");
        setSocketInitialized(false);
      }
    };

    // check connection status periodically
    const interval = setInterval(checkConnection, 5000);

    return () => {
      clearInterval(interval);
    };
  }, [socket, socketInitialized]);

  // manually open conversation from location state if not already opened
  const openConversationFromState = useCallback(async () => {
    if (location.state?.conversation && !currentConversation) {
      console.log('🔄 Manually opening conversation from state...');
      const conversationId = location.state.conversation.id;
      await fetchConversationMessages(conversationId);
    }
  }, [location.state, currentConversation, fetchConversationMessages]);

  // Call this on mount as backup
  useEffect(() => {
    openConversationFromState();
  }, [openConversationFromState]);

  // Save current conversation to localStorage
  useEffect(() => {
    if (currentConversation) {
      localStorage.setItem('currentConversation', JSON.stringify(currentConversation));
      localStorage.setItem('activeConversationId', currentConversation.id);
    }
  }, [currentConversation]);

  // Load current conversation from localStorage on component mount
  useEffect(() => {
    const savedConversation = localStorage.getItem('currentConversation');
    const savedConversationId = localStorage.getItem('activeConversationId');

    if (savedConversation && savedConversationId && !currentConversation && !location.state?.conversation) {
      try {
        const conversation = JSON.parse(savedConversation);
        console.log('🔄 Loaded conversation from localStorage:', conversation.id);

        setCurrentConversation(conversation);
        setActiveConversationId(savedConversationId);

        console.log('🔄 Loaded conversation from localStorage and messages not fetched');
      } catch (error) {
        console.error('Failed to parse saved conversation:', error);
      }
    }
  }, []);

  const handleAudioRecord = async () => {
    setIsRecording(true);
    setRecordingTime(0);
    setSoundDetected(false);

    // Initialize waveform with 20 bars
    setAudioLevels(Array(20).fill(0.1));

    // Start recording timer
    const timer = setInterval(() => {
      setRecordingTime((prev) => prev + 1);
    }, 1000);

    setRecordingTimer(timer);

    try {
      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setMediaStream(stream);

      // Create MediaRecorder for actual recording
      const recorder = new MediaRecorder(stream);
      const chunks: Blob[] = [];

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      recorder.onstop = () => {
        setAudioChunks(chunks);
      };

      recorder.start();
      setMediaRecorder(recorder);

      // Create audio context and analyser for visualization
      const audioCtx = new (window.AudioContext ||
        (window as any).webkitAudioContext)();
      const analyserNode = audioCtx.createAnalyser();
      const source = audioCtx.createMediaStreamSource(stream);

      analyserNode.fftSize = 256;
      analyserNode.smoothingTimeConstant = 0.8;
      source.connect(analyserNode);

      setAudioContext(audioCtx);
      setAnalyser(analyserNode);

      // Buffer for audio data
      const bufferLength = analyserNode.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      // Start waveform animation timer using real audio data
      const waveformTimer = setInterval(() => {
        analyserNode.getByteFrequencyData(dataArray);

        // Calculate average volume and create waveform
        const newLevels = Array(20)
          .fill(0)
          .map((_, index) => {
            // Sample different frequency ranges for each bar
            const startIndex = Math.floor((index / 20) * bufferLength);
            const endIndex = Math.floor(((index + 1) / 20) * bufferLength);

            // Get average amplitude for this frequency range
            let sum = 0;
            for (let i = startIndex; i < endIndex; i++) {
              sum += dataArray[i];
            }
            const average = sum / (endIndex - startIndex);

            // Normalize to 0.1-1.0 range (0-255 -> 0.1-1.0)
            const normalized = Math.max(
              0.1,
              Math.min(1.0, (average / 255) * 1.2 + 0.1)
            );

            return normalized;
          });

        setAudioLevels(newLevels);

        // Update sound detection based on overall volume
        const averageVolume =
          newLevels.reduce((a, b) => a + b, 0) / newLevels.length;
        setSoundDetected(averageVolume > 0.3);
      }, 50); // Update every 50ms for smooth animation

      setWaveformTimer(waveformTimer);
    } catch (error) {
      console.error("Error accessing microphone:", error);
      // Fallback to visual-only recording if mic access fails
      alert(
        "Could not access microphone. Recording will continue without audio visualization."
      );
    }
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    setSoundDetected(false);

    if (recordingTimer) {
      clearInterval(recordingTimer);
      setRecordingTimer(null);
    }

    if (soundTimer) {
      clearTimeout(soundTimer);
      setSoundTimer(null);
    }

    if (waveformTimer) {
      clearInterval(waveformTimer);
      setWaveformTimer(null);
    }

    // Stop MediaRecorder
    if (mediaRecorder && mediaRecorder.state !== "inactive") {
      mediaRecorder.stop();
    }

    // Stop microphone and clean up audio resources
    if (mediaStream) {
      mediaStream.getTracks().forEach((track) => track.stop());
      setMediaStream(null);
    }

    if (audioContext) {
      audioContext.close();
      setAudioContext(null);
    }

    setAnalyser(null);

    // Reset waveform to flat line
    setAudioLevels(Array(20).fill(0.1));

    // Keep the recording time for display purposes
  };

  const handleSendVoiceMessage = async () => {
    if (recordingTime === 0 || audioChunks.length === 0) return;

    try {
      const audioBlob = new Blob(audioChunks, { type: "audio/webm" });

      // Upload audio file first
      const presignedResponse = await fetch(
        `${process.env.REACT_APP_API_URL}/chat/upload-url`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
          body: JSON.stringify({
            fileName: `voice-message-${Date.now()}.webm`,
            fileType: 'audio/webm',
          }),
        }
      );

      if (!presignedResponse.ok) {
        throw new Error("Failed to get upload URL for audio");
      }

      const { data: uploadData } = await presignedResponse.json();

      // Upload audio to S3
      const uploadResponse = await fetch(uploadData.presignedUrl, {
        method: "PUT",
        body: audioBlob,
        headers: {
          "Content-Type": 'audio/webm',
        },
      });

      if (!uploadResponse.ok) {
        throw new Error("Audio upload failed");
      }

      // Send message with audio reference
      sendMessageViaSocket(currentConversation.id, {
        content: 'Audio message',
        messageType: 'AUDIO',
        audioUrl: uploadData.url,
        duration: recordingTime,
        fileSize: audioBlob.size
      });

      // Reset recording state
      setRecordingTime(0);
      setAudioChunks([]);
      setMediaRecorder(null);

    } catch (error) {
      console.error("Error sending voice message:", error);
      addToast({
        type: "error",
        title: "Audio Send Failed",
        message: "Failed to send audio message. Please try again.",
        duration: 4000,
      });
    }
  };

  // Handle audio preview playback (before sending)
  const handlePreviewPlayback = () => {
    // If already playing, pause it
    if (isPreviewPlaying && previewAudio) {
      previewAudio.pause();
      setIsPreviewPlaying(false);
      return;
    }

    // Create audio from recorded chunks
    if (audioChunks.length === 0) return;

    const audioBlob = new Blob(audioChunks, { type: "audio/webm" });
    const audioUrl = URL.createObjectURL(audioBlob);
    const audio = new Audio(audioUrl);

    setPreviewAudio(audio);
    setIsPreviewPlaying(true);
    setPreviewPlaybackTime(recordingTime);

    // Update countdown timer
    const updateTimer = setInterval(() => {
      setPreviewPlaybackTime((prev) => {
        const remaining = Math.max(0, prev - 1);
        if (remaining === 0) {
          clearInterval(updateTimer);
        }
        return remaining;
      });
    }, 1000);

    // Handle audio end
    audio.onended = () => {
      setIsPreviewPlaying(false);
      setPreviewAudio(null);
      clearInterval(updateTimer);
      setPreviewPlaybackTime(recordingTime);
      URL.revokeObjectURL(audioUrl);
    };

    // Handle audio pause
    audio.onpause = () => {
      clearInterval(updateTimer);
    };

    audio.play();
  };

  // Handle audio playback with play/pause toggle and countdown
  const handleAudioPlayback = (
    messageId: string,
    audioUrl: string,
    duration: number
  ) => {
    // If this message is already playing, pause it
    if (playingMessageId === messageId && currentAudio) {
      currentAudio.pause();
      setPlayingMessageId(null);
      setCurrentAudio(null);
      return;
    }

    // Stop any currently playing audio
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
    }

    // Create and play new audio
    const audio = new Audio(audioUrl);
    setCurrentAudio(audio);
    setPlayingMessageId(messageId);

    // Initialize playback time to full duration
    setAudioPlaybackTime((prev) => ({
      ...prev,
      [messageId]: duration,
    }));

    // Update countdown timer
    const updateTimer = setInterval(() => {
      setAudioPlaybackTime((prev) => {
        const remaining = Math.max(0, (prev[messageId] || duration) - 1);
        if (remaining === 0) {
          clearInterval(updateTimer);
        }
        return {
          ...prev,
          [messageId]: remaining,
        };
      });
    }, 1000);

    // Handle audio end
    audio.onended = () => {
      setPlayingMessageId(null);
      setCurrentAudio(null);
      clearInterval(updateTimer);
      setAudioPlaybackTime((prev) => ({
        ...prev,
        [messageId]: duration,
      }));
    };

    // Handle audio pause
    audio.onpause = () => {
      clearInterval(updateTimer);
    };

    audio.play();
  };

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      if (recordingTimer) {
        clearInterval(recordingTimer);
      }
      if (soundTimer) {
        clearTimeout(soundTimer);
      }
    };
  }, [recordingTimer, soundTimer]);

  // Handle clicks outside dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const languageSelector = target.closest(".language-selector");
      const menuDropdown = target.closest(".menu-dropdown");
      const emojiPicker = target.closest(".emoji-picker-container");
      const actionsMenu = target.closest(".actions-menu");

      if (!languageSelector && isLanguageDropdownOpen) {
        setIsLanguageDropdownOpen(false);
      }

      if (!menuDropdown && isMenuDropdownOpen) {
        setIsMenuDropdownOpen(false);
      }

      if (!emojiPicker && showEmojiPicker) {
        setShowEmojiPicker(false);
      }

      if (!actionsMenu && actionsMenuOpen !== null) {
        setActionsMenuOpen(null);
      }
    };

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && actionsMenuOpen !== null) {
        setActionsMenuOpen(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscapeKey);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, [
    isLanguageDropdownOpen,
    isMenuDropdownOpen,
    showEmojiPicker,
    actionsMenuOpen,
  ]);

  // Close reaction popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (
        activeReactionMessageId !== null &&
        !target.closest(".reaction-container")
      ) {
        setActiveReactionMessageId(null);
        setShowReactionEmojiPicker(false);
      }
    };

    if (activeReactionMessageId !== null) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [activeReactionMessageId]);

  // Refresh conversations when new messages arrive
  useEffect(() => {
    if (messages.length > 0 && activeConversationId) {
      // Refresh conversations to update last message previews
      const refreshConversations = async () => {
        await fetchConversations();
      };
      refreshConversations();
    }
  }, [messages.length, activeConversationId]);

  // Cleanup typing timer on unmount
  useEffect(() => {
    return () => {
      if (typingTimer) {
        clearTimeout(typingTimer);
      }
    };
  }, [typingTimer]);

  useEffect(() => {
    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [socket]);

  // Add this component before your return statement
  const MessageStatus = ({ status, timestamp }: { status: string, timestamp: string }) => {
    const getStatusIcon = () => {
      switch (status) {
        case 'sending':
          return (
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          );
        case 'sent':
          return (
            <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          );
        case 'delivered':
          return (
            <div className="flex items-center">
              <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
          );
        case 'read':
          return (
            <div className="flex items-center">
              <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <svg className="w-4 h-4 -ml-2.5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
          );
        default:
          return null;
      }
    };

    return (
      <div className="flex items-center space-x-1">
        <span className="text-xs text-gray-500">
          {new Date(timestamp).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
          })}
        </span>
        {getStatusIcon()}
      </div>
    );
  };

  return (
    <>
      {/* CSS for smooth fade animations */}
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fadeOutUp {
          from {
            opacity: 1;
            transform: translateY(0);
          }
          to {
            opacity: 0;
            transform: translateY(-30px);
          }
        }
        
        .message-fade-out {
          animation: fadeOutUp 0.5s ease-in-out forwards;
        }
        
        /* Hide scrollbar for webkit browsers (Chrome, Safari, Edge) */
        .overflow-y-auto::-webkit-scrollbar {
          display: none;
        }
      `}</style>

      <div className="h-screen bg-gray-50 flex overflow-hidden">
        {/* Hidden file input for file attachments */}
        <input
          id="file-upload"
          type="file"
          multiple
          accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.txt"
          onChange={handleFileSelect}
          style={{ display: "none" }}
        />
        {/* Left Sidebar - Full Height */}
        <div className="w-1/4 bg-white border-r-2 border-gray-300 flex flex-col h-screen sticky top-0 relative">
          {/* Chats List */}
          <div className="flex-1 flex flex-col">
            {/* Chats Header */}
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-xl text-black">Chats</h1>
                <button className="p-2 hover:bg-gray-200 rounded">
                  <img src={filterIcon} alt="Filter" className="w-5 h-5" />
                </button>
              </div>

              {/* Search Bar */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search a chat?"
                  value={chatSearchQuery}
                  onChange={(e) => setChatSearchQuery(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400"
                />
              </div>
            </div>

            {/* Chat List or Empty State */}
            {conversations.length > 0 ? (
              <div className="flex-1 flex flex-col">
                {/* Filter Tabs */}
                <div className="px-4 py-3">
                  <div className="relative">
                    {/* Gray baseline */}
                    <div className="absolute bottom-0 left-4 right-4 h-px bg-gray-200"></div>

                    <div className="flex space-x-6 relative">
                      <button
                        onClick={() => setSelectedTab("All")}
                        className={`text-sm font-medium pb-1 relative ${selectedTab === "All"
                          ? "text-gray-900"
                          : "text-gray-500 hover:text-gray-700"
                          }`}
                        style={{
                          color: selectedTab === "All" ? "#64B5F6" : undefined,
                        }}
                      >
                        All
                        {selectedTab === "All" && (
                          <div
                            className="absolute bottom-0 left-0 right-0 h-0.5"
                            style={{ backgroundColor: "#64B5F6" }}
                          ></div>
                        )}
                      </button>
                      <button
                        onClick={() => setSelectedTab("Unreads")}
                        className={`text-sm font-medium pb-1 relative ${selectedTab === "Unreads"
                          ? "text-gray-900"
                          : "text-gray-500 hover:text-gray-700"
                          }`}
                        style={{
                          color: selectedTab === "Unreads" ? "#64B5F6" : undefined,
                        }}
                      >
                        Unreads
                        {selectedTab === "Unreads" && (
                          <div
                            className="absolute bottom-0 left-0 right-0 h-0.5"
                            style={{ backgroundColor: "#64B5F6" }}
                          ></div>
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Conversations List */}
                <div className="flex-1 overflow-y-auto p-1">
                  {conversations
                    .filter(conversation => {
                      // Filter by search query
                      if (chatSearchQuery) {
                        const participantName = conversation.participants?.[0]?.firstName || 'Fonsah Pageo';
                        const lastMessage = conversation.lastMessage?.content || '';
                        return participantName.toLowerCase().includes(chatSearchQuery.toLowerCase()) ||
                          lastMessage.toLowerCase().includes(chatSearchQuery.toLowerCase());
                      }
                      return true;
                    })
                    .filter(conversation => {
                      // Filter by selected tab
                      if (selectedTab === "Unreads") {
                        // You might want to add an unread messages count to your conversation model
                        return conversation.unreadCount > 0;
                      }
                      return true;
                    })
                    .map((conversation) => (
                      <div
                        key={conversation.id}
                        className={`p-2 rounded-lg cursor-pointer transition-colors ${activeConversationId === conversation.id
                          ? "bg-gray-100"
                          : "hover:bg-gray-50"
                          }`}
                        onClick={async () => {
                          setActiveConversationId(conversation.id);
                          await fetchConversationMessages(conversation.id);

                          // Mark as read when opening conversation
                          if (socket) {
                            socket.emit("mark_as_read", conversation.id);
                          }
                        }}
                      >
                        <div className="flex items-center space-x-2">
                          <img
                            src={conversation.participants?.[0]?.profileImage || eboAvatar}
                            alt={conversation.participants?.[0]?.firstName || 'Pageo'}
                            className="w-10 h-10 rounded-sm object-cover"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <h3 className="font-semibold text-gray-900 truncate">
                                {conversation.participants?.[0]?.firstName || 'Fonsah'}
                              </h3>
                              <div className="flex items-center space-x-1">
                                <span className="text-xs text-gray-500">
                                  {new Date(conversation.updatedAt).toLocaleTimeString([], {
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}
                                </span>
                                <button
                                  onClick={(e) => handleActionsMenuClick(conversation.id, e)}
                                  className="p-1 rounded transition-colors"
                                  style={{
                                    color: actionsMenuOpen === conversation.id ? "#64B5F6" : "#000000",
                                  }}
                                >
                                  <span className="text-lg">⋯</span>
                                </button>
                              </div>
                            </div>
                            <div className="flex items-center justify-between -mt-1">
                              <p className="text-sm text-gray-600 truncate">
                                {conversation.lastMessage?.content || 'No messages yet'}
                              </p>
                              {/* You can add unread message indicators here */}
                              {conversation.unreadCount > 0 && (
                                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            ) : (
              /* Empty State */
              <div className="flex-1 flex flex-col items-center justify-center p-6">
                <div className="flex items-center justify-center mb-4">
                  <img
                    src={messagesIcon}
                    alt="Messages"
                    className="w-12 h-12"
                  />
                </div>
                <p className="text-center mb-2" style={{ color: "#999999" }}>
                  Your chats will appear here
                </p>
                <p className="text-sm text-center flex items-start justify-center">
                  <img
                    src={ssIcon}
                    alt="Search status"
                    className="w-4 h-4 mr-0.5 mt-0.5"
                  />
                  <span style={{ color: "#64B5F6" }}>
                    Love what you see?{" "}
                    <span className="cursor-pointer">
                      Reach out to the seller and make it yours.
                    </span>
                  </span>
                </p>
              </div>
            )}
          </div>

          {/* Actions Menu Overlay and Popup - Sidebar Level */}
          {actionsMenuOpen !== null && (
            <>
              {/* Semi-transparent overlay for sidebar only */}
              <div
                className="absolute inset-0 bg-black bg-opacity-20 z-40"
                onClick={() => setActionsMenuOpen(null)}
              ></div>

              {/* Actions Menu */}
              <div
                className="actions-menu absolute right-4 top-[21rem] bg-white shadow-lg border border-gray-200 py-2 z-50 min-w-48"
                style={{ borderRadius: "24px" }}
              >
                <div className="px-4 py-2 border-b border-gray-100 flex items-center justify-between">
                  <h3
                    className="text-sm font-thin"
                    style={{ color: "#BABABA" }}
                  >
                    Actions
                  </h3>
                  <button
                    onClick={() => setActionsMenuOpen(null)}
                    className="transition-colors"
                    style={{ color: "#374151" }}
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>

                <div className="py-1">
                  <button
                    onClick={() =>
                      handleActionSelect("Mark as read", actionsMenuOpen)
                    }
                    className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center space-x-3"
                  >
                    <img
                      src={actionIcon01}
                      alt="Mark as read"
                      className="w-4 h-4"
                    />
                    <span className="font-light" style={{ color: "#374151" }}>
                      Mark as read
                    </span>
                  </button>

                  <button
                    onClick={() =>
                      handleActionSelect("Add label", actionsMenuOpen)
                    }
                    className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center space-x-3"
                  >
                    <img
                      src={actionIcon02}
                      alt="Add label"
                      className="w-4 h-4"
                    />
                    <span className="font-light" style={{ color: "#374151" }}>
                      Add label
                    </span>
                  </button>

                  <button
                    onClick={() =>
                      handleActionSelect("Mute the chat", actionsMenuOpen)
                    }
                    className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center space-x-3"
                  >
                    <img
                      src={actionIcon03}
                      alt="Mute the chat"
                      className="w-4 h-4"
                    />
                    <span className="font-light" style={{ color: "#374151" }}>
                      Mute the chat
                    </span>
                    <img
                      src={muteArrowIcon}
                      alt="Arrow"
                      className="w-4 h-4 ml-auto"
                    />
                  </button>

                  <button
                    onClick={() =>
                      handleActionSelect("Pin the chat", actionsMenuOpen)
                    }
                    className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center space-x-3"
                  >
                    <img
                      src={actionIcon04}
                      alt="Pin the chat"
                      className="w-4 h-4"
                    />
                    <span className="font-light" style={{ color: "#374151" }}>
                      Pin the chat
                    </span>
                  </button>

                  <button
                    onClick={() =>
                      handleActionSelect("Archive the chat", actionsMenuOpen)
                    }
                    className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center space-x-3"
                  >
                    <img
                      src={actionIcon05}
                      alt="Archive the chat"
                      className="w-4 h-4"
                    />
                    <span className="font-light" style={{ color: "#374151" }}>
                      Archive the chat
                    </span>
                  </button>

                  <button
                    onClick={() =>
                      handleActionSelect("Delete the chat", actionsMenuOpen)
                    }
                    className="w-full px-4 py-2 text-left text-sm hover:bg-red-50 flex items-center space-x-3"
                  >
                    <img
                      src={actionIcon06}
                      alt="Delete the chat"
                      className="w-4 h-4"
                    />
                    <span className="font-light" style={{ color: "#374151" }}>
                      Delete the chat
                    </span>
                  </button>
                </div>
              </div>
            </>
          )}

          {/* Archive and Important Section - Only show when there are conversations */}
          {conversations.length > 0 && (
            <div className="mt-auto bg-white px-4 py-3">
              <div className="border-t border-gray-300 mx-1 mb-3"></div>
              {/* Archived */}
              <div className="flex items-center justify-between py-2 cursor-pointer hover:bg-gray-50 rounded-lg px-2 transition-colors">
                <div className="flex items-center space-x-3">
                  <img
                    src={archiveIcon}
                    alt="Archived"
                    className="w-5 h-5"
                    style={{ color: "#6A6A6A" }}
                  />
                  <span className="text-sm" style={{ color: "#6A6A6A" }}>
                    Archived
                  </span>
                </div>
                <span
                  className="text-xs px-2 py-0.5 rounded-full"
                  style={{ backgroundColor: "#F5F5F5", color: "#6A6A6A" }}
                >
                  {/* You can calculate archived conversations count here */}
                  {conversations.filter(conv => conv.isArchived).length}
                </span>
              </div>

              {/* Mark as important */}
              <div className="flex items-center justify-between py-2 cursor-pointer hover:bg-gray-50 rounded-lg px-2 transition-colors">
                <div className="flex items-center space-x-3">
                  <img
                    src={starIcon}
                    alt="Mark as important"
                    className="w-5 h-5"
                    style={{ color: "#6A6A6A" }}
                  />
                  <span className="text-sm" style={{ color: "#6A6A6A" }}>
                    Mark as important
                  </span>
                </div>
                <span
                  className="text-xs px-2 py-0.5 rounded-full"
                  style={{ backgroundColor: "#F5F5F5", color: "#6A6A6A" }}
                >
                  {/* You can calculate important conversations count here */}
                  {conversations.filter(conv => conv.isImportant).length}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col h-screen overflow-hidden">
          {/* Main Content Area */}
          <div
            className="flex-1 bg-white border border-gray-200 rounded-2xl mx-8 my-8 flex flex-col"
            style={{ height: "calc(100vh - 8rem)" }}
          >
            {/* Show chat UI when we have an active conversation OR productData */}
            {currentConversation && activeConversationId ? (
              // Product Inquiry View
              <div className="flex flex-col h-full relative">
                {/* Dimmed Overlay when reaction or message options popup is active */}
                {(activeReactionMessageId !== null ||
                  activeMessageOptionsId !== null) && (
                    <div className="absolute inset-0 bg-black bg-opacity-10 z-40 pointer-events-none rounded-2xl"></div>
                  )}

                {/* Scrollable Content Area (Profile + Product + Messages) */}
                <div
                  className="flex-1 overflow-y-auto"
                  style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                >
                  {/* Seller Profile Header - Conditional Rendering */}
                  {!showCondensedHeader ? (
                    // Full Profile Header
                    <div className="p-6 transition-all duration-500 ease-in-out">
                      {/* Top Right Icons */}
                      <div className="flex justify-end space-x-3 mb-6">
                        {/* close conersation button */}
                        <button
                          onClick={closeActiveConversation}
                          className="p-3 rounded-lg bg-white hover:bg-gray-50 transition-colors border border-gray-200 shadow-sm"
                          title="Close conversation"
                        >
                          <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>

                        <button className="p-3 rounded-lg bg-white hover:bg-gray-50 transition-colors border border-gray-200 shadow-sm">
                          <img src={fiIcon} alt="Search" className="w-6 h-6" />
                        </button>

                        <button className="p-3 rounded-lg bg-white hover:bg-gray-50 transition-colors border border-gray-200 shadow-sm">
                          <img
                            src={faIcon}
                            alt="Settings"
                            className="w-6 h-6"
                          />
                        </button>
                      </div>

                      {/* Profile Card */}
                      <div className="bg-white rounded-lg p-6 pt-2 max-w-4xl mx-auto">
                        <div className="text-center">
                          {/* Avatar */}
                          <img
                            src={eboAvatar}
                            alt={productData?.seller?.name || 'Seller'}
                            className="w-20 h-20 rounded-full object-cover mx-auto mb-4"
                          />

                          {/* Name and Rating */}
                          <div className="flex items-center justify-center space-x-2 mb-4">
                            <h3 className="text-xl font-semibold text-gray-900">
                              Joaquin EDIMO
                            </h3>
                            <div className="flex items-center space-x-2">
                              <svg
                                className="w-6 h-6 text-yellow-400"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                              <span
                                className="text-lg"
                                style={{ color: "#BABABA" }}
                              >
                                4.3
                              </span>
                            </div>
                          </div>

                          {/* Seller Info */}
                          <div className="flex items-center justify-center space-x-6 text-sm mb-4">
                            <div className="flex items-center space-x-2">
                              <img
                                src={earthIcon}
                                alt="Website"
                                className="w-4 h-4"
                              />
                              <span style={{ color: "#64B5F6" }}>
                                user-randomlink.com
                              </span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <img
                                src={locIcon}
                                alt="Location"
                                className="w-4 h-4"
                              />
                              <span style={{ color: "#64B5F6" }}>
                                London, United Kingdom
                              </span>
                            </div>
                          </div>

                          {/* Join Date */}
                          <div className="flex items-center justify-center space-x-2 text-sm mb-4">
                            <img
                              src={profileIcon}
                              alt="Profile"
                              className="w-4 h-4"
                            />
                            <span style={{ color: "#BABABA" }}>
                              Joined BAO' Afrik in June 2018
                            </span>
                          </div>

                          {/* Description */}
                          <div className="text-left">
                            <p
                              className="text-sm leading-relaxed mb-4 text-justify"
                              style={{ color: "#BABABA" }}
                            >
                              Passionate about discovering unique products and
                              always on the lookout for great deals. I enjoy
                              exploring new brands, trying out innovative items,
                              and supporting businesses that deliver quality and
                              creativity.
                            </p>
                          </div>

                          {/* See User Profile Button */}
                          <button
                            className="px-6 py-2 rounded-lg text-sm font-medium transition-colors"
                            style={{
                              backgroundColor: "#F0F8FE",
                              color: "#64B5F6",
                            }}
                          >
                            See user profile
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    // Condensed Header Bar
                    <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 transition-all duration-500 ease-in-out">
                      <div className="flex items-center space-x-3">
                        {/* Profile Picture */}
                        <img
                          src={eboAvatar}
                          alt="Joaquin EDIMO"
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        {/* Name and Rating */}
                        <div>
                          <h3 className="text-base font-semibold text-gray-900">
                            Joaquin EDIMO
                          </h3>
                          <div className="flex items-center space-x-1">
                            <svg
                              className="w-4 h-4 text-yellow-400"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                            <span
                              className="text-sm"
                              style={{ color: "#BABABA" }}
                            >
                              4.3
                            </span>
                          </div>
                        </div>
                      </div>
                      {/* Right Icons */}
                      <div className="flex items-center space-x-2">
                        {/* close conversation button */}
                        <button
                          onClick={closeActiveConversation}
                          className="p-3 rounded-lg bg-white hover:bg-gray-50 transition-colors border border-gray-200 shadow-sm"
                          title="Close conversation"
                        >
                          <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>

                        <button className="p-2 rounded-lg hover:bg-gray-50 transition-colors">
                          <img src={fiIcon} alt="Search" className="w-5 h-5" />
                        </button>

                        <button className="p-2 rounded-lg hover:bg-gray-50 transition-colors">
                          <img
                            src={faIcon}
                            alt="Settings"
                            className="w-5 h-5"
                          />
                        </button>
                        {/* <button
                          onClick={closeActiveConversation}
                          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                          title="Close conversation"
                        >
                          <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button> */}
                      </div>
                    </div>
                  )}

                  {/* Chat Messages Area */}
                  {visibleMessages.length > 0 && (
                    <div
                      ref={messagesContainerRef}
                      className="flex-1 px-6 py-4 overflow-y-auto scroll-smooth"
                      style={{ scrollBehavior: "smooth", overflowX: "visible" }}
                    >
                      {/* View Older Messages Button */}
                      {messages.length > 10 && !showAllMessages && (
                        <div className="flex justify-center mb-4">
                          <button
                            onClick={() => setShowAllMessages(true)}
                            className="px-3 py-1.5 rounded-full text-xs font-medium transition-colors hover:opacity-80"
                            style={{
                              backgroundColor: "#E3F2FD",
                              color: "#64B5F6",
                            }}
                          >
                            View older messages
                          </button>
                        </div>
                      )}

                      {/* Top Timestamp - Shorter lines */}
                      <div className="flex items-center justify-center mb-6">
                        <div className="flex items-center">
                          <div className="w-16 h-px bg-gray-300"></div>
                          <span className="px-4 text-sm text-gray-500">
                            {visibleMessages[0]?.dateString}
                          </span>
                          <div className="w-16 h-px bg-gray-300"></div>
                        </div>
                      </div>

                      {/* Messages */}
                      {visibleMessages.map((message, index) => {
                        const isFadingOut = fadingOutMessageIds.includes(
                          message.id
                        );
                        const isReactionActive =
                          activeReactionMessageId === message.id;
                        return (
                          <div
                            key={message.id}
                            className={`flex mb-4 ${message.isIncoming
                              ? "justify-start"
                              : "justify-end"
                              } ${isFadingOut ? "message-fade-out" : ""}`}
                            style={{
                              animation: isFadingOut
                                ? "fadeOutUp 0.5s ease-in-out forwards"
                                : "fadeIn 0.5s ease-in-out",
                              opacity: isFadingOut ? 0 : 1,
                              position: isReactionActive
                                ? "relative"
                                : "static",
                              zIndex: isReactionActive ? 50 : "auto",
                            }}
                          >
                            <div className="max-w-xs lg:max-w-md relative">
                              <div
                                className={`rounded-2xl p-4 ${message.isIncoming
                                  ? "rounded-bl-md cursor-pointer"
                                  : "rounded-br-md"
                                  }`}
                                style={{
                                  backgroundColor: message.isIncoming
                                    ? "#F0F8FE"
                                    : "#64B5F6",
                                }}
                                onClick={
                                  message.isIncoming
                                    ? () =>
                                      handleIncomingMessageClick(message.id)
                                    : undefined
                                }
                              >
                                {message.type === "voice" ? (
                                  // Voice Message Display
                                  <div className="space-y-2">
                                    {/* Reply Preview for Voice Messages */}
                                    {message.replyTo && (
                                      <div className="flex items-stretch">
                                        <div
                                          className="rounded-full mr-2"
                                          style={{
                                            width: "2px",
                                            backgroundColor: "#FFFFFF",
                                          }}
                                        ></div>
                                        <div className="flex-1">
                                          <p
                                            className="text-xs font-medium"
                                            style={{
                                              color: "rgba(255, 255, 255, 0.9)",
                                            }}
                                          >
                                            {message.replyTo.sender}
                                          </p>
                                          <p
                                            className="text-xs"
                                            style={{
                                              color: "rgba(255, 255, 255, 0.6)",
                                            }}
                                          >
                                            {message.replyTo.text}
                                          </p>
                                        </div>
                                      </div>
                                    )}

                                    {/* Voice Message Content */}
                                    <div className="flex items-center space-x-3">
                                      <div className="relative">
                                        <img
                                          src={avatarIcon}
                                          alt="Your Avatar"
                                          className="w-10 h-10 rounded-full"
                                        />
                                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-white rounded-full flex items-center justify-center">
                                          <img
                                            src={swiIcon}
                                            alt="Waveform"
                                            className="w-3.5 h-3.5"
                                          />
                                        </div>
                                      </div>
                                      <div className="flex items-center space-x-2">
                                        <button
                                          onClick={() => {
                                            if (message.audioUrl) {
                                              handleAudioPlayback(
                                                message.id,
                                                message.audioUrl,
                                                message.duration
                                              );
                                            }
                                          }}
                                          className="hover:opacity-80 transition-opacity"
                                        >
                                          {playingMessageId === message.id ? (
                                            // Pause icon
                                            <svg
                                              className="w-8 h-8 text-white fill-current"
                                              viewBox="0 0 24 24"
                                              style={{
                                                filter:
                                                  "drop-shadow(0 0 2px rgba(255,255,255,0.3))",
                                              }}
                                            >
                                              <path
                                                d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"
                                                style={{ fillRule: "evenodd" }}
                                              />
                                            </svg>
                                          ) : (
                                            // Play icon
                                            <svg
                                              className="w-8 h-8 text-white fill-current"
                                              viewBox="0 0 24 24"
                                              style={{
                                                filter:
                                                  "drop-shadow(0 0 2px rgba(255,255,255,0.3))",
                                              }}
                                            >
                                              <path
                                                d="M8 5v14l11-7z"
                                                style={{ fillRule: "evenodd" }}
                                              />
                                            </svg>
                                          )}
                                        </button>
                                        <span className="text-white text-sm">
                                          {(() => {
                                            const time =
                                              audioPlaybackTime[message.id] !==
                                                undefined
                                                ? audioPlaybackTime[message.id]
                                                : message.duration;
                                            return `${Math.floor(time / 60)
                                              .toString()
                                              .padStart(2, "0")} : ${(time % 60)
                                                .toString()
                                                .padStart(2, "0")}`;
                                          })()}
                                        </span>
                                        <div className="w-2 h-0.5 bg-white/70 rounded-full mx-0.5"></div>
                                        <span className="text-white text-sm">
                                          Audio
                                        </span>
                                      </div>
                                      <div className="flex items-center justify-center space-x-0.5">
                                        {[
                                          4, 6, 4, 8, 12, 14, 16, 14, 12, 8, 6,
                                          4, 8, 10, 12, 10, 8, 6, 4, 6,
                                        ].map((h, i) => (
                                          <div
                                            key={i}
                                            className="w-0.5 bg-white rounded-full"
                                            style={{
                                              height: `${h}px`,
                                            }}
                                          />
                                        ))}
                                      </div>
                                    </div>
                                  </div>
                                ) : message.attachments &&
                                  message.attachments.length > 0 ? (
                                  // File Attachment Message Display
                                  <div className="space-y-2">
                                    {message.text && (
                                      <p
                                        className="text-sm"
                                        style={{
                                          color: message.isIncoming
                                            ? "#6A6A6A"
                                            : "#FFFFFF",
                                        }}
                                      >
                                        {message.text}
                                      </p>
                                    )}
                                    <div className="space-y-2">
                                      {message.attachments.map(
                                        (file: any, index: number) => (
                                          <div
                                            key={index}
                                            onClick={() =>
                                              handleFileClick(file)
                                            }
                                            className="flex items-center space-x-3 p-3 bg-white/20 rounded-lg cursor-pointer hover:bg-white/30 transition-colors"
                                          >
                                            <div className="w-10 h-10 bg-white/30 rounded-lg flex items-center justify-center">
                                              <svg
                                                className="w-5 h-5 text-white"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                              >
                                                <path
                                                  strokeLinecap="round"
                                                  strokeLinejoin="round"
                                                  strokeWidth={2}
                                                  d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                                                />
                                              </svg>
                                            </div>
                                            <div className="flex-1">
                                              <p className="text-white text-sm font-medium">
                                                {file.name}
                                              </p>
                                              <p className="text-white/80 text-xs">
                                                {formatFileSize(file.size)}
                                              </p>
                                            </div>
                                            <div className="w-6 h-6 bg-white/30 rounded flex items-center justify-center">
                                              <svg
                                                className="w-3 h-3 text-white"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                              >
                                                <path
                                                  strokeLinecap="round"
                                                  strokeLinejoin="round"
                                                  strokeWidth={2}
                                                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                                                />
                                              </svg>
                                            </div>
                                          </div>
                                        )
                                      )}
                                    </div>
                                  </div>
                                ) : (
                                  // Text Message Display
                                  <>
                                    {/* Reply Section */}
                                    {message.replyTo && (
                                      <div className="mb-3">
                                        {/* User's reply text at top */}
                                        <p
                                          className="text-sm mb-2"
                                          style={{ color: "#FFFFFF" }}
                                        >
                                          {message.text}
                                        </p>

                                        {/* White line and quoted message */}
                                        <div className="flex items-stretch">
                                          {/* Vertical white line */}
                                          <div
                                            className="rounded-full mr-2"
                                            style={{
                                              width: "2px",
                                              backgroundColor: "#FFFFFF",
                                              flexShrink: 0,
                                            }}
                                          ></div>

                                          {/* Quoted message info */}
                                          <div className="flex-1">
                                            <p
                                              className="text-xs font-medium mb-0.5"
                                              style={{
                                                color:
                                                  "rgba(255, 255, 255, 0.9)",
                                              }}
                                            >
                                              {message.replyTo.sender}
                                            </p>
                                            <p
                                              className="text-xs"
                                              style={{
                                                color:
                                                  "rgba(255, 255, 255, 0.6)",
                                              }}
                                            >
                                              {message.replyTo.text}
                                            </p>
                                          </div>
                                        </div>
                                      </div>
                                    )}

                                    {/* Regular message text (only show if no reply) */}
                                    {!message.replyTo && (
                                      <p
                                        className="text-sm mb-3"
                                        style={{
                                          color: message.isIncoming
                                            ? "#6A6A6A"
                                            : "#FFFFFF",
                                        }}
                                      >
                                        {getMessageDisplayText(message)}
                                      </p>
                                    )}

                                    {/* Product Card in Message - Only for first message */}
                                    {message.isProductInquiry &&
                                      message.productData && (
                                        <div className="rounded-lg p-3 mt-3">
                                          <div className="flex space-x-4">
                                            <div className="relative">
                                              <div
                                                className="absolute -left-3 top-0 w-0.5 h-24"
                                                style={{
                                                  backgroundColor: "#FFFFFF",
                                                }}
                                              ></div>
                                              <img
                                                src={message.productData?.image}
                                                alt={message.productData?.name}
                                                className="w-24 h-24 object-cover"
                                              />
                                            </div>
                                            <div className="flex-1">
                                              <div className="flex items-center justify-between">
                                                <div
                                                  className="text-xl font-semibold"
                                                  style={{ color: "#B8DDFB" }}
                                                >
                                                  ${message.productData?.price}
                                                </div>
                                                <div
                                                  className="flex items-center space-x-2 text-[10px]"
                                                  style={{ color: "#B8DDFB" }}
                                                >
                                                  <img
                                                    src={locIcon}
                                                    alt="Location"
                                                    className="w-4 h-4"
                                                  />
                                                  <span>
                                                    {
                                                      message.productData
                                                        .location
                                                    }
                                                  </span>
                                                </div>
                                              </div>
                                              <div className="flex items-center justify-between -mt-0.5">
                                                <h4
                                                  className="text-xs font-medium"
                                                  style={{ color: "#B8DDFB" }}
                                                >
                                                  {message.productData?.name}
                                                </h4>
                                                <div
                                                  className="text-[10px]"
                                                  style={{ color: "#B8DDFB" }}
                                                >
                                                  <span>
                                                    Category:{" "}
                                                    {
                                                      message.productData
                                                        .category
                                                    }
                                                  </span>
                                                </div>
                                              </div>
                                              <p
                                                className="text-[10px] mt-2 leading-relaxed"
                                                style={{ color: "#B8DDFB" }}
                                              >
                                                Premium White Pepper sourced
                                                from the fertile soils of
                                                Africa.
                                                <br />
                                                Known for its smooth, aromatic
                                                heat and rich flavor...
                                              </p>
                                              <a
                                                href="#"
                                                className="text-xs mt-1 block"
                                                style={{ color: "#182073" }}
                                              >
                                                baoafrik.com/product-id-link?
                                              </a>
                                            </div>
                                          </div>
                                        </div>
                                      )}
                                  </>
                                )}
                              </div>

                              {/* Bottom Timestamp */}
                              <div
                                className={`flex items-center mt-2 ${message.isIncoming
                                  ? "justify-start"
                                  : "justify-end"
                                  }`}
                              >
                                <span
                                  className="text-xs mr-1"
                                  style={{ color: "#6A6A6A" }}
                                >
                                  {message.timestamp}
                                </span>
                                {!message.isIncoming && (
                                  <MessageStatus status={message.status} timestamp={message.timestamp} />
                                )}

                                {/* Reaction Display - inline after timestamp */}
                                {message.reaction && (
                                  <div
                                    className="ml-6 cursor-pointer hover:opacity-80 transition-opacity"
                                    onClick={() =>
                                      handleRemoveReaction(message.id)
                                    }
                                    style={{
                                      backgroundColor: "#F0F8FE",
                                      border: "1px solid #CFE8FC",
                                      borderRadius: "12px",
                                      padding: "4px 10px",
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                      minWidth: "40px",
                                      height: "24px",
                                      marginTop: "-2px",
                                    }}
                                  >
                                    <span
                                      style={{
                                        fontSize: "14px",
                                        lineHeight: 1,
                                      }}
                                    >
                                      {message.reaction}
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Reaction and Option Icons for Incoming Messages - Outside the message bubble */}
                            {message.isIncoming &&
                              clickedMessageId === message.id && (
                                <div
                                  className="flex items-center ml-1 self-center reaction-container relative"
                                  style={{
                                    zIndex:
                                      activeReactionMessageId === message.id ||
                                        activeMessageOptionsId === message.id
                                        ? 999
                                        : "auto",
                                  }}
                                >
                                  <button
                                    className="p-1 hover:opacity-70 transition-opacity"
                                    onClick={(e) =>
                                      handleReactionClick(message.id, e)
                                    }
                                  >
                                    <img
                                      src={reactionIcon}
                                      alt="Reaction"
                                      className="w-6 h-6"
                                      style={{
                                        filter:
                                          activeReactionMessageId === message.id
                                            ? "brightness(0) saturate(100%) invert(64%) sepia(49%) saturate(2012%) hue-rotate(176deg) brightness(95%) contrast(93%)"
                                            : "none",
                                      }}
                                    />
                                  </button>
                                  <button
                                    className="p-1 hover:opacity-70 transition-opacity"
                                    onClick={(e) =>
                                      handleMessageOptionsClick(message.id, e)
                                    }
                                  >
                                    <img
                                      src={optionIcon}
                                      alt="Options"
                                      className="w-6 h-6"
                                      style={{
                                        filter:
                                          activeMessageOptionsId === message.id
                                            ? "brightness(0) saturate(100%) invert(64%) sepia(49%) saturate(2012%) hue-rotate(176deg) brightness(95%) contrast(93%)"
                                            : "none",
                                      }}
                                    />
                                  </button>

                                  {/* Reaction Popup */}
                                  {activeReactionMessageId === message.id && (
                                    <div
                                      className="absolute bottom-full mb-2"
                                      style={{
                                        left: "-24px",
                                        right: "-24px",
                                        zIndex: 999,
                                      }}
                                    >
                                      {/* Speech bubble with tail */}
                                      <div
                                        className="relative bg-white shadow-lg px-4 py-2.5 flex items-center justify-center space-x-1.5 border border-gray-200"
                                        style={{
                                          borderRadius: "20px",
                                          minWidth: "280px",
                                        }}
                                      >
                                        <button
                                          onClick={() =>
                                            handleReactionSelect("👍")
                                          }
                                          className="hover:scale-110 transition-transform flex items-center justify-center"
                                          style={{
                                            width: "32px",
                                            height: "32px",
                                          }}
                                        >
                                          <Emoji unified="1f44d" size={24} />
                                        </button>
                                        <button
                                          onClick={() =>
                                            handleReactionSelect("❤️")
                                          }
                                          className="hover:scale-110 transition-transform flex items-center justify-center"
                                          style={{
                                            width: "32px",
                                            height: "32px",
                                          }}
                                        >
                                          <Emoji
                                            unified="2764-fe0f"
                                            size={24}
                                          />
                                        </button>
                                        <button
                                          onClick={() =>
                                            handleReactionSelect("✅")
                                          }
                                          className="hover:scale-110 transition-transform flex items-center justify-center"
                                          style={{
                                            width: "32px",
                                            height: "32px",
                                          }}
                                        >
                                          <Emoji unified="2705" size={24} />
                                        </button>
                                        <button
                                          onClick={() =>
                                            handleReactionSelect("😂")
                                          }
                                          className="hover:scale-110 transition-transform flex items-center justify-center"
                                          style={{
                                            width: "32px",
                                            height: "32px",
                                          }}
                                        >
                                          <Emoji unified="1f602" size={24} />
                                        </button>
                                        <button
                                          onClick={() =>
                                            handleReactionSelect("😊")
                                          }
                                          className="hover:scale-110 transition-transform flex items-center justify-center"
                                          style={{
                                            width: "32px",
                                            height: "32px",
                                          }}
                                        >
                                          <Emoji unified="1f60a" size={24} />
                                        </button>
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            setShowReactionEmojiPicker(
                                              !showReactionEmojiPicker
                                            );
                                          }}
                                          className="hover:scale-110 transition-transform flex items-center justify-center"
                                          style={{
                                            width: "32px",
                                            height: "32px",
                                          }}
                                        >
                                          <img
                                            src={emoji6}
                                            alt="More reactions"
                                            style={{
                                              width: "24px",
                                              height: "24px",
                                              objectFit: "contain",
                                            }}
                                          />
                                        </button>
                                        {/* Triangle tail pointing to reaction button */}
                                        <div
                                          style={{
                                            position: "absolute",
                                            left: "calc(16px + 4px + 16px)", // px-4 (16px) + space-x-1.5 (6px) + half button width (16px)
                                            bottom: "-6px",
                                            width: 0,
                                            height: 0,
                                            borderLeft: "6px solid transparent",
                                            borderRight:
                                              "6px solid transparent",
                                            borderTop: "6px solid white",
                                          }}
                                        ></div>
                                      </div>

                                      {/* Emoji Picker for Reactions */}
                                      {showReactionEmojiPicker && (
                                        <div
                                          className="absolute top-full mt-2 z-50"
                                          style={{
                                            left: "50%",
                                            transform: "translateX(-50%)",
                                          }}
                                          onClick={(e) => e.stopPropagation()}
                                        >
                                          <EmojiPicker
                                            onEmojiClick={(emojiObject) => {
                                              handleReactionSelect(
                                                emojiObject.emoji
                                              );
                                              setShowReactionEmojiPicker(false);
                                            }}
                                            width={300}
                                            height={400}
                                          />
                                        </div>
                                      )}
                                    </div>
                                  )}

                                  {/* Message Options Popup */}
                                  {activeMessageOptionsId === message.id && (
                                    <div
                                      className="absolute -left-12"
                                      style={{
                                        zIndex: 999,
                                        top: index <= 1 ? "-200px" : "auto",
                                        bottom: index > 1 ? "100%" : "auto",
                                        marginBottom: index > 1 ? "8px" : "0",
                                      }}
                                    >
                                      <div
                                        className="relative bg-white rounded-2xl shadow-xl py-2 px-1 border border-gray-200"
                                        style={{ minWidth: "180px" }}
                                      >
                                        {/* Header */}
                                        <div className="flex items-center justify-between px-3 mb-1">
                                          <span
                                            className="font-medium"
                                            style={{
                                              color: "#9CA3AF",
                                              fontSize: "10px",
                                            }}
                                          >
                                            Actions
                                          </span>
                                          <button
                                            onClick={() =>
                                              setActiveMessageOptionsId(null)
                                            }
                                            className="text-gray-500 hover:text-gray-700"
                                          >
                                            <svg
                                              width="14"
                                              height="14"
                                              viewBox="0 0 16 16"
                                              fill="none"
                                            >
                                              <path
                                                d="M12 4L4 12M4 4L12 12"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                              />
                                            </svg>
                                          </button>
                                        </div>

                                        {/* Menu Items */}
                                        <div className="space-y-0.5">
                                          <button
                                            onClick={() =>
                                              handleMessageOptionSelect(
                                                "reply",
                                                message.id
                                              )
                                            }
                                            className="w-full flex items-center px-3 py-1.5 hover:bg-gray-50 transition-colors"
                                          >
                                            <img
                                              src={replyIcon}
                                              alt="Reply"
                                              className="w-4 h-4 mr-2"
                                            />
                                            <span
                                              className="text-xs"
                                              style={{ color: "#6B7280" }}
                                            >
                                              Reply the message
                                            </span>
                                          </button>

                                          <button
                                            onClick={() =>
                                              handleMessageOptionSelect(
                                                "important"
                                              )
                                            }
                                            className="w-full flex items-center px-3 py-1.5 hover:bg-gray-50 transition-colors"
                                          >
                                            <img
                                              src={starIcon}
                                              alt="Star"
                                              className="w-4 h-4 mr-2"
                                            />
                                            <span
                                              className="text-xs"
                                              style={{ color: "#6B7280" }}
                                            >
                                              Mark as important
                                            </span>
                                          </button>

                                          <button
                                            onClick={() =>
                                              handleMessageOptionSelect("copy")
                                            }
                                            className="w-full flex items-center px-3 py-1.5 hover:bg-gray-50 transition-colors"
                                          >
                                            <img
                                              src={copyIcon}
                                              alt="Copy"
                                              className="w-4 h-4 mr-2"
                                            />
                                            <span
                                              className="text-xs"
                                              style={{ color: "#6B7280" }}
                                            >
                                              Copy the message
                                            </span>
                                          </button>

                                          <button
                                            onClick={() =>
                                              handleMessageOptionSelect(
                                                "select"
                                              )
                                            }
                                            className="w-full flex items-center px-3 py-1.5 hover:bg-gray-50 transition-colors"
                                          >
                                            <img
                                              src={tickIcon}
                                              alt="Select"
                                              className="w-4 h-4 mr-2"
                                            />
                                            <span
                                              className="text-xs"
                                              style={{ color: "#6B7280" }}
                                            >
                                              Select the message
                                            </span>
                                          </button>

                                          <button
                                            onClick={() =>
                                              handleMessageOptionSelect("pin")
                                            }
                                            className="w-full flex items-center px-3 py-1.5 hover:bg-gray-50 transition-colors"
                                          >
                                            <img
                                              src={pinMenuIcon}
                                              alt="Pin"
                                              className="w-4 h-4 mr-2"
                                            />
                                            <span
                                              className="text-xs"
                                              style={{ color: "#6B7280" }}
                                            >
                                              Pin the message
                                            </span>
                                          </button>

                                          <button
                                            onClick={() =>
                                              handleMessageOptionSelect(
                                                "delete"
                                              )
                                            }
                                            className="w-full flex items-center px-3 py-1.5 hover:bg-gray-50 transition-colors"
                                          >
                                            <img
                                              src={trashIcon}
                                              alt="Delete"
                                              className="w-4 h-4 mr-2"
                                            />
                                            <span
                                              className="text-xs"
                                              style={{ color: "#6B7280" }}
                                            >
                                              Delete for me
                                            </span>
                                          </button>
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              )}
                          </div>
                        );
                      })}

                      {/* Typing Indicator */}
                      {showTypingIndicator && (
                        <div className="flex justify-start mb-4">
                          <div className="max-w-20">
                            <div
                              className="rounded-2xl rounded-bl-md px-3 py-2 flex items-center"
                              style={{ backgroundColor: "#F0F8FE" }}
                            >
                              <div className="flex space-x-1">
                                <div
                                  className="w-1.5 h-1.5 rounded-full animate-bounce"
                                  style={{
                                    backgroundColor: "#64B5F6",
                                    animationDelay: "0ms",
                                  }}
                                ></div>
                                <div
                                  className="w-1.5 h-1.5 rounded-full animate-bounce"
                                  style={{
                                    backgroundColor: "#64B5F6",
                                    animationDelay: "150ms",
                                  }}
                                ></div>
                                <div
                                  className="w-1.5 h-1.5 rounded-full animate-bounce"
                                  style={{
                                    backgroundColor: "#64B5F6",
                                    animationDelay: "300ms",
                                  }}
                                ></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* View Latest Messages Button */}
                      {showAllMessages && messages.length > 10 && (
                        <div className="flex justify-center mt-4 mb-4">
                          <button
                            onClick={() => setShowAllMessages(false)}
                            className="px-3 py-1.5 rounded-full text-xs font-medium transition-colors hover:opacity-80"
                            style={{
                              backgroundColor: "#E3F2FD",
                              color: "#64B5F6",
                            }}
                          >
                            View latest messages
                          </button>
                        </div>
                      )}

                      {/* Scroll anchor for auto-scroll */}
                      <div ref={messagesEndRef} />
                    </div>
                  )}
                </div>
                {/* End Scrollable Content Area */}

                {/* Message Input - Fixed at Bottom */}
                <div
                  className={`px-6 pb-6 flex-shrink-0 ${messages.length > 0 ? "py-2" : "-mt-2"
                    }`}
                >
                  {/* Permanent Gray Separator Line */}
                  <div className="mb-3 -mx-6">
                    <div
                      className="w-full bg-gray-200 rounded-full"
                      style={{ height: "0.5px" }}
                    ></div>
                  </div>

                  {/* Reply Preview */}
                  {replyToMessage && (
                    <div className="mb-2 relative">
                      <div
                        className="rounded-lg p-2 pl-4 pr-8 relative flex"
                        style={{
                          backgroundColor: "#FAFAFA",
                        }}
                      >
                        {/* Blue line inside */}
                        <div
                          className="rounded-full mr-3"
                          style={{
                            width: "2px",
                            backgroundColor: "#64B5F6",
                            flexShrink: 0,
                          }}
                        ></div>

                        {/* Content */}
                        <div className="flex-1">
                          <div
                            className="text-xs font-medium mb-0.5"
                            style={{ color: "#64B5F6" }}
                          >
                            {replyToMessage.isIncoming
                              ? "Joaquin EDIMO"
                              : "You"}
                          </div>
                          <div className="text-xs" style={{ color: "#6A6A6A" }}>
                            {getMessageDisplayText(replyToMessage)}
                          </div>
                        </div>

                        {/* Close button */}
                        <button
                          onClick={() => setReplyToMessage(null)}
                          className="absolute top-1.5 right-1.5 hover:opacity-70 transition-opacity"
                        >
                          <img
                            src={replyCloseIcon}
                            alt="Close"
                            className="w-4 h-4"
                          />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Product Inquiry Card - Only show before sending first message */}
                  {!isMessageSent && productData && (
                    <div className="mb-3">
                      <div className="flex items-start space-x-3">
                        {/* Product Detail Card */}
                        <div className="bg-gray-50 rounded-xl p-3 flex-1 max-w-lg">
                          <div className="flex items-start justify-between mb-1">
                            <span
                              className="text-xs font-medium"
                              style={{ color: "#83C4F8" }}
                            >
                              From Bao'Afrik
                            </span>
                            <button
                              className="w-4 h-4 rounded-full flex items-center justify-center hover:opacity-80 transition-opacity"
                              style={{ backgroundColor: "#6A6A6A" }}
                            >
                              <svg
                                className="w-2 h-2"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                style={{ color: "#000000" }}
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M6 18L18 6M6 6l12 12"
                                />
                              </svg>
                            </button>
                          </div>
                          <div className="flex space-x-4">
                            <div className="relative">
                              <div
                                className="absolute -left-3 top-0 w-0.5 h-24"
                                style={{ backgroundColor: "#83C4F8" }}
                              ></div>
                              <img
                                src={productImage1}
                                alt={productData?.name}
                                className="w-24 h-24 object-cover"
                              />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <div
                                  className="text-xl font-semibold"
                                  style={{ color: "#6A6A6A" }}
                                >
                                  ${productData?.price}
                                </div>
                                <div
                                  className="flex items-center space-x-2 text-[10px]"
                                  style={{ color: "#BABABA" }}
                                >
                                  <img
                                    src={locIcon}
                                    alt="Location"
                                    className="w-4 h-4"
                                  />
                                  <span>{productData?.location}</span>
                                </div>
                              </div>
                              <div className="flex items-center justify-between -mt-0.5">
                                <h4
                                  className="text-xs font-medium"
                                  style={{ color: "#6A6A6A" }}
                                >
                                  {productData?.name}
                                </h4>
                                <div
                                  className="text-[10px]"
                                  style={{ color: "#BABABA" }}
                                >
                                  <span>Category: {productData?.category}</span>
                                </div>
                              </div>
                              <p
                                className="text-[10px] mt-2 leading-relaxed"
                                style={{ color: "#6A6A6A" }}
                              >
                                Premium White Pepper sourced from the fertile
                                soils of Africa.
                                <br />
                                Known for its smooth, aromatic heat and rich
                                flavor...
                              </p>
                              <a
                                href="#"
                                className="text-xs mt-1 block"
                                style={{ color: "#83C4F8" }}
                              >
                                baoafrik.com/product-id-link?
                              </a>
                            </div>
                          </div>
                        </div>

                        {/* File Attachment Indicator - Inline with Product Card */}
                        {selectedFiles.length > 0 && (
                          <div className="flex items-center space-x-2">
                            <div
                              className="flex items-center space-x-2 px-3 py-2 rounded-lg"
                              style={{ backgroundColor: "#F0F8FE" }}
                            >
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                style={{ color: "#64B5F6" }}
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                                />
                              </svg>
                              <div className="flex flex-col">
                                <span
                                  className="text-sm font-medium"
                                  style={{ color: "#64B5F6" }}
                                >
                                  {selectedFiles.length} file
                                  {selectedFiles.length > 1 ? "s" : ""} attached
                                </span>
                                <div
                                  className="text-xs"
                                  style={{ color: "#64B5F6" }}
                                >
                                  {selectedFiles.map((file, index) => (
                                    <span key={index}>
                                      {file.name} ({formatFileSize(file.size)})
                                      {index < selectedFiles.length - 1
                                        ? ", "
                                        : ""}
                                    </span>
                                  ))}
                                </div>
                              </div>
                              <button
                                onClick={() => {
                                  setSelectedFiles([]);
                                  setShowFilePreview(false);
                                }}
                                className="ml-2 hover:opacity-70"
                                style={{ color: "#64B5F6" }}
                              >
                                <svg
                                  className="w-4 h-4"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                  />
                                </svg>
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* File Attachment Indicator - Only show when no product detail popup */}
                  {selectedFiles.length > 0 && isMessageSent && (
                    <div className="mb-3">
                      <div className="flex items-center space-x-2">
                        <div
                          className="flex items-center space-x-2 px-3 py-2 rounded-lg"
                          style={{ backgroundColor: "#F0F8FE" }}
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            style={{ color: "#64B5F6" }}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                            />
                          </svg>
                          <div className="flex flex-col">
                            <span
                              className="text-sm font-medium"
                              style={{ color: "#64B5F6" }}
                            >
                              {selectedFiles.length} file
                              {selectedFiles.length > 1 ? "s" : ""} attached
                            </span>
                            <div
                              className="text-xs"
                              style={{ color: "#64B5F6" }}
                            >
                              {selectedFiles.map((file, index) => (
                                <span key={index}>
                                  {file.name} ({formatFileSize(file.size)})
                                  {index < selectedFiles.length - 1 ? ", " : ""}
                                </span>
                              ))}
                            </div>
                          </div>
                          <button
                            onClick={() => {
                              setSelectedFiles([]);
                              setShowFilePreview(false);
                            }}
                            className="ml-2 hover:opacity-70"
                            style={{ color: "#64B5F6" }}
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {isRecording ? (
                    // Recording Interface with inline file attachment
                    <div className="space-y-3">
                      {/* Main Recording Interface */}
                      <div
                        className="flex items-center"
                        style={{
                          backgroundColor: "#F5F5F5",
                          borderRadius: "12px",
                          padding: "6px",
                        }}
                      >
                        <div className="relative emoji-picker-container">
                          <button
                            onClick={handleEmojiClick}
                            className="p-1.5 hover:text-gray-600 opacity-0 pointer-events-none"
                          >
                            <img
                              src={faceIcon}
                              alt="emoji"
                              className="w-6 h-6"
                              style={{
                                filter: showEmojiPicker
                                  ? "brightness(0) saturate(100%) invert(52%) sepia(99%) saturate(1553%) hue-rotate(195deg) brightness(102%) contrast(95%)"
                                  : "none",
                              }}
                            />
                          </button>

                          {/* Emoji Picker */}
                          {showEmojiPicker && (
                            <div className="absolute bottom-full left-0 mb-2 z-50">
                              <style>{`
                                .emoji-picker-react {
                                  border: none !important;
                                  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
                                }
                                .emoji-picker-react .emoji-search {
                                  border: 1px solid #e5e5e5 !important;
                                  box-shadow: none !important;
                                  outline: none !important;
                                  background-color: #f8f8f8 !important;
                                }
                                .emoji-picker-react .emoji-search:focus {
                                  border: 1px solid #e5e5e5 !important;
                                  box-shadow: none !important;
                                  outline: none !important;
                                }
                                .emoji-picker-react .emoji-group:before {
                                  color: #666 !important;
                                  font-weight: bold !important;
                                  font-size: 12px !important;
                                }
                                .emoji-picker-react .emoji-categories button {
                                  border-radius: 50% !important;
                                  width: 32px !important;
                                  height: 32px !important;
                                  margin: 2px !important;
                                }
                                .emoji-picker-react .emoji-categories button.active {
                                  background-color: #64B5F6 !important;
                                }
                                .emoji-picker-react .emoji-categories button svg {
                                  width: 16px !important;
                                  height: 16px !important;
                                }
                              `}</style>
                              <EmojiPicker
                                onEmojiClick={onEmojiClick}
                                width={350}
                                height={450}
                                searchDisabled={false}
                                skinTonesDisabled={true}
                                previewConfig={{
                                  showPreview: false,
                                }}
                                searchPlaceHolder="Search Emoji"
                              />
                            </div>
                          )}
                        </div>
                        <button
                          onClick={handleAttachClick}
                          className="p-1.5 text-gray-400 hover:text-gray-600"
                        >
                          <img
                            src={pinIcon}
                            alt="attachment"
                            className="w-6 h-6"
                            style={{
                              filter: isAttachActive
                                ? "brightness(0) saturate(100%) invert(52%) sepia(99%) saturate(1553%) hue-rotate(195deg) brightness(102%) contrast(95%)"
                                : "none",
                            }}
                          />
                        </button>
                        <div className="flex-1 flex justify-start">
                          <div
                            className="rounded-full px-6 py-0.5 flex items-center -ml-12 relative"
                            style={{
                              background:
                                "linear-gradient(to right, #DBEAFE, #64B5F6)",
                              width: "550px",
                              height: "28px", // Fixed height to prevent container movement
                            }}
                          >
                            <div className="flex items-center space-x-2 flex-shrink-0">
                              <div
                                className="w-2 h-2 bg-red-500 rounded-full animate-pulse"
                                style={{
                                  boxShadow: "0 0 8px rgba(239, 68, 68, 0.6)",
                                }}
                              ></div>
                              <span className="text-white text-sm">
                                {Math.floor(recordingTime / 60)
                                  .toString()
                                  .padStart(2, "0")}
                                :
                                {(recordingTime % 60)
                                  .toString()
                                  .padStart(2, "0")}{" "}
                                - Audio recording
                              </span>
                            </div>
                            <div className="flex space-x-0.5 absolute right-8 top-1/2 transform -translate-y-1/2 items-end">
                              {audioLevels.map((level, i) => {
                                // Convert audio level (0.1 to 1.0) to height (2px to 24px)
                                const height = `${level * 24}px`;
                                const minHeight = "2px";

                                return (
                                  <div
                                    key={i}
                                    className="w-0.5 bg-white rounded-full transition-all duration-150 ease-out"
                                    style={{
                                      height:
                                        Math.max(
                                          parseFloat(height),
                                          parseFloat(minHeight)
                                        ) + "px",
                                      minHeight: minHeight,
                                    }}
                                  />
                                );
                              })}
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={handleStopRecording}
                          className="w-8 h-8 border-2 border-red-500 rounded-full flex items-center justify-center hover:bg-red-50 transition-colors"
                          style={{ backgroundColor: "#F5F5F5" }}
                        >
                          <div className="w-3 h-3 bg-red-500 rounded-sm"></div>
                        </button>
                      </div>

                      {/* File Attachment Indicator - Inline with Recording */}
                      {selectedFiles.length > 0 && (
                        <div className="flex items-center space-x-2">
                          <div
                            className="flex items-center space-x-2 px-3 py-2 rounded-lg"
                            style={{ backgroundColor: "#F0F8FE" }}
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              style={{ color: "#64B5F6" }}
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                              />
                            </svg>
                            <div className="flex flex-col">
                              <span
                                className="text-sm font-medium"
                                style={{ color: "#64B5F6" }}
                              >
                                {selectedFiles.length} file
                                {selectedFiles.length > 1 ? "s" : ""} attached
                              </span>
                              <div
                                className="text-xs"
                                style={{ color: "#64B5F6" }}
                              >
                                {selectedFiles.map((file, index) => (
                                  <span key={index}>
                                    {file.name} ({formatFileSize(file.size)})
                                    {index < selectedFiles.length - 1
                                      ? ", "
                                      : ""}
                                  </span>
                                ))}
                              </div>
                            </div>
                            <button
                              onClick={() => {
                                setSelectedFiles([]);
                                setShowFilePreview(false);
                              }}
                              className="ml-2 hover:opacity-70"
                              style={{ color: "#64B5F6" }}
                            >
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M6 18L18 6M6 6l12 12"
                                />
                              </svg>
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : recordingTime > 0 ? (
                    // Show audio preview bubble and send button after recording
                    <div className="flex flex-col">
                      {/* Audio Preview Bubble - Outside message input */}
                      <div className="mb-3">
                        <div
                          className="flex items-center justify-between rounded-md px-4 py-2"
                          style={{
                            background:
                              "linear-gradient(to right, #DBEAFE, #64B5F6)",
                            borderRadius: "12px",
                            width: "300px",
                          }}
                        >
                          <div className="flex items-center space-x-3">
                            <button
                              onClick={handlePreviewPlayback}
                              className="hover:opacity-80 transition-opacity"
                            >
                              {isPreviewPlaying ? (
                                // Pause icon
                                <svg
                                  className="w-8 h-8 text-white fill-current"
                                  viewBox="0 0 24 24"
                                  style={{
                                    filter:
                                      "drop-shadow(0 0 2px rgba(255,255,255,0.3))",
                                  }}
                                >
                                  <path
                                    d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"
                                    style={{ fillRule: "evenodd" }}
                                  />
                                </svg>
                              ) : (
                                // Play icon
                                <svg
                                  className="w-8 h-8 text-white fill-current"
                                  viewBox="0 0 24 24"
                                  style={{
                                    filter:
                                      "drop-shadow(0 0 2px rgba(255,255,255,0.3))",
                                  }}
                                >
                                  <path
                                    d="M8 5v14l11-7z"
                                    style={{ fillRule: "evenodd" }}
                                  />
                                </svg>
                              )}
                            </button>
                            <span className="text-white text-sm">
                              {(() => {
                                const time =
                                  previewPlaybackTime > 0
                                    ? previewPlaybackTime
                                    : recordingTime;
                                return `${Math.floor(time / 60)
                                  .toString()
                                  .padStart(2, "0")} : ${(time % 60)
                                    .toString()
                                    .padStart(2, "0")}`;
                              })()}
                            </span>
                            <div className="w-2 h-0.5 bg-white/70 rounded-full mx-0.5"></div>
                            <span className="text-white text-sm">Audio</span>
                            <div className="flex items-center justify-center space-x-0.5">
                              {[
                                6, 8, 4, 6, 12, 16, 14, 18, 20, 16, 12, 8, 6,
                                10, 14, 12, 8, 6, 4, 8,
                              ].map((h, i) => (
                                <div
                                  key={i}
                                  className="w-0.5 bg-white rounded-full"
                                  style={{ height: `${h}px` }}
                                />
                              ))}
                            </div>
                          </div>
                          <button
                            onClick={() => {
                              // Stop preview audio if playing
                              if (previewAudio) {
                                previewAudio.pause();
                                setPreviewAudio(null);
                              }
                              setIsPreviewPlaying(false);
                              setPreviewPlaybackTime(0);
                              setRecordingTime(0);
                              setAudioChunks([]);
                            }}
                            className="w-4 h-4 rounded-full flex items-center justify-center hover:opacity-80 transition-opacity"
                            style={{
                              backgroundColor: "rgba(255, 255, 255, 0.3)",
                            }}
                          >
                            <svg
                              className="w-3 h-3 text-white"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              strokeWidth={2}
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                          </button>
                        </div>
                      </div>

                      {/* Message Input with Send Button */}
                      <div
                        className="flex items-center"
                        style={{
                          backgroundColor: "#F5F5F5",
                          borderRadius: "12px",
                          padding: "6px",
                        }}
                      >
                        <div className="relative emoji-picker-container">
                          <button
                            onClick={handleEmojiClick}
                            className="p-1.5 hover:text-gray-600"
                          >
                            <img
                              src={faceIcon}
                              alt="emoji"
                              className="w-6 h-6"
                              style={{
                                filter: showEmojiPicker
                                  ? "brightness(0) saturate(100%) invert(52%) sepia(99%) saturate(1553%) hue-rotate(195deg) brightness(102%) contrast(95%)"
                                  : "none",
                              }}
                            />
                          </button>

                          {/* Emoji Picker */}
                          {showEmojiPicker && (
                            <div className="absolute bottom-full left-0 mb-2 z-50">
                              <style>{`
                                .emoji-picker-react {
                                  border: none !important;
                                  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
                                }
                                .emoji-picker-react .emoji-search {
                                  border: 1px solid #e5e5e5 !important;
                                  box-shadow: none !important;
                                  outline: none !important;
                                  background-color: #f8f8f8 !important;
                                }
                                .emoji-picker-react .emoji-search:focus {
                                  border: 1px solid #e5e5e5 !important;
                                  box-shadow: none !important;
                                  outline: none !important;
                                }
                                .emoji-picker-react .emoji-group:before {
                                  color: #666 !important;
                                  font-weight: bold !important;
                                  font-size: 12px !important;
                                }
                                .emoji-picker-react .emoji-categories button {
                                  border-radius: 50% !important;
                                  width: 32px !important;
                                  height: 32px !important;
                                  margin: 2px !important;
                                }
                                .emoji-picker-react .emoji-categories button.active {
                                  background-color: #64B5F6 !important;
                                }
                                .emoji-picker-react .emoji-categories button svg {
                                  width: 16px !important;
                                  height: 16px !important;
                                }
                              `}</style>
                              <EmojiPicker
                                onEmojiClick={onEmojiClick}
                                width={350}
                                height={450}
                                searchDisabled={false}
                                skinTonesDisabled={true}
                                previewConfig={{
                                  showPreview: false,
                                }}
                                searchPlaceHolder="Search Emoji"
                              />
                            </div>
                          )}
                        </div>
                        <button
                          onClick={handleAttachClick}
                          className="p-1.5 text-gray-400 hover:text-gray-600"
                        >
                          <img
                            src={pinIcon}
                            alt="attachment"
                            className="w-6 h-6"
                            style={{
                              filter: isAttachActive
                                ? "brightness(0) saturate(100%) invert(52%) sepia(99%) saturate(1553%) hue-rotate(195deg) brightness(102%) contrast(95%)"
                                : "none",
                            }}
                          />
                        </button>
                        <div className="flex-1">
                          <input
                            type="text"
                            placeholder="...Write your message"
                            className="w-full px-3 py-2 focus:outline-none bg-transparent"
                            style={{
                              border: "none",
                              caretColor: "#64B5F6",
                            }}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                handleSendVoiceMessage();
                              }
                            }}
                          />
                        </div>
                        <button
                          onClick={handleSendVoiceMessage}
                          className="p-2 text-blue-600 hover:text-blue-800"
                        >
                          <img src={bluIcon} alt="send" className="w-7 h-7" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    // Normal Message Input
                    <div
                      className="flex items-center"
                      style={{
                        backgroundColor: "#F5F5F5",
                        borderRadius: "12px",
                        padding: "6px",
                      }}
                    >
                      <div className="relative emoji-picker-container">
                        <button
                          onClick={handleEmojiClick}
                          className="p-1.5 hover:text-gray-600"
                        >
                          <img
                            src={faceIcon}
                            alt="emoji"
                            className="w-6 h-6"
                            style={{
                              filter: showEmojiPicker
                                ? "brightness(0) saturate(100%) invert(52%) sepia(99%) saturate(1553%) hue-rotate(195deg) brightness(102%) contrast(95%)"
                                : "none",
                            }}
                          />
                        </button>

                        {/* Emoji Picker */}
                        {showEmojiPicker && (
                          <div className="absolute bottom-full left-0 mb-2 z-50">
                            <style>{`
                              .emoji-picker-react {
                                border: none !important;
                                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
                              }
                              .emoji-picker-react .emoji-search {
                                border: 1px solid #e5e5e5 !important;
                                box-shadow: none !important;
                                outline: none !important;
                                background-color: #f8f8f8 !important;
                              }
                              .emoji-picker-react .emoji-search:focus {
                                border: 1px solid #e5e5e5 !important;
                                box-shadow: none !important;
                                outline: none !important;
                              }
                              .emoji-picker-react .emoji-group:before {
                                color: #666 !important;
                                font-weight: bold !important;
                                font-size: 12px !important;
                              }
                              .emoji-picker-react .emoji-categories button {
                                border-radius: 0 !important;
                                width: 32px !important;
                                height: 32px !important;
                                margin: 2px !important;
                                border: none !important;
                                outline: none !important;
                              }
                              .emoji-picker-react .emoji-categories button.active {
                                background-color: #64B5F6 !important;
                                border: none !important;
                                border-radius: 0 !important;
                                outline: none !important;
                              }
                              .emoji-picker-react .emoji-categories button:hover {
                                border-radius: 0 !important;
                                outline: none !important;
                              }
                              .emoji-picker-react .emoji-categories button:focus {
                                border-radius: 0 !important;
                                outline: none !important;
                              }
                              .emoji-picker-react .emoji-categories button svg {
                                width: 16px !important;
                                height: 16px !important;
                              }
                            `}</style>
                            <EmojiPicker
                              onEmojiClick={onEmojiClick}
                              width={350}
                              height={450}
                              searchDisabled={false}
                              skinTonesDisabled={true}
                              previewConfig={{
                                showPreview: false,
                              }}
                              searchPlaceHolder="Search Emoji"
                            />
                          </div>
                        )}
                      </div>
                      <button
                        onClick={handleAttachClick}
                        className="p-1.5 text-gray-400 hover:text-gray-600"
                      >
                        <img
                          src={pinIcon}
                          alt="attachment"
                          className="w-6 h-6"
                          style={{
                            filter: isAttachActive
                              ? "brightness(0) saturate(100%) invert(52%) sepia(99%) saturate(1553%) hue-rotate(195deg) brightness(102%) contrast(95%)"
                              : "none",
                          }}
                        />
                      </button>
                      <div className="flex-1">
                        <input
                          type="text"
                          value={messageText}
                          onChange={(e) => {
                            setMessageText(e.target.value);
                            handleTypingDetection();
                          }}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              handleSendMessage();
                            }
                          }}
                          placeholder="...Write your message"
                          className="w-full px-3 py-2 focus:outline-none bg-transparent"
                          style={{
                            border: "none",
                            caretColor: "#64B5F6",
                          }}
                        />
                      </div>

                      <button
                        onClick={
                          messageText.trim() || selectedFiles.length > 0
                            ? handleSendMessage
                            : handleAudioRecord
                        }
                        className="p-2 text-blue-600 hover:text-blue-800"
                      >
                        {messageText.trim() || selectedFiles.length > 0 ? (
                          <img src={bluIcon} alt="send" className="w-7 h-7" />
                        ) : (
                          <img
                            src={audioIcon}
                            alt="audio"
                            className="w-7 h-7"
                          />
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              // Default Secure Messaging View - Empty State with Fixed Height
              <div
                className="flex flex-col items-center justify-center p-8"
                style={{ height: "calc(50vh - 4rem)" }}
              >
                {/* Secure Messaging Icon */}
                <div className="flex items-center justify-center mb-6">
                  <img
                    src={mainIcon}
                    alt="Secure Messaging"
                    className="w-32 h-32"
                  />
                </div>

                {/* Secure Messaging Content */}
                <h2 className="text-2xl text-black mb-4">Secure Messaging</h2>
                <div className="max-w-md text-center">
                  <div className="flex items-start space-x-2 mb-4">
                    <svg
                      className="w-5 h-5 text-gray-500 mt-0.5 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" />
                    </svg>
                    <p className="text-gray-500 text-sm leading-relaxed">
                      End-to-end encryption: Only the sender and recipient can
                      read messages, not the service provider.{" "}
                      <span
                        className="underline cursor-pointer"
                        style={{ color: "#64B5F6" }}
                      >
                        Learn more
                      </span>
                    </p>
                  </div>
                  {conversations.length > 0 && (
                    <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                      <p className="text-blue-800 text-sm">
                        <strong>Select a conversation</strong> from the sidebar to start messaging
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <footer className="bg-gray-50">
            <div className="px-4 sm:px-6 lg:px-8 py-4">
              <div
                className="flex items-center justify-between text-sm"
                style={{ color: "#BABABA" }}
              >
                <div className="flex items-center space-x-2">
                  <img src={lilLogo} alt="lil" className="w-6 h-6" />
                  <span>©</span>
                  <span>All rights reserved</span>
                </div>
                <div className="flex items-center space-x-4">
                  <Link
                    to="/contact"
                    className="hover:text-gray-900"
                    style={{ color: "#BABABA" }}
                  >
                    Contact Us
                  </Link>
                  <span style={{ color: "#BABABA" }}>|</span>
                  <Link
                    to="/terms"
                    className="hover:text-gray-900"
                    style={{ color: "#BABABA" }}
                  >
                    Terms and conditions of use
                  </Link>
                  <span style={{ color: "#BABABA" }}>|</span>
                  <Link
                    to="/privacy"
                    className="hover:text-gray-900"
                    style={{ color: "#BABABA" }}
                  >
                    Privacy policies
                  </Link>
                  <span style={{ color: "#BABABA" }}>|</span>
                  <Link
                    to="/cookies"
                    className="hover:text-gray-900"
                    style={{ color: "#BABABA" }}
                  >
                    Cookies
                  </Link>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </>
  );
};

export default Messages;
