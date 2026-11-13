import { Box, CircularProgress, Divider, Paper, Typography } from '@mui/material';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { clearSelectedExam, getTeacherExamById } from '../../redux/reducer/cbtSlice';

const ExamDetails = () => {
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
    <Box sx={{ p: 4, background: '#f9f9f9', minHeight: '100vh' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography sx={{ color: '#0e387a', fontSize: 30, fontWeight: 700 }}>
          {exam.name}
        </Typography>
  
      </Box>

      <Paper sx={{ p: 3, mb: 3, borderRadius: '15px' }}>
        <Typography sx={{ color: '#0e387a', fontSize: 22, fontWeight: 700, mb: 2 }}>
          Exam Info
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
          <Typography sx={{ fontSize: 18 }}><b>Exam No:</b> {exam.examNo}</Typography>
          <Typography sx={{ fontSize: 18 }}><b>Slot:</b> {exam.assessmentSlot}</Typography>
          <Typography sx={{ fontSize: 18 }}><b>Class:</b> {exam.className}</Typography>
          <Typography sx={{ fontSize: 18 }}><b>Subject:</b> {exam.subjectName}</Typography>
          <Typography sx={{ fontSize: 18 }}><b>Duration:</b> {exam.durationMinutes} mins</Typography>
          <Typography sx={{ fontSize: 18 }}><b>Total Questions:</b> {exam.totalQuestions}</Typography>
          <Typography sx={{ fontSize: 18 }}><b>From:</b> {exam.availableFrom}</Typography>
          <Typography sx={{ fontSize: 18 }}><b>Until:</b> {exam.availableUntil}</Typography>
          <Typography sx={{ fontSize: 18 }}><b>Status:</b> {exam.status}</Typography>
        </Box>
      </Paper>

      <Paper sx={{ p: 3, borderRadius: '15px' }}>
        <Typography sx={{ color: '#0e387a', fontSize: 22, fontWeight: 700, mb: 2 }}>
          Questions ({exam.questions?.length || 0})
        </Typography>
        <Divider sx={{ mb: 2 }} />

        {(exam.questions || []).map((q, i) => (
          <Box
            key={i}
            sx={{
              mb: 3,
              p: 2,
              borderLeft: '4px solid #0e387a',
              background: '#f9f9f9',
              borderRadius: '8px',
            }}
          >
            <Typography sx={{ fontSize: 18, fontWeight: 600, mb: 1.5 }}>
              {i + 1}. {q.questionText}
            </Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1 }}>
              {(q.options || []).map((o, j) => (
                <Typography
                  key={j}
                  sx={{
                    fontSize: 16,
                    color: o.isCorrect ? '#2e7d32' : '#555',
                    fontWeight: o.isCorrect ? 700 : 400,
                  }}
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

export default ExamDetails;