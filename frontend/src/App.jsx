import { HashRouter, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import Landing from "./pages/Landing.jsx";
import IntuicionInicial from "./pages/IntuicionInicial.jsx";
import Resultados from "./pages/Resultados.jsx";
import Conclusiones from "./pages/Conclusiones.jsx";
import UsoIA from "./pages/UsoIA.jsx";

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Landing />} />
          <Route path="intuicion" element={<IntuicionInicial />} />
          <Route path="resultados" element={<Resultados />} />
          <Route path="conclusiones" element={<Conclusiones />} />
          <Route path="uso-ia" element={<UsoIA />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}
