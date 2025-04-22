import { useState, useEffect, useRef, useMemo } from "react";
import { useParams } from "react-router-dom";
import io from "socket.io-client";
import axios from "axios";
import { BASE_URL } from "../utils/url";

export default function Chat() {
  const { vendorId, userId } = useParams();
  const roomId = [userId, vendorId].sort().join("_");

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);

  const socket = useMemo(() => io.connect("http://localhost:3002"), []);

  useEffect(() => {
    socket.emit("join_room", roomId);

    axios
      .get(`${BASE_URL}/chat/${roomId}`)
      .then((res) => setMessages(res.data))
      .catch((err) => console.error(err));

    const messageHandler = (data) => {
      setMessages((prev) => [...prev, data]);
    };
    socket.on("receive_message", messageHandler);

    return () => {
      socket.off("receive_message", messageHandler);
      socket.emit("leave_room", roomId);
    };
  }, [roomId, socket]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    const messageData = {
      roomId,
      senderId: userId,
      receiverId: vendorId,
      message: newMessage,
      timestamp: new Date(),
    };

    try {
      await axios.post(`${BASE_URL}/chat/`, messageData);
      socket.emit("send_message", messageData);
      setNewMessage("");
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        Chat with Seller
      </div>

      <div className="chat-messages">
        {messages.map((msg, index) => {
          const date = new Date(msg.timestamp).toLocaleDateString();
          const showDate = index === 0 || date !== new Date(messages[index - 1].timestamp).toLocaleDateString();
          
          return (
            <div key={index} className="message-container">
              {showDate && (
                <div className="date-separator">
                  <span>{date}</span>
                </div>
              )}
              <div className={`message-bubble ${msg.senderId === userId ? "sent" : "received"}`}>
                <div className="message-content">
                  <p>{msg.message}</p>
                  <div className="message-meta">
                    <span className="message-time">
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input-container">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          className="chat-input"
          placeholder="Type a message..."
        />
        <button className="send-button" onClick={sendMessage}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
          </svg>
        </button>
      </div>

      <style jsx>{`
        .chat-container {
          display: flex;
          flex-direction: column;
          max-width: 600px;
          height: 80vh;
          margin: 0 auto;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
          background-color: #f8f9fa;
          font-family: 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', sans-serif;
        }

        .chat-header {
          background: linear-gradient(135deg, #FF7B25 0%, #FF5E35 100%);
          color: white;
          padding: 16px 20px;
          text-align: center;
          font-size: 18px;
          font-weight: 600;
        }

        .chat-messages {
          flex: 1;
          padding: 16px;
          overflow-y: auto;
          background-color: #f0f2f5;
          display: flex;
          flex-direction: column;
        }

        .message-container {
          margin-bottom: 8px;
        }

        .date-separator {
          text-align: center;
          margin: 16px 0;
          color: #666;
          font-size: 12px;
          position: relative;
        }

        .date-separator::before,
        .date-separator::after {
          content: "";
          position: absolute;
          top: 50%;
          width: 30%;
          height: 1px;
          background-color: #ddd;
        }

        .date-separator::before {
          left: 0;
        }

        .date-separator::after {
          right: 0;
        }

        .message-bubble {
          max-width: 70%;
          margin-bottom: 4px;
          position: relative;
        }

        .message-bubble.sent {
          align-self: flex-end;
          margin-left: 30%;
        }

        .message-bubble.received {
          align-self: flex-start;
          margin-right: 30%;
        }

        .message-content {
          padding: 10px 14px;
          border-radius: 18px;
          position: relative;
          word-wrap: break-word;
        }

        .message-bubble.sent .message-content {
          background: linear-gradient(135deg, #FF7B25 0%, #FF5E35 100%);
          color: white;
          border-bottom-right-radius: 4px;
        }

        .message-bubble.received .message-content {
          background-color: white;
          color: #333;
          border-bottom-left-radius: 4px;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
        }

        .message-meta {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 4px;
          margin-top: 4px;
        }

        .message-time {
          font-size: 10px;
          opacity: 0.8;
        }

        .message-bubble.received .message-time {
          color: #666;
        }

        .message-bubble.sent .message-time {
          color: rgba(255, 255, 255, 0.8);
        }

        .chat-input-container {
          display: flex;
          padding: 12px;
          background-color: white;
          border-top: 1px solid #e9ecef;
        }

        .chat-input {
          flex: 1;
          padding: 12px 16px;
          border: 1px solid #ddd;
          border-radius: 24px;
          outline: none;
          font-size: 14px;
          transition: border 0.3s;
        }

        .chat-input:focus {
          border-color: #FF7B25;
        }

        .send-button {
          margin-left: 8px;
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: linear-gradient(135deg, #FF7B25 0%, #FF5E35 100%);
          color: white;
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: transform 0.2s, opacity 0.2s;
        }

        .send-button:hover {
          transform: scale(1.05);
          opacity: 0.9;
        }

        .send-button svg {
          width: 20px;
          height: 20px;
        }

        .chat-messages::-webkit-scrollbar {
          width: 6px;
        }

        .chat-messages::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }

        .chat-messages::-webkit-scrollbar-thumb {
          background: #c1c1c1;
          border-radius: 10px;
        }

        .chat-messages::-webkit-scrollbar-thumb:hover {
          background: #a8a8a8;
        }
      `}</style>
    </div>
  );
}