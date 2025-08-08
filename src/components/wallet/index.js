//mui components
import { Box, Card } from "@mui/material";

//custom components
import Menuback from "../menuback";
import Text from "../custom-components/Text";
import Heading from "../custom-components/Heading";

//styles
import "./index.css";
import { useSelector } from "react-redux";
import { getStoreType } from "../../redux/reducers/miscReducer";

const Wallet = () => {
  const retailType = useSelector(getStoreType);
  return (
    <Box>
      <Menuback head={true} text="My Wallet" />
      <Box mt={8}>
        <img
          className="wallet-image"
          src="https://tse2.mm.bing.net/th?id=OIP.RYOMsJzB_0vMi40zPbSHBQHaHa&pid=Api&P=0&h=180"
          alt="error"
        />
        <Box className="wallet-balance-box">
          <Heading
            text={"BALANCE : "}
            fontsize={18}
            fontweight={600}
            tint="grey"
          />
          <Heading
            text={"₹0"}
            fontsize={18}
            fontweight={600}
            tint={retailType === "RESTAURANT" ? "black" : "rgb(12, 121, 36)"}
          />
        </Box>
        <Card className="wallet-gift-card">
          <Box>
            <Text text="Gift Card" tint="#dc5454" />
            <Text text="balance: ₹1000" tint="grey" />
          </Box>
        </Card>
      </Box>
    </Box>
  );
};

export default Wallet;
