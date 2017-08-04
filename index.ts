function boundary_to_dot(value: string) {
    return value.split('][').join('.').split('[').join('.');
}

function strip_braces(value: string) {
    return value.split('[').join('.').split(']').join('');
}

function escape_dots(value: string) {
    let val = value.split('\'');
    return (val.length < 3) ? val.join('\'') : val.map(function(seg) {
        if (seg.length < 3) return seg;
        if ((seg[0] === '.') || (seg[seg.length - 1] === '.')) return seg;
        return seg.split('.').join('&&');
    }).join('');
}

function unescape_dots(value: string) {
    return value.split('&&').join('.');
}

function partify(value: string) {
    if (!value) return;
    return escape_dots(strip_braces(boundary_to_dot('' + value))).split('.');
}

export interface Cloneable<B> {

    __CLONE__: (b: B) => B;

}

function canClone<B>(o: any): o is Cloneable<B> {
    return (typeof o.__CLONE__ === 'function');
}

function clone<B>(o: B): B {

    if ((typeof o !== 'object') || (o === null))
        return o;

    if (Array.isArray(o))
        return <any>o.map(clone);

    return (canClone(o)) ?
        o.__CLONE__(clone) : (o.constructor !== Object) ? o :
            Object.keys(o).reduce(function(pre: any, k: string) {

                pre[k] = (typeof (<any>o)[k] === 'object') ?
                    clone((<any>o)[k]) : (<any>o)[k];
                return pre;

            }, {});

}

export function get<A, B>(path: string, o: B): A {

    var parts = partify(path);
    var first;

    if (typeof o === 'object') {

        if (parts.length === 1) return (<any>o)[unescape_dots(parts[0])];
        if (parts.length === 0) return;

        first = (<any>o)[parts.shift()];

        return ((typeof o === 'object') && (o !== null)) ?

            parts.reduce(function(target, prop) {
                if (target == null) return target;
                return target[unescape_dots(prop)];
            }, first) : null;

    } else {

        throw new TypeError('get(): expects an object got ' + typeof o);

    }
};

export function set<A, B>(path: string, value: A, obj: B): B {

    var parts = partify(path);

    if ((typeof obj !== 'object') || (obj == null)) {
        return clone(obj);
    } else {

        return _set(obj, value, parts);

    }

};

function _set<A, B>(obj: B, value: A, parts: string[]): B {

    var o;
    var k;

    if (parts.length === 0) return <B><any>value;

    o = ((typeof obj !== 'object') || (obj === null)) ? {} : clone(obj);
    k = unescape_dots(parts[0]);
    (<any>o)[k] = _set((<any>o)[k], value, parts.slice(1));

    return <any>o;

}

export default function <A, B>(k: string, v: A | B, o?: A) {

    if (o == null)
        return get(k, <A>v);
    else
        return set(k, <B><any>v, o);

};
