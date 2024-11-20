import React from 'react';
import {View, Text, TouchableOpacity, Image} from 'react-native';
import {SCREEN_WIDTH} from '../../utils/Dimensions';

interface IListItem {
    photo: any;
    title: string;
    subTitle?: string;
    awaitingCompany: boolean
    onPress: any;
    item: any
}

const ListItem = (props: IListItem) => {
    const {photo, title, subTitle, awaitingCompany, onPress, item} = props;
    return (
        <View style={{
            flexDirection:'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 20,
        }}>
            <View style={{flexDirection: 'row', alignItems: 'center', flex: 1}}>
                <Image
                    source={require('../../assets/images/no-image.png')}
                    style={{width: 55, height: 55, borderRadius: 10, marginRight: 8}}
                />
                <View style={{width: SCREEN_WIDTH - 220}}>
                    <Text
                        style={{
                            color: '#333',
                            fontSize: 14,
                            fontWeight: "bold"
                        }}>
                        {title}
                    </Text>
                    {subTitle && (
                        <Text
                            numberOfLines={1}
                            style={{
                                color: '#333',
                                fontSize: 14,
                            }}>
                            {subTitle}
                        </Text>
                    )}
                </View>
            </View>
            {awaitingCompany ? (
                <View style={{
                    backgroundColor:'#0aada8',
                    padding:10,
                    width: 100,
                    borderRadius: 10,
                }}>
                    <Text style={{
                        color: '#fff',
                        textAlign: 'center',
                        fontSize: 14,
                    }}>
                        Afventer
                    </Text>
                </View>
            ) : (
                <TouchableOpacity onPress={onPress} style={{
                    backgroundColor:'#0aada8',
                    padding:10,
                    width: 100,
                    borderRadius: 10,
                }}>
                    <Text style={{
                        color: '#fff',
                        textAlign: 'center',
                        fontSize: 14,
                    }}>
                        Gå til besked
                    </Text>
                </TouchableOpacity>
            )}
        </View>
    );
}

export default ListItem;
