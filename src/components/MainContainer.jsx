import React, { lazy, Suspense, useEffect, useState, useRef } from "react";
import About from "./About.jsx";
import Experience from "./Experience.jsx";
import Contact from "./Contact.jsx";
import Cursor from "./Cursor.jsx";
import Landing from "./Landing.jsx";
import Navbar from "./Navbar.jsx";
import SocialIcons from "./SocialIcons.jsx";
import WhatIDo from "./WhatIDo.jsx";
import Work from "./Work.jsx";
import setSplitText from "./utils/splitText.js";
import { setCharTimeline, setAllTimeline } from "./utils/GsapScroll.js";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const TechStack = lazy(() => import("./TechStack.jsx"));

const MainContainer = ({ children }) => {
  const [isDesktopView, setIsDesktopView] = useState(
    window.innerWidth > 1024
  );
  const characterRef = useRef(null);
  const cameraRef = useRef(null);

  useEffect(() => {
    const resizeHandler = () => {
      setSplitText();
      setIsDesktopView(window.innerWidth > 1024);
      ScrollTrigger.refresh();
    };
    resizeHandler();
    window.addEventListener("resize", resizeHandler);
    return () => {
      window.removeEventListener("resize", resizeHandler);
    };
  }, [isDesktopView]);

  // Initialize GSAP animations when character is loaded
  useEffect(() => {
    const initializeAnimations = () => {
      // Set up character scroll animations
      if (characterRef.current && cameraRef.current) {
        setCharTimeline(characterRef.current, cameraRef.current);
      }
      
      // Set up other scroll animations
      setAllTimeline();
      
      // Refresh ScrollTrigger
      ScrollTrigger.refresh();
    };

    // Delay initialization to ensure all components are mounted
    const timer = setTimeout(initializeAnimations, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  // Function to pass character and camera refs to children
  const enhancedChildren = children && typeof children === 'object' 
    ? React.cloneElement(children, { 
        onCharacterLoad: (character, camera) => {
          characterRef.current = character;
          cameraRef.current = camera;
          // Re-initialize animations when character loads
          setTimeout(() => {
            if (character && camera) {
              setCharTimeline(character, camera);
              ScrollTrigger.refresh();
            }
          }, 500);
        }
      })
    : children;

  return (
    <div className="container-main">
      <Cursor />
      <Navbar />
      <SocialIcons />
      {isDesktopView && enhancedChildren}
      <div id="smooth-wrapper">
        <div id="smooth-content">
          <div className="container-main">
            <Landing>{!isDesktopView && enhancedChildren}</Landing>
            <About />
            <WhatIDo />
            <Experience />
            <Work />
            {isDesktopView && (
              <Suspense fallback={<div>Loading....</div>}>
                <TechStack />
              </Suspense>
            )}
            <Contact />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainContainer;