<template>
  <v-card dark height="260" @click="selected">
    <v-layout column>
      <!-- <v-flex sm12>
        <v-icon
          style="height: 10px;display: flex;align-items: left;justify-content: left; font-size: 10px;"
        >fas fa-star</v-icon>
      </v-flex>-->
      <v-flex sm12>
        <div
          style="height:60px; text-align: center;display: flex;align-items: center;justify-content: center; font-size: 25px; font-weight:bold;"
        >{{match.name}}</div>
      </v-flex>
      <v-flex sm12>
        <v-layout row>
          <v-flex xs5 sm5>
            <v-layout column>
              <v-flex xs12 sm12 align-self-center>
                <v-img :width="60" :height="60" :src="match.view.oneLogo"></v-img>
              </v-flex>
              <v-flex xs12 sm12 align-self-center>
                <div style="height:40px;font-size: 20px;">{{match.oneSeedName}}</div>
              </v-flex>
            </v-layout>
          </v-flex>
          <v-flex sm2 align-self-center>
            <div
              v-if="match.status != 1"
              style="text-align:center; font-size: 20px; font-weight:bold;"
            >{{match.oneScore}} : {{match.twoScore}}</div>
            <div v-else style="text-align:center; font-size: 20px; font-weight:bold;">VS</div>
          </v-flex>
          <v-flex sm5>
            <v-layout column>
              <v-flex xs12 sm12 align-self-center>
                <v-img :width="60" :height="60" :src="match.view.twoLogo"></v-img>
              </v-flex>
              <v-flex xs12 sm12 align-self-center>
                <div style="height:40px;font-size: 20px;">{{match.twoSeedName}}</div>
              </v-flex>
            </v-layout>
          </v-flex>
        </v-layout>
      </v-flex>
      <v-flex sm12>
        <v-layout row fill-height>
          <v-flex sm5 align-self-center>
            <div
              style="height:60px; text-align: center;font-size: 25px; font-weight:bold;display: flex;align-items:center;justify-content: center;"
            >{{match.oneSeedBonusPool}}</div>
          </v-flex>
          <v-flex sm2 align-self-center>
            <v-layout row>
              <v-flex xs1 sm1 align-self-center>
                <v-icon
                  v-show="match.status == 1 || match.status == 2"
                  style="display: flex;align-items:center;justify-content: center;font-size: 10px;"
                >far fa-clock</v-icon>
                <v-icon
                  v-show="match.status == 3"
                  style="display: flex;align-items:center;justify-content: center;font-size: 10px;"
                >fas fa-ban</v-icon>
                <v-icon
                  v-show="match.status == 4"
                  style="display: flex;align-items:center;justify-content: center;font-size: 10px;"
                >fas fa-power-off</v-icon>
              </v-flex>
              <v-flex xs11 sm11 align-self-center>
                <div
                  style="height:50px; text-align: center; display: flex;align-items:center;justify-content: center;"
                >{{match.dateTime}}</div>
              </v-flex>
            </v-layout>
          </v-flex>
          <v-flex sm5 align-self-center>
            <div
              style="height:60px;display: flex;align-items:center;justify-content: center; text-align: center; font-size: 20px; font-weight:bold;"
            >{{match.twoSeedBonusPool}}</div>
          </v-flex>
        </v-layout>
      </v-flex>
    </v-layout>
  </v-card>
</template>

<script lang="ts">
import { Match, MatchView, MatchStatus } from "../models/Match";
import DB, { Account, ZeroAddress } from "../database";
import { Vue, Component, Prop } from "vue-property-decorator";
import BigNumber from "bignumber.js";
import { contractAddr, MethodABI, unit, zero } from "../config";
import { GlobalEvent, Events } from "../GlobalEvent";

@Component
export default class MatchCard extends Vue {
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

  async created() {
    this.match = await this.getMatch();
    console.log("MatchCard created");
    GlobalEvent.$on(Events.TickerStart, async () => {
      console.log("MatchCard on TickerStart");
      this.match = await this.getMatch();
    });
  }

  destroyed() {
    console.log("MatchCard destroyed");
    GlobalEvent.$off(Events.TickerStart);
  }

  async getMatch() {
    const getmatchMethod = connex.thor
      .account(contractAddr)
      .method(MethodABI.getMatch);
    let output = await getmatchMethod.call(this.matchView.id);
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
      new MatchView(
        new BigNumber(decoded.id),
        this.matchView.oneLogo,
        this.matchView.twoLogo
      )
    );
  }

  selected() {
    this.$router.push({
      name: "matchDetail",
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