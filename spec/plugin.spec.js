import { createLocalVue, mount } from '@vue/test-utils'
import Vuex from 'vuex';

import plugin from '../src/plugin';

const TestBase = {
    template: '<div />',
};

class Base {
    constructor(fields = {}) {
        this.fields = fields;
    }

    toPOJO() {
        return this.fields;
    }

    toKey() {
        return this.fields.id;
    }

    static fromPOJO(fields) {
        const Klass = this;

        return new Klass(fields);
    }
}

class Foo extends Base {}
class Bar extends Base {}
class Broken {}

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

            store = new Vuex.Store();
            app = new class {
                constructor() {
                    this.store = store;
                }
            };

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

        describe('in a component', () => {
            let wrapper;

            beforeEach(() => {
                wrapper = mount(TestBase, {
                    localVue,
                });
            });

            it('adds the $nnp mixin', () => {
                expect(wrapper.vm.$nnp).toEqual(expect.any(Function));
            });
        });

        describe('$nnp', () => {
            it('will return null if not found', () => {
                expect(app.$nnp('foo')).toBe(undefined);
            });

            describe('save', () => {
                it('will throw if class not registered', () => {
                    expect(() => {
                        app.$nnp.save(new Broken())
                    }).toThrow(new Error('Passed values class has not been registered: "Broken"'));
                });

                it('will throw if not an object', () => {
                    expect(() => {
                        app.$nnp.save(5)
                    }).toThrow(new Error('Passed value is not a class instance'));
                });

                it('returns the identity', () => {
                    expect(app.$nnp.save(new Foo({ id: 5 }))).toEqual({
                        key: 5,
                        name: 'Foo',
                    });
                });

                describe('when objects saved', () => {
                    let objects;
                    let pojos;

                    beforeEach(() => {
                        objects = {};
                        pojos = {};

                        objects.foo1 = new Foo({ id: 1, foo: 'foo' });
                        objects.foo2 = new Foo({ id: 2, foo: 'bar' });
                        objects.bar1 = new Bar({ id: 1, bar: 'foo' });
                        objects.bar2 = new Bar({ id: 2, bar: 'bar' });

                        Object.keys(objects).forEach(k => {
                            pojos[k] = app.$nnp.save(objects[k]);
                        });
                    });

                    it('will load the correct ones', () => {
                        expect(app.$nnp(pojos.foo1)).toEqual(objects.foo1);
                        expect(app.$nnp(pojos.foo2)).toEqual(objects.foo2);
                        expect(app.$nnp(pojos.bar1)).toEqual(objects.bar1);
                        expect(app.$nnp(pojos.bar2)).toEqual(objects.bar2);
                    });
                });
            });
        });
    });
});
