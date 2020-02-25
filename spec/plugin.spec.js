import { createLocalVue } from '@vue/test-utils'
import Vuex from 'vuex';

import plugin from '../src/plugin';

class Base {
    constructor() {
        this.fields = {};
    }

    toPOJO() {
        return this.fields;
    }

    toKey() {
        return this.fields.id;
    }

    static fromPOJO(fields) {
        const Klass = this;
        const k = new Klass();
        k.fields = fields;
    }
}

class Foo extends Base {}
class Bar extends Base {}

describe('plugin', () => {
    it('exports a Vue plugin', () => {
        expect(plugin).toEqual(expect.objectContaining({
            install: expect.any(Function),
        }));
    });

    describe('when installed', () => {
        let localVue;
        let store;
        let app;

        beforeEach(() => {
            localVue = createLocalVue();
            localVue.use(Vuex);

            app = {};
            store = new Vuex.Store();

            localVue.use(plugin, {
                store,
                app,
                classes: [
                    Foo,
                    Bar,
                ],
            });
        });

        it('adds $nnp to the app context', () => {
            expect(app.$nnp).toEqual(expect.any(Function));
        });
    });
});
