import { Layer } from './layer';
import { MIDI } from './midi';

export class Sequencer {
    private midi: MIDI;
    private layers: Layer[] = [];

    constructor(midi: MIDI) {
        this.midi = midi;
    }

    play(degree: number): Layer {
        // create the new layer
        const layer = new Layer(this.midi, degree);

        // store it to be clicked
        this.layers.push(layer);

        // return it to the user for stopping
        return layer;
    }

    click() {
        // clear previously revoked layers
        this.layers = this.layers.filter(layer => layer.active());

        // click all layers
        this.layers.forEach(layer => layer.click());
    }
}
