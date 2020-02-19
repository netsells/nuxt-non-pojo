import logger from './logger';

function createStore(classes) {
    const constructors = {};

    for (const Klass of classes) {
        if (typeof Klass !== 'function') {
            logger.fatal('Passed value is not a class or function');
        }

        for (const funcName of ['toJSON', 'toKey']) {
            if (typeof Klass.prototype[funcName] !== 'function') {
                logger.fatal(`Passed class does not implement the "${ funcName }" instance method`);
            }
        }

        if (typeof Klass.fromJSON !== 'function') {
            logger.fatal(`Passed class does not implement the "fromJSON" static method`);
        }

        constructors[Klass.name] = Klass;
    }

    return {
        namespaced: true,

        state() {
            return {
                instances: [],
            };
        },

        mutations: {
            save(state, { name, key, json }) {
                state.instances = [
                    ...state.instances.filter(i => i.name !== name || i.key !== key),
                    { name, key, json },
                ];
            },
        },

        getters: {
            instantiate(state) {
                return ({ name, key }) => {
                    const { json } = state.instances.find(i => i.name === name && i.key === key);

                    return saved && constructors[name].fromJSON(json);
                };
            },
        },
    };
};

export default createStore;
