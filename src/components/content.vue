<template>
    <v-card width="100%" height="100%" style="text-align:left;">
        <div>
            <v-btn color="primary" dark slot="activator" @click="exit">返回文章列表</v-btn>
        </div>
        <v-divider></v-divider>
        <div>
            <h2 style="padding:10px;"><strong>{{ row.title }}</strong></h2>
            <p style="color: rgba(0,0,0,.54);text-indent: 10px;">
                <span>{{ row.name }}</span>&nbsp;&nbsp;|&nbsp;&nbsp;
                <span>{{ row.time }}</span>
            </p>
        </div>
        <v-divider></v-divider>
        <div style="padding:20px;word-break: break-all;text-indent:2em;">
            <p style="line-height:2;">{{ row.content }}</p>
        </div>
    </v-card>
</template>
<script>
export default {
  data: () => ({
    list: [],
    row: {}
  }),
  methods: {
    getData () {
      this.$axios.get(this.HOST + '/content/list', {}).then(response => {
        this.list = response.data
        for (let item of this.list) {
          item.time = this.toformatDate(item.time, 'yyyy-MM-dd hh:mm:ss')
        }
        this.getOneRow()
      })
        .catch(error => {
          console.log(error)
        })
    },
    getOneRow () {
      for (let item of this.list) {
        if (item._id === this.$route.query.id) {
          this.row = item
        }
      }
    },
    exit () {
      this.$router.go(-1)
    }
  },
  mounted: function () {
    this.$nextTick(function () {
      this.getData()
    })
  }
}
</script>
