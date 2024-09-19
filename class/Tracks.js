import { exec } from 'child_process';
import util from 'util';

const execAsync = util.promisify(exec)

import { Log } from './Log.js';

export class Tracks {

    static async getTracks(mkvFilePath, mkvinfoPath) {
        const { stdout } = await execAsync(`"${mkvinfoPath}" "${mkvFilePath}"`);

        const tracks = Tracks.parseTracks(stdout, mkvFilePath);

        return tracks;
    }

    static parseTracks(mkvinfoOutput, mkvFilePath) {
        const rawTracks = Tracks.extractRawTracks(mkvinfoOutput);

        if (rawTracks === 0) {
            Log.error(`Unable to execute mkvinfo on "${mkvFilePath}".`);
        }

        const tracks = rawTracks.map((rawTrack) => {            
            return new Track({
                'id': Tracks.parseTrackId(rawTrack),
                'type': Tracks.parseTrackType(rawTrack),
                'language': Tracks.parseTrackLanguage(rawTrack),
                'raw': rawTrack
            });
        });

        return tracks;
    }

    static parseTrackId(rawTrack) {
        const regex = /track ID for mkvmerge & mkvextract: (\d+)/;
        const match = rawTrack.match(regex);

        if (!(match) || match.length < 1) {
            return -1;
        }

        return parseInt(match[1]);
    }

    static parseTrackType(rawTrack) {
        const regex = /Track type: (\w+)/;
        const match = rawTrack.match(regex);

        if (!(match) || match.length < 1) {
            return -1;
        }

        return match[1];
    }

    static parseTrackLanguage(rawTrack) {
        const regex = /Language: (\w+)/;
        const match = rawTrack.match(regex);

        if (!(match) || match.length < 1) {
            return 'und';
        }

        return match[1];
    }

    static extractRawTracks(mkvinfoOutput) {
        const regex = /\|\+ Tracks([\s\S]*?)(?=\|\+)/gms;
        const match = mkvinfoOutput.match(regex)

        if (!(match) || match.length < 1) {
            return 0;
        }

        const rawTracks = match[0].split("| + Track");
        rawTracks.shift();
        return rawTracks;
    }

    static getAudioTrack(tracks) {
        const audioTrack = tracks.find(track => {
            return ((track.language === 'eng' || track.language === 'und') && track.type === 'audio');
        });

        return audioTrack;
    }

    static getSubtitleTrack(tracks) {
        const subtitleTrack = tracks.find(track => {
            return ((track.language === 'eng' || track.language === 'und') && track.type === 'subtitles');
        });

        return subtitleTrack;
    }

}


export class Track {
    constructor(configuration) {
        this.id = configuration.id;
        this.type = configuration.type;
        this.language = configuration.language;
        this.raw = configuration.raw;
    }

    getInfo() {
        return `Track ID: ${this.id}, Type: ${this.type}`;
    }
}