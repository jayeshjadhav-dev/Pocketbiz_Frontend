import { useState, useEffect, useRef } from 'react';
import { 
  MessageSquare, Users, TrendingUp, Search, Send, 
  MoreHorizontal, Heart, MessageCircle, Share2, 
  Image as ImageIcon, Award, Lock, Crown
} from 'lucide-react';
import { useBrand } from '../context/BrandContext';
import { useNavigate } from 'react-router-dom';

const Community = () => {
  const { config, user } = useBrand(); 
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('FEED');
  
  // My Details
  const MY_ID = config?.businessName || "Unknown";
  const MY_PLAN = config?.plan?.name || "BASIC";

  // State
  const [posts, setPosts] = useState([]);
  const [members, setMembers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [postInput, setPostInput] = useState("");
  const [chatInput, setChatInput] = useState("");
  const [activeChatMember, setActiveChatMember] = useState(null);
  const chatScrollRef = useRef(null);

  const API_URL = "/api/community";

  // --- ACCESS CONTROL CHECK ---
  if (MY_PLAN !== 'PLATINUM') {
     return (
        <div className="w-full h-screen bg-gray-50 flex flex-col items-center justify-center p-6 text-center animate-enter">
           <div className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center shadow-2xl mb-6">
              <Lock size={40} className="text-white" />
           </div>
           <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Platinum Exclusive</h1>
           <p className="text-gray-500 max-w-md mb-8">
              The Business Community is reserved for our elite partners. Network with top vendors, share leads, and grow your business.
           </p>
           
           <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 max-w-sm w-full mb-8">
              <div className="flex items-center gap-4 mb-4">
                 <div className="w-12 h-12 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600">
                    <Users size={24}/>
                 </div>
                 <div className="text-left">
                    <h3 className="font-bold text-gray-900">Networking</h3>
                    <p className="text-xs text-gray-500">Connect with local suppliers</p>
                 </div>
              </div>
              <div className="flex items-center gap-4">
                 <div className="w-12 h-12 bg-pink-50 rounded-full flex items-center justify-center text-pink-600">
                    <TrendingUp size={24}/>
                 </div>
                 <div className="text-left">
                    <h3 className="font-bold text-gray-900">Growth Feed</h3>
                    <p className="text-xs text-gray-500">Share achievements & offers</p>
                 </div>
              </div>
           </div>

           <button 
             onClick={() => navigate('/subscription')}
             className="bg-black text-white px-8 py-3 rounded-xl font-bold hover:scale-105 transition shadow-lg flex items-center gap-2"
           >
              <Crown size={18} className="text-yellow-400"/> Upgrade to Platinum
           </button>
        </div>
     );
  }

  // --- REST OF THE COMPONENT (Only renders if Platinum) ---

  useEffect(() => {
    fetchPosts();
    fetchMembers();

    const interval = setInterval(() => {
       if (activeTab === 'FEED') fetchPosts();
       if (activeTab === 'CHAT' && activeChatMember) fetchMessages(activeChatMember.businessName);
    }, 3000);

    return () => clearInterval(interval);
  }, [activeTab, activeChatMember]);

  const fetchPosts = async () => {
    try {
      const res = await fetch(`${API_URL}/posts`);
      if(res.ok) setPosts(await res.json());
    } catch (e) { console.error("Feed error", e); }
  };

  const fetchMembers = async () => {
    try {
      const res = await fetch(`${API_URL}/members`);
      if(res.ok) {
         const allMembers = await res.json();
         // Filter out myself so I don't appear in my own list
         setMembers(allMembers.filter(m => m.businessName !== MY_ID));
      }
    } catch (e) { console.error("Members error", e); }
  };

  const fetchMessages = async (otherId) => {
    try {
      const res = await fetch(`${API_URL}/messages/${MY_ID}/${otherId}`);
      if(res.ok) setMessages(await res.json());
    } catch (e) { console.error("Chat error", e); }
  };

  // ... (Handlers: handlePostSubmit, handleStartChat, handleSendMessage - SAME AS BEFORE) ...
  const handlePostSubmit = async () => {
    if (!postInput.trim()) return;
    await fetch(`${API_URL}/posts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            authorName: MY_ID,
            category: config?.category || "General",
            avatarColor: config?.themeColor || "#000",
            content: postInput,
            likes: 0
        })
    });
    setPostInput("");
    fetchPosts();
  };

  const handleStartChat = (member) => {
     setActiveChatMember(member);
     setActiveTab('CHAT');
     fetchMessages(member.businessName);
  };

  const handleSendMessage = async () => {
     if(!chatInput.trim() || !activeChatMember) return;
     await fetch(`${API_URL}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
           senderId: MY_ID,
           receiverId: activeChatMember.businessName,
           content: chatInput
        })
     });
     setChatInput("");
     fetchMessages(activeChatMember.businessName);
  };

  // Auto-scroll chat
  useEffect(() => {
    if (chatScrollRef.current) chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
  }, [messages]);

  return (
    <div className="w-full h-[calc(100vh-2rem)] md:h-screen bg-[#F8FAFC] flex flex-col animate-enter overflow-hidden">
      
      {/* HEADER */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex flex-col md:flex-row justify-between items-start md:items-center shrink-0 gap-4">
        <div>
           <div className="flex items-center gap-2">
             <h1 className="text-2xl font-bold text-gray-900">Business Community</h1>
             <span className="bg-black text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
               <Crown size={10} className="text-yellow-400"/> PLATINUM
             </span>
           </div>
           <p className="text-sm text-gray-500">Exclusive Vendor Network</p>
        </div>
        
        <div className="bg-gray-100 p-1 rounded-xl flex gap-1 w-full md:w-auto">
           <TabButton label="Feed" icon={<TrendingUp size={16}/>} active={activeTab === 'FEED'} onClick={() => setActiveTab('FEED')} />
           <TabButton label="Members" icon={<Users size={16}/>} active={activeTab === 'MEMBERS'} onClick={() => setActiveTab('MEMBERS')} />
           <TabButton label="Chats" icon={<MessageSquare size={16}/>} active={activeTab === 'CHAT'} onClick={() => setActiveTab('CHAT')} />
        </div>
      </div>

      <div className="flex-1 overflow-hidden flex relative">
         
         {/* --- FEED TAB --- */}
         {activeTab === 'FEED' && (
            <div className="flex-1 overflow-y-auto p-4 md:p-6 w-full">
               <div className="max-w-2xl mx-auto">
                  {/* Create Post */}
                  <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-6">
                     <div className="flex gap-4">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold shrink-0" style={{ backgroundColor: config?.themeColor }}>
                           {MY_ID[0]}
                        </div>
                        <textarea 
                          value={postInput}
                          onChange={(e) => setPostInput(e.target.value)}
                          className="flex-1 bg-gray-50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 resize-none h-20"
                          placeholder={`Share updates with the network...`}
                        />
                     </div>
                     <div className="flex justify-end mt-3 pt-3 border-t border-gray-50">
                        <button onClick={handlePostSubmit} className="bg-black text-white px-6 py-1.5 rounded-lg text-xs font-bold hover:scale-105 transition">Post</button>
                     </div>
                  </div>

                  {/* Posts List */}
                  <div className="space-y-6 pb-20">
                     {posts.length === 0 && <div className="text-center text-gray-400 py-10">No posts yet. Start the conversation!</div>}
                     {posts.map(post => (
                        <div key={post.id} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                           <div className="flex gap-3 mb-3">
                              <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold shrink-0" style={{ backgroundColor: post.avatarColor }}>
                                 {post.authorName ? post.authorName[0] : '?'}
                              </div>
                              <div>
                                 <h3 className="font-bold text-gray-900 text-sm">{post.authorName}</h3>
                                 <p className="text-xs text-gray-400">{post.category} • {new Date(post.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                              </div>
                           </div>
                           <p className="text-gray-700 text-sm whitespace-pre-wrap">{post.content}</p>
                        </div>
                     ))}
                  </div>
               </div>
            </div>
         )}

         {/* --- MEMBERS TAB --- */}
         {activeTab === 'MEMBERS' && (
            <div className="flex-1 overflow-y-auto p-6 w-full">
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-20">
                  {members.map(member => (
                     <div key={member.id} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-sm shrink-0" style={{ backgroundColor: member.themeColor || '#6366f1' }}>
                           {member.businessName ? member.businessName[0] : '?'}
                        </div>
                        <div className="flex-1 min-w-0">
                           <h3 className="font-bold text-gray-900 text-sm truncate">{member.businessName}</h3>
                           <p className="text-xs text-gray-500">{member.category || "Business"}</p>
                        </div>
                        <button 
                           onClick={() => handleStartChat(member)}
                           className="px-3 py-1.5 bg-indigo-50 text-indigo-600 text-xs font-bold rounded-lg hover:bg-indigo-100 transition whitespace-nowrap"
                        >
                           Message
                        </button>
                     </div>
                  ))}
                  {members.length === 0 && (
                     <div className="col-span-full text-center py-20">
                        <div className="inline-block p-4 bg-gray-100 rounded-full mb-4"><Users size={32} className="text-gray-400"/></div>
                        <h3 className="text-gray-900 font-bold">No other Platinum Members yet</h3>
                        <p className="text-gray-500 text-sm mt-1">You are the first! Invite others to join.</p>
                     </div>
                  )}
               </div>
            </div>
         )}

         {/* --- CHAT TAB (Same logic as before, just kept for completeness) --- */}
         {activeTab === 'CHAT' && (
            <div className="flex-1 flex h-full bg-white md:border-l border-gray-200 absolute inset-0 md:relative z-10">
               {/* Sidebar */}
               <div className="hidden md:flex flex-col w-80 border-r border-gray-200">
                  <div className="p-4 border-b border-gray-100 bg-gray-50/50">
                     <h3 className="font-bold text-gray-700 text-sm">Your Conversations</h3>
                  </div>
                  <div className="flex-1 overflow-y-auto">
                     {members.map(member => (
                        <div 
                           key={member.id} 
                           onClick={() => handleStartChat(member)}
                           className={`p-4 cursor-pointer flex gap-3 border-b border-gray-50 transition ${activeChatMember?.id === member.id ? 'bg-indigo-50 border-indigo-100' : 'hover:bg-gray-50'}`}
                        >
                           <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0" style={{ backgroundColor: member.themeColor || '#6366f1' }}>
                              {member.businessName[0]}
                           </div>
                           <div className="min-w-0">
                              <h4 className="font-bold text-gray-900 text-sm truncate">{member.businessName}</h4>
                           </div>
                        </div>
                     ))}
                  </div>
               </div>
               
               {/* Window */}
               <div className="flex-1 flex flex-col bg-[#FDFBF7] w-full">
                  {!activeChatMember ? (
                     <div className="h-full flex flex-col items-center justify-center text-gray-400">
                        <MessageSquare size={48} className="mb-2 opacity-20"/>
                        <p>Select a member to start chatting</p>
                     </div>
                  ) : (
                     <>
                        <div className="p-4 bg-white border-b border-gray-200 flex items-center gap-3 shadow-sm z-10">
                           <div className="w-8 h-8 rounded-full text-white flex items-center justify-center font-bold text-sm shrink-0" style={{ backgroundColor: activeChatMember.themeColor || '#6366f1' }}>
                              {activeChatMember.businessName[0]}
                           </div>
                           <h4 className="font-bold text-gray-900 text-sm">{activeChatMember.businessName}</h4>
                        </div>
                        <div ref={chatScrollRef} className="flex-1 p-4 space-y-3 overflow-y-auto scroll-smooth">
                           {messages.map((msg, idx) => {
                              const isMe = msg.senderId === MY_ID;
                              return (
                                 <div key={idx} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[75%] p-3 rounded-2xl text-sm shadow-sm ${isMe ? 'bg-indigo-600 text-white rounded-br-none' : 'bg-white border border-gray-200 text-gray-800 rounded-bl-none'}`}>
                                       <p>{msg.content}</p>
                                    </div>
                                 </div>
                              );
                           })}
                        </div>
                        <div className="p-3 bg-white border-t border-gray-200 flex gap-2">
                           <input 
                              value={chatInput}
                              onChange={(e) => setChatInput(e.target.value)}
                              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                              className="flex-1 bg-gray-50 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-indigo-100" 
                              placeholder="Type a message..."
                           />
                           <button onClick={handleSendMessage} className="p-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition">
                              <Send size={18}/>
                           </button>
                        </div>
                     </>
                  )}
               </div>
            </div>
         )}
      </div>
    </div>
  );
};

const TabButton = ({ label, icon, active, onClick }) => (
    <button 
      onClick={onClick}
      className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${
        active ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200/50'
      }`}
    >
       {icon} <span className="hidden md:inline">{label}</span>
    </button>
 );

export default Community;