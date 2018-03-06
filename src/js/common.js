export default {
  install (Vue, options) {
    // 检索查找数据
    Vue.prototype.handleSearchPublic = function (historyData, searchConName1, dataCount, pageSize, dataA) {
      // this.historyData = this.data9
      this.historyData = this.search(this.searchConName1)
      this.dataCount = this.historyData.length
      if (this.historyData.length > this.pageSize) {
        this.historyData = this.dataA.slice(0, this.pageSize)
      }
    }
    Vue.prototype.search = function (search) {
      if (search) {
        return this.dataA.filter(function (dataA) {
          return Object.keys(dataA).some(function (key) {
            return String(dataA[key]).indexOf(search) > -1
          })
        })
      }
      return this.dataA
    }
    // 分页
    Vue.prototype.changepagePublic = function (index, pageSize, historyData, dataA) {
      var _start = (index - 1) * this.pageSize
      var _end = index * this.pageSize
      this.historyData = this.dataA.slice(_start, _end)
    }
    // 获取历史记录信息,分页第一页
    Vue.prototype.handleListPublic = function (dataCount, dataA, pageSize, historyData) {
      // 保存取到的所有数据
      this.dataCount = this.dataA.length
      // 初始化显示，小于每页显示条数，全显，大于每页显示条数，取前每页条数显示
      if (this.dataA.length < this.pageSize) {
        this.historyData = this.dataA
      } else {
        this.historyData = this.dataA.slice(0, this.pageSize)
      }
    }
    // 时间格式化
    Vue.prototype.toformatDate = function (time, format) {
      let date = new Date(time)
      return this.formatDate(date, format)
    }
    // 时间格式化具体操作
    Vue.prototype.formatDate = function (date, fmt) {
      if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(
          RegExp.$1,
          (date.getFullYear() + '').substr(4 - RegExp.$1.length)
        )
      }
      let o = {
        'M+': date.getMonth() + 1,
        'd+': date.getDate(),
        'h+': date.getHours(),
        'm+': date.getMinutes(),
        's+': date.getSeconds()
      }
      for (let k in o) {
        let str = o[k] + ''
        if (new RegExp(`(${k})`).test(fmt)) {
          fmt = fmt.replace(
            RegExp.$1,
            RegExp.$1.length === 1 ? str : this.padLeftZero(str)
          )
        }
      }
      return fmt
    }
    // 时间格式化拼接 '00'
    Vue.prototype.padLeftZero = function (str) {
      return ('00' + str).substr(str.length)
    }
  }
}
