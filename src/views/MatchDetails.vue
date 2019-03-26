<template>
  <div>
    <BetDialog
      :showBet="shoudShowBet"
      :betSeedId="selectedSeedId"
      :oneBet="oneSeedBet"
      :twoBet="twoSeedBet"
      :match="match"
      @dismiss_dialog="dismissDialog"
    ></BetDialog>
    <v-layout column>
      <v-flex xs12 sm12>
        <div class="text_center_bold">{{match.name}}</div>
      </v-flex>
      <v-flex xs12 sm12>
        <v-layout row>
          <v-flex xs4 sm4>
            <v-layout column>
              <v-flex xs12 sm12 align-self-center>
                <v-img :width="100" :height="100" :src="match.view.oneLogo"></v-img>
              </v-flex>
              <v-flex xs12 sm12 align-self-center>
                <div class="text_center_bold">{{match.oneSeedName}}</div>
              </v-flex>
            </v-layout>
          </v-flex>
          <v-flex xs4 sm4>
            <div
              class="text_center_bold"
              style="height:170px"
            >{{match.oneScore}} : {{match.twoScore}}</div>
          </v-flex>
          <v-flex xs4 sm4>
            <v-layout column>
              <v-flex xs12 sm12 align-self-center>
                <v-img :width="100" :height="100" :src="match.view.twoLogo"></v-img>
              </v-flex>
              <v-flex xs12 sm12 align-self-center>
                <div class="text_center_bold">{{match.twoSeedName}}</div>
              </v-flex>
            </v-layout>
          </v-flex>
        </v-layout>
      </v-flex>
      <v-flex xs12 sm12>
        <v-layout row>
          <v-flex xs4 sm4>
            <div class="text_center_bold">{{match.oneSeedBonusPool}}</div>
          </v-flex>
          <v-flex xs4 sm4>
            <div class="text_center">Bonus Pool</div>
          </v-flex>
          <v-flex xs4 sm4>
            <div class="text_center_bold">{{match.twoSeedBonusPool}}</div>
          </v-flex>
        </v-layout>
        <v-layout row>
          <v-flex xs4 sm4>
            <div class="text_center">{{oneSeedBet}}</div>
          </v-flex>
          <v-flex xs4 sm4>
            <div class="text_center">Your Bet</div>
          </v-flex>
          <v-flex xs4 sm4>
            <div class="text_center">{{twoSeedBet}}</div>
          </v-flex>
        </v-layout>
      </v-flex>
      <v-flex xs12 sm12>
        <div class="text_center" v-if="match.status == 1">{{match.leftTime}}</div>
        <div class="text_center" v-else-if=" match.status == 2 || match.leftTime ==''">
          <v-icon style="font-size: 10px;">far fa-clock</v-icon>
          {{match.dateTime}}
        </div>
        <div class="text_center" v-else-if="match.status == 3 || match.leftTime ==''">
          <v-icon style="font-size: 10px;">fas fa-ban</v-icon>
          {{match.dateTime}}
        </div>
        <div class="text_center" v-else-if="match.status == 4 || match.leftTime ==''">
          <v-icon style="font-size: 10px;">fas fa-power-off</v-icon>
          {{match.dateTime}}
        </div>
      </v-flex>
      <v-flex xs12 sm12>
        <v-layout row>
          <v-flex xs1 sm1></v-flex>
          <v-flex xs10 sm10>
            <v-card tile flat v-if="match.status == 1 " dark>
              <v-layout row>
                <v-flex xs8 sm8>
                  <div class="text_center_bold">Which team will win?</div>
                </v-flex>
                <v-flex xs2 sm2>
                  <v-btn
                    block
                    @click="betOneSeed"
                    class="text_center_bold"
                    style="height:100%;background-color: coral;margin-top:0px;"
                    hover
                  >{{match.oneSeedName}}</v-btn>
                </v-flex>
                <v-flex xs2 sm2>
                  <v-btn
                    block
                    @click="betTwoSeed"
                    class="text_center_bold"
                    style="height:100%;background-color: burlywood;margin-top:0px;"
                    hover
                  >{{match.twoSeedName}}</v-btn>
                </v-flex>
              </v-layout>
            </v-card>
            <v-card
              dark
              v-else-if="isLoading == false"
              class="text_center_bold"
              style="display: flex;align-items: center;justify-content: center;"
            >This match is {{match.stage}}!</v-card>
          </v-flex>
          <v-flex xs1 sm1></v-flex>
        </v-layout>
        <v-layout row>
          <v-flex xs1 sm1 align-self-center>
            <div
              class="content_center"
              v-show="offset > 0 && ((betRecords.length > 0) ||( isLoading == false && betRecords.length == 0))"
            >
              <v-icon style="font-size:20px" @click="lastpage">fas fa-arrow-left</v-icon>
            </div>
          </v-flex>
          <v-flex align-self-center>
            <v-list v-if="betRecords.length > 0" style="  background-color: chocolate;">
              <BetRecordCard
                v-for="(br,i) in betRecords"
                :key="`${i}-${br.address}`"
                :betRecord="br"
              ></BetRecordCard>
            </v-list>
            <div v-else-if="isLoading == true" class="v-list content_center">
              <v-icon style="font-size:30px">fas fa-spinner</v-icon>
            </div>
            <div v-else class="v-list content_center" style="color: white;">No More Records</div>
          </v-flex>
          <v-flex xs1 sm1 align-self-center>
            <div class="content_center" v-show="betRecords.length == limit">
              <v-icon style="font-size:20px" @click="nextpage">fas fa-arrow-right</v-icon>
            </div>
          </v-flex>
        </v-layout>
      </v-flex>
    </v-layout>
  </div>
</template>
<script lang="ts">
import BigNumber from "bignumber.js";
import { Vue, Component, Prop } from "vue-property-decorator";
import { Match, MatchView, MatchStatus, MatchSeedIds } from "@/models/Match";
import { BetRecord } from "@/models/BetRecord";
import DB, { AccountLevel, ZeroAddress } from "@/database";
import BetDialog from "@/components/BetDialog.vue";
import BetRecordCard from "@/components/BetRecordCard.vue";
import { GlobalEvent, Events } from "@/GlobalEvent";
import { abi } from "thor-devkit";
import {
  contractAddr,
  MethodABI,
  unit,
  zero,
  MethodTopics,
  EventABI,
  HttpHost
} from "@/config";

@Component({
  components: { BetDialog, BetRecordCard }
})
export default class MatchDetails extends Vue {
  @Prop() matchId!: string;
  offset = 0;
  limit = 10;
  isLoading = true;
  betRecords: Array<BetRecord> = [];
  shoudShowBet: boolean = false;
  selectedSeedId: number = 0;
  oneSeedBet: string = "0";
  twoSeedBet: string = "0";

  match: Match = new Match(
    new BigNumber(this.matchId),
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

  private betOneSeed() {
    this.shoudShowBet = true;
    this.selectedSeedId = MatchSeedIds.one;
  }

  private dismissDialog(val: boolean) {
    this.shoudShowBet = val;
  }

  private betTwoSeed() {
    this.shoudShowBet = true;
    this.selectedSeedId = MatchSeedIds.two;
  }

  private async created() {
    console.log("MatchDetails created");
    await this.reload();
    await this.loadBetRecords();
    GlobalEvent.$on(Events.TickerStart, async () => {
      console.log("MatchDetails on TickerStart");
      await this.reload();
      if (this.match.status == MatchStatus.active && this.offset == 0) {
        await this.reloadBetRecords();
      }
    });
    GlobalEvent.$on(Events.AccountChanged, async () => {
      console.log("MatchDetails on AccountChanged");
      await this.updateYourBet();
    });
  }

  private async reloadBetRecords() {
    this.betRecords = await this.getBetRecords();
  }

  private async loadBetRecords() {
    this.betRecords = [];
    this.isLoading = true;
    this.betRecords = await this.getBetRecords();
    this.isLoading = false;
  }

  private async getBetRecords() {
    const matchIdTopic =
      "0x" + new BigNumber(this.matchId).toString(16).padStart(64, "0");
    const events = await connex.thor
      .filter("event")
      .criteria([
        {
          address: contractAddr,
          topic0: MethodTopics.joinBet,
          topic1: matchIdTopic
        },
        {
          address: contractAddr,
          topic0: MethodTopics.withdrawBet,
          topic1: matchIdTopic
        }
      ])
      .order("desc")
      .apply(this.offset, this.limit);
    const joinEvent = new abi.Event(EventABI.joinBet as any);
    const withdrawBetEvent = new abi.Event(EventABI.withdrawBet as any);
    const brs = [];
    for (const event of events) {
      const meta = event.meta as any;
      if (event.topics[0] == MethodTopics.joinBet) {
        const decoded = joinEvent.decode(event.data, event.topics) as any;
        const seedId = decoded.combatant;
        const seedName = this.match.seedNameById(seedId);
        brs.push(
          new BetRecord(
            decoded._id,
            decoded.player,
            seedId,
            seedName,
            new BigNumber(decoded.stakes),
            meta.blockTimestamp
          )
        );
      } else {
        const decoded = withdrawBetEvent.decode(
          event.data,
          event.topics
        ) as any;
        const seedId = decoded.combatant;
        const seedName = this.match.seedNameById(seedId);
        brs.push(
          new BetRecord(
            decoded._id,
            decoded.player,
            seedId,
            seedName,
            new BigNumber(decoded.stakes).negated(),
            meta.blockTimestamp
          )
        );
      }
    }
    return brs;
  }

  private async lastpage() {
    this.offset -= this.limit;
    if (this.offset < 0) {
      this.offset = 0;
    }
    await this.loadBetRecords();
  }

  private async nextpage() {
    this.offset += this.limit;
    await this.loadBetRecords();
  }

  private async reload() {
    this.match = await this.getMatch();
    await this.updateYourBet();
  }

  private destroyed() {
    console.log("MatchDetails destroyed");
    GlobalEvent.$off(Events.TickerStart);
    GlobalEvent.$off(Events.AccountChanged);
  }

  private async getMatch() {
    const getmatchMethod = connex.thor
      .account(contractAddr)
      .method(MethodABI.getMatch);
    const output = await getmatchMethod.call(new BigNumber(this.matchId));
    const decoded = output.decoded as any;
    const match = new Match(
      new BigNumber(decoded.id),
      decoded.gameName,
      parseFloat(decoded.startTime),
      parseInt(decoded.stage),
      decoded.leftName,
      decoded.rightName,
      parseInt(decoded.leftScore),
      parseInt(decoded.rightScore),
      new BigNumber(decoded.leftBet),
      new BigNumber(decoded.rightBet)
    );
    try {
      const res = await this.$http.get(HttpHost + "/api/quiz/" + this.matchId);
      const data = await res.json();
      match.view = {
        id: new BigNumber(decoded.id),
        oneLogo: HttpHost + data.leftLogo,
        twoLogo: HttpHost + data.rightLogo
      };
    } catch (err) {
      console.log(err.message);
    }
    return match;
  }

  private async updateYourBet() {
    let bet = await this.getBet(this.match.id, MatchSeedIds.one);
    this.oneSeedBet = bet.dividedBy(unit).toString(10);
    bet = await this.getBet(this.match.id, MatchSeedIds.two);
    this.twoSeedBet = bet.dividedBy(unit).toString(10);
  }

  private async getBet(matchId: BigNumber, seedId: number) {
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
}
</script>
<style>
.text_center_bold {
  height: 70px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 30px;
  font-weight: bold;
  color: white;
}

.text_center {
  height: 75px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 15px;
  color: white;
}

.full_screen {
  position: absolute !important;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}
.v-list {
  height: 480px;
  overflow-y: auto;
}
.a {
  background-color: coral;
}
</style>
