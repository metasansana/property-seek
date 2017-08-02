export declare interface Source<A> {

    [key: string]: A

}

export declare interface get {

    <A>(path: string, o: Source<A>): A;

}

export declare interface set {

    <A>(path: string, value: A, o: Source<A>): object;

}
