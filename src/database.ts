import Dexie from 'dexie'

export enum AccountLevel {
  Main = 0,
  Normal = 1
}

export namespace Entities {
  export interface Account {
    id?: number
    address: string
    createdTime?: number
    level?: number
  }
}
class Database extends Dexie {
  public readonly accounts!: Dexie.Table<Entities.Account, number>
  constructor() {
    super('LegendaryGambling')
    this.version(2).stores({
      accounts: '++id, &address, createdTime, level',
    })
    this.open().catch((err) => {
      // tslint:disable-next-line:no-console
      console.error("open db failed", err)
    })
  }

  public async setMainAccount(acc: Entities.Account) {
    let accs = await this.accounts.toArray()
    for (let a of accs) {
      if (a.level != AccountLevel.Normal) {
        await this.accounts.update(a.id!, { "level": AccountLevel.Normal })
      }
    }
    accs = await this.accounts.where("address").equals(acc.address).toArray()
    if (accs.length == 0) {
      acc.level = AccountLevel.Main
      await this.accounts.put(acc)
    } else {
      await this.accounts.update(accs[0].id!, { "level": AccountLevel.Main })
    }
    return acc
  }

  public async getMainAccount() {
    let accs = await this.accounts.filter((a) => {
      return a.level == AccountLevel.Main
    }).toArray()
    if (accs.length == 0) {
      return { address: ZeroAddress }
    }
    return accs[0]
  }


}
export let ZeroAddress = "0x0000000000000000000000000000000000000000"

const DB = new Database()

export default DB
