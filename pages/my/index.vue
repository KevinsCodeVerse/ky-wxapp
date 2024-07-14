<template>
	<view class="vmb-container">
		<view class="vmb-my-header">
			<view class="u-flex user-box u-p-r-20 u-p-b-30">
				<view class="u-m-r-10">
					<u-avatar :src="pic" width="96rpx" height="96rpx"></u-avatar>
				</view>
				<view class="">
					<view class="name">范</view>
					<view class="phone">17710346133</view>
				</view>

			</view>
		</view>
		<view class="vmb-my-nav">
			<view class="nav">
				<view class="top">我的订单</view>
				<view class="gird-flex">
					<view @click="toOrder(0)" class="img-box">
						<view class="img">
							<u-image src="@/static/my/order.png" width="60rpx" height="60rpx"></u-image>
						</view>
						<view>全部订单</view>
					</view>
					<view @click="toOrder(1)" class="img-box">
						<view class="img">
							<u-image src="@/static/my/obligation.png" width="60rpx" height="60rpx"></u-image>
						</view>
						<view>待付款</view>
					</view>
					<view @click="toOrder(3)" class="img-box">
						<view class="img">
							<u-image src="@/static/my/car.png" width="60rpx" height="60rpx"></u-image>
						</view>
						<view>待收货</view>
					</view>
					<view @click="toOrder(4)" class="img-box">
						<view class="img">
							<u-image src="@/static/my/afterSale.png" width="60rpx" height="60rpx"></u-image>
						</view>
						<view>售后</view>
					</view>
				</view>
			</view>
		</view>

		<view class="main">
					<view class="">
			<u-cell-group>
				<u-cell-item @tap="openPage('pages/my/address')" icon="map" title="地址管理"></u-cell-item>
				</u-cell-group>
				</view>
			</u-cell-group>
			<view class="">
				<u-cell-group>
					<u-cell-item icon="coupon" title="商品推广" @click="openPage('pages/my/goodsTgDt')"></u-cell-item>
				</u-cell-group>
			</view>
			<view class="">
				<u-cell-group>
					<u-cell-item icon="setting" title="平台推广" @click="openPage('pages/my/pt/goodsTgDt')"></u-cell-item>
				</u-cell-group>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			pic: 'https://i.gtimg.cn/club/item/face/img/2/15922_100.gif',
			show: true
		};
	},
	onLoad() {

	},
	methods: {
		toOrder(status){
			uni.navigateTo({
				url:`/pages/orderList/order?status=${status}`
			})
		},
		openPage(path) {
			this.$u.route({
				url: path
			});
		},

	}
};
</script>

<style lang="scss" scoped>
.name {
	font-weight: 700;
	font-size: 38rpx;
	text-align: left;
	color: #000;
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
.main {
	margin-top:40rpx;
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
		background: radial-gradient(87.28% 89.35% at 19.20% 4.87%, #f5ebd7 0%, #f5ebd700 100%);
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
