import { createContext, useContext, useState, useEffect } from "react";

const BrandContext = createContext();

export const BrandProvider = ({ children }) => {
  // 1. Initialize User from LocalStorage
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("pocketbiz_user");
    return saved ? JSON.parse(saved) : null;
  });

  // 2. Initialize Config (Derived from User or Defaults)
  const [config, setConfig] = useState(() => {
     if (user && user.config) return user.config;
     return createSafeDefaults();
  });

  const [isLoading, setIsLoading] = useState(false);

  // 3. REFRESH FUNCTION (Syncs latest data from Backend)
  const refreshUser = () => {
    if (!user?.mobileNumber) return;

    // Don't show global loading for background refreshes unless critical
    // setIsLoading(true); 

    fetch(`/api/vendor/${user.mobileNumber}`)
      .then((res) => {
        if (!res.ok) throw new Error("Sync Failed");
        return res.json();
      })
      .then((updatedUser) => {
        console.log("Synced User Data:", updatedUser);
        
        // Update State
        setUser(updatedUser);
        
        // Extract & Set Config (Fallback to defaults if missing)
        setConfig(updatedUser.config || createSafeDefaults());
        
        // Update LocalStorage
        localStorage.setItem("pocketbiz_user", JSON.stringify(updatedUser));
      })
      .catch((err) => {
        console.error("Background Sync Error:", err);
      })
      .finally(() => setIsLoading(false));
  };

  // 4. Auto-Refresh on Mount (if user is logged in)
  useEffect(() => {
    if (user) {
        refreshUser();
    }
  }, []); // Run once on app load

  // 5. LOGIN ACTION
  const loginAction = (userData) => {
    console.log("Login Success:", userData);
    
    // Set User
    setUser(userData);
    
    // Set Config immediately so UI doesn't flicker
    setConfig(userData.config || createSafeDefaults());
    
    // Persist
    localStorage.setItem("pocketbiz_user", JSON.stringify(userData));
  };

  // 6. LOGOUT ACTION
  const logout = () => {
    setUser(null);
    setConfig(createSafeDefaults()); // Reset to defaults, not null
    localStorage.removeItem("pocketbiz_user");
  };

  return (
    <BrandContext.Provider value={{ 
        config, 
        user, 
        isLoading, 
        login: loginAction, 
        logout, 
        refreshUser 
    }}>
      {children}
    </BrandContext.Provider>
  );
};

// Helper for defaults (Prevents app crash if config is missing)
const createSafeDefaults = () => ({
  businessName: "My Business",
  themeColor: "#2563EB", // Default Blue
  plan: { 
      name: "BASIC", 
      price: 0,
      maxProducts: 20, 
      showAnalytics: false 
  },
  category: "RETAIL"
});

export const useBrand = () => useContext(BrandContext);