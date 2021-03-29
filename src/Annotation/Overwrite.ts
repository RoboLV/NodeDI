import { IType } from "../IType";
import { OverwriteExists } from "../Exception/OverwriteExists";

/**
 * Allow overwrite class by another class
 * @constructor
 */
export const Overwrite = (type: IType<any>): (target: IType<any>) => void => {
    return (target: IType<any>) => {
        if (type.prototype.__OVERWRITE_CLASS__) {
            throw new OverwriteExists();
        }
        type.prototype.__OVERWRITE_CLASS__ = target;
    };
};