const AttendanceTracker = ({ session, onClose }) => {
  const students = [
    { id: 1, name: 'Alice Johnson', status: 'present' },
    { id: 2, name: 'Bob Smith', status: 'absent' },
    { id: 3, name: 'Carol Brown', status: 'present' }
  ];

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '2rem',
        borderRadius: '1rem',
        maxWidth: '600px',
        width: '90%'
      }}>
        <h2 style={{ marginBottom: '1rem' }}>📊 Attendance Tracker</h2>
        <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>
          Session: {session?.title || 'Sample Session'}
        </p>
        
        <div style={{ marginBottom: '2rem' }}>
          {students.map(student => (
            <div 
              key={student.id}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '0.75rem',
                marginBottom: '0.5rem',
                backgroundColor: '#f9fafb',
                borderRadius: '0.375rem'
              }}
            >
              <span>{student.name}</span>
              <span style={{
                padding: '0.25rem 0.75rem',
                borderRadius: '1rem',
                fontSize: '0.75rem',
                backgroundColor: student.status === 'present' ? '#d1fae5' : '#fee2e2',
                color: student.status === 'present' ? '#065f46' : '#991b1b'
              }}>
                {student.status}
              </span>
            </div>
          ))}
        </div>
        
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
          <button
            onClick={onClose}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#c55c5c',
              color: 'white',
              border: 'none',
              borderRadius: '0.375rem',
              cursor: 'pointer'
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default AttendanceTracker;
