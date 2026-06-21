import { useBrand } from '../../context/BrandContext';
import { LayoutDashboard, ShoppingBag, Wallet, User, Menu } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const MobileLayout = ({ children }) => {
  const { config } = useBrand(); 
  const navigate = useNavigate();
  const location = useLocation();

  // Safety check: Default to BASIC if loading
  const plan = config?.plan?.name || 'BASIC';
  
  // 1. DYNAMIC BACKGROUNDS (The UI Polish)
  const backgrounds = {
    BASIC: "bg-gray-50",
    GOLD: "bg-gradient-to-br from-orange-50 to-amber-100",
    PLATINUM: "bg-slate-900" // Dark mode for Platinum
  };

  const currentBg = backgrounds[plan] || backgrounds.BASIC;
  const isPlatinum = plan === 'PLATINUM';
  const textColor = isPlatinum ? 'text-white' : 'text-gray-900';

  if (!config) return <div className="p-10 text-center">Loading App...</div>;

  return (
    <div className={`flex flex-col w-full h-full max-w-md shadow-2xl overflow-hidden relative sm:h-[95vh] sm:rounded-2xl sm:border sm:border-gray-300 transition-colors duration-500 ${currentBg}`}>
      
      {/* PLATINUM EFFECTS (Background Blobs) */}
      {isPlatinum && (
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-64 h-64 bg-blue-600/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-[10%] right-[-10%] w-64 h-64 bg-purple-600/20 rounded-full blur-3xl animate-pulse delay-700"></div>
        </div>
      )}

      {/* HEADER */}
      <header className={`p-4 flex justify-between items-center z-20 relative ${isPlatinum ? 'bg-white/5 backdrop-blur-md border-b border-white/10' : 'bg-white shadow-sm'}`}>
        <div className="flex items-center gap-2">
           <div 
             className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold shadow-sm"
             style={{ backgroundColor: isPlatinum ? '#6366f1' : config.themeColor }}
           >
             {config.businessName.charAt(0)}
           </div>
           <h1 className={`font-bold text-lg ${textColor}`}>
             {config.businessName}
           </h1>
        </div>
      </header>
      
      {/* MAIN CONTENT AREA */}
      <main className={`flex-1 overflow-y-auto p-4 scrollbar-hide relative z-10 ${textColor}`}>
        {children}
      </main>

      {/* === NAVIGATION BAR (Forced Z-Index 50 to stay on top) === */}
      <nav className={`flex justify-around items-center p-3 z-50 relative ${isPlatinum ? 'bg-black/40 backdrop-blur-xl border-t border-white/10 text-gray-400' : 'bg-white border-t border-gray-100 text-gray-500'}`}>
        <NavItem icon={LayoutDashboard} label="Home" to="/" isActive={location.pathname === '/'} color={config.themeColor} isPlatinum={isPlatinum} />
        <NavItem icon={Menu} label="Menu" to="/services" isActive={location.pathname === '/services'} color={config.themeColor} isPlatinum={isPlatinum} />
        <NavItem icon={ShoppingBag} label="Orders" to="/orders" isActive={location.pathname === '/orders'} color={config.themeColor} isPlatinum={isPlatinum} />
        <NavItem icon={Wallet} label="Khata" to="/ledger" isActive={location.pathname === '/ledger'} color={config.themeColor} isPlatinum={isPlatinum} />
        <NavItem icon={User} label="Profile" to="/profile" isActive={location.pathname === '/profile'} color={config.themeColor} isPlatinum={isPlatinum} />
      </nav>
    </div>
  );
};

// Helper Component for Nav Buttons
const NavItem = ({ icon: Icon, label, to, isActive, color, isPlatinum }) => {
  const navigate = useNavigate();
  
  // Platinum Active Color = White Glow. Normal Active Color = Brand Color.
  const activeColor = isPlatinum ? 'white' : color;
  const activeClass = isActive ? 'scale-110 font-bold' : 'hover:opacity-70';
  
  return (
    <button 
      onClick={() => navigate(to)}
      className={`flex flex-col items-center transition-all duration-200 ${activeClass}`}
      style={{ color: isActive ? activeColor : undefined }}
    >
      <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
      <span className="text-[10px] mt-1">{label}</span>
    </button>
  );
};

export default MobileLayout;