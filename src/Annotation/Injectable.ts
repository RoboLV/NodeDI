import { IType } from "../IType";

/**
 * Annotation for injectable classes
 * Annotations makes available meta data for Reflection
 *
 * @constructor
 */
export const Injectable = (): (target: IType<any>) => void => {
    return (target: IType<any>) => {
        target.prototype.__IS_INJECTABLE__ = true;
    };
};