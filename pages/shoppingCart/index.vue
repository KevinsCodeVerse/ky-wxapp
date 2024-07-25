<template>
	<view>
		<view class="wrap">
			<swiper class="swiper-box" :current="swiperCurrent" @transition="transition" @animationfinish="animationfinish">
				<swiper-item class="swiper-item">
					<scroll-view class="scroll-view" scroll-y style="height: calc(100vh - 114rpx); width: 100%" @scrolltolower="reachBottom">
						<view class="page-box" v-if="goodsList.length">
							<view class="order">
								<u-checkbox-group>
									<view v-for="(item, index) in goodsList" :key="index">
										<u-checkbox
											class="item-bgc"
											shape="circle"
											:value="item.proName"
											v-model="item.checked"
											@change="checkboxChange"
											style="background-color: #fff; border-radius: 20rpx"
										>
											<view class="item">
												<view class="left">
													<image :src="$comm.fullPath(item.proCover)" mode="aspectFill"></image>
												</view>
												<view class="content">
													<view class="title u-line-2">{{ item.proName }}</view>
													<u-tag :text="formatSkuName(item.skuName)" type="info" mode="dark" />
													<view class="price">
														<view v-if="unit == 1" class="price-text">
															{{ priceInt(item.price) }}
															<text class="decimal">积分</text>
														</view>
														<view v-else class="price-text">
															<span>￥</span>
															{{ priceInt(item.price) }}
															<text class="decimal">.{{ priceDecimal(item.price) }}</text>
														</view>

														<u-number-box v-model="item.count" @change="valChange(item)"></u-number-box>
													</view>
												</view>
											</view>
										</u-checkbox>
									</view>
								</u-checkbox-group>
							</view>
						</view>
						<u-empty v-else icon-size="550rpx" src="../../../static/index/noEmty.png" text=" " class="center-empty"></u-empty>
					</scroll-view>
				</swiper-item>
			</swiper>
			<view class="footer">
				<view class="radio">
					<u-checkbox shape="circle" v-model="isAllChecked">全选</u-checkbox>
				</view>
				<view>
					<span class="text">已选{{ totalNum }}件,</span>
					<span class="total">合计:</span>

					<span v-if="unit == 2" class="unit">￥</span>
					<text v-if="unit == 2" class="decimal">{{ priceInt(totalPrice) }}.{{ priceDecimal(totalPrice) }}</text>
					<text v-if="unit == 1" class="decimal">{{ priceInt(totalPrice) }}</text>
					<span v-if="unit == 1" class="unit">积分</span>
				</view>
				<view class="btn-box">
					<button :disabled="goodsList.length == 0" :class="{ 'disabled-btn': goodsList.length == 0 }" class="btn" @click="submitOrder">确定</button>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			isAllChecked: false,
			goodsList: [],
			swiperCurrent: 0,
			totalPrice: '0.00',
			totalNum: 0,
			unit: null
		};
	},
	computed: {
		priceDecimal() {
			return (val) => {
				val = val.toString();
				return val.split('.')[1] || '00';
			};
		},
		priceInt() {
			return (val) => {
				val = val.toString();
				return val.split('.')[0];
			};
		}
	},
	watch: {
		isAllChecked(newVal) {
			this.goodsList.forEach((item) => {
				item.checked = newVal;
			});
			this.updateTotals();
		}
	},
	onShow() {
		this.unit = uni.getStorageSync('unit');
		this.getOrderList();
	},
	methods: {
		checkboxChange() {
			this.isAllChecked = this.goodsList.length > 0 && this.goodsList.every((item) => item.checked);
			this.updateTotals();
		},
		valChange(item) {
			this.updateTotals();
		},
		toggleSelectAll() {
			this.isAllChecked = !this.isAllChecked;
			this.goodsList.forEach((item) => {
				item.checked = this.isAllChecked;
			});
			this.updateTotals();
		},
		updateTotals() {
			const totalPrice = this.goodsList
				.reduce((acc, item) => {
					return item.checked ? acc + item.price * item.count : acc;
				}, 0)
				.toFixed(2);
			const totalNum = this.goodsList.reduce((acc, item) => {
				return item.checked ? acc + item.count : acc;
			}, 0);
			this.totalPrice = totalPrice;
			this.totalNum = totalNum;
		},
		formatSkuName(skuName) {
			let parsedSku = JSON.parse(skuName);
			return Object.keys(parsedSku)
				.map((key) => `${key}: ${parsedSku[key]}`)
				.join(', ');
		},
		reachBottom() {},
		getOrderList() {
			this.$request.post({
				url: 'user/userShopCar/list',
				params: {
					pageNo: 1,
					pageSize: 10
				},
				success: (res) => {
					this.goodsList = res.list.map((item) => ({
						...item,
						checked: false
					}));
					this.updateTotals();
				}
			});
		},
		submitOrder() {
			if (this.goodsList.length === 0) {
				this.showNoDataToast();
				return;
			}
			let selectedItems = this.goodsList.filter((item) => item.checked);
			let carIds = selectedItems.map((item) => item.id);
			let products = selectedItems.map((item) => ({
				pro: {
					id: item.proId,
					banner: item.proCover,
					name: item.proName,
					price: item.price
				},
				sku: {
					id: item.skuId,
					spec: item.skuName,
					curPrice: item.price
				},
				quantity: item.count
			}));
			uni.navigateTo({
				url: `/pages/shop/order?products=${encodeURIComponent(JSON.stringify(products))}&carIds=${JSON.stringify(carIds)}`
			});
		},
		showNoDataToast() {
			uni.showToast({
				title: '暂无数据',
				icon: 'none'
			});
		}
	}
};
</script>
<style lang="scss" scoped>
.page-box {
	background: #fff;
}
.order {
	width: 710rpx;
	margin: 20rpx auto;
	border-radius: 20rpx;
	box-sizing: border-box;
	padding: 20rpx;
	font-size: 28rpx;
	background-color: #fff;
}
.item-bgc {
	margin: 20rpx 0;
	background-color: #fff !important;
	border-radius: 20rpx !important;
	.item {
		margin: 20rpx 0;
		display: flex;
		justify-content: space-between;
		border-radius: 20rpx !important;
		.left {
			margin-right: 20rpx;
			image {
				width: 160rpx;
				height: 160rpx;
				border-radius: 10rpx;
			}
		}
		.content {
			flex: 1;
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			.title {
				font-weight: 400;
				font-size: 28rpx;
				text-align: left;
				color: #333;
				display: -webkit-box;
				-webkit-line-clamp: 1;
				-webkit-box-orient: vertical;
				overflow: hidden;
				text-overflow: ellipsis;
			}
			.price {
				display: flex;
				justify-content: space-between;
				align-items: center;
				font-weight: 700;
				font-size: 32rpx;
				text-align: left;
				color: #bf8739;
				.price-text {
					width: 250rpx;
					span {
						font-weight: 700;
						font-size: 24rpx;
						line-height: 46rpx;
						text-align: left;
					}
				}
			}
		}
	}
}

.total {
	margin-top: 20rpx;
	text-align: right;
	font-size: 24rpx;
	.total-price {
		font-size: 32rpx;
	}
}

.bottom {
	display: flex;
	margin-top: 40rpx;
	padding: 0 10rpx;
	justify-content: space-between;
	align-items: center;
	.btn {
		line-height: 52rpx;
		width: 160rpx;
		border-radius: 26rpx;
		border: 2rpx solid $u-border-color;
		font-size: 26rpx;
		text-align: center;
		color: $u-type-info-dark;
	}
	.evaluate {
		color: #ffffff;
		border: 2rpx solid transparent;
		background: linear-gradient(to right, #ff6034, #ee0a24);
	}
}

.center {
	text-align: center;
	margin: 200rpx auto;
	font-size: 32rpx;
	image {
		width: 164rpx;
		height: 164rpx;
		border-radius: 50%;
		margin-bottom: 20rpx;
	}
	.tips {
		font-size: 24rpx;
		color: #999999;
		margin-top: 20rpx;
	}
	.btn {
		margin: 80rpx auto;
		width: 200rpx;
		border-radius: 32rpx;
		line-height: 64rpx;
		color: #ffffff;
		font-size: 26rpx;
		background: linear-gradient(to right, #ff6034, #ee0a24);
	}
}

.wrap {
	display: flex;
	flex-direction: column;
	height: 100vh;
	width: 100%;
	.footer {
		display: flex;
		justify-content: space-around;
		position: fixed;
		height: 114rpx;
		line-height: 114rpx;
		box-shadow: 0 0 20rpx #0000001a;
		background-color: #fff;
		bottom: 0;
		left: 0;
		width: 100%;
		background-color: #fff;
		z-index: 1000;
		.radio {
			display: flex;
			font-weight: 400;
			font-size: 26rpx;
			text-align: left;
			color: #999;
		}
		.text {
			font-weight: 400;
			font-size: 26rpx;
			text-align: left;
			color: #999;
		}
		.total {
			font-weight: 400;
			font-size: 26rpx;
			text-align: left;
			color: #333;
		}
		.unit {
			font-weight: 700;
			font-size: 24rpx;
			text-align: center;
			color: #bf8739;
		}
		.decimal {
			font-weight: 700;
			font-size: 32rpx;
			text-align: center;
			color: #bf8739;
		}
		.btn-box {
			padding: 20rpx 0;
			.btn {
				width: 160rpx;
				height: 68rpx;
				line-height: 68rpx;
				border-radius: 34rpx;
				background: #002fa7;
				text-align: center;
				color: #fff;
				&.disabled-btn {
					background: #ccc;
					color: #fff;
				}
			}
		}
	}
}
.scroll-view {
	flex: 1;
	width: 100%;
}

.swiper-box {
	flex: 1;
}

.swiper-item {
	width: 100%;
	height: 100%;
}

.center-empty {
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	height: calc(100vh - 114rpx);
}
</style>
