<style>
.content-list .list__tile--avatar {
  height: unset!important;
}
</style>
<template>
  <v-app id="inspire">
    <v-navigation-drawer
      fixed
      :clipped="$vuetify.breakpoint.mdAndUp"
      app
      v-model="drawer"
    >
    <v-container fluid fill-height>
      <v-layout justify-center align-center>
        <div>
          <img style="height:200px;border-radius: 50%;" src="../assets/timg.jpg" alt="">
          <v-btn v-if="user === ''" flat color="primary" @click="login = true">登录</v-btn>
          <v-btn v-if="user === ''" flat color="primary" @click="register = true">注册</v-btn>
          <v-btn v-else flat color="primary" @click="logout">注销</v-btn>
          <div><strong>{{ user }}</strong></div>
          <div>要成为海贼王的男人</div>
        </div>
      </v-layout>
    </v-container>
    </v-navigation-drawer>
    <v-toolbar
      color="blue darken-3"
      dark
      app
      :clipped-left="$vuetify.breakpoint.mdAndUp"
      fixed
    >
      <v-toolbar-title style="width: 300px" class="ml-0 pl-3">
        <v-toolbar-side-icon @click.stop="drawer = !drawer" style="float: left;"></v-toolbar-side-icon>
        <span class="hidden-sm-and-down" style="float:left;margin-top:10px;">Blog</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
    </v-toolbar>
    <v-content style="padding-top:0;">
      <v-container fluid fill-height style="padding:8px;">
        <router-view @needLogin="ifLogin"></router-view>
      </v-container>
    </v-content>
    <v-dialog v-model="login" width="800px">
      <v-card>
        <v-card-title
          class="grey lighten-4 py-4 title"
        >
          登录
        </v-card-title>
        <v-container grid-list-sm class="pa-4">
          <v-layout row wrap>
            <v-flex xs12 align-center justify-space-between>
              <v-layout align-center>
                <v-avatar size="40px" class="mr-3">
                  <img
                    src="//ssl.gstatic.com/s2/oz/images/sge/grey_silhouette.png"
                    alt=""
                  >
                </v-avatar>
                <v-text-field
                  clearable
                  placeholder="姓名/用户名"
                  v-model="userInfo.name"
                  required
                  ref="name"
                  :rules="[() => !!userInfo.name || '请输入用户名']"
                ></v-text-field>
              </v-layout>
              <v-flex xs12>
                <v-text-field
                  clearable
                  type="password"
                  prepend-icon="lock"
                  placeholder="密码"
                  v-model="userInfo.pwd"
                  required
                  ref="pwd"
                  :rules="[() => !!userInfo.pwd || '请输入密码']"
                ></v-text-field>
              </v-flex>
            </v-flex>
          </v-layout>
        </v-container>
        <v-card-actions>
          <v-btn flat color="primary" @click="registerDialg">注册</v-btn>
          <v-spacer></v-spacer>
          <v-btn flat color="primary" @click="login = false">取消</v-btn>
          <v-btn flat @click="loginSubmit">确定</v-btn>
        </v-card-actions>
        <div style="text-align: left;text-indent: 20px;">
          <span>还没有账户？注册一个吧！</span>
        </div>
      </v-card>
    </v-dialog>

    <v-dialog v-model="register" width="800px">
      <v-card>
        <v-card-title
          class="grey lighten-4 py-4 title"
        >
          注册
        </v-card-title>
        <v-container grid-list-sm class="pa-4">
          <v-layout row wrap>
            <v-flex xs12 align-center justify-space-between>
              <v-layout align-center>
                <v-avatar size="40px" class="mr-3">
                  <img
                    src="//ssl.gstatic.com/s2/oz/images/sge/grey_silhouette.png"
                    alt=""
                  >
                </v-avatar>
                <v-text-field
                  clearable
                  placeholder="姓名/用户名"
                  v-model="registerInfo.name"
                  required
                  ref="name"
                  :rules="[() => !!registerInfo.name || '请输入用户名']"
                ></v-text-field>
              </v-layout>
              <v-flex xs12>
                <v-text-field
                  clearable
                  type="password"
                  prepend-icon="lock"
                  placeholder="密码"
                  v-model="registerInfo.pwd"
                  required
                  ref="pwd"
                  :rules="[() => !!registerInfo.pwd || '请输入密码']"
                ></v-text-field>
              </v-flex>
            </v-flex>
          </v-layout>
        </v-container>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn flat color="primary" @click="register = false">取消</v-btn>
          <v-btn flat @click="registerSubmit">注册</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!--提示信息-->
    <v-alert
      style="width: 100%;position: absolute;z-index: 999;top:20%;"
      type="success"
      :value="loginSuccess"
      transition="scale-transition"
    >
      登录成功.
    </v-alert>
    <v-alert
      style="width: 100%;position: absolute;z-index: 999;top:20%;"
      type="success"
      :value="logoutSuccess"
      transition="scale-transition"
    >
      注销成功.
    </v-alert>
    <v-alert
      style="width: 100%;position: absolute;z-index: 999;top:20%;"
      type="success"
      :value="registerSuccess"
      transition="scale-transition"
    >
      注册成功.
    </v-alert>
    <v-alert
      style="width: 100%;position: absolute;z-index: 999;top:20%;"
      type="warning"
      :value="registerWarning"
      transition="scale-transition"
    >
      该用户已存在.
    </v-alert>
    <v-progress-circular style="position: absolute;z-index: 10;left: 43%;top: 48%;" indeterminate :size="50" color="primary" v-show="loading"></v-progress-circular>
  </v-app>
</template>

<script>
export default {
  data: () => ({
    date: null,
    menu0: false,
    modal: false,
    loading: false,
    addContent: false,
    login: false,
    register: false,
    loginSuccess: false,
    registerSuccess: false,
    loginWarning: false,
    logoutSuccess: false,
    registerWarning: false,
    drawer: null,
    user: '',
    userInfo: {
      name: '',
      pwd: ''
    },
    registerInfo: {
      name: '',
      pwd: ''
    },
    list: [],
    loginFormHasErrors: false,
    registerFormHasErrors: false,
    searchKeys: []
  }),
  props: {
    source: String
  },
  computed: {
    loginForm () {
      return {
        name: this.userInfo.name,
        pwd: this.userInfo.pwd
      }
    },
    registerForm () {
      return {
        name: this.registerInfo.name,
        pwd: this.registerInfo.pwd
      }
    }
  },
  methods: {
    ifLogin (status) {
      if (status) {
        this.login = true
      }
    },
    registerDialg () {
      this.login = false
      this.register = true
    },
    loginSubmit () {
      this.loginFormHasErrors = false

      Object.keys(this.loginForm).forEach(f => {
        if (!this.loginForm[f]) {
          this.loginFormHasErrors = true
          this.$refs[f].validate(true)
        }
      })
      if (!this.loginFormHasErrors) {
        this.$axios.post(this.HOST + '/users/login', this.userInfo).then(response => {
          localStorage.setItem('name', response.data.user)
          this.loading = true
          this.login = false
          setTimeout(() => {
            this.loading = false
            this.loginSuccess = true
            setTimeout(() => {
              this.loginSuccess = false
              this.user = localStorage.getItem('name')
            }, 1200)
          }, 1000)
        })
          .catch(error => {
            console.log(error)
          })
      }
    },
    registerSubmit () {
      this.registerFormHasErrors = false

      Object.keys(this.registerForm).forEach(f => {
        if (!this.registerForm[f]) {
          this.registerFormHasErrors = true
          this.$refs[f].validate(true)
        }
      })
      if (!this.registerFormHasErrors) {
        this.$axios.post(this.HOST + '/users/register', this.registerInfo).then(response => {
          if (response.data === '该用户已存在') {
            this.registerWarning = true
            setTimeout(() => {
              this.registerWarning = false
            }, 1200)
          } else {
            this.loading = true
            this.register = false
            setTimeout(() => {
              this.loading = false
              this.registerSuccess = true
              setTimeout(() => {
                this.registerSuccess = false
                this.login = true
              }, 1200)
            }, 1000)
          }
        })
          .catch(error => {
            console.log(error)
          })
      }
    },
    logout () {
      this.loading = true
      setTimeout(() => {
        this.loading = false
        this.logoutSuccess = true
        setTimeout(() => {
          this.logoutSuccess = false
          this.user = ''
          localStorage.clear()
        }, 1200)
      }, 1000)
    }
  },
  mounted: function () {
    this.$nextTick(function () {
      if (localStorage.getItem('name') !== null) {
        this.user = localStorage.getItem('name')
      }
    })
  }
}
</script>
