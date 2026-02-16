
import ResumeNavbar from "@/components/resume/ResumeNavbar";

const ResumeProof = () => {
    // Redirect to actual proof page
    if (typeof window !== 'undefined') {
        window.location.href = "/rb/proof";
    }
    return null;
};

export default ResumeProof;
