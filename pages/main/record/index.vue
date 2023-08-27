<template>
	<view class="container">
		<view class="navbar">
			<u-navbar leftIconColor="#fff" bgColor="#2B2D30" :placeholder="true" :titleStyle="{color:'#fff'}"
				title="创作记录" :autoBack="true">
			</u-navbar>
		</view>
		<view class="qrcode">
			<view class="item" @click="onPreviewQrcode(item.image_url)" v-for="(item,index) in qrcode">
				<view class="image">
					<u--image :showLoading="true" :src="item.image_url" width="320rpx" height="320rpx"></u--image>
				</view>
				<view class="date">{{ item.create_time }}</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		record
	} from "@/api/qrcode.js"
	export default {
		data() {
			return {
				qrcode: [],
				is_reach: false,
				page: 1
			};
		},
		onShow() {
			this.getRecord()
		},
		onReachBottom() {
			let _this = this
			_this.is_reach = true
			_this.page = _this.page + 1
			_this.getRecord()
		},
		methods: {
			onPreviewQrcode(url) {
				let _this = this
				uni.previewImage({
					urls: [url]
				})
			},
			getRecord() {
				let _this = this
				record({
					page: _this.page
				}).then(res => {
					if (_this.is_reach) {
						_this.qrcode = [..._this.qrcode, ...res.data.record.data]
					} else {
						_this.qrcode = res.data.record.data
					}
					_this.is_reach = false
				}).catch(err => {

				})
			}
		}
	}
</script>

<style lang="scss">
	.qrcode {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		flex-wrap: wrap;
		width: 90%;
		margin: 0 auto;

		.item {
			margin: 15rpx 0rpx;
			border-radius: 10rpx !important;
			overflow: hidden;

			.date {
				font-size: 24rpx;
				background-color: #fff;
				color: #303133;
				padding: 15rpx;
			}
		}
	}
</style>