import {View, Text, Platform, Linking} from 'react-native';
import React from 'react';
import {getAsyncStorageData} from '../Middleware/AsyncStorage';
import {constantsWOTranslation} from '../utils/Constant/Constants';
var RNFS = require('react-native-fs');
const useBlobDownload = () => {
  const downloadPDF = async (byteArray, filename) => {
    // console.log(typeof byteArray, {byteArray});
    try {
      const path = `${RNFS.DocumentDirectoryPath}/${filename}.pdf`;
      // Create a folder if it doesn't exist
      await RNFS.mkdir(RNFS.DocumentDirectoryPath, 'pdf')
        .then(res => {
          // console.log({res});
        })
        .catch(error => {
          // console.log({error});
        }); // Ignore already existing folder errors

      // Write the byte array to the file path
      await RNFS.writeFile(path, byteArray, 'base64')
        .then(res => {
          // console.log('Write', {res});
        })
        .catch(e => console.log({e}));

      const url = `file://${path}`;
      if (Linking.canOpenURL(url)) {
        await Linking.openURL(url);
      }
    } catch (error) {
      console.error('Error downloading PDF:', error);
    }
  };

  return {
    downloadPDF,
  };
};

export default useBlobDownload;
