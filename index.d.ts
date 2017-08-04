export interface Cloneable<B> {
    __CLONE__: (b: B) => B;
}
export declare function get<A, B>(path: string, o: B): A;
export declare function set<A, B>(path: string, value: A, obj: B): B;
export default function <A, B>(k: string, v: A | B, o?: A): {};
