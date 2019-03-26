import { BigNumber } from 'bignumber.js'
import { unit, zero } from '../config';


class MatchView {
    public id: BigNumber;
    public oneLogo: string;
    public twoLogo: string;

    constructor(id: BigNumber, oneLogo: string, twoLogo: string) {
        this.id = id
        this.oneLogo = oneLogo
        this.twoLogo = twoLogo
    }
}

class Match {
    public id: BigNumber;
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

    constructor(id: BigNumber, name: string, startTime: number, status: number, oneSeedName: string, twoSeedName: string, oneScore: number, twoScore: number, oneSeedBonus: BigNumber, twoSeedBonus: BigNumber, view: MatchView = new MatchView(new BigNumber(1), "", "")) {
        this.id = id
        this.name = name
        this.startTime = startTime
        this.status = status
        this.oneSeedName = oneSeedName
        this.twoSeedName = twoSeedName
        this.view = view
        this.oneScore = oneScore
        this.twoScore = twoScore
        this.oneSeedBonus = oneSeedBonus
        this.twoSeedBonus = twoSeedBonus
    }
    seedNameById(seedId: number) {
        let seedName = "";
        if (seedId == MatchSeedIds.one) {
            seedName = this.oneSeedName;
        } else if (seedId == MatchSeedIds.two) {
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
                return "waiting"
            case MatchStatus.locked:
                return "locked"
            case MatchStatus.cancelled:
                return "cancelled"
            case MatchStatus.finished:
                return "over"
            default: return ""
        }
    }

    get dateTime() {
        let date = new Date(this.startTime);
        let month = date.getMonth() + 1;
        let trueMonth = month < 10 ? "0" + month.toString() : month.toString()
        let day = date.getDate()
        let trueDay = day < 10 ? "0" + day.toString() : day.toString()
        let hour = date.getHours().toString();
        let minute = date.getMinutes().toString();
        return trueMonth + "-" + trueDay + " " + hour + ":" + minute;
    }
    get leftTime() {
        let startDate = new Date(this.startTime).getTime();
        let now = Date.now();
        if (startDate <= now) {
            return this.fullTime
        }
        let interval = (startDate - now) / 1000
        let days = parseInt((interval / (3600 * 24)).toString())
        let hours = parseInt((interval / 3600 % 24).toString())
        let minutes = parseInt((interval / 60 % 24).toString())
        if (days > 0) {
            return days.toString() + "Days " + hours.toString() + "Hours " + minutes.toString() + "minutes left"
        }
        if (hours > 0) {
            return hours.toString() + "Hours " + minutes.toString() + "minutes left"
        }
        if (minutes > 0) {
            return minutes.toString() + "minutes left"
        }
    }
    get fullTime() {
        let date = new Date(this.startTime);
        let year = date.getFullYear();
        let month = date.getMonth() + 1;
        let trueMonth = month < 10 ? "0" + month.toString() : month.toString()
        let day = date.getDate()
        let trueDay = day < 10 ? "0" + day.toString() : day.toString()
        let hour = date.getHours()
        let trueHour = hour < 10 ? "0" + hour.toString() : hour.toString()
        let minute = date.getMinutes()
        let trueMinute = minute < 10 ? "0" + minute.toString() : minute.toString()
        return year + "-" + trueMonth + "-" + trueDay + " " + trueHour + ":" + trueMinute;
    }
}
enum MatchStatus {
    active = 1,
    locked = 2,
    cancelled = 3,
    finished = 4
}
enum MatchSeedIds {
    one = 1,
    two = 2
}
export {
    MatchView,
    Match,
    MatchStatus,
    MatchSeedIds
}