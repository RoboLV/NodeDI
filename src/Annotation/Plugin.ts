import { InjectorFactory } from "../InjectorFactory";

/**
 * Add plugin for given class object member.
 * All Plugins files should be loaded before target class is initialized.
 *
 * @constructor
 * TODO: rewrite on same name
 * TODO: handle variable extend
 * TODO: move code out from Decorator
 */
export const Plugin = (source: any, name: string, member: string = '', priority: number = 1000): (target: any, property: string) => void => {
    return (target: any, property: string) => {
        const memberName = member || property;

        if (!source.prototype.__PLUGINS__) {
            source.prototype.__PLUGINS__ = [];
        }

        if (!source.prototype.__PLUGINS__[memberName]) {
            source.prototype.__PLUGINS__[memberName] = {};
        }

        switch (typeof source.prototype[memberName]) {
            case "function":
                const sourceMember = source.prototype[memberName];

                // Plugin item data
                source.prototype.__PLUGINS__[memberName][name] = {
                    name,
                    source: sourceMember,
                    callback: function(...args: any[]) {
                        const targetObject = InjectorFactory.instance.create<any>(target);
                        targetObject[property](this, sourceMember.bind(this), ...args);
                    }
                }
                // Override method with
                source.prototype[memberName] = source.prototype.__PLUGINS__[memberName][name].callback;
                break;
            case "boolean":
            case "number":
            case "string":
            case "symbol":
            case "bigint":
            case "object":
                // TODO: add method overwrite
                break;
        }
    };
};