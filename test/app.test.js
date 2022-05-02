import { server, getContentType } from '../src/app.js';
import { jest, expect, test, describe } from '@jest/globals';
import supertest from 'supertest';

const tripAPICall = jest.fn();

describe('server endpoints', () => {
    describe('Server get endpoints', () => {
        test('returns 200 on /', () => {
            return supertest(server)
                .get('/')
                .expect(200);
        });

        test('returns 404 on /notfound', () => {
            return supertest(server)
                .get('/notfound')
                .expect(404);
        });
    });

    describe('Server post endpoints', () => {
        test('returns 200 on POST to /locationService', () => {
            const response = supertest(server)
                .post('/locationService')
                .send('location=test');
            expect(response.status).toBe(200);
        });

        test('returns 404 on POST to /locationService over 51 characters', async () => {
            const response = await supertest(server)
                .post('/locationService')
                .send('location=WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW');
            expect(response.status).toBe(404);
        });

        test('returns 200 on /tripService', () => {
            const response = supertest(server)
                .post('/tripService');
            expect(response.status).toBe(200);
        });
    });
});


describe('app.js tests', () => {
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