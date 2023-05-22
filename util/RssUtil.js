import * as rssParser from 'react-native-rss-parser';
//const { extract } = require('@extractus/article-extractor')

export async function fetchRss(rss) {

    try {
        let feed = await fetch(rss)
        let text = await feed.text()
        let parsed = await rssParser.parse(text)
        // console.log(parsed.title)

        // console.log(parsed.items[0].title)
        // console.log(parsed.items[0].links)
        return parsed
    }
    catch (err) {
        console.log(`Error fetching from ${rss} with error: ${err}`)
        throw err

    }




}  