import { Client } from './client';

export class Clock {
    // bars are in 1/4 time signature.
    // the following note values are supported:
    //   1) 1/16 (4 notes in a bar)
    //   2) 1/8 (2 notes in a bar)
    //   3) 1/8 triplet (3 notes in a bar)
    // therefore, we use a multiply of 12 for the number of subdivisions in a bar,
    // as it gives us the needed rhythmic precision.
    // the larger the value we use, the shorter the gap between subdivisions,
    // making it more interactive, but more performance consuming.
    static readonly Subdivisions: number = 96;

    private client: Client;
    private worker?: Worker;

    constructor(client: Client) {
        this.client = client;
    }

    start() {
        // create a URL for the worker script
        const script = 'onmessage = (e) => { setInterval(() => { postMessage(true) }, e.data) }';
        const url = window.URL.createObjectURL(new Blob([script], { type: 'text/javascript' }));

        // currently hard coded
        const bpm = 60;

        // we use a web worker as it is more accurate for keeping time
        // this is true espacially when tab is not in focus
        // reference: https://hackwild.com/article/web-worker-timers
        this.worker = new Worker(url);
        this.worker.postMessage(((60 * 1000) / bpm) / Clock.Subdivisions);
        this.worker.onmessage = (event) => {
            this.client.click();
        }
    }
}
