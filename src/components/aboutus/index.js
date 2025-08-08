//react
import { useNavigate } from "react-router-dom";

//mui components
import { Box, Card } from "@mui/material"

//custom components
import Menuback from "../menuback";
import Text from "../custom-components/Text";

//icons
import { BsBoxArrowUpRight } from "react-icons/bs";

//style
import "./index.css";

const AboutUs = () => {

    const navigate = useNavigate()

    const aboutArray = [
        { label: "Privacy Policy", path: "/aboutus/privacypolicy" },
        { label: "Terms of Use", path: "/aboutus/termsofuse" }
    ];
    return (
        <Box>

                <Menuback  head={true} text="About Us"/>
            <Box mt={8} p={1.5}>
                {aboutArray?.map((e, i) => (
                    <Card className="about-us-card" key={i} onClick={() => navigate(e.path)}>
                        <Text text={e.label} />
                        <BsBoxArrowUpRight />
                    </Card>
                ))}
            </Box>
        </Box>
    )
}

export default AboutUs;