import createStore from './create-store';
import createMixin from './create-mixin';
import logger from './logger';
import nnp from './nnp';

const NuxtNonPojo = {
    /**
     * Install the plugin
     * @param {Object} Vue
     * @param {Object} options
     */
    install(Vue, {
        store,
        app,
        namespace = 'nuxt-non-pojo',
        classes = [],
    } = {}) {
        if (!store) {
            logger.fatal('You must pass in the Vuex store');

            return;
        }

        if (!app) {
            logger.fatal('You must pass in the NuxtJS app variable');

            return;
        }

        const constructors = {};

        for (const Klass of classes) {
            if (typeof Klass !== 'function') {
                logger.fatal('Passed value is not a class or function');
                continue;
            }

            for (const funcName of ['toPOJO', 'toKey']) {
                if (typeof Klass.prototype[funcName] !== 'function') {
                    logger.fatal(`Passed class does not implement the "${ funcName }" instance method`);
                }
            }

            if (typeof Klass.fromPOJO !== 'function') {
                logger.fatal('Passed class does not implement the "fromPOJO" static method');
            }

            constructors[Klass.name] = Klass;
        }

        store.registerModule(namespace, createStore({ constructors }));

        Vue.mixin(createMixin({ constructors, namespace }));

        Object.defineProperty(app, '$nnp', {
            /**
             * Get the $nnp property
             * @returns {Function}
             */
            get() {
                return nnp({
                    constructors,
                    namespace,
                    store: this.store,
                });
            },
        });
    },
};

export default NuxtNonPojo;
