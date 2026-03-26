const API_URL = '/api';
const IS_DEMO = process.env.IS_GITHUB_PAGES === 'true';

// ─── Demo users ───────────────────────────────────────────────────────────────
const DEMO_USERS: Record<string, any> = {
  'admin@lumina.com':  { id: 1, email: 'admin@lumina.com',  role: 'admin',    name: 'Admin User',   employee_id: 'EMP001', department: 'Human Resources', designation: 'HR Manager',            join_date: '2020-01-01' },
  'jane@lumina.com':   { id: 2, email: 'jane@lumina.com',   role: 'employee', name: 'Jane Smith',   employee_id: 'EMP002', department: 'Engineering',     designation: 'Software Engineer',     join_date: '2021-03-15' },
  'bob@lumina.com':    { id: 3, email: 'bob@lumina.com',    role: 'employee', name: 'Bob Johnson',  employee_id: 'EMP003', department: 'Design',          designation: 'UX Designer',           join_date: '2021-06-01' },
  'alice@lumina.com':  { id: 4, email: 'alice@lumina.com',  role: 'employee', name: 'Alice Brown',  employee_id: 'EMP004', department: 'Marketing',       designation: 'Marketing Specialist',  join_date: '2022-01-10' },
};
const DEMO_PASSWORDS: Record<string, string> = {
  'admin@lumina.com': 'admin123',
  'jane@lumina.com':  'password123',
  'bob@lumina.com':   'password123',
  'alice@lumina.com': 'password123',
};

// ─── Mock data helpers ────────────────────────────────────────────────────────
function today(offset = 0) {
  const d = new Date(); d.setDate(d.getDate() + offset);
  return d.toISOString().split('T')[0];
}

const DEMO_EMPLOYEES = [
  { id: 1, name: 'Admin User',   email: 'admin@lumina.com',  role: 'admin',    employee_id: 'EMP001', department: 'Human Resources', designation: 'HR Manager',           join_date: '2020-01-01', status: 'active', phone: '555-0101', salary: 90000 },
  { id: 2, name: 'Jane Smith',   email: 'jane@lumina.com',   role: 'employee', employee_id: 'EMP002', department: 'Engineering',     designation: 'Software Engineer',    join_date: '2021-03-15', status: 'active', phone: '555-0102', salary: 75000 },
  { id: 3, name: 'Bob Johnson',  email: 'bob@lumina.com',    role: 'employee', employee_id: 'EMP003', department: 'Design',          designation: 'UX Designer',          join_date: '2021-06-01', status: 'active', phone: '555-0103', salary: 70000 },
  { id: 4, name: 'Alice Brown',  email: 'alice@lumina.com',  role: 'employee', employee_id: 'EMP004', department: 'Marketing',       designation: 'Marketing Specialist', join_date: '2022-01-10', status: 'active', phone: '555-0104', salary: 65000 },
  { id: 5, name: 'Charlie Davis',email: 'charlie@lumina.com',role: 'employee', employee_id: 'EMP005', department: 'Engineering',     designation: 'Senior Developer',     join_date: '2020-07-20', status: 'active', phone: '555-0105', salary: 85000 },
];

// ─── Mock handler ─────────────────────────────────────────────────────────────
function mockResponse(method: string, endpoint: string, body?: any): any {
  const path = endpoint.split('?')[0];

  // Auth
  if (method === 'POST' && path === '/auth/login') {
    const { email, password } = body || {};
    const user = DEMO_USERS[email];
    if (!user || DEMO_PASSWORDS[email] !== password) throw new Error('Invalid email or password');
    return { token: 'demo-token', user };
  }

  // Current user profile
  if (method === 'GET' && path === '/me') return DEMO_USERS['jane@lumina.com'];

  // Notifications
  if (method === 'GET' && path === '/notifications/me') return [
    { id: 1, title: 'Welcome to Lumina HRMS', message: 'This is a demo build. Data is read-only.', read: false, created_at: today() },
    { id: 2, title: 'Leave Approved', message: 'Your annual leave request has been approved.', read: true, created_at: today(-2) },
  ];
  if (method === 'PATCH' && path.startsWith('/notifications/')) return { success: true };

  // Onboarding
  if (method === 'GET' && path === '/onboarding/me') return [
    { id: 1, title: 'Complete profile setup', status: 'completed', priority: 'high', due_date: today(-5), category: 'HR' },
    { id: 2, title: 'Setup workstation', status: 'completed', priority: 'high', due_date: today(-3), category: 'IT' },
    { id: 3, title: 'Review company policies', status: 'in_progress', priority: 'medium', due_date: today(2), category: 'HR' },
    { id: 4, title: 'Meet your team', status: 'pending', priority: 'medium', due_date: today(5), category: 'General' },
    { id: 5, title: 'Complete compliance training', status: 'pending', priority: 'low', due_date: today(7), category: 'Training' },
  ];
  if (method === 'GET' && path === '/admin/onboarding') return [
    { id: 1, employee_name: 'New Employee', title: 'Onboarding kickoff', status: 'pending', priority: 'high', due_date: today(1), category: 'HR' },
  ];
  if (method === 'PATCH' && path.startsWith('/onboarding/tasks/')) return { success: true };

  // Holidays
  if (method === 'GET' && path === '/holidays') return [
    { id: 1, name: 'New Year\'s Day', date: '2026-01-01', type: 'public' },
    { id: 2, name: 'Memorial Day',    date: '2026-05-25', type: 'public' },
    { id: 3, name: 'Independence Day',date: '2026-07-04', type: 'public' },
    { id: 4, name: 'Labor Day',       date: '2026-09-07', type: 'public' },
    { id: 5, name: 'Thanksgiving',    date: '2026-11-26', type: 'public' },
    { id: 6, name: 'Christmas Day',   date: '2026-12-25', type: 'public' },
  ];

  // Analytics dashboard
  if (method === 'GET' && path === '/analytics/dashboard') return {
    total_employees: 5, active_today: 4, on_leave: 1, open_positions: 2,
    attendance_rate: 92, leave_utilization: 68, avg_performance: 4.2,
    departments: [
      { name: 'Engineering', count: 2 }, { name: 'Design', count: 1 },
      { name: 'Marketing', count: 1 },   { name: 'Human Resources', count: 1 },
    ],
  };

  // Attendance
  if (method === 'GET' && (path === '/attendance/me' || path === '/admin/attendance')) return [
    { id: 1, user_id: 2, employee_name: 'Jane Smith', date: today(-1), clock_in: '09:02', clock_out: '17:45', status: 'present', hours_worked: 8.7 },
    { id: 2, user_id: 2, employee_name: 'Jane Smith', date: today(-2), clock_in: '08:55', clock_out: '18:10', status: 'present', hours_worked: 9.2 },
    { id: 3, user_id: 2, employee_name: 'Jane Smith', date: today(-3), clock_in: null,    clock_out: null,    status: 'absent',  hours_worked: 0 },
    { id: 4, user_id: 2, employee_name: 'Jane Smith', date: today(-4), clock_in: '09:15', clock_out: '17:30', status: 'present', hours_worked: 8.2 },
    { id: 5, user_id: 2, employee_name: 'Jane Smith', date: today(-5), clock_in: '09:00', clock_out: '17:00', status: 'present', hours_worked: 8.0 },
  ];
  if (method === 'POST' && path === '/attendance/clock-in')  return { id: 99, date: today(), clock_in: new Date().toTimeString().slice(0,5), status: 'present' };
  if (method === 'POST' && path === '/attendance/clock-out') return { clock_out: new Date().toTimeString().slice(0,5) };

  // Leaves
  if (method === 'GET' && (path === '/leaves/me' || path === '/admin/leaves')) return [
    { id: 1, user_id: 2, employee_name: 'Jane Smith', type: 'Annual Leave',  from_date: today(-10), to_date: today(-8), days: 3, status: 'approved', reason: 'Family vacation', applied_on: today(-15) },
    { id: 2, user_id: 2, employee_name: 'Jane Smith', type: 'Sick Leave',    from_date: today(-3),  to_date: today(-3), days: 1, status: 'approved', reason: 'Feeling unwell', applied_on: today(-3) },
    { id: 3, user_id: 3, employee_name: 'Bob Johnson',type: 'Annual Leave',  from_date: today(5),   to_date: today(7),  days: 3, status: 'pending',  reason: 'Personal trip',  applied_on: today(-1) },
  ];
  if (method === 'GET' && path === '/leaves/balances') return [
    { type: 'Annual Leave', total: 20, used: 3, remaining: 17 },
    { type: 'Sick Leave',   total: 10, used: 1, remaining: 9  },
    { type: 'Casual Leave', total: 5,  used: 0, remaining: 5  },
  ];
  if (method === 'POST'  && path === '/leaves') return { id: Date.now(), ...body, status: 'pending', applied_on: today() };
  if (method === 'PATCH' && path.startsWith('/admin/leaves/')) return { success: true };

  // Performance – goals & reviews
  if (method === 'GET' && path === '/goals/me') return [
    { id: 1, title: 'Complete Q1 project milestones', progress: 80, target_date: today(30),  status: 'on_track',  category: 'Project' },
    { id: 2, title: 'Improve code review turnaround', progress: 60, target_date: today(60),  status: 'on_track',  category: 'Process' },
    { id: 3, title: 'Complete React certification',   progress: 40, target_date: today(90),  status: 'at_risk',   category: 'Learning' },
  ];
  if (method === 'GET' && (path === '/admin/reviews' || path === '/reviews/me')) return [
    { id: 1, reviewer_name: 'Admin User', reviewee_name: 'Jane Smith', period: 'Q1 2026', rating: 4.2, status: 'completed', created_at: today(-20) },
    { id: 2, reviewer_name: 'Admin User', reviewee_name: 'Bob Johnson', period: 'Q1 2026', rating: 3.8, status: 'completed', created_at: today(-20) },
  ];
  if (method === 'POST' && path === '/admin/reviews') return { id: Date.now(), ...body, status: 'draft', created_at: today() };

  // Recruitment
  if (method === 'GET' && path === '/requisitions') return [
    { id: 1, title: 'Senior React Developer', department: 'Engineering', status: 'open',   openings: 2, created_at: today(-10) },
    { id: 2, title: 'DevOps Engineer',         department: 'Engineering', status: 'open',   openings: 1, created_at: today(-5)  },
    { id: 3, title: 'Product Designer',        department: 'Design',      status: 'closed', openings: 1, created_at: today(-30) },
  ];
  if (method === 'GET' && path === '/candidates') return [
    { id: 1, name: 'Tom Lee',    email: 'tom@example.com',   position: 'Senior React Developer', status: 'interview', applied_on: today(-7) },
    { id: 2, name: 'Sara Kim',   email: 'sara@example.com',  position: 'DevOps Engineer',        status: 'screening', applied_on: today(-3) },
    { id: 3, name: 'Mike Chen',  email: 'mike@example.com',  position: 'Senior React Developer', status: 'offered',   applied_on: today(-14)},
  ];

  // Policies
  if (method === 'GET' && path === '/policies') return [
    { id: 1, title: 'Code of Conduct',          category: 'General',   updated_at: '2025-01-01', content: 'All employees must maintain professional standards...' },
    { id: 2, title: 'Remote Work Policy',       category: 'HR',        updated_at: '2025-03-15', content: 'Employees may work remotely up to 3 days per week...' },
    { id: 3, title: 'Data Privacy Policy',      category: 'IT',        updated_at: '2025-02-10', content: 'All personal data must be handled in compliance with GDPR...' },
    { id: 4, title: 'Leave & Absence Policy',   category: 'HR',        updated_at: '2025-01-20', content: 'Annual leave entitlement is 20 days per year...' },
    { id: 5, title: 'IT Security Policy',       category: 'IT',        updated_at: '2025-04-01', content: 'All devices must use company-approved security software...' },
  ];

  // Analytics
  if (method === 'GET' && path === '/analytics/headcount') return [
    { month: 'Oct', count: 42 }, { month: 'Nov', count: 44 }, { month: 'Dec', count: 43 },
    { month: 'Jan', count: 45 }, { month: 'Feb', count: 46 }, { month: 'Mar', count: 48 },
  ];
  if (method === 'GET' && path === '/analytics/payroll-trends') return [
    { month: 'Oct', total: 290000 }, { month: 'Nov', total: 295000 }, { month: 'Dec', total: 310000 },
    { month: 'Jan', total: 298000 }, { month: 'Feb', total: 302000 }, { month: 'Mar', total: 308000 },
  ];
  if (method === 'GET' && path === '/analytics/leave-patterns') return [
    { month: 'Oct', days: 42 }, { month: 'Nov', days: 38 }, { month: 'Dec', days: 65 },
    { month: 'Jan', days: 28 }, { month: 'Feb', days: 31 }, { month: 'Mar', days: 35 },
  ];
  if (method === 'GET' && path === '/analytics/training-completion') return [
    { course: 'Security Awareness', completed: 42, total: 48 },
    { course: 'Leadership 101',     completed: 18, total: 25 },
    { course: 'React Advanced',     completed: 12, total: 15 },
    { course: 'Data Privacy',       completed: 45, total: 48 },
  ];
  if (method === 'GET' && path === '/analytics/turnover') return [
    { month: 'Oct', rate: 1.2 }, { month: 'Nov', rate: 0.8 }, { month: 'Dec', rate: 2.1 },
    { month: 'Jan', rate: 1.5 }, { month: 'Feb', rate: 0.9 }, { month: 'Mar', rate: 1.1 },
  ];

  // Learning & Development
  if (method === 'GET' && path === '/courses') return [
    { id: 1, title: 'React Advanced Patterns',  category: 'Technical', duration: '8h',  level: 'Advanced',      instructor: 'John Doe',  enrolled: 12, rating: 4.8 },
    { id: 2, title: 'Leadership Fundamentals',  category: 'Soft Skills',duration: '6h', level: 'Beginner',      instructor: 'Jane Roe',  enrolled: 25, rating: 4.5 },
    { id: 3, title: 'Data Privacy & GDPR',      category: 'Compliance', duration: '3h', level: 'Beginner',      instructor: 'HR Team',   enrolled: 48, rating: 4.2 },
    { id: 4, title: 'TypeScript Mastery',       category: 'Technical',  duration: '10h',level: 'Intermediate',  instructor: 'Mike Chen', enrolled: 8,  rating: 4.9 },
    { id: 5, title: 'Agile & Scrum Essentials', category: 'Process',    duration: '4h', level: 'Beginner',      instructor: 'Sara Kim',  enrolled: 30, rating: 4.3 },
  ];
  if (method === 'GET' && path === '/enrollments/me') return [
    { id: 1, course_id: 1, course_title: 'React Advanced Patterns', progress: 65, status: 'in_progress', enrolled_on: today(-15) },
    { id: 2, course_id: 3, course_title: 'Data Privacy & GDPR',     progress: 100, status: 'completed',  enrolled_on: today(-30) },
  ];
  if (method === 'POST'  && path === '/enrollments')            return { id: Date.now(), ...body, progress: 0, status: 'not_started', enrolled_on: today() };
  if (method === 'PATCH' && path.startsWith('/enrollments/'))  return { success: true };

  // Org chart
  if (method === 'GET' && path === '/org-chart') return DEMO_EMPLOYEES.map(e => ({
    ...e, manager_id: e.id === 1 ? null : 1,
  }));

  // Grievances
  if (method === 'GET' && (path === '/grievances/me' || path === '/admin/grievances')) return [
    { id: 1, subject: 'Incorrect payslip deduction', category: 'Payroll', status: 'resolved',    created_at: today(-20), description: 'My payslip had an incorrect tax deduction.' },
    { id: 2, subject: 'Workstation upgrade needed',  category: 'IT',      status: 'in_progress', created_at: today(-5),  description: 'My laptop is too slow for development work.' },
  ];
  if (method === 'POST' && path === '/grievances') return { id: Date.now(), ...body, status: 'open', created_at: today() };

  // Documents
  if (method === 'GET' && path.startsWith('/documents/') && !path.includes('download')) return [
    { id: 1, name: 'Employment Contract.pdf', type: 'contract',   uploaded_at: '2021-03-15', size: '245 KB' },
    { id: 2, name: 'Offer Letter.pdf',        type: 'offer',      uploaded_at: '2021-03-01', size: '128 KB' },
    { id: 3, name: 'Payslip Mar 2026.pdf',    type: 'payslip',    uploaded_at: today(),       size: '95 KB'  },
  ];
  if (method === 'GET' && path.startsWith('/documents/download/')) return { url: '#' };
  if (method === 'POST'   && path === '/documents')              return { id: Date.now(), ...body, uploaded_at: today() };
  if (method === 'DELETE' && path.startsWith('/documents/'))     return { success: true };

  // Skills
  if (method === 'GET' && path.startsWith('/skills/')) return [
    { id: 1, skill_name: 'React',       proficiency: 'Expert'       },
    { id: 2, skill_name: 'TypeScript',  proficiency: 'Advanced'     },
    { id: 3, skill_name: 'Node.js',     proficiency: 'Intermediate' },
    { id: 4, skill_name: 'Tailwind CSS',proficiency: 'Advanced'     },
  ];
  if (method === 'POST'   && path === '/skills')          return { id: Date.now(), ...body };
  if (method === 'DELETE' && path.startsWith('/skills/')) return { success: true };
  if (method === 'PUT'    && path.startsWith('/skills/')) return { success: true };

  // Employees (admin)
  if (method === 'GET' && path === '/employees') return DEMO_EMPLOYEES;
  if (method === 'POST'  && path === '/employees')                  return { id: Date.now(), ...body };
  if (method === 'PATCH' && path.startsWith('/admin/employees/'))   return { success: true };

  // Expenses
  if (method === 'GET' && (path === '/admin/expenses' || path === '/expenses/me')) return [
    { id: 1, user_id: 2, employee_name: 'Jane Smith', category: 'Travel',     amount: 320.50, description: 'Client site visit', date: today(-7),  status: 'approved' },
    { id: 2, user_id: 2, employee_name: 'Jane Smith', category: 'Equipment',  amount: 89.99,  description: 'Keyboard',          date: today(-14), status: 'pending'  },
    { id: 3, user_id: 3, employee_name: 'Bob Johnson',category: 'Software',   amount: 49.00,  description: 'Figma subscription', date: today(-3),  status: 'pending'  },
  ];
  if (method === 'POST'  && path === '/expenses')                  return { id: Date.now(), ...body, status: 'pending' };
  if (method === 'PATCH' && path.startsWith('/admin/expenses/'))   return { success: true };
  if (method === 'DELETE'&& path.startsWith('/expenses/'))         return { success: true };

  // Helpdesk
  if (method === 'GET' && (path === '/admin/helpdesk/tickets' || path === '/helpdesk/tickets/me')) return [
    { id: 1, user_id: 2, employee_name: 'Jane Smith', subject: 'VPN access issues',     category: 'IT',       priority: 'high',   status: 'open',        created_at: today(-2) },
    { id: 2, user_id: 2, employee_name: 'Jane Smith', subject: 'Payslip discrepancy',   category: 'Payroll',  priority: 'medium', status: 'in_progress', created_at: today(-5) },
    { id: 3, user_id: 3, employee_name: 'Bob Johnson',subject: 'Monitor replacement',   category: 'IT',       priority: 'low',    status: 'resolved',    created_at: today(-10)},
  ];
  if (method === 'POST' && path === '/helpdesk/tickets') return { id: Date.now(), ...body, status: 'open', created_at: today() };

  // DEI
  if (method === 'GET' && path === '/admin/dei/stats') return {
    gender: [{ name: 'Female', value: 18 }, { name: 'Male', value: 26 }, { name: 'Non-binary', value: 4 }],
    ethnicity: [{ name: 'Asian', value: 12 }, { name: 'Black', value: 8 }, { name: 'Hispanic', value: 6 }, { name: 'White', value: 18 }, { name: 'Other', value: 4 }],
    inclusion_score: 78,
    pay_equity: { female: 0.96, poc: 0.94 },
  };
  if (method === 'GET' && path === '/dei/me') return { gender: 'female', ethnicity: 'Asian', disability: false, veteran: false };
  if (method === 'POST' && path === '/dei/me') return { success: true };

  // Succession
  if (method === 'GET' && path === '/admin/succession/critical-roles') return [
    { id: 1, role_title: 'VP of Engineering', department: 'Engineering', risk_level: 'high',   successors: [
      { id: 1, employee_id: 5, employee_name: 'Charlie Davis', readiness: 'ready_now', development_plan: 'Leadership coaching' },
    ]},
    { id: 2, role_title: 'Head of Design',    department: 'Design',      risk_level: 'medium', successors: [] },
  ];
  if (method === 'POST' && path === '/admin/succession/critical-roles') return { id: Date.now(), ...body, successors: [] };
  if (method === 'POST' && path === '/admin/succession/plans')          return { id: Date.now(), ...body };

  // Offboarding
  if (method === 'GET' && path === '/admin/offboarding') return [
    { id: 1, employee_id: 3, employee_name: 'Bob Johnson', last_day: today(30), reason: 'resignation', status: 'in_progress', tasks: [
      { id: 1, title: 'Return equipment', status: 'pending' },
      { id: 2, title: 'Knowledge transfer', status: 'in_progress' },
      { id: 3, title: 'Exit interview', status: 'pending' },
    ]},
  ];
  if (method === 'POST' && path === '/admin/offboarding/initiate') return { id: Date.now(), ...body, status: 'initiated' };

  // Payroll
  if (method === 'GET' && path === '/admin/payroll') return [
    { id: 1, user_id: 2, employee_name: 'Jane Smith',   employee_id: 'EMP002', month: 'March', year: 2026, basic_salary: 75000, allowances: 5000, deductions: 12000, net_pay: 68000, status: 'processed', paid_on: today(-5) },
    { id: 2, user_id: 3, employee_name: 'Bob Johnson',  employee_id: 'EMP003', month: 'March', year: 2026, basic_salary: 70000, allowances: 4500, deductions: 11000, net_pay: 63500, status: 'processed', paid_on: today(-5) },
    { id: 3, user_id: 4, employee_name: 'Alice Brown',  employee_id: 'EMP004', month: 'March', year: 2026, basic_salary: 65000, allowances: 4000, deductions: 10000, net_pay: 59000, status: 'processed', paid_on: today(-5) },
    { id: 4, user_id: 5, employee_name: 'Charlie Davis',employee_id: 'EMP005', month: 'March', year: 2026, basic_salary: 85000, allowances: 6000, deductions: 14000, net_pay: 77000, status: 'processed', paid_on: today(-5) },
  ];
  if (method === 'GET' && path === '/payroll/me') return [
    { id: 1, month: 'March',    year: 2026, basic_salary: 75000, allowances: 5000, deductions: 12000, net_pay: 68000, status: 'processed', paid_on: today(-5) },
    { id: 2, month: 'February', year: 2026, basic_salary: 75000, allowances: 5000, deductions: 12000, net_pay: 68000, status: 'processed', paid_on: today(-35) },
    { id: 3, month: 'January',  year: 2026, basic_salary: 75000, allowances: 5000, deductions: 12500, net_pay: 67500, status: 'processed', paid_on: today(-65) },
  ];
  if (method === 'POST' && path === '/admin/payroll') return { id: Date.now(), ...body, status: 'draft' };

  // Fallback for any unknown mutation — silently succeed
  if (method !== 'GET') return { success: true };

  // Fallback for unknown GETs — return empty array
  return [];
}

// ─── API client ───────────────────────────────────────────────────────────────
export const api = {
  async get(endpoint: string, token?: string) {
    if (IS_DEMO) return mockResponse('GET', endpoint);
    const response = await fetch(`${API_URL}${endpoint}`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    if (!response.ok) throw new Error('API request failed');
    return response.json();
  },

  async post(endpoint: string, body: any, token?: string) {
    if (IS_DEMO) return mockResponse('POST', endpoint, body);
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify(body),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'API request failed');
    }
    return response.json();
  },

  async patch(endpoint: string, body: any, token?: string) {
    if (IS_DEMO) return mockResponse('PATCH', endpoint, body);
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify(body),
    });
    if (!response.ok) throw new Error('API request failed');
    return response.json();
  },

  async delete(endpoint: string, token?: string) {
    if (IS_DEMO) return mockResponse('DELETE', endpoint);
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` },
    });
    if (!response.ok) throw new Error('API request failed');
    return response.json();
  },

  async put(endpoint: string, body: any, token?: string) {
    if (IS_DEMO) return mockResponse('PUT', endpoint, body);
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify(body),
    });
    if (!response.ok) throw new Error('API request failed');
    return response.json();
  },
};
