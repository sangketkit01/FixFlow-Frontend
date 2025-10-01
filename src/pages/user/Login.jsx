import { LeftSection } from "../../../components/user/Login/LeftSection"
import { RightSection } from "../../../components/user/Login/RightSection"

const LoginPage = () => {
    return (
        
        <div className="flex w-full min-h-screen">
            <div className="flex-1 flex items-center justify-center">
                <LeftSection />
            </div>
            <div className="flex-1 flex items-center justify-center">
                <RightSection />
            </div>
        </div>
    );
};


export default LoginPage