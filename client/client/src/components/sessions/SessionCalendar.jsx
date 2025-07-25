const SessionCalendar = ({ sessions, onSessionClick }) => {
  return (
    <div style={{
      backgroundColor: 'white',
      padding: '2rem',
      borderRadius: '1rem',
      textAlign: 'center'
    }}>
      <h2 style={{ marginBottom: '1rem' }}>📅 Session Calendar</h2>
      <p style={{ color: '#6b7280', marginBottom: '2rem' }}>
        Calendar view coming soon...
      </p>
      <div style={{
        padding: '3rem',
        backgroundColor: '#f3f4f6',
        borderRadius: '0.5rem',
        border: '2px dashed #d1d5db'
      }}>
        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📅</div>
        <p>Interactive calendar will be added here</p>
      </div>
    </div>
  );
};

export default SessionCalendar;
