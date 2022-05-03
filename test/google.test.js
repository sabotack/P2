import { server, getContentType } from '../src/app.js';
import { validateEventsObj } from '../src/validation.js';
import { validateEventsObj as validationClientSide } from '../public/js/eventValidation.js';
import { saveAndValidateEventsOnServer } from '../public/js/googleAuthClient.js';
import supertest from 'supertest';

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
    //server.close();
});

test('Validation on server side', async () => {
    expect(await validateEventsObj(eventsInPast)).toBe(false);
    expect(await validateEventsObj(eventsEndBeforeStart)).toBe(false);
    expect(await validateEventsObj(eventsNumber)).toBe(false);
    expect(await validateEventsObj(eventsValid)).toBe(true);
    expect(await validateEventsObj(eventsEmptyTitle)).toBe(false);
    expect(await validateEventsObj(eventsNull)).toBe(true);

    //server.close();
});

test('Validation on client side', async () => {
    expect(await validationClientSide(eventsInPast)).toHaveProperty('isValid', false);
    expect(await validationClientSide(eventsEndBeforeStart)).toHaveProperty('isValid', false);
    expect(await validationClientSide(eventsValid)).toHaveProperty('isValid', true);
    expect(await validationClientSide(eventsEmptyTitle)).toHaveProperty('isValid', false);
    expect(await validationClientSide(eventsNumber)).toHaveProperty('isValid', false);
    expect(await validationClientSide(eventsNull)).toHaveProperty('isValid', true);
    //server.close();
});

test('write autorization redirect URL on server', async () => {
    const response = await request.get('/authorizationRedirect');
    expect(response.status).toBe(200);
    expect(response.text).toBeDefined();
});

test('saveEventsOnServer', async () => {
    const resValid = await request.post('/saveEventsOnServer').send(eventsValid);
    const resInvalid = await request.post('/saveEventsOnServer').send(eventsInPast);
    expect(resInvalid.status).toBe(200);
    expect(resValid.status).toBe(200);
});

/* test('save events on server from client side', async () => {
    let ans = await saveAndValidateEventsOnServer(eventsValid);
    expect(ans).toBe(true);
}); */
