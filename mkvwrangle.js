import path from 'path';
import { fileURLToPath } from 'url';
import { readdir } from 'fs/promises';
import { Tracks } from './class/Tracks.js';
import { Process } from './class/Process.js';
import { Log } from './class/Log.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class MKVWrangle {

    constructor() {
        this.targetPath = null;
        this.isFile = false;
        this.mode = 'default'; // Default mode
        this.mkvinfoPath = path.join(__dirname, 'lib', 'mkvtoolnix', 'mkvinfo');
        this.mkvmergePath = path.join(__dirname, 'lib', 'mkvtoolnix', 'mkvmerge');
    }

    checkArguments(args) {
        let hasDirectory = false;
        let hasFile = false;

        args.forEach((arg, index) => {
            if (arg === '-d' || arg === '--directory') {
                if (args[index + 1]) {
                    this.targetPath = args[index + 1];
                    this.isFile = false;
                    hasDirectory = true;
                } else {
                    this.showUsage();
                }
            } else if (arg === '-f' || arg === '--file') {
                if (args[index + 1]) {
                    this.targetPath = args[index + 1];
                    this.isFile = true;
                    hasFile = true;
                } else {
                    this.showUsage();
                }
            } else if (arg === '--merge-subtitle') {
                this.mode = 'merge';
                Log.error('Merge has not yet been implemented.');
            }
        });

        if (!hasDirectory && !hasFile) {
            this.showUsage();
        }
    }

    showUsage() {
        Log.error('Usage: node mkvwrangle (-d <directory> | -f <file>) [--merge-subtitle]');
        process.exit(1);
    }

    async initialise() {
        if (this.isFile) {
            if (path.extname(this.targetPath).toLowerCase() !== '.mkv') {
                Log.error('The specified file is not an MKV file.');
                process.exit(1);
            }
            this.mkvFiles = [this.targetPath];
        } else {
            const files = await readdir(this.targetPath);
            this.mkvFiles = files.filter(file => path.extname(file).toLowerCase() === '.mkv');

            if (this.mkvFiles.length === 0) {
                Log.error('No MKV files found in the specified directory.');
                process.exit(1);
            } else {
                this.mkvFiles = this.mkvFiles.map(file => path.join(this.targetPath, file));
            }
        }
    }

    async main() {
        for (const mkvFilePath of this.mkvFiles) {
    
            // Skip any files that end with .process.mkv
            if (mkvFilePath.endsWith('.mkvwrangle.mkv')) {
                Log.info(`Skipping file: "${mkvFilePath}" as it ends with .mkvwrangle.mkv.`);
                continue;
            }
    
            // Define the output file name as <filename>.mkvwrangle.mkv
            const outputMkvFileName = path.basename(mkvFilePath, '.mkv') + '.mkvwrangle.mkv';
            const outputMkvFilePath = path.join(path.dirname(mkvFilePath), outputMkvFileName);
    
            Log.info(`Processing file: "${mkvFilePath}" in mode: "${this.mode}".`);
            const tracks = await Tracks.getTracks(mkvFilePath, this.mkvinfoPath);
    
            // Identify the subtitle track.
            const subtitleTrack = Tracks.getSubtitleTrack(tracks);
            Log.info(`Identified subtitle track ID: ${subtitleTrack.id}.`);
    
            // If the merge mode is on:
            if (this.mode === 'merge') {
                // Extract the identified subtitle track. Call it <filename>.extract.srt
                //
    
                // Merge the identified subtitle track and the subtitle track <filename>.merge.srt. Should create <filename>.srt.
                //
            }
    
            // Identify the audio track.
            const audioTrack = Tracks.getAudioTrack(tracks);
            Log.info(`Identified audio track ID: ${audioTrack.id}.`);
    
            // If the merge mode is on:
            if (this.mode === 'merge') {
                // Create mkv file using the <filename>.srt file and the identified audio track.
                //
            }
    
            // If the merge mode is not on:
            if (this.mode === 'default') {
                // Create mkv file using the identified subtitle track and identified audio track.
                Log.info(`Exporting file: "${outputMkvFilePath}".`);
                await Process.createMkvFile(this.mkvmergePath, mkvFilePath, outputMkvFilePath, audioTrack.id, undefined, subtitleTrack.id);
                Log.info(`File exported.`);
            }
    
            console.log();
        }
    }
}

const mkvWrangle = new MKVWrangle();
mkvWrangle.checkArguments(process.argv.slice(2));
await mkvWrangle.initialise();
await mkvWrangle.main();