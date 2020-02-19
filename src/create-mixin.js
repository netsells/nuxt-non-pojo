/**
 * Create the mixin
 * @param {Object} options
 * @returns {Object}
 */
function createMixin({ constructors, namespace }) {
    return {
        computed: {
            /**
             * Get NNP property
             * @returns {Function}
             */
            $nnp() {
                /**
                 * Get an NNP instance
                 * @param {Object} identity
                 * @returns {any}
                 */
                const get = (identity) => {
                    const instantiate = this.$store.getters[`${ namespace }/instantiate`];

                    return instantiate(identity);
                };

                get.save = (instance) => {
                    if (typeof instance !== 'object') {
                        throw new Error('Passed value is not a class instance');
                    }

                    const { name } = instance.constructor;

                    if (!Object.keys(constructors).includes(name)) {
                        throw new Error(`Passed values class has not been registered: "${ name }"`);
                    }

                    const key = instance.toKey();

                    const identity = { key, name };

                    this.$store.commit(`${ namespace }/save`, {
                        ...identity,
                        pojo: instance.toPOJO(),
                    });

                    return identity;
                };

                return get;
            },
        },
    };
}

export default createMixin;
