import NavBar from "../Chunks/NavBar";
import home from "../style/Home.module.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";



const Services = () => {

    

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

      







     









    
    






    
   
        <section style={{marginTop: "7rem"}} className={[home["block"], home["container"]].join(' ')}>
          
             <article style={{marginBottom: 0, marginTop: 0}} className={[home["grid"], home["grid--1x2"], home["feature"]].join(' ')}>
                <div className={home["feature__content"]} >
                    <span className={home["icon-container"]} >
                        <svg className={[home["icon"], home["icon--primary"]].join(' ')}>
                            <use href="../images/sprite.svg#student"></use>
                          </svg>
                    </span>
                    <h3 className={home["features__heading"]} >Student Management</h3>
                    <p>
                  Easily register and manage student profiles. Each student gets a personal dashboard with login access using their registration number. 
                  They can view their results. </p>
                       
                </div>
        
                  <div   className={home["feature__content"]} >
                    <span className={home["icon-container"]} >
                        <svg className={[home["icon"], home["icon--primary"]].join(' ')}>
                            <use href="../images/sprite.svg#teacher"></use>
                          </svg>
                    </span>
                    <h3 className={home["features__heading"]} >Teacher Management</h3>
                    <p>
                  Assign subjects, manage classrooms, and give teachers personalized access. Teachers also log in using their registration number, with the ability to enter scores, 
                  view performance history, and update their password from their dashboard. </p>
                      
                </div>
               
             </article>

             
               <article  style={{margin: 0}} className={[home["grid"], home["grid--1x2"], home["feature"]].join(' ')}>
                <div className={home["feature__content"]} >
                    <span className={home["icon-container"]} >
                        <svg className={[home["icon"], home["icon--primary"]].join(' ')}>
                            <use href="../images/sprite.svg#result"></use>
                          </svg>
                    </span>
                    <h3 className={home["features__heading"]} > Result Processing</h3>
                    <p>
                Generate and calculate student results using a modern, automated system. Results are based on configurable scores like First CA, 
                Second CA, and Exams — all calculated in seconds with high accuracy. </p>
                       
                </div>
        
                  <div className={home["feature__content"]} >
                    <span className={home["icon-container"]} >
                        <svg className={[home["icon"], home["icon--primary"]].join(' ')}>
                            <use href="../images/sprite.svg#session"></use>
                          </svg>
                    </span>
                    <h3 className={home["features__heading"]} > Session Management</h3>
                    <p>
                Create, update, and organize academic sessions and terms with ease. 
                Set up each academic year’s structure to match your school’s system — everything stays neat, trackable, and reusable. </p>
                      
                </div>
               
             </article>


            <article style={{margin: 0}} className={[home["grid"], home["grid--1x2"], home["feature"]].join(' ')}>
                <div className={home["feature__content"]} >
                    <span className={home["icon-container"]} >
                        <svg className={[home["icon"], home["icon--primary"]].join(' ')}>
                            <use href="../images/sprite.svg#subscription"></use>
                          </svg>
                    </span>
                    <h3 className={home["features__heading"]} >Enjoy 90 Days Free</h3>
                    <p>
                 Get full access to all features completely free for the first 90 days. No upfront payment, no commitment. 
                 Try Miqwii Manager with your actual school data before deciding to subscribe. </p>
                       
                </div>
        
                  <div className={home["feature__content"]} >
                    <span className={home["icon-container"]} >
                        <svg className={[home["icon"], home["icon--primary"]].join(' ')}>
                            <use href="../images/sprite.svg#score"></use>
                          </svg>
                    </span>
                    <h3 className={home["features__heading"]} >Score Sheet Generation</h3>
                    <p>
               Easily generate and download printable score sheets for each class, subject, or session.
                Useful for internal reviews, teacher records, and offline use. </p>
                      
                </div>
               
             </article>


              <article style={{margin: 0}} className={[home["grid"], home["grid--1x2"], home["feature"]].join(' ')}>
                <div className={home["feature__content"]} >
                    <span className={home["icon-container"]} >
                        <svg className={[home["icon"], home["icon--primary"]].join(' ')}>
                            <use href="../images/sprite.svg#fee"></use>
                          </svg>
                    </span>
                    <h3 className={home["features__heading"]} >Fee Management</h3>
                    <p>
              Track and manage school fees digitally. Generate PDF receipts, 
              view payment history, and keep all financial records organized without paperwork. </p>
                       
                </div>
        
                  <div className={home["feature__content"]} >
                    <span className={home["icon-container"]} >
                        <svg className={[home["icon"], home["icon--primary"]].join(' ')}>
                            <use href="../images/sprite.svg#school"></use>
                          </svg>
                    </span>
                    <h3 className={home["features__heading"]} >Activation Control</h3>
                    <p>
               Control when teachers can or cannot enter student scores. 
               Admins can activate or disable score entry for CA or Exams to maintain data accuracy and prevent unauthorized edits. </p>
                      
                </div>
               
             </article>
        
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
                            <li onClick={() => navigateToRegister()}><a href="#">Create Account</a></li>
                            <li onClick={() => navigateToLogin()}><a href="#">Login</a></li>
                            <li onClick={() => navigateToAboutUs()}><a href="#">About Us</a></li>
                            <li onClick={() => navigateToContactUs()}><a href="#">Contact Us</a></li>
                            <li onClick={() => navigateToService()}><a href="#">Service</a></li>
                        </ul>
                    </div>
                
                </section>
          
                  <section className={[home["collapsible"], home[collapsible4], home["footer__section"]].join(' ')}>
                    <header className={home["collapsible__header"]}>
                        <h2 className={[home["collapsible__heading"], home["footer__heading"]].join(' ')}>Contact US</h2>
                        <span onClick={() => handleCollapsible4()} className={home["icon-container"]}>
                            <svg className={[home["icon"], home["icon--primary"], home["icon--white"], home["collapsible--chevron"]].join(' ')}>
                                <use href="../images/sprite.svg#chevron"></use>
                              </svg>
                        </span>
                    </header>
                    
                
                    <div className={home["collapsible__content"]}>
                       <p>
                        Address: Off Numan Road Opp. Road Safety Office, 
                        Behind Nyako's Quaters Jimeta-Yola Adamawa State Nigeria.
                     </p>
        
                     <p>
                        Tel: +2348169863672, +2348033314662
                    </p>
                     <p>
                        {/* Mail: miqwiitechnologies@gmail.com */}
                    </p>
                     <p>
                        WhatsApp: +2348169863672
                    </p>
        
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

export default Services;