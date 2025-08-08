//react
import { useNavigate } from "react-router-dom";

//mui components
import { Box } from "@mui/material";

//custom components
import Text from "../custom-components/Text";
import Menuback from "../menuback";

//data
import { termsOfUseData } from "./termsofuse";

//images
import logo from "../../assets/images/twinleaves.png"

//styles
import "./index.css"
import { colorConstant } from "../../constants/colors";
import { useSelector } from "react-redux";
import { getUserData } from "../../redux/reducers/userReducer";


const TermsOfUse = () => {

    const navigate = useNavigate();
    const user = useSelector(getUserData) || JSON.parse(localStorage.getItem("@user"));

    return (
        <Box>
            <Menuback margin={false} head={false} bg={colorConstant.baseBackground} wishlist={user?.name && true}/>
            <Box className="twinleaves-logo-box" my={8} mt={8}>
                <img className="twinleaves-logo" src={logo} alt="Error" />
            </Box>
            <Box mt={4} p={2}>
                {termsOfUseData.map((e, i) => (
                    <Box key={i}>
                        <Text text={e.text} fontsize={i === 0 ? 19 : 16} fontweight={500} />
                    </Box>
                ))}
                <Box>
                    <Text className="aboutus-nav-links" text="Terms of Use" fontsize={16} fontweight={500} onClick={() => navigate("/aboutus/termsofuse")} />
                    <Text className="aboutus-nav-links" text="Privacy Policy" fontsize={16} fontweight={500} onClick={() => navigate("/aboutus/privacypolicy")} />
                </Box>
            </Box>
        </Box>
    )
}

export default TermsOfUse;