/**
 * Get NNP property
 * @param {Object} options
 * @returns {Function}
 */
function nnp({ store, constructors, namespace }) {
    /**
     * Get an NNP instance
     * @param {Object} identity
     * @returns {any}
     */
    function get(identity) {
        const instantiate = store.getters[`${ namespace }/instantiate`];

        return instantiate(identity);
    };

    get.save = function(instance) {
        if (typeof instance !== 'object') {
            throw new Error('Passed value is not a class instance');
        }

        const { name } = instance.constructor;

        if (!Object.keys(constructors).includes(name)) {
            throw new Error(`Passed values class has not been registered: "${ name }"`);
        }

        const key = instance.toKey();

        const identity = { key, name };

        store.commit(`${ namespace }/save`, {
            ...identity,
            pojo: instance.toPOJO(),
        });

        return identity;
    };

    return get;
}

export default nnp;
