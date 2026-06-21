import { useState, useRef, useEffect } from 'react';
import html2canvas from 'html2canvas';
import { useNavigate } from 'react-router-dom';
import { 
  Download, ArrowLeft, Palette, LayoutTemplate, 
  Phone, MapPin, Globe, Mail, CheckCircle2, Building2, Quote, Type
} from 'lucide-react';
import { useBrand } from '../context/BrandContext';

const BusinessCardGenerator = () => {
  const navigate = useNavigate();
  const { config, user } = useBrand();
  
  // Ref for the Invisible Export Card
  const exportCardRef = useRef(null);
  const [isDownloading, setIsDownloading] = useState(false);

  // --- 1. EDITABLE DATA STATE ---
  // Initialize with Context Data, but allow full editing
  const [cardData, setCardData] = useState({
    businessName: config?.businessName || '',
    category: config?.category || 'Retail Shop',
    mobile: user?.mobileNumber || '',
    email: '', // Initialize empty or derive
    website: '',
    address: 'Pune, Maharashtra',
    tagline: 'Excellence in every transaction.'
  });

  // Load defaults once on mount if available
  useEffect(() => {
    if (config?.businessName && !cardData.email) {
       const cleanName = config.businessName.toLowerCase().replace(/\s/g, '');
       setCardData(prev => ({
          ...prev,
          email: `contact@${cleanName}.com`,
          website: `www.${cleanName}.com`
       }));
    }
  }, [config]);

  // --- 2. VISUAL STATE ---
  const [customConfig, setCustomConfig] = useState({
    themeColor: config?.themeColor || '#D97706',
    showStamp: true,
    showAddress: true,
    designMode: 'LIGHT' 
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCardData(prev => ({ ...prev, [name]: value }));
  };

  const handleDownload = async () => {
    if (!exportCardRef.current) return;
    setIsDownloading(true);
    try {
      const canvas = await html2canvas(exportCardRef.current, { 
        scale: 2, 
        backgroundColor: null, 
        useCORS: true,
        logging: false,
      });

      const link = document.createElement('a');
      link.download = `${cardData.businessName.replace(/\s+/g, '_')}_Official_Card.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (err) {
      console.error(err);
      alert("Error generating card");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#F8FAFC] p-4 md:p-8 animate-enter flex flex-col">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
         <div className="flex items-center gap-3">
            <button onClick={() => navigate(-1)} className="p-2 bg-white border border-gray-200 hover:bg-gray-50 rounded-xl transition shadow-sm">
               <ArrowLeft size={20} className="text-gray-600"/>
            </button>
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-gray-900 tracking-tight">ID Generator</h1>
              <p className="text-gray-500 text-xs md:text-sm">Customize & download your business identity</p>
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
         
         {/* VISIBLE PREVIEW PANEL */}
         <div className="order-1 lg:order-2 lg:col-span-8 bg-[#E2E8F0] rounded-3xl md:rounded-[2.5rem] flex items-center justify-center p-4 md:p-8 border border-gray-300 relative overflow-hidden shadow-inner min-h-[300px]">
             
             {/* Scaled Preview for User */}
             <div className="relative w-full max-w-[500px] aspect-[1.75/1] rounded-xl overflow-hidden shadow-2xl bg-white">
                <OfficialCardDesign 
                   isPreview={true} 
                   config={customConfig}
                   data={cardData}
                />
             </div>
         </div>

         {/* CONTROLS PANEL */}
         <div className="order-2 lg:order-1 lg:col-span-4 space-y-6 pb-12">
            
            {/* 1. INPUT FIELDS (Content Customization) */}
            <div className="bg-white p-5 md:p-6 rounded-3xl border border-gray-100 shadow-sm">
               <h3 className="font-bold text-gray-800 flex items-center gap-2 mb-4">
                 <Type size={20} className="text-blue-600"/> Edit Content
               </h3>
               
               <div className="space-y-3">
                  <InputGroup label="Business Name" name="businessName" value={cardData.businessName} onChange={handleInputChange} icon={<Building2 size={14}/>} />
                  
                  <div className="grid grid-cols-2 gap-3">
                     <InputGroup label="Category" name="category" value={cardData.category} onChange={handleInputChange} />
                     <InputGroup label="Phone" name="mobile" value={cardData.mobile} onChange={handleInputChange} icon={<Phone size={14}/>} />
                  </div>

                  <InputGroup label="Email" name="email" value={cardData.email} onChange={handleInputChange} icon={<Mail size={14}/>} />
                  <InputGroup label="Website" name="website" value={cardData.website} onChange={handleInputChange} icon={<Globe size={14}/>} />
                  
                  {customConfig.showAddress && (
                     <InputGroup label="Location" name="address" value={cardData.address} onChange={handleInputChange} icon={<MapPin size={14}/>} />
                  )}

                  <InputGroup label="Slogan / Tagline" name="tagline" value={cardData.tagline} onChange={handleInputChange} icon={<Quote size={14}/>} />
               </div>
            </div>

            {/* 2. VISUAL STYLES */}
            <div className="bg-white p-5 md:p-6 rounded-3xl border border-gray-100 shadow-sm">
               <h3 className="font-bold text-gray-800 flex items-center gap-2 mb-4">
                 <Palette size={20} className="text-indigo-600"/> Visual Style
               </h3>
               
               <div className="space-y-4">
                  {/* Color Picker */}
                  <div>
                    <label className="text-xs font-bold text-gray-400 uppercase">Accent Color</label>
                    <div className="flex gap-3 mt-2 flex-wrap">
                       {['#D97706', '#2563EB', '#DC2626', '#059669', '#7C3AED', '#000000'].map(c => (
                          <button 
                            key={c}
                            onClick={() => setCustomConfig({...customConfig, themeColor: c})}
                            className={`w-8 h-8 rounded-full border-2 transition shadow-sm flex items-center justify-center ${customConfig.themeColor === c ? 'border-gray-900 scale-110' : 'border-transparent'}`}
                            style={{ backgroundColor: c }}
                          >
                             {customConfig.themeColor === c && <CheckCircle2 size={12} className="text-white"/>}
                          </button>
                       ))}
                       <input 
                          type="color" 
                          value={customConfig.themeColor}
                          onChange={(e) => setCustomConfig({...customConfig, themeColor: e.target.value})}
                          className="w-8 h-8 rounded-full overflow-hidden border-2 border-gray-200 cursor-pointer p-0"
                       />
                    </div>
                  </div>

                  {/* Dark/Light Mode */}
                  <div className="flex gap-2">
                     <button 
                       onClick={() => setCustomConfig({...customConfig, designMode: 'DARK'})}
                       className={`flex-1 py-2 rounded-lg text-xs font-bold border transition ${customConfig.designMode === 'DARK' ? 'bg-slate-900 text-white border-slate-900' : 'bg-gray-50 text-gray-600 border-gray-200'}`}
                     >
                        Matte Black
                     </button>
                     <button 
                       onClick={() => setCustomConfig({...customConfig, designMode: 'LIGHT'})}
                       className={`flex-1 py-2 rounded-lg text-xs font-bold border transition ${customConfig.designMode === 'LIGHT' ? 'bg-gray-100 text-gray-900 border-gray-300' : 'bg-white text-gray-600 border-gray-200'}`}
                     >
                        Clean White
                     </button>
                  </div>

                  {/* Toggles */}
                  <div className="space-y-2 pt-2 border-t border-gray-100">
                     <Toggle label="Official Stamp" active={customConfig.showStamp} onClick={() => setCustomConfig({...customConfig, showStamp: !customConfig.showStamp})} />
                     <Toggle label="Address Line" active={customConfig.showAddress} onClick={() => setCustomConfig({...customConfig, showAddress: !customConfig.showAddress})} />
                  </div>
               </div>
            </div>

            <button 
              onClick={handleDownload}
              disabled={isDownloading}
              className="w-full bg-gray-900 text-white py-4 rounded-xl font-bold shadow-xl hover:scale-[1.02] transition flex items-center justify-center gap-2"
            >
              {isDownloading ? "Generating..." : <><Download size={20} /> Download HD Card</>}
            </button>
         </div>

      </div>

      {/* --- INVISIBLE EXPORT STUDIO (Uses updated cardData) --- */}
      <div className="absolute top-0 left-[-9999px]">
         <div 
             ref={exportCardRef} 
             style={{ width: '1000px', height: '570px' }} 
             className="relative overflow-hidden"
         >
             <OfficialCardDesign 
                 isPreview={false} // HD Mode
                 config={customConfig}
                 data={cardData} // Passes user edited data
             />
         </div>
      </div>

    </div>
  );
};

// --- SUB-COMPONENTS ---

const InputGroup = ({ label, name, value, onChange, icon }) => (
  <div>
     <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">{label}</label>
     <div className="relative mt-1">
        {icon && <div className="absolute top-2.5 left-3 text-gray-400">{icon}</div>}
        <input 
           type="text" 
           name={name}
           value={value}
           onChange={onChange}
           className={`w-full bg-gray-50 border border-gray-200 text-gray-800 text-xs font-medium rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 block p-2.5 outline-none transition ${icon ? 'pl-9' : ''}`}
        />
     </div>
  </div>
);

const OfficialCardDesign = ({ isPreview, config, data }) => {
    // Styles
    const containerClass = config.designMode === 'DARK' ? 'bg-[#0F172A] text-white' : 'bg-white text-slate-900';
    
    // Responsive vs Fixed Sizing
    const paddingClass = isPreview ? 'p-6' : 'p-[60px]'; 
    const logoSize = isPreview ? 'w-10 h-10' : 'w-[80px] h-[80px]';
    const titleSize = isPreview ? 'text-xl' : 'text-[54px]'; 
    const subTitleSize = isPreview ? 'text-[10px]' : 'text-[18px]';
    const textSize = isPreview ? 'text-[10px]' : 'text-[22px]';
    const iconSize = isPreview ? 14 : 32;
    const gapClass = isPreview ? 'gap-3' : 'gap-6';
    const spaceYClass = isPreview ? 'space-y-1.5' : 'space-y-5';
    const stampSize = isPreview ? 'w-16 h-16' : 'w-[140px] h-[140px]';
    const sloganSize = isPreview ? 'text-xs' : 'text-[28px]';

    return (
        <div className={`w-full h-full relative flex ${containerClass} ${paddingClass}`}>
           
           {/* Texture */}
           <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}></div>

           {/* LEFT SIDE */}
           <div className="w-[60%] flex flex-col justify-between relative z-10 h-full">
              
              {/* Branding */}
              <div>
                  <div className={`flex items-center ${gapClass} mb-6`}>
                     <div className={`${logoSize} rounded-xl flex items-center justify-center shadow-lg relative overflow-hidden shrink-0`}
                          style={{ background: `linear-gradient(135deg, ${config.themeColor} 0%, #000 100%)` }}>
                         <Building2 className="text-white relative z-10" size={isPreview ? 20 : 40}/>
                         <div className="absolute top-0 left-0 w-full h-1/2 bg-white/20"></div>
                     </div>
                     <span className={`font-bold tracking-[0.2em] uppercase opacity-50 ${subTitleSize}`}>Official Partner</span>
                  </div>

                  <h2 className={`font-extrabold tracking-tight leading-tight ${titleSize} mb-2 break-words`}>
                      {data.businessName || 'Your Business'}
                  </h2>
                  <p className={`font-medium opacity-70 uppercase tracking-wider ${subTitleSize}`}>
                      {data.category || 'Category'}
                  </p>
              </div>

              {/* Contact Info */}
              <div className={`font-medium opacity-90 ${spaceYClass}`}>
                 <div className={`flex items-center ${gapClass}`}>
                    <Phone size={iconSize} style={{ color: config.themeColor }} />
                    <span className={textSize}>+91 {data.mobile || '0000000000'}</span>
                 </div>
                 {data.email && (
                    <div className={`flex items-center ${gapClass}`}>
                        <Mail size={iconSize} style={{ color: config.themeColor }} />
                        <span className={textSize}>{data.email}</span>
                    </div>
                 )}
                 {data.website && (
                    <div className={`flex items-center ${gapClass}`}>
                        <Globe size={iconSize} style={{ color: config.themeColor }} />
                        <span className={textSize}>{data.website}</span>
                    </div>
                 )}
                 {config.showAddress && data.address && (
                     <div className={`flex items-center ${gapClass}`}>
                        <MapPin size={iconSize} style={{ color: config.themeColor }} />
                        <span className={textSize}>{data.address}</span>
                     </div>
                 )}
              </div>
           </div>

           {/* RIGHT SIDE */}
           <div className="w-[40%] relative z-10 h-full flex flex-col justify-between items-end pl-8">
              
              <div className="absolute left-0 top-4 bottom-4 w-[1px] bg-gradient-to-b from-transparent via-gray-500/30 to-transparent"></div>

              <div className="pt-4">
                  {config.showStamp ? (
                      <div className="relative group">
                         <div className={`${stampSize} rounded-full border-[3px] border-dashed flex items-center justify-center opacity-60`} style={{ borderColor: config.themeColor }}>
                             <div className="w-[85%] h-[85%] rounded-full border flex items-center justify-center bg-gradient-to-br from-white/10 to-transparent backdrop-blur-sm" style={{ borderColor: config.themeColor }}></div>
                         </div>
                         <div className="absolute inset-0 flex flex-col items-center justify-center">
                             <CheckCircle2 size={isPreview ? 24 : 50} style={{ color: config.themeColor, filter: 'drop-shadow(0px 2px 4px rgba(0,0,0,0.3))' }} fill="currentColor" className="text-white"/>
                             <span className={`font-black uppercase tracking-widest mt-1 opacity-80 ${isPreview ? 'text-[6px]' : 'text-[12px]'}`}>Verified</span>
                         </div>
                      </div>
                  ) : <div className={stampSize}></div>}
              </div>

              <div className="text-right w-full">
                  <p className={`uppercase tracking-widest opacity-60 mb-3 flex items-center justify-end gap-2 ${subTitleSize}`}>
                      <Quote size={isPreview ? 10 : 20} style={{ color: config.themeColor }} className="rotate-180"/> Slogan
                  </p>
                  <p className={`font-bold leading-tight italic break-words ${sloganSize}`} style={{ color: config.themeColor }}>
                    "{data.tagline}"
                  </p>
              </div>
           </div>

           {/* Watermark */}
           <div className="absolute bottom-3 left-0 w-full flex justify-center opacity-30">
               <span className={`font-black uppercase tracking-[0.3em] ${isPreview ? 'text-[8px]' : 'text-[14px]'}`}>Powered By PocketBiz</span>
           </div>

           <div className="absolute -top-[10%] -right-[10%] w-[40%] h-[40%] rounded-full blur-[100px] opacity-20 pointer-events-none" style={{ backgroundColor: config.themeColor }}></div>
        </div>
    );
};

const Toggle = ({ label, active, onClick }) => (
  <div className="flex items-center justify-between p-2 cursor-pointer hover:bg-gray-50 rounded-lg transition" onClick={onClick}>
     <span className="text-xs font-bold text-gray-700">{label}</span>
     <div className={`w-8 h-4 rounded-full p-0.5 transition-colors duration-300 ${active ? 'bg-slate-900' : 'bg-gray-300'}`}>
       <div className={`w-3 h-3 bg-white rounded-full shadow-sm transform transition-transform duration-300 ${active ? 'translate-x-4' : 'translate-x-0'}`}></div>
     </div>
  </div>
);

export default BusinessCardGenerator;