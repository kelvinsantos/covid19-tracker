import Vue from "vue";
import { Bar, Line, mixins } from "vue-chartjs";

Vue.component("vue-chartjs-bar", {
  extends: Bar,
  mixins: [mixins.reactiveProp],
  props: ["chartdata", "options", "styles"],
  mounted() {
    this.renderChart(this.chartdata, this.options);
  }
});

Vue.component("vue-chartjs-line", {
  extends: Line,
  mixins: [mixins.reactiveProp],
  props: ['chartdata', 'options'],
  mounted() {
    this.renderChart(this.chartdata, this.options)
  }
});