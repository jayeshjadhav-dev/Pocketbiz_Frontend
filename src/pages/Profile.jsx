import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBrand } from '../context/BrandContext';
import { 
  Crown, FileText, Video, Users, Palette, Share2, LogOut, 
  ChevronRight, Phone, Store, ShieldCheck, Edit2, Sparkles, IdCard, 
  Save, X, Loader2, Building2
} from 'lucide-react';

const Profile = () => {
  const navigate = useNavigate();
  const { user, config, login, logout } = useBrand();

  // --- STATE FOR EDITING ---
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    businessName: '',
    category: 'RETAIL',
    themeColor: '#4F46E5'
  });

  // Sync state with Context Data
  useEffect(() => {
    if (user && config) {
      setFormData({
        businessName: user.businessName || '',
        category: config.category || 'RETAIL',
        themeColor: config.themeColor || '#4F46E5'
      });
    }
  }, [user, config]);

  // Safe Defaults for Display
  const mobile = user?.mobileNumber || '9876543210';
  const plan = (config?.plan?.name || 'BASIC').toUpperCase(); 

  // --- THE FIX: CONNECT TO CORRECT BACKEND ---
  const handleSave = async () => {
    setIsLoading(true);
    try {
      const payload = {
        mobileNumber: user.mobileNumber, // Identify user
        businessName: formData.businessName,
        config: {
           category: formData.category,
           themeColor: formData.themeColor
           // We do NOT send plan here, so it stays safe
        }
      };

      const response = await fetch('/api/vendor/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) throw new Error("Update failed");

      const updatedUser = await response.json();
      
      // Update Global Context
      login(updatedUser);
      setIsEditing(false); // Exit edit mode
      // alert("Profile updated!"); // Optional

    } catch (error) {
      console.error("Save failed:", error);
      alert("Failed to save changes.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleShare = () => {
      if (navigator.share) {
          navigator.share({
              title: formData.businessName,
              text: `Check out ${formData.businessName} on PocketBiz!`,
              url: window.location.href,
          }).catch((error) => console.log('Error sharing', error));
      } else {
          alert("Link copied to clipboard!");
      }
  };

  // --- DYNAMIC PLAN STYLES ---
  const getPlanTheme = (planName) => {
    switch(planName) {
      case 'PLATINUM':
        return {
          cardBg: "bg-gradient-to-br from-gray-100 via-gray-300 to-gray-200", 
          textColor: "text-gray-900",
          subTextColor: "text-gray-600",
          iconBg: "bg-black/5 border border-black/10",
          iconColor: "text-gray-800",
          badgeBg: "bg-black text-white",
          btnBg: "bg-gray-900 text-white hover:bg-black",
          shine: true
        };
      case 'GOLD':
        return {
          cardBg: "bg-gradient-to-br from-amber-100 via-amber-300 to-amber-200", 
          textColor: "text-amber-950",
          subTextColor: "text-amber-900/80",
          iconBg: "bg-white/40 border border-white/20",
          iconColor: "text-amber-900",
          badgeBg: "bg-amber-950 text-amber-100",
          btnBg: "bg-amber-950 text-white hover:bg-amber-900",
          shine: true
        };
      default: // BASIC
        return {
          cardBg: "bg-white border border-gray-100", 
          textColor: "text-gray-900",
          subTextColor: "text-gray-500",
          iconBg: "bg-blue-50",
          iconColor: "text-blue-600",
          badgeBg: "bg-blue-100 text-blue-700",
          btnBg: "bg-white border-2 border-gray-100 text-gray-700 hover:bg-gray-50",
          shine: false
        };
    }
  };

  const theme = getPlanTheme(plan);

  return (
    <div className="w-full bg-[#F8FAFC] h-full min-h-screen p-6 animate-enter">
      <div className="w-full">
        
        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
           <div>
             <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Business Profile</h1>
             <p className="text-gray-500 text-sm">Manage your account details</p>
           </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
           
           {/* LEFT COLUMN: Identity & Plan */}
           <div className="space-y-6 lg:col-span-1">
              
              {/* 1. IDENTITY CARD (Editable) */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden relative transition-all">
                  <div className="h-24 w-full bg-gradient-to-r from-gray-900 to-gray-800 relative">
                     <div className="absolute inset-0 bg-white/5 opacity-30 pattern-grid-lg"></div>
                  </div>

                  <div className="px-6 pb-6 relative text-center">
                     <div className="relative -mt-10 mb-3 inline-block">
                        <div 
                          className="w-20 h-20 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-lg border-4 border-white transition-colors duration-300"
                          style={{ backgroundColor: formData.themeColor }}
                        >
                           {formData.businessName.charAt(0).toUpperCase()}
                        </div>
                        
                        {!isEditing && (
                            <div className="absolute bottom-0 right-0 bg-white p-1 rounded-full shadow-sm">
                               <ShieldCheck className="text-blue-500 fill-blue-500/10" size={16} />
                            </div>
                        )}
                     </div>

                     {/* VIEW MODE */}
                     {!isEditing ? (
                         <>
                            <h2 className="text-xl font-bold text-gray-900">{formData.businessName}</h2>
                            <div className="flex items-center justify-center gap-3 mt-1 text-gray-500 text-xs font-medium uppercase tracking-wide">
                                <span>{mobile}</span>
                                <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                                <span>{formData.category}</span>
                            </div>

                            <button 
                              onClick={() => setIsEditing(true)} 
                              className="mt-4 w-full py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs font-bold text-gray-700 hover:bg-gray-100 transition flex items-center justify-center gap-2"
                            >
                              <Edit2 size={14}/> Edit Profile
                            </button>
                         </>
                     ) : (
                         /* EDIT MODE */
                         <div className="space-y-4 mt-2 animate-enter">
                            <div className="text-left">
                                <label className="text-[10px] font-bold text-gray-400 uppercase">Business Name</label>
                                <input 
                                   value={formData.businessName}
                                   onChange={(e) => setFormData({...formData, businessName: e.target.value})}
                                   className="w-full mt-1 p-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-bold text-gray-900 focus:ring-2 focus:ring-indigo-500 outline-none"
                                />
                            </div>

                            <div className="text-left">
                                <label className="text-[10px] font-bold text-gray-400 uppercase">Brand Color</label>
                                <div className="flex gap-2 mt-1 justify-center">
                                    {['#4F46E5', '#EF4444', '#10B981', '#F59E0B', '#000000'].map(c => (
                                        <button 
                                          key={c}
                                          onClick={() => setFormData({...formData, themeColor: c})}
                                          className={`w-6 h-6 rounded-full border-2 ${formData.themeColor === c ? 'border-gray-900 scale-110' : 'border-transparent'}`}
                                          style={{ backgroundColor: c }}
                                        />
                                    ))}
                                </div>
                            </div>

                            <div className="flex gap-2 pt-2">
                                <button 
                                  onClick={() => setIsEditing(false)}
                                  className="flex-1 py-2 rounded-lg border border-gray-200 text-gray-600 text-xs font-bold"
                                >
                                    Cancel
                                </button>
                                <button 
                                  onClick={handleSave}
                                  disabled={isLoading}
                                  className="flex-1 py-2 rounded-lg bg-black text-white text-xs font-bold flex items-center justify-center gap-1"
                                >
                                    {isLoading ? <Loader2 className="animate-spin" size={14}/> : 'Save'}
                                </button>
                            </div>
                         </div>
                     )}
                  </div>
              </div>

              {/* 2. DYNAMIC SUBSCRIPTION CARD */}
              <div className={`group relative rounded-2xl p-6 shadow-sm overflow-hidden transition-all hover:shadow-lg ${theme.cardBg}`}>
                 {theme.shine && (
                    <div className="absolute -inset-full top-0 block h-full w-1/2 -skew-x-12 bg-gradient-to-r from-transparent to-white opacity-40 group-hover:animate-shine" />
                 )}

                 <div className="relative z-10">
                    <div className="flex justify-between items-start mb-6">
                       <div className={`p-2.5 rounded-xl backdrop-blur-sm ${theme.iconBg}`}>
                          <Crown size={24} className={theme.iconColor} />
                       </div>
                       <span className={`text-[10px] font-bold px-2 py-1 rounded-md tracking-widest uppercase ${theme.badgeBg}`}>
                          {plan}
                       </span>
                    </div>

                    <div>
                       <p className={`font-bold text-[10px] uppercase tracking-wider mb-1 ${theme.subTextColor}`}>Current Plan</p>
                       <h3 className={`text-2xl font-extrabold tracking-tight flex items-center gap-2 ${theme.textColor}`}>
                          {plan} EDITION {theme.shine && <Sparkles size={16}/>}
                       </h3>
                       <p className={`text-xs mt-1 font-medium ${theme.subTextColor}`}>Valid until Jan 01, 2026</p>
                    </div>

                    <button 
                      onClick={() => navigate('/subscription')}
                      className={`mt-5 w-full py-3 rounded-xl text-xs font-bold shadow-sm transition flex justify-center items-center gap-2 ${theme.btnBg}`}
                    >
                       Manage Subscription <ChevronRight size={14}/>
                    </button>
                 </div>
              </div>

           </div>

           {/* RIGHT COLUMN: Actions & Settings */}
           <div className="space-y-6 lg:col-span-2">
              
              {/* 3. FEATURE GRID */}
              <div className="grid grid-cols-2 gap-4">
                 <button 
                   onClick={() => navigate('/orders')}
                   className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:border-indigo-100 hover:shadow-md transition-all text-left flex items-center gap-4 group"
                 >
                    <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 shrink-0 group-hover:scale-110 transition-transform">
                       <FileText size={22} />
                    </div>
                    <div>
                       <h4 className="font-bold text-gray-900 text-sm">Invoice Gen</h4>
                       <p className="text-gray-400 text-xs mt-0.5">Create Bills</p>
                    </div>
                 </button>

                 <button 
                   onClick={() => alert("Coming Soon!")}
                   className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:border-red-100 hover:shadow-md transition-all text-left flex items-center gap-4 group"
                 >
                    <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center text-red-600 shrink-0 group-hover:scale-110 transition-transform">
                       <Video size={22} />
                    </div>
                    <div>
                       <h4 className="font-bold text-gray-900 text-sm">CCTV Cam</h4>
                       <p className="text-gray-400 text-xs mt-0.5">Live Monitor</p>
                    </div>
                 </button>
              </div>

              {/* 4. SETTINGS LIST */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                 <div className="p-4 border-b border-gray-50 flex justify-between items-center">
                    <h3 className="font-bold text-gray-800 text-sm">Account Settings</h3>
                    <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-1 rounded-md">v2.4.0</span>
                 </div>
                 <div className="divide-y divide-gray-50">
                    <MenuItem 
                      icon={<IdCard size={18} className="text-indigo-500"/>} 
                      title="Digital Business Card" 
                      desc="Generate & download official ID" 
                      onClick={() => navigate('/tools/card-generator')} 
                    />
                    <MenuItem 
                      icon={<Users size={18} className="text-purple-500"/>} 
                      title="My Staff" 
                      desc="Manage employees & roles" 
                      onClick={() => navigate('/staff')} 
                    />
                    
                    {/* Reusing existing edit mode for Branding */}
                    <MenuItem 
                      icon={<Palette size={18} className="text-pink-500"/>} 
                      title="Branding" 
                      desc="Edit logo & themes" 
                      onClick={() => setIsEditing(true)} 
                    />
                    
                    <MenuItem 
                      icon={<Share2 size={18} className="text-blue-500"/>} 
                      title="Share Profile Link" 
                      desc="Copy profile URL" 
                      onClick={handleShare} 
                    />
                    
                    <button 
                       onClick={logout}
                       className="w-full flex items-center justify-between p-4 px-6 hover:bg-red-50 transition-colors group text-left"
                    >
                       <div className="flex items-center gap-4">
                          <div className="w-9 h-9 rounded-lg bg-red-50 flex items-center justify-center group-hover:bg-white transition-colors">
                             <LogOut size={18} className="text-red-500" />
                          </div>
                          <div>
                             <h4 className="font-bold text-red-600 text-sm">Sign Out</h4>
                          </div>
                       </div>
                    </button>
                 </div>
              </div>
           </div>

        </div>
      </div>
    </div>
  );
};

// Compact Menu Item Helper
const MenuItem = ({ icon, title, desc, onClick }) => (
  <button onClick={onClick} className="w-full flex items-center justify-between p-4 px-6 hover:bg-gray-50 transition-colors group text-left">
     <div className="flex items-center gap-4">
        <div className="w-9 h-9 rounded-lg bg-gray-50 flex items-center justify-center group-hover:bg-white border border-transparent group-hover:border-gray-200 transition-all">
           {icon}
        </div>
        <div>
           <h4 className="font-bold text-gray-900 text-sm">{title}</h4>
           <p className="text-xs text-gray-400 font-medium">{desc}</p>
        </div>
     </div>
     <ChevronRight size={16} className="text-gray-300 group-hover:text-gray-600 transition-colors" />
  </button>
);

export default Profile;