import nnp from './nnp';

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
                return nnp({
                    constructors,
                    namespace,
                    store: this.$store,
                });
            },
        },
    };
}

export default createMixin;
