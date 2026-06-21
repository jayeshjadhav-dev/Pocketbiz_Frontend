import { useState, useEffect } from 'react';
import { 
  Plus, Search, LayoutGrid, List as ListIcon, 
  Edit2, Trash2, Package, ImageIcon, CheckCircle2, AlertCircle, Loader2 
} from 'lucide-react';
import { useBrand } from '../context/BrandContext';
import AddServiceModal from '../components/Shared/AddServiceModal';

const Services = () => {
  const { config, user } = useBrand();
  
  // --- STATE ---
  const [services, setServices] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState('GRID'); 
  const [searchQuery, setSearchQuery] = useState('');
  const [isDeleting, setIsDeleting] = useState(null); // Track which ID is deleting

  if (!config || !user) return <div className="p-10 text-center animate-pulse">Loading Catalog...</div>;

  const themeColor = config?.themeColor || '#4F46E5';
  const planLimit = config?.plan?.maxProducts ?? 10;
  const itemLabel = config?.labels?.order === 'Job' ? 'Service' : 'Product';

  const currentCount = services.length;
  const isLimitReached = planLimit !== -1 && currentCount >= planLimit;
  const isUnlimited = planLimit === -1;
  const usagePercent = isUnlimited ? 0 : Math.min((currentCount / planLimit) * 100, 100);

  // --- API: FETCH DATA ---
  useEffect(() => {
    if (user?.id) {
      fetch(`/api/services/vendor/${user.id}`)
        .then(res => res.ok ? res.json() : [])
        .then(data => setServices(data || []))
        .catch(err => console.error("Failed to load services", err));
    }
  }, [user?.id]);

  // --- API: ADD SERVICE ---
  const handleAddService = (newItem) => {
    fetch(`/api/services/vendor/${user.id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...newItem, active: true })
    })
    .then(res => {
        if (!res.ok) throw new Error("Limit Reached");
        return res.json();
    })
    .then(savedItem => {
      setServices([...services, savedItem]);
      setIsModalOpen(false);
    })
    .catch(err => alert("You cannot add more items on this plan!"));
  };

  // --- API: DELETE SERVICE (THE FIX) ---
  const handleDeleteService = async (serviceId) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;

    setIsDeleting(serviceId); // Show loading spinner on specific card

    try {
      // Assuming your backend delete endpoint is /api/services/{id}
      const res = await fetch(`/api/services/${serviceId}`, {
        method: 'DELETE'
      });

      if (res.ok) {
        // Remove from UI instantly
        setServices(services.filter(item => item.id !== serviceId));
      } else {
        alert("Failed to delete. Check backend logs.");
      }
    } catch (error) {
      console.error("Delete failed", error);
      alert("Error deleting item.");
    } finally {
      setIsDeleting(null);
    }
  };

  const filteredServices = services.filter(service => 
     service.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-8 animate-enter pb-24">
      
      {/* HEADER & ACTIONS */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
           <h1 className="text-3xl font-bold text-gray-900 tracking-tight">{config.businessName}'s Catalog</h1>
           <p className="text-gray-500 mt-1">Manage your {itemLabel.toLowerCase()}s and pricing</p>
        </div>

        <div className="flex gap-3 w-full md:w-auto">
           <button 
             disabled={isLimitReached}
             className={`px-5 py-3 rounded-xl font-bold flex items-center gap-2 transition shadow-lg hover:-translate-y-0.5 ${isLimitReached ? 'bg-gray-300 cursor-not-allowed' : 'bg-black text-white hover:bg-gray-800'}`}
             onClick={() => setIsModalOpen(true)}
           >
              {isLimitReached ? <AlertCircle size={20}/> : <Plus size={20}/>} 
              {isLimitReached ? "Plan Limit Reached" : `Add New ${itemLabel}`}
           </button>
        </div>
      </div>

      {/* SEARCH BAR & USAGE */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-8 flex flex-col md:flex-row gap-6 items-center">
         {!isUnlimited && (
             <div className="flex-1 w-full">
                <div className="flex justify-between text-xs font-bold mb-2 uppercase tracking-wide text-gray-500">
                   <span>Plan Usage</span>
                   <span className={isLimitReached ? "text-red-500" : "text-gray-900"}>
                      {currentCount} / {planLimit} Items
                   </span>
                </div>
                <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                   <div 
                     className={`h-full rounded-full transition-all duration-1000 ${isLimitReached ? 'bg-red-500' : 'bg-indigo-600'}`} 
                     style={{ width: `${usagePercent}%`, backgroundColor: isLimitReached ? undefined : themeColor }}
                   ></div>
                </div>
             </div>
         )}
         {isUnlimited && <div className="flex-1 font-bold text-gray-400 text-sm">unlimited Plan Active 🚀</div>}
         
         <div className="w-px h-10 bg-gray-200 hidden md:block"></div>

         <div className="flex gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
               <Search className="absolute left-3 top-3 text-gray-400" size={18}/>
               <input 
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
                 placeholder={`Search ${itemLabel}s...`}
                 className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold focus:ring-2 focus:ring-indigo-500 outline-none"
               />
            </div>
            <div className="flex bg-gray-50 p-1 rounded-xl border border-gray-200">
               <button onClick={() => setViewMode('GRID')} className={`p-2 rounded-lg transition ${viewMode === 'GRID' ? 'bg-white shadow-sm text-indigo-600' : 'text-gray-400'}`}><LayoutGrid size={18}/></button>
               <button onClick={() => setViewMode('LIST')} className={`p-2 rounded-lg transition ${viewMode === 'LIST' ? 'bg-white shadow-sm text-indigo-600' : 'text-gray-400'}`}><ListIcon size={18}/></button>
            </div>
         </div>
      </div>

      {/* PRODUCT GRID */}
      {services.length === 0 ? (
         <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-300">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
               <Package size={32} className="text-gray-400"/>
            </div>
            <h3 className="text-xl font-bold text-gray-900">Your catalog is empty</h3>
            <p className="text-gray-500 max-w-sm mx-auto mt-2 mb-6">Start adding items to create bills.</p>
            <button onClick={() => setIsModalOpen(true)} className="text-indigo-600 font-bold hover:underline">Add your first item</button>
         </div>
      ) : (
         <div className={viewMode === 'GRID' ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" : "space-y-4"}>
            {filteredServices.map(item => (
               <ProductCard 
                 key={item.id} 
                 item={item} 
                 viewMode={viewMode} 
                 themeColor={themeColor} 
                 onDelete={handleDeleteService} // Pass Delete Function
                 isDeleting={isDeleting === item.id} // Pass Loading State
               />
            ))}
            
            {viewMode === 'GRID' && !isLimitReached && (
                <button 
                  onClick={() => setIsModalOpen(true)}
                  className="border-2 border-dashed border-gray-200 rounded-3xl flex flex-col items-center justify-center min-h-[280px] hover:border-indigo-300 hover:bg-indigo-50/30 transition group"
                >
                   <div className="w-14 h-14 bg-gray-50 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition">
                      <Plus size={24} className="text-gray-400 group-hover:text-indigo-500"/>
                   </div>
                   <span className="font-bold text-gray-500 group-hover:text-indigo-600">Add New {itemLabel}</span>
                </button>
            )}
         </div>
      )}

      <AddServiceModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleAddService}
        brandColor={themeColor}
        label={itemLabel} 
      />
    </div>
  );
};

// --- SUB-COMPONENT: PRODUCT CARD ---
const ProductCard = ({ item, viewMode, themeColor, onDelete, isDeleting }) => {
  const [inStock, setInStock] = useState(true);

  if (viewMode === 'LIST') {
     return (
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center gap-6 hover:shadow-md transition group">
           <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 shrink-0">
              <ImageIcon size={24}/>
           </div>
           <div className="flex-1">
              <h3 className="font-bold text-gray-900">{item.name}</h3>
              <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                 <span className="bg-gray-100 px-2 py-0.5 rounded text-gray-600 font-medium">{item.category || 'General'}</span>
              </div>
           </div>
           <div className="font-bold text-gray-900 text-lg">₹{item.price}</div>
           <div className="flex items-center gap-4">
               <button 
                  onClick={() => onDelete(item.id)} 
                  disabled={isDeleting}
                  className="p-2 hover:bg-red-50 rounded-lg text-red-300 hover:text-red-500 transition"
               >
                  {isDeleting ? <Loader2 size={16} className="animate-spin text-red-500"/> : <Trash2 size={16}/>}
               </button>
           </div>
        </div>
     );
  }

  // GRID VIEW
  return (
    <div className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group relative overflow-hidden">
       
       <div className="w-full h-40 bg-gray-50 rounded-2xl mb-4 flex items-center justify-center relative overflow-hidden group-hover:bg-gray-100 transition">
          <ImageIcon size={32} className="text-gray-300"/>
          
          {/* ACTION BUTTONS */}
          <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2 backdrop-blur-[2px]">
             <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition text-gray-700">
                <Edit2 size={16}/>
             </button>
             
             {/* DELETE BUTTON */}
             <button 
               onClick={() => onDelete(item.id)}
               disabled={isDeleting}
               className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition text-red-500"
             >
                {isDeleting ? <Loader2 size={16} className="animate-spin"/> : <Trash2 size={16}/>}
             </button>
          </div>
       </div>

       <div>
          <div className="flex justify-between items-start mb-2">
             <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{item.category || 'Item'}</span>
             {inStock ? <CheckCircle2 size={18} className="text-green-500"/> : <AlertCircle size={18} className="text-red-400"/>}
          </div>
          <h3 className="font-bold text-gray-900 text-lg leading-tight mb-1 truncate">{item.name}</h3>
          <h4 className="font-black text-2xl" style={{ color: themeColor }}>₹{item.price}</h4>
       </div>

       <button 
         onClick={() => setInStock(!inStock)}
         className={`mt-4 w-full py-2 text-center rounded-lg text-xs font-bold transition-colors ${inStock ? 'bg-green-50 text-green-600 hover:bg-green-100' : 'bg-red-50 text-red-500 hover:bg-red-100'}`}
       >
          {inStock ? 'In Stock' : 'Out of Stock'}
       </button>
    </div>
  );
};

export default Services;