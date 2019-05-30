'use strict';

const fs = require ('fs');

module.exports = {
    write (fileName, data) {
        let file = fs.createWriteStream(fileName);
        file.on('error', function(err) {
            throw new Error(err);
        });

        file.write(data);
        file.end();
    },
    writeArray (fileName, array) {
        let file = fs.createWriteStream(fileName);
        file.on('error', function(err) {
            throw new Error(err);
        });
        array.forEach((i) => {
            file.write(i + "\n");

        })
        file.end();
    }
}