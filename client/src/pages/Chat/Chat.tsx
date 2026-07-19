import "./Chat.css";
import { getChats, createChat, getChat, sendMessage } from "../../utils/api";
import type { Chat, Message } from "../../utils/api";
import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import errorIcon from "../../assets/error-icon.png";
import sendIcon from "../../assets/send-icon.png";
import { useOutletContext } from "react-router-dom";

type MobileContext = {
 isMobileMenuOpen: boolean;
 setIsMobileMenuOpen: (open: boolean) => void;
}

export default function Chat() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [chatsError, setChatsError] = useState<string | null>(null);
  const [isLoadingChats, setIsLoadingChats] = useState<boolean>(true);
  const [isCreatingChat, setIsCreatingChat] = useState<boolean>(false);
  const [newChatTitle, setNewChatTitle] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoadingMessages, setIsLoadingMessages] = useState<boolean>(false);
  const [messagesError, setMessagesError] = useState<string>('');
  const [input, setInput] = useState<string>('');
  const [isSending, setIsSending] = useState<boolean>(false);

  const { isMobileMenuOpen, setIsMobileMenuOpen } = useOutletContext<MobileContext>();

  const handleCreateChat = async () => {
    const title = newChatTitle.trim() || 'New Chat';
    setIsCreatingChat(false);
    setNewChatTitle('');
    try {
    const res = await createChat(title);
    if (res.data) {
      setChats((prev) => [res.data!, ...prev]);
      setActiveChatId(res.data._id);
      setIsMobileMenuOpen(false);
    }
    } catch {
    // A toast or inline error could go here in the future
    }
  };

  const handleSend = async () => {
    const text = input.trim();
    if (!text || !activeChatId || isSending) return;

    const userMessage: Message = {
      _id: Date.now().toString(),
      chatId: activeChatId,
      role: "user",
      content: text,
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsSending(true);

    try {
      const res = await sendMessage(activeChatId, text);
      if (res.data) {
        setMessages((prev) => [...prev, res.data!]);
      }
    } catch {
      const errorMessage: Message = {
        _id: Date.now().toString(),
        chatId: activeChatId,
        role: 'assistant',
        content: 'Something went wrong. Please try again.',
        createdAt: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsSending(false);
    }
  };

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getChats();
        if (res && res.data) {
          setChats(res.data);
        }
        else {
          setChats([]);
        }
      } catch {
        setChatsError("Failed to load chats.");
      } finally {
        setIsLoadingChats(false);
      }
    };

    load();
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
 if (e.key === "Enter" && !e.shiftKey) {
   e.preventDefault();
   handleSend();
 }
}

  useEffect(() => {
  if (!activeChatId) {
    return;
  }

  const load = async () => {
    setMessages([]);
    setMessagesError('');
    setIsLoadingMessages(true);
    try {
      const res = await getChat(activeChatId);
      if (res.data) {
        setMessages(res.data.messages);
      }
      else {
        setMessages([]);
      }
    } catch {
      setMessagesError('Failed to load messages.')
    } finally {
      setIsLoadingMessages(false);
    }
  };

  load();
}, [activeChatId]);
  


  return (
  <div className="chat">
    <aside className={`chat__sidebar${
      isMobileMenuOpen ? ' chat__sidebar_open' : ''
    }`}>
      <button className="chat__new-btn" type="button" onClick={() => {
 setIsCreatingChat(true);
 setIsMobileMenuOpen(true);
}}>
        + New Chat
      </button>

      {isCreatingChat && (
        <input
          className="chat__title-input"
          type="text"
          placeholder="Chat name"
          value={newChatTitle}
          onChange={(e) => {setNewChatTitle(e.target.value)}}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleCreateChat();
            if (e.key === 'Escape') {
              setIsCreatingChat(false);
              setNewChatTitle('');
            }
          }}
          autoFocus
        />
        )}

      {isLoadingChats && <p className="chat__sidebar-message">Loading…</p>}
      {chatsError && <p className="chat__sidebar-message">{chatsError}</p>}

      <ul className="chat__list">
        {chats.map((c) => (
          <li
            key={c._id}
            className={
              c._id === activeChatId
                ? 'chat__item chat__item_active'
                : 'chat__item'
            }
            onClick={() => {
              setActiveChatId(c._id);
              setIsMobileMenuOpen(false);
            }}
          >
            {c.title}
          </li>
        ))}
      </ul>
    </aside>

   <div className="chat__main">
    {!messagesError && !isLoadingMessages && !activeChatId && (
      <div className="chat__no-messages">
        <p className="chat__no-messages__text">Create a new chat or select an existing chat to start the conversation</p>
        <button 
          className="chat__no-messages__button" 
          onClick={() => {
          setIsCreatingChat(true);
          setIsMobileMenuOpen(true);
          }}
        >
          Start New Chat
        </button>
      </div>
    )}
    
    {!messagesError && !isLoadingMessages && activeChatId && messages.length === 0 && (
      <div className="chat__no-messages">
        <p className="chat__no-messages__text">Ask a question below to start the conversation</p>
        <div className="chat__input-bar">
              <textarea 
                className="chat__input" 
                placeholder="Ask any question" 
                rows={1}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isSending}
              />
              <button 
                className="chat__send" 
                aria-label="Send message"
                onClick={handleSend}
                disabled={isSending}
              ><img src={sendIcon} /></button>
            </div>
      </div>
    )}

    {activeChatId && isLoadingMessages && (
      <p className="chat__no-messages">Loading...</p>
    )}

    {activeChatId && messagesError && (
      <div className="chat__error">
        <img className="chat__error__icon" src={errorIcon}/>
        <h1 className="chat__error__title">Looks like something went wrong</h1>
        <p className="chat__error__message">Try reloading the page or creating the chat again</p>
        <button className="chat__error__button">Go to the Main Page</button>
      </div>
    )}

    {activeChatId && !isLoadingMessages && !messagesError && messages.length > 0 && (
   <>
            <ul className="chat__messages">
              {messages.map((msg) => (
                <li
                  key={msg._id}
                  className={
                    msg.role === 'user'
                      ? 'chat__message chat__message_user'
                      : 'chat__message chat__message_assistant'
                  }
                >
                  {msg.role !== 'user' ? (
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                  ) : (
                    msg.content
                  )}
                </li>
              ))}
            </ul>
            <div className="chat__input-bar-wrapper">
              <div className="chat__input-bar">
                <textarea 
                  className="chat__input" 
                  placeholder="Ask any question" 
                  rows={1}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  disabled={isSending} 
                />
                <button 
                  className="chat__send" 
                  aria-label="Send message"
                  onClick={handleSend}
                  disabled={isSending || !input.trim()}
                ><img src={sendIcon} /></button>
              </div>
            </div>
          </>
          
    )}
    
  </div>
  </div>
  
);

}