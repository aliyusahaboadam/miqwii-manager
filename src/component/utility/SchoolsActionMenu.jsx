import MoreVertIcon from '@mui/icons-material/MoreVert';
import { IconButton, Typography } from "@mui/material";
import MenuItem from '@mui/material/MenuItem';

import { useState } from 'react';
import Menu from '@mui/material/Menu';
import dashboard from '../style/dashboard/SchoolDashboard.module.css';
import { 

    Dialog,
    DialogActions,
 
    Button
  } from '@mui/material'

const  SchoolsActionMenu = ({ row, onDelete, onEdit,  onView, onActivation }) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
   
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
     };
    
      const handleClose = () => {
        setAnchorEl(null);
      };
    
      const handleDeleteClick = () => {
        setDeleteDialogOpen(true);
        handleClose();
      };
    
      const handleConfirmDelete = () => {
        onDelete(row.id);
        setDeleteDialogOpen(false);
      };
    
      const handleCancelDelete = () => {
        setDeleteDialogOpen(false);
      };
    
      const handleEdit = () => {
        onEdit(row.id);
        handleClose();
      };

      const handleViewDetails = () => {
        onView(row.id);
        handleClose();
      };


      const handleActivation = () => {
        onActivation(row.id);
        handleClose();
      };
  
    return (
        <>
        <IconButton
          aria-label="more"
          aria-controls="action-menu"
          aria-haspopup="true"
          onClick={handleClick}
        >
          <MoreVertIcon   sx={{fontSize: 30}} />
        </IconButton>
        
        {/* Menu with options */}
        <Menu
          id="action-menu"
          anchorEl={anchorEl}
          keepMounted
          open={open}
          onClose={handleClose}


         
                    MenuListProps={{
                      'aria-labelledby': 'long-button',
                    }}
                    slotProps={{
                      paper: {
                        style: {
                          
                          borderRadius: '8px',
                          boxShadow: '0 0 20px 10px #f3f3f3'
                        },
                      },
                    }}
            
                    
        >
          <MenuItem  style={{fontSize: 17}}  onClick={handleEdit}>Edit</MenuItem>
          <MenuItem style={{fontSize: 17}} onClick={handleDeleteClick}>Delete</MenuItem>
          <MenuItem style={{fontSize: 17}} onClick={handleViewDetails}>Details</MenuItem>
          <MenuItem style={{fontSize: 17}} onClick={handleActivation}>Activator</MenuItem>
        </Menu>
  
        {/* Delete Confirmation Dialog */}

         <Dialog
               open={deleteDialogOpen}
               onClose={handleCancelDelete}
                BackdropProps={{
                  sx: { backgroundColor: "rgba(157, 152, 202, 0.5)" }, // Darker overlay
                }}
        
                sx={{
                  "& .MuiDialog-paper": {
                    width: '100%',
                    borderRadius: "15px", // Optional: Rounded corners
                  },
                }}
              
              >
        
           
        
                  <div style={{width: '100%', background: '#fff'}} class={[dashboard['card--alert-error']].join(' ')}>
                  <div class={dashboard['card_body']}>
        
        
                  <span class={dashboard['icon-container']}>
                          <svg class={[dashboard['icon--big'], dashboard['icon--error']].join(' ')}>
                              <use href="/images/sprite.svg#success-icon"></use>
                            </svg>
                      </span>
                      <Typography
                      
                       sx={{
             fontSize: 20,
             color: '#9a99ac',
                   }}
                      >
                         <p  class={dashboard['alert-message']} >Are you sure you want to delete {row.schoolName}?</p>
                      </Typography>
                   
                   
                   
                  </div>
                 
                </div>
        
                <DialogActions  style={{ padding: '1.5rem  3rem 1.5rem 3rem', display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}} >
  <Button 
  style={{fontSize: 15}} 
  onClick={handleCancelDelete}   
  sx={{ 
    borderRadius: '15px',
    color: '#fff',
    backgroundColor: '#388E3C',    // Your desired color
    '&:hover': {
      backgroundColor: '#2f7533',  // Optional: darker shade for hover
    }
  }}>
    Cancel
  </Button>
  <Button 
  style={{fontSize: 15}} 
  onClick={handleConfirmDelete} 
  sx={{ 
    borderRadius: '15px',
    color: '#fff',
    backgroundColor: '#F44336',    // Your desired color
    '&:hover': {
      backgroundColor: '#bd3228',  // Optional: darker shade for hover
    }
  }}
  autoFocus
  >
    Delete
  </Button>
</DialogActions>
                    
                   
              </Dialog>

        {/* <Dialog
          open={deleteDialogOpen}
          onClose={handleCancelDelete}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{"Confirm Deletion"}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Are you sure you want to delete {row.name}?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCancelDelete} color="primary">
              Cancel
            </Button>
            <Button onClick={handleConfirmDelete} color="primary" autoFocus>
              Delete
            </Button>
          </DialogActions>
        </Dialog> */}
      </>
    );
  }


  export default SchoolsActionMenu;
  



//   <DialogActions>
//   <Button onClick={handleCancelDelete} color="primary">
//     Cancel
//   </Button>
//   <Button onClick={handleConfirmDelete} color="primary" autoFocus>
//     Delete
//   </Button>
// </DialogActions>