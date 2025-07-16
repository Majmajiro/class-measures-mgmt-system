import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { resourcesAPI } from '../../services/api';
import ResourceForm from './ResourceForm';
import { toast } from 'react-hot-toast';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Book, 
  Monitor, 
  Package,
  FileText,
  Search,
  DollarSign,
  Users,
  Building,
  GraduationCap,
  AlertTriangle,
  TrendingUp,
  BarChart3,
  RefreshCw
} from 'lucide-react';

const ResourceList = () => {
  const [resources, setResources] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingResource, setEditingResource] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    type: '',
    language: '',
    publisher: ''
  });
  const { user } = useAuth();

  // Class Measures Brand Colors
  const colors = {
    primary: '#c55c5c',
    secondary: '#f4c842',
    dark: '#1e1e3c',
    white: '#ffffff',
    gray: '#6b7280',
    lightGray: '#f3f4f6'
  };

  // Resource type colors and icons
  const resourceTypes = {
    'Book': { 
      bg: '#dbeafe', 
      border: '#3b82f6', 
      icon: <Book size={20} />,
      color: '#3b82f6'
    },
    'Platform': { 
      bg: '#ecfdf5', 
      border: '#10b981', 
      icon: <Monitor size={20} />,
      color: '#10b981'
    },
    'Hardware': { 
      bg: '#fef3c7', 
      border: '#f59e0b', 
      icon: <Package size={20} />,
      color: '#f59e0b'
    },
    'Digital': { 
      bg: '#f3e8ff', 
      border: '#8b5cf6', 
      icon: <FileText size={20} />,
      color: '#8b5cf6'
    }
  };

  // Publisher colors
  const publisherColors = {
    // French Publishers
    'Hachette': { bg: '#fee2e2', border: '#dc2626', text: '#dc2626' },
    'Didier': { bg: '#fef3c7', border: '#d97706', text: '#d97706' },
    'CLE International': { bg: '#ecfdf5', border: '#059669', text: '#059669' },
    
    // English Publishers
    'Cambridge': { bg: '#dbeafe', border: '#2563eb', text: '#2563eb' },
    'Oxford': { bg: '#f3e8ff', border: '#7c3aed', text: '#7c3aed' },
    'Pearson': { bg: '#fce7f3', border: '#c026d3', text: '#c026d3' },
    'Brilliant': { bg: '#fff7ed', border: '#ea580c', text: '#ea580c' },
    'Unique Books': { bg: '#f0fdf4', border: '#16a34a', text: '#16a34a' },
    
    // Platforms
    'PurpleMash': { bg: '#f3e8ff', border: '#8b5cf6', text: '#8b5cf6' },
    'Scholastic Learning Zone': { bg: '#dbeafe', border: '#3b82f6', text: '#3b82f6' }
  };

  useEffect(() => {
    loadResources();
    loadAnalytics();
  }, [filters, searchQuery]);

  const loadResources = async () => {
    try {
      const params = {};
      if (searchQuery) params.q = searchQuery;
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params[key] = value;
      });
      
      const response = await resourcesAPI.getAll(params);
      console.log('Resources response:', response);
      
      // Fix: Handle both response.resources and response.data.resources
      const resourcesData = response.resources || response.data?.resources || [];
      setResources(resourcesData);
    } catch (error) {
      console.error('Error loading resources:', error);
      setResources([]);
    } finally {
      setLoading(false);
    }
  };

  const loadAnalytics = async () => {
    try {
      const response = await resourcesAPI.getAnalytics();
      console.log('Analytics response:', response);
      
      // Fix: Handle both response.summary and response.data.summary
      const analyticsData = response.summary || response.data?.summary || {
        totalResources: 0,
        typeBreakdown: [],
        languageBreakdown: [],
        publisherBreakdown: [],
        lowStockCount: 0,
        lowStockItems: [],
        inventoryValue: { totalCostValue: 0, totalRetailValue: 0 }
      };
      setAnalytics(analyticsData);
    } catch (error) {
      console.error('Error loading analytics:', error);
      setAnalytics({
        totalResources: 0,
        typeBreakdown: [],
        languageBreakdown: [],
        publisherBreakdown: [],
        lowStockCount: 0,
        lowStockItems: [],
        inventoryValue: { totalCostValue: 0, totalRetailValue: 0 }
      });
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this resource?')) {
      try {
        await resourcesAPI.delete(id);
        toast.success('Resource deleted successfully');
        loadResources();
        loadAnalytics();
      } catch (error) {
        toast.error('Failed to delete resource');
      }
    }
  };

  const handleEdit = (resource) => {
    setEditingResource(resource);
    setShowForm(true);
  };

  const handleAddNew = () => {
    setEditingResource(null);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingResource(null);
  };

  const handleResourceSaved = () => {
    loadResources();
    loadAnalytics();
    setShowForm(false);
    setEditingResource(null);
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      type: '',
      language: '',
      publisher: ''
    });
    setSearchQuery('');
  };

  const createTestResource = async () => {
    try {
      const response = await resourcesAPI.createTest();
      console.log('Test resource response:', response);
      
      if (response.resource || response.message) {
        toast.success('🧪 Test resource created successfully!');
        loadResources();
        loadAnalytics();
      } else {
        toast.error('Failed to create test resource');
      }
    } catch (error) {
      console.error('Test resource error:', error);
      toast.error('Failed to create test resource');
    }
  };

  const getPublisherName = (resource) => {
    if (resource.publisher?.frenchPublisher) return resource.publisher.frenchPublisher;
    if (resource.publisher?.englishPublisher) return resource.publisher.englishPublisher;
    if (resource.platformDetails?.platformName) return resource.platformDetails.platformName;
    return 'Unknown';
  };

  const getStockStatus = (resource) => {
    const available = resource.inventory?.available || 0;
    const minimum = resource.inventory?.minimumStock || 5;
    
    if (available === 0) return { status: 'Out of Stock', color: '#dc2626', bg: '#fee2e2' };
    if (available <= minimum) return { status: 'Low Stock', color: '#d97706', bg: '#fef3c7' };
    return { status: 'In Stock', color: '#059669', bg: '#ecfdf5' };
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
        <div style={{ 
          animation: 'spin 1s linear infinite', 
          borderRadius: '50%', 
          height: '2rem', 
          width: '2rem', 
          border: `2px solid ${colors.lightGray}`, 
          borderBottom: `2px solid ${colors.primary}` 
        }}></div>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem', backgroundColor: colors.lightGray, minHeight: '100vh', position: 'relative' }}>
      <div style={{ maxWidth: '1600px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: '2rem',
          padding: '1.5rem',
          backgroundColor: colors.white,
          borderRadius: '1rem',
          boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
          border: `2px solid ${colors.primary}20`
        }}>
          <div>
            <h1 style={{ 
              fontSize: '2rem', 
              fontWeight: 'bold', 
              color: colors.dark,
              marginBottom: '0.5rem'
            }}>
              📚 Resource Catalog Management
            </h1>
            <p style={{ color: colors.gray, fontSize: '1rem' }}>
              Complete inventory and catalog system for your educational business
            </p>
          </div>
          
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button
              onClick={() => {
                loadResources();
                loadAnalytics();
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1rem',
                backgroundColor: colors.lightGray,
                color: colors.gray,
                border: 'none',
                borderRadius: '0.5rem',
                cursor: 'pointer',
                fontSize: '0.875rem',
                fontWeight: '500'
              }}
            >
              <RefreshCw size={16} />
              Refresh
            </button>

            {user.role === 'admin' && (
              <button
                onClick={createTestResource}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.75rem 1rem',
                  backgroundColor: colors.secondary,
                  color: colors.dark,
                  border: 'none',
                  borderRadius: '0.5rem',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  fontWeight: '500'
                }}
              >
                🧪 Test Resource
              </button>
            )}
          </div>
        </div>

        {/* Prominent Add Resource Button Section */}
        {user.role === 'admin' && (
          <div style={{
            backgroundColor: colors.white,
            padding: '2rem',
            borderRadius: '1rem',
            marginBottom: '2rem',
            boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
            border: `3px solid ${colors.primary}30`,
            textAlign: 'center'
          }}>
            <h2 style={{ 
              fontSize: '1.5rem', 
              fontWeight: 'bold', 
              color: colors.dark, 
              marginBottom: '1rem' 
            }}>
              📚 Manage Your Resource Catalog
            </h2>
            <p style={{ 
              color: colors.gray, 
              fontSize: '1rem', 
              marginBottom: '2rem',
              maxWidth: '600px',
              margin: '0 auto 2rem'
            }}>
              Add books, platforms, and educational materials to your catalog. Set multi-tier pricing for schools, teachers, and students.
            </p>
            
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                onClick={handleAddNew}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '1.25rem 2rem',
                  background: `linear-gradient(135deg, ${colors.primary}, ${colors.dark})`,
                  color: colors.white,
                  border: 'none',
                  borderRadius: '1rem',
                  cursor: 'pointer',
                  fontSize: '1.125rem',
                  fontWeight: '700',
                  transition: 'all 0.3s',
                  boxShadow: `0 8px 25px ${colors.primary}40`,
                  minWidth: '200px'
                }}
                onMouseOver={(e) => {
                  e.target.style.transform = 'translateY(-3px)';
                  e.target.style.boxShadow = `0 12px 35px ${colors.primary}50`;
                }}
                onMouseOut={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = `0 8px 25px ${colors.primary}40`;
                }}
              >
                <Plus size={24} />
                Add New Resource
              </button>
              
              <button
                onClick={createTestResource}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '1.25rem 2rem',
                  background: `linear-gradient(135deg, ${colors.secondary}, #e6b800)`,
                  color: colors.dark,
                  border: 'none',
                  borderRadius: '1rem',
                  cursor: 'pointer',
                  fontSize: '1.125rem',
                  fontWeight: '700',
                  transition: 'all 0.3s',
                  boxShadow: `0 8px 25px ${colors.secondary}40`,
                  minWidth: '200px'
                }}
                onMouseOver={(e) => {
                  e.target.style.transform = 'translateY(-3px)';
                  e.target.style.boxShadow = `0 12px 35px ${colors.secondary}50`;
                }}
                onMouseOut={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = `0 8px 25px ${colors.secondary}40`;
                }}
              >
                🧪 Quick Sample
              </button>
            </div>
          </div>
        )}

        {/* Analytics Dashboard */}
        {analytics && (
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
            gap: '1.5rem',
            marginBottom: '2rem'
          }}>
            {/* Total Resources */}
            <div style={{
              backgroundColor: colors.white,
              padding: '1.5rem',
              borderRadius: '1rem',
              boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
              border: `2px solid ${colors.primary}20`
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                <div style={{
                  width: '3rem',
                  height: '3rem',
                  borderRadius: '0.75rem',
                  backgroundColor: `${colors.primary}15`,
                  border: `2px solid ${colors.primary}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <BarChart3 size={20} style={{ color: colors.primary }} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: '700', color: colors.dark, marginBottom: '0.25rem' }}>
                    Total Resources
                  </h3>
                  <p style={{ fontSize: '0.875rem', color: colors.gray }}>
                    Active catalog items
                  </p>
                </div>
              </div>
              <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: colors.primary }}>
                {analytics.totalResources}
              </div>
            </div>

            {/* Low Stock Alert */}
            <div style={{
              backgroundColor: colors.white,
              padding: '1.5rem',
              borderRadius: '1rem',
              boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
              border: `2px solid ${analytics.lowStockCount > 0 ? '#f59e0b' : '#10b981'}20`
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                <div style={{
                  width: '3rem',
                  height: '3rem',
                  borderRadius: '0.75rem',
                  backgroundColor: analytics.lowStockCount > 0 ? '#fef3c7' : '#ecfdf5',
                  border: `2px solid ${analytics.lowStockCount > 0 ? '#f59e0b' : '#10b981'}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <AlertTriangle size={20} style={{ color: analytics.lowStockCount > 0 ? '#f59e0b' : '#10b981' }} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: '700', color: colors.dark, marginBottom: '0.25rem' }}>
                    Stock Alerts
                  </h3>
                  <p style={{ fontSize: '0.875rem', color: colors.gray }}>
                    {analytics.lowStockCount > 0 ? 'Items need restocking' : 'All items in stock'}
                  </p>
                </div>
              </div>
              <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: analytics.lowStockCount > 0 ? '#f59e0b' : '#10b981' }}>
                {analytics.lowStockCount}
              </div>
            </div>

            {/* Inventory Value */}
            <div style={{
              backgroundColor: colors.white,
              padding: '1.5rem',
              borderRadius: '1rem',
              boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
              border: `2px solid ${colors.secondary}20`
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                <div style={{
                  width: '3rem',
                  height: '3rem',
                  borderRadius: '0.75rem',
                  backgroundColor: `${colors.secondary}15`,
                  border: `2px solid ${colors.secondary}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <TrendingUp size={20} style={{ color: colors.secondary }} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: '700', color: colors.dark, marginBottom: '0.25rem' }}>
                    Inventory Value
                  </h3>
                  <p style={{ fontSize: '0.875rem', color: colors.gray }}>
                    Total retail value
                  </p>
                </div>
              </div>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: colors.dark }}>
                KSh {analytics.inventoryValue?.totalRetailValue?.toLocaleString() || '0'}
              </div>
            </div>
          </div>
        )}

        {/* Search and Filters */}
        <div style={{
          backgroundColor: colors.white,
          padding: '1.5rem',
          borderRadius: '1rem',
          marginBottom: '2rem',
          boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <Search size={18} style={{ color: colors.gray }} />
            <h3 style={{ fontSize: '1rem', fontWeight: '600', color: colors.dark }}>
              Search & Filter Resources
            </h3>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr auto', gap: '1rem', alignItems: 'end' }}>
            {/* Search Input */}
            <div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: `2px solid ${colors.lightGray}`,
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem'
                }}
                placeholder="Search by name, series, category..."
              />
            </div>

            {/* Type Filter */}
            <div>
              <select
                value={filters.type}
                onChange={(e) => handleFilterChange('type', e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: `2px solid ${colors.lightGray}`,
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem',
                  backgroundColor: colors.white
                }}
              >
                <option value="">All Types</option>
                <option value="Book">Books</option>
                <option value="Platform">Platforms</option>
                <option value="Hardware">Hardware</option>
                <option value="Digital">Digital</option>
              </select>
            </div>

            {/* Language Filter */}
            <div>
              <select
                value={filters.language}
                onChange={(e) => handleFilterChange('language', e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: `2px solid ${colors.lightGray}`,
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem',
                  backgroundColor: colors.white
                }}
              >
                <option value="">All Languages</option>
                <option value="French">French</option>
                <option value="English">English</option>
                <option value="Swahili">Swahili</option>
                <option value="Multi-language">Multi-language</option>
              </select>
            </div>

            {/* Publisher Filter */}
            <div>
              <select
                value={filters.publisher}
                onChange={(e) => handleFilterChange('publisher', e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: `2px solid ${colors.lightGray}`,
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem',
                  backgroundColor: colors.white
                }}
              >
                <option value="">All Publishers</option>
                <optgroup label="French Publishers">
                  <option value="Hachette">Hachette</option>
                  <option value="Didier">Didier</option>
                  <option value="CLE International">CLE International</option>
                </optgroup>
                <optgroup label="English Publishers">
                  <option value="Cambridge">Cambridge</option>
                  <option value="Oxford">Oxford</option>
                  <option value="Pearson">Pearson</option>
                  <option value="Brilliant">Brilliant</option>
                </optgroup>
              </select>
            </div>

            {/* Clear Filters */}
            <div>
              <button
                onClick={clearFilters}
                style={{
                  padding: '0.75rem 1rem',
                  backgroundColor: colors.lightGray,
                  color: colors.gray,
                  border: 'none',
                  borderRadius: '0.5rem',
                  cursor: 'pointer',
                  fontSize: '0.8rem',
                  fontWeight: '500',
                  whiteSpace: 'nowrap'
                }}
              >
                Clear
              </button>
            </div>
          </div>
        </div>

        {/* Resources Grid */}
        {resources.length === 0 ? (
          <div style={{
            backgroundColor: colors.white,
            padding: '4rem 2rem',
            borderRadius: '1rem',
            boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
            textAlign: 'center'
          }}>
            <div style={{
              width: '80px',
              height: '80px',
              margin: '0 auto 1.5rem',
              borderRadius: '50%',
              backgroundColor: `${colors.secondary}20`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Book size={40} style={{ color: colors.primary }} />
            </div>
            
            <h3 style={{ 
              fontSize: '1.5rem', 
              fontWeight: '600', 
              color: colors.dark, 
              marginBottom: '0.5rem' 
            }}>
              {searchQuery || Object.values(filters).some(v => v) ? 'No resources match your criteria' : 'No resources yet'}
            </h3>
            
            <p style={{ color: colors.gray, fontSize: '1rem', marginBottom: '2rem' }}>
              {searchQuery || Object.values(filters).some(v => v) 
                ? 'Try adjusting your search terms or filters'
                : 'Start building your resource catalog with books, platforms, and materials'
              }
            </p>

            {user.role === 'admin' && (
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                <button
                  onClick={handleAddNew}
                  style={{
                    padding: '1rem 2rem',
                    backgroundColor: colors.primary,
                    color: colors.white,
                    border: 'none',
                    borderRadius: '0.75rem',
                    cursor: 'pointer',
                    fontSize: '1rem',
                    fontWeight: '600'
                  }}
                >
                  <Plus size={18} style={{ marginRight: '0.5rem' }} />
                  Add Your First Resource
                </button>
                <button
                  onClick={createTestResource}
                  style={{
                    padding: '1rem 2rem',
                    backgroundColor: colors.secondary,
                    color: colors.dark,
                    border: 'none',
                    borderRadius: '0.75rem',
                    cursor: 'pointer',
                    fontSize: '1rem',
                    fontWeight: '600'
                  }}
                >
                  🧪 Create Test Resource
                </button>
              </div>
            )}
          </div>
        ) : (
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(420px, 1fr))', 
            gap: '1.5rem' 
          }}>
            {resources.map((resource) => {
              const resourceType = resourceTypes[resource.type] || resourceTypes['Book'];
              const publisherName = getPublisherName(resource);
              const publisherStyle = publisherColors[publisherName] || { bg: colors.lightGray, border: colors.gray, text: colors.gray };
              const stockStatus = getStockStatus(resource);
              
              return (
                <div 
                  key={resource._id} 
                  style={{
                    backgroundColor: colors.white,
                    borderRadius: '1rem',
                    padding: '1.5rem',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
                    border: `2px solid ${resourceType.border}20`,
                    transition: 'all 0.2s',
                    position: 'relative'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = `0 8px 25px ${resourceType.border}20`;
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.05)';
                  }}
                >
                  {/* Stock Status Badge */}
                  <div style={{
                    position: 'absolute',
                    top: '1rem',
                    right: '1rem',
                    padding: '0.25rem 0.75rem',
                    backgroundColor: stockStatus.bg,
                    color: stockStatus.color,
                    borderRadius: '1rem',
                    fontSize: '0.7rem',
                    fontWeight: '600',
                    border: `1px solid ${stockStatus.color}30`
                  }}>
                    {stockStatus.status}
                  </div>

                  {/* Resource Header */}
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'flex-start', 
                    marginBottom: '1rem',
                    paddingBottom: '1rem',
                    borderBottom: `1px solid ${colors.lightGray}`,
                    paddingRight: '5rem'
                  }}>
                    <div style={{
                      width: '3rem',
                      height: '3rem',
                      borderRadius: '0.75rem',
                      backgroundColor: resourceType.bg,
                      border: `2px solid ${resourceType.border}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginRight: '1rem',
                      color: resourceType.color
                    }}>
                      {resourceType.icon}
                    </div>
                    <div style={{ flex: 1 }}>
                      <h3 style={{ 
                        fontSize: '1.125rem', 
                        fontWeight: '700', 
                        color: colors.dark,
                        marginBottom: '0.25rem',
                        lineHeight: '1.3'
                      }}>
                        {resource.name}
                      </h3>
                      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                        <span style={{
                          padding: '0.125rem 0.5rem',
                          backgroundColor: resourceType.bg,
                          color: resourceType.color,
                          borderRadius: '1rem',
                          fontSize: '0.7rem',
                          fontWeight: '600'
                        }}>
                          {resource.type}
                        </span>
                        <span style={{
                          padding: '0.125rem 0.5rem',
                          backgroundColor: `${colors.secondary}20`,
                          color: colors.dark,
                          borderRadius: '1rem',
                          fontSize: '0.7rem',
                          fontWeight: '500'
                        }}>
                          {resource.language}
                        </span>
                      </div>
                      
                      {/* Publisher */}
                      <div style={{
                        padding: '0.25rem 0.75rem',
                        backgroundColor: publisherStyle.bg,
                        color: publisherStyle.text,
                        border: `1px solid ${publisherStyle.border}30`,
                        borderRadius: '1rem',
                        fontSize: '0.75rem',
                        fontWeight: '600',
                        display: 'inline-block'
                      }}>
                        {publisherName}
                      </div>
                    </div>
                  </div>

                  {/* Resource Details */}
                  <div style={{ marginBottom: '1rem' }}>
                    {/* French Book Category */}
                    {resource.frenchBookCategory && (
                      <div style={{ marginBottom: '0.75rem' }}>
                        <span style={{ fontSize: '0.75rem', color: colors.gray, fontWeight: '500' }}>
                          Category
                        </span>
                        <p style={{ fontSize: '0.875rem', color: colors.dark, fontWeight: '600' }}>
                          {resource.frenchBookCategory}
                          {resource.practiceBookType && ` - ${resource.practiceBookType}`}
                        </p>
                      </div>
                    )}

                    {/* Academic Level */}
                    {resource.academicInfo?.frenchLevel && (
                      <div style={{ marginBottom: '0.75rem' }}>
                        <span style={{ fontSize: '0.75rem', color: colors.gray, fontWeight: '500' }}>
                          French Level
                        </span>
                        <p style={{ fontSize: '0.875rem', color: colors.dark, fontWeight: '600' }}>
                          {resource.academicInfo.frenchLevel}
                        </p>
                      </div>
                    )}

                    {/* Publisher Details */}
                    {resource.publisher?.series && (
                      <div style={{ marginBottom: '0.75rem' }}>
                        <span style={{ fontSize: '0.75rem', color: colors.gray, fontWeight: '500' }}>
                          Series & Level
                        </span>
                        <p style={{ fontSize: '0.875rem', color: colors.dark }}>
                          {resource.publisher.series} {resource.publisher.level && `(${resource.publisher.level})`}
                        </p>
                      </div>
                    )}

                    {/* Inventory Info */}
                    <div style={{ 
                      backgroundColor: colors.lightGray, 
                      padding: '0.75rem', 
                      borderRadius: '0.5rem',
                      marginBottom: '1rem'
                    }}>
                      <div style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        marginBottom: '0.5rem'
                      }}>
                        <span style={{ fontSize: '0.875rem', fontWeight: '600', color: colors.dark }}>
                          📦 Inventory
                        </span>
                        <span style={{ fontSize: '0.8rem', color: colors.gray }}>
                          Total: {resource.inventory?.totalStock || 0}
                        </span>
                      </div>
                      <div style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center'
                      }}>
                        <span style={{ fontSize: '0.8rem', color: colors.gray }}>
                          Available: {resource.inventory?.available || 0}
                        </span>
                        <span style={{ fontSize: '0.8rem', color: colors.gray }}>
                          Min: {resource.inventory?.minimumStock || 5}
                        </span>
                      </div>
                    </div>

                    {/* Pricing Tiers */}
                    <div style={{ 
                      backgroundColor: colors.lightGray, 
                      padding: '1rem', 
                      borderRadius: '0.5rem',
                      marginBottom: '1rem'
                    }}>
                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '0.5rem', 
                        marginBottom: '0.75rem' 
                      }}>
                        <DollarSign size={16} style={{ color: colors.primary }} />
                        <span style={{ fontSize: '0.875rem', fontWeight: '600', color: colors.dark }}>
                          Pricing Tiers (KSh)
                        </span>
                      </div>
                      
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem' }}>
                        {/* School Price */}
                        <div style={{ textAlign: 'center' }}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem', marginBottom: '0.25rem' }}>
                            <Building size={12} style={{ color: colors.primary }} />
                            <span style={{ fontSize: '0.7rem', color: colors.gray, fontWeight: '500' }}>Schools</span>
                          </div>
                          <span style={{ fontSize: '0.875rem', fontWeight: '700', color: colors.primary }}>
                            {resource.pricing?.schoolBulkPrice?.toLocaleString() || 'N/A'}
                          </span>
                        </div>

                        {/* Teacher Price */}
                        <div style={{ textAlign: 'center' }}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem', marginBottom: '0.25rem' }}>
                            <GraduationCap size={12} style={{ color: colors.secondary }} />
                            <span style={{ fontSize: '0.7rem', color: colors.gray, fontWeight: '500' }}>Teachers</span>
                          </div>
                          <span style={{ fontSize: '0.875rem', fontWeight: '700', color: '#d97706' }}>
                            {resource.pricing?.teacherDiscountPrice?.toLocaleString() || 'N/A'}
                          </span>
                        </div>

                        {/* Student Price */}
                        <div style={{ textAlign: 'center' }}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem', marginBottom: '0.25rem' }}>
                            <Users size={12} style={{ color: colors.dark }} />
                            <span style={{ fontSize: '0.7rem', color: colors.gray, fontWeight: '500' }}>Students</span>
                          </div>
                          <span style={{ fontSize: '0.875rem', fontWeight: '700', color: colors.dark }}>
                            {resource.pricing?.studentRetailPrice?.toLocaleString() || 'N/A'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  {user.role === 'admin' && (
                    <div style={{ 
                      display: 'flex', 
                      gap: '0.5rem', 
                      paddingTop: '1rem',
                      borderTop: `1px solid ${colors.lightGray}`
                    }}>
                      <button
                        onClick={() => handleEdit(resource)}
                        style={{
                          flex: 1,
                          padding: '0.5rem',
                          backgroundColor: `${colors.primary}10`,
                          color: colors.primary,
                          border: `1px solid ${colors.primary}30`,
                          borderRadius: '0.375rem',
                          cursor: 'pointer',
                          fontSize: '0.8rem',
                          fontWeight: '500',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '0.25rem'
                        }}
                      >
                        <Edit size={14} />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(resource._id)}
                        style={{
                          padding: '0.5rem',
                          backgroundColor: '#fee2e2',
                          color: '#dc2626',
                          border: '1px solid #fecaca',
                          borderRadius: '0.375rem',
                          cursor: 'pointer',
                          fontSize: '0.8rem',
                          fontWeight: '500',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Resource Form Modal */}
        {showForm && (
          <ResourceForm
            resource={editingResource}
            onClose={handleFormClose}
            onResourceSaved={handleResourceSaved}
          />
        )}
      </div>

      {/* Floating Action Button for Mobile/Quick Access */}
      {user.role === 'admin' && (
        <button
          onClick={handleAddNew}
          style={{
            position: 'fixed',
            bottom: '2rem',
            right: '2rem',
            width: '4rem',
            height: '4rem',
            borderRadius: '50%',
            background: `linear-gradient(135deg, ${colors.primary}, ${colors.dark})`,
            color: colors.white,
            border: 'none',
            cursor: 'pointer',
            fontSize: '1.5rem',
            fontWeight: '600',
            boxShadow: `0 8px 25px ${colors.primary}50`,
            transition: 'all 0.3s',
            zIndex: 1000
          }}
          onMouseOver={(e) => {
            e.target.style.transform = 'scale(1.1)';
            e.target.style.boxShadow = `0 12px 35px ${colors.primary}60`;
          }}
          onMouseOut={(e) => {
            e.target.style.transform = 'scale(1)';
            e.target.style.boxShadow = `0 8px 25px ${colors.primary}50`;
          }}
          title="Add New Resource"
        >
          <Plus size={24} />
        </button>
      )}
    </div>
  );
};

export default ResourceList;
