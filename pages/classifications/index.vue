<template>
	<view class="u-wrap">
		<view class="u-menu-wrap">
			<scroll-view scroll-y scroll-with-animation class="u-tab-view menu-scroll-view" :scroll-top="scrollTop" :scroll-into-view="itemId">
				<view v-for="(item, index) in categories" :key="index" class="u-tab-item" :class="[current == index ? 'u-tab-item-active' : '']" @tap.stop="swichMenu(index)">
					<text class="u-line-1">{{ item.name }}</text>
				</view>
			</scroll-view>
			<scroll-view :scroll-top="scrollRightTop" scroll-y scroll-with-animation class="right-box" @scroll="rightScroll">
				<view class="page-view">
					<!-- 分类列表 -->
					<view class="category-list">
						<view class="class-item" v-for="(item, index) in subCategories" :key="index">
							<view class="item-title" @tap="toloadSubCategoryOrProducts(item)">
								<view class="">
									<image class="classname-img" :src="$comm.fullPath(item.cover)" mode="aspectFill"></image>
								</view>
								<view class="">{{ item.name }}</view>
							</view>
						</view>
					</view>
					<!-- 商品列表 -->
					<view class="product-list" v-if="products.length > 0">
						<view class="product-item" v-for="(product, index) in products" :key="index" @click="goToDetail(product.id)">
							<image class="product-image" :src="$comm.fullPath(product.cover)" mode="aspectFit"></image>
							<view class="product-info">
								<text class="product-name">{{ product.name }}</text>
								<view v-if="unit == 1" class="product-price">{{ product.price }}积分</view>
								<view v-else class="product-price">￥{{ product.price }}</view>
								<view class="flex-box">
									<view class="">
										<view v-if="unit == 1" class="product-originalPrice">{{ product.originalPrice }}积分</view>
										<view v-else class="product-originalPrice">￥{{ product.originalPrice }}</view>
										<view v-if="unit == 1" class="right">会员价最高可省{{ product.vipSavePrice }}积分</view>
										<view v-else class="right">会员价最高可省{{ product.vipSavePrice }}元</view>
									</view>
								</view>
							</view>
						</view>
					</view>
				</view>
			</scroll-view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			unit: null,
			scrollTop: 0,
			oldScrollTop: 0,
			current: 0,
			menuHeight: 0,
			menuItemHeight: 0,
			itemId: '',
			categories: [],
			subCategories: [],
			menuItemPos: [],
			arr: [],
			scrollRightTop: 0,
			timer: null,
			currentPId: -1,
			isLoading: false,
			shopId: '',
			products: [],
			categoryStack: []
		};
	},
	onLoad() {},
	onShow() {
		this.getShopId();
		this.unit = uni.getStorageSync('unit');
	},
	methods: {
		goToDetail(e) {
			uni.navigateTo({
				url: `/pages/shop/detail?id=${e}`
			});
		},
		getShopId() {
			this.$request.post({
				url: 'user/userInfo/bindTenant',
				success: (res) => {
					this.shopId = res[0].shopId;
					this.infoId = res[0].tenantId;
					this.getCategoriesAndDefaultSubCategories(-1);
					this.categoryStack.push(-1);
				},
				fail: () => {
					this.isLoading = false;
				}
			});
		},
		getCategoriesAndDefaultSubCategories(pId) {
			if (this.isLoading) return;
			this.isLoading = true;
			this.$request.post({
				url: 'user/userInfo/indexCategoryList',
				params: {
					infoId: this.infoId,
					pId: pId
				},
				success: (res) => {
					if (res.length === 0) {
						uni.showToast({
							icon: 'none',
							title: '没有更多分类了'
						});
					} else {
						if (pId === -1) {
							this.categories = res;
							if (this.categories.length > 0) {
								this.currentPId = this.categories[0].id;
								this.getCategoriesAndProducts(this.currentPId);
								this.getProductsByCategory(this.currentPId);
							}
						} else {
							this.subCategories = res;
							this.checkForProductsOrSubCategories();
						}
					}
					this.isLoading = false;
					this.$nextTick(() => {
						this.observer();
					});
				},
				fail: () => {
					this.isLoading = false;
				}
			});
		},
		getCategoriesAndProducts(pId) {
			this.$request.post({
				url: 'user/userInfo/indexCategoryList',
				params: {
					infoId: this.infoId,
					pId: pId
				},
				success: (res) => {
					if (res.length === 0) {
						uni.showToast({
							icon: 'none',
							title: '没有更多分类了'
						});
					} else {
						this.subCategories = res;
						this.checkForProductsOrSubCategories();
					}
				},
				fail: () => {
					this.isLoading = false;
				}
			});
		},
		getProductsByCategory(cId) {
			this.$request.post({
				url: 'user/userInfo/indexProListByCategory',
				params: {
					cId: cId,
					shopId: this.shopId,
					infoId: this.infoId,
				},
				success: (res) => {
					if (res.length === 0) {
						uni.showToast({
							icon: 'none',
							title: '没有更多商品了'
						});
					} else {
						this.products = res;
					}
				},
				fail: () => {
					uni.showToast({
						icon: 'none',
						title: '加载商品失败'
					});
				}
			});
		},
		checkForProductsOrSubCategories() {
			if (this.subCategories.length === 0 && this.products.length === 0) {
				uni.showToast({
					icon: 'none',
					title: '没有更多数据了'
				});
			}
		},
		swichMenu(index) {
			this.current = index;
			this.currentPId = this.categories[index].id;
			this.categoryStack.push(this.currentPId);
			this.getCategoriesAndProducts(this.currentPId);
			this.getProductsByCategory(this.currentPId);
			this.scrollTop = index * this.menuItemHeight + this.menuItemHeight / 2 - this.menuHeight / 2;
		},
		getElRect(elClass, dataVal) {
			return new Promise((resolve, reject) => {
				const query = uni.createSelectorQuery().in(this);
				query
					.select('.' + elClass)
					.fields(
						{
							size: true
						},
						(res) => {
							if (!res) {
								setTimeout(() => {
									this.getElRect(elClass, dataVal);
								}, 10);
								return;
							}
							this[dataVal] = res.height;
							resolve();
						}
					)
					.exec();
			});
		},
		observer() {
			this.subCategories.map((val, index) => {
				let observer = uni.createIntersectionObserver(this);
				observer
					.relativeTo('.right-box', {
						top: 0
					})
					.observe('#item' + index, (res) => {
						if (res.intersectionRatio > 0) {
							let id = res.id.substring(4);
							this.leftMenuStatus(id);
						}
					});
			});
		},
		leftMenuStatus(index) {
			this.current = index;
			if (this.menuHeight == 0 || this.menuItemHeight == 0) {
				this.getElRect('menu-scroll-view', 'menuHeight');
				this.getElRect('u-tab-item', 'menuItemHeight');
			}
			this.scrollTop = index * this.menuItemHeight + this.menuItemHeight / 2 - this.menuHeight / 2;
		},
		getMenuItemTop() {
			return new Promise((resolve) => {
				let selectorQuery = uni.createSelectorQuery();
				selectorQuery
					.selectAll('.class-item')
					.boundingClientRect((rects) => {
						if (!rects.length) {
							setTimeout(() => {
								this.getMenuItemTop();
							}, 10);
							return;
						}
						rects.forEach((rect) => {
							this.arr.push(rect.top - rects[0].top);
							resolve();
						});
					})
					.exec();
			});
		},
		rightScroll(e) {
			this.oldScrollTop = e.detail.scrollTop;
			if (this.arr.length == 0) {
				this.getMenuItemTop();
			}
			if (this.timer) return;
			if (!this.menuHeight) {
				this.getElRect('menu-scroll-view', 'menuHeight');
			}
			setTimeout(() => {
				this.timer = null;
				let scrollHeight = e.detail.scrollTop + this.menuHeight / 2;
				for (let i = 0; i < this.arr.length; i++) {
					let height1 = this.arr[i];
					let height2 = this.arr[i + 1];
					if (!height2 || (scrollHeight >= height1 && scrollHeight < height2)) {
						this.leftMenuStatus(i);
						return;
					}
				}
			}, 10);
		},
		toloadSubCategoryOrProducts(item) {
			this.$request.post({
				url: 'user/userInfo/indexCategoryList',
				params: {
					infoId: this.infoId,
					pId: item.id
				},
				success: (res) => {
					if (res.length == 0) {
						uni.showToast({
							icon: 'none',
							title: '没有更多分类'
						});
					} else {
						uni.navigateTo({
							url: `/pages/classifications/classDetail?infoId=${this.infoId}&pId=${item.id}&shopId=${this.shopId}`
						});
					}
				}
			});
		},
		loadSubCategoryOrProducts(item) {
			this.categoryStack.push(item.id);
			this.getCategoriesAndProducts(item.id);
			this.getProductsByCategory(item.id);
		},
		goBack() {
			this.categoryStack.pop();
			const previousCategoryId = this.categoryStack[this.categoryStack.length - 1];
			this.getCategoriesAndProducts(previousCategoryId);
			this.getProductsByCategory(previousCategoryId);
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

.u-menu-wrap {
	flex: 1;
	display: flex;
	overflow: hidden;
}

.u-tab-view {
	width: 200rpx;
	height: 100%;
	background: #f6f6f6;
}

.u-tab-item {
	height: 110rpx;
	box-sizing: border-box;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 26rpx;
	color: #444;
	font-weight: 400;
	line-height: 1;
}

.u-tab-item-active {
	position: relative;
	color: #000;
	font-size: 30rpx;
	font-weight: 600;
	background: #fff;
	border-radius: 15rpx;

	&:before {
		content: '';
		position: absolute;
		height: 32rpx;
		left: 0;
		top: 39rpx;
	}
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
