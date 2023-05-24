import { View, Text, StyleSheet } from "react-native";
import { WebView } from 'react-native-webview';
//import { extract } from '@extractus/article-extractor'

function SecondScreen({ navigation, route }) {




    const injectJS = `$('a').contents().unwrap();`



    async function extractWebsite() {
        // const article = await extract(route.params)
        // console.log(article.content)
    }
    extractWebsite()

    return <View style={styles.outerContainer}>
        <WebView onMessage={(event) => { }}
            ref={() => { }}
            injectedJavaScript={injectJS} javaScriptEnabled={false} source={{ uri: route.params }} style={{ flex: 1 }} />
    </View>

}
export default SecondScreen

const styles = StyleSheet.create({
    outerContainer: {
        flex: 1,


    },


});