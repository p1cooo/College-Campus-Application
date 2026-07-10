import React, { useState, useEffect, useRef } from 'react';
import {
  LayoutDashboard,
  BookOpen,
  Calendar,
  Megaphone,
  CheckSquare,
  Bell,
  ChevronLeft,
  ChevronRight,
  Search,
  Download,
  CheckCircle2,
  AlertCircle,
  Clock,
  MapPin,
  User,
  MoreVertical,
  CalendarDays,
  Check,
  FileText,
  FileArchive,
  ArrowRight,
  Sparkles,
  Award,
  Battery,
  Wifi,
  Signal,
  X,
  FileCode,
  Bookmark,
  Share2,
  ThumbsUp,
  Inbox,
  AlertTriangle,
  Info,
  LogOut
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// ==========================================
// MOCK DATA STRUCTURES
// ==========================================

interface Course {
  id: string;
  code: string;
  name: string;
  progress: number; // 0 - 100
  performance: 'good' | 'warning' | 'low';
  grade: string;
  lecturer: {
    name: string;
    email: string;
    office: string;
  };
  attendanceStats: {
    present: number;
    absent: number;
    total: number;
  };
  modules: {
    id: string;
    title: string;
    type: 'pdf' | 'zip' | 'code';
    size: string;
    releasedDate: string;
  }[];
}

interface ClassSession {
  id: string;
  courseCode: string;
  courseName: string;
  timeStart: string;
  timeEnd: string;
  room: string;
  lecturerName: string;
  type: 'Lecture' | 'Lab' | 'Tutorial';
  color: string; // for custom border
}

interface Announcement {
  id: string;
  title: string;
  category: 'Academic' | 'Events' | 'Facilities';
  date: string;
  description: string;
  unread: boolean;
  likes: number;
}

interface Notification {
  id: string;
  title: string;
  category: 'Assignments' | 'Class Notices' | 'Fees';
  date: string;
  urgency: 'URGENT' | 'IMPORTANT' | 'NEW';
  description: string;
  unread: boolean;
}

interface AttendanceDay {
  date: string;
  status: 'present' | 'absent' | 'no-class';
  topic?: string;
}

// 4 Enrolled Courses at MCKL
const INITIAL_COURSES: Course[] = [
  {
    id: 'c1',
    code: 'WAD301',
    name: 'Web Application Development',
    progress: 88,
    performance: 'good',
    grade: 'A',
    lecturer: {
      name: 'Mr. Eric Lim',
      email: 'eric.lim@mckl.edu.my',
      office: 'A-302, Staff Block A'
    },
    attendanceStats: { present: 14, absent: 1, total: 15 },
    modules: [
      { id: 'm1-1', title: 'Course Syllabus & Web Architecture Basics', type: 'pdf', size: '1.8 MB', releasedDate: 'Jun 02, 2026' },
      { id: 'm1-2', title: 'React 19 & Vite Project Scaffold Guide', type: 'pdf', size: '3.4 MB', releasedDate: 'Jun 15, 2026' },
      { id: 'm1-3', title: 'Tailwind CSS Custom Layouts & Design Tokens', type: 'pdf', size: '2.1 MB', releasedDate: 'Jun 22, 2026' },
      { id: 'm1-4', title: 'Practical Web App Source Code (React + Motion)', type: 'zip', size: '14.5 MB', releasedDate: 'Jul 01, 2026' }
    ]
  },
  {
    id: 'c2',
    code: 'DBS302',
    name: 'Database Management Systems',
    progress: 72,
    performance: 'warning',
    grade: 'B',
    lecturer: {
      name: 'Dr. Sarah Kong',
      email: 'sarah.k@mckl.edu.my',
      office: 'B-104, Staff Block B'
    },
    attendanceStats: { present: 11, absent: 3, total: 14 },
    modules: [
      { id: 'm2-1', title: 'Introduction to Relational Databases', type: 'pdf', size: '2.5 MB', releasedDate: 'Jun 04, 2026' },
      { id: 'm2-2', title: 'Advanced SQL Query Design & Optimizations', type: 'code', size: '420 KB', releasedDate: 'Jun 18, 2026' },
      { id: 'm2-3', title: 'Database Normalization Standard Forms (1NF to BCNF)', type: 'pdf', size: '3.1 MB', releasedDate: 'Jun 28, 2026' }
    ]
  },
  {
    id: 'c3',
    code: 'DSA303',
    name: 'Data Structures & Algorithms',
    progress: 95,
    performance: 'good',
    grade: 'A+',
    lecturer: {
      name: 'Prof. Aaron Tan',
      email: 'aaron.tan@mckl.edu.my',
      office: 'A-411, Staff Block A'
    },
    attendanceStats: { present: 15, absent: 0, total: 15 },
    modules: [
      { id: 'm3-1', title: 'Big O Complexity Analysis & Memory Layouts', type: 'pdf', size: '1.2 MB', releasedDate: 'Jun 01, 2026' },
      { id: 'm3-2', title: 'Binary Search Trees & Heap Implementation', type: 'zip', size: '8.9 MB', releasedDate: 'Jun 19, 2026' },
      { id: 'm3-3', title: 'Dynamic Programming & Memoization', type: 'pdf', size: '2.8 MB', releasedDate: 'Jul 04, 2026' }
    ]
  },
  {
    id: 'c4',
    code: 'MAT304',
    name: 'Discrete Mathematics',
    progress: 54,
    performance: 'low',
    grade: 'C+',
    lecturer: {
      name: 'Ms. Wong Shuh Jen',
      email: 'sj.wong@mckl.edu.my',
      office: 'B-215, Staff Block B'
    },
    attendanceStats: { present: 8, absent: 4, total: 12 },
    modules: [
      { id: 'm4-1', title: 'Propositional & First-Order Logic Foundations', type: 'pdf', size: '1.5 MB', releasedDate: 'Jun 08, 2026' },
      { id: 'm4-2', title: 'Set Theory, Relations, and Functions', type: 'pdf', size: '2.0 MB', releasedDate: 'Jun 22, 2026' }
    ]
  }
];

// Timeline Schedules Monday - Friday
const SCHEDULE_DATA: Record<string, ClassSession[]> = {
  Mon: [
    { id: 's1', courseCode: 'WAD301', courseName: 'Web Application Development', timeStart: '09:00 AM', timeEnd: '11:00 AM', room: 'Lab 304 (Block A)', lecturerName: 'Mr. Eric Lim', type: 'Lab', color: 'border-l-indigo-500' },
    { id: 's2', courseCode: 'DBS302', courseName: 'Database Management Systems', timeStart: '11:30 AM', timeEnd: '01:30 PM', room: 'Lecture Hall 2 (Block B)', lecturerName: 'Dr. Sarah Kong', type: 'Lecture', color: 'border-l-violet-500' }
  ],
  Tue: [
    { id: 's3', courseCode: 'DSA303', courseName: 'Data Structures & Algorithms', timeStart: '10:00 AM', timeEnd: '12:00 PM', room: 'Tutorial Room 102', lecturerName: 'Prof. Aaron Tan', type: 'Tutorial', color: 'border-l-emerald-500' },
    { id: 's4', courseCode: 'MAT304', courseName: 'Discrete Mathematics', timeStart: '02:00 PM', timeEnd: '04:00 PM', room: 'Seminar Room 5 (Block B)', lecturerName: 'Ms. Wong Shuh Jen', type: 'Lecture', color: 'border-l-rose-500' }
  ],
  Wed: [
    { id: 's5', courseCode: 'WAD301', courseName: 'Web Application Development', timeStart: '09:00 AM', timeEnd: '11:00 AM', room: 'Lecture Hall 1 (Block A)', lecturerName: 'Mr. Eric Lim', type: 'Lecture', color: 'border-l-indigo-500' },
    { id: 's6', courseCode: 'DBS302', courseName: 'Database Management Systems', timeStart: '01:00 PM', timeEnd: '03:00 PM', room: 'Lab 305 (Block A)', lecturerName: 'Dr. Sarah Kong', type: 'Lab', color: 'border-l-violet-500' }
  ],
  Thu: [
    { id: 's7', courseCode: 'DSA303', courseName: 'Data Structures & Algorithms', timeStart: '11:30 AM', timeEnd: '01:30 PM', room: 'Lab 304 (Block A)', lecturerName: 'Prof. Aaron Tan', type: 'Lab', color: 'border-l-emerald-500' },
    { id: 's8', courseCode: 'MAT304', courseName: 'Discrete Mathematics', timeStart: '02:30 PM', timeEnd: '04:30 PM', room: 'Lecture Hall 3 (Block B)', lecturerName: 'Ms. Wong Shuh Jen', type: 'Lecture', color: 'border-l-rose-500' }
  ],
  Fri: [] // No classes scheduled - beautiful empty state demonstration!
};

// Announcement mock data
const INITIAL_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'a1',
    title: 'Semester Final Project Showcase 2026',
    category: 'Events',
    date: 'Jul 07, 2026',
    description: 'Join us at the MCKL Main Auditorium as Information Technology diploma and degree students present their capstone projects. Representatives from top-tier tech startups and digital agencies will be present for direct recruitment and internship interviews. Bring physical copies of your resume!',
    unread: true,
    likes: 24
  },
  {
    id: 'a2',
    title: 'ICT Lab 304 Maintenance & Infrastructure Upgrades',
    category: 'Facilities',
    date: 'Jul 05, 2026',
    description: 'Please note that ICT Lab 304 will undergo critical server updates and hardware workstation replacements this Friday (Jul 10) from 08:00 AM to 05:00 PM. No students will be permitted during this time. Please utilize Lab 305 or the Library Computer Commons for self-study and project coding.',
    unread: true,
    likes: 8
  },
  {
    id: 'a3',
    title: 'Revised Assignment Submission Policy & Deadlines',
    category: 'Academic',
    date: 'Jul 03, 2026',
    description: 'In light of the upcoming mid-semester public holiday, the MCKL Academic Board has approved a structured extension for all Year 2 computing assignments. WAD301 Assignment 2 is extended to next Monday at 11:59 PM. Please review the updated guidelines on your student portal.',
    unread: false,
    likes: 19
  },
  {
    id: 'a4',
    title: 'Annual MCKL Sports Carnival 2026 Registration Open',
    category: 'Events',
    date: 'Jun 28, 2026',
    description: 'Registration is now officially open for the Annual MCKL Sports Carnival. Competitive events include Futsal, 3v3 Basketball, Track & Field, and a newly-introduced Valorant E-Sports Arena. All participants will receive an exclusive premium dry-fit jersey. Sign up on the campus portal!',
    unread: false,
    likes: 42
  }
];

// Notification mock data with clear distinct urgency tags
const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: 'n1',
    title: 'WAD301 Assignment 2 Submission Deadline Tonight',
    category: 'Assignments',
    date: 'Today, 08:30 AM',
    urgency: 'URGENT',
    description: 'This is your final warning regarding the WAD301 assignment submission. Your GitHub repository link and project documentation must be uploaded before 11:59 PM. Standard late penalties apply (10% reduction per 24-hour delay). Ensure your live preview is working.',
    unread: true
  },
  {
    id: 'n2',
    title: 'MAT304 Mid-Term Diagnostic Quiz Relocation',
    category: 'Class Notices',
    date: 'Yesterday, 04:15 PM',
    urgency: 'IMPORTANT',
    description: 'Ms. Wong Shuh Jen has scheduled a mandatory diagnostic quiz covering Propositional Logic and Set Theory this Thursday during class hours. The quiz is moved from Seminar Room 5 to Lecture Hall 3 (Block B) to accommodate physical distancing. Please bring a compatible laptop or tablet.',
    unread: true
  },
  {
    id: 'n3',
    title: 'Semester 4 Early-Bird Tuition Rebate Offer',
    category: 'Fees',
    date: 'Jul 04, 2026',
    urgency: 'NEW',
    description: 'Secure your study plans for Semester 4! Remit your core tuition fees before July 20th, 2026, to automatically receive a flat RM500 early-bird rebate on your tuition account. Installment plans are also eligible for the pro-rated rebate scheme.',
    unread: true
  },
  {
    id: 'n4',
    title: 'DBS302 Lecture Hall 2 Aircon Repairs',
    category: 'Class Notices',
    date: 'Jul 01, 2026',
    urgency: 'NEW',
    description: 'The air conditioning unit in Lecture Hall 2 is currently being repaired. For the lecture session on Monday (Jul 06), DBS302 will temporarily relocate to Lecture Hall 5 (Block A). We apologize for any inconvenience caused.',
    unread: false
  },
  {
    id: 'n5',
    title: 'MCKL Library Book Return Notification',
    category: 'Class Notices',
    date: 'Jun 25, 2026',
    urgency: 'IMPORTANT',
    description: 'The library system indicates that your borrowed textbook "Introduction to Algorithms (3rd Edition)" was due on June 24, 2026. Please return the physical book immediately or request a renewal online to prevent additional daily fines of RM0.50 accumulated.',
    unread: false
  }
];

// 20 realistic calendar attendance dates representing June & July 2026 for student course calendar grids
const ATTENDANCE_CALENDAR_DATA: Record<string, AttendanceDay[]> = {
  WAD301: [
    { date: 'Jun 02', status: 'present', topic: 'Course Introduction & Git Workflows' },
    { date: 'Jun 04', status: 'present', topic: 'DOM Manipulation & Modern ES6+' },
    { date: 'Jun 09', status: 'present', topic: 'React 19 Functional Components' },
    { date: 'Jun 11', status: 'present', topic: 'State Management and Hooks' },
    { date: 'Jun 16', status: 'present', topic: 'useEffect Lifecycle Operations' },
    { date: 'Jun 18', status: 'present', topic: 'Tailwind CSS Utility Philosophy' },
    { date: 'Jun 23', status: 'present', topic: 'Responsive Multi-Device Layouts' },
    { date: 'Jun 25', status: 'absent', topic: 'Routing with React Router' },
    { date: 'Jun 30', status: 'present', topic: 'Express Server & API Middlewares' },
    { date: 'Jul 02', status: 'present', topic: 'Vite Production Build Scaffolding' },
    { date: 'Jul 07', status: 'present', topic: 'Deployment on Cloud Container Engines' }
  ],
  DBS302: [
    { date: 'Jun 01', status: 'present', topic: 'DBMS Architecture & Schemas' },
    { date: 'Jun 04', status: 'absent', topic: 'Relational Algebra Fundamentals' },
    { date: 'Jun 08', status: 'present', topic: 'SQL CREATE & INSERT DDL Statements' },
    { date: 'Jun 11', status: 'present', topic: 'SQL JOIN Queries & Filters' },
    { date: 'Jun 15', status: 'present', topic: 'Subqueries & Group By Functions' },
    { date: 'Jun 18', status: 'absent', topic: 'Database Normalization Intro' },
    { date: 'Jun 22', status: 'present', topic: 'First & Second Normal Forms' },
    { date: 'Jun 25', status: 'present', topic: 'Third Normal Form (3NF) Exercises' },
    { date: 'Jun 29', status: 'absent', topic: 'Boyce-Codd Normal Form (BCNF)' },
    { date: 'Jul 02', status: 'present', topic: 'Indexes & Query Planner Analysis' },
    { date: 'Jul 06', status: 'present', topic: 'Transaction Isolation & ACID Model' }
  ],
  DSA303: [
    { date: 'Jun 01', status: 'present', topic: 'Complexity Classifications' },
    { date: 'Jun 03', status: 'present', topic: 'Arrays & Dynamic List Sizing' },
    { date: 'Jun 08', status: 'present', topic: 'Singly & Doubly Linked Lists' },
    { date: 'Jun 10', status: 'present', topic: 'Stack & Queue ADT Implementations' },
    { date: 'Jun 15', status: 'present', topic: 'Binary Trees & Recursion Logic' },
    { date: 'Jun 17', status: 'present', topic: 'Binary Search Tree Balancing' },
    { date: 'Jun 22', status: 'present', topic: 'AVL Tree Rotation Operations' },
    { date: 'Jun 24', status: 'present', topic: 'Min & Max Binary Heaps' },
    { date: 'Jun 29', status: 'present', topic: 'Graph Node Representation' },
    { date: 'Jul 01', status: 'present', topic: 'Breadth-First Search (BFS)' },
    { date: 'Jul 06', status: 'present', topic: 'Depth-First Search (DFS) Traversal' }
  ],
  MAT304: [
    { date: 'Jun 02', status: 'present', topic: 'Propositional Equivalences' },
    { date: 'Jun 04', status: 'absent', topic: 'Predicates & Quantifiers' },
    { date: 'Jun 09', status: 'present', topic: 'Rules of Logical Inferences' },
    { date: 'Jun 11', status: 'present', topic: 'Mathematical Induction Methods' },
    { date: 'Jun 16', status: 'absent', topic: 'Strong Induction & Well-Ordering' },
    { date: 'Jun 18', status: 'present', topic: 'Set Operations & Venn Diagrams' },
    { date: 'Jun 23', status: 'absent', topic: 'Function Injectivity & Surjectivity' },
    { date: 'Jun 25', status: 'present', topic: 'Mathematical Pigeonhole Principle' },
    { date: 'Jun 30', status: 'absent', topic: 'Permutations & Combinations' },
    { date: 'Jul 02', status: 'present', topic: 'Binomial Coefficients' },
    { date: 'Jul 07', status: 'present', topic: 'Discrete Probability Trees' }
  ]
};

// ==========================================
// MCKL LOGO RENDER COMPONENT
// ==========================================
const MCKLLogo = ({ size = 'large' }: { size?: 'small' | 'large' }) => {
  if (size === 'small') {
    // Small version of the official logo using high-fidelity vector shapes
    return (
      <div className="flex items-center justify-center shrink-0 select-none bg-white rounded-xl border border-navy-100/30 p-1 w-11 h-11 shadow-sm">
        <svg className="w-full h-full" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Blue left wing/leaf */}
          <path d="M 45 15 C 36 20, 25 32, 25 46 C 25 56, 32 67, 45 74 C 39 68, 31 58, 31 48 C 31 36, 39 24, 45 14 Z" fill="#1B3A6B" />
          
          {/* Gold flames */}
          <path d="M 46 74 C 41 70, 33 60, 33 44 C 33 28, 44 16, 46 14 C 44 19, 38 30, 38 44 C 38 58, 46 74, 46 74 Z" fill="#F2A93C" />
          <path d="M 46 74 C 52 70, 60 60, 60 44 C 60 28, 49 16, 46 14 C 48 19, 55 30, 55 44 C 55 58, 46 74, 46 74 Z" fill="#F2A93C" />
          <path d="M 46 74 C 49 72, 64 64, 64 41 C 64 25, 52 12, 49 10 C 51 15, 58 26, 58 41 C 58 55, 46 74, 46 74 Z" fill="#E5951E" />
        </svg>
      </div>
    );
  }

  // Full logo with official emblem & letter-spaced typography wordmark
  return (
    <div className="flex flex-col items-center text-center select-none space-y-4">
      <div className="w-48 h-48 flex items-center justify-center bg-white rounded-3xl p-4 shadow-[0_8px_32px_rgba(27,58,107,0.04)] border border-navy-100/20">
        <svg className="w-full h-full" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Blue left wing/leaf */}
          <path d="M 45 15 C 36 20, 25 32, 25 46 C 25 56, 32 67, 45 74 C 39 68, 31 58, 31 48 C 31 36, 39 24, 45 14 Z" fill="#1B3A6B" />
          
          {/* Gold flames */}
          <path d="M 46 74 C 41 70, 33 60, 33 44 C 33 28, 44 16, 46 14 C 44 19, 38 30, 38 44 C 38 58, 46 74, 46 74 Z" fill="#F2A93C" />
          <path d="M 46 74 C 52 70, 60 60, 60 44 C 60 28, 49 16, 46 14 C 48 19, 55 30, 55 44 C 55 58, 46 74, 46 74 Z" fill="#F2A93C" />
          <path d="M 46 74 C 49 72, 64 64, 64 41 C 64 25, 52 12, 49 10 C 51 15, 58 26, 58 41 C 58 55, 46 74, 46 74 Z" fill="#E5951E" />

          {/* Motto along curve */}
          <path id="mottoPathLarge" d="M 16 56 C 26 78, 66 78, 76 56" fill="none" />
          <text className="font-serif italic font-extrabold text-[4.2px] fill-[#1B3A6B]/80 uppercase tracking-widest">
            <textPath href="#mottoPathLarge" startOffset="50%" textAnchor="middle">
              Veritas Vincit Omnia
            </textPath>
          </text>
        </svg>
      </div>

      {/* Typography Wordmark below the SVG */}
      <div className="space-y-1">
        <div className="flex flex-col items-center">
          <h1 className="text-xl font-black tracking-[0.18em] text-[#1B3A6B] font-display leading-tight uppercase">
            Methodist
          </h1>
          <h2 className="text-xs font-black tracking-[0.22em] text-[#1B3A6B] font-display leading-none uppercase mt-0.5">
            College <span className="text-[#F2A93C]">|</span> Kuala Lumpur
          </h2>
        </div>
      </div>
    </div>
  );
};

export default function App() {
  // Navigation, Skeletons & Authentication
  const [activeTab, setActiveTab] = useState<string>('login');
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isSignUp, setIsSignUp] = useState<boolean>(false);
  const [loginEmail, setLoginEmail] = useState<string>('chloe.tan@student.mckl.edu.my');
  const [loginPassword, setLoginPassword] = useState<string>('veritas123');
  const [authLoading, setAuthLoading] = useState<boolean>(false);
  const [profileModalOpen, setProfileModalOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  // Time States
  const [currentTime, setCurrentTime] = useState<Date>(new Date('2026-07-08T10:15:00-07:00'));

  // Notification States & Active Custom Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  
  // Mutable lists in State for seamless interactive changes
  const [announcements, setAnnouncements] = useState<Announcement[]>(INITIAL_ANNOUNCEMENTS);
  const [notifications, setNotifications] = useState<Notification[]>(INITIAL_NOTIFICATIONS);
  const [courses, setCourses] = useState<Course[]>(INITIAL_COURSES);

  // Filter and Expandable States
  const [selectedScheduleDay, setSelectedScheduleDay] = useState<string>('Mon');
  const [courseSearchQuery, setCourseSearchQuery] = useState<string>('');
  const [selectedCourseFilters, setSelectedCourseFilters] = useState<string[]>([]);
  const [expandedCourses, setExpandedCourses] = useState<Record<string, boolean>>({ 'c1': true }); // Default Web Dev open

  // Announcements filters
  const [selectedAnnouncementCategory, setSelectedAnnouncementCategory] = useState<string>('All');
  const [viewingAnnouncement, setViewingAnnouncement] = useState<Announcement | null>(null);

  // Attendance screen filters & tabs
  const [selectedAttendanceSubjectFilter, setSelectedAttendanceSubjectFilter] = useState<string>('All');
  const [attendanceSearchQuery, setAttendanceSearchQuery] = useState<string>('');
  const [attendanceMonth, setAttendanceMonth] = useState<'June' | 'July'>('July');
  const [expandedAttendanceSubjects, setExpandedAttendanceSubjects] = useState<Record<string, boolean>>({ 'WAD301': true });

  // Notifications filters
  const [selectedNotificationFilter, setSelectedNotificationFilter] = useState<string>('All');
  const [viewingNotification, setViewingNotification] = useState<Notification | null>(null);

  // Module downloading states (simulate network download action)
  const [downloadingModules, setDownloadingModules] = useState<Record<string, 'downloading' | 'completed'>>({});

  // Announcements Swipeable / dot indicator index
  const [announcementCarouselIndex, setAnnouncementCarouselIndex] = useState<number>(0);

  // Updates time realistically inside the status bar
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(prev => new Date(prev.getTime() + 60000));
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  // Simple toast trigger
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // Full Logout and resets all states back to default values
  const handleLogout = () => {
    setIsLoggedIn(false);
    setActiveTab('login');
    setProfileModalOpen(false);
    setIsSignUp(false);
    setDownloadingModules({});
    setNotifications(INITIAL_NOTIFICATIONS);
    setAnnouncements(INITIAL_ANNOUNCEMENTS);
    setCourses(INITIAL_COURSES);
    setSelectedScheduleDay('Mon');
    setCourseSearchQuery('');
    setSelectedCourseFilters([]);
    setExpandedCourses({ 'c1': true });
    setSelectedAnnouncementCategory('All');
    setViewingAnnouncement(null);
    setSelectedAttendanceSubjectFilter('All');
    setAttendanceSearchQuery('');
    setAttendanceMonth('July');
    setExpandedAttendanceSubjects({ 'WAD301': true });
    setSelectedNotificationFilter('All');
    setViewingNotification(null);
    triggerToast('Logged out successfully. See you again!');
  };

  // Switch tabs with a realistic skeleton transition
  const handleTabChange = (tabId: string) => {
    if (tabId === activeTab) return;
    setLoading(true);
    setActiveTab(tabId);
    setTimeout(() => {
      setLoading(false);
    }, 400); // 400ms loading skeleton transition
  };

  // Attendance stats calculator
  const totalClasses = courses.reduce((acc, c) => acc + c.attendanceStats.total, 0);
  const totalPresent = courses.reduce((acc, c) => acc + c.attendanceStats.present, 0);
  const totalAbsent = courses.reduce((acc, c) => acc + c.attendanceStats.absent, 0);
  const overallAttendancePercent = Math.round((totalPresent / totalClasses) * 100);

  // Filter lists based on state
  const unreadNotificationsCount = notifications.filter(n => n.unread).length;
  const unreadAnnouncementsCount = announcements.filter(a => a.unread).length;

  // Mark all announcements read
  const handleMarkAllAnnouncementsRead = () => {
    setAnnouncements(prev => prev.map(a => ({ ...a, unread: false })));
    triggerToast('All announcements marked as read');
  };

  // Mark all notifications read
  const handleMarkAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
    triggerToast('All notifications marked as read');
  };

  // Simulate module download progress
  const startModuleDownload = (moduleId: string, moduleTitle: string) => {
    if (downloadingModules[moduleId] === 'completed') {
      triggerToast(`"${moduleTitle}" is already downloaded!`);
      return;
    }
    setDownloadingModules(prev => ({ ...prev, [moduleId]: 'downloading' }));
    
    setTimeout(() => {
      setDownloadingModules(prev => ({ ...prev, [moduleId]: 'completed' }));
      triggerToast(`Successfully downloaded: ${moduleTitle}`);
    }, 1500);
  };

  // Helper function to format greeting based on time of day
  const getGreeting = () => {
    const hours = currentTime.getHours();
    if (hours < 12) return 'Good Morning';
    if (hours < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center font-sans select-none antialiased md:py-6 overflow-x-hidden md:bg-radial md:from-slate-50 md:to-slate-200">
      
      {/* PHONE EMULATOR CONTAINER */}
      <div 
        id="phone-frame"
        className="w-full max-w-full h-screen md:max-w-[410px] md:h-[860px] md:rounded-[44px] md:border-[10px] md:border-slate-900 md:shadow-2xl flex flex-col overflow-hidden relative transition-all"
      >
        {/* Soft decorative background mesh/blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          {/* Base gradient mesh: Pale Gold to Pale Navy to pastel Blue/Peach */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#FCF7F1] via-[#F4F7FC] to-[#EFF4FA]" />
          
          {/* Large, soft, blurred decorative color blobs */}
          {/* Blob 1: Soft Gold/Peach in top-left */}
          <div className="absolute -top-16 -left-16 w-60 h-60 bg-[#F2A93C]/12 rounded-full blur-[60px]" />
          
          {/* Blob 2: Soft Navy/Blue on right */}
          <div className="absolute top-1/3 -right-20 w-64 h-64 bg-[#1B3A6B]/8 rounded-full blur-[70px]" />
          
          {/* Blob 3: Soft complementary Sky Blue on bottom-left */}
          <div className="absolute -bottom-16 -left-16 w-60 h-60 bg-sky-200/15 rounded-full blur-[50px]" />
        </div>
        
        {/* MOCK HARDWARE NOTCH & CAMERA (visible only on desktop frame mockup) */}
        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-32 h-5 bg-slate-900 rounded-full z-50 flex items-center justify-center hidden md:flex">
          <div className="w-3 h-3 bg-slate-800 rounded-full absolute left-4 border border-slate-700"></div>
          <div className="w-12 h-1 bg-slate-800 rounded-full"></div>
        </div>

        {/* STATUS BAR */}
        <div className="w-full h-11 px-6 bg-transparent flex items-end justify-between text-slate-800 font-medium text-[13px] pb-1.5 z-40 select-none border-b border-slate-200/20">
          <div className="flex items-center gap-1">
            <span>{currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}</span>
            <span className="text-[10px] font-extrabold text-navy-600 bg-navy-50/80 px-1.5 py-0.2 rounded-md ml-1.5">MCKL Wifi</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Signal className="w-3.5 h-3.5 text-navy-500" />
            <Wifi className="w-3.5 h-3.5 text-navy-500" />
            <div className="flex items-center gap-0.5">
              <span className="text-[11px] font-bold text-slate-700">92%</span>
              <Battery className="w-4 h-4 text-navy-600 rotate-0" />
            </div>
          </div>
        </div>

        {/* CUSTOM NOTIFICATION TOAST POPUP */}
        <AnimatePresence>
          {toastMessage && (
            <motion.div 
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              className="absolute top-[52px] left-4 right-4 bg-white text-navy-950 px-4 py-3 rounded-2xl shadow-xl z-[999] flex items-center gap-3 text-xs font-semibold border border-slate-200/80 pointer-events-auto"
            >
              <div className="w-5.5 h-5.5 bg-[#F2A93C] text-white rounded-full flex items-center justify-center shrink-0 shadow-sm">
                <Check className="w-3.5 h-3.5 stroke-[3]" />
              </div>
              <p className="flex-1 text-slate-800 font-bold leading-tight">{toastMessage}</p>
              <button 
                onClick={() => setToastMessage(null)} 
                className="text-slate-500 hover:text-slate-800 p-2 -mr-2 rounded-full hover:bg-slate-100 active:bg-slate-200 transition-colors cursor-pointer"
                aria-label="Close"
              >
                <X className="w-4 h-4 stroke-[2.5]" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* CORE APPLICATION BODY CONTENT */}
        <div className={`flex-1 overflow-y-auto ${isLoggedIn && activeTab !== 'login' ? 'pb-24' : 'pb-0'} relative`} id="screen-content-area">
          
          {/* LOGIN SCREEN (Screen 0) */}
          {!isLoggedIn || activeTab === 'login' ? (
            <div className="min-h-full flex flex-col justify-center relative p-6 bg-transparent">
              
              <div className="space-y-6 w-full max-w-sm mx-auto z-10">
                {/* Full MCKL logo */}
                <div className="flex flex-col items-center">
                  <MCKLLogo size="large" />
                </div>

                {/* Login Form Card */}
                <div className="bg-white p-5 rounded-3xl border border-navy-100/30 shadow-[0_8px_30px_rgba(27,58,107,0.03)] space-y-4">
                  <div>
                    <h3 className="text-sm font-bold text-navy-900 tracking-tight text-center">
                      {isSignUp ? 'Create Student Account' : 'Student Portal Sign-In'}
                    </h3>
                    <p className="text-[10px] text-slate-500 text-center mt-1 font-medium">
                      {isSignUp ? 'Sign up with your official MCKL student email' : 'Access your courses, schedule, and attendance'}
                    </p>
                  </div>

                  <div className="space-y-3">
                    {/* Name field (visible only on Sign-Up) */}
                    {isSignUp && (
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-navy-500 uppercase tracking-wider pl-1">Full Name</label>
                        <input 
                          type="text" 
                          placeholder="Chloe Tan"
                          className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200/50 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-navy-500 focus:bg-white transition-all duration-200"
                        />
                      </div>
                    )}

                    {/* Email field */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-navy-500 uppercase tracking-wider pl-1">Email Address</label>
                      <input 
                        type="email" 
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        placeholder="student@mckl.edu.my"
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200/50 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-navy-500 focus:bg-white transition-all duration-200"
                      />
                    </div>

                    {/* Password field */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-navy-500 uppercase tracking-wider pl-1">Password</label>
                      <input 
                        type="password" 
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200/50 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-navy-500 focus:bg-white transition-all duration-200"
                      />
                    </div>
                  </div>

                  {/* Continue Button */}
                  <button
                    onClick={() => {
                      setAuthLoading(true);
                      setTimeout(() => {
                        setAuthLoading(false);
                        setIsLoggedIn(true);
                        setActiveTab('dashboard');
                        triggerToast(isSignUp ? 'Account created successfully! Welcome to MCKL.' : 'Welcome back, Chloe Tan!');
                      }, 1000);
                    }}
                    disabled={authLoading}
                    className="w-full py-3 bg-gold-500 hover:bg-gold-600 text-navy-950 font-extrabold text-xs rounded-xl active:scale-98 transition-all duration-200 flex items-center justify-center gap-1.5 shadow-[0_4px_12px_rgba(242,169,60,0.15)] cursor-pointer"
                  >
                    {authLoading ? (
                      <span className="w-4 h-4 border-2 border-navy-950 border-t-transparent rounded-full animate-spin"></span>
                    ) : (
                      <>
                        <span>Continue</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>

                {/* Footer Switch */}
                <div className="text-center">
                  <button 
                    onClick={() => setIsSignUp(!isSignUp)}
                    className="text-xs font-bold text-navy-500 hover:text-navy-600 underline underline-offset-4 cursor-pointer"
                  >
                    {isSignUp ? 'Already have an account? Sign In' : "No account? Create one"}
                  </button>
                </div>
              </div>
            </div>
          ) : loading ? (
            <div className="p-6 space-y-6 animate-pulse">
              {/* Header Shimmer */}
              <div className="flex justify-between items-center">
                <div className="space-y-2">
                  <div className="h-4 w-28 bg-slate-200 rounded-md"></div>
                  <div className="h-6 w-48 bg-slate-200 rounded-md"></div>
                </div>
                <div className="w-10 h-10 bg-slate-200 rounded-full"></div>
              </div>

              {activeTab === 'dashboard' && (
                <>
                  <div className="h-36 bg-slate-200 rounded-2xl w-full"></div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="h-24 bg-slate-200 rounded-2xl"></div>
                    <div className="h-24 bg-slate-200 rounded-2xl"></div>
                  </div>
                  <div className="h-44 bg-slate-200 rounded-2xl w-full"></div>
                </>
              )}

              {activeTab === 'academic' && (
                <>
                  <div className="h-10 bg-slate-200 rounded-xl w-full"></div>
                  <div className="flex gap-2">
                    <div className="h-8 w-20 bg-slate-200 rounded-full"></div>
                    <div className="h-8 w-20 bg-slate-200 rounded-full"></div>
                    <div className="h-8 w-20 bg-slate-200 rounded-full"></div>
                  </div>
                  <div className="space-y-4">
                    <div className="h-32 bg-slate-200 rounded-2xl w-full"></div>
                    <div className="h-32 bg-slate-200 rounded-2xl w-full"></div>
                  </div>
                </>
              )}

              {activeTab === 'schedule' && (
                <>
                  <div className="flex justify-between gap-1">
                    {[1, 2, 3, 4, 5].map(i => (
                      <div key={i} className="h-12 w-12 bg-slate-200 rounded-xl"></div>
                    ))}
                  </div>
                  <div className="space-y-4">
                    <div className="h-24 bg-slate-200 rounded-2xl"></div>
                    <div className="h-24 bg-slate-200 rounded-2xl"></div>
                  </div>
                </>
              )}

              {activeTab === 'announcements' && (
                <>
                  <div className="flex gap-2">
                    <div className="h-8 w-16 bg-slate-200 rounded-full"></div>
                    <div className="h-8 w-24 bg-slate-200 rounded-full"></div>
                    <div className="h-8 w-24 bg-slate-200 rounded-full"></div>
                  </div>
                  <div className="space-y-4">
                    <div className="h-28 bg-slate-200 rounded-2xl w-full"></div>
                    <div className="h-28 bg-slate-200 rounded-2xl w-full"></div>
                  </div>
                </>
              )}

              {activeTab === 'attendance' && (
                <>
                  <div className="h-28 bg-slate-200 rounded-2xl w-full"></div>
                  <div className="h-10 bg-slate-200 rounded-xl w-full"></div>
                  <div className="space-y-3">
                    <div className="h-14 bg-slate-200 rounded-xl w-full"></div>
                    <div className="h-14 bg-slate-200 rounded-xl w-full"></div>
                  </div>
                </>
              )}

              {activeTab === 'notifications' && (
                <>
                  <div className="flex gap-2">
                    <div className="h-8 w-16 bg-slate-200 rounded-full"></div>
                    <div className="h-8 w-24 bg-slate-200 rounded-full"></div>
                  </div>
                  <div className="space-y-3">
                    <div className="h-24 bg-slate-200 rounded-2xl w-full"></div>
                    <div className="h-24 bg-slate-200 rounded-2xl w-full"></div>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="px-5 pt-5 pb-8 space-y-6">
              
              {/* ========================================================= */}
              {/* SCREEN 1: DASHBOARD                                       */}
              {/* ========================================================= */}
              {activeTab === 'dashboard' && (
                <div className="space-y-6">
                  
                  {/* GREETING HEADER */}
                  <div className="flex justify-between items-center bg-white p-4.5 rounded-2xl border border-navy-100/20 shadow-[0_4px_24px_rgba(27,58,107,0.015)]">
                    <div className="flex items-center gap-3">
                      {/* Small MCKL flame icon mark */}
                      <MCKLLogo size="small" />
                      <div>
                        <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">{getGreeting()}</p>
                        <h2 className="text-lg font-bold font-display text-navy-900 tracking-tight flex items-center gap-1.5 leading-tight">
                          Chloe Tan <span className="animate-bounce text-base">👋</span>
                        </h2>
                        <p className="text-[10px] text-slate-500 font-bold mt-0.5">Diploma in IT • Semester 3</p>
                      </div>
                    </div>
                    <div className="relative">
                      <button 
                        onClick={() => setProfileModalOpen(!profileModalOpen)}
                        className="relative focus:outline-none hover:scale-105 active:scale-95 transition-all cursor-pointer z-50"
                        aria-label="User Menu"
                      >
                        <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-[#1B3A6B] to-[#2C5E9E] flex items-center justify-center text-white font-bold text-sm shadow-md shadow-navy-100 border-2 border-white">
                          CT
                        </div>
                        <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"></span>
                      </button>

                      {/* Profile Dropdown Menu */}
                      <AnimatePresence>
                        {profileModalOpen && (
                          <>
                            {/* Invisible click backdrop to dismiss dropdown */}
                            <div 
                              className="fixed inset-0 z-40 bg-transparent" 
                              onClick={() => setProfileModalOpen(false)}
                            />
                            <motion.div 
                              initial={{ opacity: 0, y: 10, scale: 0.95 }}
                              animate={{ opacity: 1, y: 0, scale: 1 }}
                              exit={{ opacity: 0, y: 10, scale: 0.95 }}
                              className="absolute right-0 mt-2 w-48 bg-white border border-slate-150/80 rounded-2xl shadow-xl z-50 p-2 space-y-1"
                            >
                              <div className="px-3 py-2 border-b border-slate-100">
                                <p className="text-xs font-bold text-navy-950">Chloe Tan</p>
                                <p className="text-[9px] text-slate-400 font-semibold">chloe.tan@student.mckl.edu.my</p>
                              </div>
                              
                              <button 
                                onClick={handleLogout}
                                className="w-full text-left px-3 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-xl transition-all flex items-center gap-2 cursor-pointer"
                              >
                                <LogOut className="w-3.5 h-3.5 stroke-[2.5]" />
                                <span>Log Out</span>
                              </button>
                            </motion.div>
                          </>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                  {/* ANNOUNCEMENTS CAROUSEL */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-center px-1">
                      <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Featured Campus Updates</h3>
                      <button 
                        onClick={() => handleTabChange('announcements')}
                        className="text-xs font-bold text-navy-500 hover:text-navy-600 flex items-center gap-1 cursor-pointer"
                      >
                        <span>See All</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="relative overflow-hidden bg-white rounded-2xl p-5 border border-slate-100/80 shadow-[0_4px_24px_rgba(0,0,0,0.025)] flex flex-col justify-between h-[165px] hover:shadow-[0_8px_32px_rgba(0,0,0,0.05)] transition-all duration-300">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-gold-50/40 rounded-full blur-xl pointer-events-none"></div>
                      
                      {/* Carousel item */}
                      <div className="space-y-2.5 relative z-10">
                        <div className="flex justify-between items-center">
                          <span className={`px-2 py-0.5 rounded-md text-[9px] font-bold tracking-wider uppercase border ${
                            announcements[announcementCarouselIndex].category === 'Events' ? 'bg-purple-50 text-purple-600 border-purple-100/50' :
                            announcements[announcementCarouselIndex].category === 'Academic' ? 'bg-navy-50 text-navy-600 border-navy-100/50' :
                            'bg-teal-50 text-teal-600 border-teal-100/50'
                          }`}>
                            {announcements[announcementCarouselIndex].category}
                          </span>
                          <span className="text-[10px] text-slate-400 font-semibold">{announcements[announcementCarouselIndex].date}</span>
                        </div>
                        <h4 className="font-bold text-navy-900 text-sm line-clamp-1 leading-snug">
                          {announcements[announcementCarouselIndex].title}
                        </h4>
                        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed font-medium">
                          {announcements[announcementCarouselIndex].description}
                        </p>
                      </div>

                      {/* Carousel bottom triggers & dots */}
                      <div className="flex justify-between items-center mt-3 z-10 pt-2.5 border-t border-slate-100/60">
                        <div className="flex gap-1.5">
                          {announcements.map((_, idx) => (
                            <button
                              key={idx}
                              onClick={() => setAnnouncementCarouselIndex(idx)}
                              className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                                announcementCarouselIndex === idx ? 'w-4 bg-navy-500' : 'w-1.5 bg-slate-200 hover:bg-slate-300'
                              }`}
                            />
                          ))}
                        </div>
                        <button 
                          onClick={() => {
                            setViewingAnnouncement(announcements[announcementCarouselIndex]);
                            // Mark read
                            setAnnouncements(prev => prev.map((a, idx) => idx === announcementCarouselIndex ? { ...a, unread: false } : a));
                          }}
                          className="text-[10px] font-bold text-navy-600 hover:text-navy-800 px-2.5 py-1.5 bg-navy-50/60 rounded-xl flex items-center gap-1 transition-all cursor-pointer"
                        >
                          Read Details
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* QUICK STATS ROW */}
                  <div className="grid grid-cols-2 gap-4">
                    {/* Stat 1: Classes Today */}
                    <div 
                      onClick={() => handleTabChange('schedule')}
                      className="bg-white p-4 rounded-2xl border border-slate-100/80 shadow-[0_4px_24px_rgba(0,0,0,0.025)] flex items-center gap-3 hover:border-navy-100 hover:shadow-[0_8px_32px_rgba(27,58,107,0.04)] cursor-pointer transition-all duration-300"
                    >
                      <div className="w-9 h-9 rounded-xl bg-navy-50 flex items-center justify-center text-navy-600 shrink-0">
                        <Clock className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Classes Today</p>
                        <h4 className="text-xs font-bold text-slate-800 mt-0.5">2 Lectures</h4>
                      </div>
                    </div>

                    {/* Stat 2: Unread Alerts */}
                    <div 
                      onClick={() => handleTabChange('notifications')}
                      className="bg-white p-4 rounded-2xl border border-slate-100/80 shadow-[0_4px_24px_rgba(0,0,0,0.025)] flex items-center gap-3 hover:border-navy-100 hover:shadow-[0_8px_32px_rgba(27,58,107,0.04)] cursor-pointer transition-all duration-300 relative"
                    >
                      <div className="w-9 h-9 rounded-xl bg-rose-50 flex items-center justify-center text-rose-500 shrink-0">
                        <Bell className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Alerts Unread</p>
                        <h4 className="text-xs font-bold text-slate-800 mt-0.5">{unreadNotificationsCount} Urgent</h4>
                      </div>
                      {unreadNotificationsCount > 0 && (
                        <span className="absolute top-4 right-4 w-2 h-2 bg-rose-500 rounded-full animate-ping"></span>
                      )}
                    </div>
                  </div>

                  {/* ATTENDANCE SUMMARY CARD (with circular SVG ring) */}
                  <div 
                    onClick={() => handleTabChange('attendance')}
                    className="bg-white p-5 rounded-2xl border border-navy-100/20 shadow-[0_4px_24px_rgba(27,58,107,0.015)] cursor-pointer hover:shadow-[0_8px_32px_rgba(27,58,107,0.04)] hover:border-navy-100/80 transition-all duration-300"
                  >
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Attendance Summary</h3>
                      <span className="text-[10px] font-bold text-navy-600 bg-navy-50 px-2.5 py-1 rounded-lg">View Breakdown</span>
                    </div>

                    <div className="flex items-center gap-5">
                      {/* SVG Circle Progress bar */}
                      <div className="relative shrink-0 w-20 h-20 flex items-center justify-center">
                        <svg className="w-20 h-20 transform -rotate-90">
                          <circle
                            cx="40"
                            cy="40"
                            r="32"
                            stroke="#F1F5F9"
                            strokeWidth="6"
                            fill="transparent"
                          />
                          <motion.circle
                            cx="40"
                            cy="40"
                            r="32"
                            stroke="#1B3A6B"
                            strokeWidth="6"
                            fill="transparent"
                            strokeDasharray={201}
                            initial={{ strokeDashoffset: 201 }}
                            animate={{ strokeDashoffset: 201 - (overallAttendancePercent / 100) * 201 }}
                            transition={{ duration: 1.2, ease: 'easeOut' }}
                            strokeLinecap="round"
                          />
                        </svg>
                        <div className="absolute flex flex-col items-center">
                          <span className="text-base font-bold font-display text-navy-950">{overallAttendancePercent}%</span>
                          <span className="text-[8px] uppercase tracking-wider font-bold text-slate-400">Total</span>
                        </div>
                      </div>

                      {/* Stats Details */}
                      <div className="flex-1 space-y-1.5">
                        <h4 className="font-bold text-navy-900 text-sm">Attendance is Excellent!</h4>
                        <p className="text-xs text-slate-500 leading-normal font-medium">
                          You have attended <strong className="text-slate-700">{totalPresent}</strong> classes out of <strong className="text-slate-700">{totalClasses}</strong> slots.
                        </p>
                        <div className="flex items-center gap-3 pt-1">
                          <div className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                            <span className="text-[10px] font-semibold text-slate-500">{totalPresent} Present</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                            <span className="text-[10px] font-semibold text-slate-500">{totalAbsent} Absent</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* ENROLLED COURSES & INDIVIDUAL MINI PROGRESS BARS */}
                  <div className="space-y-3">
                    <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-1">Enrolled Courses</h3>
                    
                    <div className="space-y-3">
                      {courses.map(course => (
                        <div
                          key={course.id}
                          onClick={() => {
                            // Automatically switch to Academic, expand this course, and notify
                            setSelectedCourseFilters([course.code]);
                            setExpandedCourses({ [course.id]: true });
                            handleTabChange('academic');
                            triggerToast(`Filtered Academic resources for: ${course.code}`);
                          }}
                          className="bg-white p-4 rounded-2xl border border-navy-100/20 shadow-[0_4px_24px_rgba(27,58,107,0.015)] flex flex-col gap-3 hover:border-navy-100 hover:shadow-[0_8px_32px_rgba(27,58,107,0.04)] cursor-pointer transition-all duration-300"
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <span className="text-[10px] font-bold text-navy-500 tracking-wider font-mono">{course.code}</span>
                              <h4 className="font-bold text-navy-950 text-sm leading-snug line-clamp-1 mt-0.5">{course.name}</h4>
                              <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Lecturer: {course.lecturer.name}</p>
                            </div>
                            <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold font-mono border ${
                              course.performance === 'good' ? 'bg-emerald-50 text-emerald-600 border-emerald-100/40' :
                              course.performance === 'warning' ? 'bg-amber-50 text-amber-600 border-amber-100/40' :
                              'bg-rose-50 text-rose-600 border-rose-100/40'
                            }`}>
                              Grade {course.grade}
                            </span>
                          </div>

                          {/* Horizontal mini progress bar, subtly color-coded by performance */}
                          <div className="space-y-1 pt-1 border-t border-slate-100/60">
                            <div className="flex justify-between items-center text-[10px] text-slate-500 font-medium">
                              <span>Module Syllabus Progress</span>
                              <span className="font-bold">{course.progress}%</span>
                            </div>
                            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${course.progress}%` }}
                                transition={{ duration: 1, ease: 'easeOut' }}
                                className={`h-full rounded-full ${
                                  course.performance === 'good' ? 'bg-navy-500' :
                                  course.performance === 'warning' ? 'bg-gold-500' :
                                  'bg-rose-500'
                                }`}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              )}

              {/* ========================================================= */}
              {/* SCREEN 2: SCHEDULE                                        */}
              {/* ========================================================= */}
              {activeTab === 'schedule' && (
                <div className="space-y-6">
                  
                  {/* HEADER */}
                  <div>
                    <h2 className="text-xl font-bold font-display text-navy-950 tracking-tight">Class Schedule</h2>
                    <p className="text-xs text-slate-500 font-medium">View and track your weekly lectures, lab sessions, and tutorials.</p>
                  </div>

                  {/* WEEK DAY SELECTOR TABS */}
                  <div className="flex items-center justify-between bg-white p-1 rounded-2xl border border-slate-100/80 shadow-[0_4px_20px_rgba(0,0,0,0.015)]">
                    {Object.keys(SCHEDULE_DATA).map(day => {
                      const isActive = selectedScheduleDay === day;
                      const hasClasses = SCHEDULE_DATA[day].length > 0;
                      return (
                        <button
                          key={day}
                          onClick={() => setSelectedScheduleDay(day)}
                          className={`flex-1 py-3 px-1 rounded-xl flex flex-col items-center justify-center transition-all duration-300 cursor-pointer ${
                            isActive 
                              ? 'bg-navy-500 text-white shadow-md shadow-navy-100 scale-105 font-bold' 
                              : 'text-slate-600 hover:bg-slate-50 font-medium'
                          }`}
                        >
                          <span className="text-[11px] uppercase tracking-wider">{day}</span>
                          <span className={`w-1.5 h-1.5 rounded-full mt-1 ${
                            isActive 
                              ? 'bg-white' 
                              : hasClasses ? 'bg-gold-500' : 'bg-transparent'
                          }`} />
                        </button>
                      );
                    })}
                  </div>

                  {/* SCHEDULE CONTENT */}
                  <div className="space-y-3.5">
                    <div className="flex justify-between items-center px-1">
                      <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        {selectedScheduleDay === 'Mon' && 'Monday Classes'}
                        {selectedScheduleDay === 'Tue' && 'Tuesday Classes'}
                        {selectedScheduleDay === 'Wed' && 'Wednesday Classes'}
                        {selectedScheduleDay === 'Thu' && 'Thursday Classes'}
                        {selectedScheduleDay === 'Fri' && 'Friday Classes'}
                      </h3>
                      <span className="text-[11px] font-semibold text-slate-400">
                        {SCHEDULE_DATA[selectedScheduleDay].length} Session(s)
                      </span>
                    </div>

                    {SCHEDULE_DATA[selectedScheduleDay].length === 0 ? (
                      /* POLISHED EMPTY STATE FOR FRIDAY */
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-3xl p-8 border border-slate-100/80 shadow-[0_4px_24px_rgba(0,0,0,0.025)] flex flex-col items-center justify-center text-center space-y-4"
                      >
                        <div className="w-16 h-16 rounded-full bg-navy-50 flex items-center justify-center text-navy-600 animate-pulse">
                          <Sparkles className="w-8 h-8 text-gold-500" />
                        </div>
                        <div className="space-y-1.5 max-w-[240px]">
                          <h4 className="font-bold text-navy-950 text-sm">No Scheduled Classes!</h4>
                          <p className="text-xs text-slate-500 leading-relaxed font-medium">
                            Friday is scheduled for independent research, project assignments, or campus library collaboration. Enjoy your self-study!
                          </p>
                        </div>
                        <button
                          onClick={() => {
                            setSelectedCourseFilters([]);
                            handleTabChange('academic');
                            triggerToast('Browsing self-study module materials.');
                          }}
                          className="px-4 py-2.5 bg-navy-50 hover:bg-navy-100/80 text-navy-600 font-bold text-xs rounded-xl transition-all duration-200 cursor-pointer"
                        >
                          Access Learning Materials
                        </button>
                      </motion.div>
                    ) : (
                      /* LIST OF CLASS TIMELINE CARDS */
                      <div className="space-y-3 relative before:absolute before:top-2 before:bottom-2 before:left-[18px] before:w-0.5 before:bg-slate-100">
                        {SCHEDULE_DATA[selectedScheduleDay].map((session, index) => (
                          <motion.div
                            key={session.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white pl-8 pr-4.5 py-4.5 rounded-2xl border border-slate-100/80 shadow-[0_4px_24px_rgba(0,0,0,0.025)] relative hover:shadow-[0_8px_32px_rgba(27,58,107,0.04)] hover:border-navy-100/50 transition-all duration-300"
                          >
                            {/* Circular bullet anchor on timeline path */}
                            <div className="absolute left-[13px] top-[26px] w-3 h-3 rounded-full bg-navy-500 border-2 border-white shadow-sm"></div>

                            {/* Session layout */}
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <span className="text-[10px] font-bold text-navy-500 tracking-wider font-mono bg-navy-50 px-1.5 py-0.5 rounded-md">
                                  {session.courseCode}
                                </span>
                                <h4 className="font-bold text-navy-950 text-sm mt-1.5 leading-snug line-clamp-1">{session.courseName}</h4>
                              </div>
                              <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border ${
                                session.type === 'Lab' ? 'bg-purple-50 text-purple-600 border-purple-100/50' :
                                session.type === 'Lecture' ? 'bg-blue-50 text-blue-600 border-blue-100/50' :
                                'bg-teal-50 text-teal-600 border-teal-100/50'
                              }`}>
                                {session.type}
                              </span>
                            </div>

                            <div className="grid grid-cols-2 gap-y-1.5 gap-x-2 pt-2 border-t border-slate-100/60 text-xs text-slate-500 font-medium">
                              <div className="flex items-center gap-1.5">
                                <Clock className="w-3.5 h-3.5 text-slate-400" />
                                <span>{session.timeStart} - {session.timeEnd}</span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                                <span className="truncate">{session.room}</span>
                              </div>
                              <div className="flex items-center gap-1.5 col-span-2">
                                <User className="w-3.5 h-3.5 text-slate-400" />
                                <span>Lecturer: {session.lecturerName}</span>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </div>

                </div>
              )}

              {/* ========================================================= */}
              {/* SCREEN 3: ACADEMIC INFO (Courses)                          */}
              {/* ========================================================= */}
              {activeTab === 'academic' && (
                <div className="space-y-5">
                  
                  {/* HEADER */}
                  <div>
                    <h2 className="text-xl font-bold font-display text-navy-950 tracking-tight">Academic Info</h2>
                    <p className="text-xs text-slate-500 font-medium">Browse subject structures, download lecture slides, and contact lecturers.</p>
                  </div>

                  {/* SEARCH BAR */}
                  <div className="relative">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search courses or materials..."
                      value={courseSearchQuery}
                      onChange={(e) => setCourseSearchQuery(e.target.value)}
                      className="w-full bg-white pl-10 pr-4 py-3 rounded-xl border border-slate-100/80 text-xs text-slate-700 placeholder-slate-400 focus:outline-none focus:border-navy-400/80 shadow-[0_2px_8px_rgba(0,0,0,0.015)] focus:shadow-[0_4px_16px_rgba(27,58,107,0.04)] transition-all duration-300"
                    />
                    {courseSearchQuery && (
                      <button 
                        onClick={() => setCourseSearchQuery('')}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 transition-colors"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  {/* MULTI-SELECT CHIP COURSE FILTERS */}
                  <div className="space-y-2">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-1">Filter by Course</p>
                    <div className="flex flex-wrap gap-2">
                      {courses.map(course => {
                        const isSelected = selectedCourseFilters.includes(course.code);
                        return (
                          <button
                            key={course.id}
                            onClick={() => {
                              if (isSelected) {
                                setSelectedCourseFilters(prev => prev.filter(c => c !== course.code));
                              } else {
                                setSelectedCourseFilters(prev => [...prev, course.code]);
                              }
                            }}
                            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer ${
                              isSelected 
                                ? 'bg-navy-500 text-white shadow-sm shadow-navy-100 scale-105' 
                                : 'bg-white text-slate-600 border border-slate-100 hover:bg-slate-50'
                            }`}
                          >
                            {course.code}
                          </button>
                        );
                      })}
                      {selectedCourseFilters.length > 0 && (
                        <button
                          onClick={() => setSelectedCourseFilters([])}
                          className="px-2.5 py-1.5 rounded-full text-xs font-bold text-rose-500 bg-rose-50 hover:bg-rose-100 transition-colors cursor-pointer"
                        >
                          Clear
                        </button>
                      )}
                    </div>
                  </div>

                  {/* COURSE CARDS WITH ACCORDION SLIDES */}
                  <div className="space-y-3.5 pt-1">
                    {courses
                      .filter(course => {
                        // filter by selected subject code chips
                        if (selectedCourseFilters.length > 0 && !selectedCourseFilters.includes(course.code)) return false;
                        // filter by search query
                        if (courseSearchQuery) {
                          const query = courseSearchQuery.toLowerCase();
                          const matchesName = course.name.toLowerCase().includes(query);
                          const matchesCode = course.code.toLowerCase().includes(query);
                          const matchesModule = course.modules.some(m => m.title.toLowerCase().includes(query));
                          return matchesName || matchesCode || matchesModule;
                        }
                        return true;
                      })
                      .map(course => {
                        const isExpanded = !!expandedCourses[course.id];
                        return (
                          <div 
                            key={course.id}
                            className="bg-white rounded-2xl border border-navy-50/10 shadow-[0_4px_24px_rgba(27,58,107,0.015)] overflow-hidden hover:border-navy-200/40 transition-all duration-300"
                          >
                            {/* Accordion Trigger Header */}
                            <div 
                              onClick={() => setExpandedCourses(prev => ({ ...prev, [course.id]: !isExpanded }))}
                              className="p-4 flex justify-between items-center cursor-pointer hover:bg-slate-50/40 transition-colors"
                            >
                              <div className="flex-1 pr-4">
                                <div className="flex items-center gap-2">
                                  <span className="text-[10px] font-bold text-navy-500 tracking-wider font-mono bg-navy-50 px-1.5 py-0.5 rounded-md">
                                    {course.code}
                                  </span>
                                  <span className={`px-1.5 py-0.5 text-[9px] font-bold rounded-md uppercase border ${
                                    course.performance === 'good' ? 'bg-emerald-50 text-emerald-600 border-emerald-100/40' :
                                    course.performance === 'warning' ? 'bg-amber-50 text-amber-600 border-amber-100/40' :
                                    'bg-rose-50 text-rose-600 border-rose-100/40'
                                  }`}>
                                    Sem Grade: {course.grade}
                                  </span>
                                </div>
                                <h3 className="font-bold text-navy-900 text-sm mt-1.5 leading-snug line-clamp-1">{course.name}</h3>
                              </div>
                              <ChevronLeft className={`w-5 h-5 text-slate-400 shrink-0 transition-transform duration-300 ${
                                isExpanded ? '-rotate-90 text-navy-500 font-bold' : ''
                              }`} />
                            </div>

                            {/* Accordion Content Panel */}
                            {isExpanded && (
                              <div className="border-t border-slate-100/50 bg-slate-50/40 p-4 space-y-4">
                                {/* Lecturer Contacts */}
                                <div className="bg-white p-4 rounded-xl border border-slate-100/80 shadow-[0_2px_8px_rgba(0,0,0,0.01)] flex items-center justify-between">
                                  <div className="text-xs">
                                    <p className="text-slate-400 font-bold uppercase text-[9px] tracking-wider">Lecturer Coordinator</p>
                                    <h4 className="font-bold text-navy-950 mt-1">{course.lecturer.name}</h4>
                                    <p className="text-slate-500 text-[11px] font-medium mt-0.5">{course.lecturer.email}</p>
                                    <p className="text-slate-500 text-[11px] font-medium">Room: {course.lecturer.office}</p>
                                  </div>
                                  <a 
                                    href={`mailto:${course.lecturer.email}`}
                                    className="p-2.5 bg-navy-50 hover:bg-navy-100/80 text-navy-600 rounded-xl transition-colors duration-200"
                                  >
                                    <Inbox className="w-4 h-4" />
                                  </a>
                                </div>

                                {/* Materials Module list */}
                                <div className="space-y-2">
                                  <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase tracking-wider px-0.5">
                                    <span>Learning Materials</span>
                                    <span>{course.modules.length} Files</span>
                                  </div>

                                  <div className="space-y-2">
                                    {course.modules
                                      .filter(m => !courseSearchQuery || m.title.toLowerCase().includes(courseSearchQuery.toLowerCase()))
                                      .map(m => {
                                        const downloadState = downloadingModules[m.id];
                                        return (
                                          <div 
                                            key={m.id}
                                            className="bg-white p-3 rounded-xl border border-slate-100 flex items-center justify-between text-xs hover:border-navy-100 hover:shadow-[0_4px_12px_rgba(27,58,107,0.02)] transition-all duration-300"
                                          >
                                            <div className="flex items-center gap-3 min-w-0 pr-2">
                                              <div className={`w-8.5 h-8.5 rounded-lg flex items-center justify-center shrink-0 ${
                                                m.type === 'pdf' ? 'bg-rose-50 text-rose-500' :
                                                m.type === 'zip' ? 'bg-amber-50 text-amber-500' :
                                                'bg-navy-50 text-navy-500'
                                              }`}>
                                                {m.type === 'pdf' && <FileText className="w-4 h-4" />}
                                                {m.type === 'zip' && <FileArchive className="w-4 h-4" />}
                                                {m.type === 'code' && <FileCode className="w-4 h-4" />}
                                              </div>
                                              <div className="min-w-0">
                                                <p className="font-bold text-navy-950 truncate leading-snug">{m.title}</p>
                                                <p className="text-[10px] text-slate-400 font-medium mt-0.5">{m.size} • Released {m.releasedDate}</p>
                                              </div>
                                            </div>

                                            <button
                                              onClick={() => startModuleDownload(m.id, m.title)}
                                              disabled={downloadState === 'downloading'}
                                              className={`p-2 rounded-lg text-xs font-bold shrink-0 transition-all duration-200 cursor-pointer ${
                                                downloadState === 'completed'
                                                  ? 'bg-emerald-50 text-emerald-600'
                                                  : downloadState === 'downloading'
                                                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                                                  : 'bg-navy-50 text-navy-600 hover:bg-navy-100'
                                              }`}
                                            >
                                              {downloadState === 'completed' ? (
                                                <Check className="w-4 h-4 font-bold" />
                                              ) : downloadState === 'downloading' ? (
                                                <div className="w-4 h-4 border-2 border-navy-500 border-t-transparent rounded-full animate-spin"></div>
                                              ) : (
                                                <Download className="w-4 h-4" />
                                              )}
                                            </button>
                                          </div>
                                        );
                                      })}
                                  </div>
                                </div>

                              </div>
                            )}
                          </div>
                        );
                      })}
                  </div>

                </div>
              )}

              {/* ========================================================= */}
              {/* SCREEN 4: ANNOUNCEMENTS                                   */}
              {/* ========================================================= */}
              {activeTab === 'announcements' && (
                <div className="space-y-5">
                  
                  {/* HEADER */}
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-xl font-bold font-display text-navy-950 tracking-tight">Campus Announcements</h2>
                      <p className="text-xs text-slate-500 font-medium">Official notifications from MCKL management and student council.</p>
                    </div>
                  </div>

                  {/* UNREAD PILL & MARK ALL READ BUTTON */}
                  <div className="bg-navy-50/60 p-4 rounded-2xl border border-navy-100/30 flex items-center justify-between text-xs font-semibold text-navy-900 shadow-[0_4px_16px_rgba(27,58,107,0.03)]">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-navy-600 animate-pulse"></span>
                      <span>You have <strong>{unreadAnnouncementsCount}</strong> unread updates</span>
                    </div>
                    {unreadAnnouncementsCount > 0 && (
                      <button
                        onClick={handleMarkAllAnnouncementsRead}
                        className="px-3 py-1.5 bg-white text-navy-600 font-bold rounded-xl border border-navy-100/50 hover:bg-navy-50 transition-colors duration-200 shadow-sm cursor-pointer"
                      >
                        Mark All Read
                      </button>
                    )}
                  </div>

                  {/* FILTER CHIPS (Academic, Events, Facilities) */}
                  <div className="flex gap-1.5 overflow-x-auto pb-1">
                    {['All', 'Academic', 'Events', 'Facilities'].map(cat => {
                      const isActive = selectedAnnouncementCategory === cat;
                      return (
                        <button
                          key={cat}
                          onClick={() => setSelectedAnnouncementCategory(cat)}
                          className={`px-4 py-2 rounded-full text-xs font-bold transition-all duration-200 whitespace-nowrap shrink-0 cursor-pointer ${
                            isActive
                              ? 'bg-navy-500 text-white shadow-sm shadow-navy-100 scale-105'
                              : 'bg-white text-slate-600 border border-slate-100 hover:bg-slate-50'
                          }`}
                        >
                          {cat}
                        </button>
                      );
                    })}
                  </div>

                  {/* ANNOUNCEMENT CARDS */}
                  <div className="space-y-4">
                    {announcements
                      .filter(ann => selectedAnnouncementCategory === 'All' || ann.category === selectedAnnouncementCategory)
                      .map(ann => (
                        <div
                          key={ann.id}
                          onClick={() => {
                            setViewingAnnouncement(ann);
                            // Mark read
                            setAnnouncements(prev => prev.map(a => a.id === ann.id ? { ...a, unread: false } : a));
                          }}
                          className={`p-5 rounded-2xl border transition-all duration-300 relative cursor-pointer hover:shadow-[0_8px_32px_rgba(27,58,107,0.04)] ${
                            ann.unread 
                              ? 'border-navy-200 border-l-4 border-l-gold-500 bg-navy-50/20 shadow-[0_4px_24px_rgba(27,58,107,0.025)]' 
                              : 'border-slate-100/80 bg-white shadow-[0_4px_24px_rgba(0,0,0,0.025)]'
                          }`}
                        >

                          <div className="flex justify-between items-center">
                            <span className={`px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider border ${
                              ann.category === 'Events' ? 'bg-purple-50 text-purple-600 border-purple-100/50' :
                              ann.category === 'Academic' ? 'bg-indigo-50 text-indigo-600 border-indigo-100/50' :
                              'bg-sky-50 text-sky-600 border-sky-100/50'
                            }`}>
                              {ann.category}
                            </span>
                            <div className="flex items-center gap-1.5">
                              <span className="text-[10px] text-slate-400 font-semibold">{ann.date}</span>
                            </div>
                          </div>

                          <h3 className="font-bold text-navy-950 text-sm mt-2.5 leading-snug">
                            {ann.title}
                          </h3>
                          <p className="text-xs text-slate-500 mt-1.5 line-clamp-2 leading-relaxed font-medium">
                            {ann.description}
                          </p>

                          <div className="flex items-center justify-between mt-3.5 pt-3 border-t border-slate-100/60 text-[11px] text-slate-400 font-semibold">
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                setAnnouncements(prev => prev.map(a => a.id === ann.id ? { ...a, likes: a.likes + 1 } : a));
                                triggerToast('Liked announcement!');
                              }}
                              className="flex items-center gap-1.5 hover:text-navy-600 transition-colors p-1 -m-1 cursor-pointer"
                            >
                              <ThumbsUp className="w-3.5 h-3.5" />
                              <span>{ann.likes} Likes</span>
                            </button>
                            <span className="text-navy-600 font-bold flex items-center gap-0.5">
                              Read Article <ChevronLeft className="w-3.5 h-3.5 rotate-180" />
                            </span>
                          </div>
                        </div>
                      ))}
                  </div>

                </div>
              )}

              {/* ========================================================= */}
              {/* SCREEN 5: ATTENDANCE                                      */}
              {/* ========================================================= */}
              {activeTab === 'attendance' && (
                <div className="space-y-5">
                  
                  {/* HEADER */}
                  <div>
                    <h2 className="text-xl font-bold font-display text-navy-950 tracking-tight">Attendance Log</h2>
                    <p className="text-xs text-slate-500 font-medium">Track class check-ins, filter by subject, and view detailed records.</p>
                  </div>

                  {/* OVERALL STATISTICS BLOCK */}
                  <div className="bg-white p-5 rounded-2xl border border-navy-50/10 shadow-[0_4px_24px_rgba(27,58,107,0.015)] space-y-4">
                    <div className="flex justify-between items-center text-xs">
                      <div>
                        <p className="text-slate-400 font-bold uppercase text-[9px] tracking-wider">Overall attendance</p>
                        <h3 className="text-2xl font-bold font-display text-navy-600 mt-0.5">{overallAttendancePercent}%</h3>
                      </div>
                      <div className="text-right text-slate-500 font-semibold text-[11px]">
                        <span className="font-bold text-navy-950">{totalPresent}</span> Present / <span className="font-bold text-rose-500">{totalAbsent}</span> Absent
                        <p className="text-[10px] text-slate-400 font-medium mt-0.5">{totalClasses} Total lectures</p>
                      </div>
                    </div>

                    {/* overall progress bar */}
                    <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden flex">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${overallAttendancePercent}%` }}
                        transition={{ duration: 1.2, ease: 'easeOut' }}
                        className="bg-navy-500 h-full rounded-l-full"
                      />
                      <div className="bg-rose-500 flex-1 h-full rounded-r-full" />
                    </div>

                    <p className="text-[10px] text-slate-400 font-medium leading-relaxed flex items-start gap-1.5 pt-1 border-t border-slate-100/50">
                      <Info className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                      <span>MCKL policy mandates <strong>80% minimum attendance</strong> per course to remain eligible for end-of-semester final examinations.</span>
                    </p>
                  </div>

                  {/* TAPPABLE SUBJECT FILTER CHIPS (Clearly Outlined vs Filled) */}
                  <div className="space-y-2">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-1">Filter by Subject</p>
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => setSelectedAttendanceSubjectFilter('All')}
                        className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer ${
                          selectedAttendanceSubjectFilter === 'All'
                            ? 'bg-navy-500 text-white shadow-sm shadow-navy-100 scale-105'
                            : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        All Subjects
                      </button>
                      {courses.map(course => {
                        const isSelected = selectedAttendanceSubjectFilter === course.code;
                        return (
                          <button
                            key={course.id}
                            onClick={() => setSelectedAttendanceSubjectFilter(course.code)}
                            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer ${
                              isSelected
                                ? 'bg-navy-500 text-white shadow-sm shadow-navy-100 scale-105'
                                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                            }`}
                          >
                            {course.code}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* SEARCH BAR & MONTH NAVIGATOR */}
                  <div className="flex items-center gap-2.5">
                    <div className="relative flex-1">
                      <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Search attendance dates..."
                        value={attendanceSearchQuery}
                        onChange={(e) => setAttendanceSearchQuery(e.target.value)}
                        className="w-full bg-white pl-10 pr-3 py-2.5 rounded-xl border border-slate-100/80 text-xs text-slate-700 placeholder-slate-400 focus:outline-none focus:border-navy-400 shadow-sm"
                      />
                    </div>
                    
                    {/* Month navigator */}
                    <div className="flex items-center bg-white rounded-xl border border-slate-100/80 shadow-sm py-1.5 px-2 text-xs font-bold shrink-0">
                      <button 
                        onClick={() => setAttendanceMonth('June')}
                        className={`p-1 rounded ${attendanceMonth === 'June' ? 'text-navy-600 bg-navy-50' : 'text-slate-400 hover:text-slate-600'}`}
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <span className="px-2 w-16 text-center text-slate-700">{attendanceMonth} 2026</span>
                      <button 
                        onClick={() => setAttendanceMonth('July')}
                        className={`p-1 rounded ${attendanceMonth === 'July' ? 'text-navy-600 bg-navy-50' : 'text-slate-400 hover:text-slate-600'}`}
                      >
                        <ChevronLeft className="w-4 h-4 rotate-180" />
                      </button>
                    </div>
                  </div>

                  {/* INDIVIDUAL SUBJECT ROWS (Expandable Accordions) */}
                  <div className="space-y-3.5">
                    {courses
                      .filter(c => selectedAttendanceSubjectFilter === 'All' || c.code === selectedAttendanceSubjectFilter)
                      .map(course => {
                        const isExpanded = !!expandedAttendanceSubjects[course.code];
                        const subjectPercent = Math.round((course.attendanceStats.present / course.attendanceStats.total) * 100);
                        const isWarning = subjectPercent < 80;

                        return (
                          <div key={course.id} className="bg-white rounded-2xl border border-navy-50/10 shadow-[0_4px_24px_rgba(27,58,107,0.015)] overflow-hidden transition-all duration-300 hover:border-navy-200/40">
                            {/* Header row trigger */}
                            <div
                              onClick={() => setExpandedAttendanceSubjects(prev => ({ ...prev, [course.code]: !isExpanded }))}
                              className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-50/40 transition-colors"
                            >
                              <div className="flex-1 pr-3">
                                <div className="flex justify-between items-center">
                                  <span className="text-[10px] font-bold text-navy-500 tracking-wider font-mono">{course.code}</span>
                                  <span className={`text-[10px] font-bold ${isWarning ? 'text-rose-500' : 'text-emerald-500'}`}>
                                    {course.attendanceStats.present}/{course.attendanceStats.total} Lectures
                                  </span>
                                </div>
                                <h4 className="font-bold text-navy-950 text-xs leading-snug line-clamp-1 mt-1">{course.name}</h4>
                                
                                {/* Mini inline progress bar */}
                                <div className="w-full h-1.5 bg-slate-100 rounded-full mt-2 overflow-hidden">
                                  <div 
                                    className={`h-full rounded-full ${isWarning ? 'bg-rose-500 animate-pulse' : 'bg-navy-500'}`}
                                    style={{ width: `${subjectPercent}%` }}
                                  />
                                </div>
                              </div>

                              <div className="flex items-center gap-2 pl-2">
                                <span className={`text-sm font-bold font-display ${isWarning ? 'text-rose-600' : 'text-slate-800'}`}>
                                  {subjectPercent}%
                                </span>
                                <ChevronLeft className={`w-4 h-4 text-slate-400 transition-transform duration-300 ${isExpanded ? '-rotate-90 text-navy-600 font-bold' : ''}`} />
                              </div>
                            </div>

                            {/* Calendar Grid expansion view */}
                            {isExpanded && (
                              <div className="bg-slate-50/40 border-t border-slate-100/50 p-4 space-y-4">
                                <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                  <span>Daily Check-In Record</span>
                                  <span>{attendanceMonth} Sessions</span>
                                </div>

                                {/* Calendar dots list */}
                                <div className="grid grid-cols-4 gap-2.5">
                                  {(ATTENDANCE_CALENDAR_DATA[course.code] || [])
                                    .filter(day => day.date.includes(attendanceMonth === 'June' ? 'Jun' : 'Jul'))
                                    .filter(day => !attendanceSearchQuery || day.topic?.toLowerCase().includes(attendanceSearchQuery.toLowerCase()) || day.date.toLowerCase().includes(attendanceSearchQuery.toLowerCase()))
                                    .map((day, idx) => {
                                      const isPresent = day.status === 'present';
                                      const isAbsent = day.status === 'absent';
                                      return (
                                        <div
                                          key={idx}
                                          onClick={() => triggerToast(`Class date: ${day.date}, Topic: "${day.topic || 'N/A'}" - Status: ${day.status.toUpperCase()}`)}
                                          className={`p-2 rounded-xl flex flex-col items-center justify-center text-center border cursor-help transition-all duration-200 hover:scale-105 ${
                                            isPresent 
                                              ? 'bg-emerald-50/60 text-emerald-800 border-emerald-100/40 hover:bg-emerald-100/50' 
                                              : isAbsent 
                                              ? 'bg-rose-50/60 text-rose-800 border-rose-100/40 hover:bg-rose-100/50' 
                                              : 'bg-slate-50 text-slate-400 border-slate-100'
                                          }`}
                                        >
                                          <span className="text-[9px] font-bold text-slate-400">{day.date}</span>
                                          <span className="text-xs font-bold mt-1">
                                            {isPresent ? 'PRE' : isAbsent ? 'ABS' : 'N/A'}
                                          </span>
                                        </div>
                                      );
                                    })}
                                </div>

                                <div className="flex justify-between items-center text-[9px] text-slate-400 font-semibold pt-1">
                                  <div className="flex items-center gap-1.5">
                                    <span className="w-2.5 h-2.5 rounded-md bg-emerald-50 border border-emerald-100/40" />
                                    <span>Present Check-In</span>
                                  </div>
                                  <div className="flex items-center gap-1.5">
                                    <span className="w-2.5 h-2.5 rounded-md bg-rose-50 border border-rose-100/40" />
                                    <span>Absent Class</span>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                  </div>

                </div>
              )}

              {/* ========================================================= */}
              {/* SCREEN 6: NOTIFICATIONS                                   */}
              {/* ========================================================= */}
              {activeTab === 'notifications' && (
                <div className="space-y-5">
                  
                  {/* HEADER */}
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-xl font-bold font-display text-navy-950 tracking-tight">Alerts & Messages</h2>
                      <p className="text-xs text-slate-500 font-medium">Track critical urgency tasks, fee notices, and assignment reports.</p>
                    </div>
                  </div>

                  {/* UNREAD PILL & MARK ALL READ BUTTON */}
                  <div className="bg-navy-50/60 p-4 rounded-2xl border border-navy-100/30 flex items-center justify-between text-xs font-semibold text-navy-900 shadow-[0_4px_16px_rgba(27,58,107,0.03)]">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-navy-600 animate-pulse"></span>
                      <span>You have <strong>{unreadNotificationsCount}</strong> unread alerts</span>
                    </div>
                    {unreadNotificationsCount > 0 && (
                      <button
                        onClick={handleMarkAllNotificationsRead}
                        className="px-3 py-1.5 bg-white text-navy-600 font-bold rounded-xl border border-navy-100/50 hover:bg-navy-50 transition-colors duration-200 shadow-sm cursor-pointer"
                      >
                        Mark All Read
                      </button>
                    )}
                  </div>

                  {/* CATEGORY FILTER CHIPS */}
                  <div className="flex gap-1.5 overflow-x-auto pb-1">
                    {['All', 'Assignments', 'Class Notices', 'Fees'].map(cat => {
                      const isActive = selectedNotificationFilter === cat;
                      return (
                        <button
                          key={cat}
                          onClick={() => setSelectedNotificationFilter(cat)}
                          className={`px-4 py-2 rounded-full text-xs font-bold transition-all duration-200 whitespace-nowrap shrink-0 cursor-pointer ${
                            isActive
                              ? 'bg-navy-500 text-white shadow-sm shadow-navy-100 scale-105'
                              : 'bg-white text-slate-600 border border-slate-100 hover:bg-slate-50'
                          }`}
                        >
                          {cat}
                        </button>
                      );
                    })}
                  </div>

                  {/* NOTIFICATION CARDS LIST */}
                  <div className="space-y-3.5">
                    {notifications
                      .filter(notif => selectedNotificationFilter === 'All' || notif.category === selectedNotificationFilter)
                      .map(notif => (
                        <div
                          key={notif.id}
                          onClick={() => {
                            setViewingNotification(notif);
                            // Mark read
                            setNotifications(prev => prev.map(n => n.id === notif.id ? { ...n, unread: false } : n));
                          }}
                          className={`p-4.5 rounded-2xl border transition-all duration-300 relative cursor-pointer hover:shadow-[0_8px_32px_rgba(27,58,107,0.04)] flex flex-col gap-2.5 ${
                            notif.unread
                              ? 'bg-navy-50/20 border-navy-200/80 border-l-4 border-l-gold-500 shadow-[0_4px_20px_rgba(27,58,107,0.025)]'
                              : 'bg-white border-slate-100/80 shadow-[0_4px_24px_rgba(0,0,0,0.025)]'
                          }`}
                        >

                          <div className="flex justify-between items-start">
                            <div className="space-y-1">
                              <div className="flex items-center gap-1.5">
                                <span className="text-[10px] text-slate-400 font-bold">{notif.date}</span>
                              </div>
                              <h3 className={`text-navy-950 text-xs leading-snug line-clamp-1 pr-6 ${
                                notif.unread ? 'font-bold' : 'font-semibold'
                              }`}>
                                {notif.title}
                              </h3>
                              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Category: {notif.category}</p>
                            </div>
                            
                            {/* DISTINCT URGENCY BADGE ON THE RIGHT */}
                            <span className={`px-2 py-0.5 rounded-md text-[9px] font-extrabold uppercase shrink-0 tracking-wider border ${
                              notif.urgency === 'URGENT' ? 'bg-rose-50 text-rose-600 border-rose-100/40 animate-pulse' :
                              notif.urgency === 'IMPORTANT' ? 'bg-amber-50 text-amber-600 border-amber-100/40' :
                              notif.urgency === 'NEW' ? 'bg-emerald-50 text-emerald-600 border-emerald-100/40' :
                              'bg-navy-50 text-navy-600 border-navy-100/40'
                            }`}>
                              {notif.urgency}
                            </span>
                          </div>

                          <p className="text-xs text-slate-500 line-clamp-1 font-medium leading-relaxed">
                            {notif.description}
                          </p>
                        </div>
                      ))}
                  </div>

                </div>
              )}

            </div>
          )}

        </div>

        {/* BOTTOM NAVIGATION BAR */}
        {isLoggedIn && activeTab !== 'login' && (
          <div className="absolute bottom-0 left-0 right-0 h-20 bg-white border-t border-slate-100 shadow-[0_-4px_12px_rgba(0,0,0,0.03)] flex items-center justify-around px-2 z-40">
            
            {/* Nav Item: Dashboard */}
            <button 
              onClick={() => handleTabChange('dashboard')}
              className={`flex flex-col items-center justify-center flex-1 h-full py-2 transition-all cursor-pointer ${
                activeTab === 'dashboard' ? 'text-navy-600 font-bold scale-105' : 'text-slate-400 hover:text-slate-500'
              }`}
            >
              <div className={`p-1 px-3.5 rounded-full mb-1 transition-all ${activeTab === 'dashboard' ? 'bg-navy-50/70' : ''}`}>
                <LayoutDashboard className="w-[18px] h-[18px]" />
              </div>
              <span className="text-[9px] font-medium uppercase tracking-wider">Home</span>
            </button>

            {/* Nav Item: Academic */}
            <button 
              onClick={() => handleTabChange('academic')}
              className={`flex flex-col items-center justify-center flex-1 h-full py-2 transition-all cursor-pointer ${
                activeTab === 'academic' ? 'text-navy-600 font-bold scale-105' : 'text-slate-400 hover:text-slate-500'
              }`}
            >
              <div className={`p-1 px-3.5 rounded-full mb-1 transition-all ${activeTab === 'academic' ? 'bg-navy-50/70' : ''}`}>
                <BookOpen className="w-[18px] h-[18px]" />
              </div>
              <span className="text-[9px] font-medium uppercase tracking-wider">Courses</span>
            </button>

            {/* Nav Item: Schedule */}
            <button 
              onClick={() => handleTabChange('schedule')}
              className={`flex flex-col items-center justify-center flex-1 h-full py-2 transition-all cursor-pointer ${
                activeTab === 'schedule' ? 'text-navy-600 font-bold scale-105' : 'text-slate-400 hover:text-slate-500'
              }`}
            >
              <div className={`p-1 px-3.5 rounded-full mb-1 transition-all ${activeTab === 'schedule' ? 'bg-navy-50/70' : ''}`}>
                <Calendar className="w-[18px] h-[18px]" />
              </div>
              <span className="text-[9px] font-medium uppercase tracking-wider">Classes</span>
            </button>

            {/* Nav Item: Announcements */}
            <button 
              onClick={() => handleTabChange('announcements')}
              className={`flex flex-col items-center justify-center flex-1 h-full py-2 transition-all relative cursor-pointer ${
                activeTab === 'announcements' ? 'text-navy-600 font-bold scale-105' : 'text-slate-400 hover:text-slate-500'
              }`}
            >
              <div className={`p-1 px-3.5 rounded-full mb-1 transition-all ${activeTab === 'announcements' ? 'bg-navy-50/70' : ''}`}>
                <Megaphone className="w-[18px] h-[18px]" />
              </div>
              <span className="text-[9px] font-medium uppercase tracking-wider">News</span>
              {unreadAnnouncementsCount > 0 && (
                <span className="absolute top-2.5 right-4 w-1.5 h-1.5 bg-navy-500 rounded-full"></span>
              )}
            </button>

            {/* Nav Item: Attendance */}
            <button 
              onClick={() => handleTabChange('attendance')}
              className={`flex flex-col items-center justify-center flex-1 h-full py-2 transition-all cursor-pointer ${
                activeTab === 'attendance' ? 'text-navy-600 font-bold scale-105' : 'text-slate-400 hover:text-slate-500'
              }`}
            >
              <div className={`p-1 px-3.5 rounded-full mb-1 transition-all ${activeTab === 'attendance' ? 'bg-navy-50/70' : ''}`}>
                <CheckSquare className="w-[18px] h-[18px]" />
              </div>
              <span className="text-[9px] font-medium uppercase tracking-wider">Log</span>
            </button>

            {/* Nav Item: Notifications */}
            <button 
              onClick={() => handleTabChange('notifications')}
              className={`flex flex-col items-center justify-center flex-1 h-full py-2 transition-all relative cursor-pointer ${
                activeTab === 'notifications' ? 'text-navy-600 font-bold scale-105' : 'text-slate-400 hover:text-slate-500'
              }`}
            >
              <div className={`p-1 px-3.5 rounded-full mb-1 transition-all ${activeTab === 'notifications' ? 'bg-navy-50/70' : ''}`}>
                <Bell className="w-[18px] h-[18px]" />
              </div>
              <span className="text-[9px] font-medium uppercase tracking-wider">Alerts</span>
              {unreadNotificationsCount > 0 && (
                <span className="absolute top-2 bg-rose-500 text-white font-extrabold text-[8px] px-1 py-0.2 rounded-full min-w-3.5 text-center right-4 scale-95 border border-white">
                  {unreadNotificationsCount}
                </span>
              )}
            </button>

          </div>
        )}

        {/* ========================================== */}
        {/* DETAIL POPUP MODAL: ANNOUNCEMENT DETAIL    */}
        {/* ========================================== */}
        <AnimatePresence>
          {viewingAnnouncement && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-end justify-center"
              onClick={() => setViewingAnnouncement(null)}
            >
              <motion.div 
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 220 }}
                className="bg-white w-full max-h-[85%] rounded-t-3xl p-6 overflow-y-auto space-y-4 shadow-2xl relative"
                onClick={e => e.stopPropagation()}
              >
                {/* drag indicator */}
                <div className="w-12 h-1 bg-slate-200 rounded-full mx-auto mb-3" />

                <div className="flex justify-between items-center">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                    viewingAnnouncement.category === 'Events' ? 'bg-purple-50 text-purple-600 border border-purple-100' :
                    viewingAnnouncement.category === 'Academic' ? 'bg-indigo-50 text-indigo-600 border border-indigo-100' :
                    'bg-sky-50 text-sky-600 border border-sky-100'
                  }`}>
                    {viewingAnnouncement.category}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">{viewingAnnouncement.date}</span>
                </div>

                <h3 className="text-base font-bold text-navy-950 leading-snug">
                  {viewingAnnouncement.title}
                </h3>

                <div className="text-xs text-slate-600 leading-relaxed space-y-2 pt-2 border-t border-slate-50">
                  <p>{viewingAnnouncement.description}</p>
                  <p className="text-slate-400 mt-4 italic font-medium">Published by: Methodist College Kuala Lumpur Campus Administration & Academic Registrar Department Office.</p>
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                  <button 
                    onClick={() => {
                      setAnnouncements(prev => prev.map(a => a.id === viewingAnnouncement.id ? { ...a, likes: a.likes + 1 } : a));
                      triggerToast('Liked announcement!');
                    }}
                    className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold hover:text-navy-600 cursor-pointer"
                  >
                    <ThumbsUp className="w-4 h-4" />
                    <span>{viewingAnnouncement.likes} Likes</span>
                  </button>
                  <button 
                    onClick={() => setViewingAnnouncement(null)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ========================================== */}
        {/* DETAIL POPUP MODAL: NOTIFICATION DETAIL    */}
        {/* ========================================== */}
        <AnimatePresence>
          {viewingNotification && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-end justify-center"
              onClick={() => setViewingNotification(null)}
            >
              <motion.div 
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 220 }}
                className="bg-white w-full max-h-[85%] rounded-t-3xl p-6 overflow-y-auto space-y-4 shadow-2xl relative"
                onClick={e => e.stopPropagation()}
              >
                {/* drag indicator */}
                <div className="w-12 h-1 bg-slate-200 rounded-full mx-auto mb-3" />

                <div className="flex justify-between items-center">
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider ${
                    viewingNotification.urgency === 'URGENT' ? 'bg-rose-50 text-rose-600 border border-rose-100' :
                    viewingNotification.urgency === 'IMPORTANT' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                    viewingNotification.urgency === 'NEW' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                    'bg-navy-50 text-navy-600 border border-navy-100/40'
                  }`}>
                    {viewingNotification.urgency}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">{viewingNotification.date}</span>
                </div>

                <h3 className="text-base font-bold text-navy-950 leading-snug">
                  {viewingNotification.title}
                </h3>

                <div className="text-xs text-slate-600 leading-relaxed space-y-2 pt-2 border-t border-slate-50">
                  <p>{viewingNotification.description}</p>
                  <p className="text-slate-400 font-semibold mt-2">Category: {viewingNotification.category}</p>
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                  <span className="text-[10px] text-slate-400 font-medium">Notification Ref: #{viewingNotification.id.toUpperCase()}</span>
                  <button 
                    onClick={() => setViewingNotification(null)}
                    className="px-4 py-2 bg-navy-600 hover:bg-navy-700 text-white font-bold text-xs rounded-xl transition-all shadow-md shadow-navy-100 cursor-pointer"
                  >
                    Acknowledge
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
