import { useState } from 'react';
import { Check, Crown, Zap, Shield, Loader2 } from 'lucide-react';
import { useBrand } from '../context/BrandContext';
import { useNavigate } from 'react-router-dom';

const Subscription = () => {
  const { config, user, login } = useBrand(); // 'login' is used to update context
  const navigate = useNavigate();
  const [loadingPlan, setLoadingPlan] = useState(null);

  const currentPlan = config?.plan?.name || "BASIC";

  const plans = [
    { name: 'BASIC', price: 'Free', features: ['20 Products', 'Basic Analytics', 'No Staff Accounts'], color: 'bg-gray-100', btn: 'Current Plan' },
    { name: 'GOLD', price: '₹499/mo', features: ['100 Products', 'Priority Support', '2 Staff Accounts'], color: 'bg-amber-100', btn: 'Upgrade to Gold' },
    { name: 'PLATINUM', price: '₹999/mo', features: ['Unlimited Products', 'Dedicated Manager', '5 Staff Accounts', 'Community Access'], color: 'bg-indigo-100', btn: 'Upgrade to Platinum' }
  ];

  const handleUpgrade = async (planName) => {
    setLoadingPlan(planName);
    
    try {
      // 1. Prepare the exact payload the Backend expects
      const payload = {
         mobileNumber: user.mobileNumber, // Backend needs this to find the user
         config: {
            plan: {
               name: planName,
               // Optional: Add other plan details if your backend Plan entity requires them strictly
               // price: planName === 'GOLD' ? 499.0 : 999.0 
            }
         }
      };

      // 2. Call the SINGLE correct endpoint
      const response = await fetch('/api/vendor/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) throw new Error("Upgrade failed");

      const updatedUser = await response.json();

      // 3. Update Frontend Context immediately
      login(updatedUser); 
      
      alert(`Successfully upgraded to ${planName}!`);
      navigate('/dashboard');

    } catch (error) {
      console.error("Upgrade Error:", error);
      alert("Upgrade failed. Check console.");
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8 animate-enter">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Upgrade your Business</h1>
          <p className="text-gray-500">Unlock premium features and grow faster</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <div key={plan.name} className={`relative p-8 rounded-3xl border-2 transition-all duration-300 hover:-translate-y-2 ${currentPlan === plan.name ? 'border-gray-900 shadow-xl scale-105 bg-white' : 'border-transparent bg-white shadow-sm hover:shadow-md'}`}>
               
               {plan.name === 'PLATINUM' && (
                 <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-black text-white px-4 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                    <Crown size={12} className="text-yellow-400"/> MOST POPULAR
                 </div>
               )}

               <h3 className="text-lg font-bold text-gray-400 tracking-widest mb-2">{plan.name}</h3>
               <div className="text-3xl font-black text-gray-900 mb-6">{plan.price}</div>

               <ul className="space-y-4 mb-8">
                 {plan.features.map((f, i) => (
                   <li key={i} className="flex items-center gap-3 text-sm font-medium text-gray-600">
                     <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${currentPlan === plan.name ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                       <Check size={14} />
                     </div>
                     {f}
                   </li>
                 ))}
               </ul>

               <button 
                 onClick={() => handleUpgrade(plan.name)}
                 disabled={currentPlan === plan.name || loadingPlan}
                 className={`w-full py-4 rounded-xl font-bold text-sm transition flex items-center justify-center gap-2
                   ${currentPlan === plan.name 
                     ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                     : 'bg-black text-white hover:bg-gray-800 shadow-lg'
                   }`}
               >
                 {loadingPlan === plan.name ? <Loader2 className="animate-spin" /> : (currentPlan === plan.name ? "Active Plan" : plan.btn)}
               </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Subscription;