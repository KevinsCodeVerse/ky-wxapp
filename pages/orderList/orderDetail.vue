<template>
	<view class="container">
		<scroll-view class="order-detail-scroll" scroll-y :scroll-with-animation="true">
			<view class="order-status-header" :class="statusClass">
				<view class="order-status-title">{{ getStatusText(orderDetail.status) }}</view>
				<view class="order-status-desc">{{ getStatusDesc(orderDetail.status) }}</view>
			</view>
			<view class="order-address">
				<u-icon style="margin-right: 15rpx" color="#c7c7c7" size="40rpx" name="map"></u-icon>
				<view>
					<text class="consignee">{{ orderDetail.consignee }}</text>
					<text class="phone">{{ orderDetail.phone }}</text>
					<view>{{ orderPays[0].address }}</view>
				</view>
			</view>
			<view class="order-items">
				<view class="order-item" v-for="item in orderPays" :key="item.id">
					<image class="order-item-image" :src="$comm.fullPath(item.proInfo.avatar)"></image>
					<view class="order-item-info">
						<view class="item-title">{{ item.proInfo.title }}</view>
						<view class="item-spec">{{ formatSpecName(item.proInfo.specName) }}</view>
						<view class="price">
							<view class="item-price">￥{{ item.price }}</view>
							<view class="item-count">x{{ item.count }}</view>
						</view>
					</view>
				</view>
				<view class="line"></view>
				<view class="pay-item">
					<view class="cope-pay">应付</view>
					<view class="monunt">{{ orderDetail.totalAmount }}</view>
				</view>
			</view>
			<view class="order-summary">
				<view class="summary-item">
					<text>订单号</text>
					<view>
						<text class="field-value">{{ orderDetail.orderId }}</text>
						<text style="margin: 0 10rpx">|</text>
						<text class="copy-icon" @click="copyOrderId">复制</text>
					</view>
				</view>
				<view class="summary-item" v-for="(field, index) in summaryFields" :key="index">
					<text>{{ field.label }}</text>
					<text class="field-value">{{ field.value }}</text>
				</view>
			</view>
		</scroll-view>
		<view class="order-footer">
			<view>实付: ￥{{ orderDetail.payAmount }}</view>
			<view>
				<button v-for="(button, index) in getButtons(orderDetail.status)" :key="index" :class="button.class" @click="handleAction(button.action, orderDetail)">
					{{ button.text }}
				</button>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			orderDetail: {},
			orderPays: [],
			summaryFields: []
		};
	},
	onLoad(options) {
		const orderId = options.orderId;
		this.fetchOrderDetail(orderId);
	},
	methods: {
		goBack() {
			uni.navigateBack();
		},
		fetchOrderDetail(orderId) {
			this.$request.post({
				url: 'user/userOrder/orderDetail',
				params: { orderId },
				success: (res) => {
					this.orderDetail = res.orderDetail;
					this.orderPays = res.orderPays.map((pay) => ({
						...pay,
						proInfo: JSON.parse(pay.proInfo)
					}));
					this.setupSummaryFields();
				}
			});
		},
		setupSummaryFields() {
			this.summaryFields = [
				{ label: '订单生成时间', value: this.orderDetail.createTime },
				{ label: '支付时间', value: this.orderDetail.payTime || '-' },
				{ label: '发货时间', value: this.orderDetail.deliveryTime || '-' },
				{ label: '快递公司', value: this.orderDetail.expressCompany || '-' },
				{ label: '物流单号', value: this.orderDetail.expressNumber || '-' },
				{ label: '收货时间', value: this.orderDetail.receiptTime || '-' },
				{ label: '交易完成时间', value: this.orderDetail.completeTime || '-' }
			];
		},
		getStatusText(status) {
			switch (status) {
				case 0:
					return '订单待付款';
				case 1:
					return '订单待发货';
				case 2:
					return '订单待收货';
				case 3:
					return '订单已收货';
				case 4:
					return '订单已完成';
				case -1:
					return '订单已取消';
				default:
					return '订单状态未知';
			}
		},
		getStatusDesc(status) {
			switch (status) {
				case 0:
					return '系统将在47:59:59后自动关闭，请尽快支付';
				case 1:
					return '您已成功下单，请耐心等待商家发货';
				case 2:
					return '商家已安排配送，请留意物流动态';
				case 3:
					return '订单已收货，感谢您的支持';
				case 4:
					return '订单已完成，感谢您的支持';
				case -1:
					return '订单已取消';
				default:
					return '';
			}
		},
		getStatusClass(status) {
			switch (status) {
				case 0:
					return 'pending-payment';
				case 1:
					return 'pending-shipment';
				case 2:
					return 'pending-receipt';
				case 3:
					return 'received';
				case 4:
					return 'completed';
				case -1:
					return 'cancelled';
				default:
					return '';
			}
		},
		getButtons(status) {
			switch (status) {
				case 0:
					return [
						{ text: '取消订单', action: 'cancel', class: 'default-button' },
						{ text: '去支付', action: 'pay', class: 'primary-button' }
					];
				case 1:
					return [{ text: '取消订单', action: 'cancel', class: 'default-button' }];
				case 2:
					return [
						{ text: '查看物流', action: 'viewLogistics', class: 'default-button' },
						{ text: '确认收货', action: 'confirmReceipt', class: 'primary-button' }
					];
				case 3:
					return [{ text: '申请售后', action: 'applyAfterSale', class: 'default-button' }];
				case 4:
					return [{ text: '申请退货', action: 'applyReturn', class: 'default-button' }];
				case -1:
					return [{ text: '再来一单', action: 'reorder', class: 'default-button' }];
				default:
					return [];
			}
		},
		handleAction(action, item) {
			switch (action) {
				case 'cancel':
					this.cancelOrder(item);
					break;
				case 'pay':
					this.payOrder(item);
					break;
				case 'viewLogistics':
					this.viewLogistics(item);
					break;
				case 'confirmReceipt':
					this.confirmReceipt(item);
					break;
				case 'applyAfterSale':
					this.applyAfterSale(item);
					break;
				case 'applyReturn':
					this.applyReturn(item);
					break;
				case 'reorder':
					this.reorder(item);
					break;
			}
		},
		cancelOrder(item) {
			// Cancel order logic with item parameter
			console.log('Cancel order', item);
		},
		payOrder(item) {
			// Pay order logic with item parameter
			console.log('Pay order', item);
		},
		viewLogistics(item) {
			// View logistics logic with item parameter
			console.log('View logistics', item);
		},
		confirmReceipt(item) {
			// Confirm receipt logic with item parameter
			console.log('Confirm receipt', item);
		},
		applyAfterSale(item) {
			// Apply after sale logic with item parameter
			console.log('Apply after sale', item);
		},
		applyReturn(item) {
			// Apply return logic with item parameter
			console.log('Apply return', item);
		},
		reorder(item) {
			// Reorder logic with item parameter
			console.log('Reorder', item);
		},
		copyOrderId() {
			uni.setClipboardData({
				data: this.orderDetail.orderId.toString(),
				success() {
					uni.showToast({ title: '订单号已复制', icon: 'none' });
				}
			});
		},
		formatSpecName(specName) {
			try {
				let spec = JSON.parse(specName);
				return Object.keys(spec)
					.map((key) => `${key}:${spec[key]}`)
					.join(', ');
			} catch (e) {
				return specName;
			}
		}
	}
};
</script>

<style lang="scss" scoped>
.container {
	height: 100vh;
	padding: 0 20rpx;
	display: flex;
	flex-direction: column;
	background: #f5f5f5;
}
.order-detail-scroll {
	flex: 1;
}
.order-status-header {
	padding: 20rpx;
	background: #e9dcc3;
	&.pending-payment {
		background-color: #fff7e6;
	}
	&.pending-shipment {
		background-color: #f0f9eb;
	}
	&.pending-receipt {
		background-color: #e0f7fa;
	}
	&.received {
		background-color: #e8f5e9;
	}
	&.completed {
		background-color: #eeeeee;
	}
	&.cancelled {
		background-color: #f8f9fa;
	}
}
.order-status-title {
	font-size: 40rpx;
	font-weight: bold;
	font-weight: 700;
	color: #000;
}
.order-status-desc {
	font-weight: 400;
	font-size: 28rpx;
	color: #666;
}
.order-address {
	display: flex;
	padding: 20rpx;
	background-color: #fff;
	font-weight: 400;
	font-size: 24rpx;
	color: #999;
	.consignee {
		font-weight: 900;
		font-size: 30rpx;
		text-align: left;
		color: #222;
	}
	.phone {
		margin: 0 10rpx;
	}
}
.order-items {
	padding: 20rpx 20rpx 10rpx 20rpx;
	background-color: #fff;
	margin-top: 20rpx;
}
.order-item {
	display: flex;
}
.pay-item {
	display: flex;
	justify-content: space-between;
	height: 40rpx;
	margin: 15rpx 0;
	.cope-pay {
		font-weight: 900;
		font-size: 28rpx;
		text-align: left;
		color: #222;
	}
	.monunt {
		font-weight: 900;
		font-size: 28rpx;
		text-align: left;
		color: #222;
	}
}
.line {
	width: 100%;
	height: 2rpx;
	background: #eee;
}
.order-item-image {
	width: 150rpx;
	height: 150rpx;
	margin-right: 20rpx;
	border-radius: 12rpx;
}
.order-item-info {
	flex: 1;
}
.item-title {
	font-size: 28rpx;
	font-weight: bold;
	color: #666;
}
.item-spec {
	font-weight: 400;
	font-size: 22rpx;
	color: #666;
}
.price {
	display: flex;
	justify-content: space-between;
	align-items: center;
	.item-price {
		font-weight: 900;
		font-size: 32rpx;
		text-align: left;
		color: #222;
	}
	.item-count {
		font-weight: 400;
		font-size: 26rpx;
		text-align: right;
		color: #666;
	}
}

.order-summary {
	padding: 20rpx;
	background-color: #fff;
	margin-top: 20rpx;
	font-weight: 400;
	font-size: 28rpx;
	text-align: left;
	color: #999;
}
.summary-item {
	display: flex;
	justify-content: space-between;
	padding: 10rpx 0;
}
.field-value {
	font-size: 28rpx;
	font-weight: 400;
	color: #222;
}
.copy-icon {
	color: #007aff;
	cursor: pointer;
}
.order-footer {
	position: fixed;
	bottom: 0;
	left: 0;
	width: 100%;
	background-color: #fff;
	padding: 20rpx;
	box-shadow: 0 -5rpx 10rpx rgba(0, 0, 0, 0.1);
	display: flex;
	justify-content: space-between;
	align-items: center;
	text-align: center;
	text {
		font-weight: 900;
		font-size: 28rpx;
		color: #222;
	}
}
.action-button {
	background: #fff;
	color: #222;
	margin-left: 10rpx;
	width: 160rpx;
	height: 60rpx;
	line-height: 60rpx;
	border-radius: 30rpx;
	border: 2rpx solid #ccc;
	text-align: center;
	font-size: 28rpx;
	padding: 0 20rpx;
}
.primary-button {
	background: #002fa7;
	color: #fff;
	margin-left: 10rpx;
	width: 160rpx;
	height: 60rpx;
	line-height: 60rpx;
	border-radius: 30rpx;
	border: 2rpx solid #ccc;
	text-align: center;
	font-size: 28rpx;
	padding: 0 20rpx;
}
.danger-button {
	color: #f24848;
	background: #fff;
	margin-left: 10rpx;
	width: 160rpx;
	height: 60rpx;
	line-height: 60rpx;
	border-radius: 30rpx;
	border: 2rpx solid #ccc;
	text-align: center;
	font-size: 28rpx;
	padding: 0 20rpx;
}
.default-button {
	background: #fff;
	border: 2rpx solid #ccc;
	margin-left: 10rpx;
	width: 160rpx;
	height: 60rpx;
	line-height: 60rpx;
	border-radius: 30rpx;
	border: 2rpx solid #ccc;
	text-align: center;
	font-size: 28rpx;
	padding: 0 20rpx;
}
</style>
