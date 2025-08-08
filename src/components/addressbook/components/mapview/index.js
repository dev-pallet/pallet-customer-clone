//react
import React from 'react';

//google maps api
import { LoadScript } from '@react-google-maps/api';

//styles
import './index.css';

//custom components
import Map from './map';
import Menuback from '../../../menuback';

//mui componenets
import { Box } from '@mui/material';
import { GOOGLE_MAP_API_KEY } from './../../../../constants/api-key';
import { useLocation } from 'react-router-dom/dist';
import { colorConstant } from '../../../../constants/colors';

//google maps api key


const MapView = () => {
  const location = useLocation();
  const {state} = location;
  return (
    <Box>
      <Menuback  head={true} text="Choose Delivery Location" bg={colorConstant.baseBackground} wishlist={true}/>
        <Map zoom={18} state={state}/>
    </Box>
  );
}

export default MapView;
