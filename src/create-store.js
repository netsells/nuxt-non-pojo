import logger from './logger';

function createStore({ constructors }) {
    return {
        namespaced: true,

        state: {
            instances: [],
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
                    const saved = state.instances.find(i => i.name === name && i.key === key);

                    return saved && constructors[name].fromJSON(saved.json);
                };
            },
        },
    };
};

export default createStore;
