export interface Source<A> {
    [key: string]: A;
}
export declare function get<A>(path: string, o: Source<A>): any;
export declare function set<A>(path: string, value: A, obj: Source<A>): any;
export default function <A>(k: string, v: A | Source<A>, o?: Source<A>): any;
