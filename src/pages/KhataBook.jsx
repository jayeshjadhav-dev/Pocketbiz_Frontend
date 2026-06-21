import { useState, useEffect } from 'react';
import { useBrand } from '../context/BrandContext';
import { ArrowUpRight, ArrowDownLeft, Send, Search, Plus, User, FileText } from 'lucide-react';

const KhataBook = () => {
  const { user, config } = useBrand();
  const [entries, setEntries] = useState([]);
  const [summary, setSummary] = useState({ totalDue: 0, totalGiven: 0, totalReceived: 0 });
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

 
 
  const customerTerm = config?.labels?.customer || 'Customer'; 
  const orderTerm = config?.labels?.order || 'Order';         
  
  const getPlaceholders = () => {
    const type = orderTerm.toLowerCase();
    if (type === 'job' || type === 'service') {
        return { desc: "Service Details (e.g. AC Repair)", person: `Enter ${customerTerm} Name` };
    }
    if (type === 'table') {
        return { desc: "Items Ordered (e.g. 2 Coffee)", person: "Customer / Table No" };
    }
    return { desc: "Items / Bill Note", person: `Enter ${customerTerm} Name` };
  };
  
  const placeholders = getPlaceholders();

  // Form State
  const [formData, setFormData] = useState({
    customerName: '', customerPhone: '', amount: '', description: '', type: 'CREDIT'
  });

  // 2. Load Data
  const loadData = () => {
    if (!user?.id) return;

    fetch(`/api/khata/${user.id}`)
      .then(res => res.json())
      .then(data => setEntries(data || []));

    fetch(`/api/khata/${user.id}/summary`)
      .then(res => res.json())
      .then(data => setSummary(data || { totalDue: 0, totalGiven: 0, totalReceived: 0 }));
  };

  useEffect(() => { loadData(); }, [user]);

  // 3. Handle Submit
  const handleSubmit = (e) => {
    e.preventDefault();
    fetch(`/api/khata/${user.id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData)
    }).then(() => {
      setShowModal(false);
      setFormData({ customerName: '', customerPhone: '', amount: '', description: '', type: 'CREDIT' });
      loadData();
    });
  };

  // 4. WhatsApp Reminder
  const sendReminder = (entry) => {
    if (!entry.customerPhone) return alert("No phone number saved!");
    
    // Dynamic Message
    const msg = `Hello ${entry.customerName}, your payment of ₹${entry.amount} for ${entry.description} is pending at ${config?.businessName}. Please pay soon.`;
    
    window.open(`https://wa.me/${entry.customerPhone}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  // Filter List
  const filteredEntries = entries.filter(e => 
    e?.customerName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="pb-24 space-y-4">
      
      {/* HEADER CARD */}
      <div className="bg-indigo-600 p-6 rounded-2xl text-white shadow-lg transition-transform hover:scale-[1.01]">
        <div className="flex justify-between items-start">
            <div>
                <p className="text-indigo-200 text-sm font-medium">Net Market Balance</p>
                <h1 className="text-4xl font-bold mt-1">₹{summary.totalDue}</h1>
            </div>
            <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                <FileText size={24} className="text-white" />
            </div>
        </div>
        
        <div className="flex gap-4 mt-6 text-sm">
           <div className="bg-white/10 px-3 py-1.5 rounded-lg flex items-center gap-2 flex-1 justify-center">
             <div className="bg-red-500 p-1 rounded-full"><ArrowUpRight size={12}/></div>
             <span className="truncate">You'll Get: ₹{summary.totalGiven}</span>
           </div>
           <div className="bg-white/10 px-3 py-1.5 rounded-lg flex items-center gap-2 flex-1 justify-center">
             <div className="bg-green-500 p-1 rounded-full"><ArrowDownLeft size={12}/></div>
             <span className="truncate">You'll Pay: ₹{summary.totalReceived}</span>
           </div>
        </div>
      </div>

      {/* SEARCH BAR */}
      <div className="relative">
        <Search className="absolute left-3 top-3 text-gray-400" size={20} />
        <input 
          type="text" 
          placeholder={`Search ${customerTerm}...`} 
          className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* TRANSACTION LIST */}
      <div className="space-y-3">
        {filteredEntries.length === 0 && (
           <div className="text-center py-12 text-gray-400 bg-white rounded-2xl border border-dashed">
             <p>No {customerTerm.toLowerCase()}s found.</p>
             <button onClick={() => setShowModal(true)} className="text-indigo-600 text-sm font-bold mt-2">Add First Entry</button>
           </div>
        )}

        {filteredEntries.map((entry) => (
          <div key={entry.id} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex justify-between items-center hover:shadow-md transition">
             
             {/* Left: Info */}
             <div className="flex items-center gap-3">
               <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${entry.type === 'CREDIT' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                  {entry.customerName.charAt(0).toUpperCase()}
               </div>
               <div>
                 <h3 className="font-bold text-gray-800">{entry.customerName}</h3>
                 <p className="text-xs text-gray-400 flex items-center gap-1">
                   {new Date(entry.date).toLocaleDateString()} • {entry.description || 'No notes'}
                 </p>
               </div>
             </div>

             {/* Right: Amount */}
             <div className="flex items-center gap-3">
                <div className={`text-right ${entry.type === 'CREDIT' ? 'text-red-500' : 'text-green-600'}`}>
                   <p className="font-bold text-lg">
                     {entry.type === 'CREDIT' ? '-' : '+'} ₹{entry.amount}
                   </p>
                </div>

                {/* Reminder Button */}
                {entry.type === 'CREDIT' && (
                  <button 
                    onClick={() => sendReminder(entry)}
                    className="bg-green-100 text-green-600 p-2.5 rounded-full hover:bg-green-200 transition active:scale-95"
                    title="Send WhatsApp Reminder"
                  >
                    <Send size={16} />
                  </button>
                )}
             </div>
          </div>
        ))}
      </div>

      {/* FLOATING ACTION BUTTON */}
      <button 
        onClick={() => setShowModal(true)}
        className="fixed bottom-24 right-5 bg-gray-900 text-white p-4 rounded-full shadow-xl hover:bg-black transition-transform active:scale-90 z-40"
      >
        <Plus size={24} />
      </button>

      {/* === DYNAMIC MODAL === */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 backdrop-blur-sm">
          <div className="bg-white w-full max-w-sm rounded-t-2xl sm:rounded-2xl p-6 animate-in slide-in-from-bottom-10 duration-300">
            
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">New Entry</h2>
                <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
               {/* Type Toggle */}
               <div className="flex bg-gray-100 p-1.5 rounded-xl">
                  <button 
                    type="button"
                    onClick={() => setFormData({...formData, type: 'CREDIT'})}
                    className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all ${formData.type === 'CREDIT' ? 'bg-red-500 text-white shadow-md' : 'text-gray-500 hover:text-gray-700'}`}
                  >
                    Given (Udhaar)
                  </button>
                  <button 
                    type="button"
                    onClick={() => setFormData({...formData, type: 'PAYMENT'})}
                    className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all ${formData.type === 'PAYMENT' ? 'bg-green-500 text-white shadow-md' : 'text-gray-500 hover:text-gray-700'}`}
                  >
                    Received (Jama)
                  </button>
               </div>

               {/* Dynamic Inputs */}
               <div>
                  <label className="text-xs font-bold text-gray-500 uppercase ml-1 mb-1 block">{customerTerm} Name</label>
                  <div className="relative">
                      <User className="absolute left-3 top-3.5 text-gray-400" size={18} />
                      <input 
                        required 
                        placeholder={placeholders.person} 
                        className="w-full pl-10 pr-4 py-3 border rounded-xl bg-gray-50 focus:bg-white transition focus:ring-2 focus:ring-indigo-500 outline-none"
                        value={formData.customerName}
                        onChange={e => setFormData({...formData, customerName: e.target.value})}
                      />
                  </div>
               </div>
               
               <div className="flex gap-3">
                 <div className="w-1/2">
                    <label className="text-xs font-bold text-gray-500 uppercase ml-1 mb-1 block">Phone</label>
                    <input 
                        type="number"
                        placeholder="98..." 
                        className="w-full p-3 border rounded-xl bg-gray-50 focus:bg-white transition outline-none"
                        value={formData.customerPhone}
                        onChange={e => setFormData({...formData, customerPhone: e.target.value})}
                    />
                 </div>
                 <div className="w-1/2">
                    <label className="text-xs font-bold text-gray-500 uppercase ml-1 mb-1 block">Amount</label>
                    <input 
                        required
                        type="number" 
                        placeholder="₹0" 
                        className="w-full p-3 border rounded-xl bg-gray-50 font-bold text-lg focus:bg-white transition outline-none"
                        value={formData.amount}
                        onChange={e => setFormData({...formData, amount: e.target.value})}
                    />
                 </div>
               </div>

               <div>
                   <label className="text-xs font-bold text-gray-500 uppercase ml-1 mb-1 block">Details</label>
                   <input 
                     placeholder={placeholders.desc} 
                     className="w-full p-3 border rounded-xl bg-gray-50 focus:bg-white transition outline-none"
                     value={formData.description}
                     onChange={e => setFormData({...formData, description: e.target.value})}
                   />
               </div>

               <button type="submit" className="w-full bg-gray-900 text-white py-4 rounded-xl font-bold mt-2 shadow-lg hover:bg-black transition">
                 Save Entry
               </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default KhataBook;