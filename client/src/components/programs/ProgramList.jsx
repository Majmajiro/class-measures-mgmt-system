import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { programsAPI, dataUtils } from '../../services/api';
import ProgramForm from './ProgramForm';
import { toast } from 'react-hot-toast';
import { 
  BookOpen, Plus, Edit, Trash2, Users, RefreshCw, Search, Clock, DollarSign, Target,
  Filter, Download, Copy, Eye, ToggleLeft, ToggleRight, ChevronDown, ChevronUp,
  Grid, List, User, Calendar, TrendingUp, Award, Globe, Zap, Database
} from 'lucide-react';

const ProgramList = () => {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProgram, setEditingProgram] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [instructorFilter, setInstructorFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [ageGroupFilter, setAgeGroupFilter] = useState('');
  const [priceRangeFilter, setPriceRangeFilter] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // grid or list
  const [showStats, setShowStats] = useState(true);
  const [showRevenue, setShowRevenue] = useState(false);
  const { user } = useAuth();

  const colors = {
    primary: '#c55c5c',
    secondary: '#f4c842',
    dark: '#1e1e3c',
    white: '#ffffff',
    gray: '#6b7280',
    lightGray: '#f3f4f6',
    success: '#10b981',
    warning: '#f59e0b',
    danger: '#ef4444',
    info: '#3b82f6'
  };

  // Your actual program categories
  const programCategories = ['Coding', 'Robotics', 'Chess', 'Reading', 'French Classes', 'Entrepreneurship'];
  const ageGroups = ['Kids (6-10)', 'Tweens (11-13)', 'Teens (14-17)', 'All Ages'];
  const priceRanges = ['Budget (KSh 3,000-4,500)', 'Standard (KSh 4,500-6,000)', 'Premium (KSh 6,000-7,500)'];

  // Load programs from API
  const loadPrograms = async (showRefreshIndicator = false) => {
    try {
      if (showRefreshIndicator) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      
      console.log('🔄 Loading programs...');
      const response = await programsAPI.getAll();
      console.log('📥 Programs API response:', response);
      
      // Handle different response structures
      let programsData = [];
      if (response.programs) {
        programsData = response.programs;
      } else if (response.data && response.data.programs) {
        programsData = response.data.programs;
      } else if (Array.isArray(response)) {
        programsData = response;
      } else if (response.data && Array.isArray(response.data)) {
        programsData = response.data;
      }
      
      console.log('🎯 Final programsData to set:', programsData);
      setPrograms(programsData);
      
    } catch (error) {
      console.error('❌ Error loading programs:', error);
      toast.error('Failed to load programs');
      setPrograms([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadPrograms();
  }, []);

  // Handle successful program save
  const handleProgramSaved = () => {
    setShowForm(false);
    setEditingProgram(null);
    loadPrograms(true);
  };

  // Handle edit program
  const handleEditProgram = (program) => {
    setEditingProgram(program);
    setShowForm(true);
  };

  // Handle delete program
  const handleDeleteProgram = async (programId) => {
    if (!window.confirm('Are you sure you want to delete this program?')) {
      return;
    }

    try {
      await programsAPI.delete(programId);
      toast.success('🗑️ Program deleted successfully!');
      loadPrograms(true);
    } catch (error) {
      console.error('Error deleting program:', error);
      toast.error('Failed to delete program');
    }
  };

  // Duplicate program
  const handleDuplicateProgram = async (program) => {
    try {
      const duplicatedProgram = {
        name: `${program.name} (Copy)`,
        description: program.description,
        category: program.category,
        duration: program.duration,
        price: program.price,
        maxStudents: program.maxStudents,
        currentEnrollment: 0, // Start with no enrollments
        ageRange: program.ageRange,
        schedule: program.schedule,
        instructor: program.instructor,
        prerequisites: program.prerequisites,
        objectives: program.objectives,
        materials: program.materials,
        isActive: false // Start as inactive
      };
      
      console.log('📋 Duplicating program:', duplicatedProgram);
      const response = await programsAPI.create(duplicatedProgram);
      console.log('📥 Duplicate program response:', response);
      
      if (response.program || response.message) {
        toast.success('📋 Program duplicated successfully!');
        loadPrograms(true);
      }
    } catch (error) {
      console.error('Error duplicating program:', error);
      toast.error('Failed to duplicate program');
    }
  };

  // Toggle program status
  const toggleProgramStatus = async (program) => {
    try {
      const updatedProgram = { 
        ...program, 
        isActive: !program.isActive,
        updatedAt: new Date().toISOString()
      };
      
      console.log('🔄 Toggling program status:', updatedProgram);
      await programsAPI.update(program._id, updatedProgram);
      toast.success(`Program ${updatedProgram.isActive ? 'activated' : 'deactivated'}!`);
      loadPrograms(true);
    } catch (error) {
      console.error('Error toggling status:', error);
      toast.error('Failed to update program status');
    }
  };

  // Initialize sample data for quick start
  const initializeSampleData = () => {
    try {
      dataUtils.initializeSampleData();
      toast.success('🎯 Sample data initialized! Refresh to see changes.');
      setTimeout(() => {
        loadPrograms(true);
      }, 1000);
    } catch (error) {
      console.error('Error initializing sample data:', error);
      toast.error('Failed to initialize sample data');
    }
  };

  // Create test program with realistic data
  const createTestProgram = async () => {
    try {
      const actualPrograms = [
        {
          name: 'Coding Fundamentals',
          description: 'Learn programming basics with Python and JavaScript. Perfect for beginners who want to start their coding journey.',
          category: 'Coding',
          duration: '3 months',
          price: 8000,
          maxStudents: 15,
          currentEnrollment: Math.floor(Math.random() * 15),
          ageRange: { min: 10, max: 16 },
          schedule: { days: ['Tuesday', 'Thursday'], time: '4:00 PM - 6:00 PM' },
          instructor: 'Mr. Kiprotich',
          prerequisites: 'Basic computer skills',
          objectives: ['Learn Python basics', 'Build simple applications', 'Understand programming logic'],
          materials: ['Laptop', 'Coding workbook', 'Online platform access'],
          isActive: true
        },
        {
          name: 'Chess Mastery',
          description: 'Strategic thinking through chess. Learn tactics, openings, and endgames while developing critical thinking skills.',
          category: 'Chess',
          duration: '6 weeks',
          price: 3500,
          maxStudents: 12,
          currentEnrollment: Math.floor(Math.random() * 12),
          ageRange: { min: 7, max: 15 },
          schedule: { days: ['Wednesday', 'Saturday'], time: '2:00 PM - 3:30 PM' },
          instructor: 'Ms. Wanjiku',
          prerequisites: 'None - beginners welcome',
          objectives: ['Master basic moves', 'Learn chess tactics', 'Play competitive games'],
          materials: ['Chess set', 'Chess notation book', 'Tournament board'],
          isActive: true
        },
        {
          name: 'Robotics Workshop',
          description: 'Build and program robots! Hands-on STEM learning with LEGO Mindstorms and Arduino platforms.',
          category: 'Robotics',
          duration: '4 months',
          price: 12000,
          maxStudents: 10,
          currentEnrollment: Math.floor(Math.random() * 10),
          ageRange: { min: 9, max: 14 },
          schedule: { days: ['Friday', 'Saturday'], time: '10:00 AM - 12:00 PM' },
          instructor: 'Eng. Mwangi',
          prerequisites: 'Interest in technology',
          objectives: ['Build working robots', 'Learn basic programming', 'Understand engineering principles'],
          materials: ['LEGO Mindstorms kit', 'Arduino board', 'Sensors and motors'],
          isActive: true
        },
        {
          name: 'French Classes',
          description: 'Bonjour! Learn French language and culture. From basic conversations to advanced grammar.',
          category: 'French Classes',
          duration: '6 months',
          price: 6000,
          maxStudents: 18,
          currentEnrollment: Math.floor(Math.random() * 18),
          ageRange: { min: 8, max: 16 },
          schedule: { days: ['Monday', 'Wednesday', 'Friday'], time: '3:00 PM - 4:30 PM' },
          instructor: 'Mme. Akinyi',
          prerequisites: 'None - all levels welcome',
          objectives: ['Basic conversation skills', 'French grammar', 'Cultural understanding'],
          materials: ['French textbook', 'Audio CDs', 'Workbook exercises'],
          isActive: true
        },
        {
          name: 'Reading Comprehension',
          description: 'Improve reading skills and comprehension. Build vocabulary and critical thinking through literature.',
          category: 'Reading',
          duration: '3 months',
          price: 4500,
          maxStudents: 20,
          currentEnrollment: Math.floor(Math.random() * 20),
          ageRange: { min: 6, max: 12 },
          schedule: { days: ['Tuesday', 'Thursday'], time: '2:00 PM - 3:30 PM' },
          instructor: 'Mrs. Njeri',
          prerequisites: 'Basic reading ability',
          objectives: ['Improve reading speed', 'Enhance comprehension', 'Build vocabulary'],
          materials: ['Reading books', 'Comprehension worksheets', 'Vocabulary cards'],
          isActive: true
        },
        {
          name: 'Young Entrepreneurs',
          description: 'Learn business basics and entrepreneurial thinking. Develop ideas and create simple business plans.',
          category: 'Entrepreneurship',
          duration: '2 months',
          price: 5500,
          maxStudents: 16,
          currentEnrollment: Math.floor(Math.random() * 16),
          ageRange: { min: 12, max: 17 },
          schedule: { days: ['Wednesday', 'Saturday'], time: '1:00 PM - 3:00 PM' },
          instructor: 'Mr. Otieno',
          prerequisites: 'Interest in business',
          objectives: ['Understand business basics', 'Create business ideas', 'Learn financial literacy'],
          materials: ['Business planning workbook', 'Calculator', 'Presentation materials'],
          isActive: true
        }
      ];

      const randomProgram = actualPrograms[Math.floor(Math.random() * actualPrograms.length)];
      
      const testProgramData = {
        ...randomProgram,
        name: `${randomProgram.name} - ${new Date().toLocaleDateString()}`,
      };

      console.log('🧪 Creating test program:', testProgramData);
      const response = await programsAPI.create(testProgramData);
      console.log('📥 Test program response:', response);
      
      if (response.program || response.message) {
        toast.success('🧪 Test program created successfully!');
        loadPrograms(true);
      } else {
        toast.error('Failed to create test program');
      }
    } catch (error) {
      console.error('Test program error:', error);
      toast.error('Failed to create test program');
    }
  };

  // Get category color
  const getCategoryColor = (category) => {
    switch (category?.toLowerCase()) {
      case 'coding': return '#3b82f6';
      case 'robotics': return '#8b5cf6';
      case 'chess': return '#ef4444';
      case 'reading': return '#10b981';
      case 'french classes': return '#f59e0b';
      case 'entrepreneurship': return '#06b6d4';
      default: return colors.primary;
    }
  };

  // Get status color
  const getStatusColor = (isActive) => {
    return isActive ? colors.success : colors.gray;
  };

  // Get enrollment percentage
  const getEnrollmentPercentage = (current, max) => {
    if (!max || max === 0) return 0;
    return Math.min(Math.round((current / max) * 100), 100);
  };

  // Get unique instructors for filter
  const uniqueInstructors = [...new Set(programs.map(p => p.instructor).filter(Boolean))];

  // Filter programs
  const filteredPrograms = programs.filter(program => {
    const matchesSearch = !searchQuery || 
      program.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      program.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      program.instructor?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = !categoryFilter || program.category === categoryFilter;
    const matchesInstructor = !instructorFilter || program.instructor === instructorFilter;
    const matchesStatus = !statusFilter || 
      (statusFilter === 'active' && program.isActive) ||
      (statusFilter === 'inactive' && !program.isActive) ||
      (statusFilter === 'full' && program.currentEnrollment >= program.maxStudents) ||
      (statusFilter === 'available' && program.currentEnrollment < program.maxStudents);
    
    const matchesAge = !ageGroupFilter || 
      (ageGroupFilter === 'Kids (6-10)' && program.ageRange?.min <= 10) ||
      (ageGroupFilter === 'Tweens (11-13)' && program.ageRange?.min <= 13 && program.ageRange?.max >= 11) ||
      (ageGroupFilter === 'Teens (14-17)' && program.ageRange?.max >= 14) ||
      (ageGroupFilter === 'All Ages');
    
    const matchesPrice = !priceRangeFilter ||
      (priceRangeFilter === 'Budget (KSh 3,000-4,500)' && program.price <= 4500) ||
      (priceRangeFilter === 'Standard (KSh 4,500-6,000)' && program.price > 4500 && program.price <= 6000) ||
      (priceRangeFilter === 'Premium (KSh 6,000-7,500)' && program.price > 6000);
    
    return matchesSearch && matchesCategory && matchesInstructor && matchesStatus && matchesAge && matchesPrice;
  });

  // Calculate stats
  const totalPrograms = programs.length;
  const activePrograms = programs.filter(p => p.isActive).length;
  const totalEnrollment = programs.reduce((sum, p) => sum + (p.currentEnrollment || 0), 0);
  const totalCapacity = programs.reduce((sum, p) => sum + (p.maxStudents || 0), 0);
  const totalRevenue = programs.reduce((sum, p) => sum + ((p.price || 0) * (p.currentEnrollment || 0)), 0);
  const averagePrice = totalPrograms > 0 ? Math.round(programs.reduce((sum, p) => sum + (p.price || 0), 0) / totalPrograms) : 0;

  // Export programs data (admin only)
  const exportPrograms = () => {
    if (user.role !== 'admin') {
      toast.error('Only administrators can export data');
      return;
    }
    
    const csvContent = "data:text/csv;charset=utf-8," + 
      "Program Name,Category,Instructor,Price,Enrollment,Capacity,Status\n" +
      programs.map(p => 
        `"${p.name}","${p.category}","${p.instructor}","${p.price}","${p.currentEnrollment || 0}","${p.maxStudents}","${p.isActive ? 'Active' : 'Inactive'}"`
      ).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `programs_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success('Programs data exported successfully!');
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
          <p style={{ color: colors.gray }}>Loading programs...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem', backgroundColor: colors.lightGray, minHeight: '100vh' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        
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
                🎓 Programs Management
              </h2>
              <p style={{ color: colors.gray, fontSize: '0.9rem', margin: '0.25rem 0 0 0' }}>
                Manage your educational programs and track enrollment
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
              {user.role === 'admin' && (
                <button
                  onClick={exportPrograms}
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
                onClick={createTestProgram}
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

              {/* Initialize Sample Data Button (if no programs exist) */}
              {totalPrograms === 0 && (
                <button
                  onClick={initializeSampleData}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.5rem 1rem',
                    backgroundColor: `${colors.info}20`,
                    color: colors.info,
                    border: `2px solid ${colors.info}`,
                    borderRadius: '0.5rem',
                    cursor: 'pointer',
                    fontSize: '0.8rem',
                    fontWeight: '500'
                  }}
                >
                  <Database size={14} />
                  Quick Start
                </button>
              )}
              
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
                Add Program
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
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '2rem', fontWeight: 'bold', color: colors.primary }}>{totalPrograms}</div>
                  <div style={{ fontSize: '0.85rem', color: colors.gray }}>Total Programs</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '2rem', fontWeight: 'bold', color: colors.success }}>{activePrograms}</div>
                  <div style={{ fontSize: '0.85rem', color: colors.gray }}>Active Programs</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '2rem', fontWeight: 'bold', color: colors.info }}>{totalEnrollment}</div>
                  <div style={{ fontSize: '0.85rem', color: colors.gray }}>Total Enrollment</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '2rem', fontWeight: 'bold', color: colors.warning }}>{Math.round((totalEnrollment/totalCapacity)*100) || 0}%</div>
                  <div style={{ fontSize: '0.85rem', color: colors.gray }}>Capacity Used</div>
                </div>
              </div>

              {/* Revenue Section (Collapsible) */}
              {user.role === 'admin' && (
                <div>
                  <button
                    onClick={() => setShowRevenue(!showRevenue)}
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
                    {showRevenue ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    Revenue Analytics
                  </button>
                  
                  {showRevenue && (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginTop: '1rem', paddingTop: '1rem', borderTop: `1px solid ${colors.gray}30` }}>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: colors.success }}>KSh {totalRevenue.toLocaleString()}</div>
                        <div style={{ fontSize: '0.85rem', color: colors.gray }}>Total Revenue</div>
                      </div>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: colors.info }}>KSh {averagePrice.toLocaleString()}</div>
                        <div style={{ fontSize: '0.85rem', color: colors.gray }}>Average Price</div>
                      </div>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: colors.warning }}>{uniqueInstructors.length}</div>
                        <div style={{ fontSize: '0.85rem', color: colors.gray }}>Active Instructors</div>
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
                placeholder="Search programs..."
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
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              style={{
                padding: '0.75rem',
                border: `2px solid ${colors.lightGray}`,
                borderRadius: '0.5rem',
                fontSize: '0.85rem',
                backgroundColor: colors.white
              }}
            >
              <option value="">All Categories</option>
              {programCategories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>

            <select
              value={instructorFilter}
              onChange={(e) => setInstructorFilter(e.target.value)}
              style={{
                padding: '0.75rem',
                border: `2px solid ${colors.lightGray}`,
                borderRadius: '0.5rem',
                fontSize: '0.85rem',
                backgroundColor: colors.white
              }}
            >
              <option value="">All Instructors</option>
              {uniqueInstructors.map(instructor => (
                <option key={instructor} value={instructor}>{instructor}</option>
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
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="full">Full</option>
              <option value="available">Available</option>
            </select>

            <button
              onClick={() => {
                setSearchQuery('');
                setCategoryFilter('');
                setInstructorFilter('');
                setStatusFilter('');
                setAgeGroupFilter('');
                setPriceRangeFilter('');
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
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '1rem', marginTop: '1rem' }}>
            <select
              value={ageGroupFilter}
              onChange={(e) => setAgeGroupFilter(e.target.value)}
              style={{
                padding: '0.75rem',
                border: `2px solid ${colors.lightGray}`,
                borderRadius: '0.5rem',
                fontSize: '0.85rem',
                backgroundColor: colors.white
              }}
            >
              <option value="">All Age Groups</option>
              {ageGroups.map(age => (
                <option key={age} value={age}>{age}</option>
              ))}
            </select>

            <select
              value={priceRangeFilter}
              onChange={(e) => setPriceRangeFilter(e.target.value)}
              style={{
                padding: '0.75rem',
                border: `2px solid ${colors.lightGray}`,
                borderRadius: '0.5rem',
                fontSize: '0.85rem',
                backgroundColor: colors.white
              }}
            >
              <option value="">All Price Ranges</option>
              {priceRanges.map(range => (
                <option key={range} value={range}>{range}</option>
              ))}
            </select>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: colors.gray }}>
              Showing {filteredPrograms.length} of {totalPrograms} programs
            </div>
          </div>
        </div>

        {/* Programs Grid/List */}
        {filteredPrograms.length === 0 ? (
          <div style={{
            backgroundColor: colors.white,
            borderRadius: '1rem',
            padding: '3rem',
            textAlign: 'center',
            boxShadow: '0 4px 6px rgba(0,0,0,0.05)'
          }}>
            <BookOpen size={64} style={{ color: colors.gray, margin: '0 auto 1rem' }} />
            <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: colors.dark, marginBottom: '0.5rem' }}>
              {programs.length === 0 ? 'No programs yet' : 'No programs match your filters'}
            </h3>
            <p style={{ color: colors.gray, marginBottom: '1.5rem' }}>
              {programs.length === 0 
                ? 'Add your first educational program to get started'
                : 'Try adjusting your search terms or filters'
              }
            </p>
            {programs.length === 0 && user.role === 'admin' && (
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                <button
                  onClick={initializeSampleData}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.75rem 1.5rem',
                    backgroundColor: colors.info,
                    color: colors.white,
                    border: 'none',
                    borderRadius: '0.5rem',
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                    fontWeight: '600'
                  }}
                >
                  <Database size={16} />
                  Quick Start with Sample Data
                </button>
                <button
                  onClick={createTestProgram}
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
                  🧪 Create Test Program
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
                  Add First Program
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
            {filteredPrograms.map((program) => {
              const enrollmentPercentage = getEnrollmentPercentage(program.currentEnrollment || 0, program.maxStudents);
              const isFull = enrollmentPercentage >= 100;
              
              return (
                <div
                  key={program._id}
                  style={{
                    backgroundColor: colors.white,
                    borderRadius: '1rem',
                    padding: '1.5rem',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
                    border: `2px solid ${colors.lightGray}`,
                    transition: 'all 0.2s',
                    opacity: program.isActive ? 1 : 0.7
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = `0 8px 25px ${getCategoryColor(program.category)}20`;
                    e.currentTarget.style.borderColor = getCategoryColor(program.category);
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.05)';
                    e.currentTarget.style.borderColor = colors.lightGray;
                  }}
                >
                  {/* Enhanced Program Header */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1 }}>
                      <div style={{
                        width: '3rem',
                        height: '3rem',
                        borderRadius: '0.75rem',
                        background: `linear-gradient(135deg, ${getCategoryColor(program.category)}, ${colors.secondary})`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: colors.white,
                        fontSize: '1.125rem',
                        fontWeight: 'bold'
                      }}>
                        {program.name?.charAt(0)?.toUpperCase() || 'P'}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                          <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold', color: colors.dark, margin: 0 }}>
                            {program.name || 'Unnamed Program'}
                          </h3>
                          {program.isActive ? (
                            <ToggleRight size={16} style={{ color: colors.success }} title="Active" />
                          ) : (
                            <ToggleLeft size={16} style={{ color: colors.gray }} title="Inactive" />
                          )}
                        </div>
                        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                          <div style={{
                            display: 'inline-block',
                            padding: '0.25rem 0.75rem',
                            backgroundColor: `${getCategoryColor(program.category)}20`,
                            color: getCategoryColor(program.category),
                            borderRadius: '1rem',
                            fontSize: '0.75rem',
                            fontWeight: '600'
                          }}>
                            {program.category || 'General'}
                          </div>
                          {isFull && (
                            <div style={{
                              padding: '0.25rem 0.5rem',
                              backgroundColor: `${colors.danger}20`,
                              color: colors.danger,
                              borderRadius: '1rem',
                              fontSize: '0.7rem',
                              fontWeight: '600'
                            }}>
                              FULL
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {user.role === 'admin' && (
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                          onClick={() => toggleProgramStatus(program)}
                          style={{
                            padding: '0.5rem',
                            backgroundColor: program.isActive ? `${colors.success}20` : `${colors.gray}20`,
                            border: `2px solid ${program.isActive ? colors.success : colors.gray}`,
                            borderRadius: '0.5rem',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                          title={program.isActive ? 'Deactivate' : 'Activate'}
                        >
                          {program.isActive ? 
                            <ToggleRight size={14} style={{ color: colors.success }} /> :
                            <ToggleLeft size={14} style={{ color: colors.gray }} />
                          }
                        </button>
                        <button
                          onClick={() => handleDuplicateProgram(program)}
                          style={{
                            padding: '0.5rem',
                            backgroundColor: `${colors.info}20`,
                            border: `2px solid ${colors.info}`,
                            borderRadius: '0.5rem',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                          title="Duplicate Program"
                        >
                          <Copy size={14} style={{ color: colors.info }} />
                        </button>
                        <button
                          onClick={() => handleEditProgram(program)}
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
                        <button
                          onClick={() => handleDeleteProgram(program._id)}
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
                      </div>
                    )}
                  </div>

                  {/* Enrollment Progress Bar */}
                  <div style={{ marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <span style={{ fontSize: '0.8rem', color: colors.gray, fontWeight: '500' }}>
                        Enrollment: {program.currentEnrollment || 0}/{program.maxStudents} students
                      </span>
                      <span style={{ fontSize: '0.8rem', color: colors.gray, fontWeight: '600' }}>
                        {enrollmentPercentage}%
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
                        width: `${enrollmentPercentage}%`,
                        height: '100%',
                        backgroundColor: isFull ? colors.danger : enrollmentPercentage > 80 ? colors.warning : colors.success,
                        transition: 'width 0.3s ease'
                      }}></div>
                    </div>
                  </div>

                  {/* Program Description */}
                  {program.description && (
                    <p style={{ 
                      fontSize: '0.875rem', 
                      color: colors.gray, 
                      marginBottom: '1rem',
                      lineHeight: '1.4'
                    }}>
                      {program.description.length > 120 
                        ? `${program.description.substring(0, 120)}...` 
                        : program.description
                      }
                    </p>
                  )}

                  {/* Enhanced Program Details */}
                  <div style={{ 
                    backgroundColor: colors.lightGray, 
                    padding: '1rem', 
                    borderRadius: '0.5rem',
                    marginBottom: '1rem'
                  }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                      {program.duration && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <Clock size={14} style={{ color: colors.gray }} />
                          <span style={{ fontSize: '0.8rem', color: colors.gray }}>
                            {program.duration}
                          </span>
                        </div>
                      )}
                      
                      {program.price && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <DollarSign size={14} style={{ color: colors.gray }} />
                          <span style={{ fontSize: '0.8rem', color: colors.gray }}>
                            KSh {program.price.toLocaleString()}
                          </span>
                        </div>
                      )}

                      {program.ageRange && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <Target size={14} style={{ color: colors.gray }} />
                          <span style={{ fontSize: '0.8rem', color: colors.gray }}>
                            Ages {program.ageRange.min}-{program.ageRange.max}
                          </span>
                        </div>
                      )}

                      {program.instructor && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <User size={14} style={{ color: colors.gray }} />
                          <span style={{ fontSize: '0.8rem', color: colors.gray }}>
                            {program.instructor}
                          </span>
                        </div>
                      )}
                    </div>
                    
                    {/* Schedule */}
                    {program.schedule && (
                      <div style={{ marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: `1px solid ${colors.gray}30` }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <Calendar size={14} style={{ color: colors.gray }} />
                          <span style={{ fontSize: '0.8rem', color: colors.gray }}>
                            {program.schedule.days?.join(', ')} • {program.schedule.time}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Quick Action Buttons */}
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      onClick={() => {/* View enrolled students */}}
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
                      View Students
                    </button>
                    
                    {user.role === 'admin' && (
                      <>
                        <button
                          onClick={() => handleEditProgram(program)}
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
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Program Form Modal */}
        {showForm && (
          <ProgramForm
            program={editingProgram}
            onClose={() => {
              setShowForm(false);
              setEditingProgram(null);
            }}
            onProgramSaved={handleProgramSaved}
          />
        )}
      </div>
    </div>
  );
};

export default ProgramList;