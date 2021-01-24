import { Client } from '../../dist/index.js'

const client = new Client()

window.addEventListener('load', () => {
    client.start();

    // layers that are being played currently
    let layers = [];

    console.log('Registering key press handlers');
    document.addEventListener('keydown', event => {
        if (event.key in layers) {
            return;
        }

        if ('12345678'.indexOf(event.key) >= 0) {
            layers[event.key] = client.play(parseInt(event.key, 10));
        }
    });

    document.addEventListener('keyup', event => {
        if (event.key in layers) {
            layers[event.key].stop();
            delete layers[event.key]; // TODO: clear `layers`
        }
    });
})
