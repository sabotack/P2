import { server } from './app.js';

const hostname = 'localhost';
const port = 3000;

/* OPTIONS FOR HTTPS
let options = {
    key: fs.readFileSync('PRIVATE_KEY_FILE'),
    cert: fs.readFileSync('PUBLIC_KEY_FILE')
};
*/

server.listen(port, function () {
    console.log(`Server running on http://${hostname}:${port}/`);
});
