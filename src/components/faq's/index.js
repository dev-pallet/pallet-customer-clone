//mui components
import { Box } from "@mui/material"

//custom components
import Menuback from "../menuback";

//icons
import AddIcon from '@mui/icons-material/Add';

//styles
import "./index.css";
import { colorConstant } from "../../constants/colors";
import Text from "../custom-components/Text";
import { useSelector } from "react-redux";
import { getUserData } from "../../redux/reducers/userReducer";
import { FaqText } from "./faqText";

const FAQ = () => {
    const user = useSelector(getUserData) || JSON.parse(localStorage.getItem("@user"));

    return (
        <Box>
            <Menuback  head={true} text="Frequently Asked Questions" bg={colorConstant.baseBackground} wishlist={user?.name && true}/>
            <Box mt={8} p={1}>
                {/* <Box className="wrapper-input-box" my={3}>
                    <input
                        tabIndex={-1}
                        id="search-input"
                        className="search-input"
                        placeholder="Ask here..."
                        type="text"
                    />
                    <AddIcon className="plus-icon" />
                </Box> */}
                {FaqText.map((e, i) => (
                  <Box key={i}>
                    {e.text==="" ? <br/> : <Text text={e.text} /> }       
                  </Box>
                ))}
            </Box>

        </Box>
    )
}

export default FAQ;