import styles from "./messageList.module.css";
import React, {useState} from "react";


const MessageList = () => {

  /* was used for testing purposes as sample chat data
  const chats = [
    {
        sender: "user",
        message: "Hello, how are you?"
    },
    {
        sender: "bot",
        message: "I'm just a bot, but I'm here to help you!"
    },
    {
        sender: "user",
        message: "What can you do?"
    },
    {
        sender: "bot",
        message: "I can answer questions, provide information, and assist with various tasks."
    },
  ];
  */
  
  const [userMessage, setUserMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]); // chats (hardcoded) can be included here as initial state for testing
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);

  const sendMessage = async() => {
    if (!userMessage.trim()) return; // Prevent sending empty messages
    setLoading(true);

    try {

        const formData = new FormData();
        formData.append("prompt", userMessage);
        console.log("Image file:", imageFile);
        if (imageFile) {
            formData.append("file", imageFile);
            console.log("Image file appended:", imageFile.name);
        }

        const response = await fetch("http://127.0.0.1:8000/uploadfile/", {
            method: "POST",
            body: formData,
        });
        if (!response.ok) {
            throw new Error("Failed to get response from server");
        }
        const data = await response.json();


        if (imageFile) {
            setChatHistory((prev) => [
                ...prev,
                {sender: "user", message: userMessage, isImage: false},
                {sender: "user", message: imageFile, isImage: true},
                {sender: "bot", message: data.response, isImage: false},
            ]);
        }
        else{
            setChatHistory((prev) => [
                ...prev,
                {sender: "user", message: userMessage, isImage: false},
                {sender: "bot", message: data.response, isImage: false},
            ]);
        }

    } catch (error) {
        console.error("Error sending message:", error);
        alert("An error occurred while sending your message. Please try again later.");
    } finally {
        setLoading(false);
    }

    setUserMessage("");
    setImageFile(null); // Reset image file after sending
  };


  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
        setImageFile(file);
    }
  }

  return (
    <div className={styles.container}>
        <h1 className={styles.header}>Chat with GPT</h1>
        <div className={styles.chatBox}>
            {chatHistory.map((chat, index) => (
                <div
                    key={index}
                    className={`${styles.message} ${chat.sender=="user" ? styles.userMessage : styles.botMessage}`}
                >
                    {chat.isImage ? (
                        <img
                            src={URL.createObjectURL(chat.message)}
                            alt="Uploaded image"
                            className={styles.image}
                        />
                    ) :
                    (chat.message)
                    }    
                </div>
            ))} 
        </div>
        <div className={styles.inputContainer}>
            <input 
                type="text" 
                placeholder="Type your message here..."
                value={userMessage}
                onChange={(e) => setUserMessage(e.target.value)}
                disabled={loading} 
                className={styles.input}
            />
            <label htmlFor="image-upload" className={styles.paperclipButton}>
                📎
            </label>
            <input 
                id = "image-upload"
                type="file" 
                accept="image/*"
                onChange={handleImageUpload}
                disabled={loading} 
                className={styles.inputImage}
            />
            <button onClick={sendMessage} className={styles.button} disabled={loading}>
                {loading ? "Sending..." : "Send"}
            </button>

        </div>
    </div>
  );
};

export default MessageList;