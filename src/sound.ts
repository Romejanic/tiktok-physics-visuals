import SoxCommand from "sox-audio";
import fs from "fs/promises";

type SoundTimestamp = [string, number];

const SOUND_DIR = "res/";
const BATCH_SIZE = 300;
const COMBINE_MODE = "mix-power";

export default class AudioTrack {

    private readonly timestamps = new Array<SoundTimestamp>();
    private time = 0;

    update(time: number) {
        this.time = time;
    }

    playSound(name: string) {
        this.timestamps.push([name, this.time]);
    }

    async export(file: string) {
        const sounds = [];
        // calculate delays between sounds and add them to list
        let lastSoundTime = 0;
        for(const [name, time] of this.timestamps) {
            // const delay = time - lastSoundTime;
            sounds.push(SoxCommand()
                .input(SOUND_DIR + name)
                .addEffect("pad", [time.toFixed(3), 0])
                .output("-p")
                .outputFileType("wav")
            );
            lastSoundTime = time;
        }

        // calculate batches from sound list
        const soundBatches = batchSounds(sounds, BATCH_SIZE);
        const batchFiles   = new Array<string>();
        
        // process each batch sequentially
        for(let i = 0; i < soundBatches.length; i++) {
            const batch = soundBatches[i];
            const outFile = `${file}-b${i.toString().padStart(4,"0")}.wav`;

            // generate command to create track
            const rootCmd = new SoxCommand();
            batch.forEach(s => rootCmd.inputSubCommand(s));
            rootCmd.output(outFile).combine(COMBINE_MODE);

            // run the command and wait for completion
            try {
                await runSoxCommand(rootCmd, `batch ${i+1}/${soundBatches.length}`);
                batchFiles.push(outFile);
            } catch(e) {
                process.exit(1); // force quit
            }
        }

        // special case: if there's only one batch, that's our output file
        if(soundBatches.length === 1) {
            return await fs.rename(batchFiles[0], file);
        }

        // combine batches into single file
        const finalCmd = new SoxCommand();
        batchFiles.forEach(f => {
            finalCmd.inputSubCommand(new SoxCommand()
                .input(f)
                .output("-p")
                .outputFileType("wav")
            );
        });
        finalCmd.output(file).combine(COMBINE_MODE);
        await runSoxCommand(finalCmd, "final");

        // clean up batch files
        for(const path of batchFiles) {
            try {
                await fs.unlink(path);
            } catch(e) {
                console.error("Failed to delete batch file!", e);
            }
        }
    }

    get soundCount() {
        return this.timestamps.length;
    }

}

function runSoxCommand(cmd: SoxCommand, name: string) {
    return new Promise<void>((resolve, reject) => {
        // log status of command
        cmd.on("start", _ => console.log(`Started generating audio ${name}`));
        cmd.on("end", _ => {
            console.log(`Finished processing audio ${name}!`);
            resolve();
        });
        cmd.on("error", (err, stdout, stderr) => {
            console.error("Error processing audio batch!", err);
            console.error("STDOUT", stdout);
            console.error("STDERR", stderr);
            reject(err);
        });

        // start running command
        cmd.run(); 
    });
}

function batchSounds(sounds: SoundTimestamp[], maxSize: number) {
    if(sounds.length < maxSize) return [sounds];
    const batchesRequired = Math.ceil(sounds.length / maxSize);
    const batches = new Array<SoundTimestamp[]>(batchesRequired);
    for(let i = 0; i < batchesRequired; i++) {
        const startIdx = i * maxSize;
        const endIdx = Math.min(startIdx + maxSize, sounds.length - 1);
        batches[i] = sounds.slice(startIdx, endIdx);
    }
    return batches;
}
