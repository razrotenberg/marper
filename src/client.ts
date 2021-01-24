import { Clock } from './clock';
import { MIDI } from './midi';

export class Client {
    private clock: Clock = new Clock(this);
    private midi: MIDI = new MIDI();

    start() {
        this.clock.start();
        this.midi.start();
    }

    click() {
        this.midi.click();
    }
}
