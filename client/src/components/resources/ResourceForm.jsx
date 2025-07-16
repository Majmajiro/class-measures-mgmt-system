import { useState, useEffect } from 'react';
import { resourcesAPI, programsAPI } from '../../services/api';
import { toast } from 'react-hot-toast';
import { 
  X, 
  Save, 
  Book, 
  Monitor, 
  Package, 
  FileText,
  DollarSign,
  Building,
  GraduationCap,
  Users
} from 'lucide-react';

const ResourceForm = ({ resource = null, onClose, onResourceSaved }) => {
  const isEditing = !!resource;
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    type: 'Book',
    language: 'French',
    subject: 'French',
    frenchBookCategory: '',
    practiceBookType: '',
    publisher: {
      frenchPublisher: '',
      englishPublisher: '',
      series: '',
      level: '',
      edition: '',
      year: new Date().getFullYear()
    },
    platformDetails: {
      platformName: '',
      licenseType: '',
      accessDuration: '',
      maxUsers: ''
    },
    pricing: {
      schoolBulkPrice: '',
      teacherDiscountPrice: '',
      studentRetailPrice: '',
      costPrice: ''
    },
    inventory: {
      totalStock: '',
      available: '',
      minimumStock: 5
    },
    supplier: {
      name: '',
      contact: '',
      email: '',
      leadTime: ''
    },
    academicInfo: {
      frenchLevel: '',
      ageGroup: '',
      difficulty: ''
    },
    programs: [],
    metadata: {
      isbn: '',
      pages: '',
      format: 'Paperback'
    },
    isRequired: false
  });

  const colors = {
    primary: '#c55c5c',
    secondary: '#f4c842',
    dark: '#1e1e3c',
    white: '#ffffff',
    gray: '#6b7280',
    lightGray: '#f3f4f6'
  };

  useEffect(() => {
    loadPrograms();
    if (isEditing && resource) {
      // Populate form with existing resource data
      setFormData({
        name: resource.name || '',
        type: resource.type || 'Book',
        language: resource.language || 'French',
        subject: resource.subject || 'French',
        frenchBookCategory: resource.frenchBookCategory || '',
        practiceBookType: resource.practiceBookType || '',
        publisher: {
          frenchPublisher: resource.publisher?.frenchPublisher || '',
          englishPublisher: resource.publisher?.englishPublisher || '',
          series: resource.publisher?.series || '',
          level: resource.publisher?.level || '',
          edition: resource.publisher?.edition || '',
          year: resource.publisher?.year || new Date().getFullYear()
        },
        platformDetails: {
          platformName: resource.platformDetails?.platformName || '',
          licenseType: resource.platformDetails?.licenseType || '',
          accessDuration: resource.platformDetails?.accessDuration || '',
          maxUsers: resource.platformDetails?.maxUsers || ''
        },
        pricing: {
          schoolBulkPrice: resource.pricing?.schoolBulkPrice || '',
          teacherDiscountPrice: resource.pricing?.teacherDiscountPrice || '',
          studentRetailPrice: resource.pricing?.studentRetailPrice || '',
          costPrice: resource.pricing?.costPrice || ''
        },
        inventory: {
          totalStock: resource.inventory?.totalStock || '',
          available: resource.inventory?.available || '',
          minimumStock: resource.inventory?.minimumStock || 5
        },
        supplier: {
          name: resource.supplier?.name || '',
          contact: resource.supplier?.contact || '',
          email: resource.supplier?.email || '',
          leadTime: resource.supplier?.leadTime || ''
        },
        academicInfo: {
          frenchLevel: resource.academicInfo?.frenchLevel || '',
          ageGroup: resource.academicInfo?.ageGroup || '',
          difficulty: resource.academicInfo?.difficulty || ''
        },
        programs: resource.programs?.map(p => p._id || p) || [],
        metadata: {
          isbn: resource.metadata?.isbn || '',
          pages: resource.metadata?.pages || '',
          format: resource.metadata?.format || 'Paperback'
        },
        isRequired: resource.isRequired || false
      });
    }
  }, [isEditing, resource]);

  const loadPrograms = async () => {
    try {
      const response = await programsAPI.getAll();
      setPrograms(response.data.programs || []);
    } catch (error) {
      console.error('Error loading programs:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: type === 'checkbox' ? checked : value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleProgramChange = (programId) => {
    setFormData(prev => ({
      ...prev,
      programs: prev.programs.includes(programId)
        ? prev.programs.filter(id => id !== programId)
        : [...prev.programs, programId]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Clean up the data
      const submitData = {
        ...formData,
        pricing: {
          schoolBulkPrice: parseFloat(formData.pricing.schoolBulkPrice) || 0,
          teacherDiscountPrice: parseFloat(formData.pricing.teacherDiscountPrice) || 0,
          studentRetailPrice: parseFloat(formData.pricing.studentRetailPrice) || 0,
          costPrice: parseFloat(formData.pricing.costPrice) || 0,
          currency: 'KSh'
        },
        inventory: {
          totalStock: parseInt(formData.inventory.totalStock) || 0,
          available: parseInt(formData.inventory.available) || 0,
          minimumStock: parseInt(formData.inventory.minimumStock) || 5
        },
        metadata: {
          ...formData.metadata,
          pages: parseInt(formData.metadata.pages) || 0
        }
      };

      // Remove empty publisher fields
      if (!submitData.publisher.frenchPublisher && !submitData.publisher.englishPublisher) {
        delete submitData.publisher.frenchPublisher;
        delete submitData.publisher.englishPublisher;
      }

      // Remove platform details if not a platform
      if (submitData.type !== 'Platform') {
        delete submitData.platformDetails;
      }

      if (isEditing) {
        await resourcesAPI.update(resource._id, submitData);
        toast.success('📚 Resource updated successfully!');
      } else {
        await resourcesAPI.create(submitData);
        toast.success('🎉 Resource created successfully!');
      }
      
      onResourceSaved();
    } catch (error) {
      console.error('Save resource error:', error);
      toast.error(error.response?.data?.message || 'Failed to save resource');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 50,
      padding: '1rem'
    }}>
      <div style={{
        backgroundColor: colors.white,
        borderRadius: '1rem',
        padding: '0',
        width: '100%',
        maxWidth: '56rem',
        maxHeight: '90vh',
        overflow: 'hidden',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
        border: `3px solid ${colors.primary}20`
      }}>
        {/* Header */}
        <div style={{
          padding: '1.5rem 2rem',
          borderBottom: `2px solid ${colors.lightGray}`,
          background: `linear-gradient(135deg, ${colors.primary}, ${colors.dark})`,
          color: colors.white
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                {isEditing ? '✏️ Edit Resource' : '📚 Add New Resource'}
              </h2>
              <p style={{ fontSize: '0.875rem', opacity: 0.9 }}>
                {isEditing ? `Update "${resource?.name}"` : 'Add books, platforms, or materials to your catalog'}
              </p>
            </div>
            <button
              onClick={onClose}
              style={{
                background: 'rgba(255,255,255,0.2)',
                border: 'none',
                borderRadius: '0.5rem',
                padding: '0.5rem',
                cursor: 'pointer',
                color: colors.white
              }}
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Form Content */}
        <div style={{ maxHeight: 'calc(90vh - 140px)', overflow: 'auto', padding: '2rem' }}>
          <form onSubmit={handleSubmit}>
            {/* Basic Information */}
            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ 
                fontSize: '1.125rem', 
                fontWeight: '600', 
                color: colors.dark, 
                marginBottom: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <Book size={18} style={{ color: colors.primary }} />
                Basic Information
              </h3>
              
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label style={{ 
                    display: 'block', 
                    fontSize: '0.875rem', 
                    fontWeight: '600', 
                    color: colors.dark, 
                    marginBottom: '0.5rem' 
                  }}>
                    Resource Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: `2px solid ${colors.lightGray}`,
                      borderRadius: '0.5rem',
                      fontSize: '0.875rem',
                      transition: 'border-color 0.2s'
                    }}
                    placeholder="e.g., Alter Ego A1 Student Book"
                    onFocus={(e) => e.target.style.borderColor = colors.primary}
                    onBlur={(e) => e.target.style.borderColor = colors.lightGray}
                  />
                </div>

                <div>
                  <label style={{ 
                    display: 'block', 
                    fontSize: '0.875rem', 
                    fontWeight: '600', 
                    color: colors.dark, 
                    marginBottom: '0.5rem' 
                  }}>
                    Type *
                  </label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    required
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: `2px solid ${colors.lightGray}`,
                      borderRadius: '0.5rem',
                      fontSize: '0.875rem',
                      backgroundColor: colors.white
                    }}
                  >
                    <option value="Book">📚 Book</option>
                    <option value="Platform">💻 Platform</option>
                    <option value="Hardware">📦 Hardware</option>
                    <option value="Digital">📄 Digital</option>
                  </select>
                </div>

                <div>
                  <label style={{ 
                    display: 'block', 
                    fontSize: '0.875rem', 
                    fontWeight: '600', 
                    color: colors.dark, 
                    marginBottom: '0.5rem' 
                  }}>
                    Language *
                  </label>
                  <select
                    name="language"
                    value={formData.language}
                    onChange={handleChange}
                    required
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: `2px solid ${colors.lightGray}`,
                      borderRadius: '0.5rem',
                      fontSize: '0.875rem',
                      backgroundColor: colors.white
                    }}
                  >
                    <option value="French">🇫🇷 French</option>
                    <option value="English">🇬🇧 English</option>
                    <option value="Swahili">🇰🇪 Swahili</option>
                    <option value="Multi-language">🌍 Multi-language</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ 
                    display: 'block', 
                    fontSize: '0.875rem', 
                    fontWeight: '600', 
                    color: colors.dark, 
                    marginBottom: '0.5rem' 
                  }}>
                    Subject *
                  </label>
                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: `2px solid ${colors.lightGray}`,
                      borderRadius: '0.5rem',
                      fontSize: '0.875rem',
                      backgroundColor: colors.white
                    }}
                  >
                    <option value="French">French</option>
                    <option value="English">English</option>
                    <option value="Reading">Reading</option>
                    <option value="Coding">Coding</option>
                    <option value="Chess">Chess</option>
                    <option value="Robotics">Robotics</option>
                    <option value="General">General</option>
                  </select>
                </div>

                {/* French Book Category - only show for French books */}
                {formData.language === 'French' && formData.type === 'Book' && (
                  <div>
                    <label style={{ 
                      display: 'block', 
                      fontSize: '0.875rem', 
                      fontWeight: '600', 
                      color: colors.dark, 
                      marginBottom: '0.5rem' 
                    }}>
                      French Book Category
                    </label>
                    <select
                      name="frenchBookCategory"
                      value={formData.frenchBookCategory}
                      onChange={handleChange}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: `2px solid ${colors.lightGray}`,
                        borderRadius: '0.5rem',
                        fontSize: '0.875rem',
                        backgroundColor: colors.white
                      }}
                    >
                      <option value="">Select category</option>
                      <option value="Methode de Francais">Méthode de Français</option>
                      <option value="Cahier d'activites">Cahier d'activités</option>
                      <option value="Exam Preparation">Exam Preparation</option>
                      <option value="Livre du Professeur">Livre du Professeur</option>
                      <option value="Readers">Readers</option>
                      <option value="Practice Books">Practice Books</option>
                      <option value="U.B.s">U.B.s</option>
                    </select>
                  </div>
                )}
              </div>

              {/* Practice Book Type - only show for Practice Books */}
              {formData.frenchBookCategory === 'Practice Books' && (
                <div style={{ marginTop: '1rem' }}>
                  <label style={{ 
                    display: 'block', 
                    fontSize: '0.875rem', 
                    fontWeight: '600', 
                    color: colors.dark, 
                    marginBottom: '0.5rem' 
                  }}>
                    Practice Book Type
                  </label>
                  <select
                    name="practiceBookType"
                    value={formData.practiceBookType}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: `2px solid ${colors.lightGray}`,
                      borderRadius: '0.5rem',
                      fontSize: '0.875rem',
                      backgroundColor: colors.white
                    }}
                  >
                    <option value="">Select practice type</option>
                    <option value="Orale">Orale</option>
                    <option value="Comprehension">Compréhension</option>
                    <option value="Conjugation">Conjugation</option>
                    <option value="Grammar">Grammar</option>
                    <option value="Vocabulary">Vocabulary</option>
                    <option value="Writing">Writing</option>
                  </select>
                </div>
              )}
            </div>

            {/* Publisher Information */}
            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ 
                fontSize: '1.125rem', 
                fontWeight: '600', 
                color: colors.dark, 
                marginBottom: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <Building size={18} style={{ color: colors.primary }} />
                Publisher Information
              </h3>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                {/* French Publishers */}
                {formData.language === 'French' && (
                  <div>
                    <label style={{ 
                      display: 'block', 
                      fontSize: '0.875rem', 
                      fontWeight: '600', 
                      color: colors.dark, 
                      marginBottom: '0.5rem' 
                    }}>
                      French Publisher
                    </label>
                    <select
                      name="publisher.frenchPublisher"
                      value={formData.publisher.frenchPublisher}
                      onChange={handleChange}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: `2px solid ${colors.lightGray}`,
                        borderRadius: '0.5rem',
                        fontSize: '0.875rem',
                        backgroundColor: colors.white
                      }}
                    >
                      <option value="">Select publisher</option>
                      <option value="Hachette">Hachette</option>
                      <option value="Didier">Didier</option>
                      <option value="CLE International">CLE International</option>
                    </select>
                  </div>
                )}

                {/* English Publishers */}
                {formData.language === 'English' && (
                  <div>
                    <label style={{ 
                      display: 'block', 
                      fontSize: '0.875rem', 
                      fontWeight: '600', 
                      color: colors.dark, 
                      marginBottom: '0.5rem' 
                    }}>
                      English Publisher
                    </label>
                    <select
                      name="publisher.englishPublisher"
                      value={formData.publisher.englishPublisher}
                      onChange={handleChange}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: `2px solid ${colors.lightGray}`,
                        borderRadius: '0.5rem',
                        fontSize: '0.875rem',
                        backgroundColor: colors.white
                      }}
                    >
                      <option value="">Select publisher</option>
                      <option value="Cambridge">Cambridge</option>
                      <option value="Oxford">Oxford</option>
                      <option value="Pearson">Pearson</option>
                      <option value="Brilliant">Brilliant</option>
                      <option value="Unique Books">Unique Books</option>
                    </select>
                  </div>
                )}

                <div>
                  <label style={{ 
                    display: 'block', 
                    fontSize: '0.875rem', 
                    fontWeight: '600', 
                    color: colors.dark, 
                    marginBottom: '0.5rem' 
                  }}>
                    Series
                  </label>
                  <input
                    type="text"
                    name="publisher.series"
                    value={formData.publisher.series}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: `2px solid ${colors.lightGray}`,
                      borderRadius: '0.5rem',
                      fontSize: '0.875rem'
                    }}
                    placeholder="e.g., Alter Ego, Cambridge IGCSE"
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ 
                    display: 'block', 
                    fontSize: '0.875rem', 
                    fontWeight: '600', 
                    color: colors.dark, 
                    marginBottom: '0.5rem' 
                  }}>
                    Level
                  </label>
                  <input
                    type="text"
                    name="publisher.level"
                    value={formData.publisher.level}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: `2px solid ${colors.lightGray}`,
                      borderRadius: '0.5rem',
                      fontSize: '0.875rem'
                    }}
                    placeholder="e.g., A1, IGCSE"
                  />
                </div>

                <div>
                  <label style={{ 
                    display: 'block', 
                    fontSize: '0.875rem', 
                    fontWeight: '600', 
                    color: colors.dark, 
                    marginBottom: '0.5rem' 
                  }}>
                    Edition
                  </label>
                  <input
                    type="text"
                    name="publisher.edition"
                    value={formData.publisher.edition}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: `2px solid ${colors.lightGray}`,
                      borderRadius: '0.5rem',
                      fontSize: '0.875rem'
                    }}
                    placeholder="e.g., 2nd Edition"
                  />
                </div>

                <div>
                  <label style={{ 
                    display: 'block', 
                    fontSize: '0.875rem', 
                    fontWeight: '600', 
                    color: colors.dark, 
                    marginBottom: '0.5rem' 
                  }}>
                    Year
                  </label>
                  <input
                    type="number"
                    name="publisher.year"
                    value={formData.publisher.year}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: `2px solid ${colors.lightGray}`,
                      borderRadius: '0.5rem',
                      fontSize: '0.875rem'
                    }}
                    min="2000"
                    max="2030"
                  />
                </div>
              </div>
            </div>

            {/* Platform Details - only show for platforms */}
            {formData.type === 'Platform' && (
              <div style={{ marginBottom: '2rem' }}>
                <h3 style={{ 
                  fontSize: '1.125rem', 
                  fontWeight: '600', 
                  color: colors.dark, 
                  marginBottom: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  <Monitor size={18} style={{ color: colors.primary }} />
                  Platform Details
                </h3>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                  <div>
                    <label style={{ 
                      display: 'block', 
                      fontSize: '0.875rem', 
                      fontWeight: '600', 
                      color: colors.dark, 
                      marginBottom: '0.5rem' 
                    }}>
                      Platform Name
                    </label>
                    <select
                      name="platformDetails.platformName"
                      value={formData.platformDetails.platformName}
                      onChange={handleChange}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: `2px solid ${colors.lightGray}`,
                        borderRadius: '0.5rem',
                        fontSize: '0.875rem',
                        backgroundColor: colors.white
                      }}
                    >
                      <option value="">Select platform</option>
                      <option value="PurpleMash">PurpleMash</option>
                      <option value="Scholastic Learning Zone">Scholastic Learning Zone</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ 
                      display: 'block', 
                      fontSize: '0.875rem', 
                      fontWeight: '600', 
                      color: colors.dark, 
                      marginBottom: '0.5rem' 
                    }}>
                      License Type
                    </label>
                    <select
                      name="platformDetails.licenseType"
                      value={formData.platformDetails.licenseType}
                      onChange={handleChange}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: `2px solid ${colors.lightGray}`,
                        borderRadius: '0.5rem',
                        fontSize: '0.875rem',
                        backgroundColor: colors.white
                      }}
                    >
                      <option value="">Select license type</option>
                      <option value="Individual">Individual</option>
                      <option value="Classroom">Classroom</option>
                      <option value="School">School</option>
                      <option value="Annual">Annual</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ 
                      display: 'block', 
                      fontSize: '0.875rem', 
                      fontWeight: '600', 
                      color: colors.dark, 
                      marginBottom: '0.5rem' 
                    }}>
                      Access Duration
                    </label>
                    <input
                      type="text"
                      name="platformDetails.accessDuration"
                      value={formData.platformDetails.accessDuration}
                      onChange={handleChange}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: `2px solid ${colors.lightGray}`,
                        borderRadius: '0.5rem',
                        fontSize: '0.875rem'
                      }}
                      placeholder="e.g., 1 year, 6 months"
                    />
                  </div>

                  <div>
                    <label style={{ 
                      display: 'block', 
                      fontSize: '0.875rem', 
                      fontWeight: '600', 
                      color: colors.dark, 
                      marginBottom: '0.5rem' 
                    }}>
                      Max Users
                    </label>
                    <input
                      type="number"
                      name="platformDetails.maxUsers"
                      value={formData.platformDetails.maxUsers}
                      onChange={handleChange}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: `2px solid ${colors.lightGray}`,
                        borderRadius: '0.5rem',
                        fontSize: '0.875rem'
                      }}
                      min="1"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Pricing Information */}
            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ 
                fontSize: '1.125rem', 
                fontWeight: '600', 
                color: colors.dark, 
                marginBottom: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <DollarSign size={18} style={{ color: colors.primary }} />
                Multi-Tier Pricing (KSh)
              </h3>
              
              <div style={{ 
                backgroundColor: `${colors.secondary}10`, 
                padding: '1rem', 
                borderRadius: '0.5rem', 
                marginBottom: '1rem',
                border: `2px solid ${colors.secondary}30`
              }}>
                <p style={{ fontSize: '0.875rem', color: colors.dark, margin: 0 }}>
                  💡 <strong>Pricing Strategy:</strong> Set different prices for schools (bulk discount), teachers (professional discount), and students (retail price)
                </p>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label style={{ 
                    display: 'block', 
                    fontSize: '0.875rem', 
                    fontWeight: '600', 
                    color: colors.dark, 
                    marginBottom: '0.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}>
                    <span>💰</span>
                    Cost Price (What you pay suppliers)
                  </label>
                  <input
                    type="number"
                    name="pricing.costPrice"
                    value={formData.pricing.costPrice}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: `2px solid ${colors.lightGray}`,
                      borderRadius: '0.5rem',
                      fontSize: '0.875rem'
                    }}
                    min="0"
                    step="0.01"
                    placeholder="2400"
                  />
                </div>

                <div>
                  <label style={{ 
                    display: 'block', 
                    fontSize: '0.875rem', 
                    fontWeight: '600', 
                    color: colors.dark, 
                    marginBottom: '0.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}>
                    <Building size={14} style={{ color: colors.primary }} />
                    School Bulk Price
                  </label>
                  <input
                    type="number"
                    name="pricing.schoolBulkPrice"
                    value={formData.pricing.schoolBulkPrice}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: `2px solid ${colors.lightGray}`,
                      borderRadius: '0.5rem',
                      fontSize: '0.875rem'
                    }}
                    min="0"
                    step="0.01"
                    placeholder="2800"
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ 
                    display: 'block', 
                    fontSize: '0.875rem', 
                    fontWeight: '600', 
                    color: colors.dark, 
                    marginBottom: '0.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}>
                    <GraduationCap size={14} style={{ color: colors.secondary }} />
                    Teacher Discount Price
                  </label>
                  <input
                    type="number"
                    name="pricing.teacherDiscountPrice"
                    value={formData.pricing.teacherDiscountPrice}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: `2px solid ${colors.lightGray}`,
                      borderRadius: '0.5rem',
                      fontSize: '0.875rem'
                    }}
                    min="0"
                    step="0.01"
                    placeholder="3200"
                  />
                </div>

                <div>
                  <label style={{ 
                    display: 'block', 
                    fontSize: '0.875rem', 
                    fontWeight: '600', 
                    color: colors.dark, 
                    marginBottom: '0.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}>
                    <Users size={14} style={{ color: colors.dark }} />
                    Student Retail Price
                  </label>
                  <input
                    type="number"
                    name="pricing.studentRetailPrice"
                    value={formData.pricing.studentRetailPrice}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: `2px solid ${colors.lightGray}`,
                      borderRadius: '0.5rem',
                      fontSize: '0.875rem'
                    }}
                    min="0"
                    step="0.01"
                    placeholder="3500"
                  />
                </div>
              </div>
            </div>

            {/* Inventory */}
            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ 
                fontSize: '1.125rem', 
                fontWeight: '600', 
                color: colors.dark, 
                marginBottom: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <Package size={18} style={{ color: colors.primary }} />
                Inventory Management
              </h3>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ 
                    display: 'block', 
                    fontSize: '0.875rem', 
                    fontWeight: '600', 
                    color: colors.dark, 
                    marginBottom: '0.5rem' 
                  }}>
                    Total Stock
                  </label>
                  <input
                    type="number"
                    name="inventory.totalStock"
                    value={formData.inventory.totalStock}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: `2px solid ${colors.lightGray}`,
                      borderRadius: '0.5rem',
                      fontSize: '0.875rem'
                    }}
                    min="0"
                    placeholder="50"
                  />
                </div>

                <div>
                  <label style={{ 
                    display: 'block', 
                    fontSize: '0.875rem', 
                    fontWeight: '600', 
                    color: colors.dark, 
                    marginBottom: '0.5rem' 
                  }}>
                    Available
                  </label>
                  <input
                    type="number"
                    name="inventory.available"
                    value={formData.inventory.available}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: `2px solid ${colors.lightGray}`,
                      borderRadius: '0.5rem',
                      fontSize: '0.875rem'
                    }}
                    min="0"
                    placeholder="45"
                  />
                </div>

                <div>
                  <label style={{ 
                    display: 'block', 
                    fontSize: '0.875rem', 
                    fontWeight: '600', 
                    color: colors.dark, 
                    marginBottom: '0.5rem' 
                  }}>
                    Minimum Stock Alert
                  </label>
                  <input
                    type="number"
                    name="inventory.minimumStock"
                    value={formData.inventory.minimumStock}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: `2px solid ${colors.lightGray}`,
                      borderRadius: '0.5rem',
                      fontSize: '0.875rem'
                    }}
                    min="0"
                    placeholder="10"
                  />
                </div>
              </div>
            </div>

            {/* Academic Information for French */}
            {formData.language === 'French' && (
              <div style={{ marginBottom: '2rem' }}>
                <h3 style={{ 
                  fontSize: '1.125rem', 
                  fontWeight: '600', 
                  color: colors.dark, 
                  marginBottom: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  🇫🇷 French Academic Information
                </h3>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ 
                      display: 'block', 
                      fontSize: '0.875rem', 
                      fontWeight: '600', 
                      color: colors.dark, 
                      marginBottom: '0.5rem' 
                    }}>
                      French Level
                    </label>
                    <select
                      name="academicInfo.frenchLevel"
                      value={formData.academicInfo.frenchLevel}
                      onChange={handleChange}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: `2px solid ${colors.lightGray}`,
                        borderRadius: '0.5rem',
                        fontSize: '0.875rem',
                        backgroundColor: colors.white
                      }}
                    >
                      <option value="">Select level</option>
                      <option value="A1">A1 (Beginner)</option>
                      <option value="A2">A2 (Elementary)</option>
                      <option value="B1">B1 (Intermediate)</option>
                      <option value="B2">B2 (Upper Intermediate)</option>
                      <option value="C1">C1 (Advanced)</option>
                      <option value="C2">C2 (Proficient)</option>
                      <option value="DELF Prep">DELF Preparation</option>
                      <option value="DALF Prep">DALF Preparation</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ 
                      display: 'block', 
                      fontSize: '0.875rem', 
                      fontWeight: '600', 
                      color: colors.dark, 
                      marginBottom: '0.5rem' 
                    }}>
                      Age Group
                    </label>
                    <input
                      type="text"
                      name="academicInfo.ageGroup"
                      value={formData.academicInfo.ageGroup}
                      onChange={handleChange}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: `2px solid ${colors.lightGray}`,
                        borderRadius: '0.5rem',
                        fontSize: '0.875rem'
                      }}
                      placeholder="e.g., 12-16 years"
                    />
                  </div>

                  <div>
                    <label style={{ 
                      display: 'block', 
                      fontSize: '0.875rem', 
                      fontWeight: '600', 
                      color: colors.dark, 
                      marginBottom: '0.5rem' 
                    }}>
                      Difficulty
                    </label>
                    <select
                      name="academicInfo.difficulty"
                      value={formData.academicInfo.difficulty}
                      onChange={handleChange}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: `2px solid ${colors.lightGray}`,
                        borderRadius: '0.5rem',
                        fontSize: '0.875rem',
                        backgroundColor: colors.white
                      }}
                    >
                      <option value="">Select difficulty</option>
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Programs Association */}
            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ 
                fontSize: '1.125rem', 
                fontWeight: '600', 
                color: colors.dark, 
                marginBottom: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                🎓 Associated Programs
              </h3>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.5rem' }}>
                {programs.map(program => (
                  <label key={program._id} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.75rem',
                    backgroundColor: formData.programs.includes(program._id) ? `${colors.primary}15` : colors.lightGray,
                    border: `2px solid ${formData.programs.includes(program._id) ? colors.primary : 'transparent'}`,
                    borderRadius: '0.5rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}>
                    <input
                      type="checkbox"
                      checked={formData.programs.includes(program._id)}
                      onChange={() => handleProgramChange(program._id)}
                      style={{ margin: 0 }}
                    />
                    <span style={{ fontSize: '0.875rem', fontWeight: '500', color: colors.dark }}>
                      {program.name}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div style={{
          padding: '1.5rem 2rem',
          borderTop: `2px solid ${colors.lightGray}`,
          backgroundColor: colors.white,
          display: 'flex',
          gap: '1rem',
          justifyContent: 'flex-end'
        }}>
          <button
            type="button"
            onClick={onClose}
            style={{
              padding: '0.75rem 1.5rem',
              border: `2px solid ${colors.lightGray}`,
              backgroundColor: colors.white,
              color: colors.gray,
              borderRadius: '0.5rem',
              cursor: 'pointer',
              fontSize: '0.875rem',
              fontWeight: '500'
            }}
          >
            Cancel
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={loading}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.75rem 1.5rem',
              background: `linear-gradient(135deg, ${colors.primary}, ${colors.dark})`,
              color: colors.white,
              border: 'none',
              borderRadius: '0.5rem',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontSize: '0.875rem',
              fontWeight: '600',
              opacity: loading ? 0.7 : 1
            }}
          >
            <Save size={16} />
            {loading ? 'Saving...' : (isEditing ? 'Update Resource' : 'Create Resource')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResourceForm;
