<template>
	<view class="order-page">
		<scroll-view class="content" scroll-y="true">
			<!-- 收件人信息 -->
			<view class="address-box">
				<view class="address-info">
					<view v-if="address.name" class="address-item" @click="toSelectAddress">
						<u-icon size="40rpx" class="icon" name="map" color="#3c3c3c"></u-icon>
						<view class="address-details">
							<text class="name-phone">{{ address.name }}</text>
							<text class="phone">{{ address.phone }}</text>
							<view class="address">{{ address.address }}</view>
						</view>
						<u-icon size="24rpx" style="margin-right: 20rpx" name="arrow-right" color="#3c3c3c"></u-icon>
					</view>
					<view @click="toAddress" v-else class="address-item">
						<u-icon color="#3c3c3c" size="40rpx" class="icon" name="map"></u-icon>
						<view class="add-address">+ 添加收货地址</view>
					</view>
				</view>
				<image class="address-line" src="@/static/index/address-line.png" mode="widthFix"></image>
			</view>

			<!-- 商品信息 -->
			<view class="product-info">
				<view class="product-item" v-for="(item, index) in products" :key="index">
					<image class="product-image" mode="aspectFit" :src="$comm.fullPath(item.pro.banner)"></image>
					<view class="product-details">
						<view class="product-name">{{ item.pro.name }}</view>
						<view class="product-spec" v-for="(value, key) in JSON.parse(item.sku.spec)" :key="key">{{ key }}：{{ value }}</view>
						<view v-if="unit == 1" class="product-price">{{ item.pro.price }}积分</view>
						<view v-else class="product-price">￥{{ item.pro.price }}</view>
					</view>
					<view class="product-quantity">x{{ item.quantity }}</view>
				</view>
			</view>

			<!-- 费用信息 -->
			<view class="fee-info">
				<view class="fee-item">
					<view class="fee-label">合计</view>
					<view v-if="unit == 1" class="fee-value">{{ totalPrice }}积分</view>
					<view v-else class="fee-value">￥{{ totalPrice }}</view>
				</view>
			</view>

			<!-- 支付方式 -->
			<view class="payment-method">
				<view class="payment-item" v-for="method in paymentMethods" :key="method.value" @click="selectPaymentMethod(method.value)">
					<view class="payment-flex">
						<image :src="method.icon" class="icon" mode="widthFix" />
						<view class="payment-label">{{ method.label }}</view>
					</view>

					<radio :checked="selectedPaymentMethod === method.value" color="#002FA7"></radio>
				</view>
			</view>
		</scroll-view>

		<!-- 底部 -->
		<view class="footer">
			<view class="left">
				<span class="total-price-label">应付:</span>
				<span v-if="unit == 1" class="total-price-value">{{ totalPrice }}积分</span>
				<span v-else class="total-price-value">￥{{ totalPrice }}</span>
			</view>
			<button :class="{ 'submit-order': true, 'submit-order-disabled': !address.name }" @click="submitOrder" :disabled="!address.name">提交订单</button>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			unit: null,
			address: {},
			products: [],
			carIds: [],
			paymentMethods: [
				{ label: '会员账户', value: 'member', icon: require('@/static/index/vip-icon.png') },
				{ label: '线下购买', value: 'offline', icon: require('@/static/index/shop-icon.png') }
			],
			selectedAddress: null,
			selectedPaymentMethod: 'member'
		};
	},
	onLoad(options) {
		if (options.products) {
			this.products = JSON.parse(decodeURIComponent(options.products));
			this.carIds = JSON.parse(options.carIds);
		} else {
			const { pro, sku, quantity } = options;
			this.products = [
				{
					pro: JSON.parse(decodeURIComponent(pro)),
					sku: JSON.parse(decodeURIComponent(sku)),
					quantity: quantity
				}
			];
		}
	},
	onShow() {
		this.unit = uni.getStorageSync('unit');
		const pages = getCurrentPages();
		const currentPage = pages[pages.length - 1]; // 获取当前页面实例
		if (currentPage.data.selectedAddress) {
			const res = currentPage.data.selectedAddress;
			this.address = {
				id: res.id,
				address: res.address,
				name: res.name,
				phone: res.phone
			};
			console.log('address', this.address);
		} else {
			this.getDefaultAddress();
		}
	},
	computed: {
		totalPrice() {
			let productTotal = this.products.reduce((total, item) => {
				return total + item.sku.curPrice * item.quantity;
			}, 0);
			return productTotal.toFixed(2);
		}
	},
	methods: {
		getDefaultAddress() {
			this.$request.post({
				url: 'user/userAddress/getDefaultAddress',
				success: (res) => {
					this.address = {
						id: res.id,
						address: res.address,
						name: res.name,
						phone: res.phone
					};
				}
			});
		},
		selectPaymentMethod(method) {
			this.selectedPaymentMethod = method;
		},
		submitOrder() {
			let orderData = {
				addressId: this.address.id,
				payType: this.selectedPaymentMethod === 'member' ? 1 : 2
			};
			if (this.carIds.length > 0) {
				orderData.carIds = JSON.stringify(this.carIds);
				if (!orderData.addressId) {
					uni.showToast({
						title: '请添加收货地址',
						icon: 'none'
					});
					return;
				}
				this.$request.post({
					url: 'user/userOrder/shopCarSettlement',
					params: orderData,
					success: (res) => {
						if (this.selectedPaymentMethod == 'member' && res) {
							this.payOrder(res);
						} else {
							uni.showToast({
								title: '订单提交成功',
								icon: 'success'
							});
							setTimeout(() => {
								uni.navigateBack(1);
							}, 1000);
						}

						// 在此处添加提交订单成功后的逻辑
					},
					fail: (err) => {
						uni.showToast({
							title: '订单提交失败',
							icon: 'none'
						});
					}
				});
			} else {
				orderData = {
					...orderData,
					proId: this.products[0].pro.id,
					skuId: this.products[0].sku.id,
					count: this.products[0].quantity
				};
				this.$request.post({
					url: 'user/userOrder/submitOrder',
					params: orderData,
					success: (res) => {
						if (this.selectedPaymentMethod == 'member' && res) {
							this.payOrder(res);
						} else {
							uni.showToast({
								title: '订单提交成功',
								icon: 'success'
							});
							setTimeout(() => {
								uni.navigateBack(1);
							}, 1000);
						}

						// 在此处添加提交订单成功后的逻辑
					},
					fail: (err) => {
						uni.showToast({
							title: '订单提交失败',
							icon: 'none'
						});
					}
				});
			}
		},
		payOrder(orderId) {
			this.$request.post({
				url: 'user/userOrder/orderPay',
				params: {
					orderId
				},
				success: (res) => {
					uni.showToast({
						title: '订单提交成功',
						icon: 'success'
					});
					setTimeout(() => {
						uni.navigateBack(1);
					}, 1000); // 显示提示信息2秒后再后退
				},
				fail: (err) => {
					uni.showToast({
						title: '订单提交失败',
						icon: 'none'
					});
				}
			});
		},
		toAddress() {
			uni.navigateTo({
				url: '/pages/my/addSite?type=1'
			});
		},
		toSelectAddress() {
			uni.navigateTo({
				url: '/pages/my/address?type=1'
			});
			// uni.navigateTo({
			// 	url: '/pages/shop/selectAddress'
			// });
		}
	}
};
</script>

<style lang="scss" scoped>
.order-page {
	background-color: #fff;
}
.content {
	width: 100%;
}
.address-box {
	background-color: #fff;
	border-radius: 10rpx;
	margin: 20rpx 0;
	padding: 0 20rpx;
}
.address-info {
	background-color: #fff;
	padding-top: 20rpx;
	padding-bottom: 10rpx;
	display: flex;
	align-items: center;
}
.address-item {
	display: flex;
	align-items: center;
	width: 100%;
}
.address-details {
	flex: 1;
	margin-left: 10rpx;
}
.name {
	font-weight: 900;
	font-size: 30rpx;
	text-align: left;
	color: #222;
}
.phone {
	font-weight: 400;
	font-size: 24rpx;
	margin: 0 10rpx;
	color: #999;
}
.address {
	font-weight: 400;
	font-size: 24rpx;
	color: #999;
}
.add-address {
	color: #002fa7;
	font-size: 30rpx;
}
.address-line {
	width: 100%;
	height: 4rpx;
}
.product-info {
	background-color: #fff;
	padding: 20rpx;
	border-radius: 10rpx;
	border-bottom: 2rpx solid #f5f5f5;
}

.product-item {
	display: flex;
	justify-content: space-between;
	margin-bottom: 10rpx;
}
.product-image {
	width: 150rpx;
	height: 150rpx;
	border-radius: 12rpx;
}
.product-details {
	flex: 1;
	margin-left: 20rpx;
}
.product-name {
	font-weight: bold;
	font-size: 30rpx;
	margin-bottom: 10rpx;
}
.product-spec {
	color: #666;
	font-size: 26rpx;
	margin-bottom: 5rpx;
}
.product-price {
	font-weight: bold;
	font-size: 28rpx;
	color: #222;
}
.product-quantity {
	font-size: 30rpx;
	color: #222;
}
.fee-info {
	margin-bottom: 20rpx;
	background-color: #fff;
	padding: 20rpx;
	border-radius: 10rpx;
}
.fee-item {
	display: flex;
	justify-content: space-between;
	margin-bottom: 10rpx;
}
.fee-label {
	font-size: 28rpx;
	font-weight: 900;
	color: #222;
}
.fee-value {
	font-weight: 900;
	font-size: 28rpx;
	color: #222;
}
.payment-flex {
	display: flex;
}
.payment-method {
	margin-bottom: 20rpx;
	background-color: #fff;
	padding: 20rpx;
	border-radius: 10rpx;
}
.payment-item {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin: 20rpx 0;
	height: 50rpx;
	.icon {
		width: 34rpx;
		height: 34rpx;
		margin-right: 10rpx;
	}
}
.payment-label {
	font-size: 28rpx;
	color: #222;
}
.footer {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 20rpx;
	background-color: #fff;
	position: fixed;
	bottom: 0;
	width: 100%;
	box-shadow: 0 -2rpx 8rpx rgba(0, 0, 0, 0.1);
	.left {
		flex: 1;
	}
}
.total-price-label {
	font-weight: 700;
	font-size: 32rpx;
	text-align: left;
	color: #333;
}
.total-price-value {
	font-weight: 700;
	font-size: 32rpx;
	text-align: left;
	color: #bf8739;
}
.submit-order {
	width: 384rpx;
	height: 80rpx;
	line-height: 80rpx;
	border-radius: 40rpx;
	background-color: #002fa7;
	color: #fff;
	font-size: 28rpx;
	text-align: center;
}
.submit-order-disabled {
	background-color: #ccc;
}
</style>
