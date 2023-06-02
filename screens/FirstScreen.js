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

        getData()

    }, [])

    async function setRead() {
        setReading(true)
        try {

            for (const [index, article] of articles.entries()) {
                const read = await hasRead(article.url)

                if (Object.values(read.rows._array[0])[0]) {

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
    async function getData() {

        setReading(false)
        setFetching(true)
        try {
            console.log(`In FirstScreen -> getData() with url: ${route.params.url}`)
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

    async function listItemPressHandler(article) {
        const copyFeed = articles
        if (!article.hasRead) {
            await insertRead(article.url)
            const index = articles.findIndex((el) => el.id === article.id)
            setArticles((old_articles) => [...old_articles.map((el, indexM) => {
                if (indexM === index)
                    return new Article(article.id, article.url, article.title, article.description, article.date, true)
                else
                    return el
            })])
            setReading(false)
        }


        navigation.navigate(Routes.secondScreen, article.url)

    }
    function renderItem({ item }) {
        return <View>

            <ListItem onPress={() => { listItemPressHandler(item) }} containerStyle={[styles.itemOuterContainer, item.hasRead ? styles.read : styles.notRead]} bottomDivider   >
                <ListItem.Content    >
                    <ListItem.Title style={{ color: Colors.primary800, fontSize: 15, fontWeight: 'bold' }} >{item.title.trim()}</ListItem.Title>
                    <ListItem.Subtitle>{item.description ? item.description.trim() : ''}</ListItem.Subtitle>
                    <ListItem.Subtitle></ListItem.Subtitle>
                    <ListItem.Subtitle style={{ color: Colors.primary800, fontSize: 12, fontWeight: 'bold', alignSelf: 'flex-end' }}>{item.date}</ListItem.Subtitle>

                </ListItem.Content>
            </ListItem>
        </View>

    }



    return <View style={styles.outerContainer}>

        {fetching ? <LoadingOverlay /> : <FlatList onRefresh={() => getData()}
            refreshing={fetching} data={articles} renderItem={renderItem} keyExtractor={(item, index) => index.toString()} />}


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