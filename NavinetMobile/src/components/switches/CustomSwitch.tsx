import React, {useState} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';

interface ICustomSwitch {
    selectionMode: any;
    option1: any;
    option2: any;
    onSelectSwitch: any;
}
const CustomSwitch = (props: ICustomSwitch) => {
    const {selectionMode, option1, option2, onSelectSwitch} = props;
    const [getSelectionMode, setSelectionMode] = useState(selectionMode);

    const updateSwitchData = value => {
        setSelectionMode(value);
        onSelectSwitch(value);
    };

    return (
        <View
            style={{
                height: 44,
                width: '100%',
                backgroundColor: '#e4e4e4',
                borderRadius: 10,
                borderColor: '#1ba16e',
                flexDirection: 'row',
                justifyContent: 'center',
            }}>
            <TouchableOpacity
                activeOpacity={1}
                onPress={() => updateSwitchData(1)}
                style={{
                    flex: 1,
                    backgroundColor: getSelectionMode == 1 ? '#1ba16e' : '#e4e4e4',
                    borderRadius: 10,
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>
                <Text
                    style={{
                        color: getSelectionMode == 1 ? 'white' : '#1ba16e',
                        fontSize: 14,
                    }}>
                    {option1}
                </Text>
            </TouchableOpacity>
            <TouchableOpacity
                activeOpacity={1}
                onPress={() => updateSwitchData(2)}
                style={{
                    flex: 1,
                    backgroundColor: getSelectionMode == 2 ? '#1ba16e' : '#e4e4e4',
                    borderRadius: 10,
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>
                <Text
                    style={{
                        color: getSelectionMode == 2 ? 'white' : '#1ba16e',
                        fontSize: 14,
                    }}>
                    {option2}
                </Text>
            </TouchableOpacity>
        </View>
    );
}

export default CustomSwitch;
