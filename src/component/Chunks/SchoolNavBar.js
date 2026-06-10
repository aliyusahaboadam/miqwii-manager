import navbar from '../style/chunks/SchoolNavBar.module.css';
import { useState } from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import { IconButton } from '@mui/material';


const SchoolNavBar = () =>{

  const [open, setOpen] = useState(false);

  const toggleDrawer = (value) => () => {
    setOpen(value);
  };


  const DrawerList = (
    <Box sx={{ width: 300 }} role="presentation" onClick={toggleDrawer(false)}>
      <List>

      <ul className={[navbar["list"], navbar["drawer__list"], navbar[""]].join(' ')}>
        
        <li className={navbar["nav__item"]}><a href="##">  <span class={[navbar["badge"], navbar["badge--secondary"], navbar['list--badge']].join(' ')}>Home</span></a></li>
          <li className={navbar["nav__item"]}><a href="##">Service</a></li>
          <li className={navbar["nav__item"]}><a href="##">About Us</a></li>
          <li className={navbar["nav__item"]}><a href="##">Contact Us</a></li>
          <li className={navbar["nav__item"]}><a href="##">pricing</a></li>
          <li className={navbar["nav__item"]}><a href="##">About us</a></li>
         
          <li className={navbar["nav__item"]}>
           
          <button className={[navbar['btn'], navbar['btn--icon']].join(' ')}>
              <svg className={[navbar["icon"], navbar["icon--white"]].join(' ')}>
                  <use href="/images/sprite.svg#rocket"></use>
                </svg>
              Get Started
          </button>

          </li>
          
         
        </ul>
      
      </List>
    </Box>
  );






    return (
        
 <div className={[navbar['nav'], navbar['collapsible']].join(' ')}>
    <div className={navbar['menu_plus_logo']}>
             <IconButton onClick={toggleDrawer} color="inherit">
   
    <div onClick={toggleDrawer(true)} className={[navbar["collapsible__icon"], navbar["menu"]].join(' ')}>
   <svg  className={[navbar["icon"], navbar["icon--primary"], navbar["nav__toggler"], navbar[""]].join(' ')}>
      <use href="/images/sprite.svg#menu"></use>
      </svg>  
    </div>
     </IconButton>

        <a className={[navbar["logo__link"], navbar["logo"]].join(' ')} href="#"><img src="/images/logo.png" alt="miqwii logo"/></a>
      
    </div>

     


      
  <div className={[navbar["icon"], navbar["icon--primary"], navbar["nav__toggler"], navbar[""]].join(' ')}>
   <p>Bilsag</p>
  </div> 

  <div onClick={toggleDrawer(true)} className={navbar["collapsible__icon"]}>
  <svg  className={[navbar["icon"], navbar["icon--primary"], navbar["nav__toggler"], navbar[""]].join(' ')}>
      <use href="/images/sprite.svg#menu"></use>
      </svg>  
  </div>

   
      <Drawer sx={{ 
          "& .MuiBackdrop-root": {
            backgroundColor: "rgba(157, 152, 202, 0.3)", // Transparent backdrop
          }, }} 
       open={open}
       onClose={toggleDrawer(false)}>
        {DrawerList}
      </Drawer>
           
          <ul className={[navbar["list"], navbar["nav__list"], navbar[""]].join(' ')}>
        
          <li className={navbar["nav__item"]}><a href="##">  <span class={[navbar["badge"], navbar["badge--secondary"], navbar['list--badge']].join(' ')}>Home</span></a></li>
            <li className={navbar["nav__item"]}><a href="##">Service</a></li>
            <li className={navbar["nav__item"]}><a href="##">About Us</a></li>
            <li className={navbar["nav__item"]}><a href="##">Contact Us</a></li>
            <li className={navbar["nav__item"]}><a href="##">pricing</a></li>
            <li className={navbar["nav__item"]}><a href="##">About us</a></li>
           
            <li className={navbar["nav__item"]}>
             
            <button className={[navbar['btn'], navbar['btn--icon']].join(' ')}>
                <svg className={[navbar["icon"], navbar["icon--white"]].join(' ')}>
                    <use href="/images/sprite.svg#rocket"></use>
                  </svg>
                Get Started
            </button>

            </li>
            
           
          </ul>



          
    </div>
    );
    
    }
export default SchoolNavBar;

 