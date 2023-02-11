const fs = require("fs");
const pdf = require("html-pdf");

async function printAsPdf(htmlContent) {
    return new Promise((resolve, reject) => {
        const path = "./guide.pdf";
        pdf.create(htmlContent, {}).toFile(path, function (err, res) {
            if (err) {
                reject(err);
            } else {
                resolve({ path: res.filename });
            }
        });
    });
}

module.exports = {
    printAsPdf: printAsPdf
};