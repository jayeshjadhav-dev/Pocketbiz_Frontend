import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Phone, Lock, ArrowRight, Loader2, ShieldCheck, TrendingUp, Briefcase } from 'lucide-react';
import { useBrand } from '../context/BrandContext';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useBrand();
  
  const [formData, setFormData] = useState({ mobileNumber: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/vendor/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      if (!response.ok) throw new Error("Invalid Credentials");

      login(data);
      navigate('/dashboard'); 

    } catch (err) {
      setError("Incorrect mobile or password.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex animate-enter">
      
      {/* LEFT SIDE: BRANDING (Hidden on Mobile) */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#0F172A] relative overflow-hidden flex-col justify-between p-12 text-white">
         <div className="absolute inset-0 opacity-10 pattern-grid-lg"></div>
         <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500 rounded-full blur-[120px] opacity-20"></div>
         
         <div className="relative z-10">
            <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center font-bold text-2xl mb-8 shadow-lg shadow-indigo-900/50">P</div>
            <h1 className="text-5xl font-bold leading-tight mb-6">Manage your business <span className="text-indigo-400">like a pro.</span></h1>
            <p className="text-slate-400 text-lg max-w-md">Join 10,000+ vendors using PocketBiz to track sales, manage inventory, and grow their brand.</p>
         </div>

         <div className="relative z-10 bg-white/5 backdrop-blur-sm border border-white/10 p-6 rounded-2xl">
            <div className="flex gap-4 items-center mb-4">
               <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-black font-bold">R</div>
               <div>
                  <h4 className="font-bold">Rahul Electronics</h4>
                  <p className="text-xs text-slate-400">Platinum Member</p>
               </div>
               <div className="ml-auto flex items-center gap-1 text-green-400 text-sm font-bold">
                  <TrendingUp size={16}/> +124%
               </div>
            </div>
            <p className="text-sm text-slate-300">"Since switching to PocketBiz, my daily accounting time dropped from 2 hours to just 15 minutes."</p>
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
                   <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h2>
                   <p className="text-gray-500">Please enter your details to sign in.</p>
                </div>

                {error && (
                  <div className="mb-6 p-4 bg-red-50 text-red-600 text-sm rounded-xl border border-red-100 flex items-center gap-3 animate-pulse">
                    <ShieldCheck size={20} /> {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                     <label className="text-xs font-bold text-gray-900 uppercase tracking-wide">Mobile Number</label>
                     <div className="relative group">
                        <Phone className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-indigo-600 transition-colors" size={20} />
                        <input 
                          type="tel" 
                          className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition font-medium text-gray-900 placeholder-gray-400"
                          placeholder="Enter 10-digit number"
                          value={formData.mobileNumber}
                          onChange={(e) => setFormData({...formData, mobileNumber: e.target.value})}
                        />
                     </div>
                  </div>

                  <div className="space-y-2">
                     <div className="flex justify-between">
                        <label className="text-xs font-bold text-gray-900 uppercase tracking-wide">Password</label>
                        <a href="#" className="text-xs font-bold text-indigo-600 hover:text-indigo-700">Forgot Password?</a>
                     </div>
                     <div className="relative group">
                        <Lock className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-indigo-600 transition-colors" size={20} />
                        <input 
                          type="password" 
                          className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition font-medium text-gray-900 placeholder-gray-400"
                          placeholder="••••••••"
                          value={formData.password}
                          onChange={(e) => setFormData({...formData, password: e.target.value})}
                        />
                     </div>
                  </div>

                  <button 
                    type="submit" 
                    disabled={isLoading}
                    className="w-full bg-gray-900 text-white py-4 rounded-xl font-bold text-lg hover:bg-black hover:scale-[1.01] active:scale-[0.99] transition-all shadow-xl shadow-gray-200 flex items-center justify-center gap-2 disabled:opacity-70 disabled:hover:scale-100"
                  >
                    {isLoading ? <Loader2 className="animate-spin" /> : <>Sign In <ArrowRight size={20}/></>}
                  </button>
                </form>

                <p className="text-center mt-8 text-gray-500">
                  Don't have an account? <Link to="/signup" className="text-indigo-600 font-bold hover:underline">Create free account</Link>
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

export default Login;