<template>
  <section class="container section">
    <div class="pageloader" :class="isPageLoading"><span class="title">{{ pageLoadingError ? "There is some communication issue with the API server. Please reload the browser." : "Loading data..." }}</span></div>
    <div class="tile is-ancestor" v-if="countryData">
      <div class="tile is-parent">
        <article class="tile is-child box">
          <div class="content">
            <p class="title">Country: {{ countryData.country }}</p>
            <img :src="renderMap(countryData.countryInfo)" />
            <div class="content">
              <br />
              <!-- <label class="label">Last Updated:</label> {{ this.formatDate(countryData.last_updated) }} <br /><br /> -->
              <label class="label">Cases:</label>
              <span class="cases">{{ this.numberWithCommas(countryData.cases) }}</span><br /><br />
              <label class="label">Today Cases:</label>
              <span class="todayCases">{{ this.numberWithCommas(countryData.todayCases) }}</span><br /><br />
              <label class="label">Deaths:</label>
              <span class="deaths">{{ this.numberWithCommas(countryData.deaths) }} ({{ this.getPercentageOf(countryData.cases, countryData.deaths) }}%)</span><br /><br />
              <label class="label">Today Deaths:</label>
              <span class="todayDeaths">{{ this.numberWithCommas(countryData.todayDeaths) }} ({{ this.getPercentageOf(countryData.cases, countryData.todayDeaths) }}%)</span><br /><br />
              <label class="label">Recovered:</label>
              <span class="recovered">{{ this.numberWithCommas(countryData.recovered) }} ({{ this.getPercentageOf(countryData.cases, countryData.recovered) }}%)</span><br /><br />
              <label class="label">Active:</label>
              <span class="active">{{ this.numberWithCommas(countryData.active) }} ({{ this.getPercentageOf(countryData.cases, countryData.active) }}%)</span><br /><br />
              <label class="label">Critical:</label>
              <span class="critical">{{ this.numberWithCommas(countryData.critical) }} ({{ this.getPercentageOf(countryData.cases, countryData.critical) }}%)</span><br /><br />
              <label class="label">Cases Per One Million:</label>
              <span class="casesPerOneMillion">{{ this.numberWithCommas(countryData.casesPerOneMillion) }} ({{ this.getPercentageOf(countryData.cases, countryData.casesPerOneMillion) }}%)</span><br /><br />
            </div>
          </div>
        </article>
      </div>
      <div class="tile is-vertical is-8" v-if="casesChartData">
        <div class="tile is-parent">
          <article class="tile is-child box">
            <label class="label cases">Cases:</label>
            <vue-chartjs-line
              :chartdata="casesChartData"
              :options="options"
            />
          </article>
        </div>
        <div class="tile is-parent" v-if="deathsChartData">
          <article class="tile is-child box">
            <label class="label deaths">Deaths:</label>
            <vue-chartjs-line
              :chartdata="deathsChartData"
              :options="options"
            />
          </article>
        </div>
        <div class="tile is-parent" v-if="recoveredChartData">
          <article class="tile is-child box">
            <label class="label recovered">Recovered:</label>
            <vue-chartjs-line
              :chartdata="recoveredChartData"
              :options="options"
            />
          </article>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import axios from 'axios'

let convertObjectToArray = (context, obj, returnType) => {
  return Object.keys(obj).map(function(key) {
    if (returnType === "key") {
      return context.formatDate(key);
    } else if (returnType === "value") {
      return obj[key];
    }
  });
}

let renderChartData = (context, chartData, chartColor) => {
  console.log("chartData::", chartData);
  let resultDates = convertObjectToArray(context, chartData, "key");
  let resultValues = convertObjectToArray(context, chartData, "value");
  return {
    labels: resultDates,
    datasets: [
      {
        label: context.countryData.country,
        backgroundColor: chartColor,
        data: resultValues
      }
    ]
  }
}

export default {
  name: 'Country',
  data() {
    return {
      pageLoading: false,
      pageLoadingError: false,
      countryData: null,
      historicalData: null,
      casesChartData: null,
      deathsChartData: null,
      recoveredChartData: null,
      options: {
        responsive: true,
        maintainAspectRatio: false
      },
      showLine: false
    }
  },
  computed: {
    isPageLoading: function() {
      return this.pageLoading ? 'is-active' : '';
    }
  },
  methods: {
    numberWithCommas: function (x = 0) {
      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },
    getPercentageOf: function(num1, num2) {
      return ((num2 / num1) / Math.pow(10, -2).toFixed(2)).toFixed(2);
    },
    formatDate: function(dateString) {
      return this.$moment(dateString).format("DD/MM/YYYY");
    },
    getRandomInt: function() {
      return Math.floor(Math.random() * Math.floor(1000));
    },
    renderMap: function(coordinates) {
      // get api key here: https://cloud.google.com/
      return `https://maps.googleapis.com/maps/api/staticmap?center=${coordinates.lat},${coordinates.long}&markers=color:red|${coordinates.lat},${coordinates.long}&zoom=8&size=1920x1080&sensor=false&key=xxxxxxxxxxxxxx`;
    },
    getCountryData: async function(id) {
      return await axios.get(`https://corona.lmao.ninja/countries/${id}`)
      .then((res) => {
        if (res.status === 200) {
          return res.data;
        }
      })
    },
    getHistoricalData: async function(id) {
      return await axios.get(`https://corona.lmao.ninja/v2/historical/${id}`)
      .then((res) => {
        if (res.status === 200) {
          return res.data;
        }
      })
    }
  },
  async mounted() {
    let context = this;

    try {
      this.pageLoading = true;

      context.countryData = await context.getCountryData(context.$route.params.id);
      context.historicalData = await context.getHistoricalData(context.$route.params.id);
      const timeline = context.historicalData.timeline;

      // render confirmed charts
      const confirmed = timeline.cases;
      if (confirmed)
        context.casesChartData = renderChartData(context, confirmed, "#065535");

      // render deaths charts
      const deaths = timeline.deaths;
      if (deaths)
        context.deathsChartData = renderChartData(context, deaths, "#ff0000");

      // render recovered charts
      const recovered = timeline.recovered;
      if (recovered)
        context.recoveredChartData = renderChartData(context, recovered, "#003366");

      this.pageLoading = false;
    } catch (error) {
      this.pageLoadingError = true;
      console.log(error);
    }
  }
}
</script>

<style>
p, .content {
  color: black !important;
}

.cases, .todayCases {
  color: #065535;
}

.deaths, .todayDeaths, .active, .critical {
  color: #ff0000;
}

.recovered, .casesPerOneMillion {
  color: #003366;
}
</style>