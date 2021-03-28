import { IType } from "../IType";

/**
 * Allow factory to create multiple objects from same class
 * @constructor
 */
export const Reinitializezible = (): (target: IType<any>) => void => {
    return (target: IType<any>) => {
        target.prototype.__IS_REINITIALIZEZIBLE__ = true;
    };
};