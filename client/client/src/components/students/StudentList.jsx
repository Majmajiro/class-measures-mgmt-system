import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { studentsAPI } from '../../services/api';
import StudentForm from './StudentForm';
import { toast } from 'react-hot-toast';
import { 
  Users, Plus, Edit, Trash2, Search, Phone, MessageCircle, Eye, UserCheck, UserX,
  Filter, Download, RefreshCw, Grid, List, ChevronDown, ChevronUp, Award, Calendar,
  DollarSign, BookOpen, AlertTriangle, CheckCircle, Clock, User, Heart, GraduationCap,
  ArrowUp, ArrowDown, RotateCcw, PhoneCall, Target, TrendingUp, Code, Gamepad2,
  BookIcon, Globe, Cpu, Puzzle, Lightbulb
} from 'lucide-react';

const StudentList = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [programFilter, setProgramFilter] = useState('');
  const [levelFilter, setLevelFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [paymentFilter, setPaymentFilter] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [showStats, setShowStats] = useState(true);
  const [showPaymentStats, setShowPaymentStats] = useState(false);
  const { user } = useAuth();

  // Updated colors to match your logo
  const colors = {
    primary: '#c55c5c',      // Logo red
    secondary: '#f4c842',    // Logo gold/yellow  
    dark: '#1e1e3c',         // Logo navy
    white: '#ffffff',
    gray: '#6b7280',
    lightGray: '#f3f4f6',
    success: '#10b981',
    warning: '#f59e0b',
    danger: '#ef4444',
    info: '#3b82f6'
  };

  // Updated programs to match your actual offerings
  const programs = ['Coding', 'Chess', 'Robotics', 'French', 'English', 'Digital Literacy'];
  const skillLevels = ['Beginner', 'Intermediate', 'Advanced'];
  const membershipStatus = ['Member', 'Non-Member'];
  const paymentStatus = ['Paid Up', 'Outstanding', 'Overdue'];

  // Helper function to safely get parent info (handles both old and new formats)
  const getParentInfo = (student) => {
    if (student.parentInfo) {
      return {
        name: student.parentInfo.parentName || 'Unknown Parent',
        phone: student.parentInfo.parentPhone || 'Phone not set'
      };
    } else {
      return {
        name: student.parentName || 'Unknown Parent',
        phone: student.parentPhone || student.emergencyContact || 'Phone not set'
      };
    }
  };

  // Load students from API
  const loadStudents = async (showRefreshIndicator = false) => {
    try {
      if (showRefreshIndicator) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      
      console.log('🔄 Loading students...');
      const response = await studentsAPI.getAll();
      console.log('📥 Students API response:', response);
      
      // Handle different response structures
      let studentsData = [];
      if (response.students) {
        studentsData = response.students;
      } else if (response.data && response.data.students) {
        studentsData = response.data.students;
      } else if (Array.isArray(response)) {
        studentsData = response;
      } else if (response.data && Array.isArray(response.data)) {
        studentsData = response.data;
      }
      
      console.log('🎯 Final studentsData to set:', studentsData);
      console.log('✅ Successfully loaded', studentsData.length, 'students');
      setStudents(studentsData);
      
    } catch (error) {
      console.error('❌ Error loading students:', error);
      toast.error('Failed to load students');
      setStudents([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadStudents();
  }, []);

  // Handle successful student save
  const handleStudentSaved = () => {
    setShowForm(false);
    setEditingStudent(null);
    loadStudents(true);
  };

  // Handle edit student
  const handleEditStudent = (student) => {
    setEditingStudent(student);
    setShowForm(true);
  };

  // Handle delete student
  const handleDeleteStudent = async (studentId) => {
    if (!window.confirm('Are you sure you want to delete this student?')) {
      return;
    }

    try {
      await studentsAPI.delete(studentId);
      toast.success('🗑️ Student deleted successfully!');
      loadStudents(true);
    } catch (error) {
      console.error('Error deleting student:', error);
      toast.error('Failed to delete student');
    }
  };

  // Quick enroll student in program
  const handleQuickEnroll = async (student, program, level = 'Beginner') => {
    try {
      const updatedStudent = {
        ...student,
        enrollments: [
          ...(student.enrollments || []),
          {
            program,
            level,
            enrolledDate: new Date().toISOString(),
            status: 'Active'
          }
        ]
      };
      
      await studentsAPI.update(student._id, updatedStudent);
      toast.success(`${student.name} enrolled in ${program} (${level})!`);
      loadStudents(true);
    } catch (error) {
      console.error('Error enrolling student:', error);
      toast.error('Failed to enroll student');
    }
  };

  // Transfer student level
  const handleLevelTransfer = async (student, program, newLevel) => {
    if (user?.role !== 'admin' && user?.role !== 'tutor') {
      toast.error('Only instructors can approve level transfers');
      return;
    }

    try {
      const updatedEnrollments = student.enrollments?.map(enrollment => 
        enrollment.program === program 
          ? { ...enrollment, level: newLevel, lastTransfer: new Date().toISOString() }
          : enrollment
      ) || [];

      const updatedStudent = { ...student, enrollments: updatedEnrollments };
      await studentsAPI.update(student._id, updatedStudent);
      toast.success(`${student.name} transferred to ${newLevel} level in ${program}!`);
      loadStudents(true);
    } catch (error) {
      console.error('Error transferring student:', error);
      toast.error('Failed to transfer student level');
    }
  };

  // Open WhatsApp chat
  const openWhatsApp = (phoneNumber, studentName) => {
    if (!phoneNumber || phoneNumber === 'Phone not set') {
      toast.error('No phone number available for this student');
      return;
    }
    const message = `Hello! This is regarding ${studentName} from Class Measures Hub.`;
    const whatsappUrl = `https://wa.me/254${phoneNumber.replace(/\D/g, '').slice(-9)}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  // Create test student
  const createTestStudent = async () => {
    try {
      const testStudents = [
        {
          name: 'Emma Thompson',
          age: 11,
          parentInfo: {
            parentName: 'Sarah Thompson',
            parentPhone: '0712345678',
            parentEmail: 'sarah.thompson@email.com'
          },
          emergencyContact: {
            name: 'John Thompson',
            phone: '0787654321',
            relationship: 'uncle'
          },
          membershipStatus: 'Member',
          enrollments: [
            { program: 'Coding', level: 'Intermediate', enrolledDate: new Date().toISOString(), status: 'Active' },
            { program: 'Digital Literacy', level: 'Advanced', enrolledDate: new Date().toISOString(), status: 'Active' }
          ],
          paymentStatus: 'Paid Up',
          lastPayment: new Date().toISOString(),
          amountOwed: 0,
          attendance: { present: 22, total: 24 },
          academicProgress: {
            coding: { grade: 'A-', skills: ['Problem solving', 'Python basics', 'Logic development'] },
            digitalLiteracy: { grade: 'A', skills: ['Digital citizenship', 'Online safety', 'Research skills'] }
          },
          medicalInfo: {
            allergies: 'No known allergies',
            medications: '',
            conditions: ''
          },
          isActive: true
        },
        {
          name: 'Marcus Kiprotich',
          age: 13,
          parentInfo: {
            parentName: 'Grace Kiprotich',
            parentPhone: '0798765432',
            parentEmail: 'grace.kiprotich@email.com'
          },
          emergencyContact: {
            name: 'Paul Kiprotich',
            phone: '0723456789',
            relationship: 'uncle'
          },
          membershipStatus: 'Member',
          enrollments: [
            { program: 'Chess', level: 'Advanced', enrolledDate: new Date().toISOString(), status: 'Active' },
            { program: 'French', level: 'Intermediate', enrolledDate: new Date().toISOString(), status: 'Active' }
          ],
          paymentStatus: 'Outstanding',
          lastPayment: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
          amountOwed: 3500,
          attendance: { present: 18, total: 20 },
          academicProgress: {
            chess: { grade: 'A', skills: ['Strategic thinking', 'Pattern recognition', 'Critical analysis'] },
            french: { grade: 'B+', skills: ['Vocabulary building', 'Pronunciation', 'Grammar fundamentals'] }
          },
          medicalInfo: {
            allergies: '',
            medications: '',
            conditions: 'Wears reading glasses'
          },
          isActive: true
        }
      ];

      const randomStudent = testStudents[Math.floor(Math.random() * testStudents.length)];
      
      const testStudentData = {
        ...randomStudent,
        name: `${randomStudent.name} (Test - ${new Date().toLocaleDateString()})`
      };

      const response = await studentsAPI.create(testStudentData);
      
      if (response.student || response.message) {
        toast.success('🧪 Test student created successfully!');
        loadStudents(true);
      } else {
        toast.error('Failed to create test student');
      }
    } catch (error) {
      console.error('Test student error:', error);
      toast.error('Failed to create test student');
    }
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'active': case 'member': case 'paid up': return colors.success;
      case 'inactive': case 'non-member': return colors.gray;
      case 'outstanding': return colors.warning;
      case 'overdue': return colors.danger;
      default: return colors.gray;
    }
  };

  // Get attendance percentage
  const getAttendancePercentage = (attendance) => {
    if (!attendance || !attendance.total) return 0;
    return Math.round((attendance.present / attendance.total) * 100);
  };

  // Filter students (updated to use new data structure)
  const filteredStudents = students.filter(student => {
    const parentInfo = getParentInfo(student);
    
    const matchesSearch = !searchQuery || 
      student.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      parentInfo.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      parentInfo.phone?.includes(searchQuery);
    
    const matchesProgram = !programFilter || 
      student.enrollments?.some(e => e.program === programFilter);
    
    const matchesLevel = !levelFilter || 
      student.enrollments?.some(e => e.level === levelFilter);
    
    const matchesStatus = !statusFilter || student.membershipStatus === statusFilter;
    
    const matchesPayment = !paymentFilter || student.paymentStatus === paymentFilter;
    
    return matchesSearch && matchesProgram && matchesLevel && matchesStatus && matchesPayment;
  });

  // Calculate stats
  const totalStudents = students.length;
  const activeStudents = students.filter(s => s.isActive).length;
  const members = students.filter(s => s.membershipStatus === 'Member').length;
  const totalEnrollments = students.reduce((sum, s) => sum + (s.enrollments?.length || 0), 0);
  const outstandingPayments = students.filter(s => s.paymentStatus === 'Outstanding' || s.paymentStatus === 'Overdue').length;
  const totalOwed = students.reduce((sum, s) => sum + (s.amountOwed || 0), 0);
  const averageAttendance = students.length > 0 ? 
    Math.round(students.reduce((sum, s) => sum + getAttendancePercentage(s.attendance), 0) / students.length) : 0;

  // Export students data (admin only)
  const exportStudents = () => {
    if (user?.role !== 'admin') {
      toast.error('Only administrators can export data');
      return;
    }
    
    const csvContent = "data:text/csv;charset=utf-8," + 
      "Student Name,Age,Parent Name,Phone,Membership,Programs,Payment Status,Amount Owed\n" +
      students.map(s => {
        const parentInfo = getParentInfo(s);
        return `"${s.name}","${s.age}","${parentInfo.name}","${parentInfo.phone}","${s.membershipStatus}","${s.enrollments?.map(e => `${e.program}(${e.level})`).join('; ')}","${s.paymentStatus}","${s.amountOwed || 0}"`;
      }).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `students_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success('Students data exported successfully!');
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ 
            animation: 'spin 1s linear infinite', 
            borderRadius: '50%', 
            height: '3rem', 
            width: '3rem', 
            border: `2px solid ${colors.lightGray}`, 
            borderBottom: `2px solid ${colors.primary}`,
            margin: '0 auto 1rem'
          }}></div>
          <p style={{ color: colors.gray }}>Loading students...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem', backgroundColor: colors.lightGray, minHeight: '100vh' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        
        {/* 🎨 LOGO & WELCOME SECTION - Updated with Real Business Model */}
        <div style={{
          backgroundColor: colors.white,
          borderRadius: '1rem',
          padding: '2.5rem',
          marginBottom: '2rem',
          boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
          textAlign: 'center',
          background: `linear-gradient(135deg, ${colors.white} 0%, ${colors.lightGray} 100%)`,
          border: `3px solid ${colors.primary}20`
        }}>
          {/* Class Measures Hub Logo - Recreating your design */}
          <div style={{
            width: '120px',
            height: '120px',
            margin: '0 auto 2rem',
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {/* Circular logo base */}
            <div style={{
              width: '100px',
              height: '100px',
              borderRadius: '50%',
              background: `conic-gradient(from 0deg, ${colors.primary} 0deg 180deg, ${colors.secondary} 180deg 360deg)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: `0 8px 25px ${colors.primary}40`,
              position: 'relative'
            }}>
              {/* Dark navy "M" or mountain shape overlay */}
              <div style={{
                width: '50px',
                height: '50px',
                background: colors.dark,
                borderRadius: '0 50% 50% 50%',
                transform: 'rotate(45deg)',
                position: 'absolute',
                right: '25px'
              }}></div>
              {/* Center accent */}
              <div style={{
                width: '30px',
                height: '30px',
                background: colors.white,
                borderRadius: '50%',
                zIndex: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1rem',
                fontWeight: 'bold',
                color: colors.dark
              }}>
                CM
              </div>
            </div>
            
            {/* Small accent badge */}
            <div style={{
              position: 'absolute',
              top: '5px',
              right: '15px',
              width: '35px',
              height: '35px',
              background: `linear-gradient(135deg, ${colors.secondary}, ${colors.primary})`,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.2rem',
              boxShadow: `0 4px 15px ${colors.secondary}60`
            }}>
              🌟
            </div>
          </div>
          
          <h1 style={{ 
            fontSize: '3rem', 
            fontWeight: 'bold', 
            background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            marginBottom: '1rem',
            letterSpacing: '-0.02em',
            textShadow: 'none'
          }}>
            Class Measures Hub
          </h1>
          
          <p style={{ 
            fontSize: '1.5rem', 
            color: colors.dark,
            marginBottom: '1rem',
            fontWeight: '600'
          }}>
            🚀 Empowering students with 21st-century skills through innovative education
          </p>
          
          <p style={{ 
            fontSize: '1.2rem', 
            color: colors.gray,
            marginBottom: '0.5rem',
            lineHeight: '1.6'
          }}>
            Teaching <strong>Coding</strong>, <strong>Chess</strong>, <strong>Digital Literacy</strong>, <strong>French</strong> & <strong>English</strong> to develop critical thinking, problem-solving, and communication skills
          </p>

          <p style={{ 
            fontSize: '1rem', 
            color: colors.gray,
            fontStyle: 'italic',
            marginBottom: '2rem',
            lineHeight: '1.5'
          }}>
            Powered by premium platforms including PurpleMash, EducationCity, Rising Stars & Scholastic Learning Zone
          </p>

          {/* Enhanced skill icons */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '2rem',
            flexWrap: 'wrap',
            marginBottom: '2rem'
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ 
                fontSize: '2rem', 
                marginBottom: '0.5rem',
                padding: '1rem',
                background: `${colors.primary}15`,
                borderRadius: '50%',
                width: '70px',
                height: '70px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 0.5rem'
              }}>
                <Code size={28} style={{ color: colors.primary }} />
              </div>
              <div style={{ fontSize: '0.9rem', color: colors.dark, fontWeight: '600' }}>Coding</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ 
                fontSize: '2rem', 
                marginBottom: '0.5rem',
                padding: '1rem',
                background: `${colors.secondary}15`,
                borderRadius: '50%',
                width: '70px',
                height: '70px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 0.5rem'
              }}>
                <Puzzle size={28} style={{ color: colors.secondary }} />
              </div>
              <div style={{ fontSize: '0.9rem', color: colors.dark, fontWeight: '600' }}>Chess</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ 
                fontSize: '2rem', 
                marginBottom: '0.5rem',
                padding: '1rem',
                background: `${colors.dark}15`,
                borderRadius: '50%',
                width: '70px',
                height: '70px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 0.5rem'
              }}>
                <Globe size={28} style={{ color: colors.dark }} />
              </div>
              <div style={{ fontSize: '0.9rem', color: colors.dark, fontWeight: '600' }}>Languages</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ 
                fontSize: '2rem', 
                marginBottom: '0.5rem',
                padding: '1rem',
                background: `${colors.info}15`,
                borderRadius: '50%',
                width: '70px',
                height: '70px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 0.5rem'
              }}>
                <Cpu size={28} style={{ color: colors.info }} />
              </div>
              <div style={{ fontSize: '0.9rem', color: colors.dark, fontWeight: '600' }}>Digital Skills</div>
            </div>
          </div>

          {/* Quick stats with better styling */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '3rem',
            flexWrap: 'wrap',
            marginTop: '2rem'
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ 
                fontSize: '2rem', 
                fontWeight: 'bold', 
                color: colors.primary,
                marginBottom: '0.25rem'
              }}>
                {totalStudents}
              </div>
              <div style={{ fontSize: '0.9rem', color: colors.gray, fontWeight: '500' }}>Students Enrolled</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ 
                fontSize: '2rem', 
                fontWeight: 'bold', 
                color: colors.success,
                marginBottom: '0.25rem'
              }}>
                {activeStudents}
              </div>
              <div style={{ fontSize: '0.9rem', color: colors.gray, fontWeight: '500' }}>Active Learners</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ 
                fontSize: '2rem', 
                fontWeight: 'bold', 
                color: colors.secondary,
                marginBottom: '0.25rem'
              }}>
                {programs.length}
              </div>
              <div style={{ fontSize: '0.9rem', color: colors.gray, fontWeight: '500' }}>Skill Programs</div>
            </div>
          </div>
        </div>

        {/* Enhanced Header with Stats */}
        <div style={{
          backgroundColor: colors.white,
          borderRadius: '1rem',
          padding: '1.5rem',
          marginBottom: '2rem',
          boxShadow: '0 4px 6px rgba(0,0,0,0.05)'
        }}>
          {/* Title and Quick Actions */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <div>
              <h2 style={{ fontSize: '1.8rem', fontWeight: 'bold', color: colors.dark, margin: 0 }}>
                👨‍🎓 Student Management
              </h2>
              <p style={{ color: colors.gray, fontSize: '0.9rem', margin: '0.25rem 0 0 0' }}>
                Track student progress across all programs and manage enrollments efficiently
              </p>
            </div>
            
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
              {/* View Toggle */}
              <div style={{ display: 'flex', backgroundColor: colors.lightGray, borderRadius: '0.5rem', padding: '0.25rem' }}>
                <button
                  onClick={() => setViewMode('grid')}
                  style={{
                    padding: '0.5rem',
                    backgroundColor: viewMode === 'grid' ? colors.white : 'transparent',
                    border: 'none',
                    borderRadius: '0.25rem',
                    cursor: 'pointer',
                    color: viewMode === 'grid' ? colors.dark : colors.gray
                  }}
                >
                  <Grid size={16} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  style={{
                    padding: '0.5rem',
                    backgroundColor: viewMode === 'list' ? colors.white : 'transparent',
                    border: 'none',
                    borderRadius: '0.25rem',
                    cursor: 'pointer',
                    color: viewMode === 'list' ? colors.dark : colors.gray
                  }}
                >
                  <List size={16} />
                </button>
              </div>

              {/* Export Button (Admin Only) */}
              {user?.role === 'admin' && (
                <button
                  onClick={exportStudents}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.5rem 1rem',
                    backgroundColor: colors.info,
                    color: colors.white,
                    border: 'none',
                    borderRadius: '0.5rem',
                    cursor: 'pointer',
                    fontSize: '0.8rem',
                    fontWeight: '500'
                  }}
                >
                  <Download size={14} />
                  Export
                </button>
              )}

              <button
                onClick={createTestStudent}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.5rem 1rem',
                  backgroundColor: `${colors.secondary}20`,
                  color: colors.dark,
                  border: `2px solid ${colors.secondary}`,
                  borderRadius: '0.5rem',
                  cursor: 'pointer',
                  fontSize: '0.8rem',
                  fontWeight: '500'
                }}
              >
                🧪 Test
              </button>
              
              <button
                onClick={() => setShowForm(true)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.5rem 1rem',
                  background: `linear-gradient(135deg, ${colors.secondary}, ${colors.primary})`,
                  color: colors.dark,
                  border: 'none',
                  borderRadius: '0.5rem',
                  cursor: 'pointer',
                  fontSize: '0.8rem',
                  fontWeight: '600'
                }}
              >
                <Plus size={14} />
                Add Student
              </button>
            </div>
          </div>

          {/* Stats Dashboard */}
          {showStats && (
            <div style={{
              backgroundColor: colors.lightGray,
              borderRadius: '0.75rem',
              padding: '1.5rem',
              marginBottom: '1.5rem'
            }}>
              {/* Main Stats Row */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '2rem', fontWeight: 'bold', color: colors.primary }}>{totalStudents}</div>
                  <div style={{ fontSize: '0.85rem', color: colors.gray }}>Total Students</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '2rem', fontWeight: 'bold', color: colors.success }}>{activeStudents}</div>
                  <div style={{ fontSize: '0.85rem', color: colors.gray }}>Active Students</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '2rem', fontWeight: 'bold', color: colors.info }}>{members}</div>
                  <div style={{ fontSize: '0.85rem', color: colors.gray }}>Members</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '2rem', fontWeight: 'bold', color: colors.warning }}>{totalEnrollments}</div>
                  <div style={{ fontSize: '0.85rem', color: colors.gray }}>Total Enrollments</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '2rem', fontWeight: 'bold', color: colors.success }}>{averageAttendance}%</div>
                  <div style={{ fontSize: '0.85rem', color: colors.gray }}>Avg Attendance</div>
                </div>
              </div>

              {/* Payment Section (Admin Only, Collapsible) */}
              {user?.role === 'admin' && (
                <div>
                  <button
                    onClick={() => setShowPaymentStats(!showPaymentStats)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.5rem',
                      backgroundColor: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      color: colors.gray,
                      fontSize: '0.85rem',
                      fontWeight: '500'
                    }}
                  >
                    {showPaymentStats ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    Payment Analytics
                  </button>
                  
                  {showPaymentStats && (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginTop: '1rem', paddingTop: '1rem', borderTop: `1px solid ${colors.gray}30` }}>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: colors.danger }}>{outstandingPayments}</div>
                        <div style={{ fontSize: '0.85rem', color: colors.gray }}>Outstanding Payments</div>
                      </div>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: colors.warning }}>KSh {totalOwed.toLocaleString()}</div>
                        <div style={{ fontSize: '0.85rem', color: colors.gray }}>Total Amount Owed</div>
                      </div>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: colors.success }}>{Math.round(((totalStudents - outstandingPayments) / totalStudents) * 100) || 0}%</div>
                        <div style={{ fontSize: '0.85rem', color: colors.gray }}>Payment Rate</div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Advanced Search and Filters */}
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr auto', gap: '1rem', alignItems: 'end' }}>
            <div style={{ position: 'relative' }}>
              <Search size={20} style={{
                position: 'absolute',
                left: '1rem',
                top: '50%',
                transform: 'translateY(-50%)',
                color: colors.gray
              }} />
              <input
                type="text"
                placeholder="Search by name, parent, or phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem 0.75rem 3rem',
                  border: `2px solid ${colors.lightGray}`,
                  borderRadius: '0.5rem',
                  fontSize: '0.9rem',
                  backgroundColor: colors.white
                }}
              />
            </div>

            <select
              value={programFilter}
              onChange={(e) => setProgramFilter(e.target.value)}
              style={{
                padding: '0.75rem',
                border: `2px solid ${colors.lightGray}`,
                borderRadius: '0.5rem',
                fontSize: '0.85rem',
                backgroundColor: colors.white
              }}
            >
              <option value="">All Programs</option>
              {programs.map(program => (
                <option key={program} value={program}>{program}</option>
              ))}
            </select>

            <select
              value={levelFilter}
              onChange={(e) => setLevelFilter(e.target.value)}
              style={{
                padding: '0.75rem',
                border: `2px solid ${colors.lightGray}`,
                borderRadius: '0.5rem',
                fontSize: '0.85rem',
                backgroundColor: colors.white
              }}
            >
              <option value="">All Levels</option>
              {skillLevels.map(level => (
                <option key={level} value={level}>{level}</option>
              ))}
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{
                padding: '0.75rem',
                border: `2px solid ${colors.lightGray}`,
                borderRadius: '0.5rem',
                fontSize: '0.85rem',
                backgroundColor: colors.white
              }}
            >
              <option value="">All Status</option>
              {membershipStatus.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>

            <button
              onClick={() => {
                setSearchQuery('');
                setProgramFilter('');
                setLevelFilter('');
                setStatusFilter('');
                setPaymentFilter('');
              }}
              style={{
                padding: '0.75rem 1rem',
                backgroundColor: colors.lightGray,
                color: colors.gray,
                border: 'none',
                borderRadius: '0.5rem',
                cursor: 'pointer',
                fontSize: '0.8rem',
                fontWeight: '500'
              }}
            >
              Clear
            </button>
          </div>

          {/* Additional Filters Row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '1rem', marginTop: '1rem' }}>
            {user?.role === 'admin' && (
              <select
                value={paymentFilter}
                onChange={(e) => setPaymentFilter(e.target.value)}
                style={{
                  padding: '0.75rem',
                  border: `2px solid ${colors.lightGray}`,
                  borderRadius: '0.5rem',
                  fontSize: '0.85rem',
                  backgroundColor: colors.white
                }}
              >
                <option value="">All Payment Status</option>
                {paymentStatus.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            )}

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: colors.gray }}>
              Showing {filteredStudents.length} of {totalStudents} students
            </div>
          </div>
        </div>

        {/* Students Grid/List - Rest of the component remains the same... */}
        {filteredStudents.length === 0 ? (
          <div style={{
            backgroundColor: colors.white,
            borderRadius: '1rem',
            padding: '3rem',
            textAlign: 'center',
            boxShadow: '0 4px 6px rgba(0,0,0,0.05)'
          }}>
            <Users size={64} style={{ color: colors.gray, margin: '0 auto 1rem' }} />
            <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: colors.dark, marginBottom: '0.5rem' }}>
              {students.length === 0 ? 'No students yet' : 'No students match your filters'}
            </h3>
            <p style={{ color: colors.gray, marginBottom: '1.5rem' }}>
              {students.length === 0 
                ? 'Add your first student to get started with 21st-century skills education'
                : 'Try adjusting your search terms or filters'
              }
            </p>
            {students.length === 0 && user?.role === 'admin' && (
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                <button
                  onClick={createTestStudent}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.75rem 1.5rem',
                    backgroundColor: colors.secondary,
                    color: colors.dark,
                    border: 'none',
                    borderRadius: '0.5rem',
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                    fontWeight: '600'
                  }}
                >
                  🧪 Create Test Student
                </button>
                <button
                  onClick={() => setShowForm(true)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.75rem 1.5rem',
                    background: `linear-gradient(135deg, ${colors.secondary}, ${colors.primary})`,
                    color: colors.dark,
                    border: 'none',
                    borderRadius: '0.5rem',
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                    fontWeight: '600'
                  }}
                >
                  <Plus size={16} />
                  Add First Student
                </button>
              </div>
            )}
          </div>
        ) : (
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: viewMode === 'grid' ? 'repeat(auto-fill, minmax(420px, 1fr))' : '1fr', 
            gap: '1.5rem' 
          }}>
            {filteredStudents.map((student) => {
              const attendancePercentage = getAttendancePercentage(student.attendance);
              const hasOutstanding = student.paymentStatus === 'Outstanding' || student.paymentStatus === 'Overdue';
              const parentInfo = getParentInfo(student);
              
              return (
                <div
                  key={student._id}
                  style={{
                    backgroundColor: colors.white,
                    borderRadius: '1rem',
                    padding: '1.5rem',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
                    border: `2px solid ${colors.lightGray}`,
                    transition: 'all 0.2s',
                    opacity: student.isActive ? 1 : 0.7
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = `0 8px 25px ${colors.primary}20`;
                    e.currentTarget.style.borderColor = colors.primary;
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.05)';
                    e.currentTarget.style.borderColor = colors.lightGray;
                  }}
                >
                  {/* Enhanced Student Header */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1 }}>
                      <div style={{
                        width: '3rem',
                        height: '3rem',
                        borderRadius: '50%',
                        background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: colors.white,
                        fontSize: '1.125rem',
                        fontWeight: 'bold'
                      }}>
                        {student.name?.charAt(0)?.toUpperCase() || 'S'}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                          <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold', color: colors.dark, margin: 0 }}>
                            {student.name || 'Unnamed Student'}
                          </h3>
                          {student.membershipStatus === 'Member' ? (
                            <CheckCircle size={16} style={{ color: colors.success }} title="Member" />
                          ) : (
                            <UserX size={16} style={{ color: colors.gray }} title="Non-Member" />
                          )}
                          {hasOutstanding && user?.role === 'admin' && (
                            <AlertTriangle size={16} style={{ color: colors.warning }} title="Outstanding Payment" />
                          )}
                        </div>
                        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                          <div style={{
                            display: 'inline-block',
                            padding: '0.25rem 0.75rem',
                            backgroundColor: `${getStatusColor(student.membershipStatus)}20`,
                            color: getStatusColor(student.membershipStatus),
                            borderRadius: '1rem',
                            fontSize: '0.75rem',
                            fontWeight: '600'
                          }}>
                            {student.membershipStatus || 'Unknown'}
                          </div>
                          <span style={{ fontSize: '0.8rem', color: colors.gray }}>
                            Age {student.age}
                          </span>
                        </div>
                      </div>
                    </div>

                    {(user?.role === 'admin' || user?.role === 'tutor') && (
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                          onClick={() => openWhatsApp(parentInfo.phone, student.name)}
                          style={{
                            padding: '0.5rem',
                            backgroundColor: `${colors.success}20`,
                            border: `2px solid ${colors.success}`,
                            borderRadius: '0.5rem',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                          title="WhatsApp Parent"
                        >
                          <MessageCircle size={14} style={{ color: colors.success }} />
                        </button>
                        <button
                          onClick={() => handleEditStudent(student)}
                          style={{
                            padding: '0.5rem',
                            backgroundColor: `${colors.secondary}20`,
                            border: `2px solid ${colors.secondary}`,
                            borderRadius: '0.5rem',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          <Edit size={14} style={{ color: colors.secondary }} />
                        </button>
                        {user?.role === 'admin' && (
                          <button
                            onClick={() => handleDeleteStudent(student._id)}
                            style={{
                              padding: '0.5rem',
                              backgroundColor: '#fee2e2',
                              border: '2px solid #ef4444',
                              borderRadius: '0.5rem',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                          >
                            <Trash2 size={14} style={{ color: '#ef4444' }} />
                          </button>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Attendance Progress Bar */}
                  <div style={{ marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <span style={{ fontSize: '0.8rem', color: colors.gray, fontWeight: '500' }}>
                        Attendance: {student.attendance?.present || 0}/{student.attendance?.total || 0}
                      </span>
                      <span style={{ fontSize: '0.8rem', color: colors.gray, fontWeight: '600' }}>
                        {attendancePercentage}%
                      </span>
                    </div>
                    <div style={{
                      width: '100%',
                      height: '0.5rem',
                      backgroundColor: colors.lightGray,
                      borderRadius: '0.25rem',
                      overflow: 'hidden'
                    }}>
                      <div style={{
                        width: `${attendancePercentage}%`,
                        height: '100%',
                        backgroundColor: attendancePercentage >= 90 ? colors.success : attendancePercentage >= 70 ? colors.warning : colors.danger,
                        transition: 'width 0.3s ease'
                      }}></div>
                    </div>
                  </div>

                  {/* Parent Information (FIXED) */}
                  <div style={{ 
                    backgroundColor: colors.lightGray, 
                    padding: '1rem', 
                    borderRadius: '0.5rem',
                    marginBottom: '1rem'
                  }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <User size={14} style={{ color: colors.gray }} />
                        <span style={{ fontSize: '0.8rem', color: colors.dark, fontWeight: '500' }}>
                          {parentInfo.name}
                        </span>
                      </div>
                      
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Phone size={14} style={{ color: colors.gray }} />
                        <span style={{ fontSize: '0.8rem', color: colors.gray }}>
                          {parentInfo.phone}
                        </span>
                      </div>

                      {student.emergencyContact && typeof student.emergencyContact === 'string' && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <Heart size={14} style={{ color: colors.danger }} />
                          <span style={{ fontSize: '0.8rem', color: colors.gray }}>
                            Emergency: {student.emergencyContact}
                          </span>
                        </div>
                      )}
                      
                      {student.emergencyContact && typeof student.emergencyContact === 'object' && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <Heart size={14} style={{ color: colors.danger }} />
                          <span style={{ fontSize: '0.8rem', color: colors.gray }}>
                            Emergency: {student.emergencyContact.name} - {student.emergencyContact.phone}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Program Enrollments */}
                  {student.enrollments && student.enrollments.length > 0 && (
                    <div style={{ marginBottom: '1rem' }}>
                      <h4 style={{ fontSize: '0.9rem', fontWeight: '600', color: colors.dark, marginBottom: '0.5rem' }}>
                        📚 Enrolled Programs
                      </h4>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                        {student.enrollments.map((enrollment, index) => (
                          <div key={index} style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.25rem',
                            padding: '0.25rem 0.5rem',
                            backgroundColor: `${colors.info}20`,
                            color: colors.info,
                            borderRadius: '0.5rem',
                            fontSize: '0.75rem',
                            fontWeight: '500'
                          }}>
                            <BookOpen size={12} />
                            {enrollment.program} ({enrollment.level})
                            {(user?.role === 'admin' || user?.role === 'tutor') && enrollment.level !== 'Advanced' && (
                              <button
                                onClick={() => {
                                  const nextLevel = enrollment.level === 'Beginner' ? 'Intermediate' : 'Advanced';
                                  handleLevelTransfer(student, enrollment.program, nextLevel);
                                }}
                                style={{
                                  background: 'none',
                                  border: 'none',
                                  cursor: 'pointer',
                                  color: colors.info,
                                  padding: '0.125rem'
                                }}
                                title={`Promote to ${enrollment.level === 'Beginner' ? 'Intermediate' : 'Advanced'}`}
                              >
                                <ArrowUp size={10} />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Payment Status (Admin Only) */}
                  {user?.role === 'admin' && (
                    <div style={{ 
                      backgroundColor: hasOutstanding ? `${colors.warning}10` : `${colors.success}10`,
                      padding: '0.75rem', 
                      borderRadius: '0.5rem',
                      marginBottom: '1rem',
                      border: `1px solid ${hasOutstanding ? colors.warning : colors.success}30`
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <DollarSign size={14} style={{ color: hasOutstanding ? colors.warning : colors.success }} />
                          <span style={{ fontSize: '0.8rem', fontWeight: '500', color: colors.dark }}>
                            {student.paymentStatus || 'Unknown'}
                          </span>
                        </div>
                        {student.amountOwed > 0 && (
                          <span style={{ fontSize: '0.8rem', fontWeight: '600', color: colors.warning }}>
                            KSh {student.amountOwed.toLocaleString()} owed
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Academic Progress */}
                  {student.academicProgress && Object.keys(student.academicProgress).length > 0 && (
                    <div style={{ marginBottom: '1rem' }}>
                      <h4 style={{ fontSize: '0.9rem', fontWeight: '600', color: colors.dark, marginBottom: '0.5rem' }}>
                        🎯 Academic Progress
                      </h4>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.5rem' }}>
                        {Object.entries(student.academicProgress).map(([subject, progress]) => (
                          <div key={subject} style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: '0.5rem',
                            backgroundColor: colors.lightGray,
                            borderRadius: '0.375rem'
                          }}>
                            <span style={{ fontSize: '0.8rem', color: colors.dark, fontWeight: '500', textTransform: 'capitalize' }}>
                              {subject}
                            </span>
                            <div style={{
                              padding: '0.25rem 0.5rem',
                              backgroundColor: colors.white,
                              borderRadius: '0.25rem',
                              fontSize: '0.75rem',
                              fontWeight: '600',
                              color: colors.primary
                            }}>
                              {progress.grade}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Quick Action Buttons */}
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      onClick={() => {/* View detailed progress */}}
                      style={{
                        flex: 1,
                        padding: '0.5rem',
                        backgroundColor: `${colors.info}10`,
                        color: colors.info,
                        border: `1px solid ${colors.info}30`,
                        borderRadius: '0.375rem',
                        cursor: 'pointer',
                        fontSize: '0.75rem',
                        fontWeight: '500',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.25rem'
                      }}
                    >
                      <Eye size={12} />
                      Progress
                    </button>
                    
                    <button
                      onClick={() => openWhatsApp(parentInfo.phone, student.name)}
                      style={{
                        flex: 1,
                        padding: '0.5rem',
                        backgroundColor: `${colors.success}10`,
                        color: colors.success,
                        border: `1px solid ${colors.success}30`,
                        borderRadius: '0.375rem',
                        cursor: 'pointer',
                        fontSize: '0.75rem',
                        fontWeight: '500',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.25rem'
                      }}
                    >
                      <PhoneCall size={12} />
                      Contact
                    </button>

                    {(user?.role === 'admin' || user?.role === 'tutor') && (
                      <button
                        onClick={() => handleEditStudent(student)}
                        style={{
                          flex: 1,
                          padding: '0.5rem',
                          backgroundColor: `${colors.primary}10`,
                          color: colors.primary,
                          border: `1px solid ${colors.primary}30`,
                          borderRadius: '0.375rem',
                          cursor: 'pointer',
                          fontSize: '0.75rem',
                          fontWeight: '500',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '0.25rem'
                        }}
                      >
                        <Edit size={12} />
                        Edit
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Student Form Modal */}
        {showForm && (
          <StudentForm
            student={editingStudent}
            onClose={() => {
              setShowForm(false);
              setEditingStudent(null);
            }}
            onStudentSaved={handleStudentSaved}
          />
        )}
      </div>
    </div>
  );
};

export default StudentList;