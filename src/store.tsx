// import { makeAutoObservable } from 'mobx';
import React from 'react';
import { createContext } from 'react';

class RootSotre {
    counter: number;

    constructor() {
        this.counter = 0;
        // makeAutoObservable(this, {}, {autoBind: true});
    }

    get countx() {
        return this.counter;
    }

    increment() {
        this.counter++;
    }
}

const rootStore = new RootSotre();
const RootStoreContext = createContext(rootStore);

const RootStoreProvider = ({children}: { children: React.ReactElement }) => {
    return (
        <RootStoreContext.Provider value={rootStore}>
            {children}
        </RootStoreContext.Provider>
    )
}
export default RootStoreProvider;

export const useRootStore = () => {
    return React.useContext(RootStoreContext);
}

