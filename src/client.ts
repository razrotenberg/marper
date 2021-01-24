import { Clock } from './clock';
import { Layer } from './layer';
import { MIDI } from './midi';
import { Sequencer } from './sequencer';

export class Client {
    private clock: Clock = new Clock(this);
    private midi: MIDI = new MIDI();
    private sequencer: Sequencer = new Sequencer(this.midi);

    start() {
        this.clock.start();
        this.midi.start();
    }

    click() {
        this.sequencer.click();
    }

    play(degree: number): Layer {
        return this.sequencer.play(degree);
    }
}
