const fs = require('fs');
const cheerio = require('cheerio');
const https=require("https")
function fetchHrefsFromFile(filePath) {
    return new Promise((resolve, reject) => {
        // Lire le fichier HTML
        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                return reject(`Error reading the file: ${err.message}`);
            }

            // Charger le HTML dans Cheerio
            const $ = cheerio.load(data);

            // Récupérer les href des liens dans le document
            let hrefs = [];
            $('a').each((i, link) => {
                const href = $(link).attr('href');
                if (href) {
                    hrefs.push(href.replace("/fr/champions/builds/","https://www.leagueofgraphs.com/fr/champions/stats/"));
                }
            });

            resolve(hrefs);
        });
    });
}

// Exemple d'utilisation
const filePath = './index.html'; // Remplacez par le chemin de votre fichier HTML

/*fetchHrefsFromFile(filePath).then((hrefs) => {
    console.log(hrefs);
    fs.writeFileSync("./list.txt",hrefs.join("\n"))
}).catch((error) => {
    console.error(error);
});*/
const jsdom = require("jsdom");
const { JSDOM } = jsdom;


function extractGameStats(htmlString) {
    //console.log(htmlString)
    const dom = new JSDOM(htmlString);

    // Extracting damage data
    const damageElements = dom.window.document.querySelectorAll('.stacked_bar_area');
    let physicalDamage = parseFloat(damageElements[0].style.width.replace('%;', ''));
    let magicDamage = parseFloat(damageElements[1].style.width.replace('%;', ''));
    let trueDamage = parseFloat(damageElements[2].style.width.replace('%;', ''));

    // Extracting gold per minute
   
    // Extracting attack per minute (assuming it's from a specific class or identifier)
    const $ = cheerio.load(htmlString);

    // Function to extract specific stat based on the title
    function extractStat(tooltip) {
        const element = $(`div[tooltip="${tooltip}"]`).closest('.medium-12.columns').find('.number.solo-number').text().trim();
        console.log(element)
        return element ;
    }

    const damageDealt = extractStat('Dégâts / minute');
    const goldPerMinute = extractStat('Gold par minute');
    const wardsPlaced = extractStat('Wards placées / minute');
    // Formatting the output string
    const output = `${magicDamage.toFixed(1)}:${physicalDamage.toFixed(1)}:${trueDamage.toFixed(1)}:${goldPerMinute}:${wardsPlaced}:${damageDealt}`;

    return output;
}

const build=(url)=>{
    https.get(url, (res) => {
    let data = '';

    // Accumuler les chunks de données reçus
    res.on('data', (chunk) => {
        data += chunk;
    });

    // Toute la réponse a été reçue
    res.on('end', () => {
        fs.appendFileSync("./types/champion.txt",`${url.split("/")[url.split("/").length-1]}:`+extractGameStats(data.toString())+"\n")
    })})
}

fs.readFileSync("./list.txt").toString().split("\n").map((lines)=>{build(lines)})
