const { readdirSync, readFileSync } = require('fs');
const parseString = require('xml2js').parseString;
const _ = require('lodash');



module.exports = {
    getAllSubFolders,
    getBookMetadata
}


async function getAllSubFolders(pathToRtfFolder) {
    return readdirSync(pathToRtfFolder, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name);
}

async function getBookMetadata(pathToRtfFolder, folderName) {
    return new Promise((res, rej) => {
        const rdf = readFileSync(pathToRtfFolder + '/' + folderName + '/pg' + folderName + '.rdf')
        return parseString(rdf, function (err, result) {
            res(getStandartizedObject(result));
        });
    })

};

function getStandartizedObject(parsedRdf) {
    return {
        id: _.get(parsedRdf, "rdf:RDF.pgterms:ebook[0].dcterms:hasFormat[0].pgterms:file[0].dcterms:extent[0]._", null),
        title: _.get(parsedRdf, "rdf:RDF.pgterms:ebook[0].dcterms:title.0", null),
        author: _.get(parsedRdf, "rdf:RDF.pgterms:ebook[0].dcterms:author.0", null),
        publisher: _.get(parsedRdf, "rdf:RDF.pgterms:ebook[0].dcterms:publisher.0", null),
        publicationDate: _.get(parsedRdf, "rdf:RDF.pgterms:ebook[0].dcterms:issued.0._", null),
        language: _.get(parsedRdf, "rdf:RDF.pgterms:ebook.0.dcterms:language.0.rdf:Description.0.rdf:value.0._", null),
        subject: _.get(parsedRdf, "rdf:RDF.pgterms:ebook[0].dcterms:subject[0].rdf:Description[0].rdf:value[0]", null),
        licenseRight: _.get(parsedRdf, "rdf:RDF.pgterms:ebook[0].dcterms:rights.0", null)
    }
}
