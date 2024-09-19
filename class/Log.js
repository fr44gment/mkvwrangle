

export class Log {
    static info(output) {
        console.log(`[mkvwrangle] ${output}`);
    }

    static error(output) {
        console.log(`[mkvwrangle] ${output}`);
        process.exit(1);
    }
}