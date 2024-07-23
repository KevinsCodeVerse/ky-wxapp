<template>
	<view class="vmb-container">
		<view class="vmb-my-header">
			<view class="u-flex user-box u-p-r-20 u-p-b-30">
				<view class="u-m-r-10" @click="chooseAvatar">
					<image class="avatar" :src="$comm.fullPath(avatar)" />
				</view>
				<view>
					<input class="name-input" v-if="editingName" v-model="name" @blur="saveName" @keyup.enter="saveName" ref="nameInput" />
					<view v-else class="name" @click="editName">{{ name }}</view>
					<view class="phone">{{ phone }}</view>
				</view>
			</view>
		</view>
		<view class="vmb-my-nav">
			<view class="nav">
				<view class="top">我的订单</view>
				<view class="gird-flex">
					<view @click="toOrder(0)" class="img-box">
						<view class="img">
							<u-image src="@/static/my/order.png" width="60rpx" height="60rpx" />
						</view>
						<view>全部订单</view>
					</view>
					<view @click="toOrder(1)" class="img-box">
						<view class="img">
							<u-image src="@/static/my/obligation.png" width="60rpx" height="60rpx" />
						</view>
						<view>待付款</view>
					</view>
					<view @click="toOrder(3)" class="img-box">
						<view class="img">
							<u-image src="@/static/my/car.png" width="60rpx" height="60rpx" />
						</view>
						<view>待收货</view>
					</view>
					<view @click="toOrder(4)" class="img-box">
						<view class="img">
							<u-image src="@/static/my/afterSale.png" width="60rpx" height="60rpx" />
						</view>
						<view>售后</view>
					</view>
				</view>
			</view>
		</view>

		<view class="main">
			<view>
				<u-cell-group>
					<u-cell-item @tap="openPage('pages/my/address')" title="地址管理">
						<template #icon>
							<image src="@/static/my/my-item1.png" class="custom-icon" />
						</template>
					</u-cell-item>
				</u-cell-group>
			</view>
			<view>
				<u-cell-group>
					<u-cell-item @click="openPage('pages/my/goodsTgDt')" title="商品推广">
						<template #icon>
							<image src="@/static/my/my-item2.png" class="custom-icon" />
						</template>
					</u-cell-item>
				</u-cell-group>
			</view>
			<view>
				<u-cell-group>
					<u-cell-item @click="openPage('pages/my/pt/goodsTgDt')" title="平台推广">
						<template #icon>
							<image src="@/static/my/my-item3.png" class="custom-icon" />
						</template>
					</u-cell-item>
				</u-cell-group>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			show: true,
			name: '',
			phone: '',
			avatar: '',
			editingName: false
		};
	},
	onLoad() {
		this.getInfo();
	},
	methods: {
		getInfo() {
			this.name = uni.getStorageSync('name');
			this.phone = uni.getStorageSync('phone');
			this.avatar = uni.getStorageSync('avatar');
			this.$request.post({
				url: 'user/userInfo/getUserInfo',
				success: (res) => {
					this.name = res.nick;
					this.avatar = res.avatar;
					this.phone = res.mobile;
				}
			});
		},
		toOrder(status) {
			uni.navigateTo({
				url: `/pages/orderList/order?status=${status}`
			});
		},
		openPage(path) {
			this.$u.route({
				url: path
			});
		},
		chooseAvatar() {
			uni.chooseImage({
				count: 1,
				sizeType: ['compressed'],
				sourceType: ['album', 'camera'],
				success: (res) => {
					const filePath = res.tempFilePaths[0];

					// 将 filePath 转换为 Base64 并上传文件
					this.convertToBase64(filePath)
						.then((base64) => {
							this.uploadBase64(base64);
						})
						.catch((err) => {
							console.log('err', err);
							uni.showToast({
								title: '转换文件失败',
								icon: 'none'
							});
						});
				},
				fail: (err) => {
					console.log('err', err);
				}
			});
		},

		convertToBase64(filePath) {
			return new Promise((resolve, reject) => {
				const fs = wx.getFileSystemManager();
				fs.readFile({
					filePath: filePath,
					encoding: 'base64',
					success: (res) => {
						resolve(`data:image/jpeg;base64,${res.data}`);
					},
					fail: (err) => {
						reject(err);
					}
				});
			});
		},

		uploadBase64(base64) {
			this.$request.post({
				url: 'wx/ma/user/editInfo',
				params: {
					nick: this.name,
					avatar: base64
				},
				success: (res) => {
					if (res.avatar) {
						const newAvatar = res.avatar.replace(/^.*\/files/, '/files');
						this.avatar = newAvatar;
						uni.setStorageSync('avatar', newAvatar);
					}
					uni.showToast({
						title: '上传头像成功',
						icon: 'success'
					});
					this.getInfo();
				},
				fail: (err) => {
					uni.showToast({
						title: '上传头像失败',
						icon: 'none'
					});
				}
			});
		},
		editName() {
			this.editingName = true;
			this.$nextTick(() => {
				this.$refs.nameInput.focus();
			});
		},
		saveName() {
			this.editingName = false;
			uni.setStorageSync('name', this.name);
			this.$request.post({
				url: 'wx/ma/user/editInfo',
				params: {
					nick: this.name
				},
				success: (res) => {
					uni.showToast({
						title: '保存姓名成功',
						icon: 'success'
					});
					this.getInfo();
				},
				fail: (err) => {
					uni.showToast({
						title: '保存姓名失败',
						icon: 'none'
					});
				}
			});
		}
	}
};
</script>

<style lang="scss" scoped>
.custom-icon {
	width: 36rpx;
	height: 36rpx;
	margin-right: 10rpx;
}
.name {
	font-weight: 700;
	font-size: 38rpx;
	text-align: left;
	color: #000;
}
.name-input {
	font-weight: 700;
	font-size: 38rpx;
	text-align: left;
	color: #000;
	border: none;
	border-bottom: 1px solid #ccc;
}
.phone {
	font-weight: 400;
	font-size: 26rpx;
	text-align: left;
	color: #666;
}
.grid-text {
	font-weight: 400;
	font-size: 24rpx;
	text-align: center;
	color: #333;
}
.avatar {
	border: 4rpx solid #ffffff;
	width: 96rpx;
	height: 96rpx;
	border-radius: 50%;
}
.main {
	margin-top: 40rpx;
	padding: 0 35rpx;
	border-radius: 20rpx;
}
.vmb {
	&-container {
		background: #f5f5f5;
	}
	&-my-header {
		box-sizing: border-box;
		width: 100%;
		height: 230rpx;
		background: radial-gradient(87.28% 89.35% at 19.2% 4.87%, #f5ebd7 0%, #f5ebd700 100%);
		background-size: 100% 100%;
		padding: 20rpx 30rpx;
		border-radius: 20rpx;
		::v-deep {
			.u-avatar {
				border: 4rpx solid #ffffff;
				width: 96rpx;
				height: 96rpx;
			}
			.u-p-b-20 {
				color: #ffffff;
			}
			.u-tips-color {
				color: #ffffff;
			}
			.u-icon__icon {
				color: #ffffff !important;
			}
		}
	}
	&-my-nav {
		width: calc(100% - 60rpx);
		margin-left: auto;
		margin-right: auto;
		background: #fff;
		margin-top: -80rpx;
		border-radius: 20rpx;
		.nav {
			padding: 20rpx 5rpx;
			height: 190rpx;
			border-radius: 24rpx;
			.top {
				padding: 0 20rpx;
				font-weight: 700;
				font-size: 32rpx;
				text-align: left;
				color: #1a1e22;
			}
			.gird-flex {
				display: flex;
				justify-content: space-around;
				view {
					font-weight: 400;
					font-size: 24rpx;
					text-align: center;
					color: #333;
				}
				.img {
					padding: 0 20rpx;
					margin: 10rpx 0;
				}
			}
		}
		::v-deep {
			.u-grid {
				.u-grid-item {
					background: transparent !important;
					color: #ffffff !important;
				}
			}
		}
	}
}
</style>
