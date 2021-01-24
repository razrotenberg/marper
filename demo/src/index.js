import { Client } from '../../dist/index.js'

const client = new Client()

window.addEventListener('load', () => {
    client.start();
})
