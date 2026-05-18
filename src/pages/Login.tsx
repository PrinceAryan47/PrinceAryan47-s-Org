import React, { useState } from 'react';
import { Mail, Lock, LogIn, Store, User, MessageCircle, Phone, Eye, EyeOff } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { auth, db } from '../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { getAuthErrorMessage } from '../lib/authUtils';
import { useTranslation } from 'react-i18next';

export default function Login() {
  const { t } = useTranslation();
  const [role, setRole] = useState<'buyer' | 'wholesaler'>('buyer');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, formData.email.trim(), formData.password);
      const user = userCredential.user;

      // Verify role
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        if (userData.role !== role) {
           // Basic role check - in a real app you might allow crossover or just redirect accordingly
           // For this app, we'll just redirect to the appropriate place
           navigate(userData.role === 'wholesaler' ? '/dashboard' : '/');
           return;
        }
      }

      navigate(role === 'wholesaler' ? '/dashboard' : '/');
    } catch (err: any) {
      console.error(err);
      setError(t(getAuthErrorMessage(err)));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-4 bg-gray-50">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white w-full max-w-md rounded-3xl shadow-xl overflow-hidden border border-gray-100"
      >
        <div className="p-8 space-y-8">
          <div className="text-center space-y-2">
            <div className="flex justify-center mb-4">
               <div className="bg-blue-600 p-3 rounded-2xl shadow-lg shadow-blue-500/20">
                  <Store className="text-white" size={32} />
               </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900">{t('auth.welcome_back')}</h1>
            <p className="text-gray-500 text-sm">{t('auth.subtitle')}</p>
          </div>

          {/* Role Toggle */}
          <div className="flex p-1 bg-gray-100 rounded-xl">
             <button 
               onClick={() => setRole('buyer')}
               className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-bold rounded-lg transition-all ${
                 role === 'buyer' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500'
               }`}
             >
               <User size={16} />
               Buyer
             </button>
             <button 
               onClick={() => setRole('wholesaler')}
               className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-bold rounded-lg transition-all ${
                 role === 'wholesaler' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500'
               }`}
             >
               <Store size={16} />
               Wholesaler
             </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 bg-red-50 border border-red-100 text-red-600 text-xs font-medium rounded-xl">
                {error}
              </div>
            )}
            <div className="space-y-2">
               <label className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-1">{t('auth.email_addr')}</label>
               <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input 
                    required
                    type="email" 
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                    placeholder={t('auth.enter_email')}
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
               </div>
            </div>

            <div className="space-y-2">
               <div className="flex justify-between items-center px-1">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">{t('auth.password')}</label>
                  <button type="button" className="text-xs font-bold text-blue-600 hover:underline">{t('auth.forgot')}</button>
               </div>
               <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input 
                    required
                    type={showPassword ? "text" : "password"} 
                    className="w-full pl-10 pr-12 py-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                    placeholder={t('auth.enter_password')}
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600 transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
               </div>
            </div>

            <button 
              disabled={loading}
              className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 active:scale-95 duration-200 disabled:opacity-50"
            >
              {loading ? t('auth.signing_in') : t('auth.signin')} <LogIn size={20} />
            </button>
          </form>

          <div className="grid grid-cols-2 gap-4 py-2">
             <div className="p-3 bg-blue-50 rounded-2xl border border-blue-100 flex flex-col items-center gap-1 text-center">
                <Phone className="text-blue-600" size={16} />
                <p className="text-[10px] font-bold text-blue-900">+256 700 000000</p>
                <p className="text-[8px] text-blue-400 uppercase font-black tracking-tighter">Support Line</p>
             </div>
             <div className="p-3 bg-green-50 rounded-2xl border border-green-100 flex flex-col items-center gap-1 text-center cursor-pointer hover:bg-green-100 transition-all">
                <MessageCircle className="text-green-600" size={16} />
                <p className="text-[10px] font-bold text-green-900">+256 700 000000</p>
                <p className="text-[8px] text-green-400 uppercase font-black tracking-tighter">WhatsApp Us</p>
             </div>
          </div>

          <div className="text-center pt-4">
            <p className="text-sm text-gray-500">
              {t('auth.no_account')} {' '}
              <Link to="/register" className="text-blue-600 font-bold hover:underline">{t('auth.join_marketplace')}</Link>
            </p>
          </div>
        </div>

        <div className="bg-gray-50 p-6 text-center border-t border-gray-100">
            <p className="text-xs text-gray-400 font-medium leading-relaxed">
               {t('auth.terms_agree')}
            </p>
        </div>
      </motion.div>
    </div>
  );
}
