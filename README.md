# Proyecto de Astronomía Computacional · Análisis Numérico

> **Universidad Nacional de Colombia**  
> **Curso:** Análisis Numérico  
> **Despliegue en Vivo:** [Astronomía Numérica · Tarea 2](https://astronomia-numerica-unal-tarea2.artful-scout-2566.chatgpt.site)

---

## 📌 Pregunta Orientadora del Proyecto

> *"¿De qué manera los métodos numéricos de aproximación de raíces permiten resolver modelos astronómicos que carecen de solución matemática exacta?"*

En la física astronómica, las leyes fundamentales frecuentemente generan relaciones trascendentes e integrales que no admiten una primitiva elemental o un despeje algebraico directo. Este proyecto explora cómo los **métodos de búsqueda de raíces** (Bisección, Newton-Raphson e Iteración de Punto Fijo), combinados con las leyes de la **aritmética de punto flotante IEEE 754**, permiten superar estas barreras analíticas y calcular soluciones con exactitud de máquina.

---

## 👥 Equipo y Modelos de Investigación

| Modelo Astronómico | Fenómeno Físico / Ecuación | Métodos Numéricos | Investigador | Estado |
|---|---|---|---|---|
| **Ecuación de Kepler** | Mecánica celeste y órbitas elípticas ($M = E - e\sin(E)$) | Bisección Robusta (Hard Real-Time), Newton, Punto Fijo | **Deyvi Ardila** | ✅ Completo |
| **Corrimiento al Rojo ($z$)** | Cosmología $\Lambda\text{CDM}$ y Supernovas Tipo Ia ($D_L(z) - D_{\text{obs}} = 0$) | Bisección & Cuadratura de Simpson | **Nicolas Betancur** | ✅ Completo |
| **Puntos de Lagrange** | Problema circular restringido de tres cuerpos (Quínticos de Euler para L₁, L₂ y L₃) | Bisección & Newton-Raphson | **German Rodriguez** | ✅ Completo |
| **Ley de Wien** | Radiación de cuerpo negro estelar ($x = 5(1 - e^{-x})$) | Punto Fijo & Newton-Raphson | **Juan Huertas** | ✅ Completo |

---

## 🚀 Arquitectura y Secciones de la Plataforma Web

La aplicación está construida sobre un diseño moderno inspirado en el espacio profundo (*Galaxy Theme*), con transiciones suaves en Framer Motion, soporte responsive para celulares y fórmulas matemáticas renderizadas mediante KaTeX:

* **`00 Inicio`:** Portal general, matriz de modelos astrofísicos y justificación epistemológica del análisis numérico frente al álgebra simbólica.
* **`01 Intuición Inicial`:**
  * Marco físico de cada fenómeno.
  * Origen de las ecuaciones no lineales o trascendentes.
  * Demostración matemática formal (Teorema de Bolzano, monotonía, unicidad, contracción de Banach).
  * **Laboratorio interactivo de órbitas de Kepler:** visualizador orbital SVG en tiempo real (Tierra, Marte, Mercurio, Cometa Halley).
* **`02 Resultados`:**
  * Bancos de prueba con observaciones astronómicas reales.
  * Tablas paso a paso de Bisección con seguimiento de residuo, cota teórica de intervalo y error verdadero.
  * Análisis del **fenómeno de no-monotonicidad del error real** vs la cota teórica.
  * Comparativa de precisión de punto flotante: **Float32 (límite en iteración 24)** vs **Float64 (límite en iteración 53)**.
* **`03 Conclusiones`:**
  * Defensa rigurosa y directa de la pregunta orientadora por cada modelo.
  * Síntesis de aplicaciones en software espacial de misión crítica (**NASA JPL SPICE Toolkit**, constelaciones **GPS/Galileo**, **ESA**).
* **`04 Uso de IA`:** Registro metodológico y bitácora de interacción con modelos de Inteligencia Artificial (Gemini) en el planteamiento inicial de la investigación.

---

## 📂 Documentación Teórica (`docs/`)

En la carpeta `/docs` se encuentran los informes experimentales completos en formato Markdown:
* [`docs/intuicion-inicial.md`](./docs/intuicion-inicial.md): Documento teórico del modelo de Corrimiento al Rojo ($z$) por Nicolas Betancur.
* [`docs/resultados-experimentos-biseccion-v2.md`](./docs/resultados-experimentos-biseccion-v2.md): Reporte experimental y banco de pruebas de supernovas Tipo Ia por Nicolas Betancur.
* [`docs/intuicion-inicial-kepler.md`](./docs/intuicion-inicial-kepler.md): Documento teórico de la Ecuación de Kepler y las tres anomalías orbitales por Deyvi Ardila.
* [`docs/resultados-kepler-biseccion.md`](./docs/resultados-kepler-biseccion.md): Análisis experimental de Bisección, determinismo temporal y límites IEEE 754 por Deyvi Ardila.
* [`docs/lagrange-fundamentos.md`](./docs/lagrange-fundamentos.md): Deducción, métodos y guía para explicar los puntos de Lagrange por German Rodriguez.
* [`docs/resultados-lagrange.md`](./docs/resultados-lagrange.md): Resultados generados de 48 experimentos de precisión y 6 pruebas de semillas, con referencia independiente de 80 dígitos.

### Experimento de Lagrange

Desde la raíz del repositorio, con Python 3 y Node.js disponibles:

```bash
python scripts/experimento_lagrange.py
```

Solo usa la biblioteca estándar de Python y el motor JavaScript compartido con la web. Regenera el informe, las trazas CSV y `frontend/src/lib/lagrangeData.json`. La simulación binary32 redondea los datos, coeficientes y cada operación básica; binary64 usa `Number`. El verificador Decimal calcula errores sin redondear primero la referencia a doble precisión.

En la web: **Intuición inicial / Resultados / Conclusiones → Puntos de Lagrange**. También se puede abrir `#/resultados?modelo=lagrange`. Los controles recalculan los métodos en el navegador; las tablas del experimento publicado y sus descargas provienen de la ejecución del script.

Comprobaciones específicas, desde `frontend`:

```bash
npm run test:lagrange
npm run build
```

---

## 🛠️ Stack Tecnológico

* **Frontend:** React 19, Vite 8, React Router v7
* **Estilos & Animaciones:** Tailwind CSS v4, Framer Motion, Lucide React
* **Matemáticas:** KaTeX (`react-katex`)
* **Gráficos:** Recharts & SVG vectorial dinámico
* **Backend:** Node.js, Express (Scaffold preparado para APIs auxiliares)
* **CI/CD:** GitHub Actions (`.github/workflows/deploy.yml`) con auto-despliegue a **GitHub Pages** en cada push a `main`.

---

## 💻 Instalación y Ejecución Local

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/itsDeyvixd/Astronomy-Numerical-Analysis.git
   cd Astronomy-Numerical-Analysis
   ```

2. **Instalar dependencias del frontend:**
   ```bash
   cd frontend
   npm install
   ```

3. **Iniciar el servidor de desarrollo:**
   ```bash
   npm run dev
   ```
   La aplicación estará disponible en `http://localhost:5173/`.

4. **Compilar para producción:**
   ```bash
   npm run build
   ```
