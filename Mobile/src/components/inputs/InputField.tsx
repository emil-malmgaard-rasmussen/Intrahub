import React from 'react';
import {View, Text, TouchableOpacity, TextInput} from 'react-native';
import CloseSvg from '../../assets/misc/CloseSvg';
import useThemeContext from '../../theme/useThemeContext.ts';

interface IInputField {
    label: string;
    icon: any;
    inputType: string;
    onChange: any;
    value: any;
    onBlur: any;
    keyboardType?: any;
    fieldButtonLabel?: string;
    fieldButtonFunction?: any;
    error?: any
}


const InputField = (props: IInputField) => {
    const { label, fieldButtonLabel, fieldButtonFunction, inputType, keyboardType, icon, onChange, value, onBlur, error } = props;
    const {colors} = useThemeContext();
    const handleClear = () => {
        onChange('');
    };

    const renderTextInput = () => {
        switch (inputType) {
            case "row":
                return (
                    <TextInput
                        onChangeText={onChange}
                        value={value}
                        onBlur={onBlur}
                        placeholder={label}
                        keyboardType={keyboardType}
                        style={{ width: 150}}
                        placeholderTextColor={error ? 'red' : '#C6C6C6'}
                    />
                )
            case "zipcode":
                return (
                    <TextInput
                        onChangeText={onChange}
                        value={value}
                        onBlur={onBlur}
                        placeholder={label}
                        keyboardType={keyboardType}
                        style={{width: 70}}
                        placeholderTextColor={error ? 'red' : '#C6C6C6'}
                    />
                )
            case "password":
                return (
                    <TextInput
                        onChangeText={onChange}
                        value={value}
                        onBlur={onBlur}
                        placeholder={label}
                        keyboardType={keyboardType}
                        style={{ flex: 1, paddingVertical: 0 }}
                        placeholderTextColor={error ? 'red' : '#C6C6C6'}
                        secureTextEntry={true}
                    />
                )
            default:
                return (
                    <TextInput
                        onChangeText={onChange}
                        value={value}
                        onBlur={onBlur}
                        placeholder={label}
                        keyboardType={keyboardType}
                        placeholderTextColor={error ? 'red' : '#C6C6C6'}
                        style={{ flex: 1, paddingVertical: 0 }}
                    />
                )
        }
    }

    return (
        <View style={{ flexDirection: 'row', alignItems: "center", borderBottomColor: error ? 'red' : '#ccc', borderBottomWidth: 1, paddingBottom: 8, marginBottom: 25 }}>
            {icon}
            {renderTextInput()}
            {value && (
                <TouchableOpacity onPress={handleClear}>
                        <CloseSvg color={error ? "red" : "#C6C6C6"} />
                </TouchableOpacity>
            )}
            <TouchableOpacity onPress={fieldButtonFunction}>
                <Text style={{ color: colors.button.main, fontWeight: '700', paddingLeft: 10}}>{fieldButtonLabel}</Text>
            </TouchableOpacity>
        </View>
    );
};

export default InputField;
