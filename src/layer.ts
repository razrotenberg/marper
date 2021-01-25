import { Clock } from './clock';
import { MIDI, Note } from './midi';

enum State {
    Active,
    Stopped,
    Inactive, // this layer can be safely deleted
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
            let number = undefined;

            const steps = 4; // we play seventh chords (4 note chords)
            for (let index = 0; index < steps; ++index) {
                if (this.subdivisions == (Clock.Subdivisions / steps) * index) {
                    // we use the major scale for now
                    const scale: number[] = [0 /* P1 */, 2 /* M2 */, 4 /* M3 */, 5 /* P4 */, 7 /* P5 */, 9 /* M6 */, 11 /* M7 */];

                    // we build chords by stacking thirds starting from the scale degree
                    // this can be done by skipping every other note of the diatonic scale
                    const degree = this.degree - 1 + (index * 2);

                    // note that `degree` can be greater than 7 and we need
                    // to take the interval an octave higher
                    const interval = scale[degree % scale.length] + (Math.floor(degree / scale.length) * 12 /* P8 */);

                    // calculate the final midi note number
                    number = 60 /* C4 */ + interval;
                }
            }

            if (number) {
                this.on({ channel: 0, number: number, velocity: 127 });
            }

            // advance to the next subdivision
            this.subdivisions = (this.subdivisions + 1) % Clock.Subdivisions;
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
