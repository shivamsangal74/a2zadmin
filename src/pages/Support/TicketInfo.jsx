import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Tag, Avatar } from "antd";
import { ArrowBack } from "@mui/icons-material";
import SendIcon from "@mui/icons-material/Send";
import { TextField, IconButton } from "@mui/material";
import "./ticketInfo.css";
import io from "socket.io-client";
import { toast } from "react-toastify";
import api from "../../Services/Axios/api";
import Loader from "../../components/Loader/Loader";
import { apiUrl } from "../../Utills/constantt";
import DefaultLayout from "../../layout/DefaultLayout";
import { Option, Select } from "@material-tailwind/react";
// Setup socket connection
const socket = io(apiUrl);

const TicketInfo = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [chatData, setChatData] = useState([]);

  const navigate = useNavigate();
  const chatContainerRef = useRef(null);
  useEffect(() => {
    async function getTicket() {
      try {
        setIsLoading(true);

        const response = await api.get(`ticket/tickets/${id}`);
        setData(response.data);
        setChatData(
          response.data.chatHistory ? JSON.parse(response.data.chatHistory) : []
        );
      } catch (error) {
        toast.error("Something went wrong.");
      } finally {
        setIsLoading(false);
      }
    }
    getTicket();
  }, [id]);

  useEffect(() => {
    const userId = socket.id; // Get the socket id
    console.log("User connected:", userId);
    socket.emit("joinRoom", { ticketId: id });

    socket.on("receiveMessage", (messageData) => {
      setChatData((prev) => [...prev, messageData.message]);
    });
    socket.on("disconnect", () => {
      console.log(`User disconnected: ${userId}`);
      // Optionally attempt reconnection or notify the user
    });
    return () => {
      socket.off("receiveMessage");
      socket.disconnect();
    };
  }, [id]);

  const handleSendMessage = (e) => {
    e.preventDefault();

    if (message.trim()) {
      const newMessage = {
        sender: "Agent",
        message: message,
        time: new Date().toLocaleString([], {
          year: "2-digit",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        }),
      };

      socket.emit("sendMessage", { ticketId: id, message: newMessage });
      setMessage("");
    }
  };
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [chatData]);

  async function updateTicket(body,id) {
    debugger
      try {
        const updatedTicket = await api.patch(`ticket/updateticket/${id}`,{...body}) 
        toast.success("Ticket updated successfully.");
      } catch (error) {
        toast.error("Failed to update ticket.");
      }
  }

  return (
    <DefaultLayout>
      <div className="ticket-container">
        <div className="d-flex justify-content-between mb-4">
          <Button
            icon={<ArrowBack />}
            onClick={() => navigate("/support-ticket")}
          >
            Back
          </Button>
        </div>

        <div className="flex ticket-layout">
          <div className="left-section">
            <div className="ticket-info-box mb-4">
              <h6 className="mb-4">Ticket Information</h6>
              <div className="ticket-detail">
                <strong>Subject:</strong> {data?.subject}
              </div>
              <div className="ticket-detail">
                <strong>Category:</strong>
                <div style={{ width: "100px" }}>
                  <Select label="Update Category" value={data?.category} onChange={async(value)=>{ await updateTicket({"category" : value},data.id) }}>
                    <Option value="Bug">Bug</Option>
                    <Option value="Support">Support</Option>
                    <Option value="New Installation">New Installation</Option>
                    <Option value="Questions">Questions</Option>
                    <Option value="Installation">Installation</Option>
                  </Select>
                </div>
              </div>
              <div className="ticket-detail">
                <strong>Priority:</strong>
                <div style={{ width: "100px"}}>
                  <Select label="Update Priority" value={data?.priority} onChange={async(value)=>{ await updateTicket({"priority" : value},data.id) }}>
                    <Option value="Urgent">Urgent</Option>
                    <Option value="High">High</Option>
                    <Option value="Medium">Medium</Option>
                    <Option value="Low">Low</Option>
                  </Select>
                </div>
              </div>
              <div className="ticket-detail">
                <strong>Status:</strong>
                
                <div style={{ width: "100px"}}>
                  <Select label="Update Status" value={data?.status} onChange={async(value)=>{ await updateTicket({"status" : value},data.id) }}>
                 
                    <Option value="Resolved">Resolved</Option>
                    <Option value="In Progress">In Progress</Option>
                    <Option value="Pending">Pending</Option>
                    <Option value="Closed">Closed</Option>

                  </Select>
                </div>
              </div>
              <div className="ticket-detail">
                <strong>Description:</strong> <p>{data?.description}</p>
              </div>
              <div className="ticket-images">
                {data?.userfiles &&
                  JSON.parse(data.userfiles).map((image, index) => (
                    <img
                      key={index}
                      src={`${apiUrl}/${image}`}
                      alt={`Ticket ${index}`}
                      className="ticket-image"
                    />
                  ))}
              </div>
            </div>
            <div className="assets-box">
              <h5>Admin Attachments</h5>
              <div className="ticket-images">
                {data?.adminfiles &&
                  JSON.parse(data.adminfiles).map((image, index) => (
                    <img
                      key={index}
                      src={`${apiUrl}/${image}`}
                      alt={`Ticket ${index}`}
                      className="ticket-image"
                    />
                  ))}
              </div>
            </div>
          </div>

          <div className="right-section chat-history-box">
            <h6>Conversation</h6>
            <div className="chat-container" ref={chatContainerRef}>
              {chatData.map((chat, index) => (
                <div
                  key={index}
                  className={`chat-bubble ${
                    chat.sender === "Agent" ? "agent" : "user"
                  }`}
                >
                  <div className="chat-content">
                    <Avatar>{chat?.sender?.charAt(0)}</Avatar>
                    <div className="message">
                      <p>{chat?.message}</p>
                      <span className="time">{chat?.time}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Message input box */}
            <form className="message-form flex" onSubmit={handleSendMessage}>
              <TextField
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                variant="outlined"
                placeholder="Type your message..."
                fullWidth
                className="message-input"
              />
              <IconButton
                type="submit"
                color="primary"
                aria-label="send"
                className="send-button"
              >
                <SendIcon />
              </IconButton>
            </form>
          </div>
        </div>
        {isLoading && <Loader />}
      </div>
    </DefaultLayout>
  );
};

export default TicketInfo;
