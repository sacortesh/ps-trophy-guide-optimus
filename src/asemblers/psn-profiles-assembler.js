function assembleGuide(htmlContent, trophyData) {
    return new Promise((resolve, reject) => {
        try {
            // code for sorting the trophies in the guide based on achievement rate goes here
            const updatedGuide = {
                htmlContent: htmlContent,
                trophyData: trophyData
            };
            resolve(updatedGuide);
        } catch (err) {
            reject(err);
        }
    });
}

module.exports = {
    assembleGuide: assembleGuide
};