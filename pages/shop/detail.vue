<template>
	<view class="container">
		<scroll-view class="content" scroll-y="true">
			<!-- 顶部图片 -->
			<view class="banner">
				<image class="banner-image" mode="aspectFill" :src="$comm.fullPath(pro.banner)"></image>
			</view>

			<!-- 商品信息 -->
			<view class="product-info">
				<view class="price">
					<span class="unit">￥</span>
					{{ pro.price }}
					<span class="old-price">市场价￥{{ pro.originalPrice }}</span>
				</view>
				<view class="product-name">{{ pro.name }}</view>
			</view>

			<!-- 其他信息 -->
			<view class="additional-info">
				<view class="info-item">
					<view class="left">
						<view class="img">
							<u-image width="28rpx" height="28rpx" src="@/static/index/set-money.png" mode="aspectFill"></u-image>
						</view>
						<view>规格</view>
					</view>
					<view @click="showPopup('spec')" class="left">
						<view class="text">选择规格</view>
						<view class="">
							<u-icon name="arrow-right"></u-icon>
						</view>
					</view>
				</view>
			</view>

			<view>
				<u-divider half-width="50">商品详情</u-divider>
			</view>

			<!-- 产品描述 -->
			<view class="product-description">
				<rich-text :nodes="pro.description"></rich-text>
			</view>

			<view v-if="!pro.description">
				<u-divider half-width="50">没有更多了</u-divider>
			</view>
		</scroll-view>

		<!-- 底部按钮 -->
		<view class="bottom-bar">
			<view class="bottom-bar-item">
				<u-icon name="share" size="48rpx" color="#666"></u-icon>
				<text>分享</text>
			</view>
			<view class="bottom-bar-item">
				<u-icon name="shopping-cart" size="48rpx" color="#666"></u-icon>
				<text>购物车</text>
			</view>
			<view class="bottom-bar-item" @click="showPopup('cart')">
				<button class="addCart">加入购物车</button>
			</view>
			<view class="bottom-bar-item" @click="showPopup('buy')">
				<button class="buy-now">立即购买</button>
			</view>
		</view>

		<!-- 规格选择弹窗 -->
		<u-popup v-model="show" mode="bottom" border-radius="14">
			<view class="popup-header">
				<view></view>
				<view>选择规格</view>
				<u-icon name="close" size="40rpx" color="#999" @tap="closePopup"></u-icon>
			</view>
			<view class="popup-content">
				<view class="popup-item">
					<image class="popup-image" mode="aspectFit" :src="$comm.fullPath(popupData.currentSku.cover || pro.banner)"></image>
					<view class="right">
						<view class="popup-price">￥{{ popupData.totalPrice }}</view>
						<view class="quantity-selector">
							<text>数量</text>
							<u-number-box
								:value="popupData.quantity"
								:min="1"
								:max="popupData.currentSku.stock || pro.stock"
								@change="onQuantityChange"
								positive-integer
							></u-number-box>
						</view>
					</view>
				</view>

				<view class="specs-selector">
					<view v-for="(group, groupName) in groupedSpecList" :key="groupName" v-if="group.length > 0">
						<view class="specs-title">{{ groupName }}</view>
						<view class="specs-options">
							<view
								v-for="(spec, index) in group"
								:key="index"
								class="specs-option"
								:class="{ active: isSelected(groupName, spec) }"
								@tap="selectSpec(groupName, spec)"
							>
								<text>{{ spec.name }}</text>
							</view>
						</view>
					</view>
				</view>
			</view>
			<view class="popup-footer">
				<view class="popup-btn" @tap="confirmJoinCart">加入购物车</view>
				<view class="popup-btn buy-now" @tap="confirmBuyNow">立即购买</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
export default {
	data() {
		return {
			pro: {
				id: null,
				banner: '',
				price: 0,
				originalPrice: null,
				name: '',
				description: '',
				stock: 0
			},
			specList: [],
			skuList: [],
			selectedSpecs: {},
			popupData: {
				currentSku: {},
				quantity: 1,
				totalPrice: 0
			},
			show: false,
			action: null, // 用于标识是加入购物车还是立即购买
			addedCartId: null // 用于存储加入购物车后的id
		};
	},
	onLoad(options) {
		const id = options.id;
		this.getShopDetail(id);
	},
	computed: {
		groupedSpecList() {
			const groups = this.specList.reduce((acc, spec) => {
				if (spec.name && spec.parentName) {
					if (!acc[spec.parentName]) {
						acc[spec.parentName] = [];
					}
					acc[spec.parentName].push(spec);
				}
				return acc;
			}, {});
			return groups;
		}
	},
	watch: {
		'popupData.quantity'(newVal, oldVal) {
			this.calculateTotalPrice();
		},
		'popupData.currentSku'(newVal, oldVal) {
			this.calculateTotalPrice();
		}
	},
	methods: {
		getShopDetail(id) {
			this.$request.post({
				url: '/user/userShopCar/proDetail',
				params: {
					proId: id
				},
				success: (res) => {
					this.pro = res.pro;
					this.specList = res.specList;
					this.skuList = res.skuList;
					this.defaultSelectSpec();
					console.log('详情', res);
				}
			});
		},
		showPopup(action) {
			this.show = true;
			this.action = action;
			this.defaultSelectSpec();
			this.resetPopupData();
		},
		closePopup() {
			this.show = false;
		},
		defaultSelectSpec() {
			Object.keys(this.groupedSpecList).forEach((groupName) => {
				const group = this.groupedSpecList[groupName];
				if (Array.isArray(group) && group.length > 0) {
					this.selectSpec(groupName, group[0]);
				}
			});
		},
		confirmJoinCart() {
			if (!this.popupData.currentSku.id) {
				uni.showToast({
					title: '请选择规格',
					icon: 'none'
				});
				return;
			}
			if (this.popupData.currentSku.stock < this.popupData.quantity) {
				uni.showToast({
					title: '库存不足',
					icon: 'none'
				});
				this.popupData.quantity = 1; // 恢复数量为 1
				return;
			}
			this.addCart();
		},
		confirmBuyNow() {
			if (!this.popupData.currentSku.id) {
				uni.showToast({
					title: '请选择规格',
					icon: 'none'
				});
				return;
			}
			this.buyNow();
		},
		addCart() {
			console.log('pro', this.pro);
			console.log('this.popupData.currentSku.id', this.popupData.currentSku.id);
			this.$request.post({
				url: '/user/userShopCar/addShopCar',
				params: {
					proId: this.pro.id,
					skuId: this.popupData.currentSku.id
				},
				success: (res) => {
					if (isNaN(res)) {
						uni.showToast({
							title: '该商品已加入购物车',
							icon: 'none'
						});
						return;
					}
					uni.showToast({
						title: '加入购物车成功',
						icon: 'none'
					});
					this.addedCartId = res; // 保存加入购物车后的id
					if (this.popupData.quantity > 1) {
						this.editCart();
					}
				}
			});
		},
		editCart() {
			this.$request.post({
				url: '/user/userShopCar/editShopCar',
				params: {
					id: this.addedCartId,
					count: this.popupData.quantity
				},
				success: (res) => {
					uni.showToast({
						title: '购物车更新成功',
						icon: 'none'
					});
					this.popupData.quantity = 1; // 重置数量为 1
				}
			});
		},
		buyNow() {
			const pro = encodeURIComponent(JSON.stringify(this.pro));
			const sku = encodeURIComponent(JSON.stringify(this.popupData.currentSku));
			const quantity = this.popupData.quantity;
			uni.navigateTo({
				url: `/pages/shop/order?pro=${pro}&sku=${sku}&quantity=${quantity}`
			});
		},
		isSelected(groupName, spec) {
			return this.selectedSpecs[groupName] && this.selectedSpecs[groupName].id === spec.id;
		},
		selectSpec(groupName, spec) {
			this.$set(this.selectedSpecs, groupName, spec);
			this.updateCurrentSku();
			this.popupData.quantity = 1; // 重置数量为 1
		},
		updateCurrentSku() {
			const selectedSpecNames = Object.keys(this.selectedSpecs).reduce((acc, key) => {
				const name = this.selectedSpecs[key].name;
				if (name) acc[key] = name;
				return acc;
			}, {});
			this.popupData.currentSku =
				this.skuList.find((sku) => {
					const skuSpec = JSON.parse(sku.spec);
					return Object.keys(selectedSpecNames).every((key) => skuSpec[key] === selectedSpecNames[key]);
				}) || {};
			this.popupData.totalPrice = this.popupData.currentSku.curPrice || this.pro.price;
		},
		onQuantityChange(event) {
			const value = parseInt(event.value, 10);
			if (value > this.popupData.currentSku.stock) {
				uni.showToast({
					title: '库存不足',
					icon: 'none'
				});
				this.popupData.quantity = 1; // 恢复数量为 1
			} else if (value < 1) {
				this.popupData.quantity = 1;
			} else {
				this.popupData.quantity = value;
			}
			this.calculateTotalPrice();
		},
		calculateTotalPrice() {
			this.popupData.totalPrice = (this.popupData.currentSku.curPrice || this.pro.price) * this.popupData.quantity;
		},
		resetPopupData() {
			this.popupData.quantity = 1;
			this.popupData.totalPrice = this.popupData.currentSku.curPrice || this.pro.price;
		}
	}
};
</script>

<style lang="scss" scoped>
.container {
	display: flex;
	flex-direction: column;
	height: 100vh;
	background: #f5f5f5;
	overflow: hidden;
}
.content {
	flex: 1;
	overflow-y: auto;
	margin-bottom: 100rpx; /* 底部按钮高度 */
}
.banner {
	position: relative;
}
.banner-image {
	display: block;
	width: 100%;
	height: 750rpx;
}
.product-info {
	padding: 20rpx;
	background-color: #fff;
	margin-bottom: 25rpx;
}
.price {
	font-weight: 700;
	font-size: 54rpx;
	line-height: 52rpx;
	text-align: left;
	color: #bf8739;
	.unit {
		font-size: 32rpx;
		line-height: 46rpx;
		text-align: left;
		color: #bf8739;
	}
	.old-price {
		font-weight: 400;
		font-size: 22rpx;
		line-height: 46rpx;
		text-align: left;
		color: #ccc;
		text-decoration: line-through;
		margin: 0 15rpx;
	}
}
.product-name {
	font-weight: 700;
	font-size: 36rpx;
	line-height: 44rpx;
	text-align: left;
	color: #000;
	display: -webkit-box;
	-webkit-line-clamp: 2;
	-webkit-box-orient: vertical;
	overflow: hidden;
	text-overflow: ellipsis;
}
.additional-info {
	padding: 20rpx;
	background-color: #fff;
	display: flex;
	justify-content: space-between;
}
.info-item {
	display: flex;
	flex: 1;
	justify-content: space-between;
	font-weight: 400;
	font-size: 28rpx;
	text-align: left;
	color: #999;
	background-color: #fff;
	.left {
		display: flex;
		.img {
			padding: 5rpx 0;
			margin: 0 10rpx;
		}
		.text {
			font-weight: 400;
			font-size: 28rpx;
			margin: 0 5rpx;
			text-align: right;
			color: #002fa7;
		}
	}
}
.info-item u-icon {
	margin-right: 10rpx;
}
.product-description {
	padding: 20rpx 0;
	background-color: #fff;
	margin-bottom: 20rpx;
}
.bottom-bar {
	position: fixed;
	bottom: 0;
	width: 100%;
	display: flex;
	justify-content: space-evenly;
	background-color: #fff;
	border-top: 1px solid #f1f1f1;
	padding: 10rpx 0;
}
.bottom-bar-item {
	display: flex;
	flex-direction: column;
	align-items: center;
	text {
		font-weight: 400;
		font-size: 20rpx;
		text-align: center;
		color: #222;
	}
	.addCart {
		width: 240rpx;
		height: 80rpx;
		line-height: 80rpx;
		border-radius: 40rpx;
		background: #e9dcc3;
		font-weight: 700;
		font-size: 28rpx;
		text-align: center;
		color: #333;
	}
	.buy-now {
		width: 240rpx;
		height: 80rpx;
		line-height: 80rpx;
		border-radius: 40rpx;
		background-color: #002fa7;
		font-weight: 700;
		font-size: 28rpx;
		text-align: center;
		color: #fff;
	}
}
.popup-header {
	display: flex;
	justify-content: space-between;
	padding: 20rpx;
	border-bottom: 2rpx solid #f1f1f1;
	font-weight: 700;
	font-size: 34rpx;
	color: #000;
}
.popup-content {
	padding: 0 30rpx;
}
.popup-item {
	display: flex;
	align-items: center;
	border-bottom: 2rpx solid #f1f1f1;
	padding: 30rpx 0;
	.right {
		width: 80%;
		margin-left: 20rpx;
	}
}
.popup-image {
	width: 152rpx;
	height: 152rpx;
	border-radius: 12rpx;
	background: #fff;
}
.popup-price {
	font-weight: 900;
	font-size: 40rpx;
	text-align: left;
	color: #bf8739;
}
.quantity-selector {
	display: flex;
	justify-content: space-between;
	padding: 20rpx 0;
	font-weight: 400;
	font-size: 32rpx;
	text-align: left;
	color: #222;
}
.popup-footer {
	display: flex;
	justify-content: space-between;
	padding: 20rpx;
	margin-bottom: 20rpx;
	border-top: 1px solid #f1f1f1;
}
.popup-btn {
	width: 332rpx;
	height: 80rpx;
	line-height: 80rpx;
	border-radius: 40rpx;
	background: #e9dcc3;
	font-weight: 700;
	font-size: 28rpx;
	text-align: center;
	color: #333;
}
.popup-btn.buy-now {
	width: 332rpx;
	height: 80rpx;
	line-height: 80rpx;
	border-radius: 40rpx;
	background-color: #002fa7;
	font-weight: 700;
	font-size: 28rpx;
	text-align: center;
	color: #fff;
}
//规格
.specs-selector {
	padding: 20rpx;
}
.specs-title {
	font-weight: 400;
	font-size: 28rpx;
	text-align: left;
	color: #222;
	margin: 15rpx 0;
}
.specs-options {
	display: flex;
	flex-wrap: wrap;
}
.specs-option {
	border-radius: 32rpx;
	background: #f5f5f5;
	font-weight: 400;
	font-size: 22rpx;
	padding: 20rpx 30rpx;
	margin-right: 10rpx;
	border: 2rpx solid #f1f1f1;
	border-radius: 16rpx;
}
.specs-option.active {
	background: #e9dcc3;
	font-weight: 400;
	font-size: 22rpx;
	text-align: left;
	color: #333;
}
</style>
