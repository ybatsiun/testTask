const { Worker, isMainThread, workerData, parentPort } = require('worker_threads');

const { pathToRtfFolder, booksPerThread } = require('./config.js');
const fsService = require('./services/fsService');


main();

async function main() {

    if (isMainThread) {

        const dbService = require('./services/dbService');

        process.on('beforeExit', async () => {
            await dbService.getAllBooks();
            await dbService.closeConnection();
            process.exit(0);
        });

        await dbService.initConnection()
        await dbService.initTable();
        const subFolders = await fsService.getAllSubFolders(pathToRtfFolder);

        for (let i = 0; i < subFolders.length; i += booksPerThread) {

            let w = new Worker(__filename, {
                workerData:
                    { subFolders: subFolders.slice(i, i + booksPerThread) }
            });

            w.on('error', console.error);
            w.on('message', dbService.writeInDb);

        };
    } else {
        console.log('child', workerData)
        const { subFolders } = workerData;
        const promises = [];

        for (const folder of subFolders) {
            promises.push(parseData(folder));
        };

        async function parseData(folder) {
            const bookMetadata = await fsService.getBookMetadata(pathToRtfFolder, folder);
            parentPort.postMessage(bookMetadata);
        };

        await Promise.all(promises)
    };
}

