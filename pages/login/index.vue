<template>
	<view class="login" :style="{ backgroundImage: 'url(' + background + ')' }">
		<view class="logo">
			<image src="/static/navs/index.png"></image>
		</view>
		<view class="handle">
			<button class="mybtn btn" open-type="getUserInfo" @tap="getUserProfile">微信授权登录</button>
			<navigator class="mybtn btn" url="/pages/register/index">手机号登录注册</navigator>
			<view class="protocol">
				<text>登录代表您已同意</text>
				<navigator url="/pages/protocol/index">《用户协议》</navigator>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			background: '/static/navs/index.png',
			userInfo: {},
			parentId: '',
			shopId: '',
			phone: '',
			agentId: '',
			type: '',
			id: '',
			isShare: '',
			redirectUrl: '',
			encryption: '',
			loading: false
		};
	},
	onLoad(options) {
		console.log('登录options', options);
		if (options.parentId) {
			this.parentId = options.parentId;
		}
		if (options.shopId && options.id) {
			this.shopId = options.shopId;
			this.id = options.id;
		}
		const redirectUrl = uni.getStorageSync('redirectUrl');
		if (redirectUrl.includes('isShare')) {
			this.redirectUrl = redirectUrl;
		}

		let base64 = uni.getFileSystemManager().readFileSync(this.background, 'base64');
		this.background = 'data:image/jpg;base64,' + base64;

		if (options.scene) {
			let scene = decodeURIComponent(options.scene).split(',');
			options.agentId = scene[0];
			options.id = scene[1];
			options.type = scene[2];
			options.scene = '';
			this.parentId = options.scene || '';
		}

		this.phone = options.phone || '';

		this.agentId = options.agentId || '';
		this.id = options.id || '';
		this.type = options.type || '';

		if (this.parentId) uni.setStorageSync('parentId', this.parentId);
		if (options.agentId) uni.setStorageSync('agentIdoptions', options);
	},
	methods: {
		getUserProfile() {
			uni.login({
				provider: 'weixin',
				success: (res) => {
					console.log('login', res);
					if (res.code) {
						this.$request.post({
							url: 'wx/ma/user/public/login',
							params: {
								code: res.code,
								phone: this.phone
							},
							success: (result) => {
								uni.setStorageSync('login', result);
								uni.setStorageSync('token', result.token);
								uni.setStorageSync('phone', this.phone);
								this.encryption = result.encryption;
								this.handleScanParams();
							},
							allError: (err) => {
								console.log(err);
							},
							fail: (err) => {
								uni.hideLoading();
								uni.showToast({
									title: '授权失败',
									icon: 'none'
								});
							}
						});
					} else {
						uni.hideLoading();
						uni.showToast({
							title: '授权失败',
							icon: 'none'
						});
					}
				},
				fail: (err) => {
					uni.hideLoading();
					uni.showToast({
						title: '授权失败',
						icon: 'none'
					});
				}
			});
		},
		handleScanParams() {
			console.log('parentId', this.parentId);
			// if (this.parentId) {
			// 	this.bindParent();
			// }
			// if (this.id && this.shopId) {
			// 	this.scanCode();
			// }
			uni.switchTab({
				url: '/pages/index/index'
			});
		},
		bindParent() {
			this.$request.post({
				url: '/wx/ma/user/bind',
				params: {
					parentId: this.parentId
				},
				success: (res) => {
					console.log('绑定上下级关系成功', res);
				},
				fail: (err) => {
					console.log('绑定上下级关系失败', err);
				}
			});
		},
		scanCode() {
			this.$request.post({
				url: '/user/userInfo/scanCode',
				params: {
					id: this.id,
					shopId: this.shopId
				},
				success: (res) => {
					console.log('扫码成功', res);
				},
				fail: (err) => {
					console.log('扫码失败', err);
				}
			});
		},
		toLogin() {
			this.$request.post({
				url: 'user/info/public/authority',
				params: {
					account: rsa.cryptStr('15797735521'),
					password: rsa.cryptStr('123456')
				},
				success: (res) => {
					console.log(res.token);
					uni.setStorageSync('token', res.token);
				}
			});
		},
		goCancel() {
			uni.navigateBack({
				delta: 1
			});
		},
		getInfo() {
			this.$request.post({
				url: 'user/info/totalAssets',
				success: (res) => {
					this.info = res;
					uni.setStorageSync('userId', res.id);
				}
			});
		},
		getAddressList() {
			this.$request.post({
				url: 'user/info/addressList',
				success: (res) => {
					uni.setStorageSync('shippingAddress', res.filter((item) => item.isDefault)[0]);
					if (!res.result && !res[0]) {
						uni.setStorageSync('shippingAddress', res.result);
					}
				}
			});
		}
	}
};
</script>

<style scoped>
.login {
	min-height: 100vh;
	background-color: #4f90f8;
	background-repeat: no-repeat;
	background-size: 100% auto;
	text-align: center;
}
.logo image {
	width: 300rpx;
	height: 310rpx;
	margin-top: 30%;
	margin-bottom: 30%;
}
.handle {
	display: flex;
	flex-direction: column;
	align-items: center;
}
.btn {
	display: flex;
	align-items: center;
	justify-content: center;
	height: 86rpx;
	width: 480rpx;
	color: #3994ff;
	background-color: #fff;
	font-size: 32rpx;
	border-radius: 84rpx;
	margin-bottom: 30rpx;
}
.handle .protocol {
	display: flex;
	color: #fff59a;
	font-size: 24rpx;
}
.handle text {
	color: #fff;
}
</style>