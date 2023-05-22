import { View, Text, StyleSheet, FlatList } from "react-native";
import { ListItem } from '@rneui/themed';
import Colors from "../constants/Colors";
import { Routes } from "../constants/Routes";
import { fetchRss } from "../util/RssUtil";
import { useState, useEffect } from "react";
import LoadingOverlay from "../components/LoadingOveraly";
import Article from "../model/Article";
import { hasRead, insertRead } from "../util/readDb";

function FirstScreen({ navigation, route }) {

    const [articles, setArticles] = useState([])
    const [fetching, setFetching] = useState(true)
    const [reading, setReading] = useState(false)

    useEffect(() => {
        if (!reading && articles.length !== 0)
            setRead()
    }, [articles])


    useEffect(() => {
        async function getData() {
            setFetching(true)
            try {
                console.log(route.params.url)
                var tempFeed = await fetchRss(route.params.url)
                const tempArticles = tempFeed.items.map((feed) => new Article(Date.now().toString() + Math.random().toString(), feed.links[0].url, feed.title, feed.description, feed.published, false,))
                setArticles(tempArticles)



            }

            catch (err) {
                console.log(`There was an error fetching feeds in Firstscreen: useEffect error:: ${err} `)
            }
            setFetching(false)
            // console.log(`Show feeds: ${articles.items}`)

        }
        getData()

    }, [])

    async function setRead() {
        setReading(true)
        try {

            for (const [index, article] of articles.entries()) {
                const read = await hasRead(article.url)

                if (Object.values(read.rows._array[0])[0]) {
                   console.log(`in setRead() gonna set value ${index}`)
                    const copyFeed = articles
                    copyFeed[index] = new Article(article.id, article.url, article.title, article.description, article.date, true)
                    setArticles(copyFeed)
                }

            }
        }
        catch (err) {
            console.log(`Error in SetRead() with ${err}`)
        }


    }


    function listItemPressHandler(article) {
        var copyFeed = articles
        if (!article.hasRead) {
            console.log("must switch read color")
            insertRead(article.url)
            const index = articles.findIndex((el) => el.id === article.id)
            console.log(`About to switch url: ${article.url} with index ${index}`)
            copyFeed[index] = new Article(article.id, article.url, article.title, article.description, article.date, true)
            console.log(copyFeed[index])
            setArticles(copyFeed)
        }


        navigation.navigate(Routes.secondScreen, article.url)

    }
    function renderItem({ item }) {
        return <View>

            <ListItem onPress={() => { listItemPressHandler(item) }} containerStyle={[styles.itemOuterContainer, item.hasRead ? styles.read : styles.notRead]} bottomDivider   >
                <ListItem.Content    >
                    <ListItem.Title style={{ color: Colors.primary800, fontSize: 15, fontWeight: 'bold' }} >{item.title}</ListItem.Title>
                    <ListItem.Subtitle>{item.description.trim()}</ListItem.Subtitle>
                    <ListItem.Subtitle></ListItem.Subtitle>
                    <ListItem.Subtitle style={{ color: Colors.primary800, fontSize: 12, fontWeight: 'bold', alignSelf: 'flex-end' }}>{item.date}</ListItem.Subtitle>

                </ListItem.Content>
            </ListItem>
        </View>

    }



    return <View style={styles.outerContainer}>

        {fetching ? <LoadingOverlay /> : <FlatList data={articles} renderItem={renderItem} keyExtractor={(item, index) => index.toString()} />}


    </View>

}




const styles = StyleSheet.create({
    outerContainer: {
        flex: 1,
        padding: 10,
        marginBottom: 50,

    },
    itemOuterContainer: {
        backgroundColor: Colors.secondary500,
        borderRadius: 10,
        margin: 5,
    },

    read: {
        backgroundColor: '#828b99'
    },
    notRead: {
        backgroundColor: 'white'
    }

});


export default FirstScreen