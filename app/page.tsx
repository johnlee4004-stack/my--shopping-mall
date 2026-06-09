import Header from './components/landing/Header';
import Hero from './components/landing/Hero';
import Services from './components/landing/Services';
import QuoteForm from './components/landing/QuoteForm';
import TrustSection from './components/landing/TrustSection';
import Reviews from './components/landing/Reviews';
import ServiceArea from './components/landing/ServiceArea';
import FloatingContact from './components/landing/FloatingContact';
import Footer from './components/landing/Footer';

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Services />
        <QuoteForm />
        <TrustSection />
        <Reviews />
        <ServiceArea />
      </main>
      <Footer />
      <FloatingContact />
    </>
  );
}
