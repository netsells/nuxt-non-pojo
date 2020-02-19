import logger from './logger';

function createMixin({ constructors, namespace }) {
    return {
        computed: {
            $nnp() {
                const get = (identity) => {
                    const instantiate = this.$store.getters[`${ namespace }/instantiate`];

                    return instantiate(identity);
                };

                get.save = (instance) => {
                    if (typeof instance !== 'object') {
                        logger.fatal('Passed value is not a class instance');
                    }

                    const { name } = instance.constructor;

                    if (!Object.keys(constructors).includes(name)) {
                        logger.fatal(`Passed values class has not been registered: "${ name }"`);
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
