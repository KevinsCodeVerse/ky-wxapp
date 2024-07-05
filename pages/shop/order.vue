<template>
	<view class="page">
		<view class="header">
			<view class="title">确认下单</view>
		</view>
		<scroll-view class="content" scroll-y="true">
			<!-- 收件人信息 -->
			<view class="address-info">
				<view class="address-item">
					<view class="name-phone">{{ address.name }} {{ address.phone }}</view>
					<view class="address">{{ address.address }}</view>
				</view>
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
					<view class="fee-label">快递费</view>
					<view class="fee-value">包邮</view>
				</view>
				<view class="fee-item">
					<view class="fee-label">安装费</view>
					<view class="fee-value">￥{{ installationFee }}</view>
				</view>
			</view>

			<!-- 支付方式 -->
			<view class="payment-method">
				<view class="payment-item" v-for="method in paymentMethods" :key="method.value" @click="selectPaymentMethod(method.value)">
					<view class="payment-label">{{ method.label }}</view>
					<radio :checked="selectedPaymentMethod === method.value" color="#002FA7"></radio>
				</view>
			</view>
		</scroll-view>

		<!-- 底部 -->
		<view class="footer">
			<view class="total-price">￥{{ totalPrice }}</view>
			<button class="submit-order" @click="submitOrder">提交订单</button>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			address: {
				id: 1, // 假设是从本地存储或请求中获取的默认地址ID
				name: '蒋天福',
				phone: '18676267684',
				region: '广东省中山市小榄镇升平西路107号',
				address: ''
			},
			products: [],
			carIds: [],
			installationFee: 50,
			paymentMethods: [
				{ label: '会员账户', value: 'member' },
				{ label: '线下购买', value: 'offline' }
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
		this.getDeafultAddress();
	},
	computed: {
		totalPrice() {
			let productTotal = this.products.reduce((total, item) => {
				return total + item.sku.curPrice * item.quantity;
			}, 0);
			return (productTotal + this.installationFee).toFixed(2);
		}
	},
	methods: {
		getDeafultAddress() {
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
				console.log('orderData', orderData);
				this.$request.post({
					url: 'user/userOrder/shopCarSettlement',
					params: orderData,
					success: (res) => {
						uni.showToast({
							title: '订单提交成功',
							icon: 'success'
						});
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
						uni.showToast({
							title: '订单提交成功',
							icon: 'success'
						});
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
		}
	}
};
</script>

<style lang="scss" scoped>
.page {
	background-color: #f5f5f5;
}
.header {
	padding: 20rpx;
	background-color: #fff;
	text-align: center;
	font-size: 36rpx;
	font-weight: bold;
}
.content {
	padding: 20rpx;
}
.address-info,
.product-info,
.fee-info,
.payment-method {
	margin-bottom: 20rpx;
	background-color: #fff;
	padding: 20rpx;
	border-radius: 10rpx;
}
.address-item,
.product-item,
.fee-item,
.payment-item {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 10rpx;
}
.product-item {
	flex-direction: row;
}
.product-image {
	width: 100rpx;
	height: 100rpx;
}
.product-details {
	flex: 1;
	margin-left: 20rpx;
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
}
.total-price {
	font-size: 36rpx;
	font-weight: bold;
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
</style>
