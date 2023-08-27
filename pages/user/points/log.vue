<template>
	<view class="container">
		<view class="lists" v-if="order.length > 0">
			<view class="item" v-for="(item, index) in order" :key="index">
				<view class="left">
					<view class="top">{{ item.describe }}</view>
					<view class="bottom">{{ item.create_time }}</view>
				</view>
				<view class="right">
					<view class="top">{{ item.value }}</view>
					<view :class="item.value > 0 ? 'bottom success' : 'bottom error'">
						{{ item.value > 0?'收入':'支出' }}
					</view>
				</view>
			</view>
		</view>
		<view class="lists" v-else>
			<u-empty text="暂无充值记录" mode="data" icon="http://cdn.uviewui.com/uview/empty/data.png"></u-empty>
		</view>
	</view>
</template>

<script>
	import {
		points
	} from '@/api/recharge.js';
	export default {
		data() {
			return {
				order: [],
				page: 1,
				is_reach: false,
				status: -1,
				tabs: [{
						name: '全部',
						value: -1
					},
					{
						name: '未支付',

						value: 10
					},
					{
						name: '已支付',

						value: 20
					}
				]
			};
		},
		onShow() {
			let _this = this
			_this.getLog()
		},
		onReachBottom() {
			let _this = this
			_this.is_reach = true
			_this.page = _this.page + 1
			_this.getLog()
		},
		methods: {
			onClickTabs(e) {
				this.status = e.value;
				this.getLog();
			},
			getLog() {
				let _this = this
				points({
						page: _this.page,
						status: _this.status
					})
					.then(res => {
						if (_this.is_reach) {
							_this.order = [...this.order, ...res.data.list.data]
						} else {
							_this.order = res.data.list.data
						}
						_this.is_reach = false
					})
					.catch(err => {});
			}
		}
	};
</script>

<style lang="scss">
	.lists {
		.item {
			display: flex;
			flex-direction: row;
			justify-content: space-between;
			padding: 36rpx;
			border-bottom: 1rpx solid #383A41;

			.left {
				.top {
					font-size: 32rpx;
					font-weight: bolder;
					color: #f4f4f4;
					margin-bottom: 15rpx;
				}

				.bottom {
					font-size: 24rpx;
					color: #999999;
				}
			}

			.right {
				text-align: center;

				.top {
					color: #f4f4f4;
					font-weight: bolder;
					font-size: 32rpx;
					margin-bottom: 15rpx;
				}

				.bottom {
					font-size: 24rpx;
				}

				.success {
					color: #3b75fa;
				}

				.error {
					color: #f24e52;
				}
			}
		}
	}
</style>