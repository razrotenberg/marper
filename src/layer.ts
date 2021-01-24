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
            const intervals: number[] = [0 /* P1 */, 4 /* M3 */, 7 /* P5 */]; // intervals of a major triad

            let number = undefined;

            intervals.forEach((interval, index) => {
                if (this.subdivisions == (Clock.Subdivisions / intervals.length) * index) {
                    const root = 60; // currently hard-coded C4
                    const scale: number[] = [0 /* P1 */, 2 /* M2 */, 4 /* M3 */, 5 /* P4 */, 7 /* P5 */, 9 /* M6 */, 11 /* M7 */]; // major scale - wwhwwwh

                    // calculate the degree offset
                    let octaver = 0;
                    let degree = this.degree;
                    while (degree > 7) {
                        degree -= 7;
                        octaver += 12; // P8
                    }

                    number = root + scale[degree - 1] + octaver + interval;
                }
            });

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
