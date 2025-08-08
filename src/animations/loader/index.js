//mui components
import { Box } from "@mui/material"


//json data
import animationData from "../../assets/animation-json/order.json"
import Lottie from "react-lottie"

const Loader = () => {

    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: animationData,
        renderer: 'svg'
    }

    return (
        <Box>
            <Lottie
                options={defaultOptions}
                height={500}
                width={500}
            />

        </Box>
    )
}

export default Loader;