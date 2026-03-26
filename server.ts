import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import Database from "better-sqlite3";
import cors from "cors";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const JWT_SECRET = process.env.JWT_SECRET || "lumina-hrms-secret-key-2026";
const PORT = 3000;

// Initialize Database
const db = new Database("hrms.db");

// Database Schema
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'employee',
    name TEXT NOT NULL,
    employee_id TEXT UNIQUE,
    department TEXT,
    designation TEXT,
    join_date TEXT,
    status TEXT DEFAULT 'active',
    is_hipo INTEGER DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS dei_profiles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER UNIQUE NOT NULL,
    gender_identity TEXT,
    ethnicity TEXT,
    disability_status TEXT,
    veteran_status TEXT,
    FOREIGN KEY (user_id) REFERENCES users (id)
  );

  CREATE TABLE IF NOT EXISTS expenses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    category TEXT NOT NULL,
    amount REAL NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'pending',
    applied_at TEXT DEFAULT CURRENT_TIMESTAMP,
    approved_at TEXT,
    FOREIGN KEY (user_id) REFERENCES users (id)
  );

  CREATE TABLE IF NOT EXISTS helpdesk_tickets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    category TEXT NOT NULL,
    subject TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'open',
    priority TEXT DEFAULT 'medium',
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    resolved_at TEXT,
    FOREIGN KEY (user_id) REFERENCES users (id)
  );

  CREATE TABLE IF NOT EXISTS critical_roles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    designation TEXT UNIQUE NOT NULL,
    department TEXT NOT NULL,
    business_impact TEXT,
    risk_level TEXT
  );

  CREATE TABLE IF NOT EXISTS succession_plans (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    critical_role_id INTEGER NOT NULL,
    successor_id INTEGER NOT NULL,
    readiness_level TEXT NOT NULL,
    development_plan TEXT,
    FOREIGN KEY (critical_role_id) REFERENCES critical_roles (id),
    FOREIGN KEY (successor_id) REFERENCES users (id)
  );

  CREATE TABLE IF NOT EXISTS separations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER UNIQUE NOT NULL,
    type TEXT NOT NULL,
    last_working_day TEXT NOT NULL,
    reason TEXT,
    status TEXT DEFAULT 'initiated',
    exit_interview_completed INTEGER DEFAULT 0,
    final_settlement_processed INTEGER DEFAULT 0,
    FOREIGN KEY (user_id) REFERENCES users (id)
  );

  CREATE TABLE IF NOT EXISTS attendance (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    date TEXT NOT NULL,
    clock_in TEXT,
    clock_out TEXT,
    status TEXT,
    FOREIGN KEY (user_id) REFERENCES users (id)
  );

  CREATE TABLE IF NOT EXISTS leave_requests (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    type TEXT NOT NULL,
    start_date TEXT NOT NULL,
    end_date TEXT NOT NULL,
    reason TEXT,
    status TEXT DEFAULT 'pending',
    applied_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id)
  );

  CREATE TABLE IF NOT EXISTS payroll (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    month TEXT NOT NULL,
    year INTEGER NOT NULL,
    basic_salary REAL NOT NULL,
    allowances REAL DEFAULT 0,
    deductions REAL DEFAULT 0,
    net_pay REAL NOT NULL,
    status TEXT DEFAULT 'processed',
    FOREIGN KEY (user_id) REFERENCES users (id)
  );

  CREATE TABLE IF NOT EXISTS goals (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    target_date TEXT,
    progress INTEGER DEFAULT 0,
    status TEXT DEFAULT 'active',
    FOREIGN KEY (user_id) REFERENCES users (id)
  );

  CREATE TABLE IF NOT EXISTS reviews (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    reviewer_id INTEGER NOT NULL,
    cycle TEXT NOT NULL,
    rating INTEGER,
    feedback TEXT,
    status TEXT DEFAULT 'pending',
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id),
    FOREIGN KEY (reviewer_id) REFERENCES users (id)
  );

  CREATE TABLE IF NOT EXISTS requisitions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    department TEXT NOT NULL,
    budget REAL,
    status TEXT DEFAULT 'open',
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS candidates (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    requisition_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    status TEXT DEFAULT 'applied',
    resume_url TEXT,
    FOREIGN KEY (requisition_id) REFERENCES requisitions (id)
  );

  CREATE TABLE IF NOT EXISTS policies (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    content TEXT,
    category TEXT,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS courses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    duration TEXT,
    category TEXT,
    thumbnail TEXT
  );

  CREATE TABLE IF NOT EXISTS enrollments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    course_id INTEGER NOT NULL,
    status TEXT DEFAULT 'enrolled',
    progress INTEGER DEFAULT 0,
    enrolled_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id),
    FOREIGN KEY (course_id) REFERENCES courses (id)
  );

  CREATE TABLE IF NOT EXISTS holidays (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    date TEXT NOT NULL,
    type TEXT DEFAULT 'public'
  );

  CREATE TABLE IF NOT EXISTS grievances (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    subject TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'open',
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id)
  );

  CREATE TABLE IF NOT EXISTS onboarding_tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL,
    status TEXT DEFAULT 'pending',
    priority TEXT DEFAULT 'medium',
    due_date TEXT,
    completed_at TEXT,
    FOREIGN KEY (user_id) REFERENCES users (id)
  );

  CREATE TABLE IF NOT EXISTS notifications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    message TEXT,
    type TEXT DEFAULT 'info',
    is_read INTEGER DEFAULT 0,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id)
  );

  CREATE TABLE IF NOT EXISTS leave_balances (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    leave_type TEXT NOT NULL,
    balance INTEGER NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users (id)
  );

  CREATE TABLE IF NOT EXISTS skills (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    skill_name TEXT NOT NULL,
    proficiency TEXT DEFAULT 'Intermediate',
    FOREIGN KEY (user_id) REFERENCES users (id)
  );

  CREATE TABLE IF NOT EXISTS documents (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    type TEXT NOT NULL,
    size INTEGER NOT NULL,
    data TEXT NOT NULL,
    uploaded_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id)
  );
`);

// Seed Admin User if not exists
const adminExists = db.prepare("SELECT * FROM users WHERE role = 'admin'").get() as any;
if (!adminExists) {
  const hashedPassword = bcrypt.hashSync("admin123", 10);
  const result = db.prepare("INSERT INTO users (email, password, role, name, employee_id, department, designation, join_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?)")
    .run("admin@lumina.com", hashedPassword, "admin", "System Admin", "ADM001", "IT", "Administrator", "2024-01-01");
  
  // Seed some payroll for admin
  db.prepare("INSERT INTO payroll (user_id, month, year, basic_salary, allowances, deductions, net_pay) VALUES (?, ?, ?, ?, ?, ?, ?)")
    .run(result.lastInsertRowid, "March", 2026, 5000, 500, 200, 5300);
  db.prepare("INSERT INTO payroll (user_id, month, year, basic_salary, allowances, deductions, net_pay) VALUES (?, ?, ?, ?, ?, ?, ?)")
    .run(result.lastInsertRowid, "February", 2026, 5000, 500, 200, 5300);

  // Seed Policies
  db.prepare("INSERT INTO policies (title, content, category) VALUES (?, ?, ?)")
    .run("Remote Work Policy", "Guidelines for working from home and remote locations.", "General");
  db.prepare("INSERT INTO policies (title, content, category) VALUES (?, ?, ?)")
    .run("Code of Conduct", "Expected behavior and professional standards.", "Compliance");

  // Seed Courses
  db.prepare("INSERT INTO courses (title, description, duration, category) VALUES (?, ?, ?, ?)")
    .run("Cybersecurity Awareness", "Learn how to stay safe online and protect company data.", "2 hours", "Security");
  db.prepare("INSERT INTO courses (title, description, duration, category) VALUES (?, ?, ?, ?)")
    .run("Leadership 101", "Basics of managing teams and effective communication.", "5 hours", "Management");
  db.prepare("INSERT INTO courses (title, description, duration, category) VALUES (?, ?, ?, ?)")
    .run("React Advanced Patterns", "Master advanced React concepts and performance optimization.", "8 hours", "Engineering");
  db.prepare("INSERT INTO courses (title, description, duration, category) VALUES (?, ?, ?, ?)")
    .run("Product Management Basics", "Understand the product lifecycle and user-centric design.", "4 hours", "Product");
  db.prepare("INSERT INTO courses (title, description, duration, category) VALUES (?, ?, ?, ?)")
    .run("Time Management", "Learn techniques to improve productivity and focus.", "1 hour", "Soft Skills");

  // Seed Requisitions
  db.prepare("INSERT INTO requisitions (title, department, budget) VALUES (?, ?, ?)")
    .run("Senior Frontend Developer", "Engineering", 120000);

  // Seed Holidays
  db.prepare("INSERT INTO holidays (name, date) VALUES (?, ?)")
    .run("New Year's Day", "2026-01-01");
  db.prepare("INSERT INTO holidays (name, date) VALUES (?, ?)")
    .run("Independence Day", "2026-07-04");
  db.prepare("INSERT INTO holidays (name, date) VALUES (?, ?)")
    .run("Christmas Day", "2026-12-25");

// Seed Mock Data if not exists
const janeExists = db.prepare("SELECT * FROM users WHERE email = 'jane@lumina.com'").get();
if (!janeExists) {
  // Seed More Employees
  const hashedPassword = bcrypt.hashSync("password123", 10);
  
  const jane = db.prepare("INSERT INTO users (email, password, role, name, employee_id, department, designation, join_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?)")
    .run("jane@lumina.com", hashedPassword, "employee", "Jane Smith", "EMP001", "Engineering", "Engineering Manager", "2024-02-15");
  
  const bob = db.prepare("INSERT INTO users (email, password, role, name, employee_id, department, designation, join_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?)")
    .run("bob@lumina.com", hashedPassword, "employee", "Bob Johnson", "EMP002", "Engineering", "Senior Developer", "2024-05-10");
  
  const alice = db.prepare("INSERT INTO users (email, password, role, name, employee_id, department, designation, join_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?)")
    .run("alice@lumina.com", hashedPassword, "employee", "Alice Williams", "EMP003", "HR", "HR Specialist", "2024-08-20");

  const userIds = [jane.lastInsertRowid, bob.lastInsertRowid, alice.lastInsertRowid];

  // Seed Attendance
  const dates = ["2026-03-25", "2026-03-24", "2026-03-23", "2026-03-20", "2026-03-19"];
  userIds.forEach(uid => {
    dates.forEach(date => {
      db.prepare("INSERT INTO attendance (user_id, date, clock_in, clock_out, status) VALUES (?, ?, ?, ?, ?)")
        .run(uid, date, "09:00:00 AM", "06:00:00 PM", "present");
    });
  });

  // Seed Leave Requests
  db.prepare("INSERT INTO leave_requests (user_id, type, start_date, end_date, reason, status) VALUES (?, ?, ?, ?, ?, ?)")
    .run(bob.lastInsertRowid, "Vacation", "2026-04-10", "2026-04-15", "Family trip", "pending");
  db.prepare("INSERT INTO leave_requests (user_id, type, start_date, end_date, reason, status) VALUES (?, ?, ?, ?, ?, ?)")
    .run(alice.lastInsertRowid, "Sick", "2026-03-10", "2026-03-11", "Flu", "approved");

  // Seed Payroll
  userIds.forEach(uid => {
    db.prepare("INSERT INTO payroll (user_id, month, year, basic_salary, allowances, deductions, net_pay) VALUES (?, ?, ?, ?, ?, ?, ?)")
      .run(uid, "February", 2026, 4000, 400, 150, 4250);
  });

  // Seed Goals
  db.prepare("INSERT INTO goals (user_id, title, description, target_date, progress) VALUES (?, ?, ?, ?, ?)")
    .run(bob.lastInsertRowid, "Complete Project X", "Finish all modules for Project X", "2026-05-01", 65);
  db.prepare("INSERT INTO goals (user_id, title, description, target_date, progress) VALUES (?, ?, ?, ?, ?)")
    .run(jane.lastInsertRowid, "Team Expansion", "Hire 3 new developers", "2026-06-30", 30);

  // Seed Reviews
  db.prepare("INSERT INTO reviews (user_id, reviewer_id, cycle, rating, feedback, status) VALUES (?, ?, ?, ?, ?, ?)")
    .run(bob.lastInsertRowid, adminExists ? adminExists.id : 1, "Annual 2025", 5, "Excellent performance and technical skills.", "completed");

  // Seed Candidates
  const reqResult = db.prepare("SELECT id FROM requisitions LIMIT 1").get() as any;
  if (reqResult) {
    db.prepare("INSERT INTO candidates (requisition_id, name, email, status) VALUES (?, ?, ?, ?)")
      .run(reqResult.id, "John Doe", "john.doe@example.com", "interviewing");
    db.prepare("INSERT INTO candidates (requisition_id, name, email, status) VALUES (?, ?, ?, ?)")
      .run(reqResult.id, "Sarah Miller", "sarah.m@example.com", "applied");
  }

  // Seed Grievances
  db.prepare("INSERT INTO grievances (user_id, subject, description, status) VALUES (?, ?, ?, ?)")
    .run(bob.lastInsertRowid, "Office Temperature", "The office is too cold in the mornings.", "open");

  // Seed Leave Balances
  const allUserIds = [adminExists ? adminExists.id : 1, ...userIds];
  const leaveTypes = ["Earned Leave", "Sick Leave", "Casual Leave"];
  const initialBalances: Record<string, number> = {
    "Earned Leave": 15,
    "Sick Leave": 10,
    "Casual Leave": 8
  };

  allUserIds.forEach(uid => {
    if (uid) {
      leaveTypes.forEach(type => {
        db.prepare("INSERT INTO leave_balances (user_id, leave_type, balance) VALUES (?, ?, ?)")
          .run(uid, type, initialBalances[type]);
      });
    }
  });
}
}

async function startServer() {
  const app = express();
  app.use(cors());
  app.use(express.json());

  // Auth Middleware
  const authenticateToken = (req: any, res: any, next: any) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.sendStatus(401);

    jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
      if (err) return res.sendStatus(403);
      req.user = user;
      next();
    });
  };

  // API Routes
  app.post("/api/auth/login", (req, res) => {
    const { email, password } = req.body;
    const user = db.prepare("SELECT * FROM users WHERE email = ?").get(email) as any;

    if (!user || !bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '24h' });
    const { password: _, ...userWithoutPassword } = user;
    res.json({ token, user: userWithoutPassword });
  });

  app.get("/api/me", authenticateToken, (req: any, res) => {
    const user = db.prepare("SELECT id, email, role, name, employee_id, department, designation, join_date FROM users WHERE id = ?").get(req.user.id);
    res.json(user);
  });

  // Employee Routes
  app.get("/api/employees", authenticateToken, (req: any, res) => {
    if (req.user.role !== 'admin') return res.sendStatus(403);
    const employees = db.prepare("SELECT id, email, role, name, employee_id, department, designation, join_date, status FROM users").all();
    res.json(employees);
  });

  app.post("/api/employees", authenticateToken, (req: any, res) => {
    if (req.user.role !== 'admin') return res.sendStatus(403);
    const { email, password, name, employee_id, department, designation, join_date, role } = req.body;
    const hashedPassword = bcrypt.hashSync(password || "password123", 10);
    try {
      const result = db.prepare("INSERT INTO users (email, password, name, employee_id, department, designation, join_date, role) VALUES (?, ?, ?, ?, ?, ?, ?, ?)")
        .run(email, hashedPassword, name, employee_id, department, designation, join_date, role || 'employee');
      
      const newUserId = result.lastInsertRowid;

      // Automate Onboarding Tasks
      const onboardingTasks = [
        { title: "Submit ID Documents", description: "Upload your passport or national ID.", category: "HR" },
        { title: "Sign Employment Contract", description: "Review and sign the digital contract.", category: "HR" },
        { title: "IT System Setup", description: "Configure your workstation and email.", category: "IT" },
        { title: "Introductory Training", description: "Complete the 'Welcome to Lumina' course.", category: "Training" },
        { title: "Meet the Team", description: "Schedule introductory calls with your department.", category: "Admin" }
      ];

      const stmt = db.prepare("INSERT INTO onboarding_tasks (user_id, title, description, category, due_date, priority) VALUES (?, ?, ?, ?, ?, ?)");
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + 7);
      const dueDateStr = dueDate.toISOString().split('T')[0];

      onboardingTasks.forEach((task, idx) => {
        const priority = idx < 2 ? 'high' : idx < 4 ? 'medium' : 'low';
        stmt.run(newUserId, task.title, task.description, task.category, dueDateStr, priority);
      });

      // Create Notification for the new employee
      db.prepare("INSERT INTO notifications (user_id, title, message, type) VALUES (?, ?, ?, ?)")
        .run(newUserId, "Welcome to Lumina!", "Your onboarding journey has started. Check your tasks.", "success");

      // Notify Admins/IT/HR (In a real app, we'd notify specific users with these roles)
      const admins = db.prepare("SELECT id FROM users WHERE role = 'admin'").all() as any[];
      admins.forEach(admin => {
        db.prepare("INSERT INTO notifications (user_id, title, message, type) VALUES (?, ?, ?, ?)")
          .run(admin.id, "New Hire Onboarding", `Onboarding started for ${name} (${employee_id}).`, "info");
      });

      res.status(201).json({ id: newUserId });
    } catch (e: any) {
      res.status(400).json({ message: e.message });
    }
  });

  // Attendance Routes
  app.post("/api/attendance/clock-in", authenticateToken, (req: any, res) => {
    const now = new Date();
    const date = now.toISOString().split('T')[0];
    const time = now.toLocaleTimeString();
    
    const existing = db.prepare("SELECT * FROM attendance WHERE user_id = ? AND date = ?").get(req.user.id, date);
    if (existing) return res.status(400).json({ message: "Already clocked in today" });

    db.prepare("INSERT INTO attendance (user_id, date, clock_in, status) VALUES (?, ?, ?, ?)")
      .run(req.user.id, date, time, 'present');
    res.json({ message: "Clocked in successfully", time });
  });

  app.post("/api/attendance/clock-out", authenticateToken, (req: any, res) => {
    const now = new Date();
    const date = now.toISOString().split('T')[0];
    const time = now.toLocaleTimeString();

    const result = db.prepare("UPDATE attendance SET clock_out = ? WHERE user_id = ? AND date = ? AND clock_out IS NULL")
      .run(time, req.user.id, date);
    
    if (result.changes === 0) return res.status(400).json({ message: "Not clocked in or already clocked out" });
    res.json({ message: "Clocked out successfully", time });
  });

  app.get("/api/attendance/me", authenticateToken, (req: any, res) => {
    const history = db.prepare("SELECT * FROM attendance WHERE user_id = ? ORDER BY date DESC LIMIT 30").all(req.user.id);
    res.json(history);
  });

  // Leave Routes
  app.post("/api/leaves", authenticateToken, (req: any, res) => {
    const { type, start_date, end_date, reason } = req.body;
    db.prepare("INSERT INTO leave_requests (user_id, type, start_date, end_date, reason) VALUES (?, ?, ?, ?, ?)")
      .run(req.user.id, type, start_date, end_date, reason);
    res.status(201).json({ message: "Leave request submitted" });
  });

  app.get("/api/leaves/me", authenticateToken, (req: any, res) => {
    const leaves = db.prepare("SELECT * FROM leave_requests WHERE user_id = ? ORDER BY applied_at DESC").all(req.user.id);
    res.json(leaves);
  });

  app.get("/api/leaves/balances", authenticateToken, (req: any, res) => {
    const balances = db.prepare("SELECT * FROM leave_balances WHERE user_id = ?").all(req.user.id);
    res.json(balances);
  });

  app.get("/api/admin/leaves", authenticateToken, (req: any, res) => {
    if (req.user.role !== 'admin') return res.sendStatus(403);
    const leaves = db.prepare(`
      SELECT l.*, u.name as employee_name 
      FROM leave_requests l 
      JOIN users u ON l.user_id = u.id 
      ORDER BY l.applied_at DESC
    `).all();
    res.json(leaves);
  });

  app.patch("/api/admin/leaves/:id", authenticateToken, (req: any, res) => {
    if (req.user.role !== 'admin') return res.sendStatus(403);
    const { status } = req.body;
    db.prepare("UPDATE leave_requests SET status = ? WHERE id = ?").run(status, req.params.id);
    res.json({ message: "Leave status updated" });
  });

  // Payroll Routes
  app.get("/api/payroll/me", authenticateToken, (req: any, res) => {
    const payrolls = db.prepare("SELECT * FROM payroll WHERE user_id = ? ORDER BY year DESC, month DESC").all(req.user.id);
    res.json(payrolls);
  });

  app.get("/api/admin/payroll", authenticateToken, (req: any, res) => {
    if (req.user.role !== 'admin') return res.sendStatus(403);
    const payrolls = db.prepare(`
      SELECT p.*, u.name as employee_name, u.employee_id 
      FROM payroll p 
      JOIN users u ON p.user_id = u.id 
      ORDER BY p.year DESC, p.month DESC
    `).all();
    res.json(payrolls);
  });

  app.post("/api/admin/payroll", authenticateToken, (req: any, res) => {
    if (req.user.role !== 'admin') return res.sendStatus(403);
    const { user_id, month, year, basic_salary, allowances, deductions, net_pay } = req.body;
    db.prepare("INSERT INTO payroll (user_id, month, year, basic_salary, allowances, deductions, net_pay) VALUES (?, ?, ?, ?, ?, ?, ?)")
      .run(user_id, month, year, basic_salary, allowances, deductions, net_pay);
    res.status(201).json({ message: "Payroll record created" });
  });

  // Performance Routes
  app.get("/api/goals/me", authenticateToken, (req: any, res) => {
    const goals = db.prepare("SELECT * FROM goals WHERE user_id = ?").all(req.user.id);
    res.json(goals);
  });

  app.post("/api/goals", authenticateToken, (req: any, res) => {
    const { title, description, target_date } = req.body;
    db.prepare("INSERT INTO goals (user_id, title, description, target_date) VALUES (?, ?, ?, ?)")
      .run(req.user.id, title, description, target_date);
    res.status(201).json({ message: "Goal created" });
  });

  app.get("/api/reviews/me", authenticateToken, (req: any, res) => {
    const reviews = db.prepare(`
      SELECT r.*, u.name as reviewer_name 
      FROM reviews r 
      JOIN users u ON r.reviewer_id = u.id 
      WHERE r.user_id = ?
    `).all(req.user.id);
    res.json(reviews);
  });

  // Recruitment Routes
  app.get("/api/requisitions", authenticateToken, (req: any, res) => {
    if (req.user.role !== 'admin') return res.sendStatus(403);
    const reqs = db.prepare("SELECT * FROM requisitions ORDER BY created_at DESC").all();
    res.json(reqs);
  });

  app.post("/api/requisitions", authenticateToken, (req: any, res) => {
    if (req.user.role !== 'admin') return res.sendStatus(403);
    const { title, department, budget } = req.body;
    db.prepare("INSERT INTO requisitions (title, department, budget) VALUES (?, ?, ?)")
      .run(title, department, budget);
    res.status(201).json({ message: "Requisition created" });
  });

  app.get("/api/candidates", authenticateToken, (req: any, res) => {
    if (req.user.role !== 'admin') return res.sendStatus(403);
    const candidates = db.prepare(`
      SELECT c.*, r.title as job_title 
      FROM candidates c 
      JOIN requisitions r ON c.requisition_id = r.id
    `).all();
    res.json(candidates);
  });

  // Policy Routes
  app.get("/api/policies", authenticateToken, (req: any, res) => {
    const policies = db.prepare("SELECT * FROM policies").all();
    res.json(policies);
  });

  // Analytics Routes
  app.get("/api/analytics/dashboard", authenticateToken, (req: any, res) => {
    if (req.user.role !== 'admin') return res.sendStatus(403);
    const totalEmployees = db.prepare("SELECT COUNT(*) as count FROM users WHERE role = 'employee'").get() as any;
    const pendingLeaves = db.prepare("SELECT COUNT(*) as count FROM leave_requests WHERE status = 'pending'").get() as any;
    const openGrievances = db.prepare("SELECT COUNT(*) as count FROM grievances WHERE status = 'open'").get() as any;
    const activeRequisitions = db.prepare("SELECT COUNT(*) as count FROM requisitions WHERE status = 'open'").get() as any;
    
    res.json({
      totalEmployees: totalEmployees.count,
      pendingLeaves: pendingLeaves.count,
      openGrievances: openGrievances.count,
      activeRequisitions: activeRequisitions.count
    });
  });

  app.get("/api/analytics/headcount", authenticateToken, (req: any, res) => {
    if (req.user.role !== 'admin') return res.sendStatus(403);
    const data = db.prepare("SELECT department, COUNT(*) as count FROM users GROUP BY department").all();
    res.json(data);
  });

  app.get("/api/analytics/payroll-trends", authenticateToken, (req: any, res) => {
    if (req.user.role !== 'admin') return res.sendStatus(403);
    const data = db.prepare("SELECT month, year, SUM(net_pay) as total FROM payroll GROUP BY month, year ORDER BY year, month").all();
    res.json(data);
  });

  app.get("/api/analytics/leave-patterns", authenticateToken, (req: any, res) => {
    if (req.user.role !== 'admin') return res.sendStatus(403);
    const data = db.prepare(`
      SELECT leave_type, COUNT(*) as count 
      FROM leave_requests 
      WHERE status = 'approved' 
      GROUP BY leave_type
    `).all();
    res.json(data);
  });

  app.get("/api/analytics/training-completion", authenticateToken, (req: any, res) => {
    if (req.user.role !== 'admin') return res.sendStatus(403);
    const data = db.prepare(`
      SELECT 
        CASE 
          WHEN progress = 100 THEN 'Completed' 
          WHEN progress > 0 THEN 'In Progress' 
          ELSE 'Not Started' 
        END as status, 
        COUNT(*) as count 
      FROM enrollments 
      GROUP BY status
    `).all();
    res.json(data);
  });

  app.get("/api/analytics/turnover", authenticateToken, (req: any, res) => {
    if (req.user.role !== 'admin') return res.sendStatus(403);
    // Mocking turnover data for visualization
    const data = [
      { month: 'Jan', rate: 1.2 },
      { month: 'Feb', rate: 0.8 },
      { month: 'Mar', rate: 1.5 },
      { month: 'Apr', rate: 1.1 },
      { month: 'May', rate: 0.9 },
      { month: 'Jun', rate: 1.3 },
    ];
    res.json(data);
  });

  // Skills Routes
  app.get("/api/skills/:userId", authenticateToken, (req: any, res) => {
    const skills = db.prepare("SELECT * FROM skills WHERE user_id = ?").all(req.params.userId);
    res.json(skills);
  });

  app.post("/api/skills", authenticateToken, (req: any, res) => {
    const { user_id, skill_name, proficiency } = req.body;
    
    // Only admin or the user themselves can add skills
    if (req.user.role !== 'admin' && req.user.id !== parseInt(user_id)) {
      return res.sendStatus(403);
    }

    db.prepare("INSERT INTO skills (user_id, skill_name, proficiency) VALUES (?, ?, ?)")
      .run(user_id, skill_name, proficiency || 'Intermediate');
    res.status(201).json({ message: "Skill added" });
  });

  app.delete("/api/skills/:skillId", authenticateToken, (req: any, res) => {
    const skill = db.prepare("SELECT * FROM skills WHERE id = ?").get(req.params.skillId) as any;
    if (!skill) return res.status(404).json({ message: "Skill not found" });

    // Only admin or the user themselves can delete skills
    if (req.user.role !== 'admin' && req.user.id !== skill.user_id) {
      return res.sendStatus(403);
    }

    db.prepare("DELETE FROM skills WHERE id = ?").run(req.params.skillId);
    res.json({ message: "Skill removed" });
  });

  app.put("/api/skills/:skillId", authenticateToken, (req: any, res) => {
    const { skill_name, proficiency } = req.body;
    const skill = db.prepare("SELECT * FROM skills WHERE id = ?").get(req.params.skillId) as any;
    if (!skill) return res.status(404).json({ message: "Skill not found" });

    // Only admin or the user themselves can edit skills
    if (req.user.role !== 'admin' && req.user.id !== skill.user_id) {
      return res.sendStatus(403);
    }

    db.prepare("UPDATE skills SET skill_name = ?, proficiency = ? WHERE id = ?")
      .run(skill_name, proficiency, req.params.skillId);
    res.json({ message: "Skill updated" });
  });

  // Document Routes
  app.get("/api/documents/:userId", authenticateToken, (req: any, res) => {
    // Only admin or the user themselves can view documents
    if (req.user.role !== 'admin' && req.user.id !== parseInt(req.params.userId)) {
      return res.sendStatus(403);
    }
    const documents = db.prepare("SELECT id, user_id, name, type, size, uploaded_at FROM documents WHERE user_id = ?").all(req.params.userId);
    res.json(documents);
  });

  app.get("/api/documents/download/:id", authenticateToken, (req: any, res) => {
    const doc = db.prepare("SELECT * FROM documents WHERE id = ?").get(req.params.id) as any;
    if (!doc) return res.status(404).json({ message: "Document not found" });

    // Only admin or the owner can download
    if (req.user.role !== 'admin' && req.user.id !== doc.user_id) {
      return res.sendStatus(403);
    }
    res.json({ data: doc.data, type: doc.type, name: doc.name });
  });

  app.post("/api/documents", authenticateToken, (req: any, res) => {
    const { user_id, name, type, size, data } = req.body;
    
    // Only admin or the user themselves can upload
    if (req.user.role !== 'admin' && req.user.id !== parseInt(user_id)) {
      return res.sendStatus(403);
    }

    db.prepare("INSERT INTO documents (user_id, name, type, size, data) VALUES (?, ?, ?, ?, ?)")
      .run(user_id, name, type, size, data);
    res.status(201).json({ message: "Document uploaded" });
  });

  app.delete("/api/documents/:id", authenticateToken, (req: any, res) => {
    const doc = db.prepare("SELECT * FROM documents WHERE id = ?").get(req.params.id) as any;
    if (!doc) return res.status(404).json({ message: "Document not found" });

    // Only admin or the owner can delete
    if (req.user.role !== 'admin' && req.user.id !== doc.user_id) {
      return res.sendStatus(403);
    }

    db.prepare("DELETE FROM documents WHERE id = ?").run(req.params.id);
    res.json({ message: "Document deleted" });
  });

  // Learning Routes
  app.get("/api/courses", authenticateToken, (req: any, res) => {
    const courses = db.prepare("SELECT * FROM courses").all();
    res.json(courses);
  });

  app.get("/api/enrollments/me", authenticateToken, (req: any, res) => {
    const enrollments = db.prepare(`
      SELECT e.*, c.title, c.category, c.duration 
      FROM enrollments e 
      JOIN courses c ON e.course_id = c.id 
      WHERE e.user_id = ?
    `).all(req.user.id);
    res.json(enrollments);
  });

  app.post("/api/enrollments", authenticateToken, (req: any, res) => {
    const { course_id } = req.body;
    db.prepare("INSERT INTO enrollments (user_id, course_id) VALUES (?, ?)").run(req.user.id, course_id);
    res.status(201).json({ message: "Enrolled successfully" });
  });

  app.patch("/api/enrollments/:id", authenticateToken, (req: any, res) => {
    const { progress } = req.body;
    const status = progress === 100 ? 'completed' : 'in-progress';
    db.prepare("UPDATE enrollments SET progress = ?, status = ? WHERE id = ? AND user_id = ?")
      .run(progress, status, req.params.id, req.user.id);
    res.json({ message: "Progress updated" });
  });

  // Org Chart Route
  app.get("/api/org-chart", authenticateToken, (req: any, res) => {
    const employees = db.prepare("SELECT id, name, designation, department, employee_id FROM users").all();
    res.json(employees);
  });

  // Holiday Routes
  app.get("/api/holidays", authenticateToken, (req: any, res) => {
    const holidays = db.prepare("SELECT * FROM holidays ORDER BY date ASC").all();
    res.json(holidays);
  });

  // Grievance Routes
  app.get("/api/grievances/me", authenticateToken, (req: any, res) => {
    const grievances = db.prepare("SELECT * FROM grievances WHERE user_id = ? ORDER BY created_at DESC").all(req.user.id);
    res.json(grievances);
  });

  app.post("/api/grievances", authenticateToken, (req: any, res) => {
    const { subject, description } = req.body;
    db.prepare("INSERT INTO grievances (user_id, subject, description) VALUES (?, ?, ?)")
      .run(req.user.id, subject, description);
    res.status(201).json({ message: "Grievance submitted" });
  });

  app.get("/api/admin/grievances", authenticateToken, (req: any, res) => {
    if (req.user.role !== 'admin') return res.sendStatus(403);
    const grievances = db.prepare(`
      SELECT g.*, u.name as employee_name 
      FROM grievances g 
      JOIN users u ON g.user_id = u.id 
      ORDER BY g.created_at DESC
    `).all();
    res.json(grievances);
  });

  // Admin Management Routes
  app.get("/api/admin/attendance", authenticateToken, (req: any, res) => {
    if (req.user.role !== 'admin') return res.sendStatus(403);
    const attendance = db.prepare(`
      SELECT a.*, u.name as employee_name, u.employee_id 
      FROM attendance a 
      JOIN users u ON a.user_id = u.id 
      ORDER BY a.date DESC
    `).all();
    res.json(attendance);
  });

  app.patch("/api/admin/employees/:id", authenticateToken, (req: any, res) => {
    if (req.user.role !== 'admin') return res.sendStatus(403);
    const { id } = req.params;
    const { name, department, designation, status, role } = req.body;
    db.prepare("UPDATE users SET name = ?, department = ?, designation = ?, status = ?, role = ? WHERE id = ?")
      .run(name, department, designation, status, role, id);
    res.json({ message: "Employee updated" });
  });

  app.patch("/api/admin/requisitions/:id", authenticateToken, (req: any, res) => {
    if (req.user.role !== 'admin') return res.sendStatus(403);
    const { id } = req.params;
    const { status } = req.body;
    db.prepare("UPDATE requisitions SET status = ? WHERE id = ?").run(status, id);
    res.json({ message: "Requisition updated" });
  });

  app.patch("/api/admin/candidates/:id", authenticateToken, (req: any, res) => {
    if (req.user.role !== 'admin') return res.sendStatus(403);
    const { id } = req.params;
    const { status } = req.body;
    db.prepare("UPDATE candidates SET status = ? WHERE id = ?").run(status, id);
    res.json({ message: "Candidate updated" });
  });

  app.post("/api/admin/goals", authenticateToken, (req: any, res) => {
    if (req.user.role !== 'admin') return res.sendStatus(403);
    const { user_id, title, target_date } = req.body;
    db.prepare("INSERT INTO goals (user_id, title, target_date) VALUES (?, ?, ?)")
      .run(user_id, title, target_date);
    res.status(201).json({ message: "Goal assigned" });
  });

  app.post("/api/admin/reviews", authenticateToken, (req: any, res) => {
    if (req.user.role !== 'admin') return res.sendStatus(403);
    const { user_id, cycle, rating, feedback } = req.body;
    db.prepare("INSERT INTO reviews (user_id, reviewer_id, cycle, rating, feedback) VALUES (?, ?, ?, ?, ?)")
      .run(user_id, req.user.id, cycle, rating, feedback);
    res.status(201).json({ message: "Review submitted" });
  });

  app.get("/api/admin/reviews", authenticateToken, (req: any, res) => {
    if (req.user.role !== 'admin') return res.sendStatus(403);
    const reviews = db.prepare(`
      SELECT r.*, u.name as employee_name, rv.name as reviewer_name 
      FROM reviews r 
      JOIN users u ON r.user_id = u.id 
      JOIN users rv ON r.reviewer_id = rv.id 
      ORDER BY r.created_at DESC
    `).all();
    res.json(reviews);
  });

  // Onboarding Routes
  app.get("/api/onboarding/me", authenticateToken, (req: any, res) => {
    const tasks = db.prepare("SELECT * FROM onboarding_tasks WHERE user_id = ? ORDER BY status DESC, id ASC").all(req.user.id);
    res.json(tasks);
  });

  app.patch("/api/onboarding/tasks/:id", authenticateToken, (req: any, res) => {
    const { status, priority } = req.body;
    const completedAt = status === 'completed' ? new Date().toISOString() : null;
    
    let query = "UPDATE onboarding_tasks SET ";
    const params: any[] = [];
    if (status !== undefined) {
      query += "status = ?, completed_at = ? ";
      params.push(status, completedAt);
    }
    if (priority !== undefined) {
      if (status !== undefined) query += ", ";
      query += "priority = ? ";
      params.push(priority);
    }
    query += "WHERE id = ? AND user_id = ?";
    params.push(req.params.id, req.user.id);

    const result = db.prepare(query).run(...params);
    
    if (result.changes === 0) return res.status(404).json({ message: "Task not found" });
    res.json({ message: "Task updated" });
  });

  app.get("/api/admin/onboarding", authenticateToken, (req: any, res) => {
    if (req.user.role !== 'admin') return res.sendStatus(403);
    const progress = db.prepare(`
      SELECT u.name, u.employee_id, u.department,
             COUNT(t.id) as total_tasks,
             SUM(CASE WHEN t.status = 'completed' THEN 1 ELSE 0 END) as completed_tasks
      FROM users u
      JOIN onboarding_tasks t ON u.id = t.user_id
      GROUP BY u.id
    `).all();
    res.json(progress);
  });

  // Notification Routes
  app.get("/api/notifications/me", authenticateToken, (req: any, res) => {
    const notifications = db.prepare("SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT 50").all(req.user.id);
    res.json(notifications);
  });

  // DEI Routes
  app.get("/api/dei/me", authenticateToken, (req: any, res) => {
    const profile = db.prepare("SELECT * FROM dei_profiles WHERE user_id = ?").get(req.user.id);
    res.json(profile || {});
  });

  app.post("/api/dei/me", authenticateToken, (req: any, res) => {
    const { gender_identity, ethnicity, disability_status, veteran_status } = req.body;
    const existing = db.prepare("SELECT id FROM dei_profiles WHERE user_id = ?").get(req.user.id);
    if (existing) {
      db.prepare("UPDATE dei_profiles SET gender_identity = ?, ethnicity = ?, disability_status = ?, veteran_status = ? WHERE user_id = ?")
        .run(gender_identity, ethnicity, disability_status, veteran_status, req.user.id);
    } else {
      db.prepare("INSERT INTO dei_profiles (user_id, gender_identity, ethnicity, disability_status, veteran_status) VALUES (?, ?, ?, ?, ?)")
        .run(req.user.id, gender_identity, ethnicity, disability_status, veteran_status);
    }
    res.json({ message: "DEI profile updated" });
  });

  app.get("/api/admin/dei/stats", authenticateToken, (req: any, res) => {
    if (req.user.role !== 'admin') return res.sendStatus(403);
    const genderStats = db.prepare("SELECT gender_identity as label, COUNT(*) as value FROM dei_profiles GROUP BY gender_identity").all();
    const ethnicityStats = db.prepare("SELECT ethnicity as label, COUNT(*) as value FROM dei_profiles GROUP BY ethnicity").all();
    const disabilityStats = db.prepare("SELECT disability_status as label, COUNT(*) as value FROM dei_profiles GROUP BY disability_status").all();
    const veteranStats = db.prepare("SELECT veteran_status as label, COUNT(*) as value FROM dei_profiles GROUP BY veteran_status").all();
    res.json({ genderStats, ethnicityStats, disabilityStats, veteranStats });
  });

  // Expense Routes
  app.get("/api/expenses/me", authenticateToken, (req: any, res) => {
    const expenses = db.prepare("SELECT * FROM expenses WHERE user_id = ? ORDER BY applied_at DESC").all(req.user.id);
    res.json(expenses);
  });

  app.post("/api/expenses", authenticateToken, (req: any, res) => {
    const { category, amount, description } = req.body;
    db.prepare("INSERT INTO expenses (user_id, category, amount, description) VALUES (?, ?, ?, ?)")
      .run(req.user.id, category, amount, description);
    res.status(201).json({ message: "Expense claim submitted" });
  });

  app.delete("/api/expenses/:id", authenticateToken, (req: any, res) => {
    const expense = db.prepare("SELECT * FROM expenses WHERE id = ?").get(req.params.id) as any;
    if (!expense) return res.status(404).json({ message: "Expense not found" });
    if (expense.user_id !== req.user.id && req.user.role !== 'admin') return res.sendStatus(403);
    if (expense.status !== 'pending' && req.user.role !== 'admin') return res.status(400).json({ message: "Cannot delete processed expense" });

    db.prepare("DELETE FROM expenses WHERE id = ?").run(req.params.id);
    res.json({ message: "Expense deleted" });
  });

  app.get("/api/admin/expenses", authenticateToken, (req: any, res) => {
    if (req.user.role !== 'admin') return res.sendStatus(403);
    const expenses = db.prepare(`
      SELECT e.*, u.name as employee_name 
      FROM expenses e 
      JOIN users u ON e.user_id = u.id 
      ORDER BY e.applied_at DESC
    `).all();
    res.json(expenses);
  });

  app.patch("/api/admin/expenses/:id", authenticateToken, (req: any, res) => {
    if (req.user.role !== 'admin') return res.sendStatus(403);
    const { status } = req.body;
    const approvedAt = status === 'approved' ? new Date().toISOString() : null;
    db.prepare("UPDATE expenses SET status = ?, approved_at = ? WHERE id = ?").run(status, approvedAt, req.params.id);
    res.json({ message: "Expense status updated" });
  });

  // Helpdesk Routes
  app.get("/api/helpdesk/tickets/me", authenticateToken, (req: any, res) => {
    const tickets = db.prepare("SELECT * FROM helpdesk_tickets WHERE user_id = ? ORDER BY created_at DESC").all(req.user.id);
    res.json(tickets);
  });

  app.post("/api/helpdesk/tickets", authenticateToken, (req: any, res) => {
    const { category, subject, description, priority } = req.body;
    db.prepare("INSERT INTO helpdesk_tickets (user_id, category, subject, description, priority) VALUES (?, ?, ?, ?, ?)")
      .run(req.user.id, category, subject, description, priority || 'medium');
    res.status(201).json({ message: "Ticket created" });
  });

  app.patch("/api/helpdesk/tickets/:id", authenticateToken, (req: any, res) => {
    const { status } = req.body;
    const ticket = db.prepare("SELECT * FROM helpdesk_tickets WHERE id = ?").get(req.params.id) as any;
    if (!ticket) return res.status(404).json({ message: "Ticket not found" });
    if (ticket.user_id !== req.user.id) return res.sendStatus(403);

    db.prepare("UPDATE helpdesk_tickets SET status = ? WHERE id = ?").run(status, req.params.id);
    res.json({ message: "Ticket updated" });
  });

  app.get("/api/admin/helpdesk/tickets", authenticateToken, (req: any, res) => {
    if (req.user.role !== 'admin') return res.sendStatus(403);
    const tickets = db.prepare(`
      SELECT t.*, u.name as employee_name 
      FROM helpdesk_tickets t 
      JOIN users u ON t.user_id = u.id 
      ORDER BY t.created_at DESC
    `).all();
    res.json(tickets);
  });

  app.patch("/api/admin/helpdesk/tickets/:id", authenticateToken, (req: any, res) => {
    if (req.user.role !== 'admin') return res.sendStatus(403);
    const { status } = req.body;
    const resolvedAt = status === 'resolved' ? new Date().toISOString() : null;
    db.prepare("UPDATE helpdesk_tickets SET status = ?, resolved_at = ? WHERE id = ?").run(status, resolvedAt, req.params.id);
    res.json({ message: "Ticket status updated" });
  });

  // Succession Routes
  app.get("/api/admin/succession/critical-roles", authenticateToken, (req: any, res) => {
    if (req.user.role !== 'admin') return res.sendStatus(403);
    const roles = db.prepare("SELECT * FROM critical_roles").all();
    res.json(roles);
  });

  app.post("/api/admin/succession/critical-roles", authenticateToken, (req: any, res) => {
    if (req.user.role !== 'admin') return res.sendStatus(403);
    const { designation, department, business_impact, risk_level } = req.body;
    db.prepare("INSERT INTO critical_roles (designation, department, business_impact, risk_level) VALUES (?, ?, ?, ?)")
      .run(designation, department, business_impact, risk_level);
    res.status(201).json({ message: "Critical role added" });
  });

  app.delete("/api/admin/succession/critical-roles/:id", authenticateToken, (req: any, res) => {
    if (req.user.role !== 'admin') return res.sendStatus(403);
    db.prepare("DELETE FROM succession_plans WHERE critical_role_id = ?").run(req.params.id);
    db.prepare("DELETE FROM critical_roles WHERE id = ?").run(req.params.id);
    res.json({ message: "Critical role removed" });
  });

  app.delete("/api/admin/succession/plans/:id", authenticateToken, (req: any, res) => {
    if (req.user.role !== 'admin') return res.sendStatus(403);
    db.prepare("DELETE FROM succession_plans WHERE id = ?").run(req.params.id);
    res.json({ message: "Succession plan removed" });
  });

  app.get("/api/admin/succession/plans/:roleId", authenticateToken, (req: any, res) => {
    if (req.user.role !== 'admin') return res.sendStatus(403);
    const plans = db.prepare(`
      SELECT s.*, u.name as successor_name 
      FROM succession_plans s 
      JOIN users u ON s.successor_id = u.id 
      WHERE s.critical_role_id = ?
    `).all(req.params.roleId);
    res.json(plans);
  });

  app.post("/api/admin/succession/plans", authenticateToken, (req: any, res) => {
    if (req.user.role !== 'admin') return res.sendStatus(403);
    const { critical_role_id, successor_id, readiness_level, development_plan } = req.body;
    db.prepare("INSERT INTO succession_plans (critical_role_id, successor_id, readiness_level, development_plan) VALUES (?, ?, ?, ?)")
      .run(critical_role_id, successor_id, readiness_level, development_plan);
    res.status(201).json({ message: "Succession plan added" });
  });

  app.patch("/api/admin/employees/:id/hipo", authenticateToken, (req: any, res) => {
    if (req.user.role !== 'admin') return res.sendStatus(403);
    const { is_hipo } = req.body;
    db.prepare("UPDATE users SET is_hipo = ? WHERE id = ?").run(is_hipo ? 1 : 0, req.params.id);
    res.json({ message: "HiPo status updated" });
  });

  // Offboarding Routes
  app.post("/api/admin/offboarding/initiate", authenticateToken, (req: any, res) => {
    if (req.user.role !== 'admin') return res.sendStatus(403);
    const { user_id, type, last_working_day, reason } = req.body;
    try {
      db.prepare("INSERT INTO separations (user_id, type, last_working_day, reason) VALUES (?, ?, ?, ?)")
        .run(user_id, type, last_working_day, reason);
      db.prepare("UPDATE users SET status = 'resigned' WHERE id = ?").run(user_id);
      res.status(201).json({ message: "Offboarding initiated" });
    } catch (e: any) {
      res.status(400).json({ message: "Offboarding already initiated for this user" });
    }
  });

  app.get("/api/admin/offboarding", authenticateToken, (req: any, res) => {
    if (req.user.role !== 'admin') return res.sendStatus(403);
    const separations = db.prepare(`
      SELECT s.*, u.name as employee_name, u.employee_id 
      FROM separations s 
      JOIN users u ON s.user_id = u.id 
      ORDER BY s.last_working_day ASC
    `).all();
    res.json(separations);
  });

  app.patch("/api/admin/offboarding/:id", authenticateToken, (req: any, res) => {
    if (req.user.role !== 'admin') return res.sendStatus(403);
    const { exit_interview_completed, final_settlement_processed, status } = req.body;
    if (status) {
      db.prepare("UPDATE separations SET status = ? WHERE id = ?").run(status, req.params.id);
      if (status === 'completed') {
        const sep = db.prepare("SELECT user_id FROM separations WHERE id = ?").get(req.params.id) as any;
        db.prepare("UPDATE users SET status = 'inactive' WHERE id = ?").run(sep.user_id);
      }
    } else {
      db.prepare("UPDATE separations SET exit_interview_completed = ?, final_settlement_processed = ? WHERE id = ?")
        .run(exit_interview_completed ? 1 : 0, final_settlement_processed ? 1 : 0, req.params.id);
    }
    res.json({ message: "Offboarding updated" });
  });

  app.delete("/api/admin/offboarding/:id", authenticateToken, (req: any, res) => {
    if (req.user.role !== 'admin') return res.sendStatus(403);
    const sep = db.prepare("SELECT user_id FROM separations WHERE id = ?").get(req.params.id) as any;
    if (sep) {
      db.prepare("UPDATE users SET status = 'active' WHERE id = ?").run(sep.user_id);
      db.prepare("DELETE FROM separations WHERE id = ?").run(req.params.id);
    }
    res.json({ message: "Offboarding cancelled" });
  });

  app.patch("/api/notifications/:id/read", authenticateToken, (req: any, res) => {
    db.prepare("UPDATE notifications SET is_read = 1 WHERE id = ? AND user_id = ?").run(req.params.id, req.user.id);
    res.json({ message: "Notification marked as read" });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
