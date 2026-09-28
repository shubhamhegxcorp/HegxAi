import Header from './components/Header';
import Hero from './components/Hero';
import TickerStrip from './components/TickerStrip';
import Services from './components/Services';
import Process from './components/Process';
import Approach from './components/Approach';
import FAQ from './components/FAQ';
import FinalCTA from './components/FinalCTA';
import Footer from './components/Footer';

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <TickerStrip />
        <Services />
        <Process />
        <Approach />
        <FAQ />
        <FinalCTA />
        <Footer />
      </main>
    </>
  );
}


