import { connect } from 'mongoose';
import config from '../input/config.json';
import JikanTS from "jikants";
import { rangeFill, tryToDownload, CharacterData, sleep, createOutput } from './functions.js';
import { Seasons } from 'jikants/dist/src/interfaces/season/Season';

async function start() {
    console.log('[DATABASE INFO]\t Connecting to MongoDB database...');
    try {
        await connect(config.MongoDB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
            poolSize: 10,
            autoIndex: false,
            native_parser: true
        })
        console.log('[DATABASE INFO]\t Successfully connected with MongoDB remote, atlas database.');
    }
    catch(error) {
        console.error(`[DATABASE ERROR]\t Failed to connect with MongoDB remote, atlas database.\n` + error);
        process.exit();
    }

    // Check range
    if(config.classic.startYear < 1998 || config.classic.endYear < 1988) {
        console.error(`[CAST ERROR]\t You cannot set start or end year in config before 1988 year. Available from 1988 to now.`);
        process.exit();
    }
    else if(config.classic.endYear < config.classic.startYear) {
        console.error(`[CAST ERROR]\t Invalid cast range. You cannot send end year smaller than start year.`);
        process.exit();
    }

    // Create output dir if not exists
    createOutput();

    // Download data from selected points
    // Ignore all series with score below 7.0 if they were emitted before 2015 year
    for(const year of rangeFill(config.classic.startYear, config.classic.endYear)) {
        for(const season of ['fall', 'spring', 'summer', 'winter']) {
            const seasonData = await JikanTS.Season.anime(year, season as Seasons);
            let animes = seasonData.anime.filter(anime => anime.score >= config.classic.requireScoreAbove);
            if(!config.classic.r18Content) animes = animes.filter(anime => !anime.r18);
            if(!animes || animes.length === 0) return;

            console.log(`[JIKAN INFO]\t Working at season: ${season}, ${year}. Detected ${animes.length} animes. Validating...`);

            for(const anime of animes) {
                const charactersData = (await JikanTS.Anime.charactersStaff(anime.mal_id));
                for(const characterData of charactersData.characters) {
                    await tryToDownload(anime.title, true, characterData as CharacterData); // Avoid voice actors, etc.
                }
                await sleep(1000);
            }
        }
    }
    console.log('[SCRAPPER INFO]\t Finished!');
}

start();