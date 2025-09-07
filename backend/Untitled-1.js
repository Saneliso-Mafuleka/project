// Create a general table for dashboard records if it doesn't exist
db.query(`
  CREATE TABLE IF NOT EXISTS dashboard_records (
    id INT AUTO_INCREMENT PRIMARY KEY,
    dashboard VARCHAR(50),
    data JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
`, (err) => {
  if (err) {
    console.error('Error creating dashboard_records table:', err.message);
  } else {
    console.log('dashboard_records table checked/created successfully.');
  }
});

// General endpoint to collect data from any dashboard
app.post('/api/records', (req, res) => {
  const { dashboard, data } = req.body;
  if (!dashboard || !data) {
    return res.status(400).json({ error: 'dashboard and data are required.' });
  }
  db.query(
    'INSERT INTO dashboard_records (dashboard, data) VALUES (?, ?)',
    [dashboard, JSON.stringify(data)],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: result.insertId, dashboard, data });
    }
  );
});

// Example for TeacherDashboard
async function saveTeacherDashboardData(data) {
  await fetch('http://localhost:3001/api/records', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      dashboard: 'teacher',
      data, // this can be any object, e.g., registeredStudents, statistics, etc.
    }),
  });
}

// Example for StudentDashboard
async function saveStudentDashboardData(data) {
  await fetch('http://localhost:3001/api/records', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      dashboard: 'student',
      data,
    }),
  });
}

// Example for PrincipalDashboard
async function savePrincipalDashboardData(data) {
  await fetch('http://localhost:3001/api/records', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      dashboard: 'principal',
      data,
    }),
  });
}