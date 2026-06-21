import { useState } from 'react';
import { useBrand } from '../../context/BrandContext';
import { 
  LayoutDashboard, ShoppingBag, Wallet, User, Menu as MenuIcon, LogOut,
  Users, ChevronLeft, Menu
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

// === HELPER COMPONENT 1: SIDEBAR ITEM (Desktop) ===
const SidebarItem = ({ icon: Icon, label, to, isActive, color, isPlatinum, isCollapsed }) => {
  const navigate = useNavigate();
  
  // Dynamic classes based on state
  const activeClass = isActive 
    ? (isPlatinum ? 'bg-white/10 text-white border-r-4 border-indigo-400' : 'bg-gray-100 text-gray-900 border-r-4 border-gray-900')
    : (isPlatinum ? 'text-gray-400 hover:text-white hover:bg-white/5' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50');

  return (
    <button 
      onClick={() => navigate(to)}
      title={isCollapsed ? label : ""} // Tooltip when collapsed
      className={`flex items-center gap-3 px-4 py-3 w-full transition-all duration-200 ${activeClass} ${isCollapsed ? 'justify-center rounded-xl' : 'rounded-r-xl'}`}
    >
      <Icon size={20} style={{ color: isActive && !isPlatinum ? color : undefined }} />
      {!isCollapsed && <span className="text-sm font-medium whitespace-nowrap">{label}</span>}
    </button>
  );
};

// === HELPER COMPONENT 2: MOBILE NAV ITEM (Phone) ===
const MobileNavItem = ({ icon: Icon, label, to, isActive, color, isPlatinum }) => {
  const navigate = useNavigate();
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

// === MAIN LAYOUT COMPONENT ===
const Layout = ({ children }) => {
  const { config, user, logout } = useBrand(); 
  const navigate = useNavigate();
  const location = useLocation();

  // State for Collapsible Sidebar (Default open on large screens)
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  if (!config) return <div className="h-screen flex items-center justify-center text-gray-400">Loading Layout...</div>;

  const plan = config.plan?.name || 'BASIC';
  const isPlatinum = plan === 'PLATINUM';

  const backgrounds = {
    BASIC: "bg-gray-50",
    GOLD: "bg-gradient-to-br from-orange-50 to-amber-100",
    PLATINUM: "bg-slate-900" 
  };
  const currentBg = backgrounds[plan] || backgrounds.BASIC;
  const textColor = isPlatinum ? 'text-white' : 'text-gray-900';

  return (
    <div className={`flex h-screen w-full overflow-hidden transition-colors duration-500 ${currentBg}`}>
      
      {/* Background Effects for Platinum */}
      {isPlatinum && (
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[-10%] left-[-5%] w-96 h-96 bg-blue-600/20 rounded-full blur-[100px] animate-pulse"></div>
          <div className="absolute bottom-[10%] right-[-5%] w-96 h-96 bg-purple-600/20 rounded-full blur-[100px] animate-pulse delay-700"></div>
        </div>
      )}

      {/* === DESKTOP SIDEBAR === */}
      <aside 
        className={`hidden md:flex flex-col z-20 border-r transition-all duration-300 ease-in-out
          ${isPlatinum ? 'bg-black/20 backdrop-blur-xl border-white/10' : 'bg-white/80 backdrop-blur-md border-gray-200 shadow-xl'}
          ${isSidebarOpen ? 'w-64 p-6' : 'w-20 p-3 items-center'}
        `}
      >
        {/* Toggle Button & Brand Header */}
        <div className={`flex items-center mb-10 ${isSidebarOpen ? 'justify-between' : 'justify-center flex-col gap-4'}`}>
           
           {/* Logo / Avatar */}
           <div 
             className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold shadow-lg text-lg shrink-0"
             style={{ backgroundColor: isPlatinum ? '#6366f1' : config.themeColor }}
           >
             {config.businessName?.charAt(0) || "B"}
           </div>

           {/* Text (Hidden when collapsed) */}
           {isSidebarOpen && (
             <div className="overflow-hidden">
               <h1 className={`font-bold text-lg leading-tight truncate ${textColor}`}>{config.businessName}</h1>
               <p className={`text-[10px] opacity-60 ${textColor}`}>{plan} EDITION</p>
             </div>
           )}

           {/* Collapse Button */}
           <button 
             onClick={() => setIsSidebarOpen(!isSidebarOpen)}
             className={`p-1.5 rounded-lg hover:bg-black/5 transition ${isPlatinum ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-black'}`}
           >
             {isSidebarOpen ? <ChevronLeft size={20}/> : <Menu size={20}/>}
           </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 space-y-2 w-full">
           <SidebarItem icon={LayoutDashboard} label="Dashboard" to="/dashboard" isActive={location.pathname === '/dashboard'} color={config.themeColor} isPlatinum={isPlatinum} isCollapsed={!isSidebarOpen} />
           <SidebarItem icon={MenuIcon} label="My Menu" to="/services" isActive={location.pathname === '/services'} color={config.themeColor} isPlatinum={isPlatinum} isCollapsed={!isSidebarOpen} />
           <SidebarItem icon={ShoppingBag} label="Orders" to="/orders" isActive={location.pathname === '/orders'} color={config.themeColor} isPlatinum={isPlatinum} isCollapsed={!isSidebarOpen} />
           <SidebarItem icon={Wallet} label="Khata Book" to="/ledger" isActive={location.pathname === '/ledger'} color={config.themeColor} isPlatinum={isPlatinum} isCollapsed={!isSidebarOpen} />
           <SidebarItem icon={Users} label="Community" to="/community" isActive={location.pathname === '/community'} color={config.themeColor} isPlatinum={isPlatinum} isCollapsed={!isSidebarOpen} />
           <SidebarItem icon={User} label="Business Profile" to="/profile" isActive={location.pathname === '/profile'} color={config.themeColor} isPlatinum={isPlatinum} isCollapsed={!isSidebarOpen} />
           
           {/* Staff Link (New) */}
           <SidebarItem icon={Users} label="My Staff" to="/staff" isActive={location.pathname === '/staff'} color={config.themeColor} isPlatinum={isPlatinum} isCollapsed={!isSidebarOpen} />
        </nav>

        {/* Logout Button */}
        <button 
          onClick={() => { logout(); navigate('/login'); }} 
          className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all hover:bg-red-50 group mt-auto w-full ${isPlatinum ? 'hover:bg-red-900/20' : ''} ${!isSidebarOpen && 'justify-center'}`}
          title="Logout"
        >
           <LogOut size={20} className="text-red-400 group-hover:text-red-500" />
           {isSidebarOpen && <span className="text-sm font-medium text-red-400 group-hover:text-red-500">Logout</span>}
        </button>
      </aside>

      {/* === MAIN CONTENT AREA === */}
      <div className="flex-1 flex flex-col h-full relative z-10 overflow-hidden min-w-0">
        
        {/* Mobile Header */}
        <header className={`md:hidden p-4 flex justify-between items-center z-20 ${isPlatinum ? 'bg-white/5 backdrop-blur-md border-b border-white/10' : 'bg-white shadow-sm'}`}>
          <div className="flex items-center gap-2">
             <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold" style={{ backgroundColor: config.themeColor }}>
               {config.businessName?.charAt(0) || "B"}
             </div>
             <h1 className={`font-bold text-lg ${textColor}`}>{config.businessName}</h1>
          </div>
        </header>

        {/* Scrollable Page Content */}
        <main className={`flex-1 overflow-y-auto p-4 md:p-8 scrollbar-hide ${textColor}`}>
           {/* Added 'w-full' to ensure child components stretch */}
           <div className="max-w-[1920px] mx-auto w-full h-full">
              {children}
           </div>
        </main>

        {/* Mobile Bottom Bar */}
        <nav className={`md:hidden flex justify-around items-center p-3 z-50 ${isPlatinum ? 'bg-black/40 backdrop-blur-xl border-t border-white/10 text-gray-400' : 'bg-white border-t border-gray-100 text-gray-500'}`}>
           <MobileNavItem icon={LayoutDashboard} label="Home" to="/dashboard" isActive={location.pathname === '/dashboard'} color={config.themeColor} isPlatinum={isPlatinum} />
           <MobileNavItem icon={ShoppingBag} label="Orders" to="/orders" isActive={location.pathname === '/orders'} color={config.themeColor} isPlatinum={isPlatinum} />
           <MobileNavItem icon={Users} label="Community" to="/community" isActive={location.pathname === '/community'} color={config.themeColor} isPlatinum={isPlatinum} />
           <MobileNavItem icon={Wallet} label="Khata" to="/ledger" isActive={location.pathname === '/ledger'} color={config.themeColor} isPlatinum={isPlatinum} />
           <MobileNavItem icon={User} label="Profile" to="/profile" isActive={location.pathname === '/profile'} color={config.themeColor} isPlatinum={isPlatinum} />
        </nav>

      </div>
    </div>
  );
};

export default Layout;