import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getActiveExam } from '../../redux/reducer/cbtSlice';
import dashboard from '../style/dashboard/SchoolDashboard.module.css';

const CbtStudentDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // Get real data from Redux
  const { activeExam, status, error } = useSelector((state) => state.cbt);

  useEffect(() => {
    // Fetch from backend on mount
    dispatch(getActiveExam());
  }, [dispatch]);

  const handleStartExam = () => {
    // Navigate to the exam page, passing the exam ID
    navigate(`/cbt/exam/${activeExam.id}`);
  };

  if (status === 'loading') return <div style={{ padding: '2rem' }}>Checking for active exams...</div>;

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <h2 style={{ color: 'var(--color-primary)', marginBottom: '2rem' }}>Welcome to CBT Exams</h2>
      
      {activeExam ? (
        <div className={dashboard['card--alert-success']} style={{ padding: '2rem', textAlign: 'center' }}>
          <h3>Active Exam Found!</h3>
          <p style={{ fontSize: '1.8rem', margin: '1rem 0' }}>
            <strong>{activeExam.name}</strong> ({activeExam.subjectId})
          </p>
          <p>Duration: {activeExam.durationMinutes} Minutes</p>
          <button 
            className={[dashboard['btn'], dashboard['btn--primary']].join(' ')}
            onClick={handleStartExam}
            style={{ marginTop: '1rem' }}
          >
            Start Exam Now
          </button>
        </div>
      ) : (
        <div className={dashboard['card--notice']} style={{ padding: '2rem', textAlign: 'center' }}>
          <h3>No Exam Assigned</h3>
          <p>There are no active CBT exams assigned to your class at this time.</p>
          {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
      )}
    </div>
  );
};

export default CbtStudentDashboard;