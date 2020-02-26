import consola from 'consola';

import logger from '../src/logger';

describe('logger', () => {
    it('exists', () => {
        expect(logger).toBeTruthy();
    });

    it('creates a scoped consola', () => {
        expect(logger._defaults).toEqual(consola.withScope('netsells:nuxt-non-pojo')._defaults);
    });
});
