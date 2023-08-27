<template>
	<view class="container">
		<u-toast ref="uToast"></u-toast>
		<view class="brand">
			<view class="logo">
				<u--image :showLoading="true" radius="80" src="https://www.uviewui.com/common/logo.png" width="80px"
					height="80px">
				</u--image>
			</view>
			<view class="content">
				<view class="title">超级服务商助手</view>
				<view class="small">进件、注册、工商一键搞定</view>
			</view>
		</view>
		<view class="form">
			<view class="tips">
				<view class="text">登录后享受更多精彩内容</view>
			</view>
			<view class="btn-group">
				<view class="btn">
					<u-button @click="doLogin" color="linear-gradient(180deg, #2b85e4 0%, #2b85e4 100%)" shape="circle"
						text="立即授权登录"></u-button>
				</view>
				<view class="btn" v-on:click="onBackPage">
					<u-button shape="circle" text="暂不登录"></u-button>
				</view>
			</view>
		</view>
		<!-- 登录授权 -->
		<view class="modal">
			<u-popup :round="10" :show="is_popup" :closeable="true">
				<form @submit="formSubmit" catchreset="formReset">
					<view class="user">
						<view class="header">
							<view class="left">
								<view class="logo">
									<u--image radius="24" :showLoading="true"
										src="https://www.uviewui.com/common/logo.png" width="24px" height="24px">
									</u--image>
								</view>
								<view class="title">超级服务商助手</view>
							</view>
						</view>
						<view class="remarks">
							<view class="title">设置您的头像、昵称</view>
							<view class="desc">用于展示用户信息</view>
						</view>
						<view class="info">
							<u-cell-group>
								<u-cell title="头像" :isLink="true">
									<view slot="value">
										<button class="btn-normal" open-type="chooseAvatar">
											<!-- 如果有头像图片显示这个image，否则显示下面文字 -->
											<image style="width: 81rpx; height: 81rpx;" class="avatar-default"></image>
											<view class="placeholder">点此设置微信头像</view>
										</button>
									</view>
								</u-cell>
								<u-cell title="昵称" :isLink="true">
									<view slot="value">
										<input placeholder-class="placeholder" style="text-align: right;"
											type="nickname" name="nickname" placeholder="点此输入微信昵称" />
									</view>
								</u-cell>
							</u-cell-group>
						</view>
						<view class="start">
							<view class="btn refuse">
								<u-button throttleTime="3" color="#f4f4f5" text="拒绝"></u-button>
							</view>
							<view class="btn">
								<button style="margin: 0 0;background-color: #19be6b;" type="primary"
									formType="submit">确认</button>
							</view>
						</view>
					</view>
				</form>
			</u-popup>
		</view>
		<!-- 版权说明 -->
		<view class="copyright">
			<view class="text">© 2019-2023 Copyright 贵州猿创科技</view>
			<view class="text link"><span class="a">《用户服务协议》</span>与<span class="a">《隐私政策》</span></view>
		</view>
	</view>
</template>

<script>
	// 授权登录流程：点击授权登录 - 获取用户code换取用户信息（登录），然后弹窗补充头像和昵称，确认更新用户信息
	export default {
		data() {
			return {
				is_popup: true
			};
		}
	}
</script>

<style lang="scss">
	page {
		background-color: #fff;
	}

	.modal {
		.user {
			width: 86%;
			margin: 0 auto;
			padding: 30rpx 0rpx;

			.info {
				.placeholder {
					color: red;
					font-size: 28rpx;
				}

				.u-cell__body {
					padding: 30rpx !important;
				}
			}

			.start {
				display: flex;
				flex-direction: row;
				justify-content: center;
				margin-top: 50rpx;

				.btn {
					width: 40%;
					margin: 0rpx 15rpx;

					.u-button {
						height: 92rpx;
					}
				}

				.refuse {
					.u-button {
						color: #19be6b !important;
					}
				}
			}

			.remarks {
				margin: 50rpx 0rpx;

				.title {
					font-size: 32rpx;
					font-weight: bold;
				}

				.desc {
					color: #909399;
					margin-top: 15rpx;
				}
			}

			.header {
				display: flex;
				flex-direction: row;
				justify-content: space-between;

				.left {
					display: flex;
					flex-direction: row;
					align-items: center;

					.title {
						margin-left: 15rpx;
						color: #303133;
					}
				}
			}
		}
	}

	.brand {
		display: flex;
		flex-direction: column;
		align-items: center;
		margin-top: 320rpx;

		.content {
			display: flex;
			flex-direction: column;
			align-items: center;

			.title {
				font-size: 42rpx;
				font-weight: bolder;
				margin: 30rpx 0rpx;
				color: #303133;
			}

			.small {
				font-size: 28rpx;
				color: #bababa;
			}
		}
	}


	.form {
		width: 80%;
		margin: 30rpx auto;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;

		.tips {
			margin: 30rpx 0rpx;
			color: #909399;
			font-size: 24rpx;
		}

		.btn-group {
			width: 100%;

			.btn {
				margin-bottom: 15rpx;

				.u-button {
					height: 100rpx;
				}
			}
		}
	}

	/* 版权 */
	.copyright {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		margin-top: 30rpx;

		.text {
			font-size: 20rpx;
			color: #bababa;
		}

		.link {
			margin-top: 30rpx;

			.a {
				color: blue;
			}
		}
	}
</style>