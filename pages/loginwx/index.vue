<!-- pages/login/login.vue -->
<template>
	<view class="login">
		<view class="logo">
			<image src="https://www.tcgz.store//files/default_firm_info.png"></image>
			<text>同城关注</text>
		</view>
		<view class="authority">
			<text class="title">该小程序申请获取以下授权：</text>
			<text class="li">获取您的公开信息（昵称和头像等）</text>
			<text class="li">获取您的位置信息</text>
		</view>
		<view class="btns">
			<button class="get_cancel" @tap="goCancel">暂不授权</button>
			<button class="get_info" open-type="getUserInfo" @tap="getUserProfile">确定授权</button>
		</view>
	</view>
</template>

<script>
import rsa from '@/utils/encryption.js';
export default {
	data() {
		return {
			userInfo: {},
			parentId: '',
			phone: '',
			agentId: '',
			type: '',
			id: '',
			encryption: '',
			loading: false,
			info: null
		};
	},
	onLoad(options) {
		this.phone = options.phone || '';
		this.parentId = options.scene || '';
		this.agentId = options.agentId || '';
		this.id = options.id || '';
		this.type = options.type || '';

		if (this.parentId) uni.setStorageSync('parentId', this.parentId);
		if (options.agentId) uni.setStorageSync('agentIdoptions', options);

		this.getUserInfo();
	},
	methods: {
		isNew() {
			this.$request.post({
				url: 'user/invite/isNew',
				success: (res) => {
					if (res == 1) {
						this.agentId && this.binding(this.agentId);
					}
				}
			});
		},
		getUserInfo() {
			uni.login({
				success: (res) => {
					if (res.code) {
						uni.showLoading({
							title: '微信授权登录中...',
							mask: true
						});
						this.$request.post({
							url: 'wx/ma/user/public/login',
							params: {
								code: res.code,
								phone: this.phone
							},
							success: (result) => {
								this.encryption = result.encryption;
								uni.setStorageSync('token', result.token);
								uni.hideLoading();
							},
							allError: (err) => {
								uni.hideLoading();
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
				fail: () => {
					uni.hideLoading();
					uni.showToast({
						title: '授权失败',
						icon: 'none'
					});
				}
			});
		},
		getUserProfile() {
			let agentIdoptions = uni.getStorageSync('agentIdoptions') || {};
			let parentIds = uni.getStorageSync('parentId') || '';
			this.parentId = parentIds;
			this.agentId = agentIdoptions.agentId || '';
			this.type = agentIdoptions.type || '';
			this.id = agentIdoptions.id || '';

			uni.getUserProfile({
				desc: '用于完善会员资料',
				success: (res) => {
					this.encryptedData = res.encryptedData;
					this.$request.post({
						url: 'wx/ma/user/info',
						params: {
							encryptedData: res.encryptedData,
							encryption: this.encryption,
							iv: res.iv,
							rawData: res.rawData,
							signature: res.signature,
							parentId: this.parentId || agentIdoptions.agentId || ''
						},
						success: (resul) => {
							uni.showToast({
								title: '授权成功',
								icon: 'success',
								duration: 1500
							});
							this.loading = false;
							uni.setStorageSync('phone', resul.mobile);
							if (parentIds) this.binding(parentIds);
							if (agentIdoptions.agentId) this.binding(agentIdoptions.agentId);
							this.getInfo();
							this.getAddressList();
							uni.switchTab({
								url: '/pages/focus/focus'
							});
						},
						allError: (err) => {
							console.log(err);
						}
					});
				},
				allError: (err) => {
					console.log(err);
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
					uni.setStorageSync('token', res.token);
				}
			});
		},
		goCancel() {
			uni.navigateBack({
				delta: 1
			});
		},
		binding(agentId) {
			this.$request.post({
				url: 'user/invite/binding',
				params: {
					agentId
				},
				success: () => {
					console.log('绑定成功!' + agentId);
				}
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
					let defaultAddress = res.filter((item) => item.isDefault)[0];
					uni.setStorageSync('shippingAddress', defaultAddress);
					if (!res.result && !res[0]) {
						uni.setStorageSync('shippingAddress', res.result);
					}
				}
			});
		}
	}
};
</script>

<style>
.login {
	height: 100vh;
	display: flex;
	align-items: center;
	justify-content: flex-start;
	flex-direction: column;
	background-color: #fff;
}

.login .logo {
	padding-top: 100rpx;
}

.login .logo image {
	width: 108rpx;
	height: 108rpx;
	border-radius: 50%;
	margin-bottom: 20rpx;
}
.login .logo text {
	display: block;
	text-align: center;
	font-size: 32rpx;
	margin-top: 10rpx;
}

.authority {
	width: 90%;
	margin: 0 auto;
	border-top: 1rpx solid #eeeeee;
	padding-top: 30rpx;
	margin-top: 30rpx;
}

.authority .title {
	display: block;
	font-size: 32rpx;
}

.authority .li {
	color: #999999;
	display: block;
	position: relative;
	height: 28rpx;
	line-height: 28rpx;
	margin-top: 20rpx;
	font-size: 28rpx;
	padding-left: 16rpx;
}

.authority .li::before {
	content: ' ';
	position: absolute;
	width: 6rpx;
	height: 6rpx;
	border-radius: 50%;
	left: 0;
	top: 11rpx;
	background-color: #999999;
}

.login .btns {
	width: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 100rpx 1vw 0 1vw;
}

.login .btns text {
	display: block;
	font-size: 32rpx;
	text-align: center;
}

.login .btns button {
	width: 45vw;
	margin-top: 20rpx;
	border-radius: 10rpx;
	font-size: 32rpx;
	margin-left: 1.5vw;
	margin-right: 1.5vw;
	height: 84rpx;
}
.login .btns .get_info {
	background-color: #3994ff;
	color: white;
}
.login .btns .get_cancel {
	background-color: #fff;
	border: 1px solid #707070;
}
.login .btns .to_business {
	border: 1px solid #0dc3ff;
	color: #0dc3ff;
	background-color: transparent;
}
</style>
