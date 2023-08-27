// 此vm参数为页面的实例，可以通过它引用vuex中的变量
import siteinfo from "../siteinfo.js"

function getUrlParam(name, url) {
	let u = arguments[1] || window.location.href,
		reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"),
		r = u.substr(u.indexOf("?") + 1).match(reg);
	return r != null ? decodeURI(r[2]) : "";
};
module.exports = (vm) => {
	// 初始化请求配置
	uni.$u.http.setConfig((config) => {
		config.timeout = 600000;
		/* config 为默认全局配置*/
		config.baseURL = siteinfo.siteroot; /* 根域名 */
		config.wxapp_id = siteinfo.uniacid
		return config
	})
	// 请求拦截
	uni.$u.http.interceptors.request.use((config) => { // 可使用async await 做异步操作
		// 初始化请求拦截器时，会执行此方法，此时data为undefined，赋予默认{}
		config.data = config.data || {}
		// 根据custom参数中配置的是否需要token，添加对应的请求头
		// if(config?.custom?.auth) {
		// 	// 可以在此通过vm引用vuex中的变量，具体值在vm.$store.state中
		// 	config.header.token = vm.$store.state.userInfo.token
		// } 4b8d960127513c9a6cab863d5237d070
		// const token = '3c8fcc9158fc0fe20c4d3f10aae5aefd';
		const token = uni.getStorageSync('token');
		// const user_id = getUrlParam('user');
		// const token = user_id == 100 ? '16e454f9a106310127fa881076837d8f' : '5eeb0154076f65a04c5c8a38a095957e';
		config.header.token = token;
		config.url = config.url + "&wxapp_id=" + uni.$u.http.config.wxapp_id + "&token=" + token
		return config
	}, config => { // 可使用async await 做异步操作
		return Promise.reject(config)
	})

	// 响应拦截
	uni.$u.http.interceptors.response.use((response) => {
		/* 对响应成功做点什么 可使用async await 做异步操作*/
		const data = response.data
		// 自定义参数
		const custom = response.config?.custom
		let pages = getCurrentPages()
		if (data.code !== 1) {
			uni.$u.toast(data.msg)
			// 如果没有显式定义custom的toast参数为false的话，默认对报错进行toast弹出提示
			if (custom.toast !== false) {
				return data.data === undefined ? {} : data
			}
			// 如果需要catch返回，则进行reject
			if (custom?.catch) {
				return Promise.reject(data)
			} else {
				// 否则返回一个pending中的promise，请求不会进入catch中
				return new Promise(() => {})
			}
		}
		return data.data === undefined ? {} : data
	}, (response) => {
		// 对响应错误做点什么 （statusCode !== 200）
		return Promise.reject(response)
	})
}