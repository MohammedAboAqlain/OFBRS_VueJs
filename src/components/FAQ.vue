<template>
  <div>
    <h1 class="text-center py-4">أسئلة شائعة</h1>

    <div class="text-right mx-4" v-for="(item, idx) in items" :key="item.question">
      <h3>{{ idx+1 }} - {{ item.question }}</h3>
      <p class="text-muted">{{ item.answer }}</p>
      <hr>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import { mapGetters } from 'vuex';

export default {
  data(){
    return {
      items: []
    }
  },
  created(){
    axios.get('http://127.0.0.1:8000/api/get-faq/',
    {headers: { Authorization: `Token ${this.getToken}` }})
      .then(res => {
        console.log(res);
        
        let result = [];
        for (let i = 0; i < res.data.data.length; i++) {
            result.push({question:res.data.data[i].question, answer: res.data.data[i].answer});
        }
        this.items = result;
      })
  },
  computed: mapGetters(['getToken']),
}
</script>

<style>

</style>