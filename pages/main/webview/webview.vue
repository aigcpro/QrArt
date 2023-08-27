<template>
	<view class="container">
		<web-view :src="url" v-if="url"></web-view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				url: ''
			};
		},
		onLoad(options) {
			this.url = options.url
		}
	}
</script>

<style lang="scss">

</style>