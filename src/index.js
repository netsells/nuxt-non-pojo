import createStore from './create-store';
import createMixin from './create-mixin';
import logger from './logger';

const NuxtNonPojo = {
    install(Vue, {
        store,
        namespace = 'nuxt-non-pojo',
        classes = [],
    } = {}) {
        if (!store) {
            logger.fatal('Enable vuex store by creating `store/index.js`.');

            return;
        }

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

        store.registerModule(namespace, createStore({ constructors }));

        Vue.mixin(createMixin({ constructors, namespace }));
    }
}

export default NuxtNonPojo;
