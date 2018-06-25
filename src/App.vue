<template>
  <div id="app" role="main">
    <vue-select-a11y
            input-name="languages"
            :items=countries
            :value=myValue
            v-on:changed="selectChanged"
    >
    </vue-select-a11y>

    <p>{{ myValue }}</p>
  </div>
</template>

<script>
import VueSelectA11y from './components/vue-select-a11y'

export default {
  name: 'App',
  components: {
    VueSelectA11y
  },
  data: function () {
    return {
      countries: [
        { key: 'en', value: 'English' },
        { key: 'fr', value: 'French' },
        { key: 'pt', value: 'Portuguese' },
        { key: 'es', value: 'Spanish' },
        { key: 'ar', value: 'Arabic' }
      ],
      myValue: [
        'en', 'fr'
      ]
    }
  },
  methods: {
    selectChanged (e) {
      this.myValue = e
    }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
