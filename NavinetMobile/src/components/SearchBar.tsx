import React, {useState} from 'react';
import { Platform, StyleSheet, TextInput, TouchableOpacity, View } from "react-native";
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import CloseSvg from '../assets/misc/CloseSvg';

const SearchBar = ({ data, setData, showBottomSheet}) => {
    const [isFocused, setIsFocused] = useState(false);

    const handleSearch = (query) => {
        setData(query);
    };

    const clearSearch = () => {
        setData('');
    };

    return (
        <View style={styles.searchContainer}>
            <View style={[styles.search, isFocused && styles.searchFocused]}>
                <MaterialIcons
                    name="search"
                    size={20}
                    color="#C6C6C6"
                    style={{ marginRight: 5 }}
                />
                <TextInput
                    placeholder="Søg..."
                    placeholderTextColor="#C6C6C6"
                    value={data}
                    onChangeText={handleSearch}
                    style={styles.textInput}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                />
                {data !== '' && (
                    <TouchableOpacity onPress={clearSearch}>
                        <CloseSvg color={"#C6C6C6"} />
                    </TouchableOpacity>
                )}
            </View>
            {/*<TouchableOpacity onPress={showBottomSheet} style={styles.filterContainer}>*/}
            {/*    <FontAwesome5 name="filter" color="#ccc" size={25} style={styles.filter} />*/}
            {/*</TouchableOpacity>*/}
        </View>
    );
};

const styles = StyleSheet.create({
    searchContainer: {
        flexDirection: 'row',
        height: Platform.OS === "android" ? 60 : 50
    },
    search: {
        flexDirection: 'row',
        borderColor: '#C6C6C6',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 10,
        paddingVertical: 8,
        flex: 1,
        alignItems: 'center',
    },
    searchFocused: {
        borderColor: '#1b6cc8',
    },
    textInput: {
        flex: 1,
        marginLeft: 5,
        color: 'black',
    },
    filterContainer: {
        flex: 1 / 5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    filter: {},
});

export default SearchBar;
