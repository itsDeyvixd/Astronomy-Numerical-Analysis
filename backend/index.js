const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Basic endpoint
app.get('/', (req, res) => {
  res.send('API de Proyecto Astronomía - Análisis Numérico');
});

// Examples of future endpoints based on the topics:
// Kepler's Equation
app.post('/api/kepler', (req, res) => {
    // const { e, M } = req.body;
    res.json({ message: "Kepler endpoint works!" });
});

// Lagrange Points
app.post('/api/lagrange', (req, res) => {
    res.json({ message: "Lagrange endpoint works!" });
});

// Wien's Law
app.post('/api/wien', (req, res) => {
    res.json({ message: "Wien endpoint works!" });
});

// Redshift in Cosmology
app.post('/api/redshift', (req, res) => {
    res.json({ message: "Redshift endpoint works!" });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
