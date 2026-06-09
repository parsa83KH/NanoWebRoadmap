import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Lock, 
  CheckCircle2, 
  ArrowLeft, 
  ArrowDown, 
  Sparkles, 
  Layers,
  Compass,
  Zap,
  HelpCircle,
  Network,
  Database,
  Smartphone,
  Laptop,
  Globe,
  MessageSquare,
  CreditCard,
  Bell,
  Activity,
  Server,
  Key
} from 'lucide-react';
import { CHUNKS_DATA, ChunkPage, TaskItem } from './data';

export default function App() {
  const [activePageId, setActivePageId] = useState<number>(1);
  const [selectedTaskIndex, setSelectedTaskIndex] = useState<number>(0);
  const [activeScenario, setActiveScenario] = useState<string>('otp');
  const [diagramTab, setDiagramTab] = useState<'topology' | 'erd' | 'flow'>('topology');
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const [selectedFlowNode, setSelectedFlowNode] = useState<string | null>(null);

  const scenarios: Record<string, {
    title: string;
    description: string;
    activeNodes: string[];
    steps: string[];
  }> = {
    otp: {
      title: 'چرخه ورود پیامک رمز یکبار مصرف (SMS OTP Log-in)',
      description: 'درخواست ورود کاربر ➜ ساخت کد موقت در ردیس ➜ ارسال از طریق وب‌سرویس مخابرات (SMS Gateway) ➜ تایید کلاینت و ست شدن کوکی‌های مقتدر.',
      activeNodes: ['patient-spa', 'fastapi', 'redis', 'sms-provider', 'postgresql'],
      steps: [
        '۱. بیمار شماره موبایل خود را در پورتال نتایج وارد می‌کند.',
        '۲. سرور FastAPI کد ۶ رقمی تصادفی تولید کرده و هش آن را با طول عمر ۵ دقیقه در ردیس کلاستر می‌کند.',
        '۳. درخواست ارسال پیامک به وب‌سرویس مخابرات (SMS Gateway) فوروارد شده و کد به گوشی کاربر ارسال می‌شود.',
        '۴. بیمار کد را وارد کرده، سرور آن را با ردیس مطابقت داده و کوکی فوق امن httpOnly سشن را امضا و مستقر می‌سازد.'
      ]
    },
    booking: {
      title: 'پذیریش و اعزام هوم‌کالکت کارپوشه (At-Home Booking & Dispatch)',
      description: 'ثبت و پرداخت نوبت توسط بیمار ➜ فعال شدن زنگوله نوتیفیکیشن پذیرش ➜ انتساب نمونه‌گیر منزل ➜ مانیتور زنده وضعیت اعزام و کیت.',
      activeNodes: ['patient-spa', 'fastapi', 'postgresql', 'admin-panel', 'mobile-collector'],
      steps: [
        '۱. بیمار یک تست تشخیصی را به همراه لوکیشن یاب برای نمونه‌گیری در منزل ثبت و رزرو می‌کند.',
        '۲. متغیر درخواست جدید فوراً زنگوله نوتیفیکیشن مابین پرسنل پذیرش (Receptionist) در پنل اداری یکپارچه را قرمز می‌کند.',
        '۳. متصدی پرونده را تایید کرده و یک کارشناس فعال نمونه‌گیری حضوری را جهت حضور در منزل بیمار منتسب می‌سازد.',
        '۴. اپلیکیشن موبایل پرسنل نمونه‌گیر در محل کار، مأموریت جدید را به همراه شماره تلفن و لوکیشن دقیق از دیتابیس بارگیری می‌کند.'
      ]
    },
    payment: {
      title: 'پرداخت امن تراکنش زرین‌پال (Zarinpal Checkout flow)',
      description: 'تولید شناسه فاکتور مقتدر ➜ ریدایرکت بیمار به زرین‌پال ➜ وریفای مطمئن برگشت با کد تراکنش دوطرفه ضد تقلب.',
      activeNodes: ['patient-spa', 'fastapi', 'postgresql', 'zarinpal', 'admin-panel'],
      steps: [
        '۱. کلاینت در انتهای فلو ثبت نوبت، درخواست فاکتور آنلاین مطمئن ارسال می‌کند.',
        '۲. سرور FastAPI شناسه مجزا ایجاد کرده و بیمار را به درگاه شبیه‌ساز یا واقعی زرین‌پال متصل می‌سازد.',
        '۳. پس از تسویه، بیمار با کد رهگیری به سایت نانو بازمی‌گردد و آدرس Callback سریع به روت تایید سرور ضربه می‌زند.',
        '۴. سرور مبلغ تراکنش را بررسی مجدد کرده (بررسی ضدتقلب) و ممیزی پرداخت در لایه اداری را به موفق تبدیل می‌کند.'
      ]
    },
    prescription: {
      title: 'نسخه‌نویسی الکترونیکی پزشکان همکار (Doctor Test Order Entry)',
      description: 'ورود پزشک با کدنظام پزشکی ➜ جستجوی سریع بیمار ➜ ثبت ملزومات آزمایش ➜ انتقال مستقیم به کارتابل پذیرش حضوری.',
      activeNodes: ['doctor-portal', 'fastapi', 'postgresql', 'admin-panel'],
      steps: [
        '۱. پزشک با رمز عبور مجزا ثبت شده در دیتابیس و کدنظام کاربری وارد پرتال اختصاصی خود می‌شود.',
        '۲. بیمار مورد نظر را در دیتابیس جستجو کرده و لیست تست‌های تشخیصی و توضیحات را در قالب نسخه دیجیتالی ثبت می‌کند.',
        '۳. درخواست در قالب پرونده تحت وضعیت submitted به کارتابل پذیرش حضوری ارسال می‌شود.',
        '۴. در اولین مراجعه حضوری بیمار، متصدی پذیرش با یک کلیک نسخه از پیش تعریف‌شده پزشک را بدون فوت وقت پیوند و نمونه‌گیری می‌کند.'
      ]
    }
  };

  const nodesLayout = (n: { id: string; label: string; desc: string; icon: any }) => {
    const sData = scenarios[activeScenario as keyof typeof scenarios];
    const isActNode = sData ? sData.activeNodes.includes(n.id) : false;
    
    return (
      <div 
        key={n.id}
        className={`p-3.5 rounded-xl border text-right transition-all flex flex-col gap-1.5 relative ${
          isActNode 
            ? 'bg-amber-500/10 border-amber-500/80 shadow-[0_0_15px_rgba(245,158,11,0.15)] ring-1 ring-amber-500/30 font-bold' 
            : 'bg-[#101014] border-zinc-850 opacity-60 hover:opacity-100'
        }`}
      >
        <div className="flex items-center gap-2">
          <n.icon size={15} className={isActNode ? 'text-amber-400 animate-pulse' : 'text-zinc-500'} />
          <h6 className={`text-xs font-bold ${isActNode ? 'text-zinc-100' : 'text-zinc-400'}`}>{n.label}</h6>
        </div>
        <p className="text-[10px] text-zinc-400 leading-relaxed font-sans mt-0.5">{n.desc}</p>
        
        {isActNode && (
          <div className="absolute top-2 left-2 flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
          </div>
        )}
      </div>
    );
  };

  // If page changes, reset selected task index to 0
  const handlePageChange = (id: number) => {
    setActivePageId(id);
    setSelectedTaskIndex(0);
  };

  const currentPage = CHUNKS_DATA.find(p => p.id === activePageId) || CHUNKS_DATA[0];
  const activeTask: TaskItem | undefined = currentPage.tasks[selectedTaskIndex];

  return (
    <div className="min-h-screen bg-[#08080a] text-zinc-300 font-sans antialiased overflow-x-hidden selection:bg-amber-500 selection:text-black leading-normal pb-16" dir="rtl">
      
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute top-64 left-1/4 w-[400px] h-[400px] bg-zinc-700/5 rounded-full blur-3xl pointer-events-none"></div>

      {/* Simplified, polished sticky header with top-bar page selector */}
      <header className="border-b border-zinc-800 bg-[#0c0c0f]/90 sticky top-0 backdrop-blur-md z-40 px-4 md:px-8">
        <div className="max-w-6xl mx-auto h-16 flex items-center justify-between gap-4">
          
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded bg-amber-500 flex items-center justify-center shadow shadow-amber-500/20">
              <span className="text-black font-black text-xs">NL</span>
            </div>
            <div>
              <h1 className="text-xs sm:text-sm font-bold text-zinc-100">نقشه پایه‌ریزی آزمایشگاه نانو</h1>
              <span className="text-[10px] text-zinc-400 font-medium block">توسعه گام به گام ۱۲ فایل برنامه‌نویسی</span>
            </div>
          </div>

          {/* Compact Top-Bar Selector */}
          <div className="flex items-center gap-1 sm:gap-2">
            <span className="text-[11px] text-zinc-400 font-medium hidden md:inline">گام جاری:</span>
            <select
              value={activePageId}
              onChange={(e) => handlePageChange(Number(e.target.value))}
              className="bg-[#121217] text-zinc-100 text-xs font-bold rounded-lg border border-zinc-850 px-2.5 py-1.5 focus:outline-none focus:border-amber-500 cursor-pointer w-[140px] sm:w-[220px]"
            >
              {CHUNKS_DATA.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.status === 'active' ? '🔓 ' : '🔒 '}
                  {p.title.split(':')[0]}
                </option>
              ))}
            </select>
          </div>

        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-4xl mx-auto px-4 mt-8 space-y-6">

        {/* Dynamic content view */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activePageId}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className="space-y-6"
          >
            {/* Header / Intro card */}
            <div className="bg-[#0f0f13] border border-zinc-850 rounded-2xl p-6 md:p-8 space-y-3 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl pointer-events-none"></div>
              
              <div className="flex items-center gap-2">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  currentPage.status === 'active' 
                    ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' 
                    : 'bg-zinc-800 text-zinc-500'
                }`}>
                  {currentPage.status === 'active' ? 'گام فعال شده' : 'در انتظار دریافت اطلاعات'}
                </span>
                <span className="text-xs text-zinc-500">فایل {currentPage.id} از ۱۲</span>
              </div>

              <h2 className="text-xl md:text-2xl font-black text-zinc-100">{currentPage.title}</h2>
              <p className="text-xs text-zinc-400 leading-relaxed text-justify mt-1">
                {currentPage.overview}
              </p>
            </div>

            {currentPage.status === 'active' ? (
              <>
                {currentPage.id === 13 ? (
                  /* GORM MASTER ECOSYSTEM & TECHNICAL FLOWCHARTS */
                  <div className="space-y-6">
                    {/* Interactive Sub-tab Selector with Dark Glowing Theme */}
                    <div className="flex border-b border-zinc-850 gap-1 sm:gap-2 pb-0.5">
                      <button
                        onClick={() => setDiagramTab('topology')}
                        className={`flex items-center gap-2 px-3 sm:px-4 py-2.5 border-b-2 text-[11px] sm:text-xs font-bold transition-all cursor-pointer ${
                          diagramTab === 'topology'
                            ? 'border-amber-500 text-amber-500 bg-amber-500/5 font-black'
                            : 'border-transparent text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/40'
                        }`}
                      >
                        <Network size={14} className={diagramTab === 'topology' ? 'text-amber-400' : 'text-zinc-500'} />
                        <span>۱. توپولوژی کلان شبکه و زیرساخت</span>
                      </button>
                      
                      <button
                        onClick={() => setDiagramTab('erd')}
                        className={`flex items-center gap-2 px-3 sm:px-4 py-2.5 border-b-2 text-[11px] sm:text-xs font-bold transition-all cursor-pointer ${
                          diagramTab === 'erd'
                            ? 'border-amber-500 text-amber-500 bg-amber-500/5 font-black'
                            : 'border-transparent text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/40'
                        }`}
                      >
                        <Database size={14} className={diagramTab === 'erd' ? 'text-amber-400' : 'text-zinc-500'} />
                        <span>۲. مدل موجودیت روابط دیتابیس (ERD)</span>
                      </button>

                      <button
                        onClick={() => setDiagramTab('flow')}
                        className={`flex items-center gap-2 px-3 sm:px-4 py-2.5 border-b-2 text-[11px] sm:text-xs font-bold transition-all cursor-pointer ${
                          diagramTab === 'flow'
                            ? 'border-amber-500 text-amber-500 bg-amber-500/5 font-black'
                            : 'border-transparent text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/40'
                        }`}
                      >
                        <Compass size={14} className={diagramTab === 'flow' ? 'text-amber-400' : 'text-zinc-500'} />
                        <span>۳. فلوچارت منطقی چرخه‌های کاربر</span>
                      </button>
                    </div>

                    {/* Rendering Diagram Content Based on Selected Tab */}
                    {diagramTab === 'topology' && (
                      <div className="space-y-6">
                        {/* Topology Scenario Selection Section */}
                        <div className="bg-[#0b0b0e] border border-zinc-850 rounded-2xl p-5 md:p-6 space-y-4">
                          <div className="pb-3 border-b border-zinc-850 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <Network size={18} className="text-amber-400" />
                              <h3 className="text-xs sm:text-sm font-bold text-zinc-100">شبیه‌ساز تعاملی جریان اطلاعات بر اساس سناریو</h3>
                            </div>
                            <span className="text-[10px] text-zinc-500">جریان تبادل داده بین سرور، کلاینت و دیتابیس را روشن کنید</span>
                          </div>

                          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                            {[
                              { id: 'otp', label: 'ورود پیامکی OTP', icon: Smartphone },
                              { id: 'booking', label: 'اعزام نمونه‌گیر منزل', icon: Compass },
                              { id: 'payment', label: 'پرداخت زرین‌پال', icon: CreditCard },
                              { id: 'prescription', label: 'نسخه دیجیتال پزشک', icon: Activity }
                            ].map(s => {
                              const isSel = activeScenario === s.id;
                              return (
                                <button
                                  key={s.id}
                                  onClick={() => setActiveScenario(s.id)}
                                  className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-center transition-all text-xs cursor-pointer ${
                                    isSel
                                      ? 'bg-amber-500/10 border-amber-500 border-2 font-bold text-zinc-100'
                                      : 'bg-[#101014] border-zinc-850 hover:border-zinc-850 text-zinc-400'
                                  }`}
                                >
                                  <s.icon size={13} className={isSel ? 'text-amber-400' : 'text-zinc-500'} />
                                  <span>{s.label}</span>
                                </button>
                              );
                            })}
                          </div>

                          {/* Detail of chosen scenario */}
                          {(() => {
                            const sData = scenarios[activeScenario as keyof typeof scenarios];
                            if (!sData) return null;
                            return (
                              <div className="bg-[#111116] border border-zinc-850 rounded-xl p-4 space-y-2 transition-all">
                                <h4 className="text-xs font-bold text-zinc-100 flex items-center gap-2">
                                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
                                  {sData.title}
                                </h4>
                                <p className="text-[11px] text-zinc-400 leading-relaxed text-justify mt-1">
                                  {sData.description}
                                </p>
                              </div>
                            );
                          })()}
                        </div>

                        {/* Interactive Grid Topology Diagram */}
                        <div className="bg-[#0b0b0e] border border-zinc-850 rounded-2xl p-5 md:p-6 space-y-6 overflow-hidden">
                          <div className="pb-3 border-b border-zinc-850 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Server size={16} className="text-amber-500" />
                              <h4 className="text-xs sm:text-sm font-bold text-zinc-100">دیاگرام سراسری پشته شبکه و کانتینرها (Topology Layout)</h4>
                            </div>
                            <span className="text-[9px] bg-amber-400/10 text-amber-400 border border-amber-500/20 px-1.5 py-0.5 rounded font-mono font-bold">زنده</span>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
                            {/* Column 1: Clients */}
                            <div className="space-y-3">
                              <h5 className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider text-center border-b border-zinc-850 pb-1.5 font-sans">کلاینت‌ها (Client Layer)</h5>
                              <div className="space-y-2.5">
                                {[
                                  { id: 'patient-spa', label: 'پورتال اصلی بیماران (SPA)', desc: 'ثبت نوبت، دانلود نتایج، درگاه زرین‌پال', icon: Laptop },
                                  { id: 'admin-panel', label: 'پنل کاربری پرسنل (Admin)', desc: 'پذیرش، سوپروایزر، مالی، اعزام نمونه‌گیر', icon: Server },
                                  { id: 'doctor-portal', label: 'پورتال همکار پزشک', desc: 'جستجوی بیمار، تجویز نسخه‌های آزمایشگاهی', icon: Activity },
                                  { id: 'mobile-collector', label: 'کارپوشه نمونه‌گیران محل', desc: 'گزارش حضور، لوکیشن دقیق، دشارژ کیت', icon: Smartphone }
                                ].map(n => nodesLayout({ ...n, id: n.id }))}
                              </div>
                            </div>

                            {/* Column 2: API GATEWAY */}
                            <div className="space-y-3 flex flex-col pt-0 md:pt-6">
                              <h5 className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider text-center border-b border-zinc-850 pb-1.5 font-sans">لایه وب‌سرویس پایتون</h5>
                              <div className="space-y-2.5 my-auto">
                                {[
                                  { id: 'fastapi', label: 'FastAPI REST Core', desc: 'مدیریت کوکی‌های httpOnly، پردازش توکن JWT، پد کنترل دسترسی و روت ممیزی مراجعین', icon: Globe }
                                ].map(n => nodesLayout({ ...n, id: n.id }))}
                              </div>
                            </div>

                            {/* Column 3: STORAGE LAYER */}
                            <div className="space-y-3 flex flex-col pt-0 md:pt-6">
                              <h5 className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider text-center border-b border-zinc-850 pb-1.5 font-sans">لایه ذخیره‌سازی داده</h5>
                              <div className="space-y-2.5 my-auto">
                                {[
                                  { id: 'postgresql', label: 'PostgreSQL DB', desc: 'دیتابیس سنکرون اطلاعات مالی، نوبت‌ها، لاگ کارگیری پرسنل ممیزی', icon: Database },
                                  { id: 'redis', label: 'Redis Cache & KV Store', desc: 'هش موقت کدهای محلی OTP و بلاک ضد خرابکاری زنده', icon: Zap }
                                ].map(n => nodesLayout({ ...n, id: n.id }))}
                              </div>
                            </div>

                            {/* Column 4: EXTERNAL SERVICES */}
                            <div className="space-y-3 flex flex-col pt-0 md:pt-6">
                              <h5 className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider text-center border-b border-zinc-850 pb-1.5 font-sans">درگاه‌های موازی و مخارج</h5>
                              <div className="space-y-2.5 my-auto">
                                {[
                                  { id: 'zarinpal', label: 'زرین‌پال (Zarinpal sandbox)', desc: 'تسویه و پرداختهای امن مراجعین', icon: CreditCard },
                                  { id: 'sms-provider', label: 'وب‌سرویس مخابرات (SMS Gateway)', desc: 'مخابره کدهای OTP موقت به بیماران', icon: MessageSquare },
                                  { id: 'azmon-server', label: 'سامانه جوابدهی کشوری (Azmon)', desc: 'واکشی اسناد PDF آزمون مراجعین در تب جدید', icon: Bell }
                                ].map(n => nodesLayout({ ...n, id: n.id }))}
                              </div>
                            </div>
                          </div>

                          {/* Sequential Timeline Steps */}
                          <div className="bg-[#111116] border border-zinc-850 rounded-xl p-4.5 space-y-3 mt-4">
                            <span className="text-[9px] font-bold text-amber-500 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full font-sans">
                              روند تراکنش خط‌به‌خط تبادل داده‌ها
                            </span>
                            <div className="space-y-2">
                              {(() => {
                                const sData = scenarios[activeScenario as keyof typeof scenarios];
                                if (!sData) return null;
                                return sData.steps.map((st, i) => (
                                  <div key={i} className="flex items-start gap-2.5 text-xs text-zinc-350 leading-relaxed font-sans">
                                    <span className="text-amber-500 font-bold font-mono text-xs">{i + 1}.</span>
                                    <p className="text-justify font-sans">{st.substring(2)}</p>
                                  </div>
                                ));
                              })()}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {diagramTab === 'erd' && (
                      <div className="space-y-6">
                        {/* Interactive ERD DB Schema (16 Tables) */}
                        <div className="bg-[#0b0b0e] border border-zinc-850 rounded-2xl p-5 md:p-6 space-y-4">
                          <div className="pb-3 border-b border-zinc-850 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <Database className="text-amber-400" size={18} />
                              <h3 className="text-xs sm:text-sm font-bold text-zinc-100">مدل فیزیکی موجودیت و رابطه بین ۱۶ جدول دیتابیس بومی (Database Schema)</h3>
                            </div>
                            <span className="text-[10px] text-zinc-500">برای مانیتور پیوندهای کلید خارجی (FK) و فیلدها یک جدول را کلیک کنید</span>
                          </div>

                          {/* Selected table details view panel */}
                          <div className="bg-[#111116] border border-zinc-850 rounded-xl p-4 min-h-[100px] flex flex-col justify-between transition-all">
                            {selectedTable ? (
                              (() => {
                                const tablesList: Record<string, {
                                  title: string;
                                  desc: string;
                                  relationDesc: string;
                                  primaryKey: string;
                                  fields: { name: string; type: string; info?: string }[];
                                }> = {
                                  users: {
                                    title: 'کاربران بیمار (users)',
                                    desc: 'شناسه مرجع افراد احراز هویت شده موبایل‌محور. تمام پرداخت‌ها و نوبت‌ها به شناسه این بیماران متصل می‌شود.',
                                    relationDesc: 'پیوند یک به چند با جلسات (sessions)، نوبت‌ها (appointments)، پرداخت‌ها (payments) و کش وب‌سندی آزمون (azmon_document_cache).',
                                    primaryKey: 'id (uuid)',
                                    fields: [
                                      { name: 'id', type: 'uuid', info: 'شناسه پیوند منحصر به فرد (PK)' },
                                      { name: 'phone', type: 'varchar(15)', info: 'تلفن بیمار جهت لاگین OTP (UK)' },
                                      { name: 'patient_id', type: 'varchar(30)', info: 'شناسه مرجع سیستم پذیرش (UK)' },
                                      { name: 'full_name', type: 'varchar(100)', info: 'نام و نام خانوادگی بیمار' },
                                      { name: 'national_id', type: 'varchar(10)', info: 'کدملی متقاضی نوبت' },
                                      { name: 'is_active', type: 'boolean', info: 'فعال یا بلوکه بودن موقت بیمار' }
                                    ]
                                  },
                                  appointments: {
                                    title: 'برنامه نوبت‌گیری (appointments)',
                                    desc: 'ذخیره‌سازی زمان‌بندی دقیق نمونه‌گیری‌ها در قالب حضور در شعبه (in_lab) یا اعزام خانه (at_home).',
                                    relationDesc: 'پیوند کلید خارجی با کاربران (user_id)، شعبه آزمایشگاه (branch_id)، کد آزمایش تشخیصی (test_code)، نمونه‌گیر منتسب (assigned_staff_id).',
                                    primaryKey: 'id (uuid)',
                                    fields: [
                                      { name: 'id', type: 'uuid', info: 'شناسه نوبت ثبت‌شده (PK)' },
                                      { name: 'user_id', type: 'uuid', info: 'بیمار ثبت کننده نوبت (FK)' },
                                      { name: 'branch_id', type: 'uuid', info: 'شعبه انتخابی (FK)' },
                                      { name: 'test_code', type: 'varchar', info: 'کد آزمایش تشخیصی (FK)' },
                                      { name: 'scheduled_at', type: 'timestamptz', info: 'ساعت مقرر نمونه‌گیری' },
                                      { name: 'collection_type', type: 'varchar(20)', info: 'in_person یا at_home' },
                                      { name: 'status', type: 'varchar(20)', info: 'مراحل نمونه‌گیری (scheduled, en_route, sample_collected, etc.)' },
                                      { name: 'payment_status', type: 'varchar(20)', info: 'وضعیت مالی نوبت (pending, paid_online, paid_at_lab)' }
                                    ]
                                  },
                                  payments: {
                                    title: 'تراکنش‌های زرین‌پال (payments)',
                                    desc: 'مدیریت کوپن، مقادیر فاکتور صادر شده و تراکنش وریفای ترازو مالی با گیت‌وی زرین‌پال.',
                                    relationDesc: 'مرتبط با کاربران (user_id) و ارجاع دوطرفه با نوبت فاکتوری (appointment_id).',
                                    primaryKey: 'id (uuid)',
                                    fields: [
                                      { name: 'id', type: 'uuid', info: 'شناسه رسید تراکنش (PK)' },
                                      { name: 'user_id', type: 'uuid', info: 'نام مودی تراکنش (FK)' },
                                      { name: 'appointment_id', type: 'uuid', info: 'نوبت انتسابی فاکتور (FK)' },
                                      { name: 'amount', type: 'decimal(12,2)', info: 'مبلغ نهایی ریالی' },
                                      { name: 'gateway_ref', type: 'varchar(100)', info: 'شماره خرید منحصر زرین‌پال (verification code - UK)' },
                                      { name: 'status', type: 'varchar(20)', info: 'pending, paid, failed, dynamic' }
                                    ]
                                  },
                                  sessions: {
                                    title: 'جلسات نشست امنیتی (sessions)',
                                    desc: 'لاگ پیوسته ورودها و هشهای رفرش‌توکن جهت تایید هویت بدون سشن بادی مراجعین در وب‌سرویس پایتون.',
                                    relationDesc: 'پیوند کلید خارجی با کاربران مراجع (user_id) با ارجاع آبشار حذف.',
                                    primaryKey: 'id (uuid)',
                                    fields: [
                                      { name: 'id', type: 'uuid', info: 'شناسه نشست و سشن (PK)' },
                                      { name: 'user_id', type: 'uuid', info: 'شناسه بیمار متناظر (FK)' },
                                      { name: 'refresh_token_hash', type: 'varchar', info: 'توکن امضا شده رفرش تایید هویت' },
                                      { name: 'expires_at', type: 'timestamptz', info: 'زمان انقضای توکن طویل ۷ روزه' },
                                      { name: 'ip_address', type: 'inet', info: 'آی‌پی درخواست دهنده نشست' }
                                    ]
                                  },
                                  staff_users: {
                                    title: 'کاربران اداری لابه (staff_users)',
                                    desc: 'فهرست پرسنل پذیرش، مدیر ارشد، سوپروایزر شعبه و کارشناسان اعزام نمونه‌گیری جهت گارد RBAC اداری.',
                                    relationDesc: 'دارای روتین ارادی یک‌به‌یک با پروفایل پزشکان (doctor_profiles) و یک‌به‌چند با اعلانها (staff_notifications).',
                                    primaryKey: 'id (uuid)',
                                    fields: [
                                      { name: 'id', type: 'uuid', info: 'شناسه کارشناس اداری (PK)' },
                                      { name: 'email', type: 'varchar(100)', info: 'ایمیل پرسنلی جهت لاگین مجزا (UK)' },
                                      { name: 'password_hash', type: 'varchar', info: 'هش پسورد رمز نگاری مقتدر' },
                                      { name: 'role', type: 'varchar(30)', info: 'receptionist, supervisor, manager, sample_collector, doctor' },
                                      { name: 'is_active', type: 'boolean', info: 'وضعیت اجازه کار در پنل بومی' }
                                    ]
                                  },
                                  doctor_profiles: {
                                    title: 'پروفایل اختصاصی همکار پزشک (doctor_profiles)',
                                    desc: 'اطلاعات پزشکان تعریف شده که مجاز به ثبت و ارسال نسخ دیجیتال برای بیماران خود در کارتابل هستند.',
                                    relationDesc: 'متصل به جدول کاربری پرسنل (staff_user_id) و ارجاع یک به چند نسخه پزشک (doctor_test_orders).',
                                    primaryKey: 'id (uuid)',
                                    fields: [
                                      { name: 'id', type: 'uuid', info: 'شناسه سیستم پزشک (PK)' },
                                      { name: 'staff_user_id', type: 'uuid', info: 'کاربر پنل اداری متصل (FK)' },
                                      { name: 'doctor_code', type: 'varchar(20)', info: 'کد پروانه فعال نظام پزشکی (UK)' },
                                      { name: 'license_number', type: 'varchar(20)', info: 'شماره مجوز ملی (UK)' },
                                      { name: 'full_name', type: 'varchar(100)', info: 'نام پزشک تشخیصی جهت نسخه' }
                                    ]
                                  },
                                  doctor_test_orders: {
                                    title: 'نسخ و دستورات کلینیکال (doctor_test_orders)',
                                    desc: 'ذخیره‌سازی دستورات از پیش تجویز شده پزشک همکار که با پذیرش حضوری یا اعزام منزل سنکرون می‌شود.',
                                    relationDesc: 'متصل به پزشک نویسنده نسخه (doctor_id)، مراجع بیمار (patient_user_id) و نوبت‌دهی تکی (appointment_id).',
                                    primaryKey: 'id (uuid)',
                                    fields: [
                                      { name: 'id', type: 'uuid', info: 'شناسه فیزیکی نسخه صادره (PK)' },
                                      { name: 'doctor_id', type: 'uuid', info: 'شناسه پزشک مسئول (FK)' },
                                      { name: 'patient_user_id', type: 'uuid', info: 'بیمار مقصد تجویز (FK)' },
                                      { name: 'test_codes', type: 'jsonb', info: 'کد لیست تست‌های تجویزی پزشک' },
                                      { name: 'status', type: 'varchar(20)', info: 'وضعیت نسخه (draft, submitted, linked_to_appointment)' }
                                    ]
                                  },
                                  azmon_document_cache: {
                                    title: 'حافظه کش مستندات نتایج (azmon_document_cache)',
                                    desc: 'ذخیره ردگیری ارجاعات آزمون هر بیمار جهت بهبود کارایی و ممیزی دانلود نتایج مراجعین.',
                                    relationDesc: 'پیوند کلید خارجی با جدول بیماران (user_id).',
                                    primaryKey: 'id (uuid)',
                                    fields: [
                                      { name: 'id', type: 'uuid', info: 'شناسه رکورد کش کش سیستم جوابدهی (PK)' },
                                      { name: 'user_id', type: 'uuid', info: 'مراجع بیمار ذینفع (FK)' },
                                      { name: 'azmon_ref', type: 'varchar', info: 'شناسه سند مرجع در سامانه آزمون (UK)' },
                                      { name: 'expires_at', type: 'timestamptz', info: 'طول انقضای اعتبار کش لینک دانلود' }
                                    ]
                                  }
                                };

                                const mapped = tablesList[selectedTable] || {
                                  title: selectedTable + ' Database Entity',
                                  desc: 'جدول بومی پایگاه روابط ذخیره‌سازی مراجعین و هسته سیستم نانو لب.',
                                  relationDesc: 'دارای ارتباطات بومی با جداول مجاور بر مبنای طراحی روابط اصولی دیتابیس بومی PostgreSQL.',
                                  primaryKey: 'id (uuid/varchar)',
                                  fields: [
                                    { name: 'id', type: 'uuid', info: 'کلید اصلی تراکنش و رابطه فیزیکی (PK)' },
                                    { name: 'created_at', type: 'timestamptz', info: 'زمان ایجاد رکورد در پایگاه جاری' }
                                  ]
                                };

                                return (
                                  <div className="space-y-3">
                                    <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                                      <h4 className="text-xs sm:text-sm font-black text-amber-400 font-mono">{mapped.title}</h4>
                                      <span className="text-[10px] text-zinc-500 font-mono">PRIMARY KEY: {mapped.primaryKey}</span>
                                    </div>
                                    <p className="text-xs text-zinc-350 text-justify leading-relaxed">{mapped.desc}</p>
                                    <div className="text-[10px] bg-amber-500/5 text-zinc-400 p-2 rounded border border-amber-500/10">
                                      <span className="font-bold text-amber-500/80">ارتباطات:</span> {mapped.relationDesc}
                                    </div>
                                    
                                    <div className="pt-2">
                                      <span className="text-[10px] text-zinc-500 border-b border-zinc-850 pb-1 block">فهرست کلیدهای جاری و انواع فیلدها</span>
                                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 pt-2">
                                        {mapped.fields.map((f, idx) => (
                                          <div key={idx} className="bg-[#15151b] p-2 rounded border border-zinc-850 text-[10px] flex flex-col justify-between">
                                            <span className="text-zinc-200 font-mono font-bold">{f.name} <span className="text-zinc-500 font-normal text-[9px]">({f.type})</span></span>
                                            <span className="text-zinc-500 text-[9px] mt-1">{f.info || 'فیلد متادیتا و مقدار دیتابیس'}</span>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  </div>
                                );
                              })()
                            ) : (
                              <div className="text-center py-6 text-zinc-500 flex flex-col items-center justify-center gap-2">
                                <Database className="text-zinc-700 animate-pulse" size={24} />
                                <span className="text-xs">روی یکی از جداول دیتابیس زیر کلیک کنید تا متادیتای ستون‌ها، روابط کلید خارجی و تعاریف فیلدهای فنی آن نمایش داده شود.</span>
                              </div>
                            )}
                          </div>

                          {/* Grid of database tables mirroring image 1 closely */}
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-3">
                            {[
                              { id: 'users', title: 'users', cat: 'بیماران اصلی', fieldsCount: 8, r: 'sessions' },
                              { id: 'sessions', title: 'sessions', cat: 'احراز هویت', fieldsCount: 7, r: 'users' },
                              { id: 'otp_requests', title: 'otp_requests', cat: 'ورود OTP پیامکی', fieldsCount: 7, r: 'none' },
                              { id: 'azmon_document_cache', title: 'azmon_document_cache', cat: 'وب‌سند آزمون', fieldsCount: 5, r: 'users' },
                              
                              { id: 'appointments', title: 'appointments', cat: 'نوبت‌گیری و اعزام', fieldsCount: 15, r: 'users' },
                              { id: 'branches', title: 'branches', cat: 'شعب آزمایشگاه', fieldsCount: 7, r: 'appointments' },
                              { id: 'lab_tests', title: 'lab_tests', cat: 'کاتالوگ تست‌ها', fieldsCount: 8, r: 'appointments' },
                              { id: 'payments', title: 'payments', cat: 'صورتحساب مالی', fieldsCount: 10, r: 'users' },
                              
                              { id: 'staff_users', title: 'staff_users', cat: 'مدیریت و پرسنل', fieldsCount: 6, r: 'doctor_profiles' },
                              { id: 'doctor_profiles', title: 'doctor_profiles', cat: 'پزشک تجویز کننده', fieldsCount: 5, r: 'staff_users' },
                              { id: 'doctor_test_orders', title: 'doctor_test_orders', cat: 'نسخه اداری پزشک', fieldsCount: 8, r: 'doctor_profiles' },
                              { id: 'staff_notifications', title: 'staff_notifications', cat: 'اعلان پرسنل', fieldsCount: 8, r: 'staff_users' },
                              
                              { id: 'faq_items', title: 'faq_items', cat: 'کاتالوگ عمومی', fieldsCount: 6, r: 'none' },
                              { id: 'contact_submissions', title: 'contact_submissions', cat: 'فرمهای تماس وب', fieldsCount: 8, r: 'none' },
                              { id: 'blog_posts', title: 'blog_posts', cat: 'پژوهش وب فلو', fieldsCount: 9, r: 'none' },
                              { id: 'audit_logs', title: 'audit_logs', cat: 'ردپا و ممیزی سیستم', fieldsCount: 7, r: 'none' }
                            ].map(t => {
                              const isSel = selectedTable === t.id;
                              return (
                                <div
                                  key={t.id}
                                  onClick={() => setSelectedTable(t.id)}
                                  className={`rounded-xl border p-3.5 transition-all text-right cursor-pointer flex flex-col justify-between ${
                                    isSel
                                      ? 'bg-amber-500/10 border-amber-500 shadow-[0_0_12px_rgba(245,158,11,0.15)] ring-1 ring-amber-500/20'
                                      : 'bg-[#101014] border-zinc-850 hover:border-zinc-800 hover:bg-[#14141a]'
                                  }`}
                                >
                                  <div className="flex items-center justify-between border-b border-zinc-850 pb-1.5">
                                    <span className="text-[10px] text-zinc-500 font-bold">{t.cat}</span>
                                    <span className="text-[8px] bg-zinc-800 text-zinc-400 px-1.5 py-0.5 rounded font-mono font-bold">
                                      {t.fieldsCount} فیلد
                                    </span>
                                  </div>
                                  <div className="pt-2">
                                    <h5 className="text-xs font-black text-zinc-100 font-mono tracking-wide">{t.title}</h5>
                                    <p className="text-[9px] text-zinc-500 leading-normal mt-1 leading-relaxed">
                                      مرجع داده‌ای بومی {t.title} در لایه Postgre.
                                    </p>
                                  </div>
                                  <div className="pt-2 flex items-center justify-between mt-1 text-[9px] text-zinc-500">
                                    <span className="font-mono text-[9px]">ID type: uuid</span>
                                    {isSel && <span className="text-amber-500 text-[8px] font-bold animate-pulse">● انتخاب شده</span>}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    )}

                    {diagramTab === 'flow' && (
                      <div className="space-y-6">
                        {/* Interactive logical flow mapping (Image 3) */}
                        <div className="bg-[#0b0b0e] border border-zinc-850 rounded-2xl p-5 md:p-6 space-y-4">
                          <div className="pb-3 border-b border-zinc-850 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <Compass className="text-amber-400" size={18} />
                              <h3 className="text-xs sm:text-sm font-bold text-zinc-100">دروازه جریان منطقی رویدادها و واکنش‌های کلاینت-به-سرور (Logical Flows)</h3>
                            </div>
                            <span className="text-[10px] text-zinc-500">روی هر گام منطقی کلیک کنید تا اندپوینت لایو و جداول فعال آن نمایان شود</span>
                          </div>

                          {/* Selected flow step detail panel */}
                          <div className="bg-[#111116] border border-zinc-850 rounded-xl p-4 min-h-[90px] transition-all">
                            {selectedFlowNode ? (
                              (() => {
                                const flowDetails: Record<string, {
                                  title: string;
                                  desc: string;
                                  route: string;
                                  tables: string;
                                  userAction: string;
                                }> = {
                                  landing: {
                                    title: '۱. لود صفحه اصلی و کاتالوگ بازاریابی (Guest Browse)',
                                    desc: 'کاربر ناشناس وارد وبسایت شده و فهرست عمومی آزمایش‌ها، هزینه‌ها، وبلاگ و سوالات متداول را به همراه آدرس شعب آزمایشگاه مانیتور می‌کند.',
                                    route: 'GET /content/services, GET /tests, GET /blog, GET /faq',
                                    tables: 'خوانش از جداول blog_posts, faq_items, lab_tests, branches',
                                    userAction: 'مطالعه کاتالوگ تشخیصی، مقایسه قیمت‌ها و مشاهده شعب فعال بر روی لوکیشن نقشه محلی.'
                                  },
                                  contactSubmit: {
                                    title: '۲. ثبت فرم درخواست مشاوره و تماس (Contact Post)',
                                    desc: 'مراجعین با تکمیل فیلدهای اطلاعاتی، درخواست مشاوره پذیرش و برقراری ارتباط با کارشناسان پذیرش را ارسال می‌کنند.',
                                    route: 'POST /api/contact (مجهز به کنترل نرخ درخواست و فیلترینگ ورودی)',
                                    tables: 'درج فیزیکی رکورد در جدول contact_submissions و فعال‌باش نوتیفیکیشن پذیرش',
                                    userAction: 'بیمار پیغام خود را ارسال کرده و پیام سبزرنگ تایید ثبت دریافت می‌دارد.'
                                  },
                                  otpRequest: {
                                    title: '۳. چالش ارسال پیامک ورود رمز یکبارمصرف (OTP Challenge)',
                                    desc: 'بیمار شماره همراه خود را برای ورود به کارنامه آزمایشها وارد می‌کند. سیستم بلافاصله محدودیت زمانی ۵ دقیقه‌ای بررسی می‌کند.',
                                    route: 'POST /api/auth/otp/request (دارای مسدود کننده ۵ درخواست بر ساعت)',
                                    tables: 'درج فیزیکی رکورد در جدول otp_requests و مقداردهی تند کش یکبارمصرف در حافظه موقت Redis',
                                    userAction: 'دریافت پیامک حاوی کد ۶ رقمی تصادفی صادر شده از گیت‌وی مخابرات بر روی گوشی تلفن.'
                                  },
                                  otpVerify: {
                                    title: '۴. بررسی پارت اول و صدور کوکی نشست (OTP Verify)',
                                    desc: 'سرور پایتونی کد ورودی را با مقدار ذخیره شده در دیتابیس ردیس مطابقت می‌دهد و در صورت تایید، توکن‌های JWT و کوکی‌های شدیداً ایمن httpOnly سشن ایجاد می‌کند.',
                                    route: 'POST /api/auth/otp/verify (مستقر کردن توکن‌های سشن در هدر امن رمزنگاری)',
                                    tables: 'درج فیزیکی رکورد ورود یا واکشی بیمار در جدول users و واکشی سشن فعال در جدول sessions',
                                    userAction: 'ورود بیمار به محیط داشبورد نتایج بدون نیاز به پسورد و انتقال به بخش کارنامه آزمایشگاهی.'
                                  },
                                  dashboardView: {
                                    title: '۵. مشاهده کارنامه نتایج و چارت روند فاکتورها (Dashboard Retrieval)',
                                    desc: 'بیمار در محیط پورتال خود فاکتورها، تستهای تشخیصی آماده و نمودار نوسان فاکتورهای آزمایشگاهی دوره‌ای خود را مانیتور می‌کند.',
                                    route: 'GET /api/patients/me/results (پاسخ تایید هویت سشن)',
                                    tables: 'خوانش ممیزی اطلاعات جداول users, appointments, payments و وب‌سرویس آزمون ملّی',
                                    userAction: 'مراجع تحلیل خطوط سلامت، یادداشت پزشک و سوابق پرداختی آزمایشگاه تشخیصی خود را می‌بیند.'
                                  },
                                  pdfDownload: {
                                    title: '۶. دریافت لینک مستقیم دانلود سند کارنامه (PDF Link Tab Redirect)',
                                    desc: 'سامانه بومی پس از کلیک بیمار روی دکمه دریافت کارنامه، شناسه یکتا را ترجمه کرده و لینک موقت دانلود تب خارج را بدون تحمیل بار حجم به سرور بومی صادر می‌دارد.',
                                    route: 'GET /api/documents/{id} (تایید مالکیت پرونده جهت ملوگیری از نشت داده)',
                                    tables: 'درج ممیزی رویداد دانلود در جدول audit_logs و تمدید انقضا در جدول azmon_document_cache',
                                    userAction: 'باز شدن تب جداگانه در مرورگر (target=_blank) و دانلود باکیفیت کارنامه دیجیتالی بدون دکه واسط.'
                                  },
                                  bookingSubmit: {
                                    title: '۷. پروسه انتخابی زمان‌بندی نمونه‌گیری در منزل (At-Home Dispatch Request)',
                                    desc: 'بیمار فلو متغیر اعزام نمونه‌گیری را انتخاب می‌کند. آدرس، شماره تلفن و لوکیشن مراجع ذخیره و پرسنل پذیرش ابری فوراً از کارتابل فعال اعزام می‌کنند.',
                                    route: 'POST /api/appointments (رزور ثبتی کارپوشه)',
                                    tables: 'درج نوبت اعزام در جدول appointments و ثبات اعلان زنگوله در جدول staff_notifications',
                                    userAction: 'مراجع تایید نوبت را دریافت کرده و متصدی پذیرش فعال را به همراه نمونه‌گیر برای وی منتسب می‌کند.'
                                  },
                                  zarinpalFlow: {
                                    title: '۸. ترانزیت مالی درگاه زرین‌پال و فاکتورسازی آنلاین (Zarinpal Checkout flow)',
                                    desc: 'ثبت فاکتور تراکنش‌های صادر شده با شماره مرجع دوطرفه ضد تقلب. کاربر به صفحه زرین‌پال ریدایرکت شده و فکتور خود را تسویه می‌کند.',
                                    route: 'POST /api/payments/create, POST /api/payments/verify (آدرس کالبک امن)',
                                    tables: 'تغییر وضعیت نوبت به paid_online در جدول appointments و درج رسید تراکنش در جدول payments',
                                    userAction: 'اتصال خودکار به صفحه پرداخت اینترنتی زرین‌پال و برگشت سریع با رسید مطمئن پرداخت.'
                                  },
                                  payAtLab: {
                                    title: '۹. ثبت وضعیت پس‌پرداخت حضوری آزمایشگاه (Pay-at-Lab Mark)',
                                    desc: 'در سناریو نوبت‌گیری حضوری در شعبه، بیمار پرداخت نقدی در شعبه را برمی‌گزیند. سشن نوبت تا زمان حضور با وضعیت غیرپرداخت ثبت می‌شود.',
                                    route: 'PATCH /api/staff/appointments/{id}/mark-paid-at-lab (مقتدر بر دسترسی اداری)',
                                    tables: 'تغییر وضعیت نوبت مالی به paid_at_lab در جدول appointments',
                                    userAction: 'متصدی پذیرش هنگام حضور بیمار، کارت‌خوان را کشیده و رسید فیزیکی را با کلیک در ادمین پنل ست کار می‌سازد.'
                                  },
                                  mobileDispatch: {
                                    title: '۱۰. عملیات لوکیشن‌محور کارشناسان اعزام در محل بیمار (Collector Dispatch UI)',
                                    desc: 'نمونه‌گیران فعال خط اعزام، ماموریت را بر روی دستان اپلیکیشن موبایل خود مانیتور می‌کنند. آدرس دقیق و لوکیشن از دال دیتابیس بارگیری می‌شود.',
                                    route: 'GET/PATCH /api/staff/home-collections (مخصوص نمونه‌برداری نمونه‌گیران)',
                                    tables: 'واکشی قرار نوبت در جدول appointments و درج ثبت حرکت در جداول audit_logs',
                                    userAction: 'نمونه‌گیر وضعیت کیت را به درمسیر اعزام و نهایتاً نمونه‌گیری موفق ارتقا می‌دهد.'
                                  },
                                  doctorPrescribe: {
                                    title: '۱۱. نسخه‌نویسی الكترونیکی کارتابل پزشکان تشخیصی (Doctor Order Entry)',
                                    desc: 'پزشک همكار تشخیصی با پروانه مجوز نظام‌پزشکی خود ریوو بیمار را ثبت کرده و تستهای تکنسین را مستقیماً به کارگاه متصدیان هدایت می‌سازد.',
                                    route: 'POST /api/doctors/orders (تایید هویت نظام پزشکی)',
                                    tables: 'درج کدهای تجویز شده در جدول doctor_test_orders و الحاق به نوبت در صورت حضور',
                                    userAction: 'نسخه در کارگاه پذیرش حضوری و اعزام بدون دخالت بیمار ظاهر می‌شود و پذیرش فوراً ثبت می‌شود.'
                                  }
                                };

                                const mapped = flowDetails[selectedFlowNode] || {
                                  title: 'رویداد منطقی اکوسیستم نانو لب',
                                  desc: 'مسیر رویداد لایو ارتباط دهنده کلاینت و هسته وب‌سرویس پایتون.',
                                  route: 'POST/GET /api/...',
                                  tables: 'دیتا مستقر در جداول دیتابیس بومی',
                                  userAction: 'تعامل جاری کلاینت بر روی درگاه وب‌سایت.'
                                };

                                return (
                                  <div className="space-y-2">
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-zinc-800 pb-2">
                                      <h4 className="text-xs sm:text-sm font-black text-amber-400 flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                                        {mapped.title}
                                      </h4>
                                      <span className="text-[10px] text-zinc-500 font-mono bg-zinc-900 border border-zinc-850 px-2 py-0.5 rounded">URL Route: {mapped.route}</span>
                                    </div>
                                    <p className="text-xs text-zinc-350 text-justify leading-relaxed mt-1">{mapped.desc}</p>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 text-[10px]">
                                      <div className="bg-[#15151b] p-2.5 rounded border border-zinc-850">
                                        <span className="font-bold text-amber-500 block mb-1">واکنش دیتابیس بومی:</span>
                                        <span className="text-zinc-400 leading-normal">{mapped.tables}</span>
                                      </div>
                                      <div className="bg-[#15151b] p-2.5 rounded border border-zinc-850">
                                        <span className="font-bold text-emerald-500 block mb-1">خروجی سمت بیمار/متصدی:</span>
                                        <span className="text-zinc-400 leading-normal">{mapped.userAction}</span>
                                      </div>
                                    </div>
                                  </div>
                                );
                              })()
                            ) : (
                              <div className="text-center py-6 text-zinc-500 flex flex-col items-center justify-center gap-2">
                                <Compass className="text-zinc-700 animate-bounce" size={24} />
                                <span className="text-xs">روی هر یک از مأموریت‌های ترتیبی زیر ضربه بزنید تا چرخه کامل کلاینت به سرور، اندپوینت متناظر هدر پایتون و روابط دیتابیس متناظر آن شبیه‌سازی شود.</span>
                              </div>
                            )}
                          </div>

                          {/* Logical flow layout sequence mirroring image 3 perfectly */}
                          <div className="flex flex-col space-y-3.5 pt-2">
                            {[
                              { id: 'landing', label: 'شروع: لود صفحه کاتالوگ و شعبه ها', route: 'GET /content', icon: Laptop, steps: 'گام ۱' },
                              { id: 'contactSubmit', label: 'ثبت درخواست مشاوره حضوری تماس', route: 'POST /contact', icon: MessageSquare, steps: 'گام ۲' },
                              { id: 'doctorPrescribe', label: 'تجویز نسخه پزشک همکار (نظام پزشکی)', route: 'POST /doctors/orders', icon: Activity, steps: 'گام ۳' },
                              { id: 'otpRequest', label: 'چالش پیامک ورود مراجعین (OTP)', route: 'POST /auth/otp/request', icon: Smartphone, steps: 'گام ۴' },
                              { id: 'otpVerify', label: 'وریفای کد و صدور کوکی نشست بیمار', route: 'POST /auth/otp/verify', icon: Key, steps: 'گام ۵' }, /* eslint-disable-line */
                              { id: 'dashboardView', label: 'لود داشبورد مراجع نتایج تشخیصی', route: 'GET /patients/me/results', icon: Server, steps: 'گام ۶' },
                              { id: 'pdfDownload', label: 'لینک موقت دانلود مستقیم کارنامه آزمون ملی', route: 'GET /documents/{id}', icon: Bell, steps: 'گام ۷' },
                              { id: 'bookingSubmit', label: 'ثبت و زمان‌گیری نمونه‌برداری اعزام در خانه', route: 'POST /appointments', icon: Compass, steps: 'گام ۸' },
                              { id: 'zarinpalFlow', label: 'تراکنش مالی و کالبک ضد تقلب زرین‌پال', route: 'GET /payments/verify', icon: CreditCard, steps: 'گام ۹' },
                              { id: 'payAtLab', label: 'کارت‌خوان حضور به همراه ست پذیرش', route: 'PATCH /appointments/{id}', icon: Server, steps: 'گام ۱۰' },
                              { id: 'mobileDispatch', label: 'کارپوشه لوکیشن‌محور توری مأموران در محل مراجع', route: 'PATCH /staff/home-collections', icon: Smartphone, steps: 'گام ۱۱' }
                            ].map((flow, num) => {
                              const isSel = selectedFlowNode === flow.id;
                              return (
                                <div key={flow.id} className="relative flex flex-col items-center">
                                  {/* Connector Arrow Icon except for the first block */}
                                  {num > 0 && (
                                    <div className="flex items-center justify-center py-1 bg-gradient-to-b from-zinc-900 to-[#0b0b0e] w-full relative z-10">
                                      <ArrowDown size={14} className="text-zinc-650 animate-pulse my-0.5" />
                                    </div>
                                  )}

                                  <div
                                    onClick={() => setSelectedFlowNode(flow.id)}
                                    className={`w-full p-3.5 rounded-xl border text-right transition-all flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 cursor-pointer ${
                                      isSel
                                        ? 'bg-amber-500/10 border-amber-500 shadow-[0_0_12px_rgba(245,158,11,0.2)] ring-1 ring-amber-500/30'
                                        : 'bg-[#101014] border-zinc-850 hover:border-zinc-800'
                                    }`}
                                  >
                                    <div className="flex items-center gap-3">
                                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isSel ? 'bg-amber-500/20 text-amber-400' : 'bg-zinc-900 text-zinc-500'}`}>
                                        <flow.icon size={15} />
                                      </div>
                                      <div>
                                        <h5 className={`text-xs font-bold ${isSel ? 'text-zinc-100' : 'text-zinc-350'}`}>{flow.label}</h5>
                                        <span className="text-[10px] text-zinc-500 font-mono block mt-0.5">Route: {flow.route}</span>
                                      </div>
                                    </div>

                                    <div className="flex items-center gap-2.5 justify-end">
                                      <span className="text-[9px] bg-zinc-900 border border-zinc-850 text-zinc-400 px-2 py-0.5 rounded font-mono font-bold">
                                        {flow.steps}
                                      </span>
                                      {isSel && (
                                        <span className="text-[8px] font-bold text-amber-500 animate-pulse font-sans">
                                          ● فعال روی نقشه شبیه‌ساز
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <>
                    {/* 1. FLOWCHART SECTION */}
                    <div className="bg-[#0b0b0e] border border-zinc-850 rounded-2xl p-5 md:p-6 space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-zinc-850">
                    <div className="flex items-center gap-2">
                      <Layers size={16} className="text-amber-500" />
                      <h3 className="text-xs sm:text-sm font-bold text-zinc-100">۱. فلوچارت ترتیبی مراحل فنی</h3>
                    </div>
                    <span className="text-[10px] text-zinc-500 font-medium">برای مشاهده جزییات هر گام روی آن کلیک کنید</span>
                  </div>

                  {/* Node representation of Flowchart */}
                  <div className="overflow-x-auto pb-2">
                    <div className="flex flex-row items-center gap-2.5 min-w-[650px] md:min-w-0 flex-wrap md:flex-nowrap">
                      {currentPage.tasks.map((task, idx) => {
                        const isSelected = idx === selectedTaskIndex;
                        const taskNumberStr = (idx + 1).toLocaleString('fa-IR', { minimumIntegerDigits: 2 });
                        
                        return (
                          <div key={task.id} className="flex items-center flex-1">
                            {/* Step button */}
                            <button
                              onClick={() => setSelectedTaskIndex(idx)}
                              className={`flex-1 text-right p-3 rounded-xl border transition-all text-xs cursor-pointer relative ${
                                isSelected 
                                  ? 'bg-amber-500/10 border-amber-500 border-2 font-bold text-zinc-100 shadow'
                                  : 'bg-[#101014] border-zinc-850 hover:border-zinc-700 text-zinc-400'
                              }`}
                            >
                              <span className={`text-[9px] font-mono block mb-1 ${isSelected ? 'text-amber-500' : 'text-zinc-650'}`}>
                                گام {taskNumberStr}
                              </span>
                              <span className="block truncate text-[11px] leading-tight font-bold">{task.title.split(' (')[0]}</span>
                            </button>

                            {/* Arrow between steps */}
                            {idx < currentPage.tasks.length - 1 && (
                              <div className="mx-1 text-zinc-750 flex-shrink-0">
                                <ArrowLeft size={13} className="hidden md:block" />
                                <ArrowDown size={13} className="md:hidden" />
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Flowchart Active Step Explanation Description Detail */}
                  <div className="bg-[#111116] border border-zinc-850 rounded-xl p-4 mt-3 space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-amber-500/15 text-amber-500 border border-amber-500/10">
                        جزییات گام {(selectedTaskIndex + 1).toLocaleString('fa-IR')}
                      </span>
                      <h4 className="text-[12px] font-bold text-zinc-200">{activeTask?.title}</h4>
                    </div>
                    <p className="text-[11px] text-zinc-350 leading-relaxed text-justify mt-1.5">
                      {activeTask?.explanation}
                    </p>
                  </div>
                </div>

                {/* 2. CHORES / TASKS SIMPLE LIST */}
                <div className="bg-[#0b0b0e] border border-zinc-850 rounded-2xl p-5 md:p-6 space-y-4">
                  <div className="pb-3 border-b border-zinc-850 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Zap size={16} className="text-amber-500" />
                      <h3 className="text-xs sm:text-sm font-bold text-zinc-100">۲. شرح وظایف به زبان ساده</h3>
                    </div>
                    <span className="text-[10px] text-zinc-550 font-mono font-bold uppercase">{currentPage.tasks.length} تسک کلیدی</span>
                  </div>

                  <div className="space-y-3.5">
                    {currentPage.tasks.map((task, idx) => {
                      const taskNumberStr = (idx + 1).toLocaleString('fa-IR', { minimumIntegerDigits: 2 });
                      return (
                        <div 
                          key={task.id}
                          className="bg-[#101014]/50 border border-zinc-850 hover:border-zinc-800 rounded-xl p-4 transition-all"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="text-xs font-bold text-zinc-200 flex items-center gap-1.5">
                              <span className="text-[10px] text-amber-500 bg-amber-500/10 border border-amber-500/20 px-1.5 py-0.5 rounded font-mono">
                                {taskNumberStr}
                              </span>
                              {task.title}
                            </h4>
                            <span className="text-[10px] font-mono text-zinc-550">{task.id}</span>
                          </div>
                          
                          <div className="space-y-2 pl-1 pr-1">
                            <div className="text-[11px] bg-[#0c0c0f] p-2.5 rounded border border-zinc-850 leading-relaxed text-zinc-300">
                              <span className="text-amber-500 font-bold block mb-1">🤔 این بخش چیست؟</span>
                              {task.whatIsIt}
                            </div>
                            <p className="text-xs text-zinc-400 leading-relaxed text-justify">
                              {task.explanation}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </>
            )}
          </>
        ) : (
              // Locked Page state
              <div className="bg-[#0f0f13]/30 border border-zinc-850 rounded-2xl p-8 py-12 text-center space-y-4">
                <div className="w-14 h-14 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500 mx-auto">
                  <Lock size={20} className="text-amber-500/70" />
                </div>
                
                <div className="max-w-md mx-auto space-y-2">
                  <h3 className="text-sm font-bold text-zinc-100">{currentPage.title}</h3>
                  <span className="text-[11px] text-amber-500/95 font-semibold block bg-amber-500/5 py-1 px-3 rounded-full max-w-max mx-auto border border-amber-500/10">
                    🔒 در انتظار تکمیل کدهای فرانت و بارگذاری چانک
                  </span>
                  <p className="text-xs text-zinc-400 leading-relaxed text-justify pt-2">
                    این بخش فعلاً قفل است تا شلوغی ذهنی ایجاد نشود. هرگاه اطلاعات نقشه راه مربوط به این بخش را در قالب فایل‌های متنی ارسال کنید، چارت و وظایف فارسی آن بلافاصه به صورت یکپارچه همین‌جا در اختیار شما قرار می‌گیرد.
                  </p>
                </div>
              </div>
            )}

          </motion.div>
        </AnimatePresence>

      </main>

    </div>
  );
}
