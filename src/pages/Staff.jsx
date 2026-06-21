import { useState, useEffect } from 'react';
import { 
  Users, Plus, Phone, Trash2, Edit2, ShieldAlert, 
  Briefcase, DollarSign, Loader2, Crown 
} from 'lucide-react';
import { useBrand } from '../context/BrandContext';
import { useNavigate } from 'react-router-dom';

const Staff = () => {
  const { user, config } = useBrand();
  const navigate = useNavigate();
  
  const [staffList, setStaffList] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Edit Mode State
  const [editingId, setEditingId] = useState(null); 
  const [formData, setFormData] = useState({
     fullName: '', mobile: '', role: 'Helper', salary: ''
  });

  // --- 1. PLAN CHECK ---
  // If plan is BASIC, they cannot access this page logic
  const canAddStaff = config?.plan?.name !== 'BASIC';

  useEffect(() => {
    if (user?.id && canAddStaff) {
       fetchStaff();
    }
  }, [user]);

  const fetchStaff = async () => {
     try {
        const res = await fetch(`/api/staff/vendor/${user.id}`);
        if(res.ok) setStaffList(await res.json());
     } catch(e) { console.error(e); }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
        const url = editingId 
            ? `/api/staff/${editingId}` // PUT
            : `/api/staff/vendor/${user.id}`; // POST
            
        const method = editingId ? 'PUT' : 'POST';

        const res = await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });

        if(!res.ok) throw new Error("Failed to save");

        await fetchStaff(); // Refresh list
        closeModal();
    } catch (err) {
        alert("Error saving staff. " + err.message);
    } finally {
        setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
      if(!window.confirm("Remove this employee?")) return;
      await fetch(`/api/staff/${id}`, { method: 'DELETE' });
      setStaffList(staffList.filter(s => s.id !== id));
  };

  const openEdit = (staff) => {
      setEditingId(staff.id);
      setFormData({ 
          fullName: staff.fullName, 
          mobile: staff.mobile, 
          role: staff.role, 
          salary: staff.salary 
      });
      setIsModalOpen(true);
  };

  const closeModal = () => {
      setIsModalOpen(false);
      setEditingId(null);
      setFormData({ fullName: '', mobile: '', role: 'Helper', salary: '' });
  };

  // --- RENDER: LOCKED STATE (BASIC PLAN) ---
  if (!canAddStaff) {
     return (
        <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-6 text-center animate-enter">
           <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mb-6 relative">
              <Users size={40} className="text-gray-400"/>
              <div className="absolute -bottom-2 -right-2 bg-white p-2 rounded-full shadow-md">
                 <ShieldAlert className="text-red-500" size={24}/>
              </div>
           </div>
           <h1 className="text-2xl font-bold text-gray-900 mb-2">Team Management is Locked</h1>
           <p className="text-gray-500 max-w-sm mb-8">
              Upgrade to Gold or Platinum to add staff members, manage payroll, and assign roles.
           </p>
           <button 
             onClick={() => navigate('/subscription')}
             className="bg-gradient-to-r from-amber-500 to-amber-600 text-white px-8 py-3 rounded-xl font-bold hover:scale-105 transition shadow-lg flex items-center gap-2"
           >
              <Crown size={18}/> Upgrade Plan
           </button>
        </div>
     );
  }

  // --- RENDER: MAIN DASHBOARD ---
  return (
    <div className="min-h-screen bg-[#F8FAFC] p-8 animate-enter pb-24">
       
       <div className="flex justify-between items-center mb-8">
          <div>
             <h1 className="text-3xl font-bold text-gray-900">My Team</h1>
             <p className="text-gray-500 mt-1">Manage employees and roles</p>
          </div>
          <button 
             onClick={() => setIsModalOpen(true)}
             className="bg-black text-white px-5 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-gray-800 transition shadow-lg"
          >
             <Plus size={20}/> Add Employee
          </button>
       </div>

       {staffList.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-300">
             <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users size={32} className="text-gray-400"/>
             </div>
             <h3 className="text-xl font-bold text-gray-900">No staff added yet</h3>
             <p className="text-gray-500 mt-2">Add your first employee to start tracking.</p>
          </div>
       ) : (
          /* --- UPDATED GRID CLASS HERE --- */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6 w-full">
             {staffList.map(staff => (
                <div key={staff.id} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:shadow-lg transition-all group relative overflow-hidden">
                   
                   {/* Header / ID Card Look */}
                   <div className="flex items-center gap-4 mb-6">
                      <img 
                        src={staff.photoUrl} 
                        alt="Avatar" 
                        className="w-16 h-16 rounded-2xl border-2 border-white shadow-md bg-gray-100"
                      />
                      <div>
                         <h3 className="text-lg font-bold text-gray-900">{staff.fullName}</h3>
                         <span className={`text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wide ${staff.role === 'Manager' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-600'}`}>
                            {staff.role}
                         </span>
                      </div>
                   </div>

                   {/* Details Grid */}
                   <div className="space-y-3 bg-gray-50 p-4 rounded-2xl">
                      <div className="flex items-center justify-between text-sm">
                         <div className="flex items-center gap-2 text-gray-500">
                            <Phone size={14}/> Mobile
                         </div>
                         <span className="font-bold text-gray-900">{staff.mobile}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                         <div className="flex items-center gap-2 text-gray-500">
                            <DollarSign size={14}/> Salary
                         </div>
                         <span className="font-bold text-gray-900">₹{staff.salary}</span>
                      </div>
                   </div>

                   {/* Actions (Hidden until hover) */}
                   <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => openEdit(staff)} className="p-2 bg-white rounded-full shadow-sm hover:text-indigo-600">
                         <Edit2 size={16}/>
                      </button>
                      <button onClick={() => handleDelete(staff.id)} className="p-2 bg-white rounded-full shadow-sm hover:text-red-500">
                         <Trash2 size={16}/>
                      </button>
                   </div>
                </div>
             ))}
          </div>
       )}

       {/* MODAL */}
       {isModalOpen && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
             <div className="bg-white w-full max-w-md p-6 rounded-3xl shadow-2xl animate-enter">
                <h2 className="text-xl font-bold mb-6">{editingId ? 'Edit Employee' : 'New Employee'}</h2>
                
                <form onSubmit={handleSave} className="space-y-4">
                   <div>
                      <label className="text-xs font-bold text-gray-400 uppercase">Full Name</label>
                      <div className="relative mt-1">
                         <Users className="absolute left-3 top-3 text-gray-400" size={18}/>
                         <input 
                           required
                           className="w-full pl-10 p-3 bg-gray-50 rounded-xl border border-gray-200 font-bold focus:ring-2 focus:ring-black outline-none"
                           value={formData.fullName}
                           onChange={e => setFormData({...formData, fullName: e.target.value})}
                         />
                      </div>
                   </div>

                   <div className="grid grid-cols-2 gap-4">
                       <div>
                          <label className="text-xs font-bold text-gray-400 uppercase">Role</label>
                          <div className="relative mt-1">
                             <Briefcase className="absolute left-3 top-3 text-gray-400" size={18}/>
                             <select 
                               className="w-full pl-10 p-3 bg-gray-50 rounded-xl border border-gray-200 font-bold focus:ring-2 focus:ring-black outline-none appearance-none"
                               value={formData.role}
                               onChange={e => setFormData({...formData, role: e.target.value})}
                             >
                                <option>Manager</option>
                                <option>Sales</option>
                                <option>Helper</option>
                                <option>Accountant</option>
                             </select>
                          </div>
                       </div>
                       <div>
                          <label className="text-xs font-bold text-gray-400 uppercase">Salary (₹)</label>
                          <div className="relative mt-1">
                             <input 
                               type="number"
                               required
                               className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 font-bold focus:ring-2 focus:ring-black outline-none"
                               value={formData.salary}
                               onChange={e => setFormData({...formData, salary: e.target.value})}
                             />
                          </div>
                       </div>
                   </div>

                   <div>
                      <label className="text-xs font-bold text-gray-400 uppercase">Mobile Number</label>
                      <div className="relative mt-1">
                         <Phone className="absolute left-3 top-3 text-gray-400" size={18}/>
                         <input 
                           required
                           type="tel"
                           className="w-full pl-10 p-3 bg-gray-50 rounded-xl border border-gray-200 font-bold focus:ring-2 focus:ring-black outline-none"
                           value={formData.mobile}
                           onChange={e => setFormData({...formData, mobile: e.target.value})}
                         />
                      </div>
                   </div>

                   <div className="flex gap-3 pt-4">
                      <button type="button" onClick={closeModal} className="flex-1 py-3 font-bold text-gray-500 hover:bg-gray-50 rounded-xl">Cancel</button>
                      <button type="submit" disabled={isLoading} className="flex-1 py-3 bg-black text-white font-bold rounded-xl flex justify-center items-center">
                         {isLoading ? <Loader2 className="animate-spin"/> : 'Save Employee'}
                      </button>
                   </div>
                </form>
             </div>
          </div>
       )}
    </div>
  );
};

export default Staff;