import {
    DrawerContentScrollView,
    DrawerItem,
    DrawerItemList,
} from '@react-navigation/drawer';
import { View, Text, StyleSheet } from "react-native";
import { FAB } from 'react-native-elements';
import Colors from '../constants/Colors';
import { useContext, useState } from 'react';
import { FeedsContext } from '../state/context/feeds-context';
import CustomModal from './CustomModal';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { IconButton } from "@react-native-material/core";
import { ScrollView } from 'react-native-gesture-handler';




function CustomDrawerContent(props) {
    const feedsCtx = useContext(FeedsContext)

    const [isModalVisible, setModalVisible] = useState(false);

    // This is to manage TextInput State
    const [inputValue, setInputValue] = useState("");

    // Create toggleModalVisibility function that will
    // Open and close modal upon button clicks.
    const toggleModalVisibility = () => {
        setModalVisible(!isModalVisible);
    };
    function onAddHandler() {
        console.log("Show dialog...")

    }

    return (
        <DrawerContentScrollView contentContainerStyle={styles.drawerStyle}  {...props}>
            <ScrollView>
                <View style={styles.outerContainer}>
                    <View style={styles.headerContainer}>
                        <Text style={styles.headerText}>My Feeds</Text>
                    </View>
                    <DrawerItemList {...props} />

                   
                    <CustomModal isVisible={isModalVisible} onDismiss={toggleModalVisibility} />
                </View>
            </ScrollView>
            <View style={styles.fabStyle}>
                        <IconButton contentContainerStyle={{ backgroundColor: Colors.secondary800 }} onPress={() => { setModalVisible(true) }} icon={props => <Ionicons name="add" size={20} />}
                            color={Colors.primary500} />
                    </View>
        </DrawerContentScrollView>
    );
}

export default CustomDrawerContent


const styles = StyleSheet.create({
    outerContainer: {
        flex: 1,
        flexDirection: 'column',

    },
    headerContainer: {
        height: 50,
        width: '100%',
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10,
    },
    headerText: {
        fontWeight: 'bold',
        fontSize: 16,


    },
    fabStyle: {
        flexDirection: 'row',
        alignSelf: 'center',
        position: 'absolute',
        bottom: 0,
        marginBottom: 50,

    },

    drawerStyle: {

        backgroundColor: Colors.primary500,
        flex: 1,
    }


});
