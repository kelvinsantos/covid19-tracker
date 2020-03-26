<template>
  <section class="container is-fluid section">
    <div class="pageloader" :class="isPageLoading"><span class="title">{{ pageLoadingError ? "There is some communication issue with the API server. Please reload the browser." : "Loading data..." }}</span></div>
    <div class="tile is-ancestor">
      <div class="tile is-parent">
        <article class="tile is-child box" v-if="latestData">
          <div class="content">
            <p class="title">Summary</p>
            <p>Updated: {{ this.formatDate(latestData.updated) }}</p>
            <br />
            <label class="title">Cases:</label><br />
            <span class="title cases">{{ this.numberWithCommas(latestData.cases) }}</span><br /><br />
            <label class="title">Deaths:</label><br />
            <span class="title deaths">{{ this.numberWithCommas(latestData.deaths) }} ({{ this.getPercentageOf(latestData.cases, latestData.deaths) }}%)</span><br /><br />
            <label class="title">Recovered:</label><br />
            <span class="title recovered">{{ this.numberWithCommas(latestData.recovered) }} ({{ this.getPercentageOf(latestData.cases, latestData.recovered) }}%)</span><br /><br />
          </div>
        </article>
      </div>
      <div class="tile is-vertical is-10">
        <div class="tile is-parent">
          <article class="tile is-child box table-responsive">
            <table id="user-table" class="display table-bordered nowrap" cellspacing="0" width="100%">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Rank</th>
                  <th>Country</th>
                  <th>Cases</th>
                  <th>Today Cases</th>
                  <th>Deaths</th>
                  <th>Today Deaths</th>
                  <th>Recovered</th>
                  <th>Active</th>
                  <th>Critical</th>
                  <th>Cases Per Million</th>
                </tr>
              </thead>
              <tbody>
              </tbody>
            </table>
          </article>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import axios from 'axios'

export default {
  name: 'Index',
  head () {
    return {
      script: [
        { src: 'https://cdnjs.cloudflare.com/ajax/libs/datatables/1.10.13/js/jquery.dataTables.min.js' }
      ],
      link: [
        { rel: 'stylesheet', href: 'https://cdn.datatables.net/1.10.13/css/jquery.dataTables.css' }
      ]
    }
  },
  data() {
    return {
      pageLoading: false,
      pageLoadingError: false,
      dataTable: null,
      latestData: null,
      countriesData: [],
      chartdata: null,
      options: {
        responsive: true,
        maintainAspectRatio: false
      },
      showLine: false,
      columns: [
            {label: 'id', field: 'id'},
            {label: 'Username', field: 'user.username', headerClass: 'class-in-header second-class'},
            {label: 'First Name', field: 'user.firstName'},
            {label: 'Last Name', field: 'user.lastName'},
            {label: 'Email', field: 'user.email'},
            {label: 'Address', representedAs: ({address, city, state}) => `${address}<br />${city}, ${state}`, interpolate: true}
        ],
        rows: [
            //...
            {
                id: 1,
                user: {
                    username: "dprice0",
                    firstName: "Daniel",
                    lastName: "Price",
                    email: "dprice0@blogs.com"
                },
                address: "3 Toban Park",
                city: "Pocatello",
                state: "Idaho"
            }
            //...
        ]
    }
  },
  computed: {
    isPageLoading: function() {
      return this.pageLoading ? 'is-active' : '';
    }
  },
  methods: {
    numberWithCommas: function (x = 0) {
      if (!x) return 0;
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
    getLatestData: async function() {
      return await axios.get(`https://corona.lmao.ninja/all`)
      .then((res) => {
        if (res.status === 200) {
          return res.data;
        }
      })
    },
    getCountriesData: async function() {
      return await axios.get(`https://corona.lmao.ninja/countries`)
      .then((res) => {
        if (res.status === 200) {
          return res.data.sort(function (a, b) {
            return b.cases - a.cases;
          });
        }
      })
    }
  },
  async mounted() {
    let component = this;

    try {
      this.pageLoading = true;

      component.latestData = await component.getLatestData();
      component.countriesData = await component.getCountriesData();

      if (window.jQuery) {
        component.dataTable = $('#user-table').DataTable({
          data: component.countriesData.map((country, index) => [
            country.countryInfo._id,
            index+1,
            `<a style="text-decoration: underline;" href="/country/${country.country}">${country.country}</a>`,
            `<span>${this.numberWithCommas(country.cases)}</span>`,
            // `<span>${this.numberWithCommas(country.todayCases)} (${component.getPercentageOf(country.cases, country.todayCases)}%)</span>`,
            `<span>+${this.numberWithCommas(country.todayCases)}</span>`,
            `<span style="color:#ff0000;">${this.numberWithCommas(country.deaths)}</span>`,
            `<span>+${this.numberWithCommas(country.todayDeaths)}</span>`,
            `<span>${this.numberWithCommas(country.recovered)}</span>`,
            `<span>${this.numberWithCommas(country.active)}</span>`,
            `<span>${this.numberWithCommas(country.critical)}</span>`,
            `<span>${this.numberWithCommas(country.casesPerOneMillion)}</span>`,
          ]),
          order: [[ 3, "desc" ]],
          columnDefs: [
            {
              targets: [ 0 ],
              visible: false,
              searchable: false
            }
          ]
        });
      }

      this.pageLoading = false;
    } catch (error) {
      this.pageLoadingError = true;
      console.log(error);
    }
  }
}
</script>

<style lang="scss" scoped>
.table-responsive {
  overflow-x: auto;
}

.content {
  label.title, span.title {
    font-size: 1.7rem;
  }
}

p, .content {
  color: black !important;
  text-align: center;
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