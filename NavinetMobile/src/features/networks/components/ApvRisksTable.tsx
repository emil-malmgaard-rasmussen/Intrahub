import React, {useState, useEffect, useMemo, useCallback} from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Text,
} from 'react-native';

export const ApvRisksTable = ({data}: any) => {
  const scrollableColumns = useMemo(
    () => [
      'Risiko',
      'Beskrivelse',
      'Foreby',
      'Profit',
      'Inventory',
      'Rating',
      'Category',
      'Supplier',
      'Margin',
    ],
    [],
  );
  const fixedColumn = useMemo(() => ['Name'], []);
  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    setTableData(data);
  }, [data]);


  const renderTableHeader = useCallback(
    (columns, isFixedHeader) => (
      <View style={styles.tableHeader}>
        {columns.map((column, index) => (
          <TouchableOpacity
            key={index}
            style={
              isFixedHeader ? styles.columnHeaderName : styles.columnHeader
            }>
            <View style={{flexDirection: 'row'}}>
              <Text style={styles.columnHeaderTxt}>{column + ' '}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    ),
    [],
  );

  return (
    <View style={styles.container}>
      <View style={styles.rowContainer}>
        <FlatList
          horizontal={true}
          data={tableData}
          ListHeaderComponent={renderTableHeader(fixedColumn, true)}
          keyExtractor={(item, index) => index + ''}
          renderItem={({item}: any) => {
            return (
              <View style={styles.rowContainer}>
                <Text style={styles.columnRowTxtName}>{item.name}</Text>
              </View>
            );
          }}
        />

        <ScrollView horizontal>
          <FlatList
            data={tableData}
            keyExtractor={(item, index) => index + ''}
            ListHeaderComponent={renderTableHeader(scrollableColumns, false)}
            renderItem={({item}: any) => {
              return (
                <View style={styles.rowContainer}>
                  <Text style={styles.columnRowTxt}>{item.assessment}</Text>
                  <Text style={styles.columnRowTxt}>{item.description}</Text>
                  <Text style={styles.columnRowTxt}>{item.preventiveMeasures}</Text>
                </View>
              );
            }}
          />
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  columnHeaderName: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#D9D9D9',
    paddingHorizontal: 12,
    paddingVertical: 8,
    width: 100,
  },
  columnHeader: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#D9D9D9',
    paddingHorizontal: 12,
    paddingVertical: 8,
    width: 88,
  },
  columnHeaderTxt: {
    fontWeight: '600',
    fontSize: 12,
    lineHeight: 20,
    color: 'black',
    fontFamily: 'RedHatDisplay-Bold',
  },
  columnRowTxt: {
    width: 88,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 20,
    color: '#3C492C',
    height: 38,
    fontFamily: 'RedHatDisplay-Medium',
  },
  columnRowTxtName: {
    width: 100,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 18,
    color: '#3C492C',
    height: 38,
    fontFamily: 'RedHatDisplay-Bold',
  },
  container: {
    alignItems: 'center',
    backgroundColor: 'white',
    justifyContent: 'center',
    padding: 16,
    width: '100%',
  },
  tableHeader: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  rowContainer: {
    flexDirection: 'row',
  },
  arrowImage: {
    height: 16,
    width: 16,
    top: 2,
  },
});

export default ApvRisksTable;
