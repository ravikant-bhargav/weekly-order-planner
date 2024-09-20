import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Switch } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const OrderScreen = ({ route, navigation }) => {
    const { day } = route.params;
    const [order, setOrder] = useState('');
    const [currentOrders, setCurrentOrders] = useState([]);
    const [isRecurring, setIsRecurring] = useState(false); // Recurring toggle

    useEffect(() => {
        const loadOrders = async () => {
            const storedOrders = await AsyncStorage.getItem('orders');
            const orders = storedOrders ? JSON.parse(storedOrders) : {};
            setCurrentOrders(orders[day] || []);
        };
        loadOrders();
    }, [day]);

    const saveOrder = async () => {
        const storedOrders = await AsyncStorage.getItem('orders');
        const orders = storedOrders ? JSON.parse(storedOrders) : {};

        // Add the new order with recurring flag
        const newOrder = { item: order, recurring: isRecurring };
        orders[day] = [...currentOrders, newOrder];

        await AsyncStorage.setItem('orders', JSON.stringify(orders));
        navigation.goBack();
    };

    const checkForRecurringOrders = async () => {
        const storedOrders = await AsyncStorage.getItem('orders');
        const orders = storedOrders ? JSON.parse(storedOrders) : {};

        // Get a new empty week
        const newOrders = {
            Monday: [],
            Tuesday: [],
            Wednesday: [],
            Thursday: [],
            Friday: [],
            Saturday: [],
            Sunday: []
        };

        // Loop over previous week's orders and copy recurring ones
        Object.keys(orders).forEach(day => {
            orders[day].forEach(order => {
                if (order.recurring) {
                    newOrders[day].push(order); // Copy recurring order to the new week
                }
            });
        });

        // Save the new week's orders
        await AsyncStorage.setItem('orders', JSON.stringify(newOrders));
    };

    useEffect(() => {
        // Check for recurring orders when app loads (typically once per week)
        checkForRecurringOrders();
    }, []);

    return (
        <View>
            <Text>Order for {day}</Text>
            <TextInput
                placeholder="Enter order"
                value={order}
                onChangeText={setOrder}
            />

            {/* Recurring toggle */}
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text>Recurring Order</Text>
                <Switch
                    value={isRecurring}
                    onValueChange={setIsRecurring}
                />
            </View>

            <Button title="Save Order" onPress={saveOrder} />
        </View>
    );
};

export default OrderScreen;
