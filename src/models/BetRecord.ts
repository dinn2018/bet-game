import { BigNumber } from 'bignumber.js';
import { unit } from '@/config';
import { MatchSeedIds } from '@/models/Match';
class BetRecord {
    public gameId: BigNumber;
    public address: string;
    public value: BigNumber;
    public seedId: MatchSeedIds;
    public seedName: string;
    public time: number;

    // tslint:disable-next-line:max-line-length
    constructor(gameId: BigNumber, address: string, seedId: MatchSeedIds, seedName: string, value: BigNumber, time: number) {
        this.gameId = gameId;
        this.address = address.toLowerCase();
        this.seedId = seedId;
        this.seedName = seedName;
        this.value = value;
        this.time = time * 1000;
    }

    get bet() {
        return this.value.dividedBy(unit).toString(10);
    }

    get fullTime() {
        const date = new Date(this.time);
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const trueMonth = month < 10 ? '0' + month.toString() : month.toString();
        const day = date.getDate();
        const trueDay = day < 10 ? '0' + day.toString() : day.toString();
        const hour = date.getHours();
        const trueHour = hour < 10 ? '0' + hour.toString() : hour.toString();
        const minute = date.getMinutes();
        const trueMinute = minute < 10 ? '0' + minute.toString() : minute.toString();
        const seconds = date.getSeconds();
        const trueSecond = seconds < 10 ? '0' + seconds.toString() : seconds.toString();
        return year + '-' + trueMonth + '-' + trueDay + ' ' + trueHour + ':' + trueMinute + ':' + trueSecond;
    }
}

export {
    BetRecord,
};
