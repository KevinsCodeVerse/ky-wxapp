<template>
	<view class="vmb-container">
		<view class="vmb-my-header">
			<view class="flex">
				<view class="u-flex">
					<view class="u-m-r-10" @click="chooseAvatar">
						<image class="avatar" :src="$comm.fullPath(avatar)" />
					</view>
					<view>
						<input class="name-input" v-if="editingName" v-model="name" @blur="saveName" @keyup.enter="saveName" ref="nameInput" />
						<view v-else class="name" @click="editName">{{ name }}</view>
						<view class="vip">普通会员</view>
					</view>
				</view>

				<view class="right">
					<view class="money">账户余额</view>
					<view class="num">88880999</view>
				</view>
			</view>
			<view class="vip-show">
				<view class="line"></view>
				<view class="flex">
					<view class="">权益：商品消费打9折</view>
					<view class="">
						<view class="">剩余365天</view>
					</view>
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
							<view class="badge">5</view>
							<!-- 右上角的小圆点 -->
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
					<u-cell-item @click="openPage('pages/my/goodsTgDt', 2)" title="商品推广">
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
		openPage(path, type) {
			var pages = getCurrentPages() // 获取栈实例
			let currentRoute = pages[pages.length - 1].route; // 获取当前页面路由
			if (path === currentRoute) {
			  return;
			}
			if (type == 1) {
			  uni.redirectTo({
			    url: path
			  })
			}if (type == 2) {
			  uni.navigateTo({
			  	url: path
			  })
			} else {
			  this.$u.route({
			    url: path
			  });
			}
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
	font-size: 30rpx;
	text-align: left;
	color: #805a26;
}
.name-input {
	font-weight: 700;
	font-size: 30rpx;
	text-align: left;
	color: #805a26;
	border: none;
	border-bottom: 1px solid #ccc;
}
.vip {
	margin: 10rpx 0;
	width: 112rpx;
	height: 38rpx;
	line-height: 38rpx;
	border-radius: 19rpx;
	background: #805a26;
	font-weight: 700;
	font-size: 20rpx;
	text-align: center;
	color: #f2e5cb;
}
.vip-show {
	font-weight: 400;
	font-size: 24rpx;
	color: #805a26;
	.line {
		height: 2rpx;
		background: #bf8739;
		opacity: 0.1;
		margin-bottom: 10rpx;
	}
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
.right {
	margin: 60rpx 0;
	text-align: center;
	.money {
		font-weight: 400;
		font-size: 24rpx;
		color: #805a26;
		opacity: 0.6;
	}
	.num {
		font-weight: 700;
		font-size: 38rpx;
		text-align: center;
		color: #664415;
	}
}
.main {
	margin-top: 40rpx;
	padding: 0 35rpx;
	border-radius: 20rpx;
}
.flex {
	display: flex;
	justify-content: space-between;
}
.vmb {
	&-container {
		background: #f5f5f5;
	}
	&-my-header {
		box-sizing: border-box;
		width: 100%;
		height: 276rpx;
		margin-bottom: 20rpx;
		background-image: url('@/static/my/vip-bgc.png');
		background-size: 100% 100%;
		padding: 0rpx 30rpx;
		border-radius: 20rpx;
	}
	&-my-nav {
		margin-left: auto;
		margin-right: auto;
		background: #fff;
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
					position: relative;
					.badge {
						position: absolute;
						top: -5rpx;
						right: -5rpx;
						width: 30rpx;
						height: 30rpx;
						line-height: 30rpx;
						border-radius: 50%;
						background: #f56c6c;
						font-size: 22rpx;

						text-align: center;
						color: #fff;
					}
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
