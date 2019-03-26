import { BigNumber } from 'bignumber.js'
import { unit } from '../config';
import { MatchSeedIds } from './Match';
class BetRecord {
    public gameId: BigNumber;
    public address: string;
    public value: BigNumber;
    public seedId: MatchSeedIds;
    public seedName: string;
    public time: number;

    constructor(gameId: BigNumber, address: string, seedId: MatchSeedIds, seedName: string, value: BigNumber, time: number) {
        this.gameId = gameId
        this.address = address.toLowerCase()
        this.seedId = seedId
        this.seedName = seedName
        this.value = value
        this.time = time * 1000
    }

    get bet() {
        return this.value.dividedBy(unit).toString(10)
    }

    get fullTime() {
        let date = new Date(this.time)
        let year = date.getFullYear()
        let month = date.getMonth() + 1
        let trueMonth = month < 10 ? "0" + month.toString() : month.toString()
        let day = date.getDate()
        let trueDay = day < 10 ? "0" + day.toString() : day.toString()
        let hour = date.getHours()
        let trueHour = hour < 10 ? "0" + hour.toString() : hour.toString()
        let minute = date.getMinutes()
        let trueMinute = minute < 10 ? "0" + minute.toString() : minute.toString()
        let seconds = date.getSeconds()
        let trueSecond = seconds < 10 ? "0" + seconds.toString() : seconds.toString()
        return year + "-" + trueMonth + "-" + trueDay + " " + trueHour + ":" + trueMinute + ":" + trueSecond;
    }
}

export {
    BetRecord
}