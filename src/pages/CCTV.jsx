import { Shield, Lock } from 'lucide-react';
import { useBrand } from '../context/BrandContext';
import { Link } from 'react-router-dom';

const CCTV = () => {
  const { config } = useBrand();

  // PLATINUM LOCK CHECK
  if (config?.plan?.name !== 'PLATINUM') {
    return (
      <div className="flex flex-col items-center justify-center h-[80vh] text-center p-6">
        <div className="bg-gray-100 p-6 rounded-full mb-4">
           <Lock size={48} className="text-gray-400" />
        </div>
        <h2 className="text-xl font-bold text-gray-800">Security Center Locked</h2>
        <p className="text-gray-500 mt-2 mb-6">Live CCTV monitoring is exclusive to Platinum members.</p>
        <Link to="/subscription" className="bg-gray-900 text-white px-8 py-3 rounded-xl font-bold">
          Upgrade to Platinum
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold flex items-center gap-2">
        <Shield className="text-green-500" /> Live Security
      </h2>

      {/* Camera Grid */}
      <div className="grid gap-4">
        {/* Cam 1 */}
        <div className="bg-black rounded-xl overflow-hidden shadow-lg relative aspect-video">
           <div className="absolute top-2 left-2 bg-red-600 text-white text-[10px] px-2 py-0.5 rounded animate-pulse">LIVE</div>
           <div className="absolute bottom-2 left-2 text-white/70 text-xs">CAM 01 - Entrance</div>
           {/* Simulated Feed */}
           <img 
             src="https://media.istockphoto.com/id/1182531062/video/cctv-camera-on-a-wall-macro-shot.jpg?s=640x640&k=20&c=Xv9sXkPqg1qKzQ6y5yKzQ6y5yKzQ6y5yKzQ6y5yKzQ6y5="
             className="w-full h-full object-cover opacity-60" 
             alt="CCTV"
           />
        </div>

        {/* Cam 2 */}
        <div className="bg-black rounded-xl overflow-hidden shadow-lg relative aspect-video">
           <div className="absolute top-2 left-2 bg-red-600 text-white text-[10px] px-2 py-0.5 rounded animate-pulse">LIVE</div>
           <div className="absolute bottom-2 left-2 text-white/70 text-xs">CAM 02 - Cash Counter</div>
           <div className="w-full h-full flex items-center justify-center text-gray-600 bg-gray-900">
             <span className="text-xs">Connecting...</span>
           </div>
        </div>
      </div>
    </div>
  );
};

export default CCTV;