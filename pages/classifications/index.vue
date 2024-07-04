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
					<!-- 返回按钮 -->
					<view v-if="categoryStack.length > 1" class="back-button" @tap="goBack">
						<text>返回</text>
					</view>

					<!-- 分类列表 -->
					<view class="category-list">
						<view class="class-item" v-for="(item, index) in subCategories" :key="index">
							<view class="item-title" @tap="loadSubCategoryOrProducts(item)">
								<u-tag :text="item.name" mode="dark" />
							</view>
						</view>
					</view>

					<!-- 商品列表 -->
					<view class="product-list" v-if="products.length > 0">
						<view class="product-item" v-for="(product, index) in products" :key="index">
							<image class="product-image" :src="$comm.fullPath(product.cover)" mode="aspectFit"></image>

							<view class="product-info">
								<text class="product-name">{{ product.name }}</text>

								<view class="product-price">￥{{ product.price }}</view>
								<view class="flex-box">
									<view class="">
										<view class="product-originalPrice">￥{{ product.originalPrice }}</view>
										<view class="right">会员价最高可省{{ product.vipPro }}元</view>
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
			scrollTop: 0, //tab标题的滚动条位置
			oldScrollTop: 0,
			current: 0, // 预设当前项的值
			menuHeight: 0, // 左边菜单的高度
			menuItemHeight: 0, // 左边菜单item的高度
			itemId: '', // 栏目右边scroll-view用于滚动的id
			categories: [], // 一级分类数据
			subCategories: [], // 当前显示的子分类数据
			menuItemPos: [],
			arr: [],
			scrollRightTop: 0, // 右边栏目scroll-view的滚动条高度
			timer: null, // 定时器
			currentPId: -1, // 当前分类的父ID
			isLoading: false, // 防止重复请求的标志
			shopId: 8, // 商家ID，假设为8
			products: [], // 当前显示的商品列表
			categoryStack: [] // 分类堆栈
		};
	},
	onLoad() {
		this.getShopId();
	},
	methods: {
		getShopId() {
			this.$request.post({
				url: '/user/userInfo/bindTenant',
				success: (res) => {
					this.shopId = res[0].shopId;
					this.infoId = res[0].tenantId;
					this.getCategoriesAndDefaultSubCategories(-1); // 获取一级分类并默认选中第一个
					this.categoryStack.push(-1); // 初始分类ID
				},
				fail: () => {
					this.isLoading = false;
				}
			});
		},
		// 获取一级分类和默认二级分类数据
		getCategoriesAndDefaultSubCategories(pId) {
			if (this.isLoading) return; // 防止重复请求
			this.isLoading = true;
			this.$request.post({
				url: '/user/userInfo/indexCategoryList',
				params: {
					infoId: this.infoId, // 商家ID
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
							this.categories = res; // 设置一级分类
							this.loadSubCategoryOrProducts(this.categories[0]); // 默认加载第一个分类的子分类和商品
						} else {
							this.subCategories = res; // 设置子分类
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
		// 获取分类和商品数据
		getCategoriesAndProducts(pId) {
			this.$request.post({
				url: '/user/userInfo/indexCategoryList',
				params: {
					infoId: this.infoId, // 商家ID
					pId: pId
				},
				success: (res) => {
					if (res.length === 0) {
						uni.showToast({
							icon: 'none',
							title: '没有更多分类了'
						});
					} else {
						this.subCategories = res; // 设置子分类
						this.checkForProductsOrSubCategories();
					}
				},
				fail: () => {
					this.isLoading = false;
				}
			});
		},
		// 获取商品列表数据
		getProductsByCategory(cId) {
			this.$request.post({
				url: '/user/userInfo/indexProListByCategory',
				params: {
					cId: cId, // 商品分类ID
					shopId: this.shopId // 上架ID
				},
				success: (res) => {
					if (res.length === 0) {
						uni.showToast({
							icon: 'none',
							title: '没有更多商品了'
						});
					} else {
						this.products = res; // 设置商品列表
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
		// 检查是否有子分类或商品
		checkForProductsOrSubCategories() {
			if (this.subCategories.length === 0 && this.products.length === 0) {
				uni.showToast({
					icon: 'none',
					title: '没有更多数据了'
				});
			}
		},
		// 点击左边的栏目切换
		swichMenu(index) {
			this.current = index;
			this.currentPId = this.categories[index].id;
			this.categoryStack.push(this.currentPId);
			this.getCategoriesAndProducts(this.currentPId);
			this.getProductsByCategory(this.currentPId);
			this.scrollTop = index * this.menuItemHeight + this.menuItemHeight / 2 - this.menuHeight / 2;
		},
		// 获取一个目标元素的高度
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
							// 如果节点尚未生成，res值为null，循环调用执行
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
		// 观测元素相交状态
		observer() {
			this.subCategories.map((val, index) => {
				let observer = uni.createIntersectionObserver(this);
				// 检测右边scroll-view的id为itemxx的元素与right-box的相交状态
				// 如果跟.right-box底部相交，就动态设置左边栏目的活动状态
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
		// 设置左边菜单的滚动状态
		leftMenuStatus(index) {
			this.current = index;
			// 如果为0，意味着尚未初始化
			if (this.menuHeight == 0 || this.menuItemHeight == 0) {
				this.getElRect('menu-scroll-view', 'menuHeight');
				this.getElRect('u-tab-item', 'menuItemHeight');
			}
			// 将菜单活动item垂直居中
			this.scrollTop = index * this.menuItemHeight + this.menuItemHeight / 2 - this.menuHeight / 2;
		},
		// 获取右边菜单每个item到顶部的距离
		getMenuItemTop() {
			return new Promise((resolve) => {
				let selectorQuery = uni.createSelectorQuery();
				selectorQuery
					.selectAll('.class-item')
					.boundingClientRect((rects) => {
						// 如果节点尚未生成，rects值为[](因为用selectAll，所以返回的是数组)，循环调用执行
						if (!rects.length) {
							setTimeout(() => {
								this.getMenuItemTop();
							}, 10);
							return;
						}
						rects.forEach((rect) => {
							// 这里减去rects[0].top，是因为第一项顶部可能不是贴到导航栏(比如有个搜索框的情况)
							this.arr.push(rect.top - rects[0].top);
							resolve();
						});
					})
					.exec();
			});
		},
		// 右边菜单滚动
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
				// 节流
				this.timer = null;
				// scrollHeight为右边菜单垂直中点位置
				let scrollHeight = e.detail.scrollTop + this.menuHeight / 2;
				for (let i = 0; i < this.arr.length; i++) {
					let height1 = this.arr[i];
					let height2 = this.arr[i + 1];
					// 如果不存在height2，意味着数据循环已经到了最后一个，设置左边菜单为最后一项即可
					if (!height2 || (scrollHeight >= height1 && scrollHeight < height2)) {
						this.leftMenuStatus(i);
						return;
					}
				}
			}, 10);
		},
		// 加载下一级分类或商品列表
		loadSubCategoryOrProducts(item) {
			this.categoryStack.push(item.id); // 将当前分类ID入栈
			this.getCategoriesAndProducts(item.id);
			this.getProductsByCategory(item.id);
		},
		// 返回上一级分类
		goBack() {
			this.categoryStack.pop(); // 从堆栈中弹出当前分类ID
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
	/* #ifdef H5 */
	height: calc(100vh - var(--window-top));
	/* #endif */
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
	background-color: rgb(250, 250, 250);
}

.page-view {
	padding: 16rpx;
}

.back-button {
	font-size: 26rpx;
	color: #002fa7;
	font-weight: bold;
	float: right;
	margin: 15rpx 0px;
	cursor: pointer;
}

.category-list {
	display: flex;
	flex-wrap: wrap;
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
	font-size: 26rpx;
	color: #002fa7;
	font-weight: bold;
	cursor: pointer;
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
