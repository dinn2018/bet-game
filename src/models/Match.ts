import { BigNumber } from 'bignumber.js';
import { unit, zero } from '@/config';


interface MatchView {
    id: number;
    oneLogo: string;
    twoLogo: string;

}

class Match {
    public id: number;
    public name: string;
    public status: number;
    public startTime: number;
    public oneSeedName: string;
    public twoSeedName: string;
    public view: MatchView;
    public oneScore: number;
    public twoScore: number;
    public oneSeedBonus: BigNumber;
    public twoSeedBonus: BigNumber;

    // tslint:disable-next-line:max-line-length
    constructor(id: number, name: string, startTime: number, status: number, oneSeedName: string, twoSeedName: string, oneScore: number, twoScore: number, oneSeedBonus: BigNumber, twoSeedBonus: BigNumber, view: MatchView = { id: 0, oneLogo: '', twoLogo: '' }) {
        this.id = id;
        this.name = name;
        this.startTime = startTime * 1000;
        this.status = status;
        this.oneSeedName = oneSeedName;
        this.twoSeedName = twoSeedName;
        this.view = view;
        this.oneScore = oneScore;
        this.twoScore = twoScore;
        this.oneSeedBonus = oneSeedBonus;
        this.twoSeedBonus = twoSeedBonus;
    }
    public seedNameById(seedId: number) {
        let seedName = '';
        if (seedId === MatchSeedIds.one) {
            seedName = this.oneSeedName;
        } else if (seedId === MatchSeedIds.two) {
            seedName = this.twoSeedName;
        }
        return seedName;
    }
    get oneSeedBonusPool() {
        return this.oneSeedBonus.dividedBy(unit).toString(10);
    }

    get twoSeedBonusPool() {
        return this.twoSeedBonus.dividedBy(unit).toString(10);
    }
    get stage() {
        switch (this.status) {
            case MatchStatus.active:
                return 'Waiting';
            case MatchStatus.locked:
                return 'Locked';
            case MatchStatus.cancelled:
                return 'Cancelled';
            case MatchStatus.finished:
                return 'Over';
            default: return '';
        }
    }

    get dateTime() {
        const date = new Date(this.startTime);
        const month = date.getMonth() + 1;
        const trueMonth = month < 10 ? '0' + month.toString() : month.toString();
        const day = date.getDate();
        const trueDay = day < 10 ? '0' + day.toString() : day.toString();
        const hour = date.getHours();
        const trueHour = hour < 10 ? '0' + hour.toString() : hour.toString();
        const minute = date.getMinutes();
        const trueMinute = minute < 10 ? '0' + minute.toString() : minute.toString();
        return trueMonth + '-' + trueDay + ' ' + trueHour + ':' + trueMinute;
    }

    get leftTime() {
        const startDate = new Date(this.startTime).getTime();
        const now = Date.now();
        if (startDate <= now) {
            return this.fullTime;
        }
        const interval = (startDate - now) / 1000;
        // tslint:disable-next-line:radix
        const days = parseInt((interval / (3600 * 24)).toString());
        // tslint:disable-next-line:radix
        const hours = parseInt((interval / 3600 % 24).toString());
        // tslint:disable-next-line:radix
        const minutes = parseInt((interval / 60 % 24).toString());
        if (days > 0) {
            return days.toString() + 'Days ' + hours.toString() + 'Hours ' + minutes.toString() + 'minutes left';
        }
        if (hours > 0) {
            return hours.toString() + 'Hours ' + minutes.toString() + 'minutes left';
        }
        if (minutes > 0) {
            return minutes.toString() + 'minutes left';
        }
    }
    get fullTime() {
        const date = new Date(this.startTime);
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const trueMonth = month < 10 ? '0' + month.toString() : month.toString();
        const day = date.getDate();
        const trueDay = day < 10 ? '0' + day.toString() : day.toString();
        const hour = date.getHours();
        const trueHour = hour < 10 ? '0' + hour.toString() : hour.toString();
        const minute = date.getMinutes();
        const trueMinute = minute < 10 ? '0' + minute.toString() : minute.toString();
        return year + '-' + trueMonth + '-' + trueDay + ' ' + trueHour + ':' + trueMinute;
    }
}
enum MatchStatus {
    active = 1,
    locked = 2,
    cancelled = 3,
    finished = 4,
}
enum MatchSeedIds {
    one = 1,
    two = 2,
}

export {
    MatchView,
    Match,
    MatchStatus,
    MatchSeedIds,
};
