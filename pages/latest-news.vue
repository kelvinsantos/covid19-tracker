<template>
  <section class="container section">
    <div v-if="chunkedArticles.length > 0">
      <div v-for="(chunkedArticle, loopIndex) in chunkedArticles" :key="loopIndex">
        <div class="columns">
          <div class="column" v-for="(article, videoIndex) in chunkedArticle" :key="videoIndex">
            <div class="card">
              <div class="card-image">
                <figure class="image is-4by3">
                  <img @click="openPopupPlayer(article)" :src="article.urlToImage" alt="Placeholder image">
                </figure>
                <div class="card-content">
                  <div class="media">
                    <div class="media-left">
                      <figure class="image is-48x48">
                        <img :src="article.urlToImage" alt="Placeholder image">
                      </figure>
                    </div>
                    <div class="media-content">
                      <p class="title is-4">{{ article.source.name }}</p>
                      <p class="subtitle is-6">@{{ article.source.name }}</p>
                    </div>
                  </div>

                  <div class="content">
                    <a :href="article.url" target="_blank">{{ article.title }}</a>
                    <br>
                    <br>
                    <time datetime="2016-1-1">{{ article.publishedAt }}</time>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else>
      No Articles Found :(
    </div>
  </section>
</template>

<script>
import axios from 'axios'
export default {
  name: 'Latest News',
  data() {
    return {
      chunkedArticles: [],
      perChunk: 4,
    }
  },
  computed: {
  },
  methods: {
    _chunkedArticles: async function(articles) {
      return await articles.reduce((article, item, index) => { 
        const chunkIndex = Math.floor(index / this.perChunk)
        if (!article[chunkIndex]) {
          article[chunkIndex] = []
        }
        article[chunkIndex].push(item)
        return article
      }, []);
    },
    getTopHeadlinesPH: async function() {
      // get api key here: https://newsapi.org/
      return await axios.get(`https://newsapi.org/v2/top-headlines?category=health&apiKey=xxxxxxxxxxxxxxxxxxx`)
      .then((res) => {
        if (res.status === 200) {
          return res.data.articles;
        }
      })
    }
  },
  async mounted() {
    let component = this;
    let articles = await component.getTopHeadlinesPH();
    component.chunkedArticles = await component._chunkedArticles(articles);
  }
}
</script>

<style>
html,
body {
  margin: 0;
  padding: 0;
}
</style>
