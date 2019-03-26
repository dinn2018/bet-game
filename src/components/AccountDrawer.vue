<template>
  <v-navigation-drawer
    v-model="drawer"
    app
    floating
    hide-overlay
    right
    :mobile-break-point="600"
    :width="440"
  >
    <v-list subheader>
      <AccountCard v-for="acc in accounts" :key="acc.address" :account="acc"></AccountCard>
    </v-list>
    <v-card dark hover @click="registerAccount" class="account_register">
      <v-icon class="account_register">fas fa-plus</v-icon>
    </v-card>
  </v-navigation-drawer>
</template>
<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import AccountCard from "@/components/AccountCard.vue";
import DB, { Account, AccountLevel } from "@/database";
import { GlobalEvent, Events } from "@/GlobalEvent";

@Component({
  components: { AccountCard }
})
export default class AccountDrawer extends Vue {
  @Prop() drawer: boolean = false;

  private get accounts() {
    return this.$store.state.accounts;
  }

  private async registerAccount() {
    try {
      const register = connex.vendor.sign("cert");
      const result = await register.request({
        purpose: "identification",
        payload: {
          type: "text",
          content: "register an account for legendary gambling"
        }
      });
      console.log("registerAccount", result);
      const acc = {
        address: result.annex.signer,
        createdTime: result.annex.timestamp,
        level: AccountLevel.Main
      };
      await this.commitAccount(acc);
      alert("register " + acc.address + " successfully!");
    } catch (err) {
      console.log(err.message);
    }
  }

  private async commitAccount(acc: Account) {
    const main = await DB.getMainAccount();
    await DB.setMainAccount(acc);
    const accs = await DB.accounts.toArray();
    await this.$store.commit("setMain", acc);
    await this.$store.commit("put", accs);
    if (main.address != acc.address) {
      await GlobalEvent.$emit(Events.AccountChanged);
    }
  }
}
</script>
<style>
.list_location {
  position: absolute !important;
  left: 0;
  right: 0;
  top: 0;
  bottom: 50px;
}
.account_register {
  position: absolute !important;
  left: 0;
  right: 0;
  bottom: 0;
  height: 50px;
  display: flex;
  align-items: center;
  text-align: center;
  padding: 0%;
}
</style>
