<template>
  <v-card dark>
    <v-layout row>
      <v-flex xs6 sm6>
        <div class="content_center">{{betRecord.address}}</div>
      </v-flex>
      <v-flex xs1 sm1>
        <div class="content_center">{{betRecord.seedName}}</div>
      </v-flex>
      <v-flex xs3 sm3>
        <div class="content_center">{{betRecord.bet}}</div>
      </v-flex>
      <v-flex xs2 sm2>
        <div class="content_center">{{betRecord.fullTime}}</div>
      </v-flex>
    </v-layout>
  </v-card>
</template>

<script lang="ts">
import { BetRecord } from "../models/BetRecord";
import { Vue, Component, Prop } from "vue-property-decorator";

@Component
export default class BetRecordCard extends Vue {
  @Prop() private betRecord!: BetRecord;
}
</script>