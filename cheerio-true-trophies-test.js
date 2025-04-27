import cheerio from 'cheerio';
import fs from 'fs';

// Load saved HTML
const htmlContent = fs.readFileSync('debug-page.html', 'utf-8');
const $ = cheerio.load(htmlContent);

// Same selectors you use
const TRUE_TROPHIES_TROPHY_LIST_CONTENT = "main";
const TRUE_TROPHIES_TROPHY_DLC_SELECTOR = ".pnl-hd.no-pills .info";
const TRUE_TROPHIES_TROPHY_TITLE_SELECTOR = "ul.ach-panels li";
const TRUE_TROPHIES_GAME_TITLE_SELECTOR = "h1.gh";

// Initialize your fake 'store'
let store = {
  base: [],
  dlcs: [],
  title: '',
  source: 'truetrophies'
};
let currentStore = "base";
let indexStore = 0;
let titleFound = false;

// Helper: fake trophy data extractor
function extractTrophyDataTrueProfiles(trophy, $) {
    const type = (() => {
        const typeElement = $(trophy).find('p.t.b');
        if (typeElement.length > 0) {
            return 'Bronze';  // bronze
        } else if ($(trophy).find('p.t.g').length > 0) {
            return 'Gold';  // gold
        } else if ($(trophy).find('p.t.s').length > 0) {
            return 'Silver';  // silver
        } else if ($(trophy).find('p.t.p').length > 0) {
            return 'Platinum';  // platinum
        }
        return '';  // If no matching class, return empty
    })();
  return {
    name: $(trophy).find('a.title').text().trim(),
    description: $(trophy).find('p.t').text().trim(),
    type: type
  };
}

// Check if main content exists
if ($(TRUE_TROPHIES_TROPHY_LIST_CONTENT).length === 0) {
  console.error('❗ No <main> content found!');
} else {
  console.log('✅ <main> tag found.');
}

$(TRUE_TROPHIES_TROPHY_LIST_CONTENT)
  .children()
  .each((index, element) => {
    const tagName = $(element).prop('tagName');
    console.log(`- Checking child <${tagName}> at index ${index}`);

    if ($(element).hasClass("game") && !titleFound) {
      let title = $(element).find("h2").text().trim();
      if (title) {
        console.log(`✅ Title found: "${title}"`);
        store.title = title;
        titleFound = true;
      } else {
        console.error('❗ <h2> title not found inside .game block.');
      }
    } else if ($(element).prop("tagName") === 'ARTICLE') {
      console.log('✅ ARTICLE block found.');

      $(element).children().each((index, element) => { 
        //pnl-hd no-pills no-pr game
        if($(element).hasClass("pnl-hd no-pills no-pr game")){
            if (indexStore === 0) {
                store['base'] = [];
              } else {
                if (!store.dlcs) {
                  store.dlcs = [];
                }
                currentStore = 'DLC' + indexStore;
                const dlcTitle = $(element).find("h2").text().trim();
                store.dlcs.push({
                  title: dlcTitle || `Unnamed DLC ${indexStore}`,
                  trophies: [],
                });
              }
              indexStore++;    
        } else if($(element).hasClass("ach-panels")){
            console.log('✅ Trophy list block found.');
            if (!indexStore) {
              console.warn('⚠️ No DLC header before trophy list; assuming base game trophies.');
              indexStore++;
            }
            const trophies = $(element).find("li");
            if (trophies.length === 0) {
              console.error('❗ No trophies found inside .ach-panels.');
            }
            trophies.each((index, trophy) => {
              let trophyData = extractTrophyDataTrueProfiles(trophy, $);
              if (!trophyData.name) {
                console.warn(`⚠️ Trophy ${index} has no name.`);
              }
              if (indexStore === 1) {
                store[currentStore].push(trophyData);
              } else {
                store.dlcs[indexStore - 2].trophies.push(trophyData);
              }
            });
        }
        
       })
      
    } else {
      console.log(`🔹 Ignored element <${tagName}> at index ${index}`);
    }
  });

// Final Result
console.log('\n🎯 FINAL EXTRACTED DATA:');
console.log(JSON.stringify(store, null, 2));
