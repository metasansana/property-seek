function boundary_to_dot(value) {
    return value.split('][').join('.').split('[').join('.');
}

function strip_braces(value) {
    return value.split('[').join('.').split(']').join('');
}

function escape_dots(value) {
    value = value.split('\'');
    return (value.length < 3) ? value.join('\'') : value.map(function(seg) {
        if (seg.length < 3) return seg;
        if ((seg[0] === '.') || (seg[seg.length - 1] === '.')) return seg;
        return seg.split('.').join('&&');
    }).join('');
}

function unescape_dots(value) {
    return value.split('&&').join('.');
}

function partify(value) {
    if (!value) return;
    return escape_dots(strip_braces(boundary_to_dot('' + value))).split('.');
}

function clone(o) {

    if ((typeof o !== 'object') || (o === null))
        return o;

    if (Array.isArray(o))
        return o.map(clone);

    return (typeof o.__CLONE__ === 'function') ?
        o.__CLONE__(clone) : (o.constructor !== Object) ? o :
            Object.keys(o).reduce(function(pre, k) {

                pre[k] = (typeof o[k] === 'object') ? clone(o[k]) : o[k];
                return pre;

            }, {});

}

export interface Source<A> {

    [key: string]: A

};

export function get<A>(path: string, o: Source<A>) {

    var parts = partify(path);
    var first;

    if (typeof o !== 'object')
        throw new TypeError('get(): expects an object got ' + typeof o);

    if (parts.length === 1) return o[unescape_dots(parts[0])];
    if (parts.length === 0) return;

    first = o[parts.shift()];

    return ((typeof o === 'object') && (o !== null)) ?

        parts.reduce(function(target, prop) {
            if (target == null) return target;
            return target[unescape_dots(prop)];
        }, first) : null;
};

export function set<A>(path: string, value: A, obj: Source<A>) {

    var parts = partify(path);

    if ((typeof obj !== 'object') || (obj == null)) {
        return obj
    } else {

        return _set(obj, value, parts);

    }

};

function _set(obj, value, parts) {

    var o;
    var k;

    if (parts.length === 0) return value;

    o = ((typeof obj !== 'object') || (obj === null)) ? {} : clone(obj);
    k = unescape_dots(parts[0]);
    o[k] = _set(o[k], value, parts.slice(1));

    return o;

}

export default function <A>(k: string, v: A | Source<A>, o?: Source<A>) {

    if (o == null)
        return get(k, <Source<A>>v);
    else
        return set(k, v, o);

};
