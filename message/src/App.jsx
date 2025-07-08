import { useState } from 'react';
import './index.css';
import { currentUser, users, chats, messages } from './mockData';

function Sidebar({ chats, users, activeChatId, setActiveChatId }) {
  return (
    <aside className="w-full md:w-80 bg-gradient-to-b from-slate-50 to-slate-100 border-r border-slate-200 flex flex-col h-full relative shadow-md rounded-l-2xl">
      {/* User Profile */}
      <div className="flex items-center gap-3 p-5 border-b bg-white/90 rounded-tl-2xl">
        <img src={currentUser.avatar} alt="avatar" className="w-7 h-7 rounded-full border border-slate-300 shadow-sm" />
        <div>
          <div className="font-semibold text-slate-800">{currentUser.name}</div>
          <div className="text-xs text-slate-400 italic">{currentUser.status}</div>
        </div>
      </div>
      {/* Search Bar */}
      <div className="p-4 bg-white/80">
        <input className="w-full px-3 py-2 rounded-lg bg-slate-100 focus:outline-none focus:ring-2 focus:ring-violet-200 transition placeholder:text-slate-400" placeholder="Search for enemies or groups of enemies" />
      </div>
      {/* Chats List */}
      <nav className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-violet-100 scrollbar-track-transparent py-2">
        {chats.map(chat => {
          const user = users.find(u => u.id === chat.userId);
          return (
            <button
              key={chat.id}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl mx-2 my-1 transition-all duration-150 text-left focus:outline-none focus:ring-2 focus:ring-violet-200 ${activeChatId === chat.id ? 'bg-violet-50 shadow' : 'hover:bg-slate-200'}`}
              onClick={() => setActiveChatId(chat.id)}
            >
              <img src={user.avatar} alt="avatar" className="w-6 h-6 rounded-full border border-slate-200" />
              <div className="flex-1 min-w-0">
                <div className="font-medium text-slate-700 truncate">{user.name}</div>
                <div className="text-xs text-slate-400 truncate max-w-[120px]">{chat.lastMessage}</div>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-xs text-slate-300">{chat.lastTimestamp}</span>
                {chat.unread > 0 && <span className="bg-violet-400 text-white text-xs rounded-full px-2 mt-1 shadow-sm">{chat.unread}</span>}
              </div>
            </button>
          );
        })}
      </nav>
      {/* FAB */}
      <button className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-gradient-to-tr from-violet-400 to-slate-300 hover:from-violet-500 hover:to-slate-400 text-white rounded-full w-11 h-11 flex items-center justify-center shadow-lg text-xl border-4 border-white transition-all duration-150">+</button>
    </aside>
  );
}

function ChatWindow({ chat, users, messages, onSend }) {
  if (!chat) return (
    <main className="flex-1 flex items-center justify-center text-slate-400 bg-gradient-to-br from-slate-50 to-white rounded-r-2xl">Select a chat to start messaging</main>
  );
  const user = users.find(u => u.id === chat.userId);
  return (
    <section className="flex flex-col h-full bg-gradient-to-br from-white to-slate-50 rounded-r-2xl shadow-md">
      {/* Header */}
      <header className="flex items-center gap-3 p-5 border-b bg-white/90 rounded-tr-2xl shadow-sm">
        <img src={user.avatar} alt="avatar" className="w-6 h-6 rounded-full border border-slate-200 shadow-sm" />
        <div className="flex-1">
          <div className="font-semibold text-slate-800">{user.name}</div>
          <div className="text-xs text-slate-400 italic">{user.status}</div>
        </div>
      </header>
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gradient-to-b from-slate-50 to-white">
        {messages.map(msg => (
          <div key={msg.id} className={`flex ${msg.from === currentUser.id ? 'justify-end' : 'justify-start'}`}>
            <div className={`rounded-2xl px-4 py-2 max-w-xs shadow ${msg.from === currentUser.id ? 'bg-violet-100 text-slate-800' : 'bg-white border border-slate-100 text-slate-700'}`}>
              {msg.text}
              <div className="text-xs text-slate-300 mt-1 text-right">{msg.time}</div>
            </div>
          </div>
        ))}
      </div>
      {/* Input */}
      <form className="p-5 bg-white/90 flex gap-2 rounded-b-2xl shadow-inner" onSubmit={onSend}>
        <textarea name="message" rows={1} className="flex-1 resize-none border rounded-lg px-3 py-2 focus:outline-violet-300 focus:ring-2 focus:ring-violet-100 transition placeholder:text-slate-400 bg-slate-50" placeholder="Type a message..." />
        <button type="submit" className="bg-violet-400 hover:bg-violet-500 text-white px-4 py-2 rounded-lg font-semibold shadow transition-all duration-150">Send</button>
      </form>
    </section>
  );
}

function App() {
  const [activeChatId, setActiveChatId] = useState(chats[0]?.id || null);
  const [allMessages, setAllMessages] = useState(messages);

  const handleSend = (e) => {
    e.preventDefault();
    const text = e.target.message.value.trim();
    if (!text) return;
    setAllMessages(prev => {
      const chatMsgs = prev[activeChatId] || [];
      return {
        ...prev,
        [activeChatId]: [...chatMsgs, { id: Date.now(), from: currentUser.id, text, time: 'Now' }],
      };
    });
    e.target.reset();
  };

  const activeChat = chats.find(c => c.id === activeChatId);
  const chatMessages = allMessages[activeChatId] || [];

  return (
    <div className="flex h-screen bg-gradient-to-tr from-slate-100 to-violet-50">
      <Sidebar chats={chats} users={users} activeChatId={activeChatId} setActiveChatId={setActiveChatId} />
      <div className="flex-1 flex flex-col h-full">
        <ChatWindow chat={activeChat} users={users} messages={chatMessages} onSend={handleSend} />
      </div>
    </div>
  );
}

export default App;
