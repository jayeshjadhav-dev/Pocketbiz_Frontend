import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { useBrand } from '../context/BrandContext';
import { 
  Save, Store, Palette, Type, LayoutGrid, ArrowLeft, CheckCircle 
} from 'lucide-react';

const Settings = () => {
  const navigate = useNavigate();
  const { user, config, refreshConfig } = useBrand();
  const [loading, setLoading] = useState(false);
  
  // --- 1. YOUR EXACT LOGIC & STATE ---
  const [formData, setFormData] = useState({
    businessName: config?.businessName || '',
    themeColor: config?.themeColor || '#4F46E5',
    customerTerm: config?.labels?.customer || 'Customer',
    orderTerm: config?.labels?.order || 'Order',
    features: {
      khata: config?.features?.khata !== false, 
      inventory: config?.features?.inventory === true,
      staff: config?.features?.staff === true
    }
  });

  // Sync state if config loads later
  useEffect(() => {
    if (config) {
        setFormData(prev => ({
            ...prev,
            businessName: config.businessName || prev.businessName,
            themeColor: config.themeColor || prev.themeColor,
            customerTerm: config.labels?.customer || prev.customerTerm,
            orderTerm: config.labels?.order || prev.orderTerm,
            features: {
                khata: config.features?.khata ?? prev.features.khata,
                inventory: config.features?.inventory ?? prev.features.inventory,
                staff: config.features?.staff ?? prev.features.staff
            }
        }));
    }
  }, [config]);

  const applyPreset = (type) => {
    if (type === 'RETAIL') setFormData({...formData, customerTerm: 'Customer', orderTerm: 'Order', features: { khata: true, inventory: true, staff: true }});
    if (type === 'DOCTOR') setFormData({...formData, customerTerm: 'Patient', orderTerm: 'Appointment', features: { khata: false, inventory: false, staff: true }});
    if (type === 'GYM')    setFormData({...formData, customerTerm: 'Member', orderTerm: 'Membership', features: { khata: true, inventory: false, staff: false }});
    if (type === 'FREELANCE') setFormData({...formData, customerTerm: 'Client', orderTerm: 'Project', features: { khata: true, inventory: false, staff: false }});
  };

  const handleSave = () => {
    if (!user?.id) return;
    setLoading(true);

    fetch(`/api/vendor/${user.id}/update-config`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData)
    })
    .then(res => {
        if(res.ok) {
            if (refreshConfig) refreshConfig(); 
            alert("Settings Saved!");
        } else {
            alert("Failed to save. Check Backend Console.");
        }
    })
    .catch(err => alert("Error: " + err.message))
    .finally(() => setLoading(false));
  };

  const colors = ['#4F46E5', '#EF4444', '#10B981', '#F59E0B', '#EC4899', '#000000'];

  // --- 2. NEW FULL-WIDTH LAYOUT ---
  return (
    // FIX: Removed 'max-w-lg mx-auto', added 'w-full h-full'
    <div className="w-full min-h-screen bg-[#F8FAFC] p-6 md:p-8 animate-enter">
      
      {/* HEADER */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
            <button onClick={() => navigate(-1)} className="p-2 bg-white border border-gray-200 hover:bg-gray-50 rounded-xl transition shadow-sm">
               <ArrowLeft size={20} className="text-gray-600"/>
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Settings</h1>
              <p className="text-gray-500 text-sm">Configure your app appearance & features</p>
            </div>
        </div>
        
        <button 
           onClick={handleSave}
           disabled={loading}
           className="bg-gray-900 text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-lg hover:bg-black hover:scale-105 transition flex items-center gap-2 disabled:opacity-50"
        >
           <Save size={18} /> {loading ? "Saving..." : "Save Changes"}
        </button>
      </div>

      {/* GRID CONTAINER: Spans full width */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
         
         {/* LEFT COLUMN (Span 7) */}
         <div className="lg:col-span-7 flex flex-col gap-8">
            
            {/* LOOK & FEEL */}
            <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100">
               <h3 className="font-bold text-gray-800 flex items-center gap-2 mb-6 text-lg">
                 <Palette size={22} className="text-pink-500"/> Look & Feel
               </h3>
               
               <div className="space-y-6">
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Business Name</label>
                    <input 
                      type="text" 
                      value={formData.businessName}
                      onChange={e => setFormData({...formData, businessName: e.target.value})}
                      className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-lg font-bold rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Brand Color</label>
                    <div className="flex gap-4 flex-wrap">
                      {colors.map((c) => (
                        <button
                          key={c}
                          onClick={() => setFormData({...formData, themeColor: c})}
                          className={`w-12 h-12 rounded-full transition-all flex items-center justify-center ${
                             formData.themeColor === c ? 'ring-4 ring-gray-200 scale-110 shadow-md' : 'hover:scale-110'
                          }`}
                          style={{ backgroundColor: c }}
                        >
                          {formData.themeColor === c && <CheckCircle size={20} className="text-white"/>}
                        </button>
                      ))}
                      {/* Native Color Picker */}
                      <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-gray-200 flex-shrink-0 cursor-pointer hover:scale-110 transition shadow-sm">
                         <input 
                            type="color" 
                            value={formData.themeColor}
                            onChange={e => setFormData({...formData, themeColor: e.target.value})}
                            className="absolute -top-2 -left-2 w-20 h-20 cursor-pointer opacity-0"
                         />
                         <div className="w-full h-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center">
                            <Palette size={18} className="text-white"/>
                         </div>
                      </div>
                    </div>
                  </div>
               </div>
            </div>

            {/* TERMINOLOGY */}
            <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100">
               <h3 className="font-bold text-gray-800 flex items-center gap-2 mb-4 text-lg">
                 <Type size={22} className="text-blue-500"/> Terminology
               </h3>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">My Customers are</label>
                    <input 
                      type="text" 
                      value={formData.customerTerm}
                      onChange={e => setFormData({...formData, customerTerm: e.target.value})}
                      className="w-full bg-gray-50 border border-gray-200 font-bold rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">I Sell / Provide</label>
                    <input 
                      type="text" 
                      value={formData.orderTerm}
                      onChange={e => setFormData({...formData, orderTerm: e.target.value})}
                      className="w-full bg-gray-50 border border-gray-200 font-bold rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" 
                    />
                  </div>
               </div>
            </div>
         </div>

         {/* RIGHT COLUMN (Span 5) */}
         <div className="lg:col-span-5 flex flex-col gap-8">
            
            {/* QUICK PRESETS */}
            <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100">
               <h3 className="font-bold text-gray-800 flex items-center gap-2 mb-4 text-lg">
                 <Store size={22} className="text-indigo-500"/> Quick Presets
               </h3>
               <div className="grid grid-cols-2 gap-3">
                  {['RETAIL', 'DOCTOR', 'GYM', 'FREELANCE'].map((type) => (
                    <button
                      key={type}
                      onClick={() => applyPreset(type)}
                      className="py-4 rounded-xl text-xs font-bold border transition-all bg-white text-gray-600 border-gray-200 hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-700 shadow-sm hover:shadow-md"
                    >
                      {type}
                    </button>
                  ))}
               </div>
            </div>

            {/* MODULES */}
            <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 flex-1">
               <h3 className="font-bold text-gray-800 flex items-center gap-2 mb-6 text-lg">
                 <LayoutGrid size={22} className="text-orange-500"/> App Modules
               </h3>
               
               <div className="space-y-4">
                  <ToggleRow 
                    label="Khata Book" 
                    desc="Manage Credit & Udhaar"
                    active={formData.features.khata}
                    onToggle={() => setFormData({...formData, features: {...formData.features, khata: !formData.features.khata}})}
                  />

                  <ToggleRow 
                    label="Inventory" 
                    desc="Stock Management"
                    active={formData.features.inventory}
                    onToggle={() => setFormData({...formData, features: {...formData.features, inventory: !formData.features.inventory}})}
                  />

                  <ToggleRow 
                    label="Staff Management" 
                    desc="Manage Employee Access"
                    active={formData.features.staff}
                    onToggle={() => setFormData({...formData, features: {...formData.features, staff: !formData.features.staff}})}
                  />
               </div>
            </div>
         </div>

      </div>
    </div>
  );
};

// Helper Component for Toggles
const ToggleRow = ({ label, desc, active, onToggle }) => (
  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100 hover:border-gray-200 transition">
     <div>
        <h4 className="font-bold text-gray-900 text-sm">{label}</h4>
        <p className="text-xs text-gray-400">{desc}</p>
     </div>
     <button 
       onClick={onToggle}
       className={`w-14 h-8 rounded-full p-1 transition-colors duration-300 ${active ? 'bg-green-500' : 'bg-gray-300'}`}
     >
       <div className={`w-6 h-6 bg-white rounded-full shadow-sm transform transition-transform duration-300 ${active ? 'translate-x-6' : 'translate-x-0'}`}></div>
     </button>
  </div>
);

export default Settings;