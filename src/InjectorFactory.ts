import 'reflect-metadata';
import { IType } from './IType';

export class InjectorFactory
{
    /**
     * instance
     * @private
     */
    private static inst: InjectorFactory;

    /**
     * Container for resolved classes
     * @protected
     */
    protected initializesObjectMap: Map<IType<any>, any>;

    /**
     * @constructor
     */
    constructor() {
        this.initializesObjectMap = new Map<IType<any>, any>();
        InjectorFactory.inst = this;
    }

    /**
     * get instance
     */
    static get instance() {
        if (!InjectorFactory.inst) {
            new InjectorFactory();
        }

        return InjectorFactory.inst;
    }

    /**
     * Create new instance for fo class
     * @param targetClass
     * @param args
     */
    public create<T>(targetClass: any, ...args: any[]): T
    {
        const existingInstance = this.initializesObjectMap.get(targetClass)
            || this.initializesObjectMap.get(targetClass['constructor']);
        if (existingInstance) {
            return existingInstance;
        }

        // If class is overwritten, use final one
        const target = targetClass?.prototype?.__OVERWRITE_CLASS__
            || targetClass?.constructor.prototype?.__OVERWRITE_CLASS__
            || targetClass;

        // Get constructor meta
        const tokens = Reflect.getMetadata('design:paramtypes', target) || [];
        const argumentCount = args.length;

        const injections = tokens.map((token: IType<any>, index: number) => {
            const argumentIndex = index - argumentCount;
            if (argumentCount > 0 && argumentIndex >= 0) {
                return args[argumentIndex];
            }

            return this.create<any>(token);
        });

        const newInstance = new target(...injections);

        if (!target.prototype.__IS_REINITIALIZEZIBLE__) {
            this.initializesObjectMap.set(target, newInstance);
        }

        return newInstance;
    }
}