<template>
  <div>
    <v-card dark height="100">
      <v-layout row>
        <v-flex sm2>
          <div class="high_text">{{match.name}}</div>
        </v-flex>
        <v-flex sm2>
          <v-layout column>
            <v-flex xs12>
              <v-layout row align-center>
                <v-flex xs6 sm6>
                  <v-layout row reverse>
                    <v-flex xs4 sm4>
                      <v-img
                        style="height: 20px;width:20px;font-size: 15px;"
                        :src="match.view.oneLogo"
                      ></v-img>
                    </v-flex>
                  </v-layout>
                </v-flex>
                <v-flex xs6 sm6>
                  <div
                    style="height: 50px;font-size: 15px;display: flex;align-items: center;justify-content: left;"
                  >{{match.oneSeedName}}</div>
                </v-flex>
              </v-layout>
            </v-flex>
            <v-flex xs12>
              <v-layout row align-center>
                <v-flex xs6 sm6>
                  <v-layout row reverse>
                    <v-flex xs4 sm4>
                      <v-img
                        style="height: 20px;width:20px;font-size: 15px;"
                        :src="match.view.twoLogo"
                      ></v-img>
                    </v-flex>
                  </v-layout>
                </v-flex>
                <v-flex xs6 sm6>
                  <div
                    style="height: 50px;font-size: 15px;display: flex;align-items: center;justify-content: left;"
                  >{{match.twoSeedName}}</div>
                </v-flex>
              </v-layout>
            </v-flex>
          </v-layout>
        </v-flex>
        <v-flex sm1>
          <v-layout column>
            <v-flex xs12>
              <div class="low_text">{{match.oneScore}}</div>
            </v-flex>
            <v-flex xs12>
              <div class="low_text">{{match.twoScore}}</div>
            </v-flex>
          </v-layout>
        </v-flex>
        <v-flex sm2>
          <v-layout column>
            <v-flex xs12>
              <div class="low_text">{{match.oneSeedBonusPool}}</div>
            </v-flex>
            <v-flex xs12>
              <div class="low_text">{{match.twoSeedBonusPool}}</div>
            </v-flex>
          </v-layout>
        </v-flex>
        <v-flex sm2>
          <v-layout column>
            <v-flex xs12>
              <div class="low_text">{{betOne}}</div>
            </v-flex>
            <v-flex xs12>
              <div class="low_text">{{betTwo}}</div>
            </v-flex>
          </v-layout>
        </v-flex>
        <v-flex sm2>
          <div class="high_text">{{match.dateTime}}</div>
        </v-flex>
        <v-flex sm1 align-self-center>
          <div class="content_center">
            <v-card
              dark
              hover
              tile
              flat
              style="width:50px; height: 50px;text-align: center;display: flex;align-items: center;justify-content: center;font-size: 10px;font-weight: bold;color:white; border-radius: 10px;"
              @click="details"
            >Details</v-card>
          </div>
        </v-flex>
      </v-layout>
    </v-card>
  </div>
</template>

<script lang="ts">
import { Match, MatchView, MatchStatus, MatchSeedIds } from "../models/Match";
import DB, { Account, ZeroAddress } from "../database";
import { Vue, Component, Prop } from "vue-property-decorator";
import BigNumber from "bignumber.js";
import { contractAddr, MethodABI, unit, zero } from "../config";
import { GlobalEvent, Events } from "../GlobalEvent";

@Component
export default class IndividualMatchCard extends Vue {
  @Prop() private matchView!: MatchView;
  match: Match = new Match(
    this.matchView.id,
    "",
    0,
    0,
    "-",
    "-",
    0,
    0,
    new BigNumber(0),
    new BigNumber(0)
  );

  betOne: string = "0";
  betTwo: string = "0";

  async created() {
    await this.reload();
    GlobalEvent.$on(Events.TickerStart, async () => {
      console.log("PersonalMatchCard on TickerStart");
      await this.reload();
    });
  }

  async reload() {
    this.match = await this.getMatch(this.match.id);
    await this.updateYourBet();
  }

  destroyed() {
    console.log("PersonalMatchCard destroyed");
    GlobalEvent.$off(Events.TickerStart);
  }

  async getMatch(id: BigNumber) {
    const getmatchMethod = connex.thor
      .account(contractAddr)
      .method(MethodABI.getMatch);
    let output = await getmatchMethod.call(id);
    let decoded = output.decoded as any;
    return new Match(
      new BigNumber(decoded.id),
      decoded.gameName,
      parseFloat(decoded.startTime),
      parseInt(decoded.stage),
      decoded.leftName,
      decoded.rightName,
      parseInt(decoded.leftScore),
      parseInt(decoded.rightScore),
      new BigNumber(decoded.leftBet),
      new BigNumber(decoded.rightBet),
      this.matchView
    );
  }

  async updateYourBet() {
    let bet = await this.getBet(this.match.id, MatchSeedIds.one);
    this.betOne = bet.dividedBy(unit).toString(10);
    bet = await this.getBet(this.match.id, MatchSeedIds.two);
    this.betTwo = bet.dividedBy(unit).toString(10);
  }

  async getBet(matchId: BigNumber, seedId: number) {
    let acc = await DB.getMainAccount();
    if (acc.address == ZeroAddress) {
      return zero;
    }
    const getBetMethod = connex.thor
      .account(contractAddr)
      .method(MethodABI.getBet);
    let output = await getBetMethod.caller(acc.address).call(matchId, seedId);
    let decoded = output.decoded as any;
    return new BigNumber(decoded["0"]);
  }

  details() {
    this.$router.push({
      name: "individualMatchDetails",
      params: { matchId: this.match.id.toString() }
    });
  }

  // async withdraw() {
  //   try {
  //     let acc = await DB.getMainAccount();
  //     let ob = await this.getBet(this.matchId, 1);
  //     let isOneBetGTZero = new BigNumber(ob).isGreaterThan(zero);
  //     let tb = await this.getBet(this.matchId, 2);
  //     let isTwoBetGTZero = new BigNumber(tb).isGreaterThan(zero);
  //     if (this.match.status == MatchStatus.finished) {
  //       //withdraw bonus
  //       if (
  //         (this.match.oneScore > this.match.twoScore && isOneBetGTZero) ||
  //         (this.match.oneScore < this.match.twoScore && isTwoBetGTZero) ||
  //         this.match.oneScore == this.match.twoScore
  //       ) {
  //         const withdrawTx = connex.vendor.sign("tx").signer(acc.address);
  //         const clause = connex.thor
  //           .account(contractAddr)
  //           .method(ContractABI.withdraw)
  //           .asClause(this.match.id);
  //         let result = await withdrawTx.request([
  //           { comment: "withdraw bonus", ...clause }
  //         ]);
  //         let a = {
  //           address: result.signer,
  //           createdTime: Date.now(),
  //           level: AccountLevel.Main
  //         };
  //         // await this.commitAccount(a);
  //         console.log("withdrawTx result", result);
  //         // this.dialog = false;
  //         alert("withdraw bonus successfully!");
  //       } else {
  //         alert("your bet is failed!");
  //       }
  //     } else if (
  //       this.match.status == MatchStatus.active ||
  //       this.match.status == MatchStatus.cancelled
  //     ) {
  //       const cancelBetTx = connex.vendor.sign("tx").signer(acc.address);
  //       const cancelBetMethod = connex.thor
  //         .account(contractAddr)
  //         .method(ContractABI.cancelBet);
  //       let clauses = [];
  //       if (isOneBetGTZero) {
  //         let oneClause = cancelBetMethod.asClause(this.match.id, 1);
  //         clauses.push({
  //           comment: "cancel bet for " + this.match.oneSeedName,
  //           ...oneClause
  //         });
  //       }
  //       if (isTwoBetGTZero) {
  //         let twoClause = cancelBetMethod.asClause(this.match.id, 2);
  //         clauses.push({
  //           comment: "cancel bet for " + this.match.twoSeedName,
  //           ...twoClause
  //         });
  //       }
  //       let result = await cancelBetTx.request(clauses);
  //       let a = {
  //         address: result.signer,
  //         createdTime: Date.now(),
  //         level: AccountLevel.Main
  //       };
  //       // await this.commitAccount(a);
  //       console.log("cancelBetTx result", result);
  //       // this.dialog = false;
  //       alert("cancel bet successfully!");
  //     } else if (this.match.status == MatchStatus.locked) {
  //       alert("match is not locked now!");
  //     }
  //     // this.dialog = false;
  //   } catch (err) {
  //     console.error(err);
  //   }
  // }
}
</script>
<style>
.high_text {
  height: 100px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 15px;
}
.low_text {
  height: 50px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 15px;
}
</style>
