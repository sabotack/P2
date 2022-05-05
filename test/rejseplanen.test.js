import { locationServiceCallAPI, tripServiceCallAPI } from '../public/js/rejseplanen.js';
import { jest, expect, test, describe } from '@jest/globals';

let clientLocationResult = [
    {
        CoordLocation: [],
        ':@': {
            '@_name': 'Sigrid Undsets Vej 9220 Aalborg Øst, Aalborg Kommu',
            '@_x': '9989667',
            '@_y': '57016861',
            '@_type': 'ADR'
        }
    },
    {
        StopLocation: [],
        ':@': {
            '@_name': 'AAU Busterminal (Sigrid Undsetsvej / Aalborg)',
            '@_x': '9991205',
            '@_y': '57015638',
            '@_id': '851000307'
        }
    },
    {
        CoordLocation: [],
        ':@': {
            '@_name': 'Specialcenter Sigrid Undset, Specialskole, Kalundb',
            '@_x': '11094783',
            '@_y': '55685477',
            '@_type': 'POI'
        }
    },
    {
        CoordLocation: [],
        ':@': {
            '@_name': 'Sigridsvej 2900 Hellerup, Gentofte Kommune',
            '@_x': '12582804',
            '@_y': '55741498',
            '@_type': 'ADR'
        }
    }
];

let clientTripResult = [
    {
        Leg: [
            {
                Origin: [],
                ':@': {
                    '@_name': 'Vestre Kanalgade (Strandvejen / Aalborg)',
                    '@_type': 'ADR',
                    '@_time': '10:29',
                    '@_date': '05.05.22'
                }
            },
            {
                Destination: [],
                ':@': {
                    '@_name': 'Vestre Kanalgade (Strandvejen / Aalborg)',
                    '@_type': 'ST',
                    '@_time': '10:30',
                    '@_date': '05.05.22'
                }
            },
            {
                Notes: [],
                ':@': {
                    '@_text': 'Varighed: 1 min.;'
                }
            }
        ],
        ':@': {
            '@_name': 'til fods',
            '@_type': 'WALK'
        }
    },
    {
        Leg: [
            {
                Origin: [],
                ':@': {
                    '@_name': 'Vestre Kanalgade (Strandvejen / Aalborg)',
                    '@_type': 'ST',
                    '@_routeIdx': '4',
                    '@_time': '10:30',
                    '@_date': '05.05.22'
                }
            },
            {
                Destination: [],
                ':@': {
                    '@_name': 'AAU Busterminal (Sigrid Undsetsvej / Aalborg)',
                    '@_type': 'ST',
                    '@_routeIdx': '23',
                    '@_time': '10:59',
                    '@_date': '05.05.22'
                }
            },
            {
                Notes: [],
                ':@': {
                    '@_text': 'Retning: Universitetet;'
                }
            },
            {
                JourneyDetailRef: [],
                ':@': {
                    '@_ref':
                        'journeyDetail?ref=27543%2F45929%2F961782%2F471716%2F86%3Fdate%3D05.05.22%26station_evaId%3D851905802'
                }
            },
            {
                MessageList: [
                    {
                        Message: [
                            {
                                Header: [
                                    {
                                        '#text': 'Omkørsel Bertil Ohlinsvej'
                                    }
                                ]
                            },
                            {
                                Text: [
                                    {
                                        '#text':
                                            'Følgende stoppesteder er nedlagt: Mejrupstien, AAU busterminal Postgårdsvej    Vi beklager ulejligheden.'
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        Message: [
                            {
                                Header: [
                                    {
                                        '#text': 'Omkørsel Bertil Ohlinsvej'
                                    }
                                ]
                            },
                            {
                                Text: [
                                    {
                                        '#text':
                                            'Følgende stoppesteder betjenes ikke  Stoppestedet Niels Jernesvej er nedlagt for linje 12 og  Mejrupstien er nedlagt   Vi beklager ulejligheden.'
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        Message: [
                            {
                                Header: [
                                    {
                                        '#text': 'Omkørsel Bertil Ohlinsvej'
                                    }
                                ]
                            },
                            {
                                Text: [
                                    {
                                        '#text':
                                            'Omkørsel for linje 2-5-22N benytter ikke følgende stoppesteder Mejrupstien,  Bertil Ohlinsvej mod syd     Vi beklager ulejligheden.'
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        Message: [
                            {
                                Header: [
                                    {
                                        '#text': 'Omkørsel Bertil Ohlinsvej'
                                    }
                                ]
                            },
                            {
                                Text: [
                                    {
                                        '#text':
                                            'Linje 6-55-56 betjener ikke følgende stoppesteder  Regionshuset på Frederiks Bajersvej og Mejrupstien er nedlagt i perioden men benyttes af andre linjer   Vi beklager ulejligheden.'
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        ],
        ':@': {
            '@_name': 'Bybus 2',
            '@_type': 'BUS',
            '@_line': '2'
        }
    },
    {
        Leg: [
            {
                Origin: [],
                ':@': {
                    '@_name': 'AAU Busterminal (Sigrid Undsetsvej / Aalborg)',
                    '@_type': 'ST',
                    '@_time': '10:59',
                    '@_date': '05.05.22'
                }
            },
            {
                Destination: [],
                ':@': {
                    '@_name': 'Sigrid Undsets Vej 256B, 9220 Aalborg Øst, Aalborg Kommu',
                    '@_type': 'ADR',
                    '@_time': '11:02',
                    '@_date': '05.05.22'
                }
            },
            {
                Notes: [],
                ':@': {
                    '@_text': 'Varighed: 3 min.;(Afstand: ca. 0,1 km);'
                }
            }
        ],
        ':@': {
            '@_name': 'til fods',
            '@_type': 'WALK'
        }
    }
];

describe('locationServiceCallAPI', () => {
    test('returns the correct object on resolve', async () => {
        const mFetch = Promise.resolve({ ok: true, json: () => Promise.resolve(clientLocationResult) });
        global.fetch = jest.fn(() => mFetch);
        let response = await locationServiceCallAPI();

        expect(response).toEqual(clientLocationResult);
    });

    test('returns an error on reject', async () => {
        let returnedError;

        // Promise is resolved here, as the initial fetch from server will succeed
        const mFetch = Promise.resolve({ ok: false, statusText: 'Mocked error from server', status: 401 });
        global.fetch = jest.fn(() => mFetch);
        let response = await locationServiceCallAPI().catch((err) => (returnedError = err));

        expect(returnedError.code).toBe(401);
        expect(returnedError.message).toBe('Mocked error from server');
    });
});

describe('tripServiceCallAPI', () => {
    test('returns the correct object on resolve', async () => {
        const mFetch = Promise.resolve({ ok: true, json: () => Promise.resolve(clientTripResult) });
        global.fetch = jest.fn(() => mFetch);
        let response = await tripServiceCallAPI('');
        expect(response).toEqual(clientTripResult);
    });

    test('returns an error on reject', async () => {
        let returnedError;

        // Promise is resolved here, as the initial fetch from server will succeed
        const mFetch = Promise.resolve({ ok: false, statusText: 'Mocked error from server', status: 401 });
        global.fetch = jest.fn(() => mFetch);
        let response = await tripServiceCallAPI('').catch((err) => (returnedError = err));

        expect(returnedError.code).toBe(401);
        expect(returnedError.message).toBe('Mocked error from server');
    });
});
