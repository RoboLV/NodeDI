import 'jest';

import {
    Injectable,
    InjectorFactory,
    Overwrite,
    Reinitializezible,
    Plugin
} from "../app";

describe("InjectorFactory should create objects from classes and follow the rules of decorators", () => {
    @Injectable()
    class A {
        public val = 13;
    };

    @Injectable()
    class B {
        public a: A;

        constructor(a: A) {
            this.a = a;
        }

        getVal(): number
        {
            return this.a.val;
        }
    };

    @Injectable()
    class C {
        public b: B;
        public param: number;

        constructor(b: B, param: number) {
            this.b = b;
            this.param = param;
        }
    };

    @Reinitializezible()
    @Overwrite(C)
    @Injectable()
    class D extends C {
        public c = 11;
    };

    test("Initialize Injector factory",() => {
        const factory = InjectorFactory.instance;

        expect(factory).toBeDefined();
        expect(factory).toBeInstanceOf(InjectorFactory);
    });

    test("Decorators: Injectable", () => {
        expect(A).toBeDefined();
        expect((B?.prototype as any)?.__IS_INJECTABLE__).toBe(true);
    });

    test("Decorators: Overwrite", () => {
        expect(C).toBeDefined();
        expect(D).toBeDefined();

        expect((C?.prototype as any)?.__OVERWRITE_CLASS__).toBe(D);
        expect((A?.prototype as any)?.__OVERWRITE_CLASS__).toBeUndefined();
    });

    test("Decorators: Reinitializezible", () => {
        expect(D).toBeDefined();
        expect(A).toBeDefined();
        expect((D?.prototype as any)?.__IS_REINITIALIZEZIBLE__).toBe(true);
        expect((A?.prototype as any)?.__IS_REINITIALIZEZIBLE__).toBeUndefined();
    });

    test("Initialize Objects using factory", () => {
        const factory = InjectorFactory.instance;

        const a = factory.create<A>(A);
        const b = factory.create<B>(B);

        expect(a).toBeDefined();
        expect(a).toBeInstanceOf(A);
        expect(a?.val).toBeDefined();
        expect(a?.val).toBe(13);

        expect(b).toBeDefined();
        expect(b).toBeInstanceOf(B);
        expect(b?.a).toBeDefined();
        expect(b?.a).toBeInstanceOf(A);
        expect(b?.a).toBe(a); // Singleton by default, uses reference on first call

        expect(b?.getVal()).toBe(13);
    });

    test("Initialize with params", () => {
        const factory = InjectorFactory.instance;
        const c = factory.create<C>(C, 12);

        expect(c).toBeDefined();
        expect(c?.param).toBe(12);
        expect(c?.b).toBeDefined();
        expect(c?.b).toBeInstanceOf(B);
    });

    test("Overwrite by another class", () => {
        const factory = InjectorFactory.instance;
        const c = factory.create<C>(C, 12);

        expect(c).toBeDefined();
        expect(c).toBeInstanceOf(D);
    });

    test("Initialize multiple different objects", () => {
        const factory = InjectorFactory.instance;

        const c1 = factory.create<C>(C, 14);
        const c2 = factory.create<D>(C, 15);
        const d1 = factory.create<C>(D, 16);
        const d2 = factory.create<D>(D, 17);

        expect(c1).toBeDefined();
        expect(c2).toBeDefined();
        expect(d1).toBeDefined();
        expect(d2).toBeDefined();

        expect(c1).toBeInstanceOf(C);
        expect(c1).toBeInstanceOf(D);

        expect(d1).toBeInstanceOf(C);
        expect(d1).toBeInstanceOf(D);

        expect(c2?.c).toBe(11);

        expect(c1).not.toBe(d1);

        expect(c1.param).toBe(14);
        expect(c2.param).toBe(15);
        expect(d1.param).toBe(16);
        expect(d2.param).toBe(17);
    })
});