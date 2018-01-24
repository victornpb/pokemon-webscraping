const path = require('path');

const puppeteer = require('puppeteer');


async function run() {
    const browser = await puppeteer.launch({
        headless: false,
        // slowMo: 250
    });

    const page = await browser.newPage();

    let pokemonList = await getPokemonList2(page);
    

    

    browser.close();
}

run();

//get pokemons list from pokemon db
async function getPokemonList(page) {

    await page.goto('https://pokemondb.net/pokedex/all');

    let pokemonList = await page.evaluate((sel) => {
        
        return Array.from(document.querySelectorAll('#pokedex tbody tr')).map((tr) => {
            return {
                id: tr.querySelector('td:first-child').innerText.trim(),
                name: tr.querySelector('a.ent-name').innerText,
                url: tr.querySelector('a.ent-name').href,
                type: Array.from(tr.querySelectorAll('.type-icon')).map((el) => el.innerText)
            };
        });

    });

    console.log(pokemonList);
    return pokemonList;
}


//get pokemons list from pokemon db
async function getPokemonList2(page) {

    await page.goto('https://bulbapedia.bulbagarden.net/wiki/List_of_Pok%C3%A9mon_by_National_Pok%C3%A9dex_number');

    let pokemonList = await page.evaluate(() => {

        let pokemons = [];

        Array.from(document.querySelectorAll('h3 + table')).forEach((table, i) => { //get each generation table
            Array.from(table.querySelectorAll('tbody tr:not(:first-child)')).forEach(tr => { //each table line

                pokemons.push({
                    gen: i + 1, //generation
                    k: tr.querySelector('td:first-child').innerText, //pokedex id
                    id: tr.querySelector('td:nth-child(2)').innerText, //national id
                    name: tr.querySelector('td:nth-child(4)').innerText, //name
                    link: tr.querySelector('td:nth-child(4) a').href, //link
                    type: [
                        tr.querySelector('td:nth-child(5)'), //type
                        tr.querySelector('td:nth-child(6)'), //secondary type (maybe null)
                    ].map(e => e ? e.innerText : undefined).filter(Boolean) //compact
                });

            });
        });

        return pokemons;
    });

    console.log(pokemonList);
    return pokemonList;
}