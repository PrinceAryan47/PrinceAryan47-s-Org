import React from 'react';
import { Mail, Phone, MapPin, Send, MessageSquare, HelpCircle, Store, ShieldCheck } from 'lucide-react';
import { motion } from 'motion/react';

export default function Contact() {
  return (
    <div className="pb-20">
      <section className="max-w-7xl mx-auto px-4 py-20 grid lg:grid-cols-2 gap-16">
        <div className="space-y-10">
          <div className="space-y-4">
             <h1 className="text-4xl md:text-5xl font-black text-gray-900">Get in Touch</h1>
             <p className="text-lg text-gray-500 max-w-lg">
                Have questions about becoming a wholesaler? Need help with your orders? Our team at Hammer Grounds is ready to support you.
             </p>
          </div>

          <div className="space-y-6">
            <div className="flex items-start gap-4 p-6 bg-white border border-gray-100 rounded-3xl shadow-sm">
               <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                  <MapPin size={24} />
               </div>
               <div>
                  <h4 className="font-bold text-gray-900">Our Office</h4>
                  <p className="text-sm text-gray-500">Ham Shopping Grounds, Level 3, Wing A</p>
                  <p className="text-sm text-gray-500">Kampala, Uganda</p>
               </div>
            </div>

            <div className="flex items-start gap-4 p-6 bg-white border border-gray-100 rounded-3xl shadow-sm">
               <div className="p-3 bg-green-50 text-green-600 rounded-xl">
                  <Phone size={24} />
               </div>
               <div>
                  <h4 className="font-bold text-gray-900">Call Us</h4>
                  <p className="text-sm text-gray-500">Main Line: +256 700 000 000</p>
                  <p className="text-sm text-gray-500">Seller Support: +256 701 000 000</p>
               </div>
            </div>

            <div className="flex items-start gap-4 p-6 bg-white border border-gray-100 rounded-3xl shadow-sm">
               <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
                  <Mail size={24} />
               </div>
               <div>
                  <h4 className="font-bold text-gray-900">Email</h4>
                  <p className="text-sm text-gray-500">General: info@hamgrounds.ug</p>
                  <p className="text-sm text-gray-500">Sales: sales@hamgrounds.ug</p>
               </div>
            </div>
          </div>
        </div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white p-8 md:p-12 rounded-[3.5rem] border border-gray-100 shadow-2xl space-y-8"
        >
          <div className="flex items-center gap-3 text-blue-600">
             <MessageSquare size={24} />
             <h2 className="text-2xl font-bold text-gray-900">Send us a Message</h2>
          </div>

          <form className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
               <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-1">Full Name</label>
                  <input type="text" className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium" placeholder="Your name" />
               </div>
               <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-1">Phone Number</label>
                  <input type="text" className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium" placeholder="+256..." />
               </div>
            </div>

            <div className="space-y-2">
               <label className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-1">Inquiry Type</label>
               <select className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium bg-white">
                  <option>Wholesaler Registration</option>
                  <option>Buyer Support</option>
                  <option>Technical Issue</option>
                  <option>Partnership Inquiry</option>
               </select>
            </div>

            <div className="space-y-2">
               <label className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-1">Message</label>
               <textarea rows={4} className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium" placeholder="How can we help?"></textarea>
            </div>

            <button className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 active:scale-95">
              Send Message <Send size={20} />
            </button>
          </form>
        </motion.div>
      </section>

      {/* Helpful Links */}
      <section className="max-w-7xl mx-auto px-4 pb-20">
          <div className="bg-gray-50 p-10 rounded-[3.5rem] border border-gray-100 grid md:grid-cols-2 lg:grid-cols-4 gap-8">
             {[
               { icon: HelpCircle, title: 'FAQs', desc: 'Browse common questions and answers.' },
               { icon: MessageSquare, title: 'Chat Support', desc: 'Real-time help from our team.' },
               { icon: Store, title: 'Seller Guides', desc: 'Learn how to maximize your sales.' },
               { icon: ShieldCheck, title: 'Verification', desc: 'How we verify wholesalers.' }
             ].map((item, idx) => (
               <div key={idx} className="space-y-3 p-4 bg-white rounded-3xl border border-gray-100 hover:border-blue-200 transition-all cursor-pointer group">
                  <div className="text-blue-600 group-hover:scale-110 transition-transform"><item.icon size={24} /></div>
                  <h4 className="font-bold text-gray-900">{item.title}</h4>
                  <p className="text-xs text-gray-500">{item.desc}</p>
               </div>
             ))}
          </div>
      </section>
    </div>
  );
}
