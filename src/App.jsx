import { lazy, Suspense, useEffect } from "react";
import "./App.css";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/ScrollSmoother";

const CharacterModel = lazy(() => import("./components/Character/index.jsx"));
const MainContainer = lazy(() => import("./components/MainContainer.jsx"));
import { LoadingProvider } from "./context/LoadingProvider";

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

const App = () => {
  useEffect(() => {
    // Initialize GSAP ScrollTrigger refresh on resize
    const handleResize = () => {
      ScrollTrigger.refresh();
    };

    window.addEventListener("resize", handleResize);
    
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <>
      <LoadingProvider>
        <Suspense fallback={<div>Loading...</div>}>
          <MainContainer>
            <Suspense fallback={<div>Loading Character...</div>}>
              <CharacterModel />
            </Suspense>
          </MainContainer>
        </Suspense>
      </LoadingProvider>
    </>
  );
};

export default App;