'use client';

import { useState } from 'react';
import { Lock, CheckCircle, Star, Calendar } from 'lucide-react';
import PayPalCheckout from './PayPalCheckout';

interface PaywallModalProps {
  onSubscribe: () => void;
}

export default function PaywallModal({ onSubscribe }: PaywallModalProps) {
  const [isSuccess, setIsSuccess] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<'weekly' | 'monthly'>('monthly'); // Default to Monthly for upsell

  // Pricing Configuration
  const plans = {
    weekly: {
      price: "4.99",
      name: "Weekly Rescue",
      label: "7-Day Pass",
      desc: "Flexible. Good for short-term relief.",
      savings: null
    },
    monthly: {
      price: "17.99",
      name: "Monthly Healing",
      label: "30-Day Pass",
      desc: "Deep transformation journey.",
      savings: "Save $2.00 vs weekly" // Visual psychological trigger
    }
  };

  const handlePaymentSuccess = () => {
    setIsSuccess(true);
    setTimeout(() => {
        onSubscribe();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
       {/* Dark Overlay */}
       <div className="absolute inset-0 bg-black/90 backdrop-blur-sm animate-in fade-in duration-500" />

       <div className="relative bg-[#0a0a0a] border border-white/10 rounded-[2rem] max-w-md w-full shadow-[0_0_60px_rgba(245,158,11,0.15)] animate-in zoom-in-95 duration-300 overflow-hidden">
         
         {/* Top Decoration */}
         <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent opacity-50" />

         <div className="p-8">
           
           {/* === SUCCESS STATE === */}
           {isSuccess ? (
             <div className="flex flex-col items-center justify-center py-10 space-y-6 text-center animate-in fade-in zoom-in">
               <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center border border-green-500/30">
                 <CheckCircle className="w-10 h-10 text-green-500" />
               </div>
               <div>
                 <h3 className="text-2xl font-serif text-white mb-2">Connection Unlocked</h3>
                 <p className="text-white/50">Returning to your soul session...</p>
               </div>
             </div>
           ) : (
             // === SELECTION STATE ===
             <>
               {/* Header */}
               <div className="text-center mb-8">
                 <div className="inline-flex items-center gap-2 text-amber-500 mb-2 bg-amber-900/20 px-3 py-1 rounded-full border border-amber-500/20">
                    <Lock className="w-3 h-3" />
                    <span className="text-xs font-medium tracking-wide uppercase">Premium Access</span>
                 </div>
                 <h3 className="font-serif text-2xl text-white mb-2">
                   Continue Your Journey
                 </h3>
                 <p className="text-white/50 text-sm">
                   Haru is ready to guide you deeper. Choose your path.
                 </p>
               </div>

               {/* PLAN SELECTION CARDS */}
               <div className="space-y-3 mb-6">
                  
                   {/* OPTION 1: WEEKLY */}
                   <button 
                     onClick={() => setSelectedPlan('weekly')} 
                     className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all duration-300 relative group 
                       ${selectedPlan === 'weekly' 
                         ? 'bg-white/10 border-amber-500/50 shadow-[0_0_20px_rgba(245,158,11,0.1)]' 
                         : 'bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/10' 
                       } 
                     `} 
                   >
                     <div className="flex items-center gap-3">
                         <div className={`w-5 h-5 rounded-full border flex items-center justify-center 
                             ${selectedPlan === 'weekly' ? 'border-amber-500' : 'border-white/30'} 
                         `}>
                             {selectedPlan === 'weekly' && <div className="w-2.5 h-2.5 bg-amber-500 rounded-full" />}
                         </div>
                         <div className="text-left">
                             <p className="text-white font-medium text-sm">Weekly Rescue</p>
                             <p className="text-white/40 text-xs">$0.71 / day</p>
                         </div>
                     </div>
                     <div className="text-right">
                         <p className="text-white font-serif text-lg">$4.99</p>
                         <p className="text-white/30 text-xs">/ week</p>
                     </div>
                   </button>

                   {/* OPTION 2: MONTHLY (HIGHLIGHTED) */}
                   <button 
                     onClick={() => setSelectedPlan('monthly')} 
                     className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all duration-300 relative 
                       ${selectedPlan === 'monthly' 
                         ? 'bg-gradient-to-r from-amber-900/40 to-black border-amber-500 shadow-[0_0_30px_rgba(245,158,11,0.15)]' 
                         : 'bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/10' 
                       } 
                     `} 
                   >
                     {/* Badge */}
                     <div className="absolute -top-3 right-4 bg-amber-500 text-black text-[10px] font-bold px-2 py-0.5 rounded-full shadow-lg">
                         BEST VALUE
                     </div>

                     <div className="flex items-center gap-3">
                         <div className={`w-5 h-5 rounded-full border flex items-center justify-center 
                             ${selectedPlan === 'monthly' ? 'border-amber-500' : 'border-white/30'} 
                         `}>
                             {selectedPlan === 'monthly' && <div className="w-2.5 h-2.5 bg-amber-500 rounded-full" />}
                         </div>
                         <div className="text-left">
                             <p className="text-white font-medium text-sm">Monthly Healing</p>
                             <p className="text-amber-200/70 text-xs">Save $2.00 vs weekly</p>
                         </div>
                     </div>
                     <div className="text-right">
                         <p className="text-amber-400 font-serif text-xl">$17.99</p>
                         <p className="text-white/30 text-xs">/ month</p>
                     </div>
                   </button>

                </div>
               
               {/* Dynamic PayPal Button */}
               <div className="animate-in fade-in slide-in-from-bottom-2 duration-500" key={selectedPlan}>
                  <PayPalCheckout 
                    amount={plans[selectedPlan].price} 
                    planName={plans[selectedPlan].name} 
                    onSuccess={handlePaymentSuccess} 
                  />
               </div>
             </>
           )}
           
         </div>
       </div>
    </div>
  );
}
