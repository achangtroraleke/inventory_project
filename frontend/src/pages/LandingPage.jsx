import CTAFooter from "../components/CTAFooter";
import FeatureSection from "../components/FeatureSection";
import HeroSection from "../components/HeroSection";

const LandingPage = ()=>{
    return(
           <div className="min-h-screen bg-white">
            <HeroSection/>
            <FeatureSection/>
            <CTAFooter/>
           </div>
    )
}
export default LandingPage;