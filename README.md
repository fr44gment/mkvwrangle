# mkvwrangle

mkvwrangle is a tool designed for re-exporting MKV files, specifically to isolate and retain only the English audio and English subtitle tracks.

## Usage

**Command Line Options**:
- -d or --directory : Specify a directory containing MKV files to process.
- -f or --file : Specify a single MKV file to process.

**Example Commands**:

To process an entire directory of MKV files:

```
node mkvwrangle.js --directory /path/to/mkv/files
```

To process a single MKV file:

```
node mkvwrangle.js --file /path/to/file.mkv
```

In both cases, mkvwrangle will output a new MKV file with the English audio and subtitle tracks only. The output file will be saved as <filename>.mkvwrangle.mkv in the same directory as the original file.

## Example

```
> node mkvwrangle.js -d "..\sandbox"
[mkvwrangle] Processing file: "..\sandbox\GOT.S04E01.BDRip.1080p.mkv" in mode: "default".
[mkvwrangle] Identified subtitle track ID: 8.
[mkvwrangle] Identified audio track ID: 4.
[mkvwrangle] Exporting file: "..\sandbox\GOT.S04E01.BDRip.1080p.mkvwrangle.mkv".
[mkvwrangle] File exported.

[mkvwrangle] Processing file: "..\sandbox\Mr.Robot.S01E01.rus.LostFilm.mkv" in mode: "default".
[mkvwrangle] Identified subtitle track ID: 4.
[mkvwrangle] Identified audio track ID: 2.
[mkvwrangle] Exporting file: "..\sandbox\Mr.Robot.S01E01.rus.LostFilm.mkvwrangle.mkv".
...
```

## Version History

- v1.0.0 - Basic implementation allowing input directory or input file. 