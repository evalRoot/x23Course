import { makeAutoObservable } from "mobx";

export default class UserStore {
    isAuth = false
    user = {}

    constructor() {
        makeAutoObservable(this)
    }

    setIsAuth(bool) {
        this.isAuth = bool
    }
    setUser(user) {
        this.user = user
    }

    get getAuth() {
        return this.isAuth
    }
    get getUser() {
        return this.user
    }
}
