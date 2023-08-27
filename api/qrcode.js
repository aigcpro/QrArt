const http = uni.$u.http
// 获取二维码模板
export const QrTemplate = (data) => http.get('template/items', {
	params: data
})
// 创建艺术二维码
export const created = (data) => http.post('template/create', data)
// 获取已创建的二维码
export const record = (data) => http.get('template/record', {
	params: data
})