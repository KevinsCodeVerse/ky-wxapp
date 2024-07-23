<template>
	<view class="login">
		<button class="mybtn btn" open-type="getPhoneNumber" @getphonenumber="getPhoneNumber">微信授权登录</button>
	</view>
</template>

<script>
export default {
	data() {
		return {
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
		getPhoneNumber(e) {
			this.$request.post({
				url: 'wx/ma/user/phone',
				params: {
					code: e.target.code
				},
				success: (result) => {
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
										console.log('result', result);
										uni.setStorageSync('login', result);
										uni.setStorageSync('token', result.token);
										uni.setStorageSync('phone', this.phone);
										uni.setStorageSync('avatar', result.info.avatar);
										uni.setStorageSync('name', result.info.nick);
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
				}
			});
		},
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
								console.log('result', result);
								uni.setStorageSync('login', result);
								uni.setStorageSync('token', result.token);
								uni.setStorageSync('phone', this.phone);
								uni.setStorageSync('avatar', result.info.avatar);
								uni.setStorageSync('name', result.info.nick);
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
			if (this.parentId) {
				this.bindParent();
			}
			if (this.id && this.shopId) {
				this.scanCode();
			}
			uni.switchTab({
				url: '/pages/index/index'
			});
		},
		bindParent() {
			this.$request.post({
				url: 'wx/ma/user/bind',
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
				url: 'user/userInfo/scanCode',
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
		}
	}
};
</script>

<style scoped>
.login {
	display: flex;
	justify-content: center;
	align-items: center;
	min-height: 100vh;
	background-color: #f8f8f8; /* 柔和的背景颜色 */
	text-align: center;
}

.btn {
	display: flex;
	align-items: center;
	justify-content: center;
	height: 86rpx;
	width: 480rpx;
	color: #ffffff; /* 按钮文字颜色 */
	background-color: #333333; /* 按钮背景颜色 */
	font-size: 32rpx;
	border-radius: 42rpx; /* 边框半径 */
	margin-bottom: 30rpx;
	box-shadow: 0 4rpx 8rpx rgba(0, 0, 0, 0.2); /* 添加阴影 */
}

.btn:hover {
	background-color: #2c2c2c; /* 按钮悬停颜色 */
}

.btn:active {
	background-color: #1f1f1f; /* 按钮激活颜色 */
}
</style>
