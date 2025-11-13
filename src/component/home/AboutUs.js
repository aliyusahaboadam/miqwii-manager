import NavBar from "../Chunks/NavBar";
import home from "../style/Home.module.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";



const AboutUs = () => {

    

    const [collapsible1, setCollapsible1] = useState("");
    const [collapsible2, setCollapsible2] = useState("");
    const [collapsible3, setCollapsible3] = useState("");
    const [collapsible4, setCollapsible4] = useState("");
    const navigate = useNavigate();


 const navigateToRegister = () => {
    navigate("/school/register");
  }

  const navigateToLogin = () => {
    navigate("/school/login");
  }

  const navigateToService = () => {
    navigate("/services");
  }

  const navigateToAboutUs = () => {
    navigate("/about-us");
  }


   const navigateToContactUs = () => {
    navigate("/contact-us");
  }


     const handleCollapsible1 = () => {
        if (collapsible1 === ""){
            setCollapsible1("collapsible--expanded")
        } else {
            setCollapsible1("")
        }
     }

      const handleCollapsible2 = () => {

         if (collapsible2 === ""){
            setCollapsible2("collapsible--expanded")
        } else {
            setCollapsible2("")
        }
        
     }

      const handleCollapsible3 = () => {
        
         if (collapsible3 === ""){
            setCollapsible3("collapsible--expanded")
        } else {
            setCollapsible3("")
        }
     }

      const handleCollapsible4 = () => {
         if (collapsible4 === ""){
            setCollapsible4("collapsible--expanded")
        } else {
            setCollapsible4("")
        }
     }

    return(
        <>
         <NavBar/> 

   
       <section style={{marginTop: "7rem"}} className={[home["block"], home["block-showcase"]].join(' ')}>

            <header className={home["block__header"]}>
               <h2>About Us</h2>
            </header>
        
            
              
               
              <ul className={home["list"]}>
                <li>
                    <div className={home["media"]}>
                 
                    <div className={home["media__body"]} >
                       
                      <p style={{textAlign: "center"}}>
                       Miqwii Manager is an all in one school management portal founded by Aliyu Sahabo Adam designed to simplify and strengthen how educational institutions operate. Whether you're running a small private school or a large secondary institution, Miqwii Manager provides the tools you need to manage students, staff, results, and communication — all in one secure platform.

We believe school administrators, teachers, and parents deserve a system that works with them, not against them. That's why Miqwii is built to be user-friendly, flexible, and powerful — so schools can focus less on paperwork and more on what truly matters: student success.

Our solution offers three tailored packages — Miqwii Lite, Miqwii Standard, and Miqwii Enterprise — so institutions of all sizes can benefit, no matter their needs or budget.
                      </p>
                    </div>
                </div>
            </li>



               
        
              </ul>
       
        
        </section>
        <section>
        <footer className={[home["block"], home["block--primary"], home["footer"]].join(' ')} >
            <div className={[home["container"], home["grid"], home["footer__sections"]].join(' ')} >
            
        
                <section className={[home["collapsible"], home[collapsible2],  home["footer__section"]].join(' ')}>
                    <header className={home["collapsible__header"]}>
                        <h2 className={[home["collapsible__heading"], home["footer__heading"]].join(' ')}>Services</h2>
                        <span onClick={() => handleCollapsible2()} className={home["icon-container"]}>
                            <svg className={[home["icon"], home["icon--primary"], home["icon--white"], home["collapsible--chevron"]].join(' ')}>
                                <use href="../images/sprite.svg#chevron"></use>
                              </svg>
                        </span>
                    </header>
                    
                
                   
                    <div className={home["collapsible__content"]}>
                        <ul className={home["list"]} >
                            <li>Bulk Result Generation</li>
                            <li>Student Analytics</li>
                            <li>Manage  records, results</li>
                            <li>Assessments</li>
                            <li>Student performance</li>
                            <li>Full CA & exam result management</li>
                            <li>Advanced analytics</li>
                            <li>Core management tools</li>
                            <li>Many More</li>
                           
                        </ul>
                    </div>
                
                </section>
        
                 <section className={[home["collapsible"], home[collapsible3],  home["footer__section"]].join(' ')}>
                    <header className={home["collapsible__header"]}>
                        <h2 className={[home["collapsible__heading"], home["footer__heading"]].join(' ')}>LINKS</h2>
                        <span onClick={() => handleCollapsible3()} className={home["icon-container"]}>
                            <svg className={[home["icon"], home["icon--primary"], home["icon--white"], home["collapsible--chevron"]].join(' ')}>
                                <use href="../images/sprite.svg#chevron"></use>
                              </svg>
                        </span>
                    </header>
                    
                
                     <div className={home["collapsible__content"]}>
                        <ul className={home["list"]} >
                            <li onClick={() => navigateToRegister()}><a >Create Account</a></li>
                            <li onClick={() => navigateToLogin()}><a >Login</a></li>
                            <li onClick={() => navigateToAboutUs()}><a >About Us</a></li>
                            <li onClick={() => navigateToContactUs()}><a >Contact Us</a></li>
                            <li onClick={() => navigateToService()}><a >Service</a></li>
                        </ul>
                    </div>
                
                </section>
          
                <section className={home["footer__brand"]}>
                    <img src="/images/logo.png" alt=""/>
                    <p className={home["footer__copyright"]}>Copyright 2025 MIQWII, All Rights Reserved To The Owners</p>
                </section>
            </div>
        
        </footer>
        
     </section>
     

        </>
      

    );

}

export default AboutUs;