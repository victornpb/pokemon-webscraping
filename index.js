const path = require('path');

const puppeteer = require('puppeteer');


async function run() {
    const browser = await puppeteer.launch({
        headless: false,
        // slowMo: 250
    });

    const page = await browser.newPage();

    let pokemonList = await getPokemonList(page);
    
    browser.close();
}

run();

//get pokemons list from pokemon db
async function getPokemonList(page) {

    await page.goto('https://pokemondb.net/pokedex/all');

    const NUM_USER_SELECTOR = '#pokedex tbody tr';

    let pokemonList = await page.evaluate((sel) => {
        
        return Array.from(document.querySelectorAll('#pokedex tbody tr')).map((tr) => {
            return {
                id: tr.querySelector('td:first-child').innerText.trim(),
                name: tr.querySelector('a.ent-name').innerText,
                url: tr.querySelector('a.ent-name').href,
                type: Array.from(tr.querySelectorAll('.type-icon')).map((el) => el.innerText)
            }
        })

    });

    console.log(pokemonList);
    return pokemonList;
}