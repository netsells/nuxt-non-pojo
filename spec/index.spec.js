import createPlugin from '../src/index';

describe('index', () => {
    it('exports createPlugin', () => {
        expect(createPlugin).toEqual(expect.any(Function));
    });

    describe('createPlugin', () => {
        it('returns a Nuxt plugin', () => {
            expect(createPlugin()).toEqual(expect.any(Function));
        });
    });
});
