import NavBar from "../Chunks/NavBar";
import home from "../style/Home.module.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";



const Home = () => {

    

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

          <section style={{marginTop: "6rem"}}  className={[home["block"], home["container"]].join(' ')}>
        <div className={[home['grid'], home['grid--1x2']].join(' ')}>
      
          <header style={{marginTop: "-2rem"}} className={[home["block__header"], home["hero__content"]].join(' ')}>
            <h2  >From Chalk to Cloud!</h2>
            <p className={[home["hero__tagline"], home["p"]].join(' ')}>
               Miqwii School Management opens doors, not just one but three —
                For schools, teachers, and learners. A single platform, 
                Each user guided by their own chart.
    
            </p>
               <a onClick={() => navigateToRegister()} className={[home["btn"], home["btn--primary"], home["btn--stretched"], home["btn--hero"]].join(' ')}>Get Started</a>
          </header>
          <picture>
      
            {/* <source
            type="image/webp"
            srcset="/images/Banner@1x.webp 1x, /images/Banner@2x.webp 2x"
            />
      
            <source
            type="image/png"
            srcset="/images/Banner@1x.png 1x, /images/Banner@2x.png 2x"
            /> */}
            <img className={home["hero__image"]} src="/images/miqwii-banner.png" alt=""/>
      
          </picture>
         
        </div>
      
      
      </section>







         <section className={[home["block"], home["container"], home["block-domain"]].join(' ')}>
        <header className={home["block__header"]}>
            <h2 className={home["block__heading"]}>Three Roles, One Vision</h2>
            <p>
                Logins for all, secure and refined, With dashboards that suit every curious mind.
Whether you lead, teach, or learn with pride, Miqwii walks with you, side by side..</p>
        </header>
    
        <div className={home["input-group"]}>
          
            <input 
            type="text" 
            className="input"
            placeholder="Miqwii Manager"/>
    
            <button className={[home["btn"], home["btn--accent"]].join(' ')}>
                <svg  className={[home["icon"], home["icon--white"]].join(' ')}>
                    <use href="../images/sprite.svg#search"></use>
                  </svg>
                Search
            </button>
        </div>
        <ul className={[home["list"], home["block-domain__prices"]].join(' ')}>
            <li><span className={[home["badge"], home["badge--secondary"]].join(' ')}>Roles</span></li>
            <li>School</li>
            <li>Teacher</li>
            <li>Student</li>

            
        </ul>
     </section>










        <section className={[home["block"], home["container"], home["block-plans"]].join(' ')}>
            <div className={[home["grid"], home["grid--1x3"]].join(' ')}>
        
             <div className={home["plan"]}>
                 <div className={[home["card"], home["card--secondary"]].join(' ')}>
                     <header className={home["card_header"]} >
                        <h3 className={home["plan__name"]} >Miqwii Lite</h3>
                        <span className={home["plan__price"]} >1x</span>
                        <span className={home["plan__billing-cycle"]} >/Size</span>
                        <span className={[home["badge"], home["badge--secondary"], home["badge--small"]].join(' ')}>Students</span>
                        <span className={home["plan__description"]}>0 - 500 Student Capacity</span>
             
                     </header>
                     <div className={home["card_body"]}>
                         <ul className={[home["list"], home["list--tick"]].join(' ')}>
                             <li className={home["list__item"]}>New or Small School Starting Digital Management</li>
                             <li className={home["list__item"]}>School under 500 Student</li>
                             <li className={home["list__item"]}>Limited Staff Account</li>

                         </ul>
                         <button onClick={() => navigateToRegister()} className={[home["btn"], home["btn--outline"], home["btn--block"]].join(' ')}>Get Started</button>
                     </div>
                   </div>
             
             </div>
        
        
             <div className={[home["plan"], home["plan--popular"]].join(' ')}>
                 <div className={[home["card"], home["card--primary"]].join(' ')}>
                     <header className={home["card_header"]}>
                        <h3 className={home["plan__name"]}>Miqwii Standard</h3>
                        <span className={home["plan__price"]} >3x</span>
                        <span className={home["plan__billing-cycle"]}>/Size</span>
                        <span className={[home["badge"], home["badge--primary"], home["badge--small"]].join(' ')}>Students</span>
                        <span className={home["plan__description"]}>300 - 1000 Capacity</span>
             
                     </header>
                     <div className={home["card_body"]}>
                         <ul className={[home["list"], home["list--tick"]].join(' ')}>
                               <li className={home["list__item"]}>Medium-sized school</li>
                             <li className={home["list__item"]}>Expanding schools needing automation</li>
                             <li className={home["list__item"]}>Unlimited Staff Account</li>
                            
                         </ul>
                         <button onClick={() => navigateToRegister()} className={[home["btn"], home["btn--outline"], home["btn--block"]].join(' ')}>Get Started</button>
                     </div>
                   </div>
             
             </div>
        
        
             <div className={home["plan"]}>
                 <div className={[home["card"], home["card--secondary"]].join(' ')}>
                     <header className={home["card_header"]} >
                        <h3 className={home["plan__name"]}>Miqwii Enterprise</h3>
                        <span className={home["plan__price"]} >7x</span>
                        <span className={home["plan__billing-cycle"]}>/Size</span>
                        <span className={[home["badge"], home["badge--secondary"], home["badge--small"]].join(' ')}>Students</span>
                        <span className={home["plan__description"]} >1000 -  2000+ Capacity</span>
             
                     </header>
                     <div className={home["card_body"]}>
                         <ul className={[home["list"], home["list--tick"]].join(' ')}>
                             <li className={home["list__item"]}>Large School Groups</li>
                             <li className={home["list__item"]}>Unlimited Users Account</li>
                             <li className={home["list__item"]}>2000 Plus Student</li>
                            
                         </ul>
                         <button onClick={() => navigateToRegister()} className={[home["btn"], home["btn--outline"], home["btn--block"]].join(' ')}>Get Started</button>
                     </div>
                   </div>
             
             </div>
          </div>
         </section>
         
    






    
     <section>
        <section className={[home["block"], home["container"]].join(' ')}>
            <header className={home["block__header"]}>
                <h2>Try, Test, and Trust — Free for 90 Days</h2>
                <p>
            Miqwii Automatically draws the line,
And places you in the plan that’s fine.

🌱 Miqwii Lite for schools just born,
Small in size, but big each dawn.

🌿 Miqwii Standard for growing halls,
With hundreds walking through the calls.

🌳 Miqwii Enterprise when numbers soar,
For schools with many dreams </p>
            </header>
        
            <article className={[home["grid"], home["grid--1x2"], home["feature"]].join(' ')}>
                <div className={home["feature__content"]} >
                    <span className={home["icon-container"]} >
                        <svg className={[home["icon"], home["icon--primary"]].join(' ')} >
                            <use href="../images/sprite.svg#team"></use>
                          </svg>
                    </span>
                    <h3 className={home["features__heading"]} >Strong Team Support</h3>
                    <p>
                       Backed by a Strong Team, Built for Simplicity
At Miqwii Manager, you're never alone.
 Behind the platform is a dedicated team of developers, educators, and support professionals working to ensure everything runs smoothly for your school.
                        </p>
                        <a onClick={() => navigateToService()} className={home["link-arrow"]} >Learn More</a>
                </div>
        
                <picture>
                    <source
                      type="image/webp"
                      srcset="/images/team@1x.webp 1x, /images/team@2x.webp"
                    />
        
                    <source
                    type="image/png"
        
                    srcset="/images/team@1x.png 1x, /images/team@2x.png"
                    />
                    <img className={home["feature__image"]} src="/images/team@1x.png" alt=""/>
                </picture>
               
             </article>
        
        
             <article className={[home["grid"], home["grid--1x2"], home["feature"]].join(' ')}>
                <div className={home["feature__content"]} >
                    <span className={home["icon-container"]} >
                        <svg className={[home["icon"], home["icon--primary"]].join(' ')}>
                            <use href="../images/sprite.svg#easy"></use>
                          </svg>
                    </span>
                    <h3 className={home["features__heading"]} >Designed for Simplicity</h3>
                    <p>
                        Quick onboarding and simple controls to manage sessions, results, fees, and more

Whether you're managing 50 students or 5,000, Miqwii Manager is built to work for you — simply, securely, and efficiently.
                        </p>
                        <a onClick={() => navigateToService()} className={home["link-arrow"]}>Learn More</a>
                </div>
        
                <picture>
                    <source
                      type="image/webp"
                      srcset="/images/target@1x.webp 1x, /images/target@2x.webp"
                    />
        
                    <source
                    type="image/png"
        
                    srcset="/images/target@1x.png 1x, /images/target@2x.png"
                    />
                    <img className={home["feature__image"]} src="/images/target@1x.png" alt=""/>
                </picture>
               
             </article>
        
        </section>
     </section>









        <section>
        <section className={[home["block"], home["block--primary"], home["block--skewed-rigth"], home["block-showcase"]].join(' ')}>

            <header className={home["block__header"]}>
               <h2>Insight & Growth Overview</h2>
            </header>
        
            <div className={[home["grid"], home["grid--1x2"]].join(' ')}>
                <picture className={home["block-showcase__image"]}>
                    <source
                     type="image/webp"
                     srcset="/images/ipad@1x.webp 1x, /images/ipad@2x.webp 2x"
                    />
        
                    <source
                     type="image/png"
                     srcset="/images/ipad@1x.png 1x, /images/ipad@2x.png 2x"
                    />
                    <img  src="/images/ipad@1x.png" alt=""/>
                </picture>
               
              <ul className={home["list"]}>
                <li>
                    <div className={home["media"]}>
                    <div className={home["media__image"]}>
                        <svg className={[home["icon"], home["icon--white"]].join(' ')}>
                            <use href="../images/sprite.svg#snap"></use>
                          </svg>
                    </div>
                    <div className={home["media__body"]} >
                        <h3 className={home["media__title"]}>Smart Insights </h3>
                      <p>
                        Get real-time information on school activities, student progress, and system performance. With our intuitive interface, everything you need is just a glance away.
                      </p>
                    </div>
                </div>
            </li>
                <li>
                    <div className={home["media"]}>
                    <div className={home["media__image"]}>
                        <svg className={[home["icon"], home["icon--white"]].join(' ')}>
                            <use href="../images/sprite.svg#graph"></use>
                          </svg>
                    </div>
                 <div className={home["media__body"]} >
                        <h3 className={home["media__title"]}>Growth Analytics </h3>
                      <p>
                        Track your institution’s growth with easy-to-read bar chart analytics. From student enrollment trends to usage reports, Miqwii helps you visualize your progress and make smarter decisions.
                      </p>
                    </div>
                </div>
               </li>
          
        
              </ul>
            </div>
        
        </section>
     </section>








       <section>
        <section className={home["block"]} >
            <header className={home["block__header"]}>
                <h2>Real feedback. Real impact.</h2>
                <p>
                    What Our Customers Are Saying
                </p>
            </header>

             <div className={home["container"]}>
                <div className={[home["card"], home["testimonial"]].join(' ')}>
                    <div className={[home["grid"], home["grid--1x2"]].join(' ')} >
                     <div className={home["testimonial__image"]}>
                         <img  src="/images/hammaaminu.jpg" alt="A happy smiling customer"/>
                        <span className={home["icon-container"]}>
                             <svg className={[home["icon"], home["icon--primary"], home["icon--small"]].join(' ')} >
                                 <use href="../images/sprite.svg#quote"></use>
                               </svg>
                         </span>
                
                        
                     </div>
                     
                     <blockquote className={home["quote"]}>
                         <p className={home["quote__text"]} >Parents are more involved now because everything is transparent and easy to access.</p>  
                       
                     
                             <footer>
                                 <div className={home["media"]}>
                                     {/* <div className={home["media__image"]} >
                                         <svg className={[home["icon"], home["icon--secondary"], home["quote__line"]].join(' ')}>
                                             <use href="../images/sprite.svg#hyphen"></use>
                                           </svg>
                                     </div> */}
                                      <div className={home["media__body"]}>
                                         <h3 className={[home["media__title"], home["quote__author"]].join(' ')} >AL-AMIN SAHABO</h3>
                                       <p className={home["quote__organization"]}>BOT Ray of Shunshine.</p>
                                     </div>
                                 </div>
                             </footer>
                     </blockquote>
                    </div>
                
                </div>
            </div>

            <div className={home["container"]}>
                <div className={[home["card"], home["testimonial"]].join(' ')}>
                    <div className={[home["grid"], home["grid--1x2"]].join(' ')} >
                     <div className={home["testimonial__image"]}>
                         <img  src="/images/saadan.jpg" alt="A happy smiling customer"/>
                        <span className={home["icon-container"]}>
                             <svg className={[home["icon"], home["icon--primary"], home["icon--small"]].join(' ')} >
                                 <use href="../images/sprite.svg#quote"></use>
                               </svg>
                         </span>
                
                        
                     </div>
                     
                     <blockquote className={home["quote"]}>
                          <p className={home["quote__text"]} >It's like having an entire admin team in one portal. Simple, smart, and time-saving..</p>
                             <footer>
                                 <div className={home["media"]}>
                                     <div className={home["media__image"]} >
                                         <svg className={[home["icon"], home["icon--secondary"], home["quote__line"]].join(' ')}>
                                             <use href="../images/sprite.svg#hyphen"></use>
                                           </svg>
                                     </div>
                                     <div className={home["media__body"]}>
                                         <h3 className={[home["media__title"], home["quote__author"]].join(' ')} >SA’AD ADAMU ESQ</h3>
                                       <p className={home["quote__organization"]}>Founder Sadan Global & CO.</p>
                                     </div>
                                 </div>
                             </footer>
                     </blockquote>
                    </div>
                
                </div>
            </div>

             <div className={home["container"]}>
                <div className={[home["card"], home["testimonial"]].join(' ')}>
                    <div className={[home["grid"], home["grid--1x2"]].join(' ')} >
                     <div className={home["testimonial__image"]}>
                         <img  src="/images/aminu.jpg" alt="A happy smiling customer"/>
                        <span className={home["icon-container"]}>
                             <svg className={[home["icon"], home["icon--primary"], home["icon--small"]].join(' ')} >
                                 <use href="../images/sprite.svg#quote"></use>
                               </svg>
                         </span>
                
                        
                     </div>
                     
                     <blockquote className={home["quote"]}>
                         <p className={home["quote__text"]} >Clean designed, smooth perfomance, it's the best school management we've tried  so far.</p>
                     
                             <footer>
                                 <div className={home["media"]}>
                                     <div className={home["media__image"]} >
                                         <svg className={[home["icon"], home["icon--secondary"], home["quote__line"]].join(' ')}>
                                             <use href="../images/sprite.svg#hyphen"></use>
                                           </svg>
                                     </div>
                                     <div className={home["media__body"]}>
                                         <h3 className={[home["media__title"], home["quote__author"]].join(' ')} >AMINU ADAMZ</h3>
                                       <p className={home["quote__organization"]}>Founder Raan Study.</p>
                                     </div>
                                 </div>
                             </footer>
                     </blockquote>
                    </div>
                
                </div>
            </div>
        </section>
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

export default Home;