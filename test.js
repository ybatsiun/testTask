const assert = require('assert');
const { Worker, isMainThread, workerData, parentPort } = require('worker_threads');
const { pathToRtfFolder_test, booksPerThread_test } = require('./config.js');
const fsService = require('./services/fsService');
const dbService = require('./services/dbService');


// describe('Run again single book', function () {
//     it('should insert one book into db', async function () {
//         await main(pathToRtfFolder_test, booksPerThread_test);
//         const books = await dbService.getAllBooks();
//         //
//     });
// });

const testBook = {
    id: '4618',
    title: 'The Declaration of Independence of the United States of America',
    author: null,
    publisher: 'Project Gutenberg',
    publicationDate: '1971-12-01',
    language: 'en',
    subject: 'E201',
    licenseRight: 'Public domain in the USA.'
}


describe('Run again single book', async function () {
    let bookMetadata;
    it('should parse book rdf', async function () {
        bookMetadata = await fsService.getBookMetadata(pathToRtfFolder_test, '1');
        assert.equal(JSON.stringify(bookMetadata), JSON.stringify(testBook));
    });

    it('should write test book to db', async function () {
        await dbService.initConnection()
        await dbService.initTable();
        await dbService.writeInDb(bookMetadata);
        const books = await dbService.getAllBooks();
        assert.equal(books.length, 1);
    });

})