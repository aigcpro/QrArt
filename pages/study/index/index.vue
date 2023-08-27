<template>
	<view class="container">
		<u-sticky>
			<view class="tabs">
				<u-tabs :activeStyle="{
        color: '#fff',
        fontWeight: 'bold',
        transform: 'scale(1.05)'
    }" :inactiveStyle="{
        color: '#fff',
        transform: 'scale(1)'
    }" lineColor="#ff6543" :list="tabs" @click="onClickTabs"></u-tabs>
			</view>
		</u-sticky>
		<view class="article" v-if="article.length > 0">
			<view class="item" v-for="(item, index) in article" :key="index" v-on:click="onArticle(item.article_id)">
				<view class="content">
					<view class="title">{{ item.article_title }}</view>
					<view class="date">
						<view class="time">{{ item.view_time }}</view>
						<view class="num">
							<view class="icon">
								<u-icon size="14" name="eye"></u-icon>
							</view>
							<view>{{ item.virtual_views + item.actual_views }}</view>
						</view>
					</view>
				</view>
				<view class="cover">
					<u--image radius="5" :showLoading="true" mode="scaleToFill" :src="item.image.file_path" width="100%"
						height="150rpx"></u--image>
				</view>
			</view>
		</view>
		<view class="empty" v-else>
			<u-empty mode="data" text="暂无资讯记录~!" icon="http://cdn.uviewui.com/uview/empty/data.png">
			</u-empty>
		</view>
	</view>
</template>

<script>
	import {
		category,
		article
	} from '@/api/article.js';
	export default {
		data() {
			return {
				article: [],
				category_id: -1,
				tabs: []
			};
		},
		onLoad() {
			this.getCategory();
			this.getArticle();
		},
		methods: {
			onArticle(article_id) {
				uni.navigateTo({
					url: '/pages/study/article/detail?article_id=' + article_id
				});
			},
			onClickTabs(e) {
				this.category_id = e.category_id;
				this.getArticle();
			},
			getCategory() {
				category({})
					.then(res => {
						let cate = [{
							category_id: -1,
							name: '全部'
						}];
						let categoryList = res.data.categoryList;
						for (var i in categoryList) {
							cate[parseInt(i) + 1] = categoryList[i];
						}
						this.tabs = cate;
					})
					.catch(err => {});
			},
			getArticle() {
				article({
						category_id: this.category_id
					})
					.then(res => {
						this.article = res.data.list.data;
					})
					.catch(err => {});
			}
		}
	};
</script>

<style lang="scss">
	.article {
		width: 92%;
		margin: 15rpx auto;

		.item {
			display: flex;
			flex-direction: row;
			justify-content: space-between;
			padding-bottom: 20rpx;
			border-bottom: 1rpx solid #82848a;
			margin-bottom: 20rpx;

			.content {
				width: 55%;

				.title {
					min-height: 110rpx;
				}

				.date {
					display: flex;
					flex-direction: row;
					justify-content: space-between;
					padding-right: 15rpx;
					color: #999;
					font-size: 24rpx;

					.num {
						display: flex;
						flex-direction: row;
						align-items: center;

						.icon {
							margin-right: 5rpx;
						}
					}
				}
			}

			.cover {
				width: 45%;
			}
		}
	}

	.tabs {
		padding: 0rpx 30rpx;
		padding-bottom: 15rpx;
	}
</style>