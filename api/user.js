const http = uni.$u.http
// 用户登录
export const login = (data) => http.post('user/login', data)
// 用户信息
export const detail = (data) => http.get('user/detail', {
	params: data
})
export const exchange = (data) => http.post('user/exchange', data)
// 更新用户信息
export const modify = (data) => http.post('user/modify', data)