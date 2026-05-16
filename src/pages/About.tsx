import React from 'react';
import { motion } from 'motion/react';
import { Target, Users, ShieldCheck, TrendingUp, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function About() {
  return (
    <div className="pb-20">
      {/* Hero */}
      <section className="bg-blue-600 py-24 text-white text-center rounded-b-[4rem] shadow-2xl">
        <div className="max-w-4xl mx-auto px-4 space-y-6">
          <motion.h1 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-4xl md:text-6xl font-black italic tracking-tight"
          >
            Direct Trade. Digital Future.
          </motion.h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            HAM Grounds was built to solve the biggest challenges in Uganda's wholesale markets: 
            fragmented records, lack of trust, and the burden of middlemen.
          </p>
        </div>
      </section>

      {/* Origin Story */}
      <section className="max-w-7xl mx-auto px-4 py-20 grid md:grid-cols-2 gap-16 items-center">
        <div className="space-y-6">
          <h2 className="text-3xl font-bold text-gray-900 leading-tight">Born in the Heart of Kampala Traders</h2>
          <p className="text-gray-600 leading-relaxed">
            Ugandan commerce is built on hard work and relationships. However, for many years, our wholesalers 
            have struggled with paper-based ledgers and limited digital visibility. HAM Grounds bridge this gap.
          </p>
          <div className="space-y-4">
             {[
               { title: 'Reducing Middlemen', text: 'Connecting buyers directly with wholesalers to ensure the best possible pricing for everyday goods.' },
               { title: 'Digital Transformation', text: 'Providing wholesalers with simple tools to track every sale and every unit of stock.' },
               { title: 'Inclusive growth', text: 'Designed for mobile use, ensuring every trader in Kampala can access the platform regardless of tech skill.' }
             ].map((item, idx) => (
               <div key={idx} className="flex gap-4">
                  <div className="mt-1 bg-blue-100 p-1 rounded-full"><ShieldCheck size={16} className="text-blue-600" /></div>
                  <div>
                    <h4 className="font-bold text-gray-900">{item.title}</h4>
                    <p className="text-sm text-gray-500">{item.text}</p>
                  </div>
               </div>
             ))}
          </div>
        </div>
        <div className="relative">
           <img 
             src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=1000" 
             className="rounded-3xl shadow-2xl" 
             alt="Kampala Market"
             referrerPolicy="no-referrer"
           />
           <div className="absolute -bottom-6 -right-6 bg-white p-8 rounded-3xl shadow-xl border border-gray-100 max-w-[200px]">
              <p className="text-blue-600 text-3xl font-black">Verify</p>
              <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mt-1">Sellers First then Trade.</p>
           </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 text-center space-y-16">
          <h2 className="text-3xl font-bold">Our Core Pillars</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Target, title: 'Accuracy', text: 'Our digital ledger eliminates human error in calculating profits.' },
              { icon: Users, title: 'Connectivity', text: 'Bringing wholesalers from Ham Shopping Grounds to regional retailers.' },
              { icon: TrendingUp, title: 'Transparency', text: 'Real wholesale prices, no hidden fees, clear stock levels.' }
            ].map((v, idx) => (
              <div key={idx} className="bg-white p-10 rounded-3xl space-y-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto">
                   <v.icon size={32} />
                </div>
                <h3 className="text-xl font-bold">{v.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{v.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Meet the Creator */}
      <section className="max-w-7xl mx-auto px-4 py-20 text-center space-y-10">
        <div className="inline-block p-1 bg-gradient-to-tr from-blue-600 to-purple-600 rounded-[2.5rem]">
           <div className="bg-white p-12 md:p-20 rounded-[2.2rem] space-y-8">
              <div className="space-y-4">
                 <h2 className="text-sm font-black text-blue-600 uppercase tracking-[0.3em]">The Architect</h2>
                 <h3 className="text-4xl md:text-5xl font-black text-gray-900 italic">Designed by KASUMBA TREASURE</h3>
              </div>
              <p className="max-w-2xl mx-auto text-gray-500 leading-relaxed font-medium">
                HAM Grounds is the vision of Kasumba Treasure, dedicated to digitizing African commerce 
                and empowering local traders through elegant, powerful software solutions.
              </p>
           </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-5xl mx-auto px-4 py-20">
        <div className="bg-gray-900 rounded-[3rem] p-12 text-center text-white space-y-8 relative overflow-hidden">
           <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/20 blur-[100px] -translate-y-1/2" />
           <h2 className="text-4xl font-bold relative z-10">Start Growing Your Business Today</h2>
           <p className="text-gray-400 max-w-xl mx-auto relative z-10">
             Whether you are a wholesaler in Kampala or a shop owner in Gulu, HAM Grounds has the tools you need.
           </p>
           <div className="flex justify-center gap-4 relative z-10">
             <Link to="/register" className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-2 hover:bg-blue-700 transition-all">
                Create Account <ArrowRight size={20} />
             </Link>
             <Link to="/contact" className="bg-white/10 hover:bg-white/20 border border-white/20 px-8 py-4 rounded-2xl font-bold transition-all">
                Contact Sales
             </Link>
           </div>
        </div>
      </section>
    </div>
  );
}
