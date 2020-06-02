const { Sequelize, DataTypes, Model } = require('sequelize');
const sequelize = new Sequelize('sqlite::memory');
const { user, pass, host } = require('../config');

module.exports = {
    initConnection,
    initTable,
    writeInDb,
    getAllBooks,
    closeConnection
}

class Book extends Model { }

Book.init({
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
    },
    title: {
        type: DataTypes.STRING,
        allowNull: true
    },
    author: {
        type: DataTypes.STRING,
        allowNull: true
    },
    publisher: {
        type: DataTypes.STRING,
        allowNull: true
    },
    publicationDate: {
        type: DataTypes.STRING,
        allowNull: true
    },
    language: {
        type: DataTypes.STRING,
        allowNull: true
    },
    subject: {
        type: DataTypes.STRING,
        allowNull: true
    },
    licenseRight: {
        type: DataTypes.STRING,
        allowNull: true
    }

}, {
    sequelize,
    modelName: 'Book',
    indexes: [
        {
            unique: true,
            fields: ['title', 'author', 'publicationDate']
        }
    ]
});

async function initConnection() {
    let sequelize = new Sequelize('testTaskDB', user, pass, {
        host,
        dialect: 'postgres'
    });

    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}

async function initTable() {
    await Book.sync();
}

async function writeInDb(obj) {
    await Book.create(obj);
}

async function closeConnection() {
    return await sequelize.close();
}

async function getAllBooks() {
    const books = await Book.findAll();
    console.log("All books length:", books.length);
    return books;
}