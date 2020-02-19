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
        }

        store.registerModule(namespace, createStore(classes));

        Vue.mixin(createMixin(namespace));
    }
}

export default NuxtNonPojo;
