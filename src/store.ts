import Vuex from 'vuex';
import DB, { Account, ZeroAddress } from './database';
interface AccountStore {
    mainAccount: Account;
    accounts: Account[];
}

export default class Store extends Vuex.Store<AccountStore> {
    constructor() {
        super({
            mutations: {
                ['put'](state: AccountStore, payload: Account[]) {
                    state.accounts = payload;
                },
                ['setMain'](state: AccountStore, payload: Account) {
                    state.mainAccount = payload;
                },
            },
            state: {
                accounts: [],
                mainAccount: { address: '' },
            },
        });
        this.update();
    }
    public async update() {
        this.state.accounts = await DB.accounts.toArray();
        const acc = await DB.getMainAccount();
        if (acc.address !== ZeroAddress) {
            this.state.mainAccount = acc;
        }
    }

}
