<template>
  <v-card dark flat hover max-height class="account_card" @click="selected">
    <v-icon class="account_address_icon" style="font-size:15px">fas fa-address-book</v-icon>
    <div class="account_address">{{account.address}}</div>
    <v-icon class="account_balance_icon" style="font-size:15px">fas fa-dollar-sign</v-icon>
    <div class="account_balance">{{balance}}</div>
    <v-icon v-show="account.level == 0" class="account_main_icon">fas fa-check</v-icon>
  </v-card>
</template>

<script lang="ts">
import { unit } from "../config";
import DB, { Entities } from "../database";
import { Vue, Component, Prop } from "vue-property-decorator";
import BigNumber from "bignumber.js";
import { GlobalEvent, Events } from "../GlobalEvent";

@Component
export default class AccountCard extends Vue {
  @Prop() account!: Entities.Account;

  balance: string = "0 vet";

  async selected() {
    let main = await DB.getMainAccount();
    await DB.setMainAccount(this.account);
    let accs = await DB.accounts.toArray();
    await this.$store.commit("put", accs);
    await this.$store.commit("setMain", this.account);
    if (main.address != this.account.address) {
      await GlobalEvent.$emit(Events.AccountChanged);
    }
  }

  async getbalance(addr: string) {
    let a = await connex.thor.account(addr).get();
    let balance = new BigNumber(a.balance).div(unit).toString(10);
    return balance.split(".")[0] + " vet";
  }

  async created() {
    this.balance = await this.getbalance(this.account.address);
  }
}
</script>
<style>
.account_card {
  height: 80px;
  padding: 0%;
  margin-top: 0%;
  border: 0ch;
}
.account_address_icon {
  position: absolute !important;
  margin: 0;
  top: 10px;
  left: 10px;
  height: 25px;
  width: 25px;
}

.account_address {
  position: absolute !important;
  top: 10px;
  left: 45px;
  right: 50px;
  height: 25px;
  display: flex;
  align-items: center;
  text-align: left;
}

.account_balance_icon {
  position: absolute !important;
  margin: 0;
  bottom: 10px;
  left: 10px;
  height: 25px;
  width: 25px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.account_balance {
  position: absolute !important;
  margin: 0;
  bottom: 10px;
  left: 45px;
  right: 50px;
  height: 25px;
  display: flex;
  align-items: center;
  justify-content: left;
  text-align: left;
}

.account_main_icon {
  position: absolute !important;
  margin: 0;
  bottom: 20px;
  right: 20px;
  height: 40px;
  width: 40px;
}
</style>
