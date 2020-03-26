<template>
  <section class="container section">
    <iframe src="https://www.google.com/maps/d/embed?mid=1a04iBi41DznkMaQRnICO40ktROfnMfMx"></iframe>
  </section>
</template>

<script>
import axios from 'axios'

export default {
  name: 'HomePage',
  data() {
    return {
    }
  },
  methods: {
  },
  async mounted() {
  }
}
</script>

<style scoped>
section iframe {
  width: 100%;
  height: 700px;
}
</style>
