export interface Note {
    channel: number;
    number: number;
    velocity: number;
}

export class MIDI {
    private outputs: WebMidi.MIDIOutput[] = []; // all available MIDI outputs
    private output?: WebMidi.MIDIOutput; // the selected MIDI output

    start() {
        console.debug('[MIDI]', 'Starting');
        navigator.requestMIDIAccess().then(
            (midiAccess: WebMidi.MIDIAccess) => { this.access(midiAccess); },
            (err: any) => { console.error('[MIDI]', 'No MIDI available', err) }
        );
    }

    private access(midiAccess: WebMidi.MIDIAccess) {
        console.debug('[MIDI]', 'Accessing MIDI devices');
        midiAccess.outputs.forEach((output: WebMidi.MIDIOutput) => {
            this.outputs.push(output);
        });

        if (this.outputs.length > 0) {
            this.output = this.outputs[0];
            console.log('[MIDI]', `Selected output device ${this.output.name}`)
        } else {
            console.error('[MIDI]', 'Could not find MIDI output devices');
        }
    }

    on(note: Note) {
        this.output?.send([0x90 + note.channel, note.number, note.velocity]);
    }

    off(note: Note) {
        this.output?.send([0x80 + note.channel, note.number, 0]);
    }
}
