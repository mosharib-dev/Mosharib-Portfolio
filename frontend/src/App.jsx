import { Routes, Route, useLocation } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import CommandPalette from "./components/CommandPalette";
import GlowCursor from "./components/GlowCursor";
import Home from "./pages/Home";
import About from "./pages/About";
import Projects from "./pages/Projects";
import ProjectDetail from "./pages/ProjectDetail";
import Skills from "./pages/Skills";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import Resume from "./pages/Resume";
import Contact from "./pages/Contact";
import Admin from "./pages/Admin";
import Architecture from "./pages/Architecture";
import NotFound from "./pages/NotFound";

export default function App() {
  const [paletteOpen, setPaletteOpen] = useState(false);
  const location = useLocation();

  const closePalette = useCallback(() => setPaletteOpen(false), []);

  useEffect(() => {
    const onKeyDown = (e) => {
      const isCombo = (e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k";
      if (isCombo) {
        e.preventDefault();
        setPaletteOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <div className="flex min-h-screen flex-col">
      <GlowCursor />
      <Navbar onOpenPalette={() => setPaletteOpen(true)} />
      <main className="flex-1">
        <div key={location.pathname} className="animate-page-fade">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/projects/:slug" element={<ProjectDetail />} />
            <Route path="/skills" element={<Skills />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            <Route path="/resume" element={<Resume />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/architecture" element={<Architecture />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </main>
      <Footer />
      <CommandPalette open={paletteOpen} onClose={closePalette} />
    </div>
  );
}