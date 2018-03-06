<template>
    <v-card width="100%" height="100%">
        <router-view></router-view>
        <div style="height:50px;position: fixed;width: 100%;z-index: 3;background: #fff;">
        <v-menu offset-y style="position:absolute;left:0;">
        <v-btn color="primary" dark slot="activator">筛选</v-btn>
        <v-list>
            <v-list-tile v-for="(item, i) in menu" :key="i" @click="searchOption(i)">
            <v-list-tile-title>{{ item.title }}</v-list-tile-title>
            </v-list-tile>
        </v-list>
        </v-menu>
        <v-menu
        ref="menu"
        style="position:absolute;left:120px;"
        :close-on-content-click="false"
        v-model="menu0"
        transition="scale-transition"
        offset-y
        full-width
        :nudge-right="40"
        min-width="290px"
        :return-value.sync="date"
        >
        <v-text-field
            slot="activator"
            v-model="date"
            label="选择日期"
            prepend-icon="event"
            readonly
        ></v-text-field>
        <v-date-picker v-model="date"  locale="ch" no-title scrollable>
            <v-spacer></v-spacer>
            <v-btn flat color="primary" @click="menu0 = false">取消</v-btn>
            <v-btn flat color="primary" @click="searchByDate">确认</v-btn>
        </v-date-picker>
        </v-menu>
        <v-text-field
            flat
            solo-inverted
            append-icon="search"
            :append-icon-cb="searchHandle"
            @keyup.enter="searchHandle"
            label="Search"
            v-model="searchKeys"
            style="position: absolute;width: 60%;right: 8px;left: 19%;top: -62px;"
        ></v-text-field>
        </div>
        <v-divider></v-divider>
        <v-list three-line style="margin-top: 45px;">
        <template v-for="(item, index) in list">
            <!-- <v-subheader v-if="item.header" :key="item.header">{{ item.header }}</v-subheader> -->
            <v-divider :inset="item.inset" :key="index"></v-divider>
            <v-list-tile avatar :key="item.title" style="margin: 10px 0;" class="content-list" @click="showContent(item._id)">
            <v-list-tile-avatar>
                <img src="../assets/timg.jpg">
            </v-list-tile-avatar>
            <a style="position: absolute;margin: 0;bottom: 0px;left:28px;">
                <!-- <v-icon small>thumb_up</v-icon> -->
            </a>
            <v-list-tile-content>
                <v-list-tile-title>
                <strong>{{ item.title }}</strong>
                </v-list-tile-title>
                <v-list-tile-title><span style="font-size: 13px;color: rgba(0,0,0,.54);">作者：{{ item.name }}</span></v-list-tile-title>
                <v-list-tile-sub-title><span style="font-size: 12px;color: rgba(0,0,0,.54);">{{ item.time }}</span></v-list-tile-sub-title>
            </v-list-tile-content>
            </v-list-tile>
        </template>
        </v-list>
        <v-btn
        fab
        bottom
        right
        color="pink"
        dark
        fixed
        @click.stop="addContentDialog"
        >
        <v-icon>add</v-icon>
        </v-btn>

        <v-dialog v-model="addContent" width="800px">
        <v-card>
            <v-card-title
            class="grey lighten-4 py-4 title"
            >
            发表随记
            </v-card-title>
            <v-container grid-list-sm class="pa-4">
            <v-layout row wrap>
                <v-flex xs12>
                <v-text-field
                    placeholder="标题"
                    v-model="contentDetail.title"
                    required
                    ref="title"
                    counter="20"
                    maxlength="20"
                    :rules="[() => !!contentDetail.title || '请输入标题']"
                ></v-text-field>
                </v-flex>
                <v-flex xs12>
                <v-text-field
                    textarea
                    required
                    v-model="contentDetail.content"
                    ref="content"
                    :rules="[() => !!contentDetail.content || '请输入内容']"
                    counter="200"
                    maxlength="200"
                    placeholder="内容"
                ></v-text-field>
                </v-flex>
            </v-layout>
            </v-container>
            <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn flat color="primary" @click="addContent = false">取消</v-btn>
            <v-btn flat @click="addContentSubmit">确定</v-btn>
            </v-card-actions>
        </v-card>
        </v-dialog>

        <v-alert
        style="width: 100%;position: absolute;z-index: 999;top:20%;"
        type="success"
        :value="addSuccess"
        transition="scale-transition"
        >
        发表成功.
        </v-alert>
        <v-alert
        style="width: 100%;position: absolute;z-index: 999;top:20%;"
        type="warning"
        :value="loginWarning"
        transition="scale-transition"
        >
        您还没有登录，请登录后再进行此操作.
        </v-alert>

        <v-progress-circular style="position: absolute;z-index: 10;left: 43%;top: 48%;" indeterminate :size="50" color="primary" v-show="loading"></v-progress-circular>
    </v-card>
</template>
<script>
export default {
  data: () => ({
    date: null,
    menu0: false,
    modal: false,
    loading: false,
    needLogin: false,
    addContent: false,
    loginWarning: false,
    addSuccess: false,
    contentDetail: {
      title: '',
      content: ''
    },
    menu: [
      { title: '全部' },
      { title: '只看自己' }
    ],
    list: [],
    addContentFormHasErrors: false,
    backData: [],
    searchKeys: []
  }),
  props: {
    source: String
  },
  computed: {
    addContentForm () {
      return {
        title: this.contentDetail.title,
        content: this.contentDetail.content
      }
    }
  },
  methods: {
    searchByDate () {
      this.$refs.menu.save(this.date)
      this.list = this.search(this.date)
    },
    searchHandle () {
      this.list = this.search(this.searchKeys)
    },
    search (search) {
      if (search) {
        return this.backData.filter(function (backData) {
          return Object.keys(backData).some(function (key) {
            return String(backData[key]).indexOf(search) > -1
          })
        })
      }
      return this.backData
    },
    searchOption (index) {
      if (localStorage.getItem('name') === '' || localStorage.getItem('name') === null) {
        this.loginWarning = true
        setTimeout(() => {
          this.loginWarning = false
          this.needLogin = true
          this.$emit('needLogin', this.needLogin)
        }, 1200)
      } else {
        if (index === 0) {
          this.list = this.backData
        } else if (index === 1) {
          let username = localStorage.getItem('name')
          let mycontent = []
          for (let item of this.list) {
            if (username === item.name) {
              mycontent.push(item)
            }
          }
          this.list = mycontent
        }
      }
    },
    addContentDialog () {
      if (localStorage.getItem('name') === '' || localStorage.getItem('name') === null) {
        this.loginWarning = true
        setTimeout(() => {
          this.loginWarning = false
          this.needLogin = true
          this.$emit('needLogin', this.needLogin)
        }, 1200)
      } else {
        this.addContent = true
      }
    },
    getData () {
      this.$axios.get(this.HOST + '/content/list', {}).then(response => {
        this.list = response.data
        for (let item of this.list) {
          item.time = this.toformatDate(item.time, 'yyyy-MM-dd hh:mm:ss')
        }
        this.backData = JSON.parse(JSON.stringify(this.list))
      })
        .catch(error => {
          console.log(error)
        })
    },
    addContentSubmit () {
      this.addContentFormHasErrors = false

      Object.keys(this.addContentForm).forEach(f => {
        if (!this.addContentForm[f]) {
          this.addContentFormHasErrors = true
          this.$refs[f].validate(true)
        }
      })
      if (!this.addContentFormHasErrors) {
        this.$axios.post(this.HOST + '/content/add', this.contentDetail).then(response => {
          this.loading = true
          this.addContent = false
          setTimeout(() => {
            this.loading = false
            this.addSuccess = true
            this.getData()
            setTimeout(() => {
              this.addSuccess = false
            }, 1200)
          }, 1000)
        })
          .catch(error => {
            console.log(error)
          })
      }
    },
    showContent (id) {
      this.$router.push({
        path: 'content',
        query: {
          id: id
        }
      })
    }
  },
  mounted: function () {
    this.$nextTick(function () {
      this.getData()
    })
  }
}
</script>
