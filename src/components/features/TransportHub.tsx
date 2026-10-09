import React, { useState } from 'react';
import { Train, Bus, Clock, MapPin, Phone, Search, ExternalLink, ShieldCheck, Ticket, AlertCircle } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface TransportHubProps {
  onClose: () => void;
}

interface TrainSchedule {
  id: string;
  trainNameBn: string;
  trainNameEn: string;
  routeBn: string;
  routeEn: string;
  departureTime: string;
  offDay: string;
  status: 'On Time' | 'Delayed' | 'Departed';
  ticketPrice: string;
}

interface BusSchedule {
  id: string;
  operatorBn: string;
  operatorEn: string;
  routeBn: string;
  routeEn: string;
  departureTime: string;
  terminal: string;
  phone: string;
  fare: string;
}

const TRAINS: TrainSchedule[] = [
  { id: 't1', trainNameBn: 'সুন্দরবন এক্সপ্রেস (৭২৫/৭২৬)', trainNameEn: 'Sundarban Express (725/726)', routeBn: 'খুলনা ⇄ ঢাকা', routeEn: 'Khulna ⇄ Dhaka', departureTime: '০৬:০০ AM', offDay: 'মঙ্গলবার (Tuesday)', status: 'On Time', ticketPrice: '৳ ৫১৫ - ১,১১০' },
  { id: 't2', trainNameBn: 'চিত্রা এক্সপ্রেস (৭৬৩/৭৬৪)', trainNameEn: 'Chitra Express (763/764)', routeBn: 'খুলনা ⇄ ঢাকা', routeEn: 'Khulna ⇄ Dhaka', departureTime: '০৮:৪০ PM', offDay: 'সোমবার (Monday)', status: 'On Time', ticketPrice: '৳ ৫১৫ - ১,১১০' },
  { id: 't3', trainNameBn: 'কপোতাক্ষ এক্সপ্রেস (৭১৫/৭১৬)', trainNameEn: 'Kapotaksha Express (715/716)', routeBn: 'খুলনা ⇄ রাজশাহী', routeEn: 'Khulna ⇄ Rajshahi', departureTime: '০৬:১৫ AM', offDay: 'বুধবার (Wednesday)', status: 'On Time', ticketPrice: '৳ ৩৫০ - ৭৫০' },
  { id: 't4', trainNameBn: 'রূপসা এক্সপ্রেস (৭২৭/৭২৮)', trainNameEn: 'Rupsha Express (727/728)', routeBn: 'খুলনা ⇄ চিলাহাটি', routeEn: 'Khulna ⇄ Chilahati', departureTime: '০৮:০০ AM', offDay: 'নেই (None)', status: 'On Time', ticketPrice: '৳ ৩২০ - ৬৯০' },
  { id: 't5', trainNameBn: 'সীমান্ত এক্সপ্রেস (৭৪৯/৭৫০)', trainNameEn: 'Simanta Express (749/750)', routeBn: 'খুলনা ⇄ চিলাহাটি', routeEn: 'Khulna ⇄ Chilahati', departureTime: '০৯:১৫ PM', offDay: 'বৃহস্পতিবার (Thursday)', status: 'On Time', ticketPrice: '৳ ৩২০ - ৬৯০' },
  { id: 't6', trainNameBn: 'বেতনা এক্সপ্রেস (১/২)', trainNameEn: 'Betna Express (1/2)', routeBn: 'খুলনা ⇄ বেনাপোল', routeEn: 'Khulna ⇄ Benapole', departureTime: '০৭:৩০ AM & ০৪:০০ PM', offDay: 'নেই (None)', status: 'On Time', ticketPrice: '৳ ৬৫' }
];

const BUSES: BusSchedule[] = [
  { id: 'b1', operatorBn: 'গ্রিন লাইন পরিবহণ (AC)', operatorEn: 'Green Line Paribahan (AC)', routeBn: 'খুলনা ⇄ ঢাকা (সোনাডাঙ্গা)', routeEn: 'Khulna ⇄ Dhaka (Sonadanga)', departureTime: 'প্রতি ১ ঘণ্টা পর পর (Hourly)', terminal: 'সোনাডাঙ্গা বাস টার্মিনাল', phone: '01730-071100', fare: '৳ ১২০০ - ১৮০০' },
  { id: 'b2', operatorBn: 'সোহাগ পরিবহণ (AC/Non-AC)', operatorEn: 'Sohag Paribahan', routeBn: 'খুলনা ⇄ ঢাকা / চট্টগ্রাম', routeEn: 'Khulna ⇄ Dhaka / Chittagong', departureTime: 'সকাল ৭:০০ থেকে রাত ১১:০০', terminal: 'সোনাডাঙ্গা বাস টার্মিনাল', phone: '01711-456789', fare: '৳ ৯০০ - ১৫০০' },
  { id: 'b3', operatorBn: 'হানিফ এন্টারপ্রাইজ', operatorEn: 'Hanif Enterprise', routeBn: 'খুলনা ⇄ রাজশাহী / সিলেট / চট্টগ্রাম', routeEn: 'Khulna ⇄ Rajshahi / Sylhet', departureTime: 'সারাদিন নিয়মিত (Regular)', terminal: 'সোনাডাঙ্গা বাস টার্মিনাল', phone: '01819-223344', fare: '৳ ৬০০ - ১২০০' },
  { id: 'b4', operatorBn: 'টুঙ্গিপাড়া এক্সপ্রেস', operatorEn: 'Tungipara Express', routeBn: 'খুলনা ⇄ গোপালগঞ্জ ⇄ ঢাকা', routeEn: 'Khulna ⇄ Gopalganj ⇄ Dhaka', departureTime: 'প্রতি ৩০ মিনিট পর পর', terminal: 'সোনাডাঙ্গা ও জিরো পয়েন্ট', phone: '01911-889900', fare: '৳ ৫৫০ - ৯০০' },
  { id: 'b5', operatorBn: 'ঈগল পরিবহণ', operatorEn: 'Eagle Paribahan', routeBn: 'খুলনা ⇄ বরিশাল ⇄ চট্টগ্রাম', routeEn: 'Khulna ⇄ Barishal ⇄ Chittagong', departureTime: 'সকাল ৮:০০ ও রাত ১০:০০', terminal: 'সোনাডাঙ্গা বাস টার্মিনাল', phone: '01712-334455', fare: '৳ ৭০০ - ১৩০০' }
];

export const TransportHub: React.FC<TransportHubProps> = ({ onClose }) => {
  const { lang } = useLanguage();
  const isBn = lang === 'bn';
  const [activeTab, setActiveTab] = useState<'train' | 'bus' | 'counters'>('train');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTrains = TRAINS.filter(t => 
    t.trainNameBn.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.trainNameEn.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.routeBn.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredBuses = BUSES.filter(b => 
    b.operatorBn.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.operatorEn.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.routeBn.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden border border-emerald-500/20">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-700 p-6 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-md">
              <Train className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-bold">
                {isBn ? 'খুলনা ট্রেন ও বাস শিডিউল হাব' : 'Khulna Train & Bus Schedule Hub'}
              </h2>
              <p className="text-xs md:text-sm text-emerald-100">
                {isBn ? 'সকল আন্তঃনগর ট্রেন, বাস ও লাইভ টিকেট কাউন্টার তথ্য' : 'All intercity trains, buses & live counter details'}
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition font-bold text-lg"
          >
            ✕
          </button>
        </div>

        {/* Subheader tabs & Search */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="flex bg-slate-200 dark:bg-slate-700 p-1 rounded-xl w-full sm:w-auto">
            <button
              onClick={() => setActiveTab('train')}
              className={`flex-1 sm:flex-initial px-4 py-2 rounded-lg text-sm font-semibold transition flex items-center justify-center gap-2 ${
                activeTab === 'train' 
                  ? 'bg-emerald-600 text-white shadow-md' 
                  : 'text-slate-600 dark:text-slate-300 hover:text-emerald-600'
              }`}
            >
              <Train className="w-4 h-4" />
              {isBn ? 'রেলওয়ে শিডিউল' : 'Train Schedule'}
            </button>
            <button
              onClick={() => setActiveTab('bus')}
              className={`flex-1 sm:flex-initial px-4 py-2 rounded-lg text-sm font-semibold transition flex items-center justify-center gap-2 ${
                activeTab === 'bus' 
                  ? 'bg-emerald-600 text-white shadow-md' 
                  : 'text-slate-600 dark:text-slate-300 hover:text-emerald-600'
              }`}
            >
              <Bus className="w-4 h-4" />
              {isBn ? 'বাস শিডিউল' : 'Bus Schedule'}
            </button>
            <button
              onClick={() => setActiveTab('counters')}
              className={`flex-1 sm:flex-initial px-4 py-2 rounded-lg text-sm font-semibold transition flex items-center justify-center gap-2 ${
                activeTab === 'counters' 
                  ? 'bg-emerald-600 text-white shadow-md' 
                  : 'text-slate-600 dark:text-slate-300 hover:text-emerald-600'
              }`}
            >
              <Ticket className="w-4 h-4" />
              {isBn ? 'কাউন্টার ডিরেক্টরি' : 'Counter Directory'}
            </button>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder={isBn ? 'ট্রেন বা বাস খুঁজুন...' : 'Search train or bus...'}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4">
          {activeTab === 'train' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredTrains.map((train) => (
                <div key={train.id} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 shadow-sm hover:shadow-md transition flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-bold text-slate-900 dark:text-white text-base">
                        {isBn ? train.trainNameBn : train.trainNameEn}
                      </h3>
                      <span className="px-2.5 py-1 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 rounded-full text-xs font-semibold">
                        {train.status}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-300 mt-1 flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-emerald-500" />
                      {isBn ? train.routeBn : train.routeEn}
                    </p>
                    <div className="mt-3 grid grid-cols-2 gap-2 text-xs bg-slate-50 dark:bg-slate-900/50 p-3 rounded-xl">
                      <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                        <Clock className="w-3.5 h-3.5 text-emerald-500" />
                        <span>{isBn ? 'প্রস্থান:' : 'Dep:'} <strong className="text-slate-900 dark:text-white">{train.departureTime}</strong></span>
                      </div>
                      <div className="text-slate-600 dark:text-slate-400">
                        <span>{isBn ? 'সাপ্তাহিক বন্ধ:' : 'Off day:'} <strong className="text-red-500">{train.offDay}</strong></span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                      {isBn ? 'ভাড়া: ' : 'Fare: '}{train.ticketPrice}
                    </span>
                    <a
                      href="https://eticket.railway.gov.bd"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1 transition shadow-sm"
                    >
                      {isBn ? 'অনলাইন টিকেট' : 'Buy Ticket'}
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'bus' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredBuses.map((bus) => (
                <div key={bus.id} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 shadow-sm hover:shadow-md transition flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white text-base">
                      {isBn ? bus.operatorBn : bus.operatorEn}
                    </h3>
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-300 mt-1 flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-emerald-500" />
                      {isBn ? bus.routeBn : bus.routeEn}
                    </p>
                    <div className="mt-3 space-y-1.5 text-xs bg-slate-50 dark:bg-slate-900/50 p-3 rounded-xl">
                      <p className="text-slate-600 dark:text-slate-400">
                        {isBn ? 'টার্মিনাল:' : 'Terminal:'} <strong className="text-slate-900 dark:text-white">{bus.terminal}</strong>
                      </p>
                      <p className="text-slate-600 dark:text-slate-400">
                        {isBn ? 'সময়:' : 'Time:'} <strong className="text-slate-900 dark:text-white">{bus.departureTime}</strong>
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                      {bus.fare}
                    </span>
                    <a
                      href={`tel:${bus.phone}`}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1 transition shadow-sm"
                    >
                      <Phone className="w-3 h-3" />
                      {bus.phone}
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'counters' && (
            <div className="space-y-4">
              <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-2xl p-4 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <p className="text-xs md:text-sm text-emerald-800 dark:text-emerald-300">
                  {isBn 
                    ? 'খুলনা সোনাডাঙ্গা বাস টার্মিনাল ও খুলনা রেলওয়ে স্টেশন থেকে ২৪ ঘণ্টা দেশের যেকোনো প্রান্তে যাতায়াতের টিকিট সংগ্রহ করা যায়।'
                    : 'Tickets to all destinations across the country are available 24/7 from Khulna Sonadanga Bus Terminal and Khulna Railway Station.'}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700">
                  <h4 className="font-bold text-slate-900 dark:text-white text-base mb-1">
                    {isBn ? 'খুলনা রেলওয়ে স্টেশন' : 'Khulna Railway Station'}
                  </h4>
                  <p className="text-xs text-slate-500 mb-3">{isBn ? 'স্টেশন রোড, খুলনা' : 'Station Road, Khulna'}</p>
                  <a href="tel:041-721444" className="text-emerald-600 dark:text-emerald-400 text-xs font-bold flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5" /> 041-721444
                  </a>
                </div>

                <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700">
                  <h4 className="font-bold text-slate-900 dark:text-white text-base mb-1">
                    {isBn ? 'সোনাডাঙ্গা কেন্দ্রীয় বাস টার্মিনাল' : 'Sonadanga Central Bus Terminal'}
                  </h4>
                  <p className="text-xs text-slate-500 mb-3">{isBn ? 'সোনাডাঙ্গা, খুলনা' : 'Sonadanga, Khulna'}</p>
                  <a href="tel:041-731222" className="text-emerald-600 dark:text-emerald-400 text-xs font-bold flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5" /> 041-731222
                  </a>
                </div>

                <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700">
                  <h4 className="font-bold text-slate-900 dark:text-white text-base mb-1">
                    {isBn ? 'রূপসা বাস কাউন্টার' : 'Rupsha Bus Counter'}
                  </h4>
                  <p className="text-xs text-slate-500 mb-3">{isBn ? 'রূপসা মোড়, খুলনা' : 'Rupsha Moor, Khulna'}</p>
                  <a href="tel:041-762333" className="text-emerald-600 dark:text-emerald-400 text-xs font-bold flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5" /> 041-762333
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 text-center text-xs text-slate-500">
          {isBn ? 'স্মার্ট খুলনা ডিজিটাল ট্রান্সপোর্ট সার্ভিস • হালনাগাদ শিডিউল' : 'Smart Khulna Digital Transport Service • Updated Schedule'}
        </div>
      </div>
    </div>
  );
};
