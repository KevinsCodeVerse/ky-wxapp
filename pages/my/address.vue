<template>
	<view class="page">
		<view class="header">
			<view class="title">地址列表</view>
			<view class="right">
				<u-icon :name="isManage ? 'checkmark' : 'setting'" size="32rpx"></u-icon>
				<view class="manage" @click="toggleManage">{{ isManage ? '完成' : '管理' }}</view>
			</view>
		</view>
		<scroll-view class="address-list" scroll-y="true">
			<block v-if="addresses.length">
				<block v-for="(address, index) in addresses" :key="index">
					<view class="address-item" @click="isManage ? selectAddress(index) : handleAddressClick(address)">
						<view v-if="isManage" class="select-checkbox">
							<u-checkbox v-model="address.isSelected" shape="circle" active-color="#002FA7" />
						</view>
						<view class="address-content">
							<view class="address-top">
								<view>
									<span class="name">{{ address.name }}</span>
									<span class="phone">{{ address.phone }}</span>
								</view>
							</view>
							<view class="address-bottom">
								<view class="address-box">
									<view class="address">{{ address.address }}</view>
								</view>
								<view v-if="!isManage" class="line"></view>
								<view v-if="!isManage" class="set-default">
									<view class="left" @click.stop="selectDefaultAddress(index)">
										<radio color="#002FA7" :checked="address.isDefault" />
										<text class="default">设为默认地址</text>
									</view>
									<view class="address-box">
										<view class="" @click.stop="editAddress(address)">编辑</view>
										<view class="delete" @click.stop="deleteAddress(address)">删除</view>
									</view>
								</view>
							</view>
						</view>
					</view>
				</block>
			</block>
			<u-empty v-else icon-size="550rpx" src="../../../static/index/noEmty.png" text=" " class="center-empty"></u-empty>
		</scroll-view>
		<view @click="isManage ? deleteSelectedAddresses() : handleBottomButtonClick()">
			<button :class="['add-address', isManage && hasSelected ? 'delete-address' : '', isManage && !hasSelected ? 'disabled-btn' : '']" :disabled="isManage && !hasSelected">
				{{ bottomButtonText }}
			</button>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			isManage: false,
			params: {
				pageNo: 1,
				pageSize: 200
			},
			addresses: [],
			selectAddressData: null,
			isSelectMode: false,
			bottomButtonText: '添加收货地址'
		};
	},
	computed: {
		hasSelected() {
			return this.addresses.some((address) => address.isSelected);
		}
	},
	onLoad(options) {
		if (options.type === '1') {
			this.isSelectMode = true;
			// this.bottomButtonText = '添加收货地址';
		}
		this.getAddressList();
	},
	onShow() {
		this.getAddressList();
	},
	methods: {
		getAddressList() {
			this.$request.post({
				url: 'user/userAddress/list',
				params: this.params,
				success: (res) => {
					this.addresses = res.list.map((address) => {
						address.isSelected = false;
						return address;
					});
				}
			});
		},
		toggleManage() {
			if (!this.addresses.length) {
				uni.showToast({
					title: '暂无数据',
					icon: 'none'
				});
				return;
			}
			this.isManage = !this.isManage;
			if (!this.isManage) {
				this.addresses.forEach((address) => (address.isSelected = false));
			}
		},
		editAddress(row) {
			const query = JSON.stringify(row);
			uni.navigateTo({
				url: `/pages/my/addSite?query=${query}`
			});
		},
		addAddress() {
			uni.navigateTo({
				url: '/pages/my/addSite'
			});
		},
		selectDefaultAddress(index) {
			this.addresses.forEach((address, i) => {
				address.isDefault = i === index ? 1 : 0;
			});
			this.updateDefaultAddress(this.addresses[index].id);
		},
		updateDefaultAddress(id) {
			this.$request.post({
				url: 'user/userAddress/update',
				params: {
					id: id,
					isDefault: 1
				},
				success: () => {
					uni.showToast({
						icon: 'success',
						title: '设置成功'
					});
				},
				fail: () => {
					uni.showToast({
						icon: 'none',
						title: '设置失败'
					});
				}
			});
		},
		deleteAddress(row) {
			this.$request.post({
				url: 'user/userAddress/delete',
				params: {
					ids: JSON.stringify([row.id])
				},
				success: (res) => {
					uni.showToast({
						icon: 'success',
						title: '删除成功'
					});
					this.getAddressList();
				}
			});
		},
		selectAddress(index) {
			this.$set(this.addresses, index, {
				...this.addresses[index],
				isSelected: !this.addresses[index].isSelected
			});
		},
		deleteSelectedAddresses() {
			const ids = this.addresses.filter((address) => address.isSelected).map((address) => address.id);
			this.$request.post({
				url: 'user/userAddress/delete',
				params: {
					ids: JSON.stringify(ids)
				},
				success: (res) => {
					uni.showToast({
						icon: 'success',
						title: '删除成功'
					});
					this.getAddressList();
				}
			});
		},
		handleBottomButtonClick() {
			// if (this.isSelectMode) {
			// 	this.confirmSelectedAddress();
			// } else {
			this.addAddress();
			// }
		},
		handleAddressClick(address) {
			if (this.isSelectMode) {
				this.selectAddressForConfirmation(address);
			}
		},
		selectAddressForConfirmation(row) {
			const query = JSON.stringify(row);
			this.selectAddressData = query;
			const pages = getCurrentPages();
			const previousPage = pages[pages.length - 2]; // 获取上一页实例
			// 传递数据到上一页
			previousPage.setData({
				selectedAddress: row
			});
			uni.navigateBack(1);
		},
		confirmSelectedAddress() {
			if (this.selectAddressData) {
				const row = JSON.parse(this.selectAddressData);
				const pages = getCurrentPages();
				const previousPage = pages[pages.length - 2]; // 获取上一页实例
				// 传递数据到上一页
				previousPage.setData({
					selectedAddress: row
				});
				uni.navigateBack(1);
			} else {
				uni.showToast({
					title: '请选择一个地址',
					icon: 'none'
				});
			}
		}
	}
};
</script>

<style lang="scss" scoped>
.page {
	padding: 20rpx;
	height: 100vh;
	display: flex;
	flex-direction: column;
	background: #f5f5f5;
}
.header {
	display: flex;
	justify-content: space-between;
	align-items: center;
}
.title {
	font-weight: 700;
	font-size: 28rpx;
	text-align: left;
	color: #000;
}
.right {
	display: flex;
	align-items: center;
}
.manage {
	font-weight: 400;
	font-size: 28rpx;
	text-align: left;
	margin-left: 5rpx;
	color: #000;
}
.address-list {
	margin-top: 20rpx;
	flex: 1;
	overflow: auto;
}
.address-item {
	background-color: #ffffff;
	padding: 25rpx 15rpx;
	margin-bottom: 20rpx;
	border-radius: 16rpx;
	box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
	position: relative;
	display: flex;
}
.select-checkbox {
	display: flex;
	align-items: center;
	margin-right: 20rpx;
	position: absolute;
	left: 10rpx;
	top: 50%;
	transform: translateY(-50%);
}
.address-content {
	flex: 1;
	margin-left: 50rpx; /* 适应勾选框的位置 */
}
.address-top {
	display: flex;
	justify-content: space-between;
	align-items: center;
}
.name {
	font-size: 30rpx;
	font-weight: bold;
}
.phone {
	margin-left: 20rpx;
	font-size: 24rpx;
	color: #999;
}
.address-bottom {
	margin-top: 10rpx;
}
.address-box {
	display: flex;
	justify-content: space-between;
}
.address {
	flex: 1;
	font-size: 24rpx;
	color: #999;
	margin: 10rpx 0;
	display: -webkit-box;
	-webkit-line-clamp: 3;
	-webkit-box-orient: vertical;
	overflow: hidden;
	text-overflow: ellipsis;
}
.line {
	margin: 15rpx 0;
	width: 100%;
	height: 3rpx;
	background-color: #f5f5f5;
}
.edit {
	font-size: 26rpx;
	color: #007aff;
}
.default {
	font-weight: 400;
	font-size: 26rpx;
	text-align: left;
	color: #222;
}
.set-default,
.delete {
	display: flex;
	justify-content: space-between;
	align-items: center;
	color: #007aff;
}
.delete {
	font-size: 28rpx;
	color: #f24848;
	margin: 0 20rpx;
}
.add-address {
	position: fixed;
	bottom: 20rpx;
	left: 50%;
	transform: translateX(-50%);
	width: calc(100% - 40rpx);
	height: 80rpx;
	line-height: 80rpx;
	color: #ffffff;
	text-align: center;
	border-radius: 40rpx;
	background: #002fa7;
	font-size: 28rpx;
}
.delete-address {
	background: #f24848;
}
button[disabled] {
	background: #ccc;
	color: #ffffff;
}
.center-empty {
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	height: calc(100vh - 114rpx);
}
</style>