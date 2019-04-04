<template>
  <div>
    <v-layout column>
      <v-flex xs12 sm12>
        <div style="height:50px"></div>
      </v-flex>
      <v-flex xs12 sm12>
        <v-layout row>
          <v-flex xs2 sm2></v-flex>
          <v-flex xs8 sm8>
            <div class="text_left_bold">1. How to play?</div>
          </v-flex>
          <v-flex xs2 sm2></v-flex>
        </v-layout>
      </v-flex>
      <v-flex xs12 sm12>
        <v-layout row>
          <v-flex xs2 sm2></v-flex>
          <v-flex xs8 sm8>
            <div class="text_left_bold">Step1. choose a match that has not yet started</div>
          </v-flex>
          <v-flex xs2 sm2></v-flex>
        </v-layout>
      </v-flex>
      <v-flex xs12 sm12>
        <v-layout row>
          <v-flex xs2 sm2></v-flex>
          <v-flex xs8 sm8>
            <div style="height:600px">
              <img style="height:100%;object-fit: cover;" src="@/assets/step1.png">
            </div>
          </v-flex>
          <v-flex xs2 sm2></v-flex>
        </v-layout>
      </v-flex>
      <v-flex xs12 sm12>
        <v-layout row>
          <v-flex xs2 sm2></v-flex>
          <v-flex xs8 sm8>
            <div
              class="text_left_bold"
              style="height:150px"
            >Step2. choose a combatant which you think will win, and bet VET for it (100 VET at least), if the combatant won, more VET you bet more bonus you will get</div>
          </v-flex>
          <v-flex xs2 sm2></v-flex>
        </v-layout>
      </v-flex>
      <v-flex xs12 sm12>
        <v-layout row>
          <v-flex xs2 sm2></v-flex>
          <v-flex xs8 sm8>
            <div style="height:600px">
              <img style="height:100%;object-fit: cover;" src="@/assets/step2.png">
            </div>
          </v-flex>
          <v-flex xs2 sm2></v-flex>
        </v-layout>
      </v-flex>
      <v-flex xs12 sm12>
        <v-layout row>
          <v-flex xs2 sm2></v-flex>
          <v-flex xs8 sm8>
            <div
              class="text_left_bold"
            >Step3. check the match that you choosed and notice that the match will automatically be locked one hour before the start</div>
          </v-flex>
          <v-flex xs2 sm2></v-flex>
        </v-layout>
      </v-flex>
      <v-flex xs12 sm12>
        <v-layout row>
          <v-flex xs2 sm2></v-flex>
          <v-flex xs8 sm8>
            <div style="height:600px">
              <img style="height:100%;object-fit: cover;" src="@/assets/step3.png">
            </div>
          </v-flex>
          <v-flex xs2 sm2></v-flex>
        </v-layout>
      </v-flex>
      <v-flex xs12 sm12>
        <v-layout row>
          <v-flex xs2 sm2></v-flex>
          <v-flex xs8 sm8>
            <div
              class="text_left_bold"
              style="height:150px"
            >Step4. You can withdraw your bet if the match hasn't been locked, or withdraw your bonus if the match has been over and notice that once the match is over, we will charge one thousandth of the fee</div>
          </v-flex>
          <v-flex xs2 sm2></v-flex>
        </v-layout>
      </v-flex>
      <v-flex xs12 sm12>
        <v-layout row>
          <v-flex xs2 sm2></v-flex>
          <v-flex xs8 sm8>
            <div style="height:600px">
              <img style="height:100%;object-fit: cover;" src="@/assets/step4.png">
            </div>
          </v-flex>
          <v-flex xs2 sm2></v-flex>
        </v-layout>
      </v-flex>
      <v-flex xs12 sm12>
        <div style="height:100px"></div>
      </v-flex>
    </v-layout>
  </div>
</template>
<script lang="ts">
import { Vue, Component } from "vue-property-decorator";

@Component
export default class About extends Vue {}
</script>
<style>
.text_left_bold {
  height: 70px;
  text-align: left;
  display: flex;
  align-items: center;
  justify-content: left;
  font-size: 30px;
  font-weight: bold;
  color: white;
}
</style>
