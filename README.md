1. Install nodejs v12.17.0
2. Install and run postgres server
3. Create a database 'testTaskDB' in db server
4. In 'config.js' configure pass,host,user name to connect with db server
5. In 'config.js' configure pathToRtfFolder and booksPerThread 
6. Install dependencies `npm i` 
7. Run the app `npm run start` 
8. Test the app `npm run test` 

Notes:
1. Book table is indexed when created
2. Web threads are used to spread the xml to json operation. User can configure books per thread