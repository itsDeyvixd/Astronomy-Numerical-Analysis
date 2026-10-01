import { HashRouter, Route, Routes, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Layout from "./components/Layout.jsx";
import Landing from "./pages/Landing.jsx";
import IntuicionInicial from "./pages/IntuicionInicial.jsx";
import Resultados from "./pages/Resultados.jsx";
import Conclusiones from "./pages/Conclusiones.jsx";
import UsoIA from "./pages/UsoIA.jsx";

function AnimatedRoutes() {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route element={<Layout />}>
          <Route index element={<Landing />} />
          <Route path="intuicion" element={<IntuicionInicial />} />
          <Route path="resultados" element={<Resultados />} />
          <Route path="conclusiones" element={<Conclusiones />} />
          <Route path="uso-ia" element={<UsoIA />} />
          {/* Note: In sections.js, the path is '/ia' or '/uso-ia'? Let's check. */}
          <Route path="ia" element={<UsoIA />} />
        </Route>
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <HashRouter>
      <AnimatedRoutes />
    </HashRouter>
  );
}
