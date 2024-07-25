<template>
	<view class="u-wrap">
		<scroll-view scroll-y scroll-with-animation class="right-box">
			<view class="page-view">
				<!-- 分类列表 -->
				<view class="category-list">
					<view class="class-item" v-for="(item, index) in subCategories" :key="index">
						<view class="item-title" @tap="loadSubCategoryOrProducts(item)">
							<view class="">
								<image class="classname-img" :src="$comm.fullPath(item.cover)" mode="aspectFill"></image>
							</view>
							<view class="">{{ item.name }}</view>
						</view>
					</view>
				</view>
				<!-- 商品列表 -->
				<view class="product-list" v-if="products.length > 0">
					<view class="product-item" v-for="(product, index) in products" :key="index" @click="toShopDetail(product)">
						<image class="product-image" :src="$comm.fullPath(product.cover)" mode="aspectFit"></image>
						<view class="product-info">
							<text class="product-name">{{ product.name }}</text>
							<view v-if="unit == 1" class="product-price">{{ product.price }}积分</view>
							<view v-else class="product-price">￥{{ product.price }}</view>
							<view class="flex-box">
								<view class="">
									<view class="product-originalPrice">￥{{ product.originalPrice }}</view>
									<view v-if="unit == 1" class="right">会员价最高可省{{ product.vipPro }}积分</view>
									<view v-else class="right">会员价最高可省{{ product.vipPro }}元</view>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</scroll-view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			unit: null,
			infoId: null,
			pId: null,
			shopId: null,
			subCategories: [],
			products: []
		};
	},
	onLoad(options) {
		this.infoId = options.infoId;
		this.pId = options.pId;
		this.shopId = options.shopId;
		this.getCategories(this.pId);
		this.getProductsByCategory(this.pId);
	},
	onShow() {
		this.unit = uni.getStorageSync('unit');
	},
	methods: {
		getCategories(pId) {
			this.$request.post({
				url: 'user/userInfo/indexCategoryList',
				params: {
					infoId: this.infoId,
					pId: pId
				},
				success: (res) => {
					if (res.length > 0) {
						this.subCategories = res;
					} else {
						uni.showToast({
							icon: 'none',
							title: '没有更多分类'
						});
					}
				}
			});
		},
		getProductsByCategory(cId) {
			this.$request.post({
				url: 'user/userInfo/indexProListByCategory',
				params: {
					cId: cId,
					shopId: this.shopId
				},
				success: (res) => {
					if (res.length > 0) {
						this.products = res;
					} else {
						uni.showToast({
							icon: 'none',
							title: '没有更多商品'
						});
					}
				}
			});
		},
		toShopDetail(product) {
			uni.navigateTo({
				url: `/pages/shop/detail?id=${product.id}`
			});
		},
		loadSubCategoryOrProducts(item) {
			this.$request.post({
				url: 'user/userInfo/indexCategoryList',
				params: {
					infoId: this.infoId,
					pId: item.id
				},
				success: (res) => {
					if (res.length > 0) {
						uni.navigateTo({
							url: `/pages/classifications/classDetail?infoId=${this.infoId}&pId=${item.id}&shopId=${this.shopId}`
						});
					} else {
						uni.showToast({
							icon: 'none',
							title: '没有更多分类'
						});
					}
				}
			});
		}
	}
};
</script>

<style lang="scss" scoped>
.u-wrap {
	height: calc(100vh);
	display: flex;
	flex-direction: column;
}

.right-box {
	background-color: #fff;
}

.page-view {
	padding: 16rpx;
}

.category-list {
	display: flex;
	flex-wrap: wrap;
	justify-content: space-between;
}

.class-item {
	margin-top: 5rpx;
	display: flex;
	justify-content: space-around;
	padding: 10rpx 10rpx;
	border-radius: 8rpx;
	box-sizing: border-box;
}

.item-title {
	font-weight: 400;
	font-size: 24rpx;
	line-height: 36rpx;
	text-align: center;
	// color: #666;
	color: #000;
	font-weight: bold;
	cursor: pointer;
}

.classname-img {
	width: 150rpx;
	height: 150rpx;
}

.flex-box {
	display: flex;
	justify-content: space-between;
	.right {
		width: 204rpx;
		height: 56rpx;
		border-radius: 8rpx;
		background: #faf5eb;
		font-weight: 400;
		font-size: 22rpx;
		line-height: 56rpx;
		text-align: center;
		color: #bf8739;
	}
}

.product-list {
}

.product-item {
	display: flex;
	border-radius: 20rpx;
	margin-bottom: 16rpx;
	background-color: #fff;
	padding: 10rpx;
}

.product-image {
	width: 192rpx;
	height: 192rpx;
	border-radius: 20rpx;
	margin-right: 16rpx;
}

.product-info {
	display: flex;
	flex-direction: column;
}

.product-name {
	font-size: 30rpx;
	color: #333;
	margin-bottom: 8rpx;
	display: -webkit-box;
	-webkit-box-orient: vertical;
	-webkit-line-clamp: 2;
	overflow: hidden;
	text-overflow: ellipsis;
}

.product-price {
	font-weight: 700;
	font-size: 32rpx;
	text-align: left;
	color: #bf8739;
}

.product-originalPrice {
	font-weight: 400;
	font-size: 20rpx;
	text-align: left;
	color: #ccc;
	line-height: 46rpx;
	text-decoration: line-through;
}
</style>
