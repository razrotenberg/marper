import { MIDI, Note } from './midi';
import { Time } from './time';

enum State {
    Active,
    Stopped,
    Inactive, // this layer can be safely deleted
}

interface Configuration {
    root: number;
    mode: string;
    steps: number;
}

export class Layer {
    private midi: MIDI;
    private degree: number;
    private state: State = State.Active;
    private subdivisions: number = 0;
    private played?: Note = undefined;

    constructor(midi: MIDI, degree: number) {
        this.midi = midi;
        this.degree = degree;
        console.log('[Layer]', `Starting layer of degree ${this.degree}`);
    }

    private off() {
        if (this.played) {
            this.midi.off(this.played);
            this.played = undefined;
        }
    }

    private on(note: Note) {
        // stop the currently playing note if there's one
        this.off();

        // play this new note
        this.played = note;
        this.midi.on(this.played);
    }

    click() {
        if (this.state === State.Active) {
            const configuration: Configuration = {
                root: 60, // C4
                mode: 'ionian',
                steps: 4, // seventh chords (4 note chords)
            };

            let number = undefined; // the midi note number to be played

            for (let index = 0; index < configuration.steps; ++index) {
                if (this.subdivisions == (Time.Subdivisions / configuration.steps) * index) {
                    // we use the major scale for now
                    const scale: number[] = [0 /* P1 */, 2 /* M2 */, 4 /* M3 */, 5 /* P4 */, 7 /* P5 */, 9 /* M6 */, 11 /* M7 */];

                    // all modern modes of the major scale
                    const modes = ['ionian', 'dorian', 'phrygian', 'lydian', 'mixolydian', 'aeolian', 'locrian'];

                    // get the offset of the mode in the scale
                    const offset = modes.indexOf(configuration.mode.toLowerCase());
                    if (offset === -1) {
                        console.warn('[Layer]', `Unrecognized mode '${configuration.mode}'`);
                        continue;
                    }

                    // we build chords by stacking thirds starting from the scale degree.
                    // this can be done by skipping every other note of the diatonic scale.
                    // we calculate the scale degree of the current chord degree.
                    // use the mode offset as well to get the correct interval.
                    const degree = offset + (this.degree - 1) + (index * 2);

                    // the degree can be greater than 7 and we need to take
                    // the interval some octaves higher in such cases.
                    // we also normalize the interval according to the mode.
                    const interval = scale[degree % scale.length] + (Math.floor(degree / scale.length) * 12 /* P8 */) - scale[offset];

                    // calculate the final midi note number
                    number = configuration.root + interval;
                }
            }

            if (number) {
                this.on({ channel: 0, number: number, velocity: 127 });
            }

            // advance to the next subdivision
            this.subdivisions = (this.subdivisions + 1) % Time.Subdivisions;
        } else if (this.state === State.Stopped) {
            this.off();
            this.state = State.Inactive;
        } else {
            console.warn('[Layer]', `Unexpected state ${this.state}`);
        }
    }

    stop() {
        console.log('[Layer]', `Stopping layer of degree ${this.degree}`);
        this.state = State.Stopped;
    }

    active(): boolean {
        return this.state !== State.Inactive;
    }
}
