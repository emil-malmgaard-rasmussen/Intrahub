import React from 'react';
import {StyleSheet, View} from 'react-native';
import Pdf from 'react-native-pdf';

const PDFViewer = ({pdfUri}) => {
  return (
    <View style={styles.container}>
      <Pdf
        source={{uri: pdfUri, cache: true}}
        onError={error => {
          console.log(error);
        }}
        style={styles.pdf}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1},
  pdf: {flex: 1},
});

export default PDFViewer;
