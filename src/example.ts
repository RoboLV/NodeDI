import {
    Injectable,
    InjectorFactory,
    Overwrite,
    Reinitializezible,
    Plugin
} from "./app";

@Injectable()
class A {}

@Injectable()
class B {
    constructor(a: A) {
    }
}

@Injectable()
class C {
    constructor(b: B, num: number) {
        console.log(b, num);
    }
}

@Overwrite(C)
@Reinitializezible()
@Injectable()
class D extends C {
    constructor(b: B, num: number) {
        super(b, num);
        console.log('D', this);
    }
}

@Injectable()
class P1 {
    protected aa = 100;

    a(i: number) {
        console.log(i + this.aa);
    }
}

@Injectable()
class P2 {
    protected dd = 11;

    @Plugin(P1, 'variable_test')
    aa(source: any, value: any) {
        return value > 100 ? 1000 : 10;
    }

    @Plugin(P1, 'method_test')
    a(source: any, callback: (i: number) => any, i: number) {
        i++;
        return callback(i + this.dd);
    }
}

const injector = InjectorFactory.instance;
const inst = injector.create<C>(C, 12);

const p = injector.create<P1>(P1);
const p2 = injector.create<P2>(P2);
p.a(1);