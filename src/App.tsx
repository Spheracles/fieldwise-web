import { useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { DemoBanner, Header } from './components/layout/Header';
import { Footer, MobileCTA } from './components/layout/Footer';
import { Hero } from './sections/Hero';
import { Pains } from './sections/Pains';
import { Services } from './sections/Services';
import { Diagnosis } from './sections/Diagnosis';
import { Advantages, Process } from './sections/Advantages';
import { Pricing } from './sections/Pricing';
import { Cases } from './sections/Cases';
import { About, WorkspacePreview } from './sections/About';
import { FAQ, Resources } from './sections/Resources';
import { Contact } from './sections/Contact';
import { ClientWorkspace } from './views/ClientWorkspace';
import { AdminWorkspace } from './views/AdminWorkspace';
import { LegalView } from './views/LegalView';

const TITLES: Record<string, string> = {
  home: '田序共創 FIELDWISE｜農業經營陪跑 × AI 數位轉型',
  'client-demo': '客戶工作台示範｜田序共創 FIELDWISE',
  'admin-demo': '管理者工作台示範｜田序共創 FIELDWISE',
  privacy: '隱私權政策（草稿）｜田序共創 FIELDWISE',
  terms: '服務條款（草稿）｜田序共創 FIELDWISE',
  disclaimer: '免責聲明｜田序共創 FIELDWISE',
};

function HomeView() {
  return (
    <main id="main">
      <Hero />
      <Pains />
      <Services />
      <Diagnosis />
      <Advantages />
      <Process />
      <Pricing />
      <Cases />
      <WorkspacePreview />
      <About />
      <Resources />
      <FAQ />
      <Contact />
    </main>
  );
}

function Shell() {
  const { view } = useApp();
  useEffect(() => {
    document.title = TITLES[view] ?? TITLES.home;
  }, [view]);

  return (
    <>
      <a href="#main" className="sr-only z-[90] rounded-full bg-forest px-4 py-2 text-white focus:not-sr-only focus:fixed focus:left-4 focus:top-4">
        跳到主要內容
      </a>
      <DemoBanner />
      <Header />
      {view === 'home' && <HomeView />}
      {view === 'client-demo' && <ClientWorkspace />}
      {view === 'admin-demo' && <AdminWorkspace />}
      {(view === 'privacy' || view === 'terms' || view === 'disclaimer') && <LegalView doc={view} key={view} />}
      <Footer />
      <MobileCTA />
    </>
  );
}

export default function App() {
  return (
    <AppProvider>
      <Shell />
    </AppProvider>
  );
}
