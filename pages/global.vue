<template>
  <section class="section">
    <div class="tile is-ancestor">
      <div class="tile is-parent">
        <article class="tile is-child box">
          <div class="content">
            <p class="title">Quick Facts</p>
            <p class="subtitle">updated: a few seconds ago</p>
            <div class="content">
              Total Cases: {{ totalData.cases }}<br>
              Today Cases: {{ totalData.todayCases }}<br>
              Deaths: {{ totalData.deaths }}<br>
              Today Deaths: {{ totalData.todayDeaths }}<br>
              Recovered: {{ totalData.recovered }}<br>
              Active: {{ totalData.active }}<br>
              Critical: {{ totalData.critical }}<br>
              Cases Per One Million: {{ totalData.casesPerOneMillion }}
            </div>
          </div>
        </article>
      </div>
      <div class="tile is-vertical is-8">
        <div class="tile is-parent">
          <article class="tile is-child box">
            <vue-chartjs-bar
              v-if="chartdata"
              :chartdata="chartdata"
              :options="options"
              :height="260"
            />
          </article>
        </div>
        <div class="tile is-parent">
          <article class="tile is-child box">
            <p class="title">Wide tile</p>
            <p class="subtitle">Aligned with the right tile</p>
            <div class="content">
              <!-- Content -->
            </div>
          </article>
        </div>
        <div class="tile is-parent">
          <article class="tile is-child box">
            <p class="title">Wide tile</p>
            <p class="subtitle">Aligned with the right tile</p>
            <div class="content">
              <!-- Content -->
            </div>
          </article>
        </div>
        <div class="tile is-parent">
          <article class="tile is-child box">
            <p class="title">Wide tile</p>
            <p class="subtitle">Aligned with the right tile</p>
            <div class="content">
              <!-- Content -->
            </div>
          </article>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import axios from 'axios'
import { Bar } from 'vue-chartjs'

export default {
  extends: Bar,
  name: 'Global',
  data() {
    return {
      totalData: {},
      allCountriesAffected: [],
      chartdata: null,
      options: {
        responsive: true,
        maintainAspectRatio: false
      },
      showLine: false
    }
  },
  methods: {
    getRandomInt: function() {
      return Math.floor(Math.random() * Math.floor(1000));
    },
    getTotalData: async function() {
      return await axios.get(`https://coronavirus-19-api.herokuapp.com/countries/philippines`)
      .then((res) => {
        if (res.status === 200) {
          return res.data;
        }
      })
    },
    getAllCountriesAffected: async function() {
      return await axios.get(`https://coronavirus-19-api.herokuapp.com/countries`)
      .then((res) => {
        if (res.status === 200) {
          return res.data.slice(0, 10);
        }
      })
    }
  },
  async mounted() {
    this.totalData = await this.getTotalData();
    const allCountriesAffected = await this.getAllCountriesAffected();
    const countries = allCountriesAffected.map(c => {
      return c.country;
    });
    const cases = allCountriesAffected.map(c => {
      return {
        label: c.country,
        backgroundColor: '#'+(Math.random()*0xFFFFFF<<0).toString(16),
        data: [c.cases]
      };
    });
    this.chartdata = {
      labels: countries,
      datasets: cases
    }
    // let datacollection = {
    //   labels: [this.getRandomInt(), this.getRandomInt()],
    //   datasets: [
    //     {
    //       label: 'Data One',
    //       backgroundColor: '#f87979',
    //       data: [this.getRandomInt(), this.getRandomInt()]
    //     }, {
    //       label: 'Data One',
    //       backgroundColor: '#f87979',
    //       data: [this.getRandomInt(), this.getRandomInt()]
    //     }
    //   ]
    // }
    // this.chartdata = datacollection;
  }
}
</script>

<style>
/* .tile.is-child {
  background: none;
  border: solid #355C7D;
} */
p, .content {
  color: black !important;
}
</style>