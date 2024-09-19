import { exec } from 'child_process';
import util from 'util';

const execAsync = util.promisify(exec)

export class Process {

    static async createMkvFile(mkvmergePath, mkvFilePath, outputMkvFilePath, audioTrackId, subtitleFilePath, subtitleTrackId) {

        // This is if 'merge' mode is on.
        if (subtitleFilePath) {

        }

        // This is if 'default' mode is on.
        else {
            // needs to run mkvmerge -o "<outputMkvFilePath>" --audio-tracks --subtitle
            await execAsync(`"${mkvmergePath}" -o "${outputMkvFilePath}" --audio-tracks "${audioTrackId}" --subtitle-tracks "${subtitleTrackId}" "${mkvFilePath}" --no-subtitles`);
        }


    }


}