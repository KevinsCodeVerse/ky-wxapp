<template>
	<view class="vmb-container">
		<view class="scroll-to-top">
			<u-image @click="scrollToTop" width="72rpx" height="72rpx" src="@/static/index/up.png"></u-image>
		</view>
		<view class="vmb-main">
			<view class="vmb-search" v-if="searchShow">
				<u-navbar :is-back="false" :title="shop.tenantShop.name"></u-navbar>
			</view>
			<view class="top">
				<view class="box">
					<view class="avatar">
						<image class="avatar" :src="$comm.fullPath(shop.tenantShop.icon) || ''"></image>
					</view>
					<view class="info">
						<view class="title">{{ shop.tenantShop.name }}</view>
						<view class="address">地址：{{ shop.tenantShop.address }}</view>
						<view class="phone">电话：{{ shop.tenantShop.phone }}</view>
					</view>
					<view class="icon-main">
						<view @tap="makePhoneCall(shop.tenantShop.phone)">
							<u-image width="48rpx" height="48rpx" src="@/static/index/phone.png"></u-image>
							<view>拨打</view>
						</view>
						<view @tap="openNavigation(shop.tenantShop)">
							<u-image width="48rpx" height="48rpx" src="@/static/index/Navigation.png"></u-image>
							<view>导航</view>
						</view>
					</view>
				</view>
				<view class="top-footer">
					<view class="icon">
						<u-image width="24rpx" height="24rpx" src="@/static/index/company-icon.png"></u-image>
						<view>企业信息</view>
					</view>
					<view class="line"></view>
					<view class="icon">
						<u-image width="24rpx" height="24rpx" src="@/static/index/card-icon.png"></u-image>
						<view>企业介绍</view>
					</view>
				</view>
			</view>
		</view>

		<view class="vmb-swiper">
			<u-swiper img-mode="widthFix" :list="shop.banner" height="400rpx" name="url" border-radius="20"></u-swiper>
		</view>

		<view class="vmb-waterfall">
			<view class="waterfall-row">
				<view class="vmb-warter" v-for="(item, index) in list" :key="item.id" @click="goToDetail(item.id)">
					<view class="vmb-img-wrap">
						<image class="vmb-image" :src="$comm.fullPath(item.cover)" mode="aspectFill"></image>
						<view class="img-text">会员最高省{{ item.vipPro }}元</view>
					</view>
					<view style="padding: 0 8rpx">
						<view class="vmb-title">{{ item.name }}</view>
						<view class="vmb-price">
							<span>￥</span>
							{{ item.price }}
						</view>
						<view class="vmb-MarketPrice">市场价￥{{ item.originalPrice }}</view>
					</view>
				</view>
			</view>
			<u-loadmore bg-color="rgb(240, 240, 240)" :status="loadStatus" @loadmore="onLoadMore"></u-loadmore>
		</view>
	</view>
</template>
<script>
export default {
	data() {
		return {
			searchShow: true,
			searchShow2: false,
			keyword: '',
			bindShopList: [],
			bindInfo: {
				tenantId: '',
				shopId: '',
				usId: ''
			},
			params: {
				shopId: '',
				pageNo: 1,
				pageSize: 10 // 设定每次加载的条目数
			},
			shop: {},
			loadStatus: 'loadmore',
			list: [],
			total: 0 // 总数据条目数
		};
	},
	onLoad() {
		this.getBindShopInfo();
	},

	onReachBottom() {
		if (this.loadStatus !== 'loading' && this.loadStatus !== 'nomore') {
			this.loadStatus = 'loading';
			this.onLoadMore();
		}
	},
	onPageScroll({ scrollTop }) {
		if (scrollTop >= 50) {
			this.searchShow = false;
			this.searchShow2 = true;
		}
		if (scrollTop < 50) {
			this.searchShow = true;
			this.searchShow2 = false;
		}
	},
	methods: {
		goToDetail(e) {
			console.log('e', e);
			uni.navigateTo({
				url: `/pages/shop/detail?id=${e}`
			});
		},
		// 导航
		openNavigation(e) {
			uni.openLocation({
				latitude: Number(e.latitude),
				longitude: Number(e.longitude),
				name: e.address,
				address: e.address,
				success: () => {
					console.log('导航成功');
				},
				fail: (err) => {
					console.log('导航失败', err);
				}
			});
		},
		// 拨打电话
		makePhoneCall(e) {
			uni.makePhoneCall({
				phoneNumber: e,
				success: () => {
					console.log('拨打成功');
				},
				fail: (err) => {
					console.log('拨打失败', err);
				}
			});
		},
		getBindShopInfo() {
			this.$request.post({
				url: 'user/userInfo/bindTenant',
				success: (res) => {
					this.bindShopList = res;
					this.bindInfo = res[0];
					this.params.shopId = this.bindInfo.shopId;
					this.params.infoId = this.bindInfo.tenantId;
					uni.setStorage({
						key: 'shopId',
						data: this.bindInfo.shopId
					});
					uni.setStorage({
						key: 'infoId',
						data: this.bindInfo.tenantId
					});
					uni.setStorage({
						key: 'usId',
						data: this.bindInfo.usId
					});
					this.getShopInfo();
					this.getShopList();
					console.log('绑定商家bindInfo', this.bindInfo);
				}
			});
		},
		getShopInfo() {
			this.$request.post({
				url: 'user/userInfo/indexTenantInfo',
				params: {
					infoId: this.bindInfo.tenantId,
					shopId: this.bindInfo.shopId
				},
				success: (res) => {
					this.shop = res;
					this.shop.banner = this.shop.banner.map((item) => {
						return {
							...item,
							url: this.$comm.fullPath(item.url)
						};
					});
					console.log('商家信息', this.shop);
				}
			});
		},
		getShopList() {
			console.log('this.bindInfo.shopId', this.bindInfo.shopId);
			this.$request.post({
				url: 'user/userInfo/indexProList',
				params: this.params,
				success: (res) => {
					console.log('商家列表res', res);
					this.list = res.list;
					this.total = res.total;
					if (this.list.length >= this.total) {
						this.loadStatus = 'nomore';
					} else {
						this.loadStatus = 'loadmore';
					}
				}
			});
		},
		scrollToTop() {
			uni.pageScrollTo({
				scrollTop: 0,
				duration: 300
			});
		},
		onLoadMore() {
			if (this.list.length >= this.total) {
				this.loadStatus = 'nomore';
				return;
			}
			this.params.pageNo += 1;
			this.$request.post({
				url: 'user/userInfo/indexProList',
				params: this.params,
				success: (res) => {
					console.log('更多商品列表res', res);
					if (res.list && res.list.length > 0) {
						this.list = [...this.list, ...res.list];
						if (this.list.length >= this.total) {
							this.loadStatus = 'nomore';
						} else {
							this.loadStatus = 'loadmore';
						}
					} else {
						this.loadStatus = 'nomore';
					}
				},
				fail: (err) => {
					console.error('加载更多商品失败', err);
					this.loadStatus = 'loadmore';
				}
			});
		}
	}
};
</script>

<style lang="scss" scoped>
.vmb {
	&-container {
		background: #f5f5f5;
		position: relative;
		.scroll-to-top {
			position: fixed;
			bottom: 35%;
			right: 1%;
			float: right;
			z-index: 1000;
		}
	}

	&-main {
		background: radial-gradient(87.28% 89.35% at 19.2% 4.87%, #f5ebd7 0%, #f5ebd700 100%);
	}
	&-search {
		padding: 0 25rpx;

		height: 200rpx;
		border-radius: 0 0 50rpx 50rpx;
		width: 100%;
		// position: fixed;
		::v-deep {
			.u-navbar {
				background: transparent !important;
				box-shadow: none;
				border: 0;

				.u-title {
					color: #000 !important;
				}
			}

			.u-border-bottom:after {
				border-bottom-width: 0;
			}

			.u-action {
				color: #ffffff;
			}
		}
	}

	&-swiper {
		padding: 35rpx 25rpx 25rpx 25rpx;
	}

	&-waterfall {
		padding: 0 20rpx;
		.waterfall-row {
			display: flex;
			flex-wrap: wrap;
			justify-content: space-between;
		}
	}

	&-warter {
		width: 49%;

		border-radius: 16rpx;
		margin: 5px 0;
		background-color: #ffffff;

		position: relative;
	}

	.u-close {
		position: absolute;
		top: 32rpx;
		right: 32rpx;
	}
	&-img-wrap {
		position: relative;
		.img-text {
			position: absolute;
			bottom: 0;
			left: 0%;
			text-align: center;
			width: 100%;
			height: 56rpx;
			line-height: 56rpx;
			background: #faf5eb;
			opacity: 0.9;
			font-weight: 400;
			font-size: 22rpx;
			color: #bf8739;
		}
	}

	&-image {
		height: 342rpx;
		width: 100%;
		object-fit: cover;
	}

	&-title {
		font-weight: 400;
		font-size: 26rpx;
		height: 80rpx;
		line-height: 46rpx;
		text-align: left;
		color: #000;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	&-price {
		font-weight: 700;
		font-size: 32rpx;
		line-height: 46rpx;
		color: #bf8739;

		margin-top: 5px;
		span {
			font-weight: 700;
			font-size: 24rpx;
			line-height: 46rpx;
			color: #bf8739;
		}
	}
	&-MarketPrice {
		font-weight: 400;
		font-size: 10px;
		text-align: left;
		color: #ccc;
		text-decoration: line-through;
	}
}
.top {
	margin: 0 25rpx;
	border-radius: 20rpx;
	background: #fff;
	box-shadow: 0 0 24rpx #cccccc1a;
	.box {
		display: flex;
		justify-content: space-between;
		padding: 20rpx;
		.avatar {
			width: 108rpx;
			height: 108rpx;

			border-radius: 50%;
		}
		.info {
			width: 60%;
			.title {
				font-weight: 700;
				font-size: 15px;
				text-align: left;
				color: #333;
			}
			.address {
				font-weight: 400;
				font-size: 22rpx;
				text-align: left;
				color: #999;
				white-space: nowrap;
				overflow: hidden;
				text-overflow: ellipsis;
				max-width: 300rpx;
			}
			.phone {
				font-weight: 400;
				font-size: 11px;
				text-align: left;
				color: #999;
			}
		}
		.icon-main {
			display: flex;
			margin: 10rpx 0;
			view {
				margin: 0 5rpx;
				font-weight: 400;
				font-size: 22rpx;
				line-height: 44rpx;
				text-align: center;
				color: #333;
				img {
					width: 48rpx;
					height: 48rpx;
				}
			}
		}
	}

	.top-footer {
		display: flex;
		justify-content: space-evenly;
		height: 33px;
		border-radius: 0 0 10px 10px;
		background: #e9dcc3;
		box-shadow: 0 0 12px #cccccc1a;
		padding: 15rpx 0;
		.icon {
			display: flex;
			view {
				margin: 0 10rpx;
				font-weight: 400;
				font-size: 12px;
				text-align: center;
				color: #bf8739;
			}
		}
		.line {
			width: 2px;
			height: 100%;
			background: #c5924a;
			opacity: 0.5;
		}
	}
}
</style>
