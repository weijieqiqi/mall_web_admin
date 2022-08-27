import axios from 'axios'
import { Message, MessageBox } from 'element-ui'
import store from '../store'
import { getToken } from '@/utils/auth'

// 创建axios实例,可以发送ajax请求，请求后端
const service = axios.create({
  baseURL: process.env.BASE_API, // api的base_url设置服务器的端口 BASE_API: '"http://localhost:8099"' 后端开发的服务器地址
  timeout: 15000, // 请求超时时间15s
  withCredentials:true   // 设置请求携带cookie  保证session有效性
})


// request拦截器 每次请求都会经过
service.interceptors.request.use(config => {
  if (store.getters.token) { 
    config.headers['Authorization'] = getToken() // 让每个请求携带自定义token 请根据实际情况自行修改
  }
  return config
}, error => {
  // Do something with request error
  console.log(error) // for debug
  Promise.reject(error)
})

// respone拦截器 每次ajax请求都会经过 
service.interceptors.response.use(
  response => {
  /**
  * code为非200是抛错 可结合自己业务进行修改
  */
    const res = response.data
    if (res.code !== 200) { 

      // 401:未登录;
      if (res.code === 401) {
        MessageBox.confirm('你已被登出，可以取消继续留在该页面，或者重新登录', '确定登出', {
          confirmButtonText: '重新登录',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          store.dispatch('FedLogOut').then(() => {
            location.reload()// 为了重新实例化vue-router对象 避免bug
          })
        })
        return res;
      } 
      else if (res.code === 403) {
        Message({
          message: res.message,
          type: 'warning',
          duration: 3 * 1000
        })
        return res;
      }
      Message({
        message: res.message,
        type: 'error',
        duration: 3 * 1000
      })
      return Promise.reject(res.message)
    } else {
      return response.data
    }
  },
  error => {
    console.log('err' + error)// for debug
    Message({
      message: error.message,
      type: 'error',
      duration: 3 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
