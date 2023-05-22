import * as SQLite from 'expo-sqlite'

const database = SQLite.openDatabase('feeder.db')

export function init() {
    const promise = new Promise((resolve, reject) => {
        database.transaction((tx) => {
            tx.executeSql(`CREATE TABLE IF NOT EXISTS feeds (
            id INTEGER PRIMARY KEY NOT NULL,
            url TEXT NOT NULL,
            name TEXT NOT NULL
        )`,
                [],
                () => { resolve() },
                (_, error) => { reject() });

        });
    })
    return promise

}

export function insertFeed(feed) {
    const promise = new Promise((resolve, reject) => {
        database.transaction((tx) => {
            tx.executeSql(`INSERT INTO feeds (url, name) VALUES (?,?)`,
                [feed.url, feed.name],
                () => { resolve() },
                (_, error) => { reject() });

        });
    })
    return promise

}

export function fetchFeeds() {
    const promise = new Promise((resolve, reject) => {
        database.transaction((tx) => {
            tx.executeSql(`SELECT * FROM feeds`, [], (_, result) => { resolve(result) }, (_, error) => { reject(error) }
            );

        });
    })
    return promise

}

export function removeFeed(id) {
    const promise = new Promise((resolve, reject) => {
        database.transaction((tx) => {
            tx.executeSql(`DELETE FROM feeds WHERE id = ?`,
                [id],
                () => { resolve() },
                (_, error) => { reject() });

        });
    })
    return promise

}