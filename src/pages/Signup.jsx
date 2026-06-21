import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Building2, Phone, Lock, ArrowRight, Loader2, CheckCircle2, Briefcase } from 'lucide-react';

const Signup = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    businessName: '',
    mobileNumber: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/vendor/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Registration failed');

      navigate('/login');
    } catch (err) {
      setError("Server error. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex animate-enter">
      
      {/* LEFT SIDE: BRANDING (Hidden on Mobile) */}
      <div className="hidden lg:flex lg:w-1/2 bg-indigo-600 relative overflow-hidden flex-col justify-center p-12 text-white items-center text-center">
         <div className="absolute inset-0 pattern-grid-lg opacity-10"></div>
         <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-white opacity-10 rounded-full blur-3xl"></div>
         <div className="absolute top-24 right-24 w-64 h-64 bg-purple-500 opacity-20 rounded-full blur-3xl"></div>
         
         <div className="relative z-10 max-w-lg">
            <h1 className="text-4xl font-bold mb-6">Start your journey today.</h1>
            <ul className="space-y-4 text-left inline-block mx-auto text-indigo-100 text-lg mb-8">
                <li className="flex items-center gap-3"><CheckCircle2 className="text-green-300"/> Manage unlimited inventory</li>
                <li className="flex items-center gap-3"><CheckCircle2 className="text-green-300"/> Track staff performance</li>
                <li className="flex items-center gap-3"><CheckCircle2 className="text-green-300"/> Join exclusive vendor community</li>
            </ul>
         </div>
      </div>

      {/* RIGHT SIDE: FORM SECTION */}
      <div className="w-full lg:w-1/2 flex flex-col h-screen bg-gray-50 lg:bg-white relative">
         
         {/* TOP CENTER LOGO */}
         <div className="flex justify-center pt-10 pb-4">
            <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
                    <Briefcase size={20} strokeWidth={3} />
                </div>
                <span className="text-2xl font-black text-gray-900 tracking-tight">PocketBiz</span>
            </div>
         </div>

         {/* CENTER FORM */}
         <div className="flex-1 flex items-center justify-center p-8">
            <div className="w-full max-w-md">
                
                <div className="mb-10 text-center lg:text-left">
                   <h2 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h2>
                   <p className="text-gray-500">Setup your business profile in seconds.</p>
                </div>

                {error && (
                  <div className="mb-6 p-4 bg-red-50 text-red-600 text-sm rounded-xl border border-red-100 flex items-center gap-2">
                    ⚠️ {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                  
                  <div className="space-y-2">
                     <label className="text-xs font-bold text-gray-900 uppercase tracking-wide">Business Name</label>
                     <div className="relative group">
                        <Building2 className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-indigo-600 transition-colors" size={20} />
                        <input 
                          type="text" 
                          className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition font-medium text-gray-900 placeholder-gray-400"
                          placeholder="e.g. Soham Traders"
                          value={formData.businessName}
                          onChange={(e) => setFormData({...formData, businessName: e.target.value})}
                        />
                     </div>
                  </div>

                  <div className="space-y-2">
                     <label className="text-xs font-bold text-gray-900 uppercase tracking-wide">Mobile Number</label>
                     <div className="relative group">
                        <Phone className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-indigo-600 transition-colors" size={20} />
                        <input 
                          type="tel" 
                          className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition font-medium text-gray-900 placeholder-gray-400"
                          placeholder="10-digit number"
                          value={formData.mobileNumber}
                          onChange={(e) => setFormData({...formData, mobileNumber: e.target.value})}
                        />
                     </div>
                  </div>

                  <div className="space-y-2">
                     <label className="text-xs font-bold text-gray-900 uppercase tracking-wide">Password</label>
                     <div className="relative group">
                        <Lock className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-indigo-600 transition-colors" size={20} />
                        <input 
                          type="password" 
                          className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition font-medium text-gray-900 placeholder-gray-400"
                          placeholder="Create a strong password"
                          value={formData.password}
                          onChange={(e) => setFormData({...formData, password: e.target.value})}
                        />
                     </div>
                  </div>

                  <button 
                    type="submit" 
                    disabled={isLoading}
                    className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-indigo-700 hover:scale-[1.01] active:scale-[0.99] transition-all shadow-xl shadow-indigo-200 flex items-center justify-center gap-2 disabled:opacity-70 disabled:hover:scale-100 mt-4"
                  >
                    {isLoading ? <Loader2 className="animate-spin" /> : <>Get Started <ArrowRight size={20}/></>}
                  </button>
                </form>

                <p className="text-center mt-8 text-gray-500">
                  Already have an account? <Link to="/login" className="text-indigo-600 font-bold hover:underline">Log in</Link>
                </p>
            </div>
         </div>

         {/* FOOTER DEVELOPER NAME */}
         <div className="py-4 text-center text-xs font-bold text-gray-400 uppercase tracking-widest border-t border-gray-100 bg-white">
            @develop by Jayesh Jadhav
         </div>

      </div>
    </div>
  );
};

export default Signup;