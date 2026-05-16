import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Camera, 
  Save, 
  CheckCircle, 
  AlertCircle,
  LayoutDashboard,
  Store,
  Loader2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { doc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { updateProfile } from 'firebase/auth';
import { db, storage, auth } from '../firebase';
import { Link } from 'react-router-dom';

export default function Profile() {
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    displayName: user?.displayName || '',
    phoneNumber: user?.phoneNumber || '',
    location: user?.location || '',
  });

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file.');
      return;
    }

    // Validate size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      setError('Image must be less than 2MB.');
      return;
    }

    setUploadingImage(true);
    setError(null);

    try {
      const storageRef = ref(storage, `profiles/${user.uid}/${Date.now()}_${file.name}`);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);

      // Update Firestore
      await updateDoc(doc(db, 'users', user.uid), {
        photoURL: downloadURL,
        updatedAt: new Date().toISOString()
      });

      // Update Firebase Auth Profile
      if (auth.currentUser) {
        await updateProfile(auth.currentUser, {
          photoURL: downloadURL
        });
      }

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      console.error(err);
      setError('Failed to upload image. Please try again.');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    setSuccess(false);
    setError(null);

    // Phone validation (07... + 8 digits)
    const phoneRegex = /^07[0-9]{8}$/;
    if (formData.phoneNumber && !phoneRegex.test(formData.phoneNumber)) {
      setError('Please enter a valid Ugandan phone number (starting with 07 followed by 8 digits, e.g., 0712345678).');
      setLoading(false);
      return;
    }

    try {
      await updateDoc(doc(db, 'users', user.uid), {
        ...formData,
        updatedAt: new Date().toISOString()
      });
      
      // Also update display name in Auth if changed
      if (auth.currentUser && formData.displayName !== auth.currentUser.displayName) {
        await updateProfile(auth.currentUser, {
          displayName: formData.displayName
        });
      }

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      console.error(err);
      setError('Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="max-w-4xl space-y-10 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Personal Profile</h1>
          <p className="text-gray-500 tracking-tight">Your account settings and contact information.</p>
        </div>
        {user.role === 'wholesaler' && (
          <Link 
            to="/dashboard/settings"
            className="bg-blue-50 text-blue-600 px-6 py-3 rounded-2xl text-xs font-black flex items-center gap-2 hover:bg-blue-100 transition-all border border-blue-100 shadow-sm"
          >
            <Store size={18} /> Manage Business Profile
          </Link>
        )}
      </div>

      <div className="grid md:grid-cols-3 gap-10">
        {/* Left Side: Forms */}
        <div className="md:col-span-2">
          <form onSubmit={handleSubmit} className="bg-white p-8 md:p-10 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-8">
            <div className="space-y-6">
              <div className="flex items-center gap-3 text-blue-600 mb-2">
                <User size={20} />
                <h3 className="font-black uppercase tracking-widest text-xs">Account Information</h3>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
                  <input 
                    type="text" 
                    value={formData.displayName}
                    onChange={(e) => setFormData({...formData, displayName: e.target.value})}
                    className="w-full px-5 py-3 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                    placeholder="John Doe"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                   <div className="space-y-2 text-gray-400">
                      <label className="text-[10px] font-black uppercase tracking-widest ml-1">Email Address (Locked)</label>
                      <div className="w-full px-5 py-3 bg-gray-100 border border-transparent rounded-2xl font-medium flex items-center gap-3">
                         <Mail size={16} />
                         {user.email}
                      </div>
                   </div>
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
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Local Address / Location</label>
                  <div className="relative">
                    <input 
                      type="text" 
                      value={formData.location}
                      onChange={(e) => setFormData({...formData, location: e.target.value})}
                      className="w-full pl-12 pr-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                      placeholder="e.g. Kisenyi, Kampala"
                    />
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 space-y-4">
               <button 
                disabled={loading}
                className="w-full bg-gray-900 text-white py-4 rounded-2xl font-black shadow-lg hover:bg-black transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                  {loading ? 'Saving Changes...' : (
                    <>Save Account Settings <Save size={20} /></>
                  )}
               </button>

               <AnimatePresence>
                  {success && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="p-4 bg-green-50 text-green-600 text-sm font-bold rounded-2xl flex items-center gap-2 border border-green-100"
                    >
                       <CheckCircle size={18} /> Profile successfully updated!
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
            </div>
          </form>
        </div>

        {/* Right Side: Card & Role Info */}
        <div className="space-y-6">
          <div className="bg-white border border-gray-100 overflow-hidden rounded-[2.5rem] shadow-sm">
            <div className="bg-blue-600 h-24 relative">
               <div className="absolute -bottom-10 left-8">
                  <div className="h-20 w-20 bg-white p-1 rounded-2xl shadow-xl">
                     <div className="w-full h-full bg-gray-100 rounded-[0.8rem] flex items-center justify-center text-gray-400 border border-gray-50 relative group overflow-hidden">
                        {user.photoURL ? (
                          <img src={user.photoURL} alt={user.displayName || ''} className="w-full h-full object-cover rounded-[0.8rem]" />
                        ) : (
                          <User size={32} />
                        )}
                        <button 
                          onClick={() => fileInputRef.current?.click()}
                          disabled={uploadingImage}
                          className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-[0.8rem] flex items-center justify-center text-white"
                        >
                           {uploadingImage ? <Loader2 size={20} className="animate-spin" /> : <Camera size={20} />}
                        </button>
                        <input 
                          type="file" 
                          ref={fileInputRef} 
                          onChange={handleImageChange} 
                          className="hidden" 
                          accept="image/*"
                        />
                     </div>
                  </div>
               </div>
            </div>
            <div className="pt-14 pb-8 px-8 space-y-4">
              <div>
                <h4 className="text-xl font-black text-gray-900">{user.displayName || 'No Name Set'}</h4>
                <div className="flex items-center gap-2 mt-1">
                   <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest ${
                     user.role === 'wholesaler' ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600'
                   }`}>
                     {user.role}
                   </span>
                   <span className="text-gray-300">•</span>
                   <span className="text-xs font-bold text-gray-400">Uganda</span>
                </div>
              </div>
              <p className="text-xs text-gray-500 font-medium leading-relaxed">
                Registered on {user.joinedAt?.toDate ? new Date(user.joinedAt.toDate()).toLocaleDateString() : 'HAM Grounds'}
              </p>
            </div>
          </div>

          <div className="bg-gray-50 p-8 rounded-[2.5rem] border border-gray-100">
             <h5 className="font-bold text-gray-900 mb-4">Account Security</h5>
             <div className="space-y-4">
                <button className="w-full bg-white border border-gray-200 text-gray-700 py-3 rounded-xl text-xs font-black hover:bg-gray-100 transition-colors">
                   Change Password
                </button>
                <button className="w-full text-red-600 text-xs font-black hover:underline py-2">
                   Delete Account
                </button>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
