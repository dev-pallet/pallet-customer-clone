//mui components
import { Box, Stack } from "@mui/material"

//custom components
import Text from "../custom-components/Text";
import Menuback from "../menuback";

//styles
import "./index.css";
import { useSelector } from "react-redux";
import { getUserData } from "../../redux/reducers/userReducer";
import { colorConstant } from "../../constants/colors";

const Support = () => {
    const user = useSelector(getUserData) || JSON.parse(localStorage.getItem("@user"));

    const SupportArray = [
        { label: "Sales", mob: "+91-8174616600" },
        { label: "Other support", mob: "+91-817476616599" },
        { label: "Support Mail", mob: "support@palletnow.co" }
    ]
    return (
        <Box>
            <Menuback  head={true} text="Support" bg={colorConstant.baseBackground} wishlist={user?.name && true}/>
            <Box mt={8} p={2}>
                {SupportArray?.map((e, i) => (
                    <Stack direction="row" p={.5}>
                        <Text text={e.label + " :"} />
                        <Text className="support-list-box" text={e.mob} />
                    </Stack>
                ))}
            </Box>
        </Box>
    )
}

export default Support;