import { useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import { Phone, MapPin, Globe, Download, Share2, Sparkles } from 'lucide-react';
import { useBrand } from '../context/BrandContext';

const BusinessCard = () => {
  const { config, user } = useBrand();
  const cardRef = useRef(null);
  const [isDownloading, setIsDownloading] = useState(false);

  // Safe Defaults
  const businessName = config?.businessName || 'My Business';
  const mobile = user?.mobileNumber || '9876543210';
  const category = config?.category || 'Retail Shop';
  const brandColor = config?.themeColor || '#4F46E5';

  const handleDownload = async () => {
    if (!cardRef.current) return;
    setIsDownloading(true);

    try {
      // 1. Generate Image
      const canvas = await html2canvas(cardRef.current, {
        scale: 3, // High Resolution (3x for crisp text)
        backgroundColor: null, // Transparent corners
        useCORS: true // Allow loading external images
      });

      // 2. Create Download Link
      const link = document.createElement('a');
      link.download = `${businessName.replace(/\s+/g, '_')}_Card.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (err) {
      console.error("Card generation failed", err);
      alert("Could not generate card. Try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-6 p-6 bg-gray-50 rounded-3xl border border-gray-100">
      
      {/* --- THE CARD AREA (This part gets downloaded) --- */}
      <div 
        ref={cardRef}
        className="relative w-[400px] h-[240px] rounded-2xl overflow-hidden shadow-2xl flex flex-col justify-between p-8 text-white"
        style={{ 
          background: `linear-gradient(135deg, ${brandColor} 0%, #000000 100%)` 
        }}
      >
        {/* Background Pattern (Optional) */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-black/20 rounded-full blur-3xl -ml-10 -mb-10 pointer-events-none"></div>

        {/* Top Row: Logo & Category */}
        <div className="relative z-10 flex justify-between items-start">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-lg flex items-center justify-center border border-white/10">
                <span className="font-bold text-xl">{businessName.charAt(0).toUpperCase()}</span>
             </div>
             <div>
                <h2 className="font-bold text-lg leading-tight tracking-wide">{businessName}</h2>
                <span className="text-[10px] uppercase tracking-widest opacity-80">{category}</span>
             </div>
          </div>
          <Sparkles size={16} className="text-yellow-300 opacity-80" />
        </div>

        {/* Middle Row: Contact Details */}
        <div className="relative z-10 space-y-2 mt-4">
           <div className="flex items-center gap-3 text-sm opacity-90">
              <Phone size={14} className="fill-white" /> 
              <span className="font-medium tracking-wide">+91 {mobile}</span>
           </div>
           <div className="flex items-center gap-3 text-sm opacity-70">
              <MapPin size={14} /> 
              <span className="font-medium">Pune, Maharashtra</span>
           </div>
        </div>

        {/* Bottom Row: Footer / Tagline */}
        <div className="relative z-10 flex justify-between items-end border-t border-white/20 pt-4 mt-2">
           <p className="text-[10px] opacity-60">Verified Business</p>
           {/* Free Marketing for YOU */}
           <p className="text-[10px] font-bold opacity-80 bg-white/10 px-2 py-1 rounded-md">
             Powered by PocketBiz
           </p>
        </div>
      </div>

      {/* --- ACTION BUTTONS --- */}
      <div className="flex gap-4 w-full">
         <button 
           onClick={handleDownload}
           disabled={isDownloading}
           className="flex-1 bg-black text-white py-3 rounded-xl font-bold shadow-lg hover:scale-105 transition flex items-center justify-center gap-2"
         >
           {isDownloading ? (
             <span className="animate-pulse">Generating...</span>
           ) : (
             <> <Download size={18} /> Download HD Card </>
           )}
         </button>
         
         <button className="px-4 py-3 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition">
            <Share2 size={20} />
         </button>
      </div>

    </div>
  );
};

export default BusinessCard;