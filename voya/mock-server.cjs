const path = require('path')
const jsonServer = require('json-server')

const PORT = process.env.MOCK_PORT ? Number(process.env.MOCK_PORT) : 3001
const DB_FILE = process.env.MOCK_DB_FILE || path.join(__dirname, 'mock-db.json')

const server = jsonServer.create()
const router = jsonServer.router(DB_FILE)
const middlewares = jsonServer.defaults({
  logger: true,
})

server.use(middlewares)
server.use(jsonServer.bodyParser)

// Small helper: safe array intersection
function intersects(a, b) {
  if (!Array.isArray(a) || !Array.isArray(b)) return false
  const setB = new Set(b)
  return a.some((x) => setB.has(x))
}

// GET /recommendations?userEmail=...
// Returns destinations whose tags match the user's interests.
server.get('/recommendations', (req, res) => {
  const userEmail = (req.query.userEmail || '').toString().trim()

  const destinations = router.db.get('destinations').value() || []
  if (!userEmail) {
    return res.json(destinations)
  }

  const interestsRows = router.db.get('interests').filter({ userEmail }).value()

  const interests = interestsRows.map((r) => r && r.interest).filter(Boolean)

  if (interests.length === 0) {
    return res.json(destinations)
  }

  const recommended = destinations.filter((d) => intersects(d.tags, interests))

  return res.json(recommended)
})

// GET /friends?userEmail=...
// Simple friends list: returns all users except the current one.
server.get('/friends', (req, res) => {
  const userEmail = (req.query.userEmail || '').toString().trim()
  const users = router.db.get('users').value() || []

  const list = userEmail ? users.filter((u) => u.email !== userEmail) : users

  // Avoid leaking passwords in friends listing
  const sanitized = list.map((u) => {
    const { password: _password, ...rest } = u
    void _password
    return rest
  })

  return res.json(sanitized)
})

// Mount default json-server router (CRUD for /users, /interests, /selections, ...)
server.use(router)

server.listen(PORT, () => {
  console.log(`[mock-server] running on http://localhost:${PORT}`)
  console.log(`[mock-server] DB file: ${DB_FILE}`)
})
