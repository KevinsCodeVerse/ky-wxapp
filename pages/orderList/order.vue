<template>
	<view class="container">
		<u-tabs inactive-color="#999" active-color="#2E3033" :show-bar="false" :list="tabs" :current="currentTab" @change="switchTab"></u-tabs>
		<scroll-view class="orders-list" scroll-y :scroll-with-animation="true" @scrolltolower="loadMoreOrders">
			<view v-for="(order, index) in orders" :key="index" class="order-item">
				<view class="order-header">
					<view class="order-number">
						<image class="icon" src="../../static/my/order-icon.png" mode="aspectFill"></image>
						订单编号:{{ order.orderId }}
					</view>
					<view :class="['order-status', getStatusClass(order.status)]">{{ getStatus(order.status) }}</view>
				</view>
				<view v-for="item in order.userOrderPayList" :key="item.id" class="order-content">
					<image class="order-image" :src="$comm.fullPath(JSON.parse(item.proInfo).avatar)" mode="aspectFill"></image>
					<view class="order-details">
						<view class="order-name u-line-2">{{ JSON.parse(item.proInfo).title }}</view>
						<view class="order-spec">{{ formatSpecName(JSON.parse(item.proInfo).specName) }}</view>
						<view class="order-price">￥{{ item.price }}</view>
					</view>
					<view class="order-count">x{{ item.count }}</view>
				</view>
				<view class="order-line"></view>
				<view class="order-footer">
					<view class="order-total">实付: ￥{{ order.payAmount }}</view>
					<view class="order-actions">
						<button v-for="(button, index) in getButtons(order.status)" :key="index" :class="['order-button', getButtonClass(button)]">{{ button }}</button>
					</view>
				</view>
			</view>
			<view v-if="!hasMore" class="no-more">没有更多了</view>
		</scroll-view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			currentTab: 0,
			tabs: [
				{ name: '全部', index: 0 },
				{ name: '待付款', index: 1 },
				{ name: '待发货', index: 2 },
				{ name: '待收货', index: 3 },
				{ name: '已收货', index: 4 },
				{ name: '已完成', index: 5 },
				{ name: '已取消', index: 6 }
			],
			orders: [
				// {
				// 	address: '广东省-中山市-小榄镇 中山市小榄镇第十八巷子',
				// 	consignee: '半源半藏',
				// 	freightAmount: 22.0,
				// 	orderId: 8854794099,
				// 	count: 2,
				// 	type: 0,
				// 	version: 1,
				// 	usId: 106,
				// 	installAmount: 0.0,
				// 	totalAmount: 77.0,
				// 	payAmount: 75.46,
				// 	payType: 1,
				// 	createTime: 1719994530000,
				// 	phone: '13531788702',
				// 	tenantId: 8,
				// 	userOrderPayList: [
				// 		{
				// 			originalPrice: 54.0,
				// 			orderId: 8854794099,
				// 			freight: 11.0,
				// 			discountPrice: 0.0,
				// 			type: 1,
				// 			sales: 1,
				// 			afterSellStatus: 0,
				// 			couponAmount: 0.0,
				// 			payAmount: 52.92,
				// 			price: 52.92,
				// 			kdnType: 0,
				// 			prePickUp: 0,
				// 			id: 37,
				// 			shopId: 91,
				// 			skuId: 34,
				// 			address: '广东省-中山市-小榄镇 中山市小榄镇第十八巷子',
				// 			consignee: '半源半藏',
				// 			printStatus: 0,
				// 			count: 1,
				// 			updateTime: 1719994530000,
				// 			userId: 106,
				// 			billingStatus: 0,
				// 			subStatus: 0,
				// 			totalAmount: 54.0,
				// 			createTime: 1719994530000,
				// 			phone: '13531788702',
				// 			proId: 1864,
				// 			proInfo:
				// 				'{"avatar":"/files/tenant/pro/87903cde848e1f5837fe3414e83833e2.png","title":"测试酱酒","specName":"{\\"箱\\":\\"一箱\\",\\"瓶\\":\\"两瓶\\"}","specAvatar":"/files/tenant/pro/5a6954904bb5921773e770cbc8ca8935.png"}',
				// 			status: 0
				// 		},
				// 		{
				// 			originalPrice: 23.0,
				// 			orderId: 8854794099,
				// 			freight: 11.0,
				// 			discountPrice: 0.0,
				// 			type: 1,
				// 			sales: 1,
				// 			afterSellStatus: 0,
				// 			couponAmount: 0.0,
				// 			payAmount: 22.54,
				// 			price: 22.54,
				// 			kdnType: 0,
				// 			prePickUp: 0,
				// 			id: 38,
				// 			shopId: 91,
				// 			skuId: 33,
				// 			address: '广东省-中山市-小榄镇 中山市小榄镇第十八巷子',
				// 			consignee: '半源半藏',
				// 			printStatus: 0,
				// 			count: 1,
				// 			updateTime: 1719994530000,
				// 			userId: 106,
				// 			billingStatus: 0,
				// 			subStatus: 0,
				// 			totalAmount: 23.0,
				// 			createTime: 1719994530000,
				// 			phone: '13531788702',
				// 			proId: 1864,
				// 			proInfo:
				// 				'{"avatar":"/files/tenant/pro/87903cde848e1f5837fe3414e83833e2.png","title":"测试酱酒","specName":"{\\"箱\\":\\"两箱\\",\\"瓶\\":\\"一瓶\\"}","specAvatar":"/files/tenant/pro/0d643aff6157852213276416573330a9.png"}',
				// 			status: 0
				// 		}
				// 	],
				// 	id: 36,
				// 	receiptStatus: 0,
				// 	status: 0
				// }
			],
			pageNo: 1,
			pageSize: 10,
			hasMore: true,
			status: 0, // 默认为全部订单
			type: 0 // 默认为普通订单
		};
	},
	onLoad(options) {
		if (options.status) {
			this.status = parseInt(options.status);
			this.currentTab = this.status;
		}
		this.loadOrders();
	},
	methods: {
		switchTab(index) {
			this.currentTab = index;
			this.status = index; // 设置当前的状态
			this.pageNo = 1;
			this.orders = [];
			this.hasMore = true;
			this.loadOrders();
		},
		loadOrders() {
			if (!this.hasMore) return;
			this.$request.post({
				url: 'user/userOrder/orderList',
				params: {
					pageNo: this.pageNo,
					pageSize: this.pageSize,
					status: this.status === 0 ? '' : this.status - 1,
					type: this.type
				},
				success: (res) => {
					if (res.list.length < this.pageSize) {
						this.hasMore = false;
					}
					this.orders = [
						...this.orders,
						...res.list.map((order) => {
							return {
								...order,
								statusClass: this.getStatusClass(order.status)
							};
						})
					];
					this.pageNo += 1;
				}
			});
		},
		loadMoreOrders() {
			this.loadOrders();
		},
		getStatus(status) {
			switch (status) {
				case 0:
					return '待付款';
				case 1:
					return '待发货';
				case 2:
					return '待收货';
				case 3:
					return '已收货';
				case 4:
					return '已完成';
				case -1:
					return '已取消';
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
					return ['取消订单', '支付订单'];
				case 1:
					return ['订单详情', '取消订单'];
				case 2:
					return ['订单详情', '确认收货'];
				case 3:
					return ['订单详情', '申请售后'];
				case 4:
					return ['订单详情', '再来一单'];
				case -1:
					return ['订单详情', '再来一单'];
				default:
					return [];
			}
		},
		getButtonClass(button) {
			switch (button) {
				case '支付订单':
				case '确认收货':
					return 'primary-button';
				case '取消订单':
				case '订单详情':
				case '申请售后':
					return 'default-button';
				case '撤回申请':
					return 'danger-button';
				default:
					return '';
			}
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
	display: flex;
	flex-direction: column;
	background: #f5f5f5;
}
.orders-list {
	flex: 1;
	padding: 20rpx;
}
.order-item {
	margin-bottom: 20rpx;
	padding: 20rpx;
	background-color: #fff;
	border-radius: 16rpx;
	background: #fff;
	box-shadow: 0 0 24rpx #cedae61a;
}
.order-header,
.order-footer {
	display: flex;
	justify-content: space-between;
	align-items: center;
	font-size: 28rpx;
	text-align: left;
	color: #222;
	.icon {
		width: 24rpx;
		height: 24rpx;
		margin: -2rpx 7rpx;
	}
}
.order-number {
	font-size: 28rpx;
	color: #333;
}
.order-status {
	font-size: 28rpx;
	margin: 0 10rpx;
	&.cancelled {
		color: #999;
	}
	&.pending-payment {
		color: #f24848;
	}
	&.pending-shipment {
		color: #e6a23c;
	}
	&.pending-receipt {
		color: #67c23a;
	}
	&.received {
		color: #67c23a;
	}
	&.completed {
		color: #909399;
	}
}
.order-content {
	display: flex;
	margin: 20rpx 0;
}
.order-image {
	width: 150rpx;
	height: 150rpx;
	border-radius: 8rpx;
	margin-right: 20rpx;
}
.order-details {
	flex: 1;
}
.order-name {
	font-weight: 900;
	font-size: 28rpx;
	text-align: left;
	color: #222;
	margin-bottom: 10rpx;
}
.order-spec {
	font-weight: 400;
	font-size: 22rpx;
	text-align: left;
	color: #666;
	margin-bottom: 10rpx;
}
.order-price {
	font-weight: 900;
	font-size: 32rpx;
	text-align: left;
	color: #222;
}
.order-count {
	font-weight: 400;
	font-size: 26rpx;
	margin: 0 20rpx;
	text-align: center;
	display: flex;
	color: #666;
	justify-content: center;
	flex-direction: column-reverse;
}
.order-line {
	width: 100%;
	margin: 15rpx 20rpx;
	height: 2rpx;
	background: #f5f5f5;
}
.order-total {
	font-weight: 900;
	font-size: 28rpx;
	text-align: left;
	color: #222;
}
.order-actions {
	display: flex;
}
.order-button {
	width: 160rpx;
	height: 60rpx;
	line-height: 60rpx;
	padding: 0 20rpx;
	margin: 0 10rpx;
	border-radius: 20rpx;
	border: 1rpx solid #e6e6e6;
	background-color: #fff;
	color: #333;
	font-size: 28rpx;
}
.primary-button {
	width: 160rpx;
	height: 60rpx;
	line-height: 60rpx;
	border-radius: 30rpx;
	background: #002fa7;
	font-weight: 400;
	font-size: 28rpx;
	text-align: center;
	color: #fff;
}
.default-button {
	width: 160rpx;
	height: 60rpx;
	line-height: 60rpx;
	border-radius: 30rpx;
	background: #fff;
	border: 2rpx solid #ccc;
	font-size: 28rpx;
	text-align: center;
	color: #222;
}
.danger-button {
	width: 160rpx;
	height: 60rpx;
	line-height: 60rpx;
	border-radius: 30rpx;
	background: #fff;
	border: 2rpx solid #ccc;
	font-size: 28rpx;
	text-align: center;
	color: #f24848;
}
.no-more {
	text-align: center;
	color: #999;
	margin-top: 20rpx;
}
</style>
