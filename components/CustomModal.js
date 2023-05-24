import { StyleSheet, Modal, Dimensions, View, TextInput, Button, Text, Alert } from "react-native";
import { useState, useContext, } from "react";
import Colors from "../constants/Colors";
import { FeedsContext } from "../state/context/feeds-context";
import { fetchRss } from "../util/RssUtil";
import { set } from "react-native-reanimated";
import Feed from "../model/Feed";

const { width } = Dimensions.get("window");
function CustomModal({ isVisible, onDismiss }) {
    const feedsCtx = useContext(FeedsContext)
    // This is to manage TextInput State
    const [inputValue, setInputValue] = useState("");
    const [error, setError] = useState("");
    const [isAdding, setAdding] = useState(false)


    async function onAdd() {
        if (inputValue === '') {
            console.log('No empty strings')
            return
        }
        try {
            const parsed = await fetchRss(inputValue)
            const feed = new Feed(0, inputValue, parsed.title)
            feedsCtx.addFeed(feed)
            onDismiss()

        }
        catch (err) {
            console.log(
                `Got error in onAdd() CustomModal.js with error ${err}`
            )
            setError("Error fetching this feed... make sure the link is a valid rss and your connection is stable ")
        }
        




    }

    function onExplore() {
        Alert.alert('TODO', 'The explore feature has not been implemented yet :( Can only add directly from rss url', [
           
            {text: 'OK', onPress: () => console.log('OK Pressed')},
          ]);

    }
    return (<Modal animationType="slide"
        transparent visible={isVisible}
        presentationStyle="overFullScreen"
        onDismiss={onDismiss}>
        <View style={styles.viewWrapper}>
            
            <View style={styles.modalView}>
                <Text style={styles.errorText}> {error} </Text>
                <TextInput placeholder="Enter the link to an rss"
                    value={inputValue} style={styles.textInput}
                    onChangeText={(value) => {
                        setError('')
                        setInputValue(value)
                    }} />

                {/** This button is responsible to close the modal */}
                <View style={styles.buttonContainer}>
                    <Button color={Colors.primary500} title="Enter" onPress={onAdd} />
                    <Button color={'green'} title="Explore" onPress={onExplore} />
                    <Button color={'red'} title="Close" onPress={onDismiss} />
                    
                </View>



            </View>
        </View>
    </Modal>
    )
}
// These are user defined styles
const styles = StyleSheet.create({
    screen: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#fff",
    },
    viewWrapper: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(0, 0, 0, 0.2)",
    },
    modalView: {
        alignItems: "center",
        justifyContent: "center",
        position: "absolute",
        top: "50%",
        left: "50%",
        elevation: 5,
        transform: [{ translateX: -(width * 0.4) },
        { translateY: -90 }],
        height: 180,
        width: width * 0.8,
        backgroundColor: "#fff",
        borderRadius: 7,
    },
    textInput: {
        width: "80%",
        borderRadius: 5,
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderColor: "rgba(0, 0, 0, 0.2)",
        borderWidth: 1,
        marginBottom: 8,
    },
    buttonContainer: {
        justifyContent: 'space-evenly',
        flexDirection: 'row',
        width: '100%',
        marginTop: 10,
        marginBottom: 10,


    },

    errorText: {
        color: 'red',
        fontSize: 12,
        margin: 20,
        textAlign: 'center'
    }
});

export default CustomModal