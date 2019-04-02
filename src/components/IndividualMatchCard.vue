<template>
  <div>
    <v-card dark hover height="100" @click="details">
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
          <div class="high_text">{{match.stage}}</div>
        </v-flex>
      </v-layout>
    </v-card>
  </div>
</template>

<script lang="ts">
import BigNumber from "bignumber.js";
import { Match, MatchView, MatchStatus, MatchSeedIds } from "@/models/Match";
import DB, { Account, ZeroAddress } from "@/database";
import { Vue, Component, Prop } from "vue-property-decorator";
import { contractAddr, MethodABI, unit, zero } from "@/config";
import { GlobalEvent, Events } from "@/GlobalEvent";

@Component
export default class IndividualMatchCard extends Vue {
  @Prop() private matchView!: MatchView;
  match: Match = new Match(
    0,
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

  private async created() {
    await this.reload();
    GlobalEvent.$on(Events.TickerStart, async () => {
      console.log("PersonalMatchCard on TickerStart");
      await this.reload();
    });
  }

  private async reload() {
    this.match = await this.getMatch();
    await this.updateYourBet();
  }

  private destroyed() {
    console.log("PersonalMatchCard destroyed");
    GlobalEvent.$off(Events.TickerStart);
  }

  private async getMatch() {
    const getmatchMethod = connex.thor
      .account(contractAddr)
      .method(MethodABI.getMatch);
    const output = await getmatchMethod.call(this.matchView.id);
    const decoded = output.decoded as any;
    return new Match(
      parseInt(decoded.id),
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

  private async updateYourBet() {
    let bet = await this.getBet(this.match.id, MatchSeedIds.one);
    this.betOne = bet.dividedBy(unit).toString(10);
    bet = await this.getBet(this.match.id, MatchSeedIds.two);
    this.betTwo = bet.dividedBy(unit).toString(10);
  }

  private async getBet(matchId: number, seedId: number) {
    const acc = await DB.getMainAccount();
    if (acc.address === ZeroAddress) {
      return zero;
    }
    const getBetMethod = connex.thor
      .account(contractAddr)
      .method(MethodABI.getBet);
    const output = await getBetMethod.caller(acc.address).call(matchId, seedId);
    const decoded = output.decoded as any;
    return new BigNumber(decoded["0"]);
  }

  private details() {
    this.$router.push({
      name: "individualMatchDetails",
      params: { matchId: this.match.id.toString() }
    });
  }
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
