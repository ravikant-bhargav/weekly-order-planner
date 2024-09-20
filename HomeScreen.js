import React, { useState, useEffect } from 'react';
import { View, Text, Button, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HomeScreen = ({ navigation }) => {
    const [orders, setOrders] = useState({});

    useEffect(() => {
        const fetchOrders = async () => {
            const storedOrders = await AsyncStorage.getItem('orders');
            if (storedOrders) {
                setOrders(JSON.parse(storedOrders));
            }
        };
        fetchOrders();
    }, []);

    const renderDay = ({ item }) => (
        <View>
            <Text>{item}</Text>
            <Text>{orders[item] ? orders[item].join(', ') : 'No orders'}</Text>
            <Button
                title="Add/Edit Order"
                onPress={() => navigation.navigate('Order', { day: item })}
            />
        </View>
    );

    const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    return (
        <View>
            <FlatList
                data={daysOfWeek}
                renderItem={renderDay}
                keyExtractor={(item) => item}
            />
        </View>
    );
};

export default HomeScreen;
