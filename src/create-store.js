/**
 * Create the store
 * @param {Object} options
 * @returns {Object}
 */
function createStore({ constructors }) {
    return {
        namespaced: true,

        state: {
            instances: [],
        },

        mutations: {
            /**
             * Save an instance
             * @param {Object} state
             * @param {Object} identity
             */
            save(state, { name, key, pojo }) {
                state.instances = [
                    ...state.instances.filter(i => i.name !== name || i.key !== key),
                    { name, key, pojo },
                ];
            },
        },

        getters: {
            /**
             * Instantiate a stored instance
             * @param {Object} state
             * @returns {Function}
             */
            instantiate(state) {
                return ({ name, key }) => {
                    const saved = state.instances.find(i => i.name === name && i.key === key);

                    return saved && constructors[name].fromPOJO(saved.pojo);
                };
            },
        },
    };
};

export default createStore;
