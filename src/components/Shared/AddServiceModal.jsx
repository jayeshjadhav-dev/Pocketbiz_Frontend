import { useState } from 'react';
import { X } from 'lucide-react';

const AddServiceModal = ({ isOpen, onClose, onSave, brandColor, label }) => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Send data back to parent
    onSave({ name, price: parseFloat(price) });
    // Reset form
    setName("");
    setPrice("");
    setIsSubmitting(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="p-4 flex justify-between items-center border-b border-gray-100">
          <h3 className="font-bold text-lg">Add New {label}</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full text-gray-500">
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Name</label>
            <input 
              type="text" 
              required
              placeholder={`e.g. ${label === 'Product' ? 'Sugar 1kg' : 'AC Repair'}`}
              className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-opacity-50"
              style={{ '--tw-ring-color': brandColor }}
              value={name}
              onChange={e => setName(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Price (₹)</label>
            <input 
              type="number" 
              required
              placeholder="0.00"
              className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-opacity-50"
              style={{ '--tw-ring-color': brandColor }}
              value={price}
              onChange={e => setPrice(e.target.value)}
            />
          </div>

          <button 
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 text-white font-bold rounded-xl shadow-lg transition-transform active:scale-95 flex justify-center"
            style={{ backgroundColor: brandColor }}
          >
            {isSubmitting ? "Saving..." : "Save Item"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddServiceModal;