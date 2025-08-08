import React, { useState, useEffect } from 'react';
import { Drawer, Box } from '@mui/material';
import CloseSharpIcon from '@mui/icons-material/CloseSharp';
import Lottie from 'react-lottie';
import useNetworkStatus from '../../../../custom hooks/networkStatus';
import Text from '../../../custom-components/Text';
import networkStatus from "../../../../assets/animation-json/internet.json";

const NoInternet = () => {
  const [drawerState, setDrawerState] = useState(false);
  const isOnline = useNetworkStatus();

  useEffect(() => {
    setDrawerState(!isOnline);
  }, [isOnline]);

  const animationOptions = {
    loop: true,
    autoplay: true,
    animationData: networkStatus,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const toggleDrawer = (val) => {
    setDrawerState(val);
  };
  return (
    <Drawer
      anchor={"bottom"}
      open={drawerState}
      PaperProps={{ sx: { height: "60%", background: "transparent" } }}
    >
      <CloseSharpIcon 
        className="drawer-cancel-button" 
        onClick={() => setDrawerState(false)}
      />
      <Box
        p={2}
        className="drawer-main-box"
        height="auto"
        sx={{ overflowY: "scroll" }}
      >
        <Box className="network-status-offline" display="flex" flexDirection="column" alignItems="center">
          <Lottie options={animationOptions} height={200} width={200} />
          <Text text={"No Connectivity!"} tint="red" fontSize={15} />
          <Text
            text="Seems like your internet connection is down"
            tint="slategrey"
            fontSize={13}
          />
          <Text
            text="Please turn on your internet connection"
            fontSize={18}
            tint="black"
            textAlign="center"
          />
        </Box>
      </Box>
    </Drawer>
  );
};

export default NoInternet;
