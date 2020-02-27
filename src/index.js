import plugin from './plugin';

/**
 * Create an easier way to load the plugin
 * @param {Object} options
 * @returns {Function}
 */
function createPlugin(Vue, options = {}) {
    return function({ store, app }) {
        Vue.use(plugin, {
            store,
            app,
            ...options,
        });
    };
}

export default createPlugin;
