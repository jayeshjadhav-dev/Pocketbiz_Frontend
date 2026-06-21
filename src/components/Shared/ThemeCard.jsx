import { useBrand } from '../../context/BrandContext';

const ThemeCard = ({ children, className = "", onClick }) => {
  const { config } = useBrand();
  const plan = config?.plan?.name || 'BASIC';

  // 1. DEFINE STYLES PER TIER
  const styles = {
    // BASIC: Clean, White, Subtle Border (The "Standard" Look)
    BASIC: "bg-white border border-gray-200 shadow-sm",
    
    // GOLD: Deeper Shadows, Gold Accents, Warmth
    GOLD: "bg-gradient-to-br from-white to-amber-50/50 border border-amber-200 shadow-lg shadow-amber-100/50",
    
    // PLATINUM: LIQUID GLASS (Frosted, Translucent, Glowing Border)
    PLATINUM: "bg-white/60 backdrop-blur-xl border border-white/50 shadow-[0_8px_32px_0_rgba(31,38,135,0.15)] ring-1 ring-white/50"
  };

  return (
    <div 
      onClick={onClick}
      className={`rounded-2xl p-5 transition-all duration-300 ${styles[plan]} ${className}`}
    >
      {children}
    </div>
  );
};

export default ThemeCard;