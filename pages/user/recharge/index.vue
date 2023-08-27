<template>
	<view class="container">
		<block v-if="platform == 'ios' && store.is_ios_pay == 20">
			<u-empty text="由于IOS规范,当前功能暂不可用~!" mode="permission"
				icon="http://cdn.uviewui.com/uview/empty/permission.png">
			</u-empty>
		</block>
		<block v-else>
			<view class="header" v-if="store.is_recharge == 20">
				<view class="left">
					<view class="text" v-if="user.user_id">创作点数</view>
					<view class="number">
						<view v-if="user.user_id">{{ user.points }}点</view>
					</view>
				</view>
				<view class="right" @click="onClickLog">
					<u-button text="收支明细" size="small"></u-button>
				</view>
			</view>
			<view class="block" v-if="store.is_recharge == 20">
				<view class="tool">
					<view class="head">
						<view class="icon">
							<u-icon size="22"
								name="https://img.alicdn.com/imgextra/i1/2064565174/O1CN01Z6GJ1C1o5k0eRhIfh_!!2064565174.png">
							</u-icon>
						</view>
						<view class="title">会员套餐</view>
					</view>
					<view class="plan">
						<view class="item" :class="active == index ? 'active' : ''" @click="onClickPlan(index)"
							v-for="(item, index) in plan" :key="index">
							<view class="badge" v-if="index == 0">
								<u-badge shape="horn" value="推荐"></u-badge>
							</view>
							<view class="number">{{ item.gift_money }}点</view>
							<view class="price">￥{{ item.money }}</view>
							<view class="price plan_name">{{ item.plan_name }}</view>
						</view>
					</view>
					<view class="submit" @click="onSubmit">
						<u-button text="立即支付" color="#5286FE" shape="circle"></u-button>
					</view>
				</view>
			</view>
			<view class="block" v-if="store.is_recharge == 20">
				<view class="tool">
					<view class="head">
						<view class="icon">
							<u-icon size="22"
								name="https://img.alicdn.com/imgextra/i1/2064565174/O1CN01HBe82n1o5k0cuW3LP_!!2064565174.png">
							</u-icon>
						</view>
						<view class="title">充值说明</view>
					</view>
					<view class="remarks">
						<view class="content">
							<rich-text :nodes="setting.describe"></rich-text>
						</view>
					</view>
				</view>
			</view>
		</block>
	</view>
</template>

<script>
	import siteinfo from '@/siteinfo.js';
	import {
		plan,
		submit
	} from '@/api/recharge.js';
	import {
		config
	} from '@/api/system.js';
	export default {
		data() {
			return {
				active: 0,
				plan: [],
				user: [],
				setting: {},
				store: {},
				platform: '',
				epay: {},
				child_count: 0,
				other: {}
			};
		},
		onLoad() {
			this.getConfig();
		},
		onShow() {
			this.getPlan();
		},
		methods: {
			getConfig() {
				let _this = this;
				config({
					key: 'store'
				}).then(res => {
					this.store = res.data.config
					let port = uni.getSystemInfoSync().platform
					switch (port) {
						case 'android':
							console.log('运行Android上', port); //android
							this.platform = 'android'
							break;
						case 'ios':
							console.log('运行iOS上', port);
							this.platform = 'ios'
							if (_this.store.is_ios_pay == 10) {
								// #ifdef MP-WEIXIN
								uni.setNavigationBarTitle({
									title: 'IOS端暂不支持'
								})
								// #endif
							}
							break;
						default:
							console.log('运行在开发者工具上'); //devtools
							this.platform = 'devtools'
							break;
					}
				}).catch(err => {

				})
			},
			onClickLog() {
				uni.navigateTo({
					url: '/pages/user/points/log'
				})
			},
			onSubmit() {
				let _this = this;
				submit({
						platform: 30,
						planId: _this.plan[_this.active].plan_id
					})
					.then(res => {
						let payment = res.data.payment;
						uni.requestPayment({
							provider: 'wxpay',
							timeStamp: payment.timeStamp,
							nonceStr: payment.nonceStr,
							package: 'prepay_id=' + payment.prepay_id,
							signType: 'MD5',
							paySign: payment.paySign,
							success: function(res) {
								uni.showToast({
									icon: 'none',
									title: '支付成功'
								});
								_this.getPlan();
								console.log('success:' + JSON.stringify(res));
							},
							fail: function(err) {
								console.log('fail:' + JSON.stringify(err));
							}
						});
					})
					.catch(err => {
						console.log(err);
					});
			},
			getPlan() {
				plan({})
					.then(res => {
						this.plan = res.data.planList;
						this.user = res.data.userInfo;
						this.setting = res.data.setting;
						let describe = this.setting.describe;
						this.setting.describe = describe.replace(/\n/g, '<br />');
					})
					.catch(err => {});
			},
			onClickPlan(index) {
				this.active = index;
			}
		}
	};
</script>

<style lang="scss">
	rich-text {
		font-size: 24rpx;
		color: #f4f4f5;
		line-height: 64rpx;
	}

	.block {
		width: 100%;
		background-color: #2B2D30;
		position: relative;
		top: -50rpx;
		left: 0rpx;
		border-radius: 30rpx 30rpx 0rpx 0rpx;

		.tool {
			margin-bottom: 15rpx;

			.share {
				display: flex;
				flex-direction: column;

				.item {
					display: flex;
					flex-direction: row;
					justify-content: space-between;
					align-items: center;
					margin-top: 30rpx;
					border: 1rpx solid #f4f4f5;
					border-radius: 10rpx;
					padding: 15rpx;

					.icon {
						width: 15%;
					}

					.btn {
						width: 25%;
					}

					.content {
						width: 60%;

						.title {
							font-weight: bolder;
							font-size: 32rpx;
						}

						.desc {
							color: #82848a;
							font-weight: bolder;
							margin: 10rpx 0rpx;
							font-size: 24rpx;
						}

						.speed {
							color: #3975FB;
						}
					}
				}
			}

			.remarks {
				margin-top: 15rpx;
			}

			.submit {
				margin-top: 30rpx;
			}

			padding: 30rpx;

			.head {
				display: flex;
				flex-direction: row;

				.title {
					font-size: 32rpx;
					color: #f4f4f5;
					margin-left: 15rpx;
				}
			}

			.plan {
				display: flex;
				flex-direction: row;
				flex-wrap: wrap;
				justify-content: space-between;
				margin-top: 30rpx;

				.item {
					width: 30%;
					border: 2rpx solid #d8d8d8;
					text-align: center;
					margin: 15rpx 0rpx;
					padding: 20rpx 0rpx;
					border-radius: 12rpx;
					position: relative;

					.badge {
						position: absolute;
						right: -20rpx;
						top: -15rpx;
					}

					.number {
						color: #3b75fa;
						font-size: 36rpx;
						font-weight: bolder;
					}

					.price {
						color: #fa3534;
						font-size: 28rpx;
						margin-top: 15rpx;
					}

					.plan_name {
						color: #666666;
						font-weight: bolder;
					}
				}

				.active {
					border: 2rpx solid #5286fe !important;
				}
			}
		}
	}

	.header {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		padding: 80rpx 40rpx;
		z-index: 999;
		position: relative;

		.left {
			color: #fff;
			display: flex;
			flex-direction: column;
			align-items: flex-start;

			.text {
				font-size: 32rpx;
				margin-bottom: 15rpx;
			}

			.number {
				font-size: 48rpx;
				font-weight: bolder;
			}
		}

		.right {
			.u-button {
				border-radius: 40rpx !important;
			}

			.u-button__text {
				color: #5968f9 !important;
			}
		}
	}
</style>