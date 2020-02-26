import { createLocalVue, mount } from '@vue/test-utils';
import Vuex from 'vuex';

import logger from '../src/logger';
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
    let localVue;
    let app;
    let store;
    let fatal;

    beforeEach(() => {
        fatal = jest.fn();
        logger.mockTypes((typeName) => typeName === 'fatal' && fatal);

        localVue = createLocalVue();
        localVue.use(Vuex);

        store = new Vuex.Store();
        app = new class {
            constructor() {
                this.store = store;
            }
        };
    });

    it('exports a Vue plugin', () => {
        expect(plugin).toEqual(expect.objectContaining({
            install: expect.any(Function),
        }));
    });

    describe('errors', () => {
        it('errors if no store passed', () => {
            localVue.use(plugin);

            expect(fatal).toHaveBeenCalledWith('You must pass in the Vuex store');
        });

        it('errors if no app passed', () => {
            localVue.use(plugin, {
                store,
            });

            expect(fatal).toHaveBeenCalledWith('You must pass in the NuxtJS app variable');
        });

        it('errors if class passed is not a function', () => {
            localVue.use(plugin, {
                store,
                app,
                classes: [
                    {},
                ],
            });

            expect(fatal).toHaveBeenCalledWith('Passed value is not a class or function');
        });

        it('errors if class does not implement toPOJO', () => {
            localVue.use(plugin, {
                store,
                app,
                classes: [
                    class {},
                ],
            });

            expect(fatal).toHaveBeenCalledWith('Passed class does not implement the "toPOJO" instance method');
        });

        it('errors if class implements toPOJO as a non function', () => {
            class Foo {}
            Foo.prototype.toPOJO = 5;

            localVue.use(plugin, {
                store,
                app,
                classes: [Foo],
            });

            expect(fatal).toHaveBeenCalledWith('Passed class does not implement the "toPOJO" instance method');
        });

        it('errors if class does not implement toKey', () => {
            localVue.use(plugin, {
                store,
                app,
                classes: [
                    class {
                        toPOJO() {}
                    },
                ],
            });

            expect(fatal).toHaveBeenCalledWith('Passed class does not implement the "toKey" instance method');
        });

        it('errors if class does not implement fromPOJO', () => {
            localVue.use(plugin, {
                store,
                app,
                classes: [
                    class {
                        toPOJO() {}
                        toKey() {}
                    },
                ],
            });

            expect(fatal).toHaveBeenCalledWith('Passed class does not implement the "fromPOJO" static method');
        });
    });

    describe('when installed without classes', () => {
        beforeEach(() => {
            localVue.use(plugin, {
                store,
                app,
            });
        });

        it('does not error', () => {
            expect(fatal).not.toHaveBeenCalled();
        });
    });

    describe('when installed', () => {
        beforeEach(() => {
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

        it('does not error', () => {
            expect(fatal).not.toHaveBeenCalled();
        });

        it('registers a Vuex module', () => {
            expect(store.state['nuxt-non-pojo'].instances).toEqual([]);
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
