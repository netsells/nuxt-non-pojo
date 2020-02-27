import logger from './logger';

function registerConstructor(constructors, Klass) {
    if (typeof Klass !== 'function') {
        logger.fatal('Passed value is not a class or function');
        return;
    }

    for (const funcName of ['toPOJO', 'toKey']) {
        if (typeof Klass.prototype[funcName] !== 'function') {
            logger.fatal(`Passed class does not implement the "${ funcName }" instance method`);
            return;
        }
    }

    if (typeof Klass.fromPOJO !== 'function') {
        logger.fatal('Passed class does not implement the "fromPOJO" static method');
        return;
    }

    constructors[Klass.name] = Klass;
}

export default registerConstructor;
