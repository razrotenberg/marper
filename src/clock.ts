import { Client } from './client';
import { Time } from './time';

export class Clock {
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
        this.worker.postMessage(((60 * 1000) / bpm) / Time.Subdivisions);
        this.worker.onmessage = (event) => {
            this.client.click();
        }
    }
}
