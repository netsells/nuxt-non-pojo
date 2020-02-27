import { createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';

import createPlugin from '../src/index';
import plugin from '../src/plugin';

class Foo {}

describe('index', () => {
    let localVue;

    beforeEach(() => {
        localVue = createLocalVue();
        localVue.use(Vuex);
    });

    it('exports a function', () => {
        expect(createPlugin).toEqual(expect.any(Function));
    });

    describe('createPlugin', () => {
        it('returns a function', () => {
            expect(createPlugin(localVue)).toEqual(expect.any(Function));
        });

        describe('Nuxt plugin', () => {
            let nuxtPlugin;
            let app;
            let store;

            beforeEach(() => {
                store = new Vuex.Store();
                app = new class {
                    constructor() {
                        this.store = store;
                    }
                };

                jest.spyOn(localVue, 'use');
            });

            describe('with no options', () => {
                beforeEach(() => {
                    nuxtPlugin = createPlugin(localVue);
                });

                it('installs the plugin with passed app and store', () => {
                    nuxtPlugin({ store, app });

                    expect(localVue.use).toHaveBeenCalledWith(plugin, {
                        store,
                        app,
                    });
                });
            });

            describe('with options', () => {
                beforeEach(() => {
                    nuxtPlugin = createPlugin(localVue, {
                        classes: [Foo],
                    });
                });

                it('installs the plugin with passed app, store and options', () => {
                    nuxtPlugin({ store, app });

                    expect(localVue.use).toHaveBeenCalledWith(plugin, {
                        store,
                        app,
                        classes: [Foo],
                    });
                });
            });
        });
    });
});
