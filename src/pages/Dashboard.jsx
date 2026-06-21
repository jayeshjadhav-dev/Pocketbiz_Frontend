import { useState } from 'react';
import { 
  TrendingUp, Users, CreditCard, ShoppingBag, 
  ArrowUpRight, ArrowDownRight, Bell, Search, 
  Plus, FileText, AlertTriangle, ChevronRight 
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { useBrand } from '../context/BrandContext';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { user, config } = useBrand();
  const navigate = useNavigate();
  
  // Dummy Data for Chart (Replace with API data later)
  const chartData = [
    { name: 'Mon', revenue: 4000 },
    { name: 'Tue', revenue: 3000 },
    { name: 'Wed', revenue: 5000 },
    { name: 'Thu', revenue: 2780 },
    { name: 'Fri', revenue: 1890 },
    { name: 'Sat', revenue: 6390 },
    { name: 'Sun', revenue: 3490 },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-8 animate-enter">
      
      {/* 1. WELCOME HEADER WITH QUICK ACTIONS */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            Dashboard
          </h1>
          <p className="text-gray-500 mt-1">
            Welcome back, <span className="font-bold text-gray-800">{config?.businessName || 'Business Owner'}</span>
          </p>
        </div>

        <div className="flex gap-3">
           <QuickActionButton 
             icon={<Plus size={18}/>} 
             label="New Bill" 
             onClick={() => navigate('/orders')} 
             primary 
           />
           <QuickActionButton 
             icon={<Users size={18}/>} 
             label="Add Customer" 
             onClick={() => alert("Open Add Customer Modal")} 
           />
        </div>
      </div>

      {/* 2. KEY METRICS (Gradient & Glassmorphism) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
         <StatCard 
            title="Total Revenue" 
            value="₹42,500" 
            trend="+12.5%" 
            icon={<TrendingUp size={24} className="text-white"/>}
            gradient="bg-gradient-to-br from-indigo-500 to-purple-600 text-white"
            subtext="vs last week"
            subtextColor="text-indigo-100"
         />
         <StatCard 
            title="Active Customers" 
            value="142" 
            trend="+4" 
            icon={<Users size={24} className="text-indigo-600"/>}
            gradient="bg-white border border-gray-100"
            textColor="text-gray-900"
            subtext="new this week"
         />
         <StatCard 
            title="Market Due (Udhati)" 
            value="₹15,200" 
            trend="HIGH" 
            trendColor="text-red-500 bg-red-50"
            icon={<CreditCard size={24} className="text-rose-500"/>}
            gradient="bg-white border border-gray-100"
            textColor="text-gray-900"
            subtext="3 payments overdue"
         />
         <StatCard 
            title="Low Stock Items" 
            value="5" 
            trend="ALERT" 
            trendColor="text-amber-600 bg-amber-50"
            icon={<AlertTriangle size={24} className="text-amber-500"/>}
            gradient="bg-white border border-gray-100"
            textColor="text-gray-900"
            subtext="Restock needed"
         />
      </div>

      {/* 3. MAIN CONTENT GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT: INTERACTIVE CHART */}
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
           <div className="flex justify-between items-center mb-6">
              <div>
                 <h3 className="font-bold text-gray-900 text-lg">Revenue Analytics</h3>
                 <p className="text-xs text-gray-400">Sales performance over the last 7 days</p>
              </div>
              <select className="bg-gray-50 border border-gray-200 text-xs font-bold rounded-lg px-3 py-2 outline-none">
                 <option>This Week</option>
                 <option>Last Month</option>
              </select>
           </div>
           
           <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9"/>
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10}/>
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                  <Tooltip 
                    contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'}}
                  />
                  <Area type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                </AreaChart>
              </ResponsiveContainer>
           </div>
        </div>

        {/* RIGHT: ACTIONABLE ACTIVITY FEED */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
           <h3 className="font-bold text-gray-900 text-lg mb-6">Recent Activity</h3>
           
           <div className="space-y-6">
              <ActivityItem 
                 icon={<ArrowDownRight size={18}/>}
                 bg="bg-green-50 text-green-600"
                 title="Payment Received"
                 desc="From Amit Kumar"
                 amount="+ ₹500"
                 time="2m ago"
              />
              <ActivityItem 
                 icon={<ShoppingBag size={18}/>}
                 bg="bg-indigo-50 text-indigo-600"
                 title="New Order #1023"
                 desc="2 Items • Cash"
                 amount="₹1,200"
                 time="15m ago"
              />
              <ActivityItem 
                 icon={<AlertTriangle size={18}/>}
                 bg="bg-amber-50 text-amber-600"
                 title="Low Stock Alert"
                 desc="Samsung A14 (Only 2 left)"
                 amount="Stock"
                 time="1h ago"
              />
              <ActivityItem 
                 icon={<CreditCard size={18}/>}
                 bg="bg-red-50 text-red-600"
                 title="Pending Payment"
                 desc="Suresh Traders"
                 amount="- ₹3,500"
                 time="4h ago"
              />
           </div>

           <button className="w-full mt-6 py-3 rounded-xl border border-gray-100 text-xs font-bold text-gray-600 hover:bg-gray-50 transition">
              View All Transactions
           </button>
        </div>

      </div>
    </div>
  );
};

// --- SUB-COMPONENTS ---

const QuickActionButton = ({ icon, label, onClick, primary }) => (
   <button 
     onClick={onClick}
     className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm transition-all shadow-sm hover:scale-105 active:scale-95 ${
       primary ? 'bg-black text-white hover:bg-gray-800 shadow-lg' : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
     }`}
   >
      {icon} {label}
   </button>
);

const StatCard = ({ title, value, trend, icon, gradient, textColor, trendColor, subtext, subtextColor }) => (
   <div className={`p-6 rounded-3xl shadow-sm relative overflow-hidden transition-all hover:-translate-y-1 hover:shadow-md ${gradient}`}>
      <div className="flex justify-between items-start mb-4 relative z-10">
         <div className={`p-3 rounded-xl ${textColor ? 'bg-gray-50' : 'bg-white/20 backdrop-blur-md'}`}>
            {icon}
         </div>
         <span className={`text-xs font-bold px-2 py-1 rounded-lg ${trendColor ? trendColor : 'bg-white/20 text-white'}`}>
            {trend}
         </span>
      </div>
      <div className="relative z-10">
         <h3 className={`text-3xl font-black mb-1 ${textColor || 'text-white'}`}>{value}</h3>
         <p className={`text-sm font-medium ${subtextColor || 'text-gray-400'}`}>{title}</p>
         <p className={`text-[10px] mt-2 opacity-70 ${subtextColor || 'text-gray-300'}`}>{subtext}</p>
      </div>
   </div>
);

const ActivityItem = ({ icon, bg, title, desc, amount, time }) => (
   <div className="flex items-center justify-between group cursor-pointer">
      <div className="flex items-center gap-4">
         <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${bg}`}>
            {icon}
         </div>
         <div>
            <h4 className="font-bold text-gray-900 text-sm group-hover:text-indigo-600 transition">{title}</h4>
            <p className="text-xs text-gray-400">{desc}</p>
         </div>
      </div>
      <div className="text-right">
         <div className="font-bold text-gray-900 text-sm">{amount}</div>
         <div className="text-[10px] text-gray-400">{time}</div>
      </div>
   </div>
);

export default Dashboard;