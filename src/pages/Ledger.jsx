import { useState, useEffect } from 'react';
import { useBrand } from '../context/BrandContext';
import { ArrowUpRight, ArrowDownLeft, Send, Search, Plus, User, FileText } from 'lucide-react';

const Ledger = () => {
  const { user, config } = useBrand();
  const [entries, setEntries] = useState([]);
  const [summary, setSummary] = useState({ totalDue: 0, totalGiven: 0, totalReceived: 0 });
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    customerName: '', customerPhone: '', amount: '', description: '', type: 'CREDIT'
  });

  const customerTerm = config?.labels?.customer || 'Customer'; 
  const orderTerm = config?.labels?.order || 'Order';         
  
  const getPlaceholders = () => {
    const type = orderTerm.toLowerCase();
    if (type === 'job' || type === 'service') return { desc: "Service Details", person: `Enter ${customerTerm} Name` };
    if (type === 'table') return { desc: "Items Ordered", person: "Table No / Name" };
    return { desc: "Items / Bill Note", person: `Enter ${customerTerm} Name` };
  };
  const placeholders = getPlaceholders();

  const loadData = () => {
    if (!user?.id) return;
    fetch(`/api/khata/${user.id}`)
      .then(res => res.json())
      .then(data => setEntries(data || []))
      .catch(err => console.log(err));

    fetch(`/api/khata/${user.id}/summary`)
      .then(res => res.json())
      .then(data => setSummary(data || { totalDue: 0, totalGiven: 0, totalReceived: 0 }))
      .catch(() => {});
  };

  useEffect(() => { loadData(); }, [user]);

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

  const sendReminder = (entry) => {
    if (!entry.customerPhone) return alert("No phone number saved.");
    const msg = `Hello ${entry.customerName}, payment of ₹${entry.amount} is pending. Please pay soon.`;
    window.open(`https://wa.me/${entry.customerPhone}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const filteredEntries = entries.filter(e => 
    e?.customerName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto pb-24">
      {/* HEADER CARD */}
      <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 p-8 rounded-3xl text-white shadow-xl">
        <div className="flex justify-between items-start">
            <div>
                <p className="text-indigo-200 text-sm font-semibold uppercase">Net Market Balance</p>
                <h1 className="text-5xl font-bold mt-2">₹{summary.totalDue}</h1>
            </div>
            <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-md">
                <FileText size={32} className="text-white" />
            </div>
        </div>
        <div className="flex gap-4 mt-8">
           <div className="bg-black/20 px-6 py-3 rounded-xl flex items-center gap-3 flex-1 border border-white/10">
             <div className="bg-red-500 p-2 rounded-full"><ArrowUpRight size={16} className="text-white"/></div>
             <div><p className="text-xs text-indigo-200">Total Given</p><p className="font-bold text-lg">₹{summary.totalGiven}</p></div>
           </div>
           <div className="bg-black/20 px-6 py-3 rounded-xl flex items-center gap-3 flex-1 border border-white/10">
             <div className="bg-green-500 p-2 rounded-full"><ArrowDownLeft size={16} className="text-white"/></div>
             <div><p className="text-xs text-indigo-200">Total Received</p><p className="font-bold text-lg">₹{summary.totalReceived}</p></div>
           </div>
        </div>
      </div>

      {/* SEARCH */}
      <div className="relative">
        <Search className="absolute left-4 top-3.5 text-gray-400" size={20} />
        <input type="text" placeholder={`Search ${customerTerm}...`} className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-gray-200 shadow-sm outline-none focus:ring-2 focus:ring-indigo-500" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
      </div>

      {/* LIST */}
      <div className="space-y-3">
        {filteredEntries.map((entry) => (
          <div key={entry.id} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex justify-between items-center hover:shadow-md transition">
             <div className="flex items-center gap-4">
               <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${entry.type === 'CREDIT' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>{entry.customerName.charAt(0).toUpperCase()}</div>
               <div><h3 className="font-bold text-gray-800 text-lg">{entry.customerName}</h3><p className="text-sm text-gray-400">{new Date(entry.date).toLocaleDateString()} • {entry.description}</p></div>
             </div>
             <div className="flex items-center gap-4">
                <div className={`text-right ${entry.type === 'CREDIT' ? 'text-red-500' : 'text-green-600'}`}><p className="font-bold text-xl">{entry.type === 'CREDIT' ? '-' : '+'} ₹{entry.amount}</p></div>
                {entry.type === 'CREDIT' && <button onClick={() => sendReminder(entry)} className="bg-green-100 text-green-700 p-3 rounded-xl hover:bg-green-600 hover:text-white transition"><Send size={18} /></button>}
             </div>
          </div>
        ))}
      </div>

      {/* ADD BUTTON */}
      <button onClick={() => setShowModal(true)} className="fixed bottom-10 right-10 bg-gray-900 text-white p-5 rounded-2xl shadow-2xl hover:scale-110 transition z-40"><Plus size={24} /></button>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-3xl p-8 shadow-2xl">
            <h2 className="text-2xl font-bold mb-6">New Entry</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
               <div className="flex bg-gray-100 p-1.5 rounded-2xl">
                  <button type="button" onClick={() => setFormData({...formData, type: 'CREDIT'})} className={`flex-1 py-3 rounded-xl font-bold ${formData.type === 'CREDIT' ? 'bg-red-500 text-white' : 'text-gray-500'}`}>GIVEN</button>
                  <button type="button" onClick={() => setFormData({...formData, type: 'PAYMENT'})} className={`flex-1 py-3 rounded-xl font-bold ${formData.type === 'PAYMENT' ? 'bg-green-500 text-white' : 'text-gray-500'}`}>RECEIVED</button>
               </div>
               <input required placeholder={placeholders.person} className="w-full p-4 border rounded-2xl bg-gray-50 outline-none" value={formData.customerName} onChange={e => setFormData({...formData, customerName: e.target.value})} />
               <div className="flex gap-4">
                 <input type="number" placeholder="Mobile" className="w-full p-4 border rounded-2xl bg-gray-50 outline-none" value={formData.customerPhone} onChange={e => setFormData({...formData, customerPhone: e.target.value})} />
                 <input required type="number" placeholder="₹0" className="w-full p-4 border rounded-2xl bg-gray-50 font-bold outline-none" value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} />
               </div>
               <input placeholder={placeholders.desc} className="w-full p-4 border rounded-2xl bg-gray-50 outline-none" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
               <button type="submit" className="w-full bg-gray-900 text-white py-4 rounded-2xl font-bold mt-4">Save Entry</button>
               <button type="button" onClick={() => setShowModal(false)} className="w-full text-gray-400 py-2">Cancel</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Ledger;