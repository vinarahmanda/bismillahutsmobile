// components/Chatbot.js
import { useState } from 'react';
import { functions } from '../lib/firebase';  // Import functions dari firebase.js
import { httpsCallable } from 'firebase/functions';

function Chatbot() {
  const [userInput, setUserInput] = useState('');
  const [messages, setMessages] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Tambahkan pesan pengguna ke daftar pesan
    setMessages([...messages, { text: userInput, sender: 'user' }]);

    try {
      // Mengirim input ke Firebase Function
      const sendMessage = httpsCallable(functions, 'chatbot');
      const result = await sendMessage({ userInput });

      // Tambahkan balasan chatbot ke daftar pesan
      setMessages([
        ...messages, 
        { text: userInput, sender: 'user' }, 
        { text: result.data.reply, sender: 'chatbot' }
      ]);
      setUserInput('');  // Clear input setelah mengirim
    } catch (error) {
      console.error('Error fetching chatbot reply:', error);
    }
  };

  return (
    <div>
      <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
        {messages.map((msg, index) => (
          <div key={index} style={{ textAlign: msg.sender === 'user' ? 'right' : 'left' }}>
            <p>{msg.text}</p>
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit}>
        <input 
          type="text" 
          value={userInput} 
          onChange={(e) => setUserInput(e.target.value)} 
          placeholder="Ketik sesuatu..." 
          required
        />
        <button type="submit">Kirim</button>
      </form>
    </div>
  );
}

export default Chatbot;
