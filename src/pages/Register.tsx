import React, { useState } from 'react';
import { Mail, Lock, UserPlus, Store, User, Building2, Phone, MessageCircle } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import { auth, db } from '../firebase';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp, writeBatch } from 'firebase/firestore';
import { getAuthErrorMessage } from '../lib/authUtils';

export default function Register() {
  const location = useLocation();
  const isSellerReg = location.pathname === '/register-seller';
  const [role, setRole] = useState<'buyer' | 'wholesaler'>(isSellerReg ? 'wholesaler' : 'buyer');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    phoneNumber: '',
    whatsappNumber: '',
    businessName: '',
    shopNo: '',
    block: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const normalizedEmail = formData.email.trim().toLowerCase();

    try {
      // Check if email already exists in our unique tracking collection
      const emailRef = doc(db, 'unique_emails', normalizedEmail);
      const emailDoc = await getDoc(emailRef);

      if (emailDoc.exists()) {
        setError('This email is already registered. Please use another or sign in.');
        setLoading(false);
        return;
      }

      const userCredential = await createUserWithEmailAndPassword(auth, normalizedEmail, formData.password);
      const user = userCredential.user;

      await updateProfile(user, {
        displayName: formData.fullName
      });

      // Use a batch to ensure both documents are created
      const batch = writeBatch(db);

      // Save user profile to Firestore
      const userRef = doc(db, 'users', user.uid);
      batch.set(userRef, {
        role,
        fullName: formData.fullName,
        phoneNumber: formData.phoneNumber,
        whatsappNumber: formData.whatsappNumber,
        businessName: role === 'wholesaler' ? formData.businessName : null,
        shopNo: role === 'wholesaler' ? formData.shopNo : null,
        block: role === 'wholesaler' ? formData.block : null,
        joinedAt: serverTimestamp(),
        email: normalizedEmail,
        uid: user.uid
      });

      // Save unique email record
      batch.set(emailRef, {
        uid: user.uid,
        createdAt: serverTimestamp()
      });

      await batch.commit();

      navigate(role === 'wholesaler' ? '/dashboard' : '/');
    } catch (err: any) {
      console.error(err);
      setError(getAuthErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-4 bg-gray-50 py-12">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white w-full max-w-2xl rounded-3xl shadow-xl overflow-hidden border border-gray-100"
      >
        <div className="grid md:grid-cols-5 h-full">
          {/* Sidebar decorative */}
          <div className="md:col-span-2 bg-blue-600 p-8 text-white flex flex-col justify-between">
            <div className="space-y-4">
               <div className="bg-white/20 p-2 rounded-lg w-fit">
                  <Store size={24} />
               </div>
               <h2 className="text-3xl font-black">Modernizing Trade.</h2>
               <p className="text-blue-100 text-sm opacity-80 leading-relaxed">
                  Join Uganda's fastest growing wholesale network. Direct access, better records, more profit.
               </p>
            </div>
            
            <div className="space-y-6">
               <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-400 rounded-full" />
                  <p className="text-xs font-bold uppercase tracking-widest text-blue-200">Verified Sellers</p>
               </div>
               <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-400 rounded-full" />
                  <p className="text-xs font-bold uppercase tracking-widest text-blue-200">Direct Bulk Pricing</p>
               </div>
               <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-400 rounded-full" />
                  <p className="text-xs font-bold uppercase tracking-widest text-blue-200">Safe Payments</p>
               </div>
            </div>
          </div>

          {/* Form */}
          <div className="md:col-span-3 p-8 space-y-8">
            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-gray-900">Create Account</h1>
              <p className="text-gray-500 text-sm">Join the marketplace as a {role}</p>
            </div>

            {/* Role Tab */}
            <div className="flex p-1 bg-gray-100 rounded-xl">
               <button 
                 onClick={() => setRole('buyer')}
                 className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${
                   role === 'buyer' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500'
                 }`}
               >
                 <User size={16} /> Buyer
               </button>
               <button 
                 onClick={() => setRole('wholesaler')}
                 className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${
                   role === 'wholesaler' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500'
                 }`}
               >
                 <Building2 size={16} /> Wholesaler
               </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 bg-red-50 border border-red-100 text-red-600 text-xs font-medium rounded-xl">
                  {error}
                </div>
              )}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                   <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
                   <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                      <input 
                        required
                        type="text" 
                        className="w-full pl-9 pr-4 py-2 text-sm bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-blue-500" 
                        placeholder="John Doe" 
                        value={formData.fullName}
                        onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                      />
                   </div>
                </div>
                <div className="space-y-1">
                   <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Phone Number</label>
                   <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                      <input 
                        required
                        type="text" 
                        className="w-full pl-9 pr-4 py-2 text-sm bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-blue-500" 
                        placeholder="+256..." 
                        value={formData.phoneNumber}
                        onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                      />
                   </div>
                </div>
              </div>

              <div className="space-y-1">
                 <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">WhatsApp Number</label>
                 <div className="relative">
                    <MessageCircle className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input 
                      required
                      type="text" 
                      className="w-full pl-9 pr-4 py-2 text-sm bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-blue-500" 
                      placeholder="+256..." 
                      value={formData.whatsappNumber}
                      onChange={(e) => setFormData({...formData, whatsappNumber: e.target.value})}
                    />
                 </div>
              </div>

              {role === 'wholesaler' && (
                <div className="space-y-4 pt-2">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Business Name</label>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                      <input 
                        required={role === 'wholesaler'}
                        type="text" 
                        className="w-full pl-9 pr-4 py-2 text-sm bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-blue-500" 
                        placeholder="HAM GROUNDS Wholesalers" 
                        value={formData.businessName}
                        onChange={(e) => setFormData({...formData, businessName: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                       <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Shop No.</label>
                       <input 
                        required={role === 'wholesaler'}
                        type="text" 
                        className="w-full px-4 py-2 text-sm bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-blue-500" 
                        placeholder="e.g. 102" 
                        value={formData.shopNo}
                        onChange={(e) => setFormData({...formData, shopNo: e.target.value})}
                      />
                    </div>
                    <div className="space-y-1">
                       <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Block</label>
                       <input 
                        required={role === 'wholesaler'}
                        type="text" 
                        className="w-full px-4 py-2 text-sm bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-blue-500" 
                        placeholder="e.g. Block B" 
                        value={formData.block}
                        onChange={(e) => setFormData({...formData, block: e.target.value})}
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-1">
                 <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Email</label>
                 <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input 
                      required
                      type="email" 
                      className="w-full pl-9 pr-4 py-2 text-sm bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-blue-500" 
                      placeholder="name@email.com" 
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                    />
                 </div>
              </div>

              <div className="space-y-1">
                 <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Password</label>
                 <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input 
                      required
                      type="password" 
                      className="w-full pl-9 pr-4 py-2 text-sm bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-blue-500" 
                      placeholder="••••••••" 
                      value={formData.password}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                    />
                 </div>
              </div>

              <button 
                disabled={loading}
                className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 mt-4 disabled:opacity-50"
              >
                {loading ? 'Creating Account...' : 'Register Now'} <UserPlus size={18} />
              </button>
            </form>

            <div className="text-center pt-2">
              <p className="text-xs text-gray-500">
                Already have an account? {' '}
                <Link to="/login" className="text-blue-600 font-bold hover:underline">Sign In</Link>
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
