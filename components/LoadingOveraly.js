import { ActivityIndicator, View, StyleSheet } from "react-native";
import Colors from "../constants/Colors";

function LoadingOverlay() {

    return (
        <View style={styles.outerContainer}>

            <ActivityIndicator size={'large'} color={Colors.secondary} />

        </View>
    )

}

const styles = StyleSheet.create({
    outerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },

});


export default LoadingOverlay