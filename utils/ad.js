var videoAd = null;
let rewarded = {
	load(id, e) {
		console.log('load')
		if (wx.createRewardedVideoAd) {
			videoAd = wx.createRewardedVideoAd({
				adUnitId: id
			})
			videoAd.onError(err => {
				console.log(err)
			})
			videoAd.onClose((status) => {
				if (status && status.isEnded || status === undefined) {
					e()
				} else {}
			})
		}
	},
	show() {
		if (videoAd) {
			videoAd.onClose((status) => {
				console.log(status + '关闭')
			})
			videoAd.show().catch(() => {
				// 失败重试
				videoAd.load()
					.then(() => videoAd.show())
					.catch(err => {
						console.log('激励视频 广告显示失败')
					})
			})
		}
	}
}

var interstitialAd = null;
let insert = {
	load(id) {
		if (wx.createInterstitialAd) {
			interstitialAd = wx.createInterstitialAd({
				adUnitId: id
			})
			interstitialAd.onLoad(() => {
				console.log('插屏广告加载中')
			})
			interstitialAd.onError((err) => {
				console.log('加载错误', err)
			})
			interstitialAd.onClose((res) => {
				console.log('插屏广告关闭', res)
			})
		}
	},
	show() {
		if (interstitialAd) {
			interstitialAd.show().catch((err) => {
				console.error(err)
			})
		}
	}
}

module.exports = {
	insert,
	rewarded
};
