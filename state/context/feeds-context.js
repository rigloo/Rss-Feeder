
import { createContext, useState } from "react";
import Feed from "../../model/Feed";
import { fetchFeeds as dbFetchFeeds, insertFeed, removeFeed as dbRemoveFeed } from "../../util/feedsDatabase";

export const FeedsContext = createContext({
    feeds: [],
    addFeed: (feed) => { },
    removeFeed: (id) => { },
    fetchFeeds: () => { },

})

function FeedsContextProvider({ children }) {

    const [feeds, setFeeds] = useState([])

    function addFeed(feed) {
        insertFeed(feed)
        setFeeds((currentFeeds) => [...currentFeeds, feed])
    }

    async function fetchFeeds() {
        console.log(`Dash with the bops!`)
        const result = await dbFetchFeeds()
        const feeds = [new Feed(1, 'http://rss.cnn.com/rss/cnn_latest.rss', 'CNN Latest'),]
        feeds.push()

        for (const feed of result.rows._array) {
            console.log(feed)
            feeds.push(new Feed(feed.id, feed.url, feed.name))
        }
        setFeeds(feeds)

    }


    async function removeFeed(id) {

        await dbRemoveFeed(id)
        setFeeds((currentFeeds) => currentFeeds.filter((feed) => feed.id !== id))
    }

    const value = {
        feeds: feeds,
        addFeed: addFeed,
        removeFeed: removeFeed,
        fetchFeeds: fetchFeeds


    };



    return (<FeedsContext.Provider value={value}>{children}</FeedsContext.Provider>)
}

export default FeedsContextProvider