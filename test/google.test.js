import { server, getContentType } from '../src/app.js';
import { validateEventsObj } from '../src/validation.js';
import { validateEventsObj as validationClientSide } from '../public/js/eventValidation.js';
import {
    getAuthorizationURL,
    postEventsServer,
    saveAndValidateEventsOnServer,
    handleGoogleAuth
} from '../public/js/googleAuthClient.js';
import { postEvents } from '../src/google/googleCalendar.js';
import { handleGoogleAuthResponse } from '../src/google/googleAuthServer.js';
import supertest from 'supertest';
import { jest, expect, test, describe } from '@jest/globals';

const request = supertest(server);

//validation events

let eventsInPast = [
    {
        summary: 'Google I/O 2015',
        location: '800 Howard St., San Francisco, CA 94103',
        description: "A chance to hear more about Google's developer products.",
        start: {
            dateTime: '2022-04-15T09:00:00-07:00',
            timeZone: 'Europe/Copenhagen'
        },
        end: {
            dateTime: '2022-04-15T17:00:00-07:00',
            timeZone: 'Europe/Copenhagen'
        }
    },
    {
        summary: 'Anders mongol',
        location: '800 Howard St., San Francisco, CA 94103',
        description: "A chance to hear more about Google's developer products.",
        start: {
            dateTime: '2022-04-16T09:00:00-07:00',
            timeZone: 'Europe/Copenhagen'
        },
        end: {
            dateTime: '2022-04-16T17:00:00-07:00',
            timeZone: 'Europe/Copenhagen'
        }
    }
];

let eventsEndBeforeStart = [
    {
        summary: 'Google I/O 2015',
        location: '800 Howard St., San Francisco, CA 94103',
        description: "A chance to hear more about Google's developer products.",
        start: {
            dateTime: '2022-07-28T09:00:00-07:00',
            timeZone: 'Europe/Copenhagen'
        },
        end: {
            dateTime: '2022-07-27T17:00:00-07:00',
            timeZone: 'Europe/Copenhagen'
        }
    },
    {
        summary: 'Anders mongol',
        location: '800 Howard St., San Francisco, CA 94103',
        description: "A chance to hear more about Google's developer products.",
        start: {
            dateTime: '2022-07-28T09:00:00-07:00',
            timeZone: 'Europe/Copenhagen'
        },
        end: {
            dateTime: '2022-07-29T07:00:00-07:00',
            timeZone: 'Europe/Copenhagen'
        }
    }
];

let eventsValid = [
    {
        summary: 'Google I/O 2015',
        location: '800 Howard St., San Francisco, CA 94103',
        description: "A chance to hear more about Google's developer products.",
        start: {
            dateTime: '2022-07-30T09:00:00-07:00',
            timeZone: 'Europe/Copenhagen'
        },
        end: {
            dateTime: '2022-07-30T17:00:00-07:00',
            timeZone: 'Europe/Copenhagen'
        }
    },
    {
        summary: 'Anders mongol',
        location: '800 Howard St., San Francisco, CA 94103',
        description: "A chance to hear more about Google's developer products.",
        start: {
            dateTime: '2022-07-30T09:00:00-07:00',
            timeZone: 'Europe/Copenhagen'
        },
        end: {
            dateTime: '2022-07-30T11:00:00-07:00',
            timeZone: 'Europe/Copenhagen'
        }
    }
];
let eventsEmptyTitle = [
    {
        summary: '',
        location: '800 Howard St., San Francisco, CA 94103',
        description: "A chance to hear more about Google's developer products.",
        start: {
            dateTime: '2022-07-30T09:00:00-07:00',
            timeZone: 'Europe/Copenhagen'
        },
        end: {
            dateTime: '2022-07-30T17:00:00-07:00',
            timeZone: 'Europe/Copenhagen'
        }
    },
    {
        summary: 'Anders mongol',
        location: '800 Howard St., San Francisco, CA 94103',
        description: "A chance to hear more about Google's developer products.",
        start: {
            dateTime: '2022-07-30T09:00:00-07:00',
            timeZone: 'Europe/Copenhagen'
        },
        end: {
            dateTime: '2022-07-30T11:00:00-07:00',
            timeZone: 'Europe/Copenhagen'
        }
    }
];
let eventsNull = [
    null,
    {
        summary: 'Anders mongol',
        location: '800 Howard St., San Francisco, CA 94103',
        description: "A chance to hear more about Google's developer products.",
        start: {
            dateTime: '2022-07-30T09:00:00-07:00',
            timeZone: 'Europe/Copenhagen'
        },
        end: {
            dateTime: '2022-07-30T11:00:00-07:00',
            timeZone: 'Europe/Copenhagen'
        }
    }
];
let eventsNumber = '';

test('returns mimetype', () => {
    expect(getContentType('/index.html')).toBe('text/html');
});

test('Validation on server side', async () => {
    expect(await validateEventsObj(eventsInPast)).toBe(false);
    expect(await validateEventsObj(eventsEndBeforeStart)).toBe(false);
    expect(await validateEventsObj(eventsNumber)).toBe(false);
    expect(await validateEventsObj(eventsValid)).toBe(true);
    expect(await validateEventsObj(eventsEmptyTitle)).toBe(false);
    expect(await validateEventsObj(eventsNull)).toBe(true);
});

test('Validation on client side', async () => {
    expect(await validationClientSide(eventsInPast)).toHaveProperty('isValid', false);
    expect(await validationClientSide(eventsEndBeforeStart)).toHaveProperty('isValid', false);
    expect(await validationClientSide(eventsValid)).toHaveProperty('isValid', true);
    expect(await validationClientSide(eventsEmptyTitle)).toHaveProperty('isValid', false);
    expect(await validationClientSide(eventsNumber)).toHaveProperty('isValid', false);
    expect(await validationClientSide(eventsNull)).toHaveProperty('isValid', true);
});

test('write autorization redirect URL on server', async () => {
    const response = await request.get('/authorizationRedirect');
    expect(response.status).toBe(200);
    expect(response.text).toBeDefined();
});

test('saveEventsOnServer', async () => {
    let resError = await request.post('/saveEventsOnServer').send(eventsInPast);

    JSON.parse = jest.fn().mockImplementationOnce(() => {
        return eventsValid;
    });
    let resValid = await request.post('/saveEventsOnServer').send(eventsValid);
    expect(resError.status).toBe(200);
    expect(resValid.status).toBe(200);
});

test('Get AuthorizationURL client side fetch', async () => {
    global.fetch = jest.fn(() =>
        Promise.resolve({
            url: 'authorizationURL'
        })
    );
    let response = await getAuthorizationURL();
    expect(response).toEqual({ url: 'authorizationURL' });

    global.fetch = jest.fn(() => Promise.reject());

    response = await getAuthorizationURL();
    expect(response).toEqual(false);
});

test('Post events to server from client', async () => {
    const mockFetch = Promise.resolve({ json: () => Promise.resolve({ body: true }) });
    global.fetch = jest.fn(() => mockFetch);

    let response = await postEventsServer();
    expect(response).toHaveProperty('body', true);
});

test('Save and validate events on server from client side', async () => {
    const mockFetch = Promise.resolve({ json: () => Promise.resolve({ body: true }) });
    global.fetch = jest.fn(() => mockFetch);

    let response = await saveAndValidateEventsOnServer();
    expect(response).toHaveProperty('body', true);
});

test('post events to google calendar', async () => {
    let calendar = { events: { insert: '' } };
    calendar.events.insert = jest.fn().mockImplementationOnce(() => {
        true;
    });
    expect(postEvents(eventsNull)).resolves;
});

// test('handle google auth response on server', async () => {
//     let url = {parse: (x, y) => {x, y}, query:""};

//     url = jest.fn().mockImplementationOnce(() => {
//         code: "RedirectURL";
//     });

//     expect(handleGoogleAuthResponse()).resolves;

// });
