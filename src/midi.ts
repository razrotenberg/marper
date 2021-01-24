interface Note {
    channel: number;
    number: number;
    velocity: number;
}

export class MIDI {
    private outputs: WebMidi.MIDIOutput[] = []; // all available MIDI outputs
    private output?: WebMidi.MIDIOutput; // the selected MIDI output
    private notes: Note[] = []; // active notes

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

    click() {
        // clear previously deleted notes
        this.notes = this.notes.filter((item) => { return item; });

        // temporary demonstration
        if (this.notes.length === 0) {
            this.on({ channel: 0, number: 60, velocity: 127 });
        } else {
            for (let idx in this.notes) {
                this.off(idx);
            }
        }
    }

    private on(note: Note) {
        this.output?.send([0x90 + note.channel, note.number, note.velocity]);
        this.notes.push(note);
    }

    private off(idx: any) {
        const note = this.notes[idx];
        this.output?.send([0x80 + note.channel, note.number, 0]);
        delete this.notes[idx];
    }
}
