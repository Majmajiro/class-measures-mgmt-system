import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { resourcesAPI } from '../../services/api';
import ResourceForm from './ResourceForm';
import { toast } from 'react-hot-toast';
import { 
  BookOpen, Plus, Edit, Trash2, Search, Filter, Download, Upload, Eye, Share2,
  FileText, Video, Image, Music, Archive, Link, Folder, FolderOpen, Star,
  Grid, List, ChevronDown, ChevronUp, User, Clock, TrendingUp, BarChart3,
  RefreshCw, Copy, ExternalLink, Play, Pause, Heart, Tag, Globe, Lock,
  Users, Calendar, Target, Award, Zap, Activity, FileImage, FileVideo,
  FilePlus, FolderPlus, HardDrive, CloudDownload, Bookmark, BookmarkPlus
} from 'lucide-react';

const ResourceList = () => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingResource, setEditingResource] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [levelFilter, setLevelFilter] = useState('');
  const [accessFilter, setAccessFilter] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // grid, list, folder
  const [showStats, setShowStats] = useState(true);
  const [showUsageStats, setShowUsageStats] = useState(false);
  const [favorites, setFavorites] = useState([]);
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

  // Resource configuration
  const programs = ['Coding', 'Robotics', 'Chess', 'Reading', 'French Classes', 'Entrepreneurship', 'General'];
  const resourceTypes = ['Document', 'Video', 'Audio', 'Image', 'Interactive', 'Link', 'Archive', 'Worksheet', 'Assessment'];
  const skillLevels = ['Beginner', 'Intermediate', 'Advanced', 'All Levels'];
  const accessLevels = ['Public', 'Students Only', 'Instructors Only', 'Admin Only'];

  // Load resources from API
  const loadResources = async (showRefreshIndicator = false) => {
    try {
      if (showRefreshIndicator) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      
      console.log('🔄 Loading resources...');
      const response = await resourcesAPI.getAll();
      console.log('📥 Resources API response:', response);
      
      // Handle different response structures
      let resourcesData = [];
      if (response.resources) {
        resourcesData = response.resources;
      } else if (response.data && response.data.resources) {
        resourcesData = response.data.resources;
      } else if (Array.isArray(response)) {
        resourcesData = response;
      } else if (response.data && Array.isArray(response.data)) {
        resourcesData = response.data;
      }
      
      console.log('🎯 Final resourcesData to set:', resourcesData);
      setResources(resourcesData);
      
    } catch (error) {
      console.error('❌ Error loading resources:', error);
      toast.error('Failed to load resources');
      setResources([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadResources();
    // Load user favorites from localStorage
    const savedFavorites = JSON.parse(localStorage.getItem(`favorites_${user._id}`) || '[]');
    setFavorites(savedFavorites);
  }, [user._id]);

  // Handle successful resource save
  const handleResourceSaved = () => {
    setShowForm(false);
    setEditingResource(null);
    loadResources(true);
  };

  // Handle edit resource
  const handleEditResource = (resource) => {
    if (user.role !== 'admin' && user.role !== 'tutor' && resource.uploadedBy !== user._id) {
      toast.error('You can only edit resources you uploaded');
      return;
    }
    setEditingResource(resource);
    setShowForm(true);
  };

  // Handle delete resource
  const handleDeleteResource = async (resourceId, resource) => {
    if (user.role !== 'admin' && resource.uploadedBy !== user._id) {
      toast.error('You can only delete resources you uploaded');
      return;
    }

    if (!window.confirm('Are you sure you want to delete this resource?')) {
      return;
    }

    try {
      await resourcesAPI.delete(resourceId);
      toast.success('🗑️ Resource deleted successfully!');
      loadResources(true);
    } catch (error) {
      console.error('Error deleting resource:', error);
      toast.error('Failed to delete resource');
    }
  };

  // Handle resource download/view
  const handleResourceAccess = async (resource) => {
    try {
      // Track download/view
      const updatedResource = {
        ...resource,
        downloadCount: (resource.downloadCount || 0) + 1,
        lastAccessed: new Date().toISOString(),
        accessHistory: [
          ...(resource.accessHistory || []),
          {
            userId: user._id,
            userName: user.name,
            accessDate: new Date().toISOString(),
            action: resource.type === 'Link' ? 'viewed' : 'downloaded'
          }
        ]
      };
      
      await resourcesAPI.update(resource._id, updatedResource);
      
      if (resource.type === 'Link') {
        window.open(resource.url, '_blank');
        toast.success('🔗 Link opened in new tab');
      } else {
        // In a real app, this would trigger file download
        toast.success(`📥 ${resource.name} download started`);
      }
      
      loadResources(true);
    } catch (error) {
      console.error('Error accessing resource:', error);
      toast.error('Failed to access resource');
    }
  };

  // Share resource
  const handleShareResource = async (resource) => {
    try {
      const shareUrl = `${window.location.origin}/resources/${resource._id}`;
      await navigator.clipboard.writeText(shareUrl);
      toast.success('🔗 Resource link copied to clipboard!');
    } catch (error) {
      toast.error('Failed to copy link');
    }
  };

  // Toggle favorite
  const handleToggleFavorite = (resourceId) => {
    const newFavorites = favorites.includes(resourceId)
      ? favorites.filter(id => id !== resourceId)
      : [...favorites, resourceId];
    
    setFavorites(newFavorites);
    localStorage.setItem(`favorites_${user._id}`, JSON.stringify(newFavorites));
    
    toast.success(
      favorites.includes(resourceId) 
        ? '💔 Removed from favorites' 
        : '❤️ Added to favorites'
    );
  };

  // Create test resource
  const createTestResource = async () => {
    try {
      const testResources = [
        {
          name: 'Python Basics Cheat Sheet',
          description: 'Comprehensive Python syntax reference for beginners',
          category: 'Coding',
          type: 'Document',
          level: 'Beginner',
          accessLevel: 'Students Only',
          fileSize: '2.4 MB',
          format: 'PDF',
          url: '/resources/python-basics.pdf',
          uploadedBy: user._id,
          uploaderName: user.name,
          uploadDate: new Date().toISOString(),
          downloadCount: Math.floor(Math.random() * 50),
          tags: ['python', 'syntax', 'reference', 'programming'],
          isActive: true,
          thumbnail: '/thumbnails/python-cheat.jpg'
        },
        {
          name: 'Chess Opening Principles Video',
          description: 'Learn the fundamental principles of chess openings',
          category: 'Chess',
          type: 'Video',
          level: 'Intermediate',
          accessLevel: 'Students Only',
          fileSize: '145 MB',
          format: 'MP4',
          duration: '15:30',
          url: '/resources/chess-openings.mp4',
          uploadedBy: user._id,
          uploaderName: user.name,
          uploadDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          downloadCount: Math.floor(Math.random() * 30),
          tags: ['chess', 'openings', 'strategy', 'video'],
          isActive: true,
          thumbnail: '/thumbnails/chess-video.jpg'
        },
        {
          name: 'Robotics Assembly Guide',
          description: 'Step-by-step guide for building your first robot',
          category: 'Robotics',
          type: 'Interactive',
          level: 'Beginner',
          accessLevel: 'Students Only',
          url: 'https://interactive-robotics-guide.com',
          uploadedBy: user._id,
          uploaderName: user.name,
          uploadDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          downloadCount: Math.floor(Math.random() * 25),
          tags: ['robotics', 'assembly', 'tutorial', 'interactive'],
          isActive: true,
          thumbnail: '/thumbnails/robotics-guide.jpg'
        },
        {
          name: 'French Pronunciation Audio',
          description: 'Native speaker pronunciation examples',
          category: 'French Classes',
          type: 'Audio',
          level: 'All Levels',
          accessLevel: 'Students Only',
          fileSize: '28 MB',
          format: 'MP3',
          duration: '45:20',
          url: '/resources/french-pronunciation.mp3',
          uploadedBy: user._id,
          uploaderName: user.name,
          uploadDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          downloadCount: Math.floor(Math.random() * 40),
          tags: ['french', 'pronunciation', 'audio', 'listening'],
          isActive: true,
          thumbnail: '/thumbnails/french-audio.jpg'
        },
        {
          name: 'Reading Comprehension Worksheets',
          description: 'Collection of age-appropriate reading exercises',
          category: 'Reading',
          type: 'Worksheet',
          level: 'Beginner',
          accessLevel: 'Students Only',
          fileSize: '8.7 MB',
          format: 'ZIP',
          url: '/resources/reading-worksheets.zip',
          uploadedBy: user._id,
          uploaderName: user.name,
          uploadDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          downloadCount: Math.floor(Math.random() * 60),
          tags: ['reading', 'comprehension', 'worksheets', 'practice'],
          isActive: true,
          thumbnail: '/thumbnails/reading-worksheets.jpg'
        },
        {
          name: 'Young Entrepreneur Assessment',
          description: 'Business idea evaluation rubric and templates',
          category: 'Entrepreneurship',
          type: 'Assessment',
          level: 'Advanced',
          accessLevel: 'Instructors Only',
          fileSize: '1.2 MB',
          format: 'DOCX',
          url: '/resources/entrepreneur-assessment.docx',
          uploadedBy: user._id,
          uploaderName: user.name,
          uploadDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          downloadCount: Math.floor(Math.random() * 15),
          tags: ['entrepreneurship', 'assessment', 'business', 'evaluation'],
          isActive: true,
          thumbnail: '/thumbnails/business-assessment.jpg'
        }
      ];

      const randomResource = testResources[Math.floor(Math.random() * testResources.length)];
      
      const testResourceData = {
        ...randomResource,
        name: `${randomResource.name} - ${new Date().toLocaleDateString()}`
      };

      const response = await resourcesAPI.create(testResourceData);
      
      if (response.resource || response.message) {
        toast.success('🧪 Test resource created successfully!');
        loadResources(true);
      } else {
        toast.error('Failed to create test resource');
      }
    } catch (error) {
      console.error('Test resource error:', error);
      toast.error('Failed to create test resource');
    }
  };

  // Get resource type icon
  const getResourceTypeIcon = (type) => {
    switch (type?.toLowerCase()) {
      case 'document': return <FileText size={20} />;
      case 'video': return <Video size={20} />;
      case 'audio': return <Music size={20} />;
      case 'image': return <Image size={20} />;
      case 'interactive': return <Globe size={20} />;
      case 'link': return <Link size={20} />;
      case 'archive': return <Archive size={20} />;
      case 'worksheet': return <FileImage size={20} />;
      case 'assessment': return <ClipboardList size={20} />;
      default: return <FileText size={20} />;
    }
  };

  // Get resource type color
  const getResourceTypeColor = (type) => {
    switch (type?.toLowerCase()) {
      case 'document': return colors.info;
      case 'video': return '#8b5cf6';
      case 'audio': return colors.success;
      case 'image': return colors.warning;
      case 'interactive': return '#06b6d4';
      case 'link': return colors.primary;
      case 'archive': return colors.gray;
      case 'worksheet': return '#84cc16';
      case 'assessment': return colors.danger;
      default: return colors.gray;
    }
  };

  // Get access level color
  const getAccessLevelColor = (level) => {
    switch (level) {
      case 'Public': return colors.success;
      case 'Students Only': return colors.info;
      case 'Instructors Only': return colors.warning;
      case 'Admin Only': return colors.danger;
      default: return colors.gray;
    }
  };

  // Format file size
  const formatFileSize = (bytes) => {
    if (!bytes) return 'Unknown size';
    const units = ['B', 'KB', 'MB', 'GB'];
    let size = parseInt(bytes);
    let unitIndex = 0;
    
    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }
    
    return `${size.toFixed(1)} ${units[unitIndex]}`;
  };

  // Check if user can access resource
  const canAccessResource = (resource) => {
    switch (resource.accessLevel) {
      case 'Public': return true;
      case 'Students Only': return user.role === 'student' || user.role === 'tutor' || user.role === 'admin';
      case 'Instructors Only': return user.role === 'tutor' || user.role === 'admin';
      case 'Admin Only': return user.role === 'admin';
      default: return false;
    }
  };

  // Filter resources
  const filteredResources = resources.filter(resource => {
    const matchesSearch = !searchQuery || 
      resource.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = !categoryFilter || resource.category === categoryFilter;
    const matchesType = !typeFilter || resource.type === typeFilter;
    const matchesLevel = !levelFilter || resource.level === levelFilter;
    const matchesAccess = !accessFilter || resource.accessLevel === accessFilter;
    const hasAccess = canAccessResource(resource);
    
    return matchesSearch && matchesCategory && matchesType && matchesLevel && matchesAccess && hasAccess;
  });

  // Calculate stats
  const totalResources = resources.filter(r => canAccessResource(r)).length;
  const totalDownloads = resources.reduce((sum, r) => sum + (r.downloadCount || 0), 0);
  const recentUploads = resources.filter(r => {
    const uploadDate = new Date(r.uploadDate);
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    return uploadDate > weekAgo && canAccessResource(r);
  }).length;
  const favoriteCount = favorites.length;
  const totalSize = resources.reduce((sum, r) => {
    const size = r.fileSize || '0 MB';
    const match = size.match(/(\d+\.?\d*)\s*(MB|GB|KB)/);
    if (match) {
      const value = parseFloat(match[1]);
      const unit = match[2];
      switch (unit) {
        case 'GB': return sum + value * 1024;
        case 'MB': return sum + value;
        case 'KB': return sum + value / 1024;
        default: return sum;
      }
    }
    return sum;
  }, 0);

  // Export resources data (admin only)
  const exportResources = () => {
    if (user.role !== 'admin') {
      toast.error('Only administrators can export data');
      return;
    }
    
    const csvContent = "data:text/csv;charset=utf-8," + 
      "Resource Name,Category,Type,Level,Access Level,Downloads,File Size,Upload Date,Uploader\n" +
      resources.map(r => 
        `"${r.name}","${r.category}","${r.type}","${r.level}","${r.accessLevel}","${r.downloadCount || 0}","${r.fileSize || 'Unknown'}","${r.uploadDate}","${r.uploaderName}"`
      ).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `resources_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success('Resources data exported successfully!');
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
          <p style={{ color: colors.gray }}>Loading resources...</p>
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
                📖 Resources Library
              </h2>
              <p style={{ color: colors.gray, fontSize: '0.9rem', margin: '0.25rem 0 0 0' }}>
                Access learning materials, videos, worksheets and educational resources
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
                <button
                  onClick={() => setViewMode('folder')}
                  style={{
                    padding: '0.5rem',
                    backgroundColor: viewMode === 'folder' ? colors.white : 'transparent',
                    border: 'none',
                    borderRadius: '0.25rem',
                    cursor: 'pointer',
                    color: viewMode === 'folder' ? colors.dark : colors.gray
                  }}
                >
                  <Folder size={16} />
                </button>
              </div>

              {/* Export Button (Admin Only) */}
              {user.role === 'admin' && (
                <button
                  onClick={exportResources}
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
                onClick={createTestResource}
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
              
              {(user.role === 'admin' || user.role === 'tutor') && (
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
                  Add Resource
                </button>
              )}
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
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '2rem', fontWeight: 'bold', color: colors.primary }}>{totalResources}</div>
                  <div style={{ fontSize: '0.85rem', color: colors.gray }}>Available Resources</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '2rem', fontWeight: 'bold', color: colors.success }}>{totalDownloads}</div>
                  <div style={{ fontSize: '0.85rem', color: colors.gray }}>Total Downloads</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '2rem', fontWeight: 'bold', color: colors.info }}>{recentUploads}</div>
                  <div style={{ fontSize: '0.85rem', color: colors.gray }}>Recent Uploads</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '2rem', fontWeight: 'bold', color: colors.warning }}>{favoriteCount}</div>
                  <div style={{ fontSize: '0.85rem', color: colors.gray }}>My Favorites</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '2rem', fontWeight: 'bold', color: colors.secondary }}>{Math.round(totalSize)} MB</div>
                  <div style={{ fontSize: '0.85rem', color: colors.gray }}>Total Size</div>
                </div>
              </div>

              {/* Usage Section (Collapsible) */}
              {user.role === 'admin' && (
                <div>
                  <button
                    onClick={() => setShowUsageStats(!showUsageStats)}
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
                    {showUsageStats ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    Usage Analytics
                  </button>
                  
                  {showUsageStats && (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginTop: '1rem', paddingTop: '1rem', borderTop: `1px solid ${colors.gray}30` }}>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: colors.success }}>{Math.round(totalDownloads / totalResources) || 0}</div>
                        <div style={{ fontSize: '0.85rem', color: colors.gray }}>Avg Downloads/Resource</div>
                      </div>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: colors.info }}>{resourceTypes.length}</div>
                        <div style={{ fontSize: '0.85rem', color: colors.gray }}>Resource Types</div>
                      </div>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: colors.warning }}>{Math.round((totalSize / 1024) * 100) / 100} GB</div>
                        <div style={{ fontSize: '0.85rem', color: colors.gray }}>Storage Used</div>
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
                placeholder="Search resources, tags..."
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
              {programs.map(program => (
                <option key={program} value={program}>{program}</option>
              ))}
            </select>

            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              style={{
                padding: '0.75rem',
                border: `2px solid ${colors.lightGray}`,
                borderRadius: '0.5rem',
                fontSize: '0.85rem',
                backgroundColor: colors.white
              }}
            >
              <option value="">All Types</option>
              {resourceTypes.map(type => (
                <option key={type} value={type}>{type}</option>
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

            <button
              onClick={() => {
                setSearchQuery('');
                setCategoryFilter('');
                setTypeFilter('');
                setLevelFilter('');
                setAccessFilter('');
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
            {user.role === 'admin' && (
              <select
                value={accessFilter}
                onChange={(e) => setAccessFilter(e.target.value)}
                style={{
                  padding: '0.75rem',
                  border: `2px solid ${colors.lightGray}`,
                  borderRadius: '0.5rem',
                  fontSize: '0.85rem',
                  backgroundColor: colors.white
                }}
              >
                <option value="">All Access Levels</option>
                {accessLevels.map(level => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
            )}

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: colors.gray }}>
              Showing {filteredResources.length} of {totalResources} resources
            </div>
          </div>
        </div>

        {/* Resources Grid/List */}
        {filteredResources.length === 0 ? (
          <div style={{
            backgroundColor: colors.white,
            borderRadius: '1rem',
            padding: '3rem',
            textAlign: 'center',
            boxShadow: '0 4px 6px rgba(0,0,0,0.05)'
          }}>
            <BookOpen size={64} style={{ color: colors.gray, margin: '0 auto 1rem' }} />
            <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: colors.dark, marginBottom: '0.5rem' }}>
              {resources.length === 0 ? 'No resources available' : 'No resources match your filters'}
            </h3>
            <p style={{ color: colors.gray, marginBottom: '1.5rem' }}>
              {resources.length === 0 
                ? 'Upload your first educational resource to get started'
                : 'Try adjusting your search terms or filters'
              }
            </p>
            {resources.length === 0 && (user.role === 'admin' || user.role === 'tutor') && (
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                <button
                  onClick={createTestResource}
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
                  🧪 Create Test Resource
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
                  Upload First Resource
                </button>
              </div>
            )}
          </div>
        ) : (
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: viewMode === 'grid' ? 'repeat(auto-fill, minmax(380px, 1fr))' : viewMode === 'list' ? '1fr' : 'repeat(auto-fill, minmax(280px, 1fr))', 
            gap: '1.5rem' 
          }}>
            {filteredResources.map((resource) => {
              const isFavorite = favorites.includes(resource._id);
              const canEdit = user.role === 'admin' || user.role === 'tutor' || resource.uploadedBy === user._id;
              
              return (
                <div
                  key={resource._id}
                  style={{
                    backgroundColor: colors.white,
                    borderRadius: '1rem',
                    padding: '1.5rem',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
                    border: `2px solid ${colors.lightGray}`,
                    transition: 'all 0.2s'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = `0 8px 25px ${getResourceTypeColor(resource.type)}20`;
                    e.currentTarget.style.borderColor = getResourceTypeColor(resource.type);
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.05)';
                    e.currentTarget.style.borderColor = colors.lightGray;
                  }}
                >
                  {/* Enhanced Resource Header */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1 }}>
                      <div style={{
                        width: '3rem',
                        height: '3rem',
                        borderRadius: '0.75rem',
                        backgroundColor: `${getResourceTypeColor(resource.type)}20`,
                        border: `2px solid ${getResourceTypeColor(resource.type)}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: getResourceTypeColor(resource.type)
                      }}>
                        {getResourceTypeIcon(resource.type)}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                          <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', color: colors.dark, margin: 0 }}>
                            {resource.name || 'Untitled Resource'}
                          </h3>
                          <button
                            onClick={() => handleToggleFavorite(resource._id)}
                            style={{
                              background: 'none',
                              border: 'none',
                              cursor: 'pointer',
                              color: isFavorite ? colors.danger : colors.gray,
                              padding: '0.25rem'
                            }}
                          >
                            <Heart size={16} fill={isFavorite ? 'currentColor' : 'none'} />
                          </button>
                        </div>
                        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                          <div style={{
                            display: 'inline-block',
                            padding: '0.25rem 0.75rem',
                            backgroundColor: `${getResourceTypeColor(resource.type)}20`,
                            color: getResourceTypeColor(resource.type),
                            borderRadius: '1rem',
                            fontSize: '0.75rem',
                            fontWeight: '600'
                          }}>
                            {resource.type || 'Unknown'}
                          </div>
                          <div style={{
                            display: 'inline-block',
                            padding: '0.25rem 0.5rem',
                            backgroundColor: `${getAccessLevelColor(resource.accessLevel)}20`,
                            color: getAccessLevelColor(resource.accessLevel),
                            borderRadius: '1rem',
                            fontSize: '0.7rem',
                            fontWeight: '500'
                          }}>
                            {resource.accessLevel === 'Students Only' ? 'Students' : 
                             resource.accessLevel === 'Instructors Only' ? 'Instructors' :
                             resource.accessLevel === 'Admin Only' ? 'Admin' : 'Public'}
                          </div>
                        </div>
                      </div>
                    </div>

                    {canEdit && (
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                          onClick={() => handleShareResource(resource)}
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
                          title="Share Resource"
                        >
                          <Share2 size={14} style={{ color: colors.info }} />
                        </button>
                        <button
                          onClick={() => handleEditResource(resource)}
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
                          onClick={() => handleDeleteResource(resource._id, resource)}
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

                  {/* Resource Description */}
                  {resource.description && (
                    <p style={{ 
                      fontSize: '0.875rem', 
                      color: colors.gray, 
                      marginBottom: '1rem',
                      lineHeight: '1.4'
                    }}>
                      {resource.description.length > 120 
                        ? `${resource.description.substring(0, 120)}...` 
                        : resource.description
                      }
                    </p>
                  )}

                  {/* Resource Details */}
                  <div style={{ 
                    backgroundColor: colors.lightGray, 
                    padding: '1rem', 
                    borderRadius: '0.5rem',
                    marginBottom: '1rem'
                  }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <BookOpen size={14} style={{ color: colors.gray }} />
                        <span style={{ fontSize: '0.8rem', color: colors.dark }}>
                          {resource.category}
                        </span>
                      </div>
                      
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Target size={14} style={{ color: colors.gray }} />
                        <span style={{ fontSize: '0.8rem', color: colors.dark }}>
                          {resource.level}
                        </span>
                      </div>

                      {resource.fileSize && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <HardDrive size={14} style={{ color: colors.gray }} />
                          <span style={{ fontSize: '0.8rem', color: colors.gray }}>
                            {resource.fileSize}
                          </span>
                        </div>
                      )}

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <CloudDownload size={14} style={{ color: colors.gray }} />
                        <span style={{ fontSize: '0.8rem', color: colors.gray }}>
                          {resource.downloadCount || 0} downloads
                        </span>
                      </div>

                      {resource.duration && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <Clock size={14} style={{ color: colors.gray }} />
                          <span style={{ fontSize: '0.8rem', color: colors.gray }}>
                            {resource.duration}
                          </span>
                        </div>
                      )}

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <User size={14} style={{ color: colors.gray }} />
                        <span style={{ fontSize: '0.8rem', color: colors.gray }}>
                          {resource.uploaderName}
                        </span>
                      </div>
                    </div>
                    
                    {resource.uploadDate && (
                      <div style={{ marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: `1px solid ${colors.gray}30` }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <Calendar size={14} style={{ color: colors.gray }} />
                          <span style={{ fontSize: '0.8rem', color: colors.gray }}>
                            Uploaded {new Date(resource.uploadDate).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Tags */}
                  {resource.tags && resource.tags.length > 0 && (
                    <div style={{ marginBottom: '1rem' }}>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                        {resource.tags.slice(0, 4).map((tag, index) => (
                          <div key={index} style={{
                            padding: '0.25rem 0.5rem',
                            backgroundColor: `${colors.secondary}20`,
                            color: colors.dark,
                            borderRadius: '1rem',
                            fontSize: '0.7rem',
                            fontWeight: '500'
                          }}>
                            #{tag}
                          </div>
                        ))}
                        {resource.tags.length > 4 && (
                          <div style={{
                            padding: '0.25rem 0.5rem',
                            backgroundColor: colors.lightGray,
                            color: colors.gray,
                            borderRadius: '1rem',
                            fontSize: '0.7rem'
                          }}>
                            +{resource.tags.length - 4} more
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Quick Action Buttons */}
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      onClick={() => handleResourceAccess(resource)}
                      style={{
                        flex: 1,
                        padding: '0.5rem',
                        backgroundColor: `${colors.primary}20`,
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
                      {resource.type === 'Link' ? <ExternalLink size={12} /> : <Download size={12} />}
                      {resource.type === 'Link' ? 'Open' : 'Download'}
                    </button>
                    
                    <button
                      onClick={() => handleShareResource(resource)}
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
                      <Share2 size={12} />
                      Share
                    </button>

                    <button
                      onClick={() => handleToggleFavorite(resource._id)}
                      style={{
                        padding: '0.5rem',
                        backgroundColor: isFavorite ? `${colors.danger}20` : `${colors.gray}20`,
                        color: isFavorite ? colors.danger : colors.gray,
                        border: `1px solid ${isFavorite ? colors.danger : colors.gray}30`,
                        borderRadius: '0.375rem',
                        cursor: 'pointer',
                        fontSize: '0.75rem',
                        fontWeight: '500',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                      title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                    >
                      <Heart size={12} fill={isFavorite ? 'currentColor' : 'none'} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Resource Form Modal */}
        {showForm && (
          <ResourceForm
            resource={editingResource}
            onClose={() => {
              setShowForm(false);
              setEditingResource(null);
            }}
            onResourceSaved={handleResourceSaved}
          />
        )}
      </div>
    </div>
  );
};

export default ResourceList;