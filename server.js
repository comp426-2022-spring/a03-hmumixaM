import minimist from 'minimist';
import express from 'express';
import { coinFlip, coinFlips, countFlips, flipACoin } from './modules/coin.mjs';

const args = minimist(process.argv.slice(2));
const HTTP_PORT = parseInt(args['port']) || 5000;
const app = express();

app.get('/app/', (req, res) => {
    res.statusCode = 200;
    res.statusMessage = 'OK';
    res.writeHead( res.statusCode, { 'Content-Type' : 'text/plain' });
    res.end(res.statusCode+ ' ' +res.statusMessage);
});

app.get('/app/flip/', (req, res) => {
    res.statusCode = 200;
    res.json({ "flip": coinFlip() });
});

app.get('/app/flips/:number', (req, res) => {
   res.statusCode = 200;
   const flips = coinFlips(parseInt(req.params.number));
   const stats = countFlips(flips);
   res.json({ "raw": flips, "summary": stats });
});

app.get('/app/flip/call/:guess', (req, res) => {
    res.statusCode = 200; 
    const guess = req.params.guess;
    if (guess === "heads" || guess === "tails") {
        res.json(flipACoin(req.params.guess));
    } else {
        res.json({ 'status': 400, 'msg': 'Wrong guess name.'});
    }
});

const default_router = function(req, res, next){
    res.status(404).send('404 NOT FOUND');
    next();
}

const logger = function(req, res, next) {
    let d = new Date();
    console.log(`${d.toLocaleString()}: ${req.url}, StatusCode - ${res.statusCode}`);
    next();
}

app.use(default_router);
app.use(logger);

const server = app.listen(HTTP_PORT, () => {
    console.log(`App listening on port ${HTTP_PORT}`);
});