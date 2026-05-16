import React from 'react';
import { motion } from 'motion/react';
import { MessageSquare, Calendar, Store, ArrowRight, HelpCircle } from 'lucide-react';

const MOCK_INQUIRIES = [
  {
    id: '1',
    to: 'Ham General Traders',
    message: 'Do you have volume discounts for 100 cases of soda?',
    status: 'Replied',
    date: '2024-05-12'
  },
  {
    id: '2',
    to: 'Kikuubo Wholesalers',
    message: 'When will you restock the 50kg bags of sugar?',
    status: 'Pending',
    date: '2024-05-15'
  }
];

export default function Inquiries() {
  return (
    <div className="space-y-10 pb-20">
      <div>
        <h1 className="text-2xl font-black text-gray-900">My Inquiries</h1>
        <p className="text-gray-500 tracking-tight">Direct messages and questions sent to wholesalers.</p>
      </div>

      <div className="grid gap-6">
        {MOCK_INQUIRIES.map((inquiry) => (
          <motion.div
            key={inquiry.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-[2.5rem] border border-gray-100 p-8 shadow-sm hover:shadow-xl hover:shadow-blue-500/5 transition-all"
          >
            <div className="flex flex-col md:flex-row justify-between gap-6">
              <div className="space-y-4 flex-1">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-50 text-blue-600 p-2 rounded-xl">
                    <Store size={18} />
                  </div>
                  <h3 className="font-bold text-gray-900">{inquiry.to}</h3>
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                    inquiry.status === 'Replied' ? 'bg-green-50 text-green-600' : 'bg-amber-50 text-amber-600'
                  }`}>
                    {inquiry.status}
                  </span>
                </div>
                <p className="text-gray-600 font-medium leading-relaxed italic">"{inquiry.message}"</p>
              </div>

              <div className="flex items-end justify-between md:flex-col md:justify-between md:items-end border-t md:border-t-0 md:border-l border-gray-50 pt-4 md:pt-0 md:pl-8">
                <div className="flex items-center gap-2 text-gray-400">
                  < Calendar size={14} />
                  <span className="text-xs font-bold">{inquiry.date}</span>
                </div>
                <button className="text-blue-600 text-sm font-black flex items-center gap-2 hover:gap-3 transition-all">
                  View Thread <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </motion.div>
        ))}

        {MOCK_INQUIRIES.length === 0 && (
          <div className="bg-white rounded-[2.5rem] border border-gray-100 p-20 text-center space-y-6 text-gray-400">
             <MessageSquare size={48} className="mx-auto opacity-20" />
             <p className="font-bold uppercase tracking-widest text-xs">No active inquiries</p>
          </div>
        )}
      </div>

      {/* Admin Support Callout */}
      <section className="bg-gray-50 p-8 rounded-[2.5rem] border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4 text-center md:text-left">
           <div className="p-3 bg-blue-100 text-blue-600 rounded-2xl">
              <HelpCircle size={24} />
           </div>
           <div>
              <h4 className="font-black text-gray-900">Technical Issue?</h4>
              <p className="text-xs text-gray-500 font-medium tracking-tight">Report bugs or account issues to our Admin team immediately.</p>
           </div>
        </div>
        <div className="flex items-center gap-2">
           <a href="mailto:treasurekasumba47@gmail.com" className="bg-white text-gray-900 border border-gray-200 px-6 py-3 rounded-2xl text-xs font-black shadow-sm hover:bg-gray-50 transition-all">
             Email Admin
           </a>
           <a href="https://wa.me/256750619853" target="_blank" rel="noreferrer" className="bg-green-600 text-white px-6 py-3 rounded-2xl text-xs font-black shadow-lg shadow-green-500/20 hover:bg-green-700 transition-all">
             WhatsApp Admin
           </a>
        </div>
      </section>
    </div>
  );
}
