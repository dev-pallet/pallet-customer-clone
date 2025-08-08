import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Drawer, Box } from '@mui/material';
import CloseSharpIcon from '@mui/icons-material/CloseSharp';
import CustomImage from '../../../../Payment/component/CustomImage';
import Heading from '../../../custom-components/Heading';
import CustomText from '../../../../Payment/component/CustomText';
import StyledButton from '../../../custom-components/Button';
import { getDeliveryAddress } from '../../../../redux/reducers/userReducer';

const ProvideLocation = () => {
  const [locationState, setLocationState] = useState(false);
  const address = useSelector(getDeliveryAddress);
  const navigate = useNavigate();

  useEffect(() => {
    setLocationState(address == null);
  }, [address]);

  const toggleLocation = () => {
    setLocationState(!locationState);
  };

  return (
    <Drawer
      anchor={'bottom'}
      open={locationState}
      onClose={() => setLocationState(false)}
      PaperProps={{ sx: { height: "60%", background: "transparent" } }}
    >
      <CloseSharpIcon className="drawer-cancel-button" onClick={() => setLocationState(false)} />
      <Box
        p={2}
        className="drawer-main-box"
        height="50vh"
        sx={{ overflowY: "scroll" }}
      >
        <CustomImage
          source={require('../../../../assets/images/Location.png').default}
          alt="Location"
          style={{
            width: "80%",
            maxWidth: '250px',
            height: window.innerHeight / 3.5,
            margin: "auto",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        />
        <Heading text={`Can't find you!`} fontSize={16} textAlign="center" margin='6px' />
        <CustomText
          w="70%"
          textAlign="center"
          wrap
          text={'Please provide accurate location for accurate and hassle free delivery'}
          tint
        />
        <div style={{ margin: "6px", display: "flex", justifyContent: "center", alignItems: "center" }}>
          <StyledButton
            onClick={() => {
              navigate('/address-book');
              setLocationState(false);
            }}
            text="Provide Location"
            variant="outlined"
            clr="white"
            bg="#0f8241"
            border="1px solid #3e3f48"
            width="210px"
            margin="6px"
            borderRadius="1rem"
            textTransform='capitalize'
          />
        </div>
      </Box>
    </Drawer>
  );
};

export default ProvideLocation;
