import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { BrandProvider, useBrand } from './context/BrandContext';

// === 1. IMPORT LAYOUT ===
import Layout from './components/Layout/Layout'; 

// === 2. IMPORT PAGES ===
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Services from './pages/Services';
import Ledger from './pages/Ledger';            
import Profile from './pages/Profile';
import Subscription from './pages/Subscription';
import CCTV from './pages/CCTV';
import BillGenerator from './pages/BillGenerator';
import Settings from './pages/Settings';
import BusinessCardGenerator from './pages/BusinessCardGenerator';
import Community from './pages/Community';
import Meetings from './pages/Meetings';
import Staff from './pages/Staff';
import Orders from './pages/Orders';


// === 3. PROTECTED ROUTE GUARD ===
const PrivateRoute = ({ children }) => {
  const { user, isLoading } = useBrand();

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // If not logged in, redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If logged in, show the app
  return children;
};

function App() {
  return (
    <BrandProvider>
      <BrowserRouter>
        <Routes>
          {/* === PUBLIC ROUTES === */}
          {/* Landing page is now root so anyone can view it first */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* === PROTECTED APP ROUTES === */}
          <Route path="/*" element={
            <PrivateRoute>
              <Layout> 
                <Routes>
                  {/* Dashboard Route */}
                  <Route path="/dashboard" element={<Dashboard />} />
                  
                  {/* Core Features */}
                  <Route path="/services" element={<Services />} />
                  <Route path="/orders" element={<Orders />} />
                  <Route path="/ledger" element={<Ledger />} />
                  
                  {/* Business Tools */}
                  <Route path="/billing" element={<BillGenerator />} />
                  <Route path="/cctv" element={<CCTV />} />
                  <Route path="/tools/card-generator" element={<BusinessCardGenerator />} />
                  
                  {/* Community & Networking */}
                  <Route path="/community" element={<Community />} />

                  {/* Account & Settings */}
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/subscription" element={<Subscription />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="/meetings" element={<Meetings />} />
                  <Route path="/staff" element={<Staff />} />

                  {/* Fallback for unknown routes inside the app */}
                  <Route path="*" element={<Navigate to="/dashboard" />} />
                </Routes>
              </Layout> 
            </PrivateRoute>
          } />
        </Routes>
      </BrowserRouter>
    </BrandProvider>
  );
}

export default App;