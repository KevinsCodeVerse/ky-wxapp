<template>
	<view class="page">
		<scroll-view class="content" scroll-y="true">
			<!-- 收件人信息 -->
			<view class="address-box">
				<view class="address-info">
					<view v-if="address.name" class="address-item">
						<u-icon size="40rpx" class="icon" name="map" color="#3c3c3c"></u-icon>
						<view class="address-details">
							<view class="name-phone">{{ address.name }} {{ address.phone }}</view>
							<view class="address">{{ address.address }}</view>
						</view>
					</view>
					<view v-else class="address-item">
						<u-icon color="#3c3c3c" size="40rpx" class="icon" name="map"></u-icon>
						<view class="add-address">+添加收货地址</view>
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
						<view class="product-price">￥{{ item.pro.price }}</view>
					</view>
					<view class="product-quantity">x{{ item.quantity }}</view>
				</view>
			</view>

			<!-- 费用信息 -->
			<view class="fee-info">
				<view class="fee-item">
					<view class="fee-label">合计</view>
					<view class="fee-value">￥{{ totalPrice }}</view>
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
				<span class="total-price-value">￥{{ totalPrice }}</span>
			</view>
			<button :class="{ 'submit-order': true, 'submit-order-disabled': !address.name }" @click="submitOrder" :disabled="!address.name">提交订单</button>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			address: {},
			products: [],
			carIds: [],
			paymentMethods: [
				{ label: '会员账户', value: 'member', icon: require('@/static/index/vip-icon.png') },
				{ label: '线下购买', value: 'offline', icon: require('@/static/index/shop-icon.png') }
			],
			selectedPaymentMethod: 'member'
		};
	},
	onLoad(options) {
		// 获取上一页传递的参数
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
		this.getDefaultAddress();
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
				},
				fail: (err) => {
					uni.showToast({
						title: '订单提交失败',
						icon: 'none'
					});
				}
			});
		}
	}
};
</script>

<style lang="scss" scoped>
.page {
	background-color: #f5f5f5;
	padding: 20rpx;
}

.content {
}
.address-box {
	background-color: #fff;
	border-radius: 10rpx;
	margin: 20rpx 0;
}
.address-info {
	background-color: #fff;
	padding: 20rpx 0;
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
.name-phone {
	font-weight: bold;
	font-size: 30rpx;
	margin-bottom: 10rpx;
}
.address {
	color: #666;
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
	color: #666;
}
.fee-value {
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
	font-size: 30rpx;
	color: #666;
}
.total-price-value {
	font-size: 36rpx;
	font-weight: bold;
	color: #222;
}
.submit-order {
	width: 200rpx;
	height: 60rpx;
	background-color: #002fa7;
	color: #fff;
	font-size: 28rpx;
	text-align: center;
	line-height: 60rpx;
	border-radius: 30rpx;
}
.submit-order-disabled {
	background-color: #ccc;
}
</style>
