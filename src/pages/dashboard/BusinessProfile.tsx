import React, { useState, useRef } from 'react';
import { 
  Building2, 
  MapPin, 
  Phone, 
  MessageCircle, 
  Store, 
  Save, 
  User,
  ShieldCheck,
  CheckCircle,
  AlertCircle,
  Camera,
  Loader2
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { doc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../../firebase';
import { motion, AnimatePresence } from 'motion/react';
import imageCompression from 'browser-image-compression';

export default function BusinessProfile() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [logoUploadProgress, setLogoUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    businessName: '',
    phoneNumber: '',
    whatsappNumber: '',
    shopNo: '',
    block: '',
    displayName: '',
    photoURL: '',
  });

  React.useEffect(() => {
    if (user) {
      setFormData({
        businessName: user.businessName || '',
        phoneNumber: user.phoneNumber || '',
        whatsappNumber: user.whatsappNumber || '',
        shopNo: user.shopNo || '',
        block: user.block || '',
        displayName: user.displayName || '',
        photoURL: user.photoURL || '',
      });
    }
  }, [user]);

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    // Check if it's an image
    const isImage = file.type.startsWith('image/') || 
                    /\.(jpg|jpeg|png|gif|webp|heic|heif|bmp|tiff|svg)$/i.test(file.name.toLowerCase());
    
    if (!isImage) {
      alert("Please upload a valid image file.");
      return;
    }

    setIsUploading(true);
    setLogoUploadProgress(0);
    try {
      // Disable compression for now to isolate issues
      const fileToUpload: File = file;

      const storageRef = ref(storage, `logos/${user.uid}/${Date.now()}_logo`);
      
      console.log("BusinessProfile: Starting upload...");
      const uploadTask = uploadBytesResumable(storageRef, fileToUpload, {
        contentType: fileToUpload.type
      });

      uploadTask.on('state_changed', 
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setLogoUploadProgress(progress);
        },
        (err) => {
          console.error("BusinessProfile: Logo upload error:", err);
          alert(`Upload failed: ${err.message}`);
          setIsUploading(false);
        },
        async () => {
          console.log("BusinessProfile: Logo upload complete, fetching URL...");
          const url = await getDownloadURL(uploadTask.snapshot.ref);
          setFormData(prev => ({ ...prev, photoURL: url }));
          await updateDoc(doc(db, 'users', user.uid), { photoURL: url });
          console.log("BusinessProfile: Success!");
          setIsUploading(false);
          setLogoUploadProgress(0);
        }
      );
    } catch (err) {
      console.error("BusinessProfile: Error in handleLogoUpload:", err);
      const msg = err instanceof Error ? err.message : 'Unknown error';
      alert(`Upload failed: ${msg}`);
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    setSuccess(false);
    setError(null);

    // Phone validation
    const phoneRegex = /^07[0-9]{8}$/;
    if (formData.phoneNumber && !phoneRegex.test(formData.phoneNumber)) {
      setError('Please enter a valid Ugandan phone number (starting with 07 followed by 8 digits).');
      setLoading(false);
      return;
    }

    if (formData.whatsappNumber && !phoneRegex.test(formData.whatsappNumber)) {
      setError('Please enter a valid WhatsApp number (starting with 07 followed by 8 digits).');
      setLoading(false);
      return;
    }

    try {
      await updateDoc(doc(db, 'users', user.uid), {
        ...formData,
        updatedAt: new Date().toISOString()
      });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      console.error(err);
      setError('Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl space-y-10 pb-20">
      <div>
        <h1 className="text-2xl font-black text-gray-900">Business Profile</h1>
        <p className="text-gray-500 tracking-tight">Manage your store information as it appears to buyers.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-10">
         <div className="md:col-span-2 space-y-8">
            <form onSubmit={handleSubmit} className="bg-white p-8 md:p-10 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-8">
               <div className="space-y-6">
                  <div className="flex items-center gap-3 text-blue-600 mb-2">
                     <Building2 size={20} />
                     <h3 className="font-black uppercase tracking-widest text-xs">Identity Details</h3>
                  </div>

                  <div className="space-y-4">
                     <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Business Name</label>
                        <input 
                          type="text" 
                          value={formData.businessName}
                          onChange={(e) => setFormData({...formData, businessName: e.target.value})}
                          className="w-full px-5 py-3 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                          placeholder="Your Business Name"
                        />
                     </div>
                     <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Owner Name</label>
                        <input 
                          type="text" 
                          value={formData.displayName}
                          onChange={(e) => setFormData({...formData, displayName: e.target.value})}
                          className="w-full px-5 py-3 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                          placeholder="Full Name"
                        />
                     </div>
                  </div>
               </div>

               <div className="space-y-6">
                  <div className="flex items-center gap-3 text-green-600 mb-2">
                     <Phone size={20} />
                     <h3 className="font-black uppercase tracking-widest text-xs">Contact Info</h3>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                     <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Phone Number</label>
                        <input 
                          type="tel" 
                          pattern="07[0-9]{8}"
                          maxLength={10}
                          value={formData.phoneNumber}
                          onChange={(e) => setFormData({...formData, phoneNumber: e.target.value.replace(/\D/g, '').slice(0, 10)})}
                          className="w-full px-5 py-3 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                          placeholder="0712345678"
                        />
                     </div>
                     <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">WhatsApp Number</label>
                        <input 
                          type="tel" 
                          pattern="07[0-9]{8}"
                          maxLength={10}
                          value={formData.whatsappNumber}
                          onChange={(e) => setFormData({...formData, whatsappNumber: e.target.value.replace(/\D/g, '').slice(0, 10)})}
                          className="w-full px-5 py-3 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                          placeholder="0712345678"
                        />
                     </div>
                  </div>
               </div>

               <div className="space-y-6">
                  <div className="flex items-center gap-3 text-purple-600 mb-2">
                     <MapPin size={20} />
                     <h3 className="font-black uppercase tracking-widest text-xs">Location at HAM GROUNDS</h3>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                     <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Shop No.</label>
                        <input 
                          type="text" 
                          value={formData.shopNo}
                          onChange={(e) => setFormData({...formData, shopNo: e.target.value})}
                          className="w-full px-5 py-3 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                          placeholder="e.g. 104"
                        />
                     </div>
                     <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Block</label>
                        <input 
                          type="text" 
                          value={formData.block}
                          onChange={(e) => setFormData({...formData, block: e.target.value})}
                          className="w-full px-5 py-3 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                          placeholder="e.g. Block C"
                        />
                     </div>
                  </div>
               </div>

               <div className="pt-4">
                  <button 
                    disabled={loading}
                    className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                     {loading ? 'Saving...' : (
                       <>Update Profile <Save size={20} /></>
                     )}
                  </button>
               </div>

               <AnimatePresence>
                  {success && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="p-4 bg-green-50 text-green-600 text-sm font-bold rounded-2xl flex items-center gap-2 border border-green-100"
                    >
                       <CheckCircle size={18} /> Profile updated successfully!
                    </motion.div>
                  )}
                  {error && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="p-4 bg-red-50 text-red-600 text-sm font-bold rounded-2xl flex items-center gap-2 border border-red-100"
                    >
                       <AlertCircle size={18} /> {error}
                    </motion.div>
                  )}
               </AnimatePresence>
            </form>
         </div>

         <div className="space-y-6">
            <div className="bg-gray-900 text-white p-8 rounded-[2.5rem] shadow-xl relative overflow-hidden">
               <div className="relative z-10">
                  <div className="relative group w-20 h-20 mb-6">
                    <div className="h-20 w-20 bg-blue-600 rounded-3xl flex items-center justify-center text-3xl font-black overflow-hidden border-2 border-white/20 shadow-xl group-hover:border-blue-400 transition-all">
                       {formData.photoURL ? (
                         <img src={formData.photoURL} alt="Logo" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                       ) : (
                         user?.businessName?.charAt(0) || 'H'
                       )}
                    </div>
                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUploading}
                      className="absolute -bottom-2 -right-2 p-2 bg-white text-gray-900 rounded-xl shadow-lg border border-gray-100 hover:bg-blue-50 transition-all disabled:opacity-50"
                    >
                       {isUploading ? <Loader2 size={16} className="animate-spin" /> : <Camera size={16} />}
                    </button>
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      className="hidden" 
                      accept="image/*,.heic,.heif,.webp,.svg,.bmp" 
                      onChange={handleLogoUpload} 
                    />
                  </div>
                  {isUploading && (
                    <div className="mt-2 w-full max-w-[100px]">
                      <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                        <motion.div 
                          className="h-full bg-blue-500" 
                          initial={{ width: 0 }}
                          animate={{ width: `${logoUploadProgress}%` }}
                        />
                      </div>
                      <p className="text-[8px] font-black uppercase text-center mt-1 text-blue-400 tracking-widest">
                        {logoUploadProgress === 100 ? 'Finishing...' : `Uploading ${Math.round(logoUploadProgress)}%`}
                      </p>
                    </div>
                  )}
                  <h4 className="text-xl font-black">{formData.businessName || 'Your Store'}</h4>
                  <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mt-1">Verified Wholesaler</p>
                  
                  <div className="mt-10 space-y-4">
                     <div className="flex items-center gap-3 text-sm font-medium">
                        <Store size={18} className="text-blue-500" />
                        <span>Shop {user?.shopNo || 'N/A'}, {user?.block || 'N/A'}</span>
                     </div>
                     <div className="flex items-center gap-3 text-sm font-medium">
                        <Phone size={18} className="text-green-500" />
                        <span>{user?.phoneNumber || 'No phone'}</span>
                     </div>
                  </div>
               </div>
               <ShieldCheck size={120} className="absolute -right-8 -bottom-8 text-white/5 -rotate-12" />
            </div>

            <div className="bg-white border border-gray-100 p-8 rounded-[2.5rem] space-y-6">
               <h5 className="font-bold text-gray-900">Need Help?</h5>
               <p className="text-xs text-gray-500 leading-relaxed font-medium">If you need to change your business category or verified status, please contact our support team.</p>
               <a 
                href="https://wa.me/256750619853"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 text-sm font-bold text-blue-600 hover:underline"
              >
                  <MessageCircle size={18} /> Chat with Admin
               </a>
            </div>
         </div>
      </div>
    </div>
  );
}
