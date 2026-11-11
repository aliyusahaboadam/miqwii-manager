import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Button, Dialog, DialogActions, IconButton, Typography } from "@mui/material";
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useState } from 'react';
import dashboard from '../style/dashboard/SchoolDashboard.module.css';

const CbtExamListActionMenu = ({ row, onDelete, onEdit, onDetails }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const handleClick = (e) => setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);
  const handleDeleteClick = () => { setDeleteDialogOpen(true); handleClose(); };
  const handleConfirmDelete = () => { onDelete(row.id); setDeleteDialogOpen(false); };
  const handleEdit = () => { onEdit(row.id); handleClose(); };
  const handleDetails = () => { onDetails(row.id); handleClose(); };

  return (
    <>
      <IconButton onClick={handleClick}>
        <MoreVertIcon sx={{ fontSize: 30 }} />
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        slotProps={{ paper: { style: { borderRadius: '8px', boxShadow: '0 0 20px 10px #f3f3f3' } } }}
      >
        <MenuItem style={{ fontSize: 17 }} onClick={handleDetails}>Details</MenuItem>
        <MenuItem style={{ fontSize: 17 }} onClick={handleEdit}>Edit</MenuItem>
        <MenuItem style={{ fontSize: 17 }} onClick={handleDeleteClick}>Delete</MenuItem>
      </Menu>

      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        sx={{ "& .MuiDialog-paper": { width: '100%', borderRadius: "15px" } }}
      >
        <div style={{ width: '100%', background: '#fff' }} className={dashboard['card--alert-error']}>
          <div className={dashboard['card_body']}>
            <Typography sx={{ fontSize: 20, color: '#9a99ac' }}>
              <p className={dashboard['alert-message']}>
                Are you sure you want to delete {row.name}?
              </p>
            </Typography>
          </div>
        </div>
        <DialogActions style={{ padding: '1.5rem 3rem', display: 'flex', justifyContent: 'space-between' }}>
          <Button onClick={() => setDeleteDialogOpen(false)}
            sx={{ borderRadius: '15px', color: '#fff', backgroundColor: '#388E3C',
                  '&:hover': { backgroundColor: '#2f7533' } }}>
            Cancel
          </Button>
          <Button onClick={handleConfirmDelete}
            sx={{ borderRadius: '15px', color: '#fff', backgroundColor: '#F44336',
                  '&:hover': { backgroundColor: '#bd3228' } }}
            autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default CbtExamListActionMenu;