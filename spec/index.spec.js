import { createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import Vue from 'vue';

import createPlugin from '../src/index';
import plugin from '../src/plugin';

Vue.use(Vuex);

class Foo {}

describe('index', () => {
    it('exports a function', () => {
        expect(createPlugin).toEqual(expect.any(Function));
    });

    describe('createPlugin', () => {
        it('returns a function', () => {
            expect(createPlugin()).toEqual(expect.any(Function));
        });

        describe('Nuxt plugin', () => {
            let nuxtPlugin;
            let localVue;
            let app;
            let store;

            beforeEach(() => {
                store = new Vuex.Store();
                app = new class {
                    constructor() {
                        this.store = store;
                    }
                };

                jest.spyOn(Vue, 'use');
            });

            describe('with no options', () => {
                beforeEach(() => {
                    nuxtPlugin = createPlugin();
                });

                it('installs the plugin with passed app and store', () => {
                    nuxtPlugin({ store, app });

                    expect(Vue.use).toHaveBeenCalledWith(plugin, {
                        store,
                        app,
                    });
                });
            });

            describe('with options', () => {
                beforeEach(() => {
                    nuxtPlugin = createPlugin({
                        classes: [Foo],
                    });
                });

                it('installs the plugin with passed app, store and options', () => {
                    nuxtPlugin({ store, app });

                    expect(Vue.use).toHaveBeenCalledWith(plugin, {
                        store,
                        app,
                        classes: [Foo],
                    });
                });
            });
        });
    });
});
