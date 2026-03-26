import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Users, 
  Calendar, 
  Clock, 
  CreditCard, 
  LayoutDashboard, 
  LogOut, 
  Menu, 
  X,
  User,
  ChevronRight,
  Plus,
  CheckCircle2,
  XCircle,
  Clock3,
  Target,
  Briefcase,
  FileText,
  BarChart3,
  TrendingUp,
  PieChart as PieChartIcon,
  BookOpen,
  Network,
  Settings,
  Award,
  Book,
  AlertCircle,
  Palmtree,
  Bell,
  ClipboardList,
  ShieldCheck,
  Cpu,
  GraduationCap,
  Download,
  FileUp,
  Trash2,
  Heart,
  LifeBuoy,
  Receipt,
  UserMinus
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  LineChart,
  Line
} from 'recharts';
import { api } from './lib/api';

// --- Types ---
interface User {
  id: number;
  email: string;
  role: 'admin' | 'employee';
  name: string;
  employee_id: string;
  department?: string;
  designation?: string;
  join_date?: string;
}

// --- Components ---

const Logo = ({ size = 'md', light = false }: { size?: 'sm' | 'md' | 'lg', light?: boolean }) => {
  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-16 h-16'
  };
  const iconSizes = {
    sm: 16,
    md: 20,
    lg: 32
  };

  return (
    <div className="flex items-center gap-3">
      <div className={`${sizes[size]} bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30`}>
        <Cpu size={iconSizes[size]} className="text-white" />
      </div>
      <span className={`font-bold tracking-tight ${size === 'lg' ? 'text-2xl' : 'text-xl'} ${light ? 'text-white' : 'text-slate-900'}`}>
        Lumina<span className="text-blue-600">HRMS</span>
      </span>
    </div>
  );
};

const Sidebar = ({ user, onLogout }: { user: User; onLogout: () => void }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const isAdmin = user.role === 'admin';

  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Attendance', path: '/attendance', icon: Clock },
    { name: 'Leaves', path: '/leaves', icon: Calendar },
    { name: 'Performance', path: '/performance', icon: Target },
    { name: 'Payroll', path: '/payroll', icon: CreditCard },
    { name: 'Learning', path: '/learning', icon: BookOpen },
    { name: 'Org Chart', path: '/org-chart', icon: Network },
    { name: 'Policies', path: '/policies', icon: FileText },
    { name: 'Onboarding', path: '/onboarding', icon: ClipboardList },
    { name: 'Grievances', path: '/grievances', icon: AlertCircle },
    { name: 'Expenses', path: '/expenses', icon: Receipt },
    { name: 'Helpdesk', path: '/helpdesk', icon: LifeBuoy },
    ...(isAdmin ? [
      { name: 'Employees', path: '/employees', icon: Users },
      { name: 'Recruitment', path: '/recruitment', icon: Briefcase },
      { name: 'Analytics', path: '/analytics', icon: BarChart3 },
      { name: 'DEI', path: '/dei', icon: Heart },
      { name: 'Succession', path: '/succession', icon: TrendingUp },
      { name: 'Offboarding', path: '/offboarding', icon: UserMinus },
    ] : []),
  ];

  return (
    <div className="w-64 bg-slate-900 text-white h-screen flex flex-col fixed left-0 top-0">
      <div className="p-6 border-b border-slate-800">
        <Logo light />
      </div>
      
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                isActive 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Icon size={20} />
              <span className="font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <div className="flex items-center gap-3 px-4 py-3 mb-4 cursor-pointer hover:bg-slate-800 rounded-xl transition-colors" onClick={() => navigate('/profile')}>
          <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-slate-300">
            <User size={20} />
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-semibold truncate">{user.name}</p>
            <p className="text-xs text-slate-500 truncate capitalize">{user.role}</p>
          </div>
        </div>
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-950/30 transition-all font-medium"
        >
          <LogOut size={20} />
          Logout
        </button>
      </div>
    </div>
  );
};

const Layout = ({ children, user, onLogout }: { children: React.ReactNode; user: User; onLogout: () => void }) => {
  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar user={user} onLogout={onLogout} />
      <main className="pl-64">
        <header className="h-20 bg-white border-b border-slate-100 flex items-center justify-between px-8 sticky top-0 z-30">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Lumina HRMS</span>
            <ChevronRight size={14} className="text-slate-300" />
            <span className="text-xs font-bold text-slate-900 uppercase tracking-widest">Workspace</span>
          </div>
          <div className="flex items-center gap-4">
            <NotificationCenter user={user} />
            <div className="w-px h-6 bg-slate-100 mx-2" />
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-xs font-bold text-slate-900">{user.name}</p>
                <p className="text-[10px] font-medium text-slate-500 capitalize">{user.role}</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                {user.name.charAt(0)}
              </div>
            </div>
          </div>
        </header>
        <div className="p-8 max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

// --- Pages ---

const Login = ({ onLogin }: { onLogin: (token: string, user: User) => void }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const data = await api.post('/auth/login', { email, password });
      onLogin(data.token, data.user);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden"
      >
        <div className="p-8 bg-blue-600 text-white text-center">
          <div className="flex justify-center mb-4">
            <Logo size="lg" light />
          </div>
          <h2 className="text-2xl font-bold mt-4">Welcome Back</h2>
          <p className="text-blue-100 mt-2">Sign in to Lumina HRMS</p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {error && (
            <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm font-medium border border-red-100">
              {error}
            </div>
          )}
          
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              placeholder="admin@lumina.com"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all disabled:opacity-50 shadow-lg shadow-blue-200"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

const NotificationCenter = ({ user }: { user: User }) => {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const token = localStorage.getItem('token');

  const fetchNotifications = async () => {
    try {
      const data = await api.get('/notifications/me', token!);
      setNotifications(data);
    } catch (err) {}
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [token]);

  const markAsRead = async (id: number) => {
    try {
      await api.patch(`/notifications/${id}/read`, {}, token!);
      fetchNotifications();
    } catch (err) {}
  };

  const unreadCount = notifications.filter(n => !n.is_read).length;

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
      >
        <Bell size={24} />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-black flex items-center justify-center rounded-full border-2 border-white">
            {unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="absolute right-0 mt-2 w-80 bg-white rounded-3xl shadow-2xl border border-slate-100 z-50 overflow-hidden"
            >
              <div className="p-6 border-b border-slate-50 flex justify-between items-center">
                <h3 className="font-bold text-slate-900">Notifications</h3>
                <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-lg">
                  {unreadCount} New
                </span>
              </div>
              <div className="max-h-96 overflow-y-auto">
                {notifications.length > 0 ? (
                  notifications.map((n) => (
                    <div 
                      key={n.id} 
                      className={`p-4 border-b border-slate-50 hover:bg-slate-50 transition-colors cursor-pointer ${!n.is_read ? 'bg-blue-50/30' : ''}`}
                      onClick={() => markAsRead(n.id)}
                    >
                      <div className="flex gap-3">
                        <div className={`w-2 h-2 rounded-full mt-2 shrink-0 ${
                          n.type === 'success' ? 'bg-green-500' : n.type === 'warning' ? 'bg-orange-500' : 'bg-blue-500'
                        }`} />
                        <div>
                          <p className={`text-sm font-bold ${!n.is_read ? 'text-slate-900' : 'text-slate-500'}`}>{n.title}</p>
                          <p className="text-xs text-slate-500 mt-1 leading-relaxed">{n.message}</p>
                          <p className="text-[10px] text-slate-400 mt-2 font-medium">
                            {new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center text-slate-400">
                    <Bell size={32} className="mx-auto mb-2 opacity-20" />
                    <p className="text-sm">No notifications yet</p>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

const Onboarding = ({ user }: { user: User }) => {
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [adminProgress, setAdminProgress] = useState<any[]>([]);
  const token = localStorage.getItem('token');
  const isAdmin = user.role === 'admin';

  const fetchTasks = async () => {
    try {
      const data = await api.get('/onboarding/me', token!);
      setTasks(data);
    } catch (err) {} finally {
      setLoading(false);
    }
  };

  const fetchAdminProgress = async () => {
    try {
      const data = await api.get('/admin/onboarding', token!);
      setAdminProgress(data);
    } catch (err) {}
  };

  useEffect(() => {
    fetchTasks();
    if (isAdmin) fetchAdminProgress();
  }, [token, isAdmin]);

  const toggleTask = async (taskId: number, currentStatus: string) => {
    const newStatus = currentStatus === 'completed' ? 'pending' : 'completed';
    try {
      await api.patch(`/onboarding/tasks/${taskId}`, { status: newStatus }, token!);
      fetchTasks();
    } catch (err) {}
  };

  const updatePriority = async (taskId: number, newPriority: string) => {
    try {
      await api.patch(`/onboarding/tasks/${taskId}`, { priority: newPriority }, token!);
      fetchTasks();
    } catch (err) {}
  };

  const priorityOrder: any = { high: 1, medium: 2, low: 3 };
  const sortedTasks = [...tasks].sort((a, b) => {
    if (a.status === 'completed' && b.status !== 'completed') return 1;
    if (a.status !== 'completed' && b.status === 'completed') return -1;
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });

  const categories: any = {
    HR: { icon: User, color: 'text-blue-600', bg: 'bg-blue-50' },
    IT: { icon: Cpu, color: 'text-purple-600', bg: 'bg-purple-50' },
    Training: { icon: GraduationCap, color: 'text-green-600', bg: 'bg-green-50' },
    Admin: { icon: ShieldCheck, color: 'text-orange-600', bg: 'bg-orange-50' },
  };

  const completedCount = tasks.filter(t => t.status === 'completed').length;
  const progress = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

  return (
    <div className="space-y-8">
      <header className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Onboarding Journey</h2>
          <p className="text-slate-500 mt-1">Complete these steps to get fully set up at Lumina.</p>
        </div>
        {!isAdmin && (
          <div className="text-right">
            <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Overall Progress</p>
            <div className="flex items-center gap-4">
              <div className="w-48 h-3 bg-slate-200 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  className="h-full bg-blue-600"
                />
              </div>
              <span className="text-2xl font-black text-blue-600">{progress}%</span>
            </div>
          </div>
        )}
      </header>

      {isAdmin && (
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
          <h3 className="text-xl font-bold mb-6">Organization Onboarding Progress</h3>
          <div className="grid grid-cols-1 gap-4">
            {adminProgress.map((p, idx) => {
              const percent = Math.round((p.completed_tasks / p.total_tasks) * 100);
              return (
                <div key={idx} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                      {p.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">{p.name}</p>
                      <p className="text-xs text-slate-500">{p.department}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Progress</p>
                      <div className="flex items-center gap-3">
                        <div className="w-32 h-2 bg-slate-200 rounded-full overflow-hidden">
                          <div className="h-full bg-blue-600" style={{ width: `${percent}%` }} />
                        </div>
                        <span className="text-xs font-bold text-slate-900">{percent}%</span>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                      percent === 100 ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                      {percent === 100 ? 'Completed' : 'Active'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {!isAdmin && (
        <div className="grid grid-cols-1 gap-4">
          {sortedTasks.map((task) => {
            const cat = categories[task.category] || categories.Admin;
            const Icon = cat.icon;
            const isCompleted = task.status === 'completed';

            return (
              <motion.div 
                key={task.id}
                layout
                className={`bg-white p-6 rounded-3xl shadow-sm border transition-all ${
                  isCompleted ? 'border-green-100 opacity-75' : 'border-slate-100'
                }`}
              >
                <div className="flex items-center gap-6">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${cat.bg} ${cat.color}`}>
                    <Icon size={28} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md ${cat.bg} ${cat.color}`}>
                        {task.category}
                      </span>
                      <select 
                        value={task.priority}
                        onChange={(e) => updatePriority(task.id, e.target.value)}
                        className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md border-none focus:ring-0 cursor-pointer ${
                          task.priority === 'high' ? 'bg-red-50 text-red-600' :
                          task.priority === 'medium' ? 'bg-orange-50 text-orange-600' :
                          'bg-slate-50 text-slate-600'
                        }`}
                      >
                        <option value="high">High Priority</option>
                        <option value="medium">Medium Priority</option>
                        <option value="low">Low Priority</option>
                      </select>
                      {isCompleted && (
                        <span className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md bg-green-50 text-green-600 flex items-center gap-1">
                          <CheckCircle2 size={10} /> Completed
                        </span>
                      )}
                    </div>
                    <h3 className={`text-lg font-bold ${isCompleted ? 'text-slate-400 line-through' : 'text-slate-900'}`}>
                      {task.title}
                    </h3>
                    <p className="text-slate-500 text-sm">{task.description}</p>
                  </div>
                  <button 
                    onClick={() => toggleTask(task.id, task.status)}
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
                      isCompleted 
                        ? 'bg-green-600 text-white shadow-lg shadow-green-200' 
                        : 'bg-slate-100 text-slate-400 hover:bg-blue-600 hover:text-white'
                    }`}
                  >
                    {isCompleted ? <CheckCircle2 size={24} /> : <Plus size={24} />}
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};

const Dashboard = ({ user }: { user: User }) => {
  const [stats, setStats] = useState<any>(null);
  const [adminStats, setAdminStats] = useState<any>(null);
  const [holidays, setHolidays] = useState<any[]>([]);
  const [mySkills, setMySkills] = useState<any[]>([]);
  const [myDocs, setMyDocs] = useState<any[]>([]);
  const token = localStorage.getItem('token');
  const isAdmin = user.role === 'admin';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const holidaysData = await api.get('/holidays', token!);
        setHolidays(holidaysData);

        if (isAdmin) {
          const aStats = await api.get('/analytics/dashboard', token!);
          setAdminStats(aStats);
        } else {
          const [attendance, skills, docs] = await Promise.all([
            api.get('/attendance/me', token!),
            api.get(`/skills/${user.id}`, token!),
            api.get(`/documents/${user.id}`, token!)
          ]);
          setStats({ attendance: attendance.slice(0, 5) });
          setMySkills(skills);
          setMyDocs(docs);
        }
      } catch (err) {}
    };
    fetchData();
  }, [token, isAdmin, user.id]);

  return (
    <div className="space-y-8">
      <header>
        <h2 className="text-3xl font-bold text-slate-900">Hello, {user.name} 👋</h2>
        <p className="text-slate-500 mt-1">{isAdmin ? 'Organization overview and quick actions.' : "Here's what's happening today."}</p>
      </header>

      {isAdmin ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-4">
              <Users size={24} />
            </div>
            <h3 className="text-slate-500 font-medium">Total Employees</h3>
            <p className="text-2xl font-bold text-slate-900 mt-1">{adminStats?.totalEmployees || 0}</p>
            <p className="text-xs text-blue-600 font-medium mt-2">Active workforce</p>
          </div>

          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
            <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center mb-4">
              <Palmtree size={24} />
            </div>
            <h3 className="text-slate-500 font-medium">Pending Leaves</h3>
            <p className="text-2xl font-bold text-slate-900 mt-1">{adminStats?.pendingLeaves || 0}</p>
            <p className="text-xs text-orange-600 font-medium mt-2">Needs approval</p>
          </div>

          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
            <div className="w-12 h-12 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center mb-4">
              <AlertCircle size={24} />
            </div>
            <h3 className="text-slate-500 font-medium">Open Grievances</h3>
            <p className="text-2xl font-bold text-slate-900 mt-1">{adminStats?.openGrievances || 0}</p>
            <p className="text-xs text-red-600 font-medium mt-2">Urgent attention</p>
          </div>

          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
            <div className="w-12 h-12 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center mb-4">
              <Briefcase size={24} />
            </div>
            <h3 className="text-slate-500 font-medium">Active Requisitions</h3>
            <p className="text-2xl font-bold text-slate-900 mt-1">{adminStats?.activeRequisitions || 0}</p>
            <p className="text-xs text-green-600 font-medium mt-2">Hiring in progress</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-4">
              <Clock size={24} />
            </div>
            <h3 className="text-slate-500 font-medium">Attendance</h3>
            <p className="text-2xl font-bold text-slate-900 mt-1">Present</p>
            <p className="text-xs text-green-600 font-medium mt-2 flex items-center gap-1">
              <CheckCircle2 size={12} /> On time
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
            <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center mb-4">
              <Calendar size={24} />
            </div>
            <h3 className="text-slate-500 font-medium">Leave Balance</h3>
            <p className="text-2xl font-bold text-slate-900 mt-1">12 Days</p>
            <p className="text-xs text-slate-400 font-medium mt-2">Available for this year</p>
          </div>

          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
            <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center mb-4">
              <CreditCard size={24} />
            </div>
            <h3 className="text-slate-500 font-medium">Next Payroll</h3>
            <p className="text-2xl font-bold text-slate-900 mt-1">April 1st</p>
            <p className="text-xs text-slate-400 font-medium mt-2">Processing in 5 days</p>
          </div>

          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
            <div className="w-12 h-12 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center mb-4">
              <Target size={24} />
            </div>
            <h3 className="text-slate-500 font-medium">Goals Progress</h3>
            <p className="text-2xl font-bold text-slate-900 mt-1">75%</p>
            <p className="text-xs text-slate-400 font-medium mt-2">3 active goals</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {!isAdmin && (
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
              <h3 className="text-xl font-bold mb-6">Recent Attendance</h3>
              <div className="space-y-4">
                {stats?.attendance?.map((record: any) => (
                  <div key={record.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                    <div>
                      <p className="font-semibold text-slate-900">{record.date}</p>
                      <p className="text-xs text-slate-500">Clock In: {record.clock_in}</p>
                    </div>
                    <div className="text-right">
                      <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold uppercase tracking-wider">
                        {record.status}
                      </span>
                    </div>
                  </div>
                ))}
                {!stats?.attendance?.length && <p className="text-slate-400 text-center py-8">No records found</p>}
              </div>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold">My Skills</h3>
                <Award className="text-blue-600" />
              </div>
              <div className="flex flex-wrap gap-3">
                {mySkills.length > 0 ? (
                  mySkills.map((skill) => (
                    <div key={skill.id} className="px-4 py-2 bg-blue-50 text-blue-700 rounded-xl border border-blue-100 flex items-center gap-2">
                      <span className="font-bold text-sm">{skill.skill_name}</span>
                      <span className="text-[10px] font-black uppercase tracking-tighter opacity-50">{skill.proficiency}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-slate-400 text-sm">No skills listed yet.</p>
                )}
              </div>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold">My Documents</h3>
                <FileText className="text-blue-600" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {myDocs.length > 0 ? (
                  myDocs.map((doc) => (
                    <div key={doc.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                      <div className="flex items-center gap-3 overflow-hidden">
                        <div className="w-8 h-8 bg-white text-blue-600 rounded-lg flex items-center justify-center shadow-sm flex-shrink-0">
                          <FileText size={16} />
                        </div>
                        <div className="overflow-hidden">
                          <p className="font-bold text-slate-900 text-sm truncate">{doc.name}</p>
                          <p className="text-[10px] text-slate-500 uppercase tracking-wider">{new Date(doc.uploaded_at).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <button 
                        onClick={async () => {
                          try {
                            const d = await api.get(`/documents/download/${doc.id}`, token!);
                            const link = document.createElement('a');
                            link.href = d.data;
                            link.download = d.name;
                            document.body.appendChild(link);
                            link.click();
                            document.body.removeChild(link);
                          } catch (err) {}
                        }}
                        className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-all"
                      >
                        <Download size={16} />
                      </button>
                    </div>
                  ))
                ) : (
                  <p className="text-slate-400 text-sm col-span-2">No documents uploaded yet.</p>
                )}
              </div>
            </div>
          </div>
        )}

        {isAdmin && (
          <div className="lg:col-span-2 bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
            <h3 className="text-xl font-bold mb-6">Quick Actions</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Link to="/employees" className="p-6 bg-blue-50 text-blue-600 rounded-3xl text-center hover:bg-blue-100 transition-colors">
                <Users className="mx-auto mb-2" />
                <span className="text-xs font-bold">Add Employee</span>
              </Link>
              <Link to="/recruitment" className="p-6 bg-purple-50 text-purple-600 rounded-3xl text-center hover:bg-purple-100 transition-colors">
                <Briefcase className="mx-auto mb-2" />
                <span className="text-xs font-bold">Post Job</span>
              </Link>
              <Link to="/leaves" className="p-6 bg-orange-50 text-orange-600 rounded-3xl text-center hover:bg-orange-100 transition-colors">
                <Palmtree className="mx-auto mb-2" />
                <span className="text-xs font-bold">Review Leaves</span>
              </Link>
              <Link to="/payroll" className="p-6 bg-green-50 text-green-600 rounded-3xl text-center hover:bg-green-100 transition-colors">
                <CreditCard className="mx-auto mb-2" />
                <span className="text-xs font-bold">Run Payroll</span>
              </Link>
            </div>
          </div>
        )}

        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Palmtree className="text-orange-500" /> Upcoming Holidays
          </h3>
          <div className="space-y-4">
            {holidays.map((holiday) => (
              <div key={holiday.id} className="flex items-center justify-between p-4 bg-orange-50/50 rounded-2xl border border-orange-100">
                <div>
                  <p className="font-semibold text-slate-900 text-sm">{holiday.name}</p>
                  <p className="text-[10px] text-slate-500">{holiday.date}</p>
                </div>
                <span className="text-[10px] font-bold text-orange-600 uppercase tracking-widest">{holiday.type}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const Attendance = ({ user }: { user: User }) => {
  const [history, setHistory] = useState<any[]>([]);
  const [adminHistory, setAdminHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem('token');
  const isAdmin = user.role === 'admin';

  const fetchData = async () => {
    try {
      const data = await api.get('/attendance/me', token!);
      setHistory(data);
      if (isAdmin) {
        const allData = await api.get('/admin/attendance', token!);
        setAdminHistory(allData);
      }
    } catch (err) {}
  };

  useEffect(() => { fetchData(); }, [token]);

  const handleClockIn = async () => {
    setLoading(true);
    try {
      await api.post('/attendance/clock-in', {}, token!);
      fetchData();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleClockOut = async () => {
    setLoading(true);
    try {
      await api.post('/attendance/clock-out', {}, token!);
      fetchData();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <header className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Attendance</h2>
          <p className="text-slate-500 mt-1">Track work hours across the organization.</p>
        </div>
        <div className="flex gap-4">
          <button
            onClick={handleClockIn}
            disabled={loading}
            className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 disabled:opacity-50"
          >
            Clock In
          </button>
          <button
            onClick={handleClockOut}
            disabled={loading}
            className="px-6 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-200 disabled:opacity-50"
          >
            Clock Out
          </button>
        </div>
      </header>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100 bg-slate-50/50">
          <h3 className="font-bold text-slate-900">{isAdmin ? 'Organization Attendance' : 'My Attendance'}</h3>
        </div>
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              {isAdmin && <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Employee</th>}
              <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Date</th>
              <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Clock In</th>
              <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Clock Out</th>
              <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {(isAdmin ? adminHistory : history).map((record) => (
              <tr key={record.id} className="hover:bg-slate-50 transition-colors">
                {isAdmin && (
                  <td className="px-8 py-4">
                    <p className="font-semibold text-slate-900">{record.employee_name}</p>
                    <p className="text-[10px] text-slate-500">{record.employee_id}</p>
                  </td>
                )}
                <td className="px-8 py-4 font-medium text-slate-900">{record.date}</td>
                <td className="px-8 py-4 text-slate-600">{record.clock_in || '--:--'}</td>
                <td className="px-8 py-4 text-slate-600">{record.clock_out || '--:--'}</td>
                <td className="px-8 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                    record.status === 'present' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {record.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const Leaves = ({ user }: { user: User }) => {
  const [leaves, setLeaves] = useState<any[]>([]);
  const [adminLeaves, setAdminLeaves] = useState<any[]>([]);
  const [balances, setBalances] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ type: 'Earned Leave', start_date: '', end_date: '', reason: '' });
  const token = localStorage.getItem('token');
  const isAdmin = user.role === 'admin';

  const fetchLeaves = async () => {
    try {
      const data = await api.get('/leaves/me', token!);
      setLeaves(data);
      if (isAdmin) {
        const allData = await api.get('/admin/leaves', token!);
        setAdminLeaves(allData);
      }
    } catch (err) {}
  };

  const fetchBalances = async () => {
    try {
      const data = await api.get('/leaves/balances', token!);
      setBalances(data);
    } catch (err) {}
  };

  useEffect(() => { 
    fetchLeaves(); 
    fetchBalances();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/leaves', formData, token!);
      setShowForm(false);
      fetchLeaves();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleAction = async (id: number, status: string) => {
    try {
      await api.patch(`/admin/leaves/${id}`, { status }, token!);
      fetchLeaves();
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="space-y-8">
      <header className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Leave Management</h2>
          <p className="text-slate-500 mt-1">Manage your time off requests.</p>
        </div>
        {!isAdmin && (
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
          >
            <Plus size={20} />
            Apply Leave
          </button>
        )}
      </header>

      {/* Leave Balances Section */}
      {!isAdmin && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {balances.map((bal) => (
            <div key={bal.id} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-4">
              <div className={`p-3 rounded-2xl ${
                bal.leave_type === 'Earned Leave' ? 'bg-blue-50 text-blue-600' :
                bal.leave_type === 'Sick Leave' ? 'bg-red-50 text-red-600' :
                'bg-purple-50 text-purple-600'
              }`}>
                <Calendar size={24} />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">{bal.leave_type}</p>
                <p className="text-2xl font-bold text-slate-900">{bal.balance} Days</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold">New Leave Request</h3>
            <button onClick={() => setShowForm(false)} className="text-slate-400 hover:text-slate-600">
              <X size={24} />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Leave Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option>Earned Leave</option>
                <option>Sick Leave</option>
                <option>Casual Leave</option>
                <option>Maternity Leave</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Reason</label>
              <input
                type="text"
                required
                value={formData.reason}
                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Vacation, Medical, etc."
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Start Date</label>
              <input
                type="date"
                required
                value={formData.start_date}
                onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">End Date</label>
              <input
                type="date"
                required
                value={formData.end_date}
                onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="md:col-span-2">
              <button type="submit" className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all">
                Submit Request
              </button>
            </div>
          </form>
        </motion.div>
      )}

      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100 bg-slate-50/50">
          <h3 className="font-bold text-slate-900">{isAdmin ? 'All Requests' : 'My Requests'}</h3>
        </div>
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              {isAdmin && <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Employee</th>}
              <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Type</th>
              <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Dates</th>
              <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Status</th>
              {isAdmin && <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Actions</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {(isAdmin ? adminLeaves : leaves).map((leave) => (
              <tr key={leave.id} className="hover:bg-slate-50 transition-colors">
                {isAdmin && <td className="px-8 py-4 font-semibold text-slate-900">{leave.employee_name}</td>}
                <td className="px-8 py-4 text-slate-600">{leave.type}</td>
                <td className="px-8 py-4 text-slate-600">{leave.start_date} to {leave.end_date}</td>
                <td className="px-8 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                    leave.status === 'approved' ? 'bg-green-100 text-green-700' :
                    leave.status === 'rejected' ? 'bg-red-100 text-red-700' :
                    'bg-orange-100 text-orange-700'
                  }`}>
                    {leave.status}
                  </span>
                </td>
                {isAdmin && (
                  <td className="px-8 py-4">
                    {leave.status === 'pending' && (
                      <div className="flex gap-2">
                        <button onClick={() => handleAction(leave.id, 'approved')} className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                          <CheckCircle2 size={20} />
                        </button>
                        <button onClick={() => handleAction(leave.id, 'rejected')} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                          <XCircle size={20} />
                        </button>
                      </div>
                    )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const Performance = ({ user }: { user: User }) => {
  const [goals, setGoals] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [formData, setFormData] = useState({ user_id: '', cycle: '', rating: 5, feedback: '' });
  const token = localStorage.getItem('token');
  const isAdmin = user.role === 'admin';

  const fetchData = async () => {
    try {
      if (isAdmin) {
        const [goalsData, reviewsData, employeesData] = await Promise.all([
          api.get('/goals/me', token!),
          api.get('/admin/reviews', token!),
          api.get('/employees', token!)
        ]);
        setGoals(goalsData);
        setReviews(reviewsData);
        setEmployees(employeesData);
      } else {
        const [goalsData, reviewsData] = await Promise.all([
          api.get('/goals/me', token!),
          api.get('/reviews/me', token!)
        ]);
        setGoals(goalsData);
        setReviews(reviewsData);
      }
    } catch (err) {}
  };

  useEffect(() => {
    fetchData();
  }, [token, isAdmin]);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/admin/reviews', formData, token!);
      setShowReviewForm(false);
      setFormData({ user_id: '', cycle: '', rating: 5, feedback: '' });
      fetchData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="space-y-8">
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Performance</h2>
          <p className="text-slate-500 mt-1">Track goals and conduct reviews.</p>
        </div>
        {isAdmin && (
          <button 
            onClick={() => setShowReviewForm(!showReviewForm)}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
          >
            <Plus size={20} /> New Review
          </button>
        )}
      </header>

      <AnimatePresence>
        {showReviewForm && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 overflow-hidden"
          >
            <h3 className="text-xl font-bold mb-6">Conduct Performance Review</h3>
            <form onSubmit={handleSubmitReview} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Select Employee</label>
                <select
                  required
                  value={formData.user_id}
                  onChange={(e) => setFormData({ ...formData, user_id: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Choose an employee...</option>
                  {employees.map(emp => (
                    <option key={emp.id} value={emp.id}>{emp.name} ({emp.employee_id})</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Review Cycle</label>
                <input
                  type="text"
                  required
                  value={formData.cycle}
                  onChange={(e) => setFormData({ ...formData, cycle: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Annual 2025, Q1 2026"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Rating (1-5)</label>
                <input
                  type="number"
                  min="1"
                  max="5"
                  required
                  value={formData.rating}
                  onChange={(e) => setFormData({ ...formData, rating: parseInt(e.target.value) })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="text-sm font-semibold text-slate-700">Feedback</label>
                <textarea
                  required
                  rows={4}
                  value={formData.feedback}
                  onChange={(e) => setFormData({ ...formData, feedback: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Provide detailed performance feedback..."
                />
              </div>
              <div className="md:col-span-2">
                <button type="submit" className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all">
                  Submit Review
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Target className="text-blue-600" /> {isAdmin ? 'Recent Goals' : 'My Goals'}
          </h3>
          <div className="space-y-4">
            {goals.map((goal) => (
              <div key={goal.id} className="p-4 bg-slate-50 rounded-2xl">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-semibold text-slate-900">{goal.title}</p>
                    {isAdmin && <p className="text-xs text-slate-500">Employee ID: {goal.user_id}</p>}
                  </div>
                  <span className="text-xs font-bold text-blue-600 uppercase">{goal.progress}%</span>
                </div>
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div className="bg-blue-600 h-full transition-all" style={{ width: `${goal.progress}%` }}></div>
                </div>
                <p className="text-xs text-slate-500 mt-2">Target: {goal.target_date}</p>
              </div>
            ))}
            {!goals.length && <p className="text-slate-400 text-center py-8">No goals set yet.</p>}
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <TrendingUp className="text-purple-600" /> {isAdmin ? 'Organization Reviews' : 'My Performance Reviews'}
          </h3>
          <div className="space-y-4">
            {reviews.map((review) => (
              <div key={review.id} className="p-4 bg-slate-50 rounded-2xl">
                <div className="flex justify-between items-center mb-2">
                  <div>
                    <p className="font-semibold text-slate-900">{review.cycle}</p>
                    {isAdmin && <p className="text-xs text-blue-600 font-bold">{review.employee_name}</p>}
                  </div>
                  <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-lg text-xs font-bold">
                    Rating: {review.rating}/5
                  </span>
                </div>
                <p className="text-sm text-slate-600 italic">"{review.feedback}"</p>
                <p className="text-xs text-slate-400 mt-2">By {review.reviewer_name}</p>
              </div>
            ))}
            {!reviews.length && <p className="text-slate-400 text-center py-8">No reviews available.</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

const Recruitment = () => {
  const [reqs, setReqs] = useState<any[]>([]);
  const [candidates, setCandidates] = useState<any[]>([]);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const reqsData = await api.get('/requisitions', token!);
        const candidatesData = await api.get('/candidates', token!);
        setReqs(reqsData);
        setCandidates(candidatesData);
      } catch (err) {}
    };
    fetchData();
  }, [token]);

  return (
    <div className="space-y-8">
      <header>
        <h2 className="text-3xl font-bold text-slate-900">Recruitment</h2>
        <p className="text-slate-500 mt-1">Manage job openings and candidates.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-6 border-b border-slate-100 bg-slate-50/50">
            <h3 className="font-bold text-slate-900">Job Requisitions</h3>
          </div>
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Title</th>
                <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Department</th>
                <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {reqs.map((req) => (
                <tr key={req.id}>
                  <td className="px-8 py-4 font-semibold text-slate-900">{req.title}</td>
                  <td className="px-8 py-4 text-slate-600">{req.department}</td>
                  <td className="px-8 py-4">
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold uppercase tracking-wider">
                      {req.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
          <h3 className="text-xl font-bold mb-6">Recent Candidates</h3>
          <div className="space-y-4">
            {candidates.map((c) => (
              <div key={c.id} className="p-4 bg-slate-50 rounded-2xl">
                <p className="font-semibold text-slate-900">{c.name}</p>
                <p className="text-xs text-slate-500">{c.job_title}</p>
                <div className="mt-2">
                  <span className="px-2 py-0.5 bg-slate-200 text-slate-700 rounded text-[10px] font-bold uppercase">
                    {c.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const Policies = () => {
  const [policies, setPolicies] = useState<any[]>([]);
  const token = localStorage.getItem('token');

  useEffect(() => {
    api.get('/policies', token!).then(setPolicies).catch(() => {});
  }, [token]);

  return (
    <div className="space-y-8">
      <header>
        <h2 className="text-3xl font-bold text-slate-900">Company Policies</h2>
        <p className="text-slate-500 mt-1">Official guidelines and documentation.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {policies.map((policy) => (
          <div key={policy.id} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 hover:border-blue-200 transition-colors cursor-pointer group">
            <div className="w-12 h-12 bg-slate-50 text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600 rounded-2xl flex items-center justify-center mb-4 transition-colors">
              <FileText size={24} />
            </div>
            <h3 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{policy.title}</h3>
            <p className="text-sm text-slate-500 mt-2 line-clamp-2">{policy.content}</p>
            <div className="mt-4 flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{policy.category}</span>
              <ChevronRight size={16} className="text-slate-300 group-hover:text-blue-600 transition-colors" />
            </div>
          </div>
        ))}
        {!policies.length && (
          <div className="col-span-full text-center py-12 bg-white rounded-3xl border border-dashed border-slate-200">
            <FileText className="mx-auto text-slate-300 mb-2" size={48} />
            <p className="text-slate-400">No policies published yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

const Analytics = () => {
  const [headcount, setHeadcount] = useState<any[]>([]);
  const [payrollTrends, setPayrollTrends] = useState<any[]>([]);
  const [leavePatterns, setLeavePatterns] = useState<any[]>([]);
  const [trainingData, setTrainingData] = useState<any[]>([]);
  const [turnoverData, setTurnoverData] = useState<any[]>([]);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [hData, pData, lData, tData, turnData] = await Promise.all([
          api.get('/analytics/headcount', token!),
          api.get('/analytics/payroll-trends', token!),
          api.get('/analytics/leave-patterns', token!),
          api.get('/analytics/training-completion', token!),
          api.get('/analytics/turnover', token!)
        ]);
        setHeadcount(hData);
        setPayrollTrends(pData);
        setLeavePatterns(lData);
        setTrainingData(tData);
        setTurnoverData(turnData);
      } catch (err) {}
    };
    fetchData();
  }, [token]);

  const COLORS = ['#3b82f6', '#8b5cf6', '#f59e0b', '#10b981', '#ef4444'];

  const handleExport = (data: any[], filename: string) => {
    if (!data.length) return;
    const headers = Object.keys(data[0]).join(',');
    const rows = data.map(row => Object.values(row).join(','));
    const csvContent = [headers, ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Workforce Analytics</h2>
          <p className="text-slate-500 mt-1">Data-driven insights for HR strategy.</p>
        </div>
        <button 
          onClick={() => handleExport(headcount, 'headcount_report')}
          className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-200"
        >
          <Download size={20} /> Export All Data
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Headcount by Department */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <Users className="text-blue-600" /> Headcount by Department
            </h3>
            <button onClick={() => handleExport(headcount, 'headcount')} className="text-slate-400 hover:text-blue-600"><Download size={16} /></button>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={headcount}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="count"
                  nameKey="department"
                >
                  {headcount.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Turnover Trends */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <TrendingUp className="text-red-600" /> Employee Turnover Rate (%)
            </h3>
            <button onClick={() => handleExport(turnoverData, 'turnover')} className="text-slate-400 hover:text-blue-600"><Download size={16} /></button>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={turnoverData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                <Tooltip />
                <Line type="monotone" dataKey="rate" stroke="#ef4444" strokeWidth={3} dot={{ r: 6, fill: '#ef4444' }} activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Leave Patterns */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <Palmtree className="text-orange-600" /> Leave Distribution
            </h3>
            <button onClick={() => handleExport(leavePatterns, 'leaves')} className="text-slate-400 hover:text-blue-600"><Download size={16} /></button>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={leavePatterns}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="leave_type" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="count" fill="#f59e0b" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Training Completion */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <BookOpen className="text-green-600" /> Training Completion Rates
            </h3>
            <button onClick={() => handleExport(trainingData, 'training')} className="text-slate-400 hover:text-blue-600"><Download size={16} /></button>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={trainingData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="count"
                  nameKey="status"
                >
                  {trainingData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[(index + 2) % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

const Learning = () => {
  const [courses, setCourses] = useState<any[]>([]);
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const token = localStorage.getItem('token');

  const fetchData = async () => {
    try {
      const cData = await api.get('/courses', token!);
      const eData = await api.get('/enrollments/me', token!);
      setCourses(cData);
      setEnrollments(eData);
    } catch (err) {}
  };

  useEffect(() => { fetchData(); }, [token]);

  const handleEnroll = async (courseId: number) => {
    try {
      await api.post('/enrollments', { course_id: courseId }, token!);
      fetchData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleUpdateProgress = async (id: number, currentProgress: number) => {
    const newProgress = Math.min(currentProgress + 10, 100);
    try {
      await api.patch(`/enrollments/${id}`, { progress: newProgress }, token!);
      fetchData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="space-y-8">
      <header>
        <h2 className="text-3xl font-bold text-slate-900">Learning Center</h2>
        <p className="text-slate-500 mt-1">Upskill yourself with our curated courses.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <h3 className="text-xl font-bold">Available Courses</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {courses.map((course) => {
              const isEnrolled = enrollments.some(e => e.course_id === course.id);
              return (
                <div key={course.id} className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden hover:border-blue-200 transition-colors">
                  <div className="h-32 bg-slate-100 flex items-center justify-center text-slate-300">
                    <Book size={48} />
                  </div>
                  <div className="p-6">
                    <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">{course.category}</span>
                    <h4 className="font-bold text-slate-900 mt-1">{course.title}</h4>
                    <p className="text-sm text-slate-500 mt-2 line-clamp-2">{course.description}</p>
                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-xs text-slate-400 flex items-center gap-1">
                        <Clock size={12} /> {course.duration}
                      </span>
                      <button
                        onClick={() => handleEnroll(course.id)}
                        disabled={isEnrolled}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                          isEnrolled ? 'bg-slate-100 text-slate-400' : 'bg-blue-600 text-white hover:bg-blue-700'
                        }`}
                      >
                        {isEnrolled ? 'Enrolled' : 'Enroll Now'}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="text-xl font-bold">My Progress</h3>
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 space-y-4">
            {enrollments.map((e) => (
              <div key={e.id} className="space-y-2">
                <div className="flex justify-between items-center">
                  <p className="text-sm font-bold text-slate-900 truncate">{e.title}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-blue-600">{e.progress}%</span>
                    {e.progress < 100 && (
                      <button 
                        onClick={() => handleUpdateProgress(e.id, e.progress)}
                        className="p-1 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                        title="Increment Progress"
                      >
                        <Plus size={12} />
                      </button>
                    )}
                  </div>
                </div>
                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-blue-600 h-full transition-all" style={{ width: `${e.progress}%` }}></div>
                </div>
              </div>
            ))}
            {!enrollments.length && <p className="text-slate-400 text-center py-8 text-sm">No active enrollments.</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

const OrgChart = () => {
  const [employees, setEmployees] = useState<any[]>([]);
  const token = localStorage.getItem('token');

  useEffect(() => {
    api.get('/org-chart', token!).then(setEmployees).catch(() => {});
  }, [token]);

  return (
    <div className="space-y-8">
      <header>
        <h2 className="text-3xl font-bold text-slate-900">Organization Chart</h2>
        <p className="text-slate-500 mt-1">Visualize the company hierarchy.</p>
      </header>

      <div className="bg-white p-12 rounded-3xl shadow-sm border border-slate-100 overflow-auto min-h-[600px] flex flex-col items-center">
        {/* Simple Tree Visualization */}
        <div className="space-y-12 flex flex-col items-center">
          {/* Root node (Admin) */}
          {employees.filter(e => e.id === 1).map(root => (
            <div key={root.id} className="relative flex flex-col items-center">
              <div className="p-6 bg-slate-900 text-white rounded-2xl shadow-xl w-64 text-center border-2 border-blue-600">
                <p className="font-bold">{root.name}</p>
                <p className="text-xs text-blue-400 mt-1">{root.designation}</p>
                <p className="text-[10px] text-slate-500 mt-2">{root.department}</p>
              </div>
              <div className="w-px h-12 bg-slate-200 mt-0"></div>
              
              <div className="flex gap-8 items-start relative before:content-[''] before:absolute before:top-0 before:left-1/2 before:-translate-x-1/2 before:w-[calc(100%-128px)] before:h-px before:bg-slate-200">
                {employees.filter(e => e.id !== 1).map(emp => (
                  <div key={emp.id} className="flex flex-col items-center relative pt-12 before:content-[''] before:absolute before:top-0 before:left-1/2 before:-translate-x-1/2 before:w-px before:h-12 before:bg-slate-200">
                    <div className="p-4 bg-white rounded-2xl shadow-md w-48 text-center border border-slate-100 hover:border-blue-200 transition-colors">
                      <p className="font-bold text-slate-900 text-sm">{emp.name}</p>
                      <p className="text-[10px] text-slate-500 mt-1">{emp.designation}</p>
                      <p className="text-[10px] text-blue-600 mt-1">{emp.department}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
          {!employees.length && <p className="text-slate-400">Loading chart...</p>}
        </div>
      </div>
    </div>
  );
};

const Grievances = ({ user }: { user: User }) => {
  const [grievances, setGrievances] = useState<any[]>([]);
  const [adminGrievances, setAdminGrievances] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ subject: '', description: '' });
  const token = localStorage.getItem('token');
  const isAdmin = user.role === 'admin';

  const fetchData = async () => {
    try {
      const gData = await api.get('/grievances/me', token!);
      setGrievances(gData);
      if (isAdmin) {
        const agData = await api.get('/admin/grievances', token!);
        setAdminGrievances(agData);
      }
    } catch (err) {}
  };

  useEffect(() => { fetchData(); }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/grievances', formData, token!);
      setShowForm(false);
      fetchData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="space-y-8">
      <header className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Grievance Redressal</h2>
          <p className="text-slate-500 mt-1">Raise concerns confidentially.</p>
        </div>
        {!isAdmin && (
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-all shadow-lg shadow-red-200"
          >
            <Plus size={20} />
            Raise Grievance
          </button>
        )}
      </header>

      {showForm && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold">New Grievance</h3>
            <button onClick={() => setShowForm(false)} className="text-slate-400 hover:text-slate-600">
              <X size={24} />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Subject</label>
              <input
                type="text"
                required
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="e.g., Workplace harassment, Salary delay"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Description</label>
              <textarea
                required
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-red-500 h-32"
                placeholder="Provide details..."
              ></textarea>
            </div>
            <button type="submit" className="w-full py-4 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-all">
              Submit Grievance
            </button>
          </form>
        </motion.div>
      )}

      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              {isAdmin && <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Employee</th>}
              <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Subject</th>
              <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Date</th>
              <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {(isAdmin ? adminGrievances : grievances).map((g) => (
              <tr key={g.id}>
                {isAdmin && <td className="px-8 py-4 font-semibold text-slate-900">{g.employee_name}</td>}
                <td className="px-8 py-4 text-slate-600">{g.subject}</td>
                <td className="px-8 py-4 text-slate-500 text-xs">{g.created_at}</td>
                <td className="px-8 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                    g.status === 'open' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                  }`}>
                    {g.status}
                  </span>
                </td>
              </tr>
            ))}
            {!(isAdmin ? adminGrievances : grievances).length && (
              <tr>
                <td colSpan={isAdmin ? 4 : 3} className="px-8 py-12 text-center text-slate-400">
                  No grievances found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const Profile = ({ user }: { user: User }) => {
  return (
    <div className="space-y-8">
      <header>
        <h2 className="text-3xl font-bold text-slate-900">My Profile</h2>
        <p className="text-slate-500 mt-1">Manage your personal information.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 flex flex-col items-center text-center">
            <div className="w-32 h-32 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-4xl font-bold mb-4 border-4 border-white shadow-lg">
              {user.name.charAt(0)}
            </div>
            <h3 className="text-xl font-bold text-slate-900">{user.name}</h3>
            <p className="text-slate-500 text-sm">{user.designation || 'Employee'}</p>
            <div className="mt-6 w-full space-y-2">
              <div className="flex justify-between text-sm py-2 border-b border-slate-50">
                <span className="text-slate-400">Employee ID</span>
                <span className="font-bold text-slate-700">{user.employee_id}</span>
              </div>
              <div className="flex justify-between text-sm py-2 border-b border-slate-50">
                <span className="text-slate-400">Department</span>
                <span className="font-bold text-slate-700">{user.department || '--'}</span>
              </div>
              <div className="flex justify-between text-sm py-2">
                <span className="text-slate-400">Join Date</span>
                <span className="font-bold text-slate-700">{user.join_date || '--'}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
          <h3 className="text-xl font-bold mb-8">Account Settings</h3>
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Full Name</label>
                <input type="text" defaultValue={user.name} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Email Address</label>
                <input type="email" defaultValue={user.email} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Bio</label>
              <textarea className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 h-32" placeholder="Tell us about yourself..."></textarea>
            </div>
            <button type="button" className="px-8 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200">
              Save Changes
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
const DocumentManager = ({ userId, userName, onClose }: { userId: number, userName: string, onClose: () => void }) => {
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem('token');

  const fetchDocuments = async () => {
    try {
      const data = await api.get(`/documents/${userId}`, token!);
      setDocuments(data);
    } catch (err) {}
  };

  useEffect(() => {
    fetchDocuments();
  }, [userId]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    try {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const base64Data = event.target?.result as string;
        await api.post('/documents', {
          user_id: userId,
          name: file.name,
          type: file.type,
          size: file.size,
          data: base64Data
        }, token!);
        fetchDocuments();
      };
      reader.readAsDataURL(file);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this document?')) return;
    try {
      await api.delete(`/documents/${id}`, token!);
      fetchDocuments();
    } catch (err) {}
  };

  const handleDownload = async (id: number) => {
    try {
      const doc = await api.get(`/documents/download/${id}`, token!);
      const link = document.createElement('a');
      link.href = doc.data;
      link.download = doc.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {}
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden"
      >
        <div className="p-8 bg-blue-600 text-white flex justify-between items-center">
          <div>
            <h3 className="text-2xl font-bold">Document Management</h3>
            <p className="text-blue-100 mt-1">Files for {userName}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-xl transition-all">
            <X size={24} />
          </button>
        </div>

        <div className="p-8 space-y-8">
          <div className="flex items-center justify-center border-2 border-dashed border-slate-200 rounded-3xl p-8 hover:border-blue-400 transition-colors bg-slate-50">
            <label className="flex flex-col items-center gap-3 cursor-pointer">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center">
                <FileUp size={24} />
              </div>
              <div className="text-center">
                <p className="font-bold text-slate-900">Click to upload document</p>
                <p className="text-sm text-slate-500">PDF, PNG, JPG up to 10MB</p>
              </div>
              <input type="file" className="hidden" onChange={handleFileUpload} disabled={loading} />
            </label>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider">Stored Documents</h4>
            <div className="grid grid-cols-1 gap-3 max-h-96 overflow-y-auto pr-2">
              {documents.length > 0 ? (
                documents.map((doc) => (
                  <div key={doc.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 group hover:bg-white hover:shadow-md transition-all">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white text-blue-600 rounded-xl flex items-center justify-center shadow-sm">
                        <FileText size={20} />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 truncate max-w-[200px]">{doc.name}</p>
                        <p className="text-xs text-slate-500">{formatSize(doc.size)} • {new Date(doc.uploaded_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => handleDownload(doc.id)}
                        className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                        title="Download"
                      >
                        <Download size={18} />
                      </button>
                      <button 
                        onClick={() => handleDelete(doc.id)}
                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 text-slate-400">
                  <FileText size={48} className="mx-auto mb-3 opacity-20" />
                  <p>No documents uploaded yet.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const SkillManager = ({ userId, userName, onClose }: { userId: number, userName: string, onClose: () => void }) => {
  const [skills, setSkills] = useState<any[]>([]);
  const [newSkill, setNewSkill] = useState('');
  const [proficiency, setProficiency] = useState('Intermediate');
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem('token');

  const fetchSkills = async () => {
    try {
      const data = await api.get(`/skills/${userId}`, token!);
      setSkills(data);
    } catch (err) {}
  };

  useEffect(() => {
    fetchSkills();
  }, [userId]);

  const handleAddSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkill.trim()) return;
    setLoading(true);
    try {
      await api.post('/skills', { user_id: userId, skill_name: newSkill, proficiency }, token!);
      setNewSkill('');
      fetchSkills();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSkill = async (skillId: number) => {
    try {
      await api.delete(`/skills/${skillId}`, token!);
      fetchSkills();
    } catch (err) {}
  };

  const handleUpdateProficiency = async (skillId: number, skillName: string, newProf: string) => {
    try {
      await api.put(`/skills/${skillId}`, { skill_name: skillName, proficiency: newProf }, token!);
      fetchSkills();
    } catch (err) {}
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden"
      >
        <div className="p-8 bg-blue-600 text-white flex justify-between items-center">
          <div>
            <h3 className="text-2xl font-bold">Skills Management</h3>
            <p className="text-blue-100 mt-1">Managing skills for {userName}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-xl transition-all">
            <X size={24} />
          </button>
        </div>

        <div className="p-8 space-y-8">
          <form onSubmit={handleAddSkill} className="flex gap-3">
            <div className="flex-1 space-y-2">
              <input
                type="text"
                required
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter skill (e.g. React, SQL)"
              />
            </div>
            <select
              value={proficiency}
              onChange={(e) => setProficiency(e.target.value)}
              className="px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium"
            >
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Expert">Expert</option>
            </select>
            <button
              type="submit"
              disabled={loading}
              className="px-6 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all disabled:opacity-50"
            >
              Add
            </button>
          </form>

          <div className="space-y-4">
            <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider">Current Skills</h4>
            <div className="grid grid-cols-1 gap-3">
              {skills.length > 0 ? (
                skills.map((skill) => (
                  <div key={skill.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 group">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center">
                        <Award size={18} />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">{skill.skill_name}</p>
                        <select
                          value={skill.proficiency}
                          onChange={(e) => handleUpdateProficiency(skill.id, skill.skill_name, e.target.value)}
                          className="text-xs font-bold text-blue-600 bg-transparent border-none p-0 focus:ring-0 cursor-pointer"
                        >
                          <option value="Beginner">Beginner</option>
                          <option value="Intermediate">Intermediate</option>
                          <option value="Expert">Expert</option>
                        </select>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleDeleteSkill(skill.id)}
                      className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                    >
                      <X size={18} />
                    </button>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-slate-400">
                  <Award size={48} className="mx-auto mb-3 opacity-20" />
                  <p>No skills added yet.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const Employees = () => {
  const [employees, setEmployees] = useState<any[]>([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<any>(null);
  const [skillManagingUser, setSkillManagingUser] = useState<any>(null);
  const [documentManagingUser, setDocumentManagingUser] = useState<any>(null);
  const [formData, setFormData] = useState({ name: '', email: '', employee_id: '', department: '', designation: '', role: 'employee', status: 'active' });
  const token = localStorage.getItem('token');

  const fetchEmployees = async () => {
    try {
      const data = await api.get('/employees', token!);
      setEmployees(data);
    } catch (err) {}
  };

  useEffect(() => { fetchEmployees(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingEmployee) {
        await api.patch(`/admin/employees/${editingEmployee.id}`, formData, token!);
      } else {
        await api.post('/employees', formData, token!);
      }
      setShowForm(false);
      setEditingEmployee(null);
      setFormData({ name: '', email: '', employee_id: '', department: '', designation: '', role: 'employee', status: 'active' });
      fetchEmployees();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleEdit = (emp: any) => {
    setEditingEmployee(emp);
    setFormData({
      name: emp.name,
      email: emp.email,
      employee_id: emp.employee_id,
      department: emp.department || '',
      designation: emp.designation || '',
      role: emp.role,
      status: emp.status
    });
    setShowForm(true);
  };

  return (
    <div className="space-y-8">
      <header className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Employee Directory</h2>
          <p className="text-slate-500 mt-1">Manage organization members.</p>
        </div>
        <button
          onClick={() => {
            setEditingEmployee(null);
            setFormData({ name: '', email: '', employee_id: '', department: '', designation: '', role: 'employee', status: 'active' });
            setShowForm(true);
          }}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
        >
          <Plus size={20} />
          Add Employee
        </button>
      </header>

      {showForm && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold">{editingEmployee ? 'Edit Employee' : 'Add New Employee'}</h3>
            <button onClick={() => setShowForm(false)} className="text-slate-400 hover:text-slate-600">
              <X size={24} />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Full Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="John Doe"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Email Address</label>
              <input
                type="email"
                required
                disabled={!!editingEmployee}
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-50"
                placeholder="john@lumina.com"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Employee ID</label>
              <input
                type="text"
                required
                disabled={!!editingEmployee}
                value={formData.employee_id}
                onChange={(e) => setFormData({ ...formData, employee_id: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-50"
                placeholder="EMP123"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Department</label>
              <input
                type="text"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Engineering"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Designation</label>
              <input
                type="text"
                value={formData.designation}
                onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Software Engineer"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Role</label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="employee">Employee</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            {editingEmployee && (
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="on_leave">On Leave</option>
                </select>
              </div>
            )}
            <div className="md:col-span-2">
              <button type="submit" className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all">
                {editingEmployee ? 'Update Employee' : 'Create Employee'}
              </button>
            </div>
          </form>
        </motion.div>
      )}

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
        <div className="flex items-center gap-4">
          <label className="text-sm font-bold text-slate-500 uppercase tracking-wider">Filter Status:</label>
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium"
          >
            <option value="all">All Employees</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="on_leave">On Leave</option>
          </select>
        </div>
        <div className="text-sm text-slate-500 font-medium">
          Showing {employees.filter(e => statusFilter === 'all' || e.status === statusFilter).length} employees
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Employee</th>
              <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">ID</th>
              <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Department</th>
              <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Role</th>
              <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Status</th>
              <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {employees
              .filter(emp => statusFilter === 'all' || emp.status === statusFilter)
              .map((emp) => (
              <tr key={emp.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-8 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                      {emp.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">{emp.name}</p>
                      <p className="text-xs text-slate-500">{emp.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-4 text-slate-600 font-medium">{emp.employee_id}</td>
                <td className="px-8 py-4 text-slate-600">{emp.department || '--'}</td>
                <td className="px-8 py-4 capitalize text-slate-600">{emp.role}</td>
                <td className="px-8 py-4">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    emp.status === 'active' ? 'bg-green-100 text-green-700' : 
                    emp.status === 'on_leave' ? 'bg-orange-100 text-orange-700' :
                    'bg-slate-100 text-slate-700'
                  }`}>
                    {emp.status.replace('_', ' ')}
                  </span>
                </td>
                <td className="px-8 py-4">
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => handleEdit(emp)}
                      className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                      title="Edit Employee"
                    >
                      <Settings size={20} />
                    </button>
                    <button 
                      onClick={() => setSkillManagingUser(emp)}
                      className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                      title="Manage Skills"
                    >
                      <Award size={20} />
                    </button>
                    <button 
                      onClick={() => setDocumentManagingUser(emp)}
                      className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                      title="Manage Documents"
                    >
                      <FileText size={20} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AnimatePresence>
        {skillManagingUser && (
          <SkillManager 
            userId={skillManagingUser.id} 
            userName={skillManagingUser.name} 
            onClose={() => setSkillManagingUser(null)} 
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {documentManagingUser && (
          <DocumentManager 
            userId={documentManagingUser.id} 
            userName={documentManagingUser.name} 
            onClose={() => setDocumentManagingUser(null)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
};

const Expenses = ({ user }: { user: User }) => {
  const [expenses, setExpenses] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ category: 'Travel', amount: '', description: '' });
  const token = localStorage.getItem('token');
  const isAdmin = user.role === 'admin';

  const fetchData = async () => {
    try {
      const data = await api.get(isAdmin ? '/admin/expenses' : '/expenses/me', token!);
      setExpenses(data);
    } catch (err) {}
  };

  useEffect(() => {
    fetchData();
  }, [token, isAdmin]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/expenses', formData, token!);
      setShowForm(false);
      setFormData({ category: 'Travel', amount: '', description: '' });
      fetchData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const updateStatus = async (id: number, status: string) => {
    try {
      await api.patch(`/admin/expenses/${id}`, { status }, token!);
      fetchData();
    } catch (err) {}
  };

  const deleteExpense = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this expense claim?')) return;
    try {
      await api.delete(`/expenses/${id}`, token!);
      fetchData();
    } catch (err) {}
  };

  return (
    <div className="space-y-8">
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Expense Reimbursements</h2>
          <p className="text-slate-500 mt-1">Manage and track your business expenses.</p>
        </div>
        {!isAdmin && (
          <button 
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
          >
            <Plus size={20} /> New Claim
          </button>
        )}
      </header>

      <AnimatePresence>
        {showForm && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 overflow-hidden"
          >
            <h3 className="text-xl font-bold mb-6">Submit Expense Claim</h3>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {['Travel', 'Meals', 'Equipment', 'Software', 'Other'].map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Amount ($)</label>
                <input
                  type="number"
                  required
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="150.00"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Description</label>
                <input
                  type="text"
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Client lunch meeting"
                />
              </div>
              <div className="md:col-span-3">
                <button type="submit" className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all">
                  Submit Claim
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              {isAdmin && <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Employee</th>}
              <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Category</th>
              <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Amount</th>
              <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Applied At</th>
              <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Status</th>
              <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {expenses.map((exp) => (
              <tr key={exp.id} className="hover:bg-slate-50 transition-colors">
                {isAdmin && (
                  <td className="px-8 py-4">
                    <p className="font-semibold text-slate-900">{exp.employee_name}</p>
                  </td>
                )}
                <td className="px-8 py-4">
                  <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-[10px] font-bold uppercase tracking-wider">
                    {exp.category}
                  </span>
                  <p className="text-xs text-slate-500 mt-1">{exp.description}</p>
                </td>
                <td className="px-8 py-4 font-bold text-slate-900">${exp.amount.toLocaleString()}</td>
                <td className="px-8 py-4 text-slate-500 text-sm">{new Date(exp.applied_at).toLocaleDateString()}</td>
                <td className="px-8 py-4">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    exp.status === 'approved' ? 'bg-green-100 text-green-700' : 
                    exp.status === 'rejected' ? 'bg-red-100 text-red-700' :
                    'bg-blue-100 text-blue-700'
                  }`}>
                    {exp.status}
                  </span>
                </td>
                <td className="px-8 py-4">
                  <div className="flex items-center gap-2">
                    {isAdmin && exp.status === 'pending' && (
                      <>
                        <button 
                          onClick={() => updateStatus(exp.id, 'approved')}
                          className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-600 hover:text-white transition-all"
                        >
                          <CheckCircle2 size={16} />
                        </button>
                        <button 
                          onClick={() => updateStatus(exp.id, 'rejected')}
                          className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition-all"
                        >
                          <XCircle size={16} />
                        </button>
                      </>
                    )}
                    {!isAdmin && exp.status === 'pending' && (
                      <button 
                        onClick={() => deleteExpense(exp.id)}
                        className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition-all"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {!expenses.length && (
              <tr>
                <td colSpan={isAdmin ? 6 : 4} className="px-8 py-12 text-center text-slate-400">No expense claims found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const Helpdesk = ({ user }: { user: User }) => {
  const [tickets, setTickets] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ category: 'IT', subject: '', description: '', priority: 'medium' });
  const token = localStorage.getItem('token');
  const isAdmin = user.role === 'admin';

  const fetchData = async () => {
    try {
      const data = await api.get(isAdmin ? '/admin/helpdesk/tickets' : '/helpdesk/tickets/me', token!);
      setTickets(data);
    } catch (err) {}
  };

  useEffect(() => {
    fetchData();
  }, [token, isAdmin]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/helpdesk/tickets', formData, token!);
      setShowForm(false);
      setFormData({ category: 'IT', subject: '', description: '', priority: 'medium' });
      fetchData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const updateStatus = async (id: number, status: string) => {
    try {
      const endpoint = isAdmin ? `/admin/helpdesk/tickets/${id}` : `/helpdesk/tickets/${id}`;
      await api.patch(endpoint, { status }, token!);
      fetchData();
    } catch (err) {}
  };

  return (
    <div className="space-y-8">
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Employee Helpdesk</h2>
          <p className="text-slate-500 mt-1">Get support for IT, HR, or other queries.</p>
        </div>
        {!isAdmin && (
          <button 
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
          >
            <Plus size={20} /> New Ticket
          </button>
        )}
      </header>

      <AnimatePresence>
        {showForm && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 overflow-hidden"
          >
            <h3 className="text-xl font-bold mb-6">Raise Support Ticket</h3>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {['IT', 'HR', 'Payroll', 'Facilities', 'Other'].map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Priority</label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {['low', 'medium', 'high', 'critical'].map(p => (
                    <option key={p} value={p}>{p.toUpperCase()}</option>
                  ))}
                </select>
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="text-sm font-semibold text-slate-700">Subject</label>
                <input
                  type="text"
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Unable to access VPN"
                />
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="text-sm font-semibold text-slate-700">Description</label>
                <textarea
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]"
                  placeholder="Please provide details about your issue..."
                />
              </div>
              <div className="md:col-span-2">
                <button type="submit" className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all">
                  Submit Ticket
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 gap-4">
        {tickets.map((ticket) => (
          <div key={ticket.id} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center justify-between gap-6">
            <div className="flex items-center gap-6 flex-1">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
                ticket.priority === 'critical' ? 'bg-red-50 text-red-600' :
                ticket.priority === 'high' ? 'bg-orange-50 text-orange-600' :
                'bg-blue-50 text-blue-600'
              }`}>
                <LifeBuoy size={28} />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                    {ticket.category}
                  </span>
                  <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md ${
                    ticket.status === 'open' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                  }`}>
                    {ticket.status}
                  </span>
                  {isAdmin && <span className="text-xs text-slate-400 font-medium">By {ticket.employee_name}</span>}
                </div>
                <h3 className="text-lg font-bold text-slate-900">{ticket.subject}</h3>
                <p className="text-slate-500 text-sm line-clamp-1">{ticket.description}</p>
              </div>
            </div>
            {ticket.status === 'open' && (
              <button 
                onClick={() => updateStatus(ticket.id, 'resolved')}
                className="px-4 py-2 bg-green-600 text-white rounded-xl text-sm font-bold hover:bg-green-700 transition-all"
              >
                Mark Resolved
              </button>
            )}
          </div>
        ))}
        {!tickets.length && (
          <div className="bg-white p-12 rounded-3xl border border-dashed border-slate-200 text-center text-slate-400">
            No support tickets found.
          </div>
        )}
      </div>
    </div>
  );
};

const DEI = () => {
  const [stats, setStats] = useState<any>(null);
  const [profile, setProfile] = useState<any>({ gender_identity: '', ethnicity: '', disability_status: 'No', veteran_status: 'No' });
  const token = localStorage.getItem('token');

  const fetchData = async () => {
    try {
      const [statsData, profileData] = await Promise.all([
        api.get('/admin/dei/stats', token!),
        api.get('/dei/me', token!)
      ]);
      setStats(statsData);
      setProfile(profileData);
    } catch (err) {}
  };

  useEffect(() => {
    fetchData();
  }, [token]);

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/dei/me', profile, token!);
      alert('DEI profile updated successfully.');
      fetchData();
    } catch (err) {}
  };

  return (
    <div className="space-y-8">
      <header>
        <h2 className="text-3xl font-bold text-slate-900">Diversity, Equity & Inclusion</h2>
        <p className="text-slate-500 mt-1">Measuring and improving representation at Lumina.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
          <h3 className="text-xl font-bold mb-6">My Diversity Profile</h3>
          <p className="text-sm text-slate-500 mb-6 italic">This information is voluntary and used for aggregate reporting only.</p>
          <form onSubmit={handleProfileSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Gender Identity</label>
                <select
                  value={profile.gender_identity}
                  onChange={(e) => setProfile({ ...profile, gender_identity: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select...</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Non-binary">Non-binary</option>
                  <option value="Prefer not to say">Prefer not to say</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Ethnicity</label>
                <select
                  value={profile.ethnicity}
                  onChange={(e) => setProfile({ ...profile, ethnicity: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select...</option>
                  <option value="Asian">Asian</option>
                  <option value="Black">Black</option>
                  <option value="Hispanic">Hispanic</option>
                  <option value="White">White</option>
                  <option value="Mixed">Mixed</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Disability Status</label>
                <select
                  value={profile.disability_status}
                  onChange={(e) => setProfile({ ...profile, disability_status: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="No">No</option>
                  <option value="Yes">Yes</option>
                  <option value="Prefer not to say">Prefer not to say</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Veteran Status</label>
                <select
                  value={profile.veteran_status}
                  onChange={(e) => setProfile({ ...profile, veteran_status: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="No">No</option>
                  <option value="Yes">Yes</option>
                  <option value="Prefer not to say">Prefer not to say</option>
                </select>
              </div>
            </div>
            <button type="submit" className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all">
              Update Profile
            </button>
          </form>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
          <h3 className="text-xl font-bold mb-6">Organization Representation</h3>
          {stats ? (
            <div className="grid grid-cols-2 gap-8">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Gender</p>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={stats.genderStats}
                        innerRadius={40}
                        outerRadius={60}
                        paddingAngle={5}
                        dataKey="value"
                        nameKey="label"
                      >
                        {stats.genderStats.map((entry: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={['#3b82f6', '#ec4899', '#8b5cf6', '#94a3b8'][index % 4]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Ethnicity</p>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={stats.ethnicityStats}
                        innerRadius={40}
                        outerRadius={60}
                        paddingAngle={5}
                        dataKey="value"
                        nameKey="label"
                      >
                        {stats.ethnicityStats.map((entry: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#6366f1'][index % 5]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Disability</p>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={stats.disabilityStats}
                        innerRadius={40}
                        outerRadius={60}
                        paddingAngle={5}
                        dataKey="value"
                        nameKey="label"
                      >
                        {stats.disabilityStats.map((entry: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={['#3b82f6', '#f43f5e', '#94a3b8'][index % 3]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Veteran</p>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={stats.veteranStats}
                        innerRadius={40}
                        outerRadius={60}
                        paddingAngle={5}
                        dataKey="value"
                        nameKey="label"
                      >
                        {stats.veteranStats.map((entry: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={['#3b82f6', '#10b981', '#94a3b8'][index % 3]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center text-slate-400 italic">
              Insufficient data for aggregate reporting.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const Succession = () => {
  const [roles, setRoles] = useState<any[]>([]);
  const [selectedRole, setSelectedRole] = useState<any>(null);
  const [plans, setPlans] = useState<any[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [showRoleForm, setShowRoleForm] = useState(false);
  const [showPlanForm, setShowPlanForm] = useState(false);
  const [roleFormData, setRoleFormData] = useState({ designation: '', department: '', business_impact: 'High', risk_level: 'Medium' });
  const [planFormData, setPlanFormData] = useState({ successor_id: '', readiness_level: 'Ready Now', development_plan: '' });
  const token = localStorage.getItem('token');

  const fetchData = async () => {
    try {
      const [rolesData, employeesData] = await Promise.all([
        api.get('/admin/succession/critical-roles', token!),
        api.get('/employees', token!)
      ]);
      setRoles(rolesData);
      setEmployees(employeesData);
    } catch (err) {}
  };

  useEffect(() => {
    fetchData();
  }, [token]);

  const fetchPlans = async (roleId: number) => {
    try {
      const data = await api.get(`/admin/succession/plans/${roleId}`, token!);
      setPlans(data);
    } catch (err) {}
  };

  const handleRoleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/admin/succession/critical-roles', roleFormData, token!);
      setShowRoleForm(false);
      setRoleFormData({ designation: '', department: '', business_impact: 'High', risk_level: 'Medium' });
      fetchData();
    } catch (err) {}
  };

  const handlePlanSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/admin/succession/plans', { ...planFormData, critical_role_id: selectedRole.id }, token!);
      setShowPlanForm(false);
      setPlanFormData({ successor_id: '', readiness_level: 'Ready Now', development_plan: '' });
      fetchPlans(selectedRole.id);
    } catch (err) {}
  };

  const deleteRole = async (id: number) => {
    if (!window.confirm('Are you sure you want to remove this critical role? All associated succession plans will be deleted.')) return;
    try {
      await api.delete(`/admin/succession/critical-roles/${id}`, token!);
      fetchData();
      if (selectedRole?.id === id) setSelectedRole(null);
    } catch (err) {}
  };

  const deletePlan = async (id: number) => {
    if (!window.confirm('Are you sure you want to remove this succession plan?')) return;
    try {
      await api.delete(`/admin/succession/plans/${id}`, token!);
      fetchPlans(selectedRole.id);
    } catch (err) {}
  };

  return (
    <div className="space-y-8">
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Succession Planning</h2>
          <p className="text-slate-500 mt-1">Ensuring leadership continuity for critical roles.</p>
        </div>
        <button 
          onClick={() => setShowRoleForm(!showRoleForm)}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
        >
          <Plus size={20} /> Add Critical Role
        </button>
      </header>

      <AnimatePresence>
        {showRoleForm && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 overflow-hidden"
          >
            <h3 className="text-xl font-bold mb-6">Define Critical Role</h3>
            <form onSubmit={handleRoleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Designation</label>
                <input
                  type="text"
                  required
                  value={roleFormData.designation}
                  onChange={(e) => setRoleFormData({ ...roleFormData, designation: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Engineering Manager"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Department</label>
                <input
                  type="text"
                  required
                  value={roleFormData.department}
                  onChange={(e) => setRoleFormData({ ...roleFormData, department: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Engineering"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Business Impact</label>
                <select
                  value={roleFormData.business_impact}
                  onChange={(e) => setRoleFormData({ ...roleFormData, business_impact: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Critical">Critical</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Risk Level</label>
                <select
                  value={roleFormData.risk_level}
                  onChange={(e) => setRoleFormData({ ...roleFormData, risk_level: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <button type="submit" className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all">
                  Save Critical Role
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-4">
          <h3 className="text-lg font-bold text-slate-900">Critical Roles</h3>
          {roles.map(role => (
            <div key={role.id} className="relative group">
              <button
                onClick={() => { setSelectedRole(role); fetchPlans(role.id); }}
                className={`w-full p-6 rounded-3xl border text-left transition-all ${
                  selectedRole?.id === role.id ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-200' : 'bg-white border-slate-100 text-slate-900 hover:border-blue-200'
                }`}
              >
                <p className="font-bold text-lg">{role.designation}</p>
                <p className={`text-sm ${selectedRole?.id === role.id ? 'text-blue-100' : 'text-slate-500'}`}>{role.department}</p>
                <div className="mt-4 flex gap-2">
                  <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md ${
                    selectedRole?.id === role.id ? 'bg-blue-500 text-white' : 'bg-red-50 text-red-600'
                  }`}>
                    {role.business_impact} Impact
                  </span>
                </div>
              </button>
              <button 
                onClick={(e) => { e.stopPropagation(); deleteRole(role.id); }}
                className={`absolute top-4 right-4 p-2 rounded-xl opacity-0 group-hover:opacity-100 transition-all ${
                  selectedRole?.id === role.id ? 'bg-blue-500 text-white hover:bg-blue-400' : 'bg-red-50 text-red-600 hover:bg-red-100'
                }`}
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>

        <div className="lg:col-span-2 space-y-6">
          {selectedRole ? (
            <>
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-slate-900">Succession Pipeline: {selectedRole.designation}</h3>
                <button 
                  onClick={() => setShowPlanForm(!showPlanForm)}
                  className="text-blue-600 hover:text-blue-700 font-bold text-sm flex items-center gap-1"
                >
                  <Plus size={16} /> Nominate Successor
                </button>
              </div>

              <AnimatePresence>
                {showPlanForm && (
                  <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="bg-slate-50 p-6 rounded-3xl border border-slate-200"
                  >
                    <form onSubmit={handlePlanSubmit} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-semibold text-slate-700">Successor</label>
                          <select
                            required
                            value={planFormData.successor_id}
                            onChange={(e) => setPlanFormData({ ...planFormData, successor_id: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="">Select employee...</option>
                            {employees.map(emp => (
                              <option key={emp.id} value={emp.id}>{emp.name} ({emp.designation})</option>
                            ))}
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-semibold text-slate-700">Readiness</label>
                          <select
                            value={planFormData.readiness_level}
                            onChange={(e) => setPlanFormData({ ...planFormData, readiness_level: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="Ready Now">Ready Now</option>
                            <option value="1-2 Years">1-2 Years</option>
                            <option value="3-5 Years">3-5 Years</option>
                          </select>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700">Development Plan</label>
                        <textarea
                          value={planFormData.development_plan}
                          onChange={(e) => setPlanFormData({ ...planFormData, development_plan: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[80px]"
                          placeholder="Mentorship, specific training, etc."
                        />
                      </div>
                      <button type="submit" className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700">
                        Confirm Nomination
                      </button>
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="space-y-4">
                {plans.map(plan => (
                  <div key={plan.id} className="bg-white p-6 rounded-3xl border border-slate-100 flex items-center justify-between group">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                        {plan.successor_name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">{plan.successor_name}</p>
                        <p className="text-xs text-slate-500">Readiness: <span className="font-bold text-blue-600">{plan.readiness_level}</span></p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <p className="text-xs text-slate-400 font-medium uppercase tracking-widest mb-1">Development Plan</p>
                        <p className="text-sm text-slate-600 italic">"{plan.development_plan || 'No plan defined.'}"</p>
                      </div>
                      <button 
                        onClick={() => deletePlan(plan.id)}
                        className="p-2 text-slate-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-all"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
                {!plans.length && (
                  <div className="bg-white p-12 rounded-3xl border border-dashed border-slate-200 text-center text-slate-400">
                    No successors nominated for this role yet.
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 bg-white rounded-3xl border border-dashed border-slate-200 p-12">
              <TrendingUp size={48} className="mb-4 opacity-20" />
              <p className="font-medium">Select a critical role to view its succession pipeline.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const Offboarding = () => {
  const [separations, setSeparations] = useState<any[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ user_id: '', type: 'voluntary', last_working_day: '', reason: '' });
  const token = localStorage.getItem('token');

  const fetchData = async () => {
    try {
      const [sepData, empData] = await Promise.all([
        api.get('/admin/offboarding', token!),
        api.get('/employees', token!)
      ]);
      setSeparations(sepData);
      setEmployees(empData.filter((e: any) => e.status === 'active'));
    } catch (err) {}
  };

  useEffect(() => {
    fetchData();
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/admin/offboarding/initiate', formData, token!);
      setShowForm(false);
      setFormData({ user_id: '', type: 'voluntary', last_working_day: '', reason: '' });
      fetchData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const updateSeparation = async (id: number, data: any) => {
    try {
      await api.patch(`/admin/offboarding/${id}`, data, token!);
      fetchData();
    } catch (err) {}
  };

  const cancelOffboarding = async (id: number) => {
    if (!window.confirm('Are you sure you want to cancel this offboarding process? The employee status will be reset to active.')) return;
    try {
      await api.delete(`/admin/offboarding/${id}`, token!);
      fetchData();
    } catch (err) {}
  };

  return (
    <div className="space-y-8">
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Offboarding & Separations</h2>
          <p className="text-slate-500 mt-1">Manage employee exits and full & final settlements.</p>
        </div>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-all shadow-lg shadow-red-200"
        >
          <UserMinus size={20} /> Initiate Separation
        </button>
      </header>

      <AnimatePresence>
        {showForm && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 overflow-hidden"
          >
            <h3 className="text-xl font-bold mb-6">Initiate Employee Separation</h3>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Employee</label>
                <select
                  required
                  value={formData.user_id}
                  onChange={(e) => setFormData({ ...formData, user_id: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select employee...</option>
                  {employees.map(emp => (
                    <option key={emp.id} value={emp.id}>{emp.name} ({emp.employee_id})</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="voluntary">Voluntary Resignation</option>
                  <option value="involuntary">Involuntary Termination</option>
                  <option value="retirement">Retirement</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Last Working Day</label>
                <input
                  type="date"
                  required
                  value={formData.last_working_day}
                  onChange={(e) => setFormData({ ...formData, last_working_day: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="md:col-span-3 space-y-2">
                <label className="text-sm font-semibold text-slate-700">Reason</label>
                <input
                  type="text"
                  required
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Better opportunity, relocation, etc."
                />
              </div>
              <div className="md:col-span-3">
                <button type="submit" className="w-full py-4 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-all">
                  Confirm Initiation
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Employee</th>
              <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">LWD</th>
              <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Checklist</th>
              <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Status</th>
              <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {separations.map((sep) => (
              <tr key={sep.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-8 py-4">
                  <p className="font-bold text-slate-900">{sep.employee_name}</p>
                  <p className="text-xs text-slate-500 capitalize">{sep.type}</p>
                </td>
                <td className="px-8 py-4 text-slate-600 font-medium">{sep.last_working_day}</td>
                <td className="px-8 py-4 space-y-1">
                  <div className="flex items-center gap-2">
                    <input 
                      type="checkbox" 
                      checked={!!sep.exit_interview_completed} 
                      onChange={(e) => updateSeparation(sep.id, { exit_interview_completed: e.target.checked })}
                      className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-xs text-slate-600">Exit Interview</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input 
                      type="checkbox" 
                      checked={!!sep.final_settlement_processed} 
                      onChange={(e) => updateSeparation(sep.id, { final_settlement_processed: e.target.checked })}
                      className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-xs text-slate-600">F&F Processed</span>
                  </div>
                </td>
                <td className="px-8 py-4">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    sep.status === 'completed' ? 'bg-slate-100 text-slate-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {sep.status}
                  </span>
                </td>
                <td className="px-8 py-4">
                  <div className="flex items-center gap-3">
                    {sep.status === 'initiated' && (
                      <button 
                        onClick={() => updateSeparation(sep.id, { status: 'completed' })}
                        disabled={!sep.exit_interview_completed || !sep.final_settlement_processed}
                        className="text-blue-600 hover:underline font-bold text-sm disabled:opacity-50"
                      >
                        Complete Exit
                      </button>
                    )}
                    <button 
                      onClick={() => cancelOffboarding(sep.id)}
                      className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition-all"
                      title="Cancel Offboarding"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {!separations.length && (
              <tr>
                <td colSpan={5} className="px-8 py-12 text-center text-slate-400">No active separations.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const Payroll = ({ user }: { user: User }) => {
  const [payrolls, setPayrolls] = useState<any[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ user_id: '', month: 'March', year: 2026, basic_salary: 0, allowances: 0, deductions: 0 });
  const token = localStorage.getItem('token');
  const isAdmin = user.role === 'admin';

  const fetchData = async () => {
    try {
      if (isAdmin) {
        const [payrollData, employeesData] = await Promise.all([
          api.get('/admin/payroll', token!),
          api.get('/employees', token!)
        ]);
        setPayrolls(payrollData);
        setEmployees(employeesData);
      } else {
        const data = await api.get('/payroll/me', token!);
        setPayrolls(data);
      }
    } catch (err) {}
  };

  useEffect(() => {
    fetchData();
  }, [token, isAdmin]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const net_pay = Number(formData.basic_salary) + Number(formData.allowances) - Number(formData.deductions);
    try {
      await api.post('/admin/payroll', { ...formData, net_pay }, token!);
      setShowForm(false);
      setFormData({ user_id: '', month: 'March', year: 2026, basic_salary: 0, allowances: 0, deductions: 0 });
      fetchData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="space-y-8">
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Payroll & Payslips</h2>
          <p className="text-slate-500 mt-1">{isAdmin ? 'Manage organization payroll.' : 'View your compensation history.'}</p>
        </div>
        {isAdmin && (
          <button 
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
          >
            <Plus size={20} /> Generate Payroll
          </button>
        )}
      </header>

      <AnimatePresence>
        {showForm && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 overflow-hidden"
          >
            <h3 className="text-xl font-bold mb-6">Generate New Payroll</h3>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Employee</label>
                <select
                  required
                  value={formData.user_id}
                  onChange={(e) => setFormData({ ...formData, user_id: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select employee...</option>
                  {employees.map(emp => (
                    <option key={emp.id} value={emp.id}>{emp.name} ({emp.employee_id})</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Month</label>
                <select
                  value={formData.month}
                  onChange={(e) => setFormData({ ...formData, month: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"].map(m => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Year</label>
                <input
                  type="number"
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Basic Salary</label>
                <input
                  type="number"
                  value={formData.basic_salary}
                  onChange={(e) => setFormData({ ...formData, basic_salary: parseInt(e.target.value) })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Allowances</label>
                <input
                  type="number"
                  value={formData.allowances}
                  onChange={(e) => setFormData({ ...formData, allowances: parseInt(e.target.value) })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Deductions</label>
                <input
                  type="number"
                  value={formData.deductions}
                  onChange={(e) => setFormData({ ...formData, deductions: parseInt(e.target.value) })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="md:col-span-3">
                <button type="submit" className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all">
                  Generate Payroll
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              {isAdmin && <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Employee</th>}
              <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Month/Year</th>
              <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Basic Salary</th>
              <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Deductions</th>
              <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Net Pay</th>
              <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {payrolls.map((pay) => (
              <tr key={pay.id} className="hover:bg-slate-50 transition-colors">
                {isAdmin && (
                  <td className="px-8 py-4">
                    <p className="font-semibold text-slate-900">{pay.employee_name}</p>
                    <p className="text-xs text-slate-500">{pay.employee_id}</p>
                  </td>
                )}
                <td className="px-8 py-4 font-semibold text-slate-900">{pay.month} {pay.year}</td>
                <td className="px-8 py-4 text-slate-600">${pay.basic_salary.toLocaleString()}</td>
                <td className="px-8 py-4 text-red-500">-${pay.deductions.toLocaleString()}</td>
                <td className="px-8 py-4 font-bold text-blue-600">${pay.net_pay.toLocaleString()}</td>
                <td className="px-8 py-4">
                  <button className="text-blue-600 hover:underline font-medium text-sm">Download PDF</button>
                </td>
              </tr>
            ))}
            {!payrolls.length && (
              <tr>
                <td colSpan={isAdmin ? 6 : 5} className="px-8 py-12 text-center text-slate-400">
                  No payroll records found yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      api.get('/me', token)
        .then(setUser)
        .catch(() => localStorage.removeItem('token'))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const handleLogin = (token: string, user: User) => {
    localStorage.setItem('token', token);
    setUser(user);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  if (!user) return <Login onLogin={handleLogin} />;

  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Layout user={user} onLogout={handleLogout}>
        <Routes>
          <Route path="/" element={<Dashboard user={user} />} />
          <Route path="/attendance" element={<Attendance user={user} />} />
          <Route path="/leaves" element={<Leaves user={user} />} />
          <Route path="/performance" element={<Performance user={user} />} />
          <Route path="/payroll" element={<Payroll user={user} />} />
          <Route path="/learning" element={<Learning />} />
          <Route path="/org-chart" element={<OrgChart />} />
          <Route path="/policies" element={<Policies />} />
          <Route path="/onboarding" element={<Onboarding user={user} />} />
          <Route path="/grievances" element={<Grievances user={user} />} />
          <Route path="/expenses" element={<Expenses user={user} />} />
          <Route path="/helpdesk" element={<Helpdesk user={user} />} />
          <Route path="/profile" element={<Profile user={user} />} />
          {user.role === 'admin' && (
            <>
              <Route path="/employees" element={<Employees />} />
              <Route path="/recruitment" element={<Recruitment />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/dei" element={<DEI />} />
              <Route path="/succession" element={<Succession />} />
              <Route path="/offboarding" element={<Offboarding />} />
            </>
          )}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
