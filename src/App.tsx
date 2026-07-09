import { Route, Routes, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Works from "./pages/Works";
import Services from "./pages/Services";
import VisualExplore from "./pages/VisualExplore";
import About from "./pages/About";
import Contact from "./pages/Contact";
import CaseStudy from "./pages/CaseStudy";

export default function App() {
  const location = useLocation();

  return (
    <>
      <Header />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Home />} />
          <Route path="/works" element={<Works />} />
          <Route path="/works/:slug" element={<CaseStudy />} />
          <Route path="/services" element={<Services />} />
          <Route path="/visual" element={<VisualExplore />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </AnimatePresence>
      <Footer />
    </>
  );
}
