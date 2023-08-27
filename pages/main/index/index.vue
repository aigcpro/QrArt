<template>
	<view class="container">
		<u-toast ref="uToast"></u-toast>
		<!-- navbar -->
		<view class="navbar">
			<!-- 2.0.19支持autoBack，默认为false -->
			<u-navbar @leftClick="is_user_show = true" bgColor="#2B2D30" :placeholder="true"
				:titleStyle="{color:'#fff'}" :title="system.name" :autoBack="false">
				<view class="u-nav-slot" slot="left">
					<u-icon color="#fff" name="list-dot" size="28"></u-icon>
				</view>
			</u-navbar>
		</view>
		<view class="ad" v-if="spool.banner.status == 20">
			<ad :unit-id="spool.banner.id"></ad>
		</view>
		<!-- 系统公告 -->
		<view class="notice" v-if="system">
			<u-notice-bar bgColor="#2B2D30" mode="closable" :text="system.notice"></u-notice-bar>
		</view>
		<!-- 绘制面板 -->
		<view class="panel">
			<view class="item">
				<view class="title">创作类型</view>
				<view class="tabs">
					<u-subsection @change="onChangeSub" inactiveColor="#fff" mode="subsection" :list="list"
						:current="sub_index"></u-subsection>
				</view>
			</view>
			<view class="item">
				<view class="title">二维码内容（上传你的二维码）</view>
				<view class="fill-qrcode">
					<view class="pic-mode" v-if="sub_index == 0">
						<u-upload uploadIconColor="#c8c9cc" :fileList="cover" @afterRead="afterRead" @delete="deletePic"
							name="cover" :multiple="false" :maxCount="1"></u-upload>
					</view>
					<view class="text-mode" v-if="sub_index == 1">
						<u--textarea v-model="qr_content" maxlength="-1"
							placeholder="请输入二维码内容, 内容越简洁效果越好"></u--textarea>
					</view>
				</view>
			</view>
			<!-- 创作模式 -->
			<view class="item">
				<view class="title">创作模式</view>
				<view class="radio-group">
					<u-radio-group @change="onGroupChange" v-model="mode" placement="row">
						<u-radio :customStyle="{marginRight: '15px'}" label="高级引擎" name="10">
						</u-radio>
						<u-radio label="自定义引擎" name="20">
						</u-radio>
					</u-radio-group>
				</view>
			</view>
			<!-- 自定义提示词 -->
			<view class="item" v-if="mode == '20'">
				<view class="title">提示词</view>
				<view class="prompt">
					<u--textarea v-model="prompt" maxlength="-1" placeholder="请输入二维码内容, 内容越简洁效果越好"></u--textarea>
				</view>
			</view>
			<!-- 艺术度 --iw 0.3 -->
			<view class="item">
				<view class="title">艺术度（推荐0.2~0.4,兼顾艺术和扫码率）</view>
				<view class="art-box">
					<view class="i slider">
						<slider block-size="18" activeColor="#2b85e4" min="0" max="100" v-model="slider" @change="onSliderChange" />
					</view>
					<view class="i">
						<u-number-box v-model="art_value" color="#2B2D30" min="0" max="1" step="0.1"></u-number-box>
					</view>
				</view>
			</view>
			<!-- 二维码款式 -->
			<view class="item" v-if="mode == '10'">
				<view class="title">二维码风格</view>
				<view class="style-qrcode">
					<view @click="onStyle(index)" :class="active == index?'active':''" class="pic"
						v-for="(item,index) in qr_template" :key="index">
						<view class="img">
							<u--image radius="5" :showLoading="true"
								:src="item.image?item.image.file_path:item.preview_img" width="130rpx"
								height="130rpx"></u--image>
						</view>
						<view class="bottom">
							<view class="txt">{{ item.name }}</view>
							<view class="num"></view>
						</view>
					</view>
				</view>
			</view>
			<!-- 版本选择 -->
			<view class="item" v-if="mode == 20">
				<view class="title">版本选择</view>
				<view class="radio-group">
					<u-radio-group @change="onGroupChangeVersion" v-model="version" placement="row">
						<u-radio :customStyle="{marginRight: '15px'}" label="v2" name="10">
						</u-radio>
						<u-radio :customStyle="{marginRight: '15px'}" label="v1.1" name="20">
						</u-radio>
						<u-radio :customStyle="{marginRight: '15px'}" label="v1" name="30">
						</u-radio>
					</u-radio-group>
				</view>
			</view>
			<!-- 模型选择 -->
			<view class="item" v-if="mode == 20">
				<view class="title">模型选择</view>
				<view class="style-qrcode">
					<view @click="model_enum_index = index" :class="model_enum_index == index?'active':''" class="pic"
						v-for="(item,index) in model_enum" :key="index">
						<view class="img">
							<u--image radius="5" :showLoading="true" :src="item.icon" width="130rpx"
								height="130rpx"></u--image>
						</view>
						<view class="bottom">
							<view class="txt">{{ item.title }}</view>
							<view class="num"></view>
						</view>
					</view>
				</view>
			</view>
			<!-- 已完成  -->
			<view class="item" v-if="finish.file_path">
				<view class="title">创作结果（点击预览 - 长按保存）</view>
				<view class="qrcode_image">
					<u--image radius="5" :showLoading="true" :src="finish.file_path" width="320rpx" height="320rpx"
						@click="onPreviewQrcode"></u--image>
				</view>
			</view>
		</view>
		<!-- 创作按钮 -->
		<view class="bottom-action">
			<!-- 如果未登录状态显示登录按钮 -->
			<view class="submit" v-if="user.user_id && user.avatarUrl">
				<u-button :disabled="qr_content==''?true:false" :loading="is_finish" loadingText="创建中" @click="onSubmit"
					shape="circle" color="linear-gradient(to right, #2b85e4, #2137ff)"
					:text="'立即生成 （'+ (mode == 10?qr_template[active].points:(qr_template[active].points?qr_template[active].points:system.channel.pay_money))+'点）'"></u-button>
			</view>
			<view class="submit" v-else>
				<u-button @click="onSubmitLogin" shape="circle" color="linear-gradient(to right, #2b85e4, #2137ff)"
					text="立即登录"></u-button>
			</view>
			<button class="btn-normal" open-type="share"
				v-if="system.invite.give_points && system.invite.give_points > 0">
				<view class="reset">
					<view class="icon"><u-icon color="#fff" name="share"></u-icon></view>
					<view class="text">分享 +{{ system.invite.give_points }}</view>
				</view>
			</button>
			<view @click="onResetData" class="reset" v-else>
				<view class="icon"><u-icon color="#fff" name="reload"></u-icon></view>
				<view class="text">重置</view>
			</view>
		</view>
		<!-- 左侧个人中心 -->
		<view class="user" v-if="is_user_show">
			<u-popup @close="onPopupClose" @open="onPopupOpen" :closeOnClickOverlay="true" duration="500"
				bgColor="#383A41" mode="left" :show="is_user_show">
				<view class="box">
					<view class="user" @click="onViewID">
						<view class="avatar">
							<u--image v-if="user.user_id" :showLoading="true"
								:src="user.avatarUrl?user.avatarUrl:system.logo_path" height="100rpx" width="100rpx"
								shape="circle"></u--image>
							<u--image v-else :showLoading="true" :src="system.logo_path" width="100rpx" height="100rpx"
								shape="circle"></u--image>
						</view>
						<view class="nickname" v-if="user.user_id && user.nickName">{{ user.nickName }}</view>
						<view class="nickname" v-else>{{ system.name }}</view>
						<view class="balance" v-if="user.user_id">
							点数：{{ user.points }}
						</view>
						<view class="balance" v-else>
							当前状态未登录
						</view>
					</view>
					<view class="menu">
						<view class="item" @click="onRecharge" v-if="system.is_recharge == 20">
							<view class="left">
								<view class="icon">
									<u-icon color="#f4f4f5" size="24" name="coupon"></u-icon>
								</view>
								<view class="title">快速充值</view>
							</view>
							<view class="right">
								<u-icon name="arrow-right"></u-icon>
							</view>
						</view>
						<view class="item" @click="onPaymentLog">
							<view class="left">
								<view class="icon">
									<u-icon color="#f4f4f5" size="24" name="tags"></u-icon>
								</view>
								<view class="title">收支明细</view>
							</view>
							<view class="right">
								<u-icon name="arrow-right"></u-icon>
							</view>
						</view>
						<view class="item" @click="onRecord">
							<view class="left">
								<view class="icon">
									<u-icon color="#f4f4f5" size="24" name="order"></u-icon>
								</view>
								<view class="title">创作记录</view>
							</view>
							<view class="right">
								<u-icon name="arrow-right"></u-icon>
							</view>
						</view>
						<view class="item" @click="is_exchange = true;is_user_show = false">
							<view class="left">
								<view class="icon">
									<u-icon color="#f4f4f5" size="24" name="gift"></u-icon>
								</view>
								<view class="title">卡密兑换</view>
							</view>
							<view class="right">
								<u-icon name="arrow-right"></u-icon>
							</view>
						</view>
						<view class="item" @click="onCourse">
							<view class="left">
								<view class="icon">
									<u-icon color="#f4f4f5" size="24" name="info-circle"></u-icon>
								</view>
								<view class="title">创作教程</view>
							</view>
							<view class="right">
								<u-icon name="arrow-right"></u-icon>
							</view>
						</view>
						<view class="item" @click="onService" v-if="system.qy_service.qy_id">
							<view class="left">
								<view class="icon">
									<u-icon color="#f4f4f5" size="24" name="kefu-ermai"></u-icon>
								</view>
								<view class="title">在线客服</view>
							</view>
							<view class="right">
								<u-icon name="arrow-right"></u-icon>
							</view>
						</view>
					</view>
					<view class="service-qrcode" @click="onClickServiceQr">
						<view class="qrcode">
							<u--image :showLoading="true" :src="system.service_path" width="80px"
								height="80px"></u--image>
						</view>
						<view class="text">联系我们</view>
					</view>
				</view>
			</u-popup>
		</view>
		<!-- 弹窗兑换 -->
		<view class="mark">
			<u-overlay :show="is_exchange">
				<view class="overlay-warp">
					<view class="warp">
						<view class="close" v-on:click="doMask">
							<view class="icon">
								<u-icon size="20"
									name="https://img.alicdn.com/imgextra/i3/2064565174/O1CN0138dRin1o5k0oIYa3m_!!2064565174.png">
								</u-icon>
							</view>
						</view>
						<view class="input"><input v-model="cardNumber" @tap.stop placeholder="请输入卡密兑换" /></view>
						<view class="submit">
							<u-button @click="onExchange" color="#3975FB" shape="circle" text="立即兑换"></u-button>
						</view>
					</view>
				</view>
			</u-overlay>
		</view>
		<!-- 授权用户信息 -->
		<view class="modal">
			<u-popup :round="10" :show="is_popup" @close="onClosePopup" :closeable="true">
				<form @submit="formSubmit" catchreset="formReset">
					<view class="user">
						<view class="header">
							<view class="left">
								<view class="logo">
									<u--image radius="24" :showLoading="true" :src="system.logo_path" width="24px"
										height="24px">
									</u--image>
								</view>
								<view class="title">{{ system.name }}</view>
							</view>
						</view>
						<view class="remarks">
							<view class="title">设置您的头像、昵称</view>
							<view class="desc">用于展示用户信息</view>
						</view>
						<view class="info">
							<u-cell-group>
								<button @chooseavatar="onChooseAvatar" class="btn-normal" open-type="chooseAvatar">
									<u-cell title="头像" :isLink="true">
										<view slot="value">
											<!-- 如果有头像图片显示这个image，否则显示下面文字 -->
											<image v-if="avatar" :src="avatar" style="width: 81rpx; height: 81rpx;"
												class="avatar-default"></image>
											<image v-else-if="user.avatarUrl" :src="user.avatarUrl"
												style="width: 81rpx; height: 81rpx;" class="avatar-default"></image>
											<view v-else class="placeholder">点此设置微信头像</view>

										</view>
									</u-cell>
								</button>
								<u-cell title="昵称" :isLink="true">
									<view slot="value">
										<input placeholder-class="placeholder" style="text-align: right;"
											type="nickname" name="nickname" placeholder="点此输入微信昵称" />
									</view>
								</u-cell>
							</u-cell-group>
						</view>
						<view class="start">
							<view class="btn refuse" @click="onClosePopup">
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
		<!-- 底部广告 -->
		<view class="ad" v-if="spool.video.status == 20">
			<ad :unit-id="spool.video.id" ad-type="video" ad-theme="white"></ad>
		</view>
	</view>
</template>

<script>
	import {
		login,
		detail,
		exchange,
		modify
	} from "@/api/user.js"
	import {
		config,
		upload
	} from "@/api/system.js"
	import {
		QrTemplate,
		created
	} from "@/api/qrcode.js"
	import {
		insert,
		rewarded
	} from '@/utils/ad.js';
	import siteinfo from "@/siteinfo.js"
	import {
		version
	} from "vue";
	export default {
		data() {
			return {
				art_value: 0.3,
				version: '10',
				model_enum_index: 0,
				is_finish: false,
				finish: {},
				qr_content: "",
				prompt: "",
				active: 0,
				mode: '10',
				path: "",
				cardNumber: "",
				is_exchange: false,
				system: {},
				cover: [],
				sub_index: 0,
				qr_template: [],
				user: {},
				spool: {},
				is_user_show: false,
				share: {},
				list: ['二维码', '纯文本'],
				is_popup: false,
				avatar: '',
				nickname: '',
				slider: 30,
				model_enum: [{
						title: '卡通插画',
						value: 10,
						icon: 'https://cdn.mewx.art/images/static/model-67.jpg?imageView2/2/w/400/h/400/format/webp'
					},
					{
						title: '糖果头像',
						value: 10,
						icon: 'https://cdn.mewx.art/images/static/model-51.jpg?imageView2/2/w/400/h/400/format/webp'
					},
					{
						title: '水墨画',
						value: 10,
						icon: 'https://cdn.mewx.art/images/static/model-69.jpg?imageView2/2/w/400/h/400/format/webp'
					},
					{
						title: '美漫',
						value: 10,
						icon: 'https://cdn.mewx.art/images/static/model-70.jpg?imageView2/2/w/400/h/400/format/webp'
					}
				],
			};
		},
		onLoad(options) {
			if (options.referee_id) {
				uni.setStorageSync('referee_id', options.referee_id)
			}
			this.getConfig()
			this.getQrTemplate()
			this.getSpool()
			this.getShare()
			this.onLogin(false)
		},
		onShow() {
			this.getUser()
		},
		onShareTimeline() {
			let _this = this
			let referee_id = ''
			if (_this.user.user_id) {
				referee_id = _this.user.user_id
			}
			return {
				imageUrl: _this.share.cover,
				title: _this.share.title,
				path: '/pages/main/index/index?referee_id=' + referee_id
			}
		},
		onShareAppMessage() {
			let _this = this
			let referee_id = ''
			if (_this.user.user_id) {
				referee_id = _this.user.user_id
			}
			return {
				imageUrl: _this.share.cover,
				title: _this.share.title,
				desc: _this.share.desc,
				path: '/pages/main/index/index?referee_id=' + referee_id
			}
		},
		methods: {
			onSliderChange(event) {
				let value = event.detail.value
				if(value > 0){
					let number = value / 100
					this.art_value = number.toFixed(1);
				}else{
					this.art_value = 0
				}
			},
			onSubmitLogin() {
				this.onLogin(false)
				this.onClosePopup()
			},
			onViewID() {
				let _this = this
				if (!_this.user.user_id) {
					return false;
				}
				if (_this.user.user_id && !_this.user.avatarUrl) {
					_this.onClosePopup()
					return false;
				}
				uni.showToast({
					icon: 'none',
					title: 'ID：' + _this.user.user_id
				})
			},
			onClosePopup() {
				this.is_user_show = false
				this.is_popup = !this.is_popup
			},
			formSubmit(e) {
				this.nickname = e.detail.value.nickname;
				this.onModify();
			},
			onModify() {
				let _this = this;
				if (!this.avatar) {
					uni.showToast({
						icon: 'error',
						title: '头像不能为空'
					})
					return false;
				}
				if (!this.nickname) {
					uni.showToast({
						icon: 'error',
						title: '昵称不能为空'
					})
					return false;
				}
				this.is_popup = false;
				modify({
						avatar: this.avatar,
						nickname: this.nickname
					})
					.then(res => {
						if (res.code == 1) {
							_this.$refs.uToast.show({
								type: 'success',
								message: '更新成功~！'
							});
						}
						_this.getUser()
					})
					.catch(err => {});
			},
			onChooseAvatar(e) {
				this.avatar = e.detail.avatarUrl;
				this.UploadAvatar(this.avatar);
			},
			onClickServiceQr() {
				uni.previewImage({
					urls: [this.system.service_path]
				})
			},
			onPaymentLog() {
				this.is_user_show = false
				uni.navigateTo({
					url: '/pages/user/points/log'
				})
			},
			onRecharge() {
				this.is_user_show = false
				uni.navigateTo({
					url: '/pages/user/recharge/index'
				})
			},
			onResetData() {
				this.is_finish = false
				this.finish = {}
				this.qr_content = ""
				this.prompt = ""
				this.active = 0
				this.mode = '10'
				this.path = ""
				this.is_exchange = false
				this.cover = []
				this.sub_index = 0
				this.is_user_show = false
				this.$refs.uToast.show({
					type: 'success',
					message: '重置成功~！'
				})
			},
			getShare() {
				let _this = this
				config({
					key: 'share'
				}).then(res => {
					_this.share = res.data.config
				}).catch(err => {

				})
			},
			getSpool() {
				let _this = this
				config({
					key: 'spool'
				}).then(res => {
					_this.spool = res.data.config
					if (_this.spool.insert.status == 20) {
						insert.load(_this.spool.insert.id)
						insert.show()
					}
					if (_this.spool.reward.status == 20) {
						rewarded.load(_this.spool.reward.id, () => {
							console.log('回调提交')
							_this.onStart()
						})
					}
				}).catch(err => {

				})
			},
			onGroupChange(value) {
				if (value == 10) {
					this.version = '10';
					this.model_enum_index = 0;
					this.art_value = 0.3
					this.active = 0
					this.prompt = ""
				} else {
					this.active = -1
				}
			},
			onGroupChangeVersion(value) {
				this.version = value
			},
			onPreviewQrcode() {
				let _this = this
				uni.previewImage({
					urls: [_this.finish.file_path]
				})
			},
			onStyle(index) {
				this.active = index
			},
			deletePic() {
				this.cover = [];
				this.path = '';
			},
			async afterRead(event) {
				let _this = this
				if (!_this.user.user_id) {
					_this.onLogin(false)
					_this.$refs.uToast.show({
						type: 'success',
						message: '登录成功~！'
					})
					return false;
				}
				uni.getFileSystemManager().readFile({
					filePath: event.file.url,
					encoding: 'base64',
					success: res => {
						let base64 = 'data:image/jpeg;base64,' + res.data
						_this.qr_content = base64
					},
					fail: (e) => {
						console.log(e)
					}
				})
				this.cover = [{
					url: event.file.url
				}];
				// this.qr_content = ""
				// let lists = [].concat(event.file);
				// let result = await upload({
				// 	file: event.file.url
				// }).then(result => {
				// 	return result;
				// }).catch(err => {

				// })
				// if (event.name == 'cover') {
				// 	this.cover = [{
				// 		url: event.file.url
				// 	}];
				// 	this.qr_content = result.qr_content
				// 	this.path = result.file_path;
				// }
			},
			async UploadAvatar(file_path) {
				if (!this.user.user_id) {
					this.onLogin(false)
					this.$refs.uToast.show({
						type: 'success',
						message: '登录成功~！'
					})
					return false;
				}
				let result = await upload({
					file: file_path
				}).then(result => {
					return result;
				}).catch(err => {

				})
				this.avatar = result.file_path
			},
			onCourse() {
				uni.navigateTo({
					url: '/pages/study/article/detail?article_id=' + this.system.draw_course_id
				})
			},
			onService() {
				let _this = this
				wx.openCustomerServiceChat({
					extInfo: {
						url: _this.system.qy_service.kf_url
					},
					corpId: _this.system.qy_service.qy_id,
					success(res) {}
				});
			},
			onExchange() {
				let _this = this
				exchange({
					code: this.cardNumber
				}).then(res => {
					_this.is_exchange = false
					if (res.code != 1) {
						_this.$refs.uToast.show({
							type: 'error',
							message: res.msg,
						})
						return false
					}
					_this.$refs.uToast.show({
						type: 'success',
						message: res.msg,
					})
					_this.getUser()
				}).catch(err => {

				})
				_this.cardNumber = ""
			},
			doMask() {
				this.is_exchange = !this.is_exchange;
			},
			onRecord() {
				this.is_user_show = false
				uni.navigateTo({
					url: '/pages/main/record/index'
				})
			},
			getQrTemplate() {
				QrTemplate({}).then(res => {
					this.qr_template = res.data.items
				}).catch(err => {

				})
			},
			getConfig() {
				let _this = this
				config({
					key: 'store'
				}).then(res => {
					_this.system = res.data.config
				}).catch(err => {

				})
			},
			onChangeSub(index) {
				this.sub_index = index
				this.qr_content = ""
			},
			getUser() {
				detail({}).then(res => {
					this.user = res.data.userInfo
				}).catch(err => {

				})
			},
			onSubmit() {
				let _this = this
				_this.finish = {}
				_this.is_finish = true
				if (!_this.user) {
					_this.onLogin(true)
					return false;
				}
				if (_this.system.is_force_user == 20) {
					if (!_this.user.avatarUrl) {
						_this.is_finish = false
						_this.onClosePopup()
						return false;
					}
				}
				if (_this.spool.reward.status == 20) {
					uni.showModal({
						title: '温馨提示',
						content: '观看视频广告后可获得奖励，是否确认继续？',
						success: (res) => {
							if (res.confirm) {
								rewarded.show()
							}
						}
					})
					return false;
				}
				_this.onStart()
			},
			onStart() {
				let _this = this
				let template_id = ""
				if (_this.mode == 10) {
					template_id = _this.qr_template[_this.active].template_id
				}
				created({
					templateId: template_id,
					path: _this.path,
					prompt: _this.prompt,
					content: _this.qr_content,
					sub_index: _this.sub_index,
					mode: _this.mode,
					art_value: _this.art_value,
					model_enum_index: _this.model_enum_index,
					version: _this.version
				}).then(res => {
					console.log(res, '11')
					uni.$u.toast(res.msg)
					if (res.code == 1) {
						_this.finish = res.data
					}
					_this.getUser()
					_this.$nextTick(() => {
						uni.pageScrollTo({
							scrollTop: 2000000,
							duration: 0
						});
					});
				}).finally(() => {
					_this.is_finish = false
				})
			},
			onLogin(is_draw) {
				let _this = this
				wx.login({
					success: res => {
						let referee_id = uni.getStorageSync('referee_id')
						login({
							referee_id: referee_id ? referee_id : 0,
							code: res.code
						}).then(succ => {
							if (succ.code != 1) {
								_this.$refs.uToast.show({
									type: 'error',
									title: succ.msg
								})
								return false;
							}
							uni.setStorageSync('token', succ.data.token)
							_this.getUser()
							if (is_draw) {
								setTimeout(() => {
									_this.onStart()
								}, 1000)
							}
						}).catch(err => {
							_this.is_finish = false
						})
					},
					fail() {}
				});
			},
			onPopupOpen() {
				this.is_user_show = true
			},
			onPopupClose() {
				this.is_user_show = false
			}
		}
	}
</script>

<style lang="scss">
	page {
		padding-bottom: 320rpx;
	}

	.user {
		position: relative;

		.box {
			.user {
				height: 240rpx;
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;
				margin-top: 140rpx;
				margin-bottom: 40rpx;

				.nickname {
					margin: 20rpx 0rpx;
				}
			}

			.service-qrcode {
				width: 100%;
				position: absolute;
				bottom: 60rpx;
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;

				.text {
					margin-top: 30rpx;
				}
			}

			.menu {
				display: flex;
				flex-direction: column;
				align-items: center;
				margin: 0rpx 30rpx;

				.item {
					display: flex;
					flex-direction: row;
					align-items: center;
					margin: 25rpx 0rpx;

					.left {
						display: flex;
						flex-direction: row;
						align-items: center;
						margin-right: 80rpx;

						.title {
							font-size: 32rpx;
							margin-left: 10rpx;
						}
					}
				}
			}
		}
	}

	.panel {
		width: 90%;
		margin: 0 auto;
		margin-top: 30rpx;

		.item {
			margin-bottom: 30rpx;

			.prompt {
				.u-textarea {
					height: 160rpx !important;
					background-color: #383A41 !important;
					border: none !important;
				}
			}

			.art-box {
				display: flex;
				flex-direction: row;
				justify-content: space-between;
				.slider{
					width: 60%;
				}
				slider{
					margin: 10rpx !important;
				}
			}

			.style-qrcode {
				display: flex;
				flex-direction: row;
				flex-wrap: wrap;
				justify-content: flex-start;

				.pic {
					display: flex;
					flex-direction: column;
					width: 20%;
					margin: 10rpx 5rpx;
					border: 2rpx solid #383A41;
					padding: 10rpx;
					border-radius: 10rpx;

					.bottom {
						display: flex;
						flex-direction: row;
						justify-content: center;
						align-items: center;
						margin-top: 15rpx;
						font-size: 24rpx;
					}
				}

				.active {
					border: 2rpx solid #3975FB;
				}
			}

			.fill-qrcode {
				.text-mode {

					.u-textarea {
						height: 260rpx !important;
						background-color: #383A41 !important;
						border: none !important;
					}
				}
			}

			.title {
				margin-bottom: 30rpx;
			}

			.tabs {
				.u-subsection {
					height: 80rpx !important;

					.u-subsection__bar {
						height: 80rpx !important;
					}
				}
			}
		}
	}

	.bottom-action {
		width: 100%;
		position: fixed;
		padding-bottom: 60rpx;
		padding-top: 15rpx;
		bottom: 0rpx;
		left: 0rpx;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-around;
		z-index: 998;
		background-color: #2B2D30;

		.btn-normal {
			width: 25%;
		}

		.submit {
			width: 60%;

			.u-button {
				height: 90rpx !important;
			}
		}

		.reset {
			margin-left: 10%;
			display: flex;
			flex-direction: row;
			align-items: center;

			.icon {
				margin-right: 10rpx;
			}
		}
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
					color: #c8c9cc;
				}

				.desc {
					color: #82848a;
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

	.mark {
		.overlay-warp {
			display: flex;
			align-items: center;
			justify-content: center;
			height: 100%;
			z-index: 9999;

			.warp {
				width: 480rpx;
				height: 365rpx;
				background-image: url('https://img.alicdn.com/imgextra/i1/2064565174/O1CN01ykrIWT1o5k0tHmyAZ_!!2064565174.png');
				background-repeat: no-repeat;
				background-size: 100% 100%;

				.submit {
					width: 80%;
					margin: 0 auto;
					margin-top: 30rpx;

					.link {
						text-align: center;
						margin-top: 15rpx;
						font-size: 24rpx;
						color: #dd6161;
					}
				}

				.input {
					width: 80%;
					margin: 0 auto;
					margin-top: 80rpx;
					z-index: 999;
					border: 1rpx solid #f4f4f4;
					padding: 15rpx;
					border-radius: 5rpx;

					input {
						font-size: 28rpx;
						color: #666;
						border-radius: 15rpx;
					}
				}

				.close {
					display: flex;
					flex-direction: row;
					justify-content: flex-end;
					width: 100%;
					padding-top: 15rpx;

					.icon {
						margin-right: 15rpx;
					}
				}
			}
		}
	}
</style>