<script>
	export default {
		onLaunch: function() {
			console.log('App Launch')
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style lang="scss">
	/* 注意要写在第一行，同时给style标签加入lang="scss"属性 */
	@import "uview-ui/index.scss";

	/*每个页面公共css */
	page {
		background-color: #2B2D30;
		color: #f4f4f5;
		font-size: 28rpx;
	}

	/* 无样式button (用于伪submit) */

	.btn-normal {
		display: block;
		margin: 0;
		padding: 0;
		line-height: normal;
		background: none;
		border-radius: 0;
		box-shadow: none;
		border: none;
		font-size: unset;
		text-align: unset;
		overflow: visible;
		color: inherit;
	}

	.btn-normal:after {
		border: none;
	}

	.btn-normal.button-hover {
		color: inherit;
	}

	button:after {
		content: none;
		border: none;
	}
</style>