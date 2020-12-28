import WaifuSchema from './waifuSchema.js';
import Jimp from 'jimp';
import fs from 'fs';
import { join } from 'path';
import waifuSchema from './waifuSchema.js';

let totalAddedWaifus = 0;

interface CharacterData {
    mal_id: number,
    image_url: string,
    name: string,
    role: 'Main' | 'Supporting'
}

function rangeFill(start: number, end: number): number[] {
    return Array(end - start + 1) // @ts-ignore
        .fill()
        .map((_, idx: number) => start + idx);
}

function sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

function createOutput() {
    console.log('[DISK INFO]\t Preparing output directories for upcoming data...');
    const outputDir =  join(__dirname, '..', '..', 'output');
    if(!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);
    if(!fs.existsSync(join(outputDir, 'raw'))) fs.mkdirSync(join(outputDir, 'raw'));
    if(!fs.existsSync(join(outputDir, 'processed'))) fs.mkdirSync(join(outputDir, 'processed'));
    console.log('[DISK INFO]\t Successfully created output files inside this project.');
}

async function tryToDownload(animeTitle: string, onlyMain: boolean, character: CharacterData) {
    // Skip if it's supportive character while scanning only main
    if(onlyMain && character.role !== 'Main') return;

    // Check if it's already in database, if yes - skip
    const waifuData = await WaifuSchema.findById(character.mal_id).lean();
    if(waifuData) {
        console.log(`[DATABASE INFO]\t ${character.name.split(', ').reverse().join(' ')} is already added to database. (ID ${character.mal_id})`);
        return;
    }

    // Try to check size, if invalid - skip
    const image = await Jimp.read(character.image_url);
    if(image.bitmap.height !== 350 || image.bitmap.width !== 225) return;
    else {
        image.quality(100);
        await image.writeAsync(join(__dirname, '..', '..', 'output', 'raw', `${character.mal_id}.jpg`));
        console.log(`[JIMP INFO]\t Successfully downloaded image received from Jikan's data. (${character.mal_id}.jpg)`);
    }

    // Save it to database
    await waifuSchema.create({
        _id: character.mal_id,
        name: character.name.split(', ').reverse().join(' '),
        anime: animeTitle
    });

    totalAddedWaifus++;
    console.log(`[DATABASE INFO]\t Successfully added ${character.name.split(', ').reverse().join(' ')} (ID: ${character.mal_id}) [TOTAL: ${totalAddedWaifus}]`);
    return;
}



export { rangeFill, tryToDownload, CharacterData, sleep, createOutput };