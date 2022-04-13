import {server, getContentType} from '../src/nodeServer';

test('returns mimetype', () => {
    expect(getContentType('/index.html')).toBe('text/html');
    server.close();
});