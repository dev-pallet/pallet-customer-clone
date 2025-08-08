//mui components
import { Box } from "@mui/material"

//custom components
import Menuback from "../menuback";

//style
import "./index.css"

//images
import img from "../../assets/images/Coming-soon-icon.png";

const Notifications = () => {
    return (
        <Box>
            <Menuback  head={true} text="Notification Preferences" />
            <Box mt={8} margin={"auto"} height="100vh">
                <img className="coming-soon-image" src={img} />
            </Box>
        </Box>
    )
}

export default Notifications;