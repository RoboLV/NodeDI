import { IType } from "../IType";

/**
 * Allow factory to create multiple objects from same class
 * @constructor
 */
export const Overwrite = (type: IType<any>): (target: IType<any>) => void => {
    return (target: IType<any>) => {
        type.prototype.__OVERWRITE_CLASS__ = target;
    };
};