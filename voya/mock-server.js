// mock-server.js
// Mock server for travel tracker app using Express

const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Mock data
const users = [
  {
    id: '1',
    email: 'arroz@gmail.com',
    password: '123',
    username: 'arroz5',
    aboutMe: 'top xuxa',
  },
  {
    id: '2',
    email: 'batata@gmail.com',
    password: '456',
    username: 'batata7',
    aboutMe: 'adoro viajar',
  },
];

const trips = [
  {
    id: '1',
    userId: '1',
    destination: 'Paris',
    date: '2025-06-10',
    notes: 'Visitar a Torre Eiffel',
  },
  {
    id: '2',
    userId: '2',
    destination: 'Lisboa',
    date: '2025-07-15',
    notes: 'Comer pastel de nata',
  },
];

// Routes

// Mock recommendations data
const recommendations = [
  {
    id: '1',
    userId: '1',
    destinations: [
      { name: 'Roma', reason: 'História e gastronomia' },
      { name: 'Tóquio', reason: 'Cultura e tecnologia' }
    ]
  },
  {
    id: '2',
    userId: '2',
    destinations: [
      { name: 'Madrid', reason: 'Vida noturna' },
      { name: 'Porto', reason: 'Paisagens e vinho' }
    ]
  }
];

// Recommendations endpoint
app.get('/api/recommendations/:userId', (req, res) => {
  const rec = recommendations.find(r => r.userId === req.params.userId);
  if (rec) res.json(rec);
  else res.status(404).json({ error: 'No recommendations found for this user' });
});
app.get('/api/users', (req, res) => {
  res.json(users);
});

app.get('/api/users/:id', (req, res) => {
  const user = users.find(u => u.id === req.params.id);
  if (user) res.json(user);
  else res.status(404).json({ error: 'User not found' });
});

app.get('/api/trips', (req, res) => {
  res.json(trips);
});

app.get('/api/trips/:id', (req, res) => {
  const trip = trips.find(t => t.id === req.params.id);
  if (trip) res.json(trip);
  else res.status(404).json({ error: 'Trip not found' });
});

app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email && u.password === password);
  if (user) res.json({ success: true, user });
  else res.status(401).json({ success: false, error: 'Invalid credentials' });
});

app.listen(PORT, () => {
  console.log(`Mock server running at http://localhost:${PORT}`);
});
