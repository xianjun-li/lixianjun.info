import { observable, makeObservable, IObservableFactory } from "mobx"

class Store {

    @observable languages : Array<String> = [];
    @observable changeLanguage: Function = () => {};
}

export const store : Store = new Store()