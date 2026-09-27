// File: src/component/promotion/RepeatStudentDialog.jsx
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from "@mui/material";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { repeatStudent } from "../../redux/reducer/promotionSlice";

/**
 * Confirmation dialog for holding a single student back.
 *
 * Props:
 *   open            boolean
 *   student         { id, firstname, surname, lastname, regNo }
 *   className       current class name (display only)
 *   onClose()       close handler
 *   onSuccess()     called after backend confirms
 */
const RepeatStudentDialog = ({ open, student, className, onClose, onSuccess }) => {
    const dispatch = useDispatch();
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);

    const handleConfirm = async () => {
        setSubmitting(true);
        setError(null);
        try {
            await dispatch(repeatStudent({ studentId: student.id })).unwrap();
            setSubmitting(false);
            if (onSuccess) onSuccess();
            onClose();
        } catch (err) {
            setSubmitting(false);
            setError(err?.message || "Failed to repeat student");
        }
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            BackdropProps={{ sx: { backgroundColor: "rgba(157, 152, 202, 0.5)" } }}
            sx={{ "& .MuiDialog-paper": { width: '100%', maxWidth: 460, borderRadius: '15px' } }}
        >
            <DialogTitle sx={{ fontSize: 20 }}>Hold student back?</DialogTitle>
            <DialogContent>
                <Typography sx={{ fontSize: 16, color: '#444', mb: 1 }}>
                    <strong>{student?.firstname} {student?.surname} {student?.lastname}</strong>
                    {" "}({student?.regNo}) will repeat <strong>{className}</strong> in the next session.
                </Typography>
                <Typography sx={{ fontSize: 14, color: '#666' }}>
                    They will not be promoted, and a new enrollment will be created in the same class for the target session.
                </Typography>
                {error && (
                    <Typography sx={{ fontSize: 14, color: 'crimson', mt: 2 }}>
                        {error}
                    </Typography>
                )}
            </DialogContent>
            <DialogActions style={{ padding: '1rem 2rem', justifyContent: 'space-between' }}>
                <Button
                    onClick={onClose}
                    disabled={submitting}
                    sx={{ borderRadius: '15px', color: '#fff', backgroundColor: '#6b7280', '&:hover': { backgroundColor: '#4b5563' } }}
                >
                    Cancel
                </Button>
                <Button
                    onClick={handleConfirm}
                    disabled={submitting}
                    sx={{ borderRadius: '15px', color: '#fff', backgroundColor: '#0e387a', '&:hover': { backgroundColor: '#0c3371' } }}
                >
                    {submitting ? "Repeating..." : "Yes, Repeat"}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default RepeatStudentDialog;