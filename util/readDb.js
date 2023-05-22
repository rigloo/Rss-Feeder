import * as SQLite from 'expo-sqlite'

const database = SQLite.openDatabase('feeder.db')

export function init() {
    const promise = new Promise((resolve, reject) => {
        database.transaction((tx) => {
            tx.executeSql(`CREATE TABLE IF NOT EXISTS read (
            id INTEGER PRIMARY KEY NOT NULL,
            url TEXT NOT NULL
        )`,
                [],
                () => { resolve() },
                (_, error) => { reject(error) });

        });
    })
    return promise

}

export function insertRead(url) {
    const promise = new Promise((resolve, reject) => {
        database.transaction((tx) => {
            tx.executeSql(`INSERT INTO read (url) VALUES (?)`,
                [url],
                () => { resolve() },
                (_, error) => { reject() });

        });
    })
    return promise

}

export function fetchReads() {
    const promise = new Promise((resolve, reject) => {
        database.transaction((tx) => {
            tx.executeSql(`SELECT * FROM read`, [], (_, result) => { resolve(result) }, (_, error) => { reject(error) }
            );

        });
    })
    return promise

    

}

export function removeRead(id) {
    const promise = new Promise((resolve, reject) => {
        database.transaction((tx) => {
            tx.executeSql(`DELETE FROM read WHERE id = ?`,
                [id],
                () => { resolve() },
                (_, error) => { reject() });

        });
    })
    return promise

}

export function hasRead(url) {
    const promise = new Promise((resolve, reject) => {
        database.transaction((tx) => {
            tx.executeSql(`SELECT EXISTS(SELECT 1 FROM read WHERE url = ?)`,
                [url],
                (_, result) => { resolve(result) },
                (_, error) => { reject(error) });

        });
    })
    return promise

}