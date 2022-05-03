import { server, getContentType } from '../src/app.js';
import { jest, expect, test, describe } from '@jest/globals';
import supertest from 'supertest';

const tripAPICall = jest.fn();

describe('server endpoints', () => {
    describe('Server get endpoints', () => {
        test('returns 200 on /', async () => {
            const response = await supertest(server).get('/');
            expect(response.status).toBe(200);
            expect(response.headers['content-type']).toEqual(expect.stringContaining('html'));
        });

        test('returns 200 on /authorizationRedirect', async () => {
            const response = await supertest(server).get('/authorizationRedirect');
            expect(response.status).toBe(200);
        });

        test('returns 404 on /notfound', async () => {
            const response = await supertest(server).get('/notfound');
            expect(response.status).toBe(404);
            expect(response.headers['content-type']).toEqual(expect.stringContaining('html'));
        });
    });

    describe('Server post endpoints', () => {
        test('returns 200 on POST to /locationService', async () => {
            const response = await supertest(server).post('/locationService').send('location=test');
            expect(response.status).toBe(200);
            expect(response.headers['content-type']).toEqual(expect.stringContaining('text'));
        });

        test('returns 404 on POST to /locationService over 51 characters', async () => {
            const response = await supertest(server)
                .post('/locationService')
                .send('location=WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW');
            expect(response.status).toBe(413);
        });

        test('returns 200 on /tripService', async () => {
            let today = new Date();

            const response = await supertest(server)
                .post('/tripService')
                .send(
                    'originCoordName=Sigrid Undsets Vej 196B' +
                        '&originCoordX=9990189' +
                        '&originCoordY=57017220' +
                        '&destCoordX=9912378' +
                        '&destCoordY=57053150' +
                        '&destCoordName=Vestre Kanal Gade' +
                        '&date=05.05.2022' +
                        '&time=12:00'
                );
            expect(response.status).toBe(200);
            expect(response.headers['content-type']).toEqual(expect.stringContaining('text'));
        });

        test('returns 204 on /tripService with invalid object', async () => {
            let today = new Date();

            const response = await supertest(server)
                .post('/tripService')
                .send(
                    'originCoordName=Sigrid Undsets Vej 196B' +
                        '&originCoordX=9990189' +
                        '&originCoordY=57017220' +
                        '&destCoordName=Vestre Kanal Gade'
                );
            expect(response.status).toBe(204);
            expect(response.headers['content-type']).toEqual(expect.stringContaining('text'));
        });

        test('returns 400 on /tripService with incomplete object', async () => {
            let today = new Date();

            const response = await supertest(server)
                .post('/tripService')
                .send(
                    'originCoordName=Sigrid Undsets Vej 196B' +
                        '&originCoordX=9990189' +
                        '&originCoordY=57017220' +
                        '&destCoordX=9912378' +
                        '&destCoordY=57053150' +
                        '&destCoordName=Vestre Kanal Gade' +
                        '&date=' +
                        '&time=12:00'
                );
            expect(response.status).toBe(400);
            expect(response.headers['content-type']).toEqual(expect.stringContaining('text'));
        });

        test('returns 404 on /notfound', async () => {
            const response = await supertest(server).post('/notfound');
            expect(response.status).toBe(404);
        });
    });

    test('returns 405 on unhandled HTTP method', async () => {
        const response = await supertest(server).put('/');
        expect(response.status).toBe(405);
    });
});

describe('app.js', () => {
    test('returns correct mimetype', () => {
        expect(getContentType('/index.html')).toBe('text/html');
    });

    test('returns octet stream on undefined mimetype', () => {
        expect(getContentType('/sfesjgl')).toBe('application/octet-stream');
    });
});

/* jest.mock('http', () => ({
    createServer: jest.fn(() => ({ listen: jest.fn() })),
}));
  
describe('Server', () => {

    it('should create server on port 3000', () => {
        const server = new server().startServer();
        expect(http.createServer).toBeCalled();
    });
});

jest.mock('http', () =>{

    const server = http.createServer(function (request, response) {
S      });

}) */
