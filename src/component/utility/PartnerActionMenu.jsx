import MoreVertIcon from '@mui/icons-material/MoreVert';
import { IconButton } from "@mui/material";
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useState } from 'react';

const PartnerActionMenu = ({ row, onEdit, onView }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (e) => setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);
  const handleEdit = () => { onEdit(row.id); handleClose(); };
  const handleView = () => { onView(row.id); handleClose(); };

  return (
    <>
      <IconButton aria-label="more" onClick={handleClick}>
        <MoreVertIcon sx={{ fontSize: 30 }} />
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        keepMounted
        open={open}
        onClose={handleClose}
        MenuListProps={{ 'aria-labelledby': 'long-button' }}
        slotProps={{
          paper: {
            style: {
              borderRadius: '8px',
              boxShadow: '0 0 20px 10px #f3f3f3',
            },
          },
        }}
      >
        <MenuItem style={{ fontSize: 17 }} onClick={handleView}>View</MenuItem>
        <MenuItem style={{ fontSize: 17 }} onClick={handleEdit}>Edit</MenuItem>
      </Menu>
    </>
  );
};

export default PartnerActionMenu;