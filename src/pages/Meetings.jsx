import { useState, useEffect } from 'react';
import { JitsiMeeting } from '@jitsi/react-sdk';
import { Video, Calendar, Plus, Crown, Clock, User, ArrowLeft } from 'lucide-react';
import { useBrand } from '../context/BrandContext';
import { useNavigate } from 'react-router-dom';

const Meetings = () => {
  const { config, user } = useBrand();
  const navigate = useNavigate();

  // --- STATE ---
  const [meetings, setMeetings] = useState([]);
  const [activeMeeting, setActiveMeeting] = useState(null); // If set, shows video
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newMeetingTitle, setNewMeetingTitle] = useState("");

  const API_URL = "/api/meetings";

  // --- PLATINUM CHECK ---
  const PLAN = config?.plan?.name || "BASIC";
  
  if (PLAN !== 'PLATINUM') {
    return (
       <div className="h-screen bg-gray-50 flex flex-col items-center justify-center p-6 text-center animate-enter">
          <div className="w-20 h-20 bg-gray-900 rounded-full flex items-center justify-center mb-6 shadow-xl">
             <Video size={32} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Video Conferencing</h1>
          <p className="text-gray-500 max-w-md mb-8">
             Host client meetings, demos, and team syncs directly inside the app. Exclusive to Platinum members.
          </p>
          <button onClick={() => navigate('/subscription')} className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-3 rounded-xl font-bold hover:scale-105 transition shadow-lg flex items-center gap-2">
             <Crown size={18} className="text-yellow-300"/> Unlock Meetings
          </button>
       </div>
    );
  }

  // --- LOAD MEETINGS ---
  useEffect(() => {
    fetchMeetings();
  }, []);

  const fetchMeetings = async () => {
    try {
      const res = await fetch(API_URL);
      if(res.ok) setMeetings(await res.json());
    } catch(e) { console.error(e); }
  };

  const handleCreateMeeting = async () => {
    if(!newMeetingTitle.trim()) return;
    
    await fetch(`${API_URL}/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            title: newMeetingTitle,
            hostName: config?.businessName || "Host",
            scheduledTime: new Date().toISOString() // Defaults to now for demo
        })
    });
    setNewMeetingTitle("");
    setShowCreateModal(false);
    fetchMeetings();
  };

  // --- RENDER: LIVE VIDEO ROOM ---
  if (activeMeeting) {
      return (
          <div className="h-screen w-full bg-gray-900 flex flex-col">
              <div className="p-4 bg-gray-800 text-white flex justify-between items-center">
                  <div className="flex items-center gap-3">
                      <button onClick={() => setActiveMeeting(null)} className="p-2 hover:bg-gray-700 rounded-lg">
                          <ArrowLeft size={20}/>
                      </button>
                      <h2 className="font-bold">{activeMeeting.title}</h2>
                  </div>
                  <span className="text-xs bg-red-500 px-2 py-1 rounded animate-pulse">LIVE</span>
              </div>
              
              <div className="flex-1 w-full">
                  <JitsiMeeting
                      domain="meet.jit.si"
                      roomName={activeMeeting.roomCode}
                      configOverwrite={{
                          startWithAudioMuted: true,
                          disableThirdPartyRequests: true,
                          prejoinPageEnabled: false
                      }}
                      interfaceConfigOverwrite={{
                          TOOLBAR_BUTTONS: [
                              'microphone', 'camera', 'closedcaptions', 'desktop', 'fullscreen',
                              'fodeviceselection', 'hangup', 'profile', 'chat', 'recording',
                              'livestreaming', 'etherpad', 'sharedvideo', 'settings', 'raisehand',
                              'videoquality', 'filmstrip', 'invite', 'feedback', 'stats', 'shortcuts',
                              'tileview', 'videobackgroundblur', 'download', 'help', 'mute-everyone',
                              'security'
                          ],
                      }}
                      userInfo={{
                          displayName: config?.businessName || "User"
                      }}
                      onApiReady={(externalApi) => {
                          // You can attach listeners here
                      }}
                      getIFrameRef={(iframeRef) => { iframeRef.style.height = '100%'; }}
                  />
              </div>
          </div>
      );
  }

  // --- RENDER: DASHBOARD ---
  return (
    <div className="min-h-screen bg-[#F8FAFC] p-8 animate-enter">
       <div className="max-w-5xl mx-auto">
          
          <div className="flex justify-between items-center mb-8">
             <div>
                <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                   <Video className="text-indigo-600"/> Meeting Hub
                </h1>
                <p className="text-gray-500 text-sm">Schedule and join secure business calls</p>
             </div>
             <button 
                onClick={() => setShowCreateModal(true)}
                className="bg-black text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-gray-800 transition shadow-lg"
             >
                <Plus size={18}/> New Meeting
             </button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
             {meetings.map(m => (
                <div key={m.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition">
                   <div className="flex justify-between items-start mb-4">
                      <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
                         <Calendar size={24}/>
                      </div>
                      <span className="text-[10px] font-bold bg-green-100 text-green-700 px-2 py-1 rounded-full">
                         {m.status}
                      </span>
                   </div>
                   
                   <h3 className="font-bold text-gray-900 text-lg mb-1">{m.title}</h3>
                   <p className="text-xs text-gray-400 flex items-center gap-1 mb-4">
                      <User size={12}/> Host: {m.hostName}
                   </p>

                   <div className="flex items-center gap-2 text-xs text-gray-500 mb-6 bg-gray-50 p-2 rounded-lg">
                      <Clock size={14}/> 
                      {new Date(m.scheduledTime).toLocaleString()}
                   </div>

                   <button 
                      onClick={() => setActiveMeeting(m)}
                      className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-700 transition flex justify-center items-center gap-2"
                   >
                      <Video size={16}/> Join Room
                   </button>
                </div>
             ))}

             {meetings.length === 0 && (
                <div className="col-span-full py-20 text-center text-gray-400">
                   <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Calendar size={24} className="opacity-50"/>
                   </div>
                   <p>No meetings scheduled.</p>
                </div>
             )}
          </div>
       </div>

       {/* CREATE MODAL */}
       {showCreateModal && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
             <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl animate-enter">
                <h3 className="font-bold text-lg mb-4">Schedule New Meeting</h3>
                <input 
                   autoFocus
                   value={newMeetingTitle}
                   onChange={(e) => setNewMeetingTitle(e.target.value)}
                   placeholder="e.g. Weekly Strategy Call"
                   className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl mb-4 font-bold outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <div className="flex gap-3">
                   <button onClick={() => setShowCreateModal(false)} className="flex-1 py-3 text-gray-500 font-bold hover:bg-gray-50 rounded-xl">Cancel</button>
                   <button onClick={handleCreateMeeting} className="flex-1 py-3 bg-black text-white font-bold rounded-xl hover:bg-gray-800">Schedule</button>
                </div>
             </div>
          </div>
       )}
    </div>
  );
};

export default Meetings;