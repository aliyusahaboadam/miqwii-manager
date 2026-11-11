import { Box, Button, CircularProgress, Divider, Paper, Typography } from '@mui/material';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { clearSelectedExam, getTeacherExamById } from '../../redux/reducer/cbtSlice';

const TeacherExamDetails = () => {
  const { examId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { selectedExam, status } = useSelector((s) => s.cbt);

  useEffect(() => {
    if (examId) dispatch(getTeacherExamById(examId));
    return () => dispatch(clearSelectedExam());
  }, [examId, dispatch]);

  if (status === 'loading' || !selectedExam) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 6 }}>
        <CircularProgress />
      </Box>
    );
  }

  const exam = selectedExam;

  return (
    <Box sx={{ p: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4" sx={{ color: '#0e387a' }}>{exam.name}</Typography>
        <Button variant="outlined" onClick={() => navigate('/cbt/teacher/list')}>Back</Button>
      </Box>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" sx={{ color: '#0e387a', mb: 2 }}>Exam Info</Typography>
        <Divider sx={{ mb: 2 }} />
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
          <Typography><b>Exam No:</b> {exam.examNo}</Typography>
          <Typography><b>Slot:</b> {exam.assessmentSlot}</Typography>
          <Typography><b>Class:</b> {exam.className}</Typography>
          <Typography><b>Subject:</b> {exam.subjectName}</Typography>
          <Typography><b>Duration:</b> {exam.durationMinutes} mins</Typography>
          <Typography><b>Total Questions:</b> {exam.totalQuestions}</Typography>
          <Typography><b>From:</b> {exam.availableFrom}</Typography>
          <Typography><b>Until:</b> {exam.availableUntil}</Typography>
          <Typography><b>Status:</b> {exam.status}</Typography>
        </Box>
      </Paper>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ color: '#0e387a', mb: 2 }}>
          Questions ({exam.questions?.length || 0})
        </Typography>
        <Divider sx={{ mb: 2 }} />
        {(exam.questions || []).map((q, i) => (
          <Box key={i} sx={{ mb: 3, p: 2, borderLeft: '4px solid #0e387a', background: '#f9f9f9' }}>
            <Typography sx={{ fontWeight: 600, mb: 1 }}>{i + 1}. {q.questionText}</Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1 }}>
              {(q.options || []).map((o, j) => (
                <Typography
                  key={j}
                  sx={{ color: o.isCorrect ? '#2e7d32' : '#555', fontWeight: o.isCorrect ? 700 : 400 }}
                >
                  {o.optionLabel}. {o.optionText} {o.isCorrect ? ' ✔' : ''}
                </Typography>
              ))}
            </Box>
          </Box>
        ))}
      </Paper>
    </Box>
  );
};

export default TeacherExamDetails;