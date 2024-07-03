<template>
	<view>
		<view style="display: flex;justify-content: space-between;background-color: #fff;padding: 24rpx 52rpx">
			<view style="display: flex;align-items: center;gap: 10rpx;" @click="openSx(1)">
				<view style="font-size: 28rpx;">{{zt}}</view>
				<u-icon name="arrow-down-fill" size="14"></u-icon>
			</view>
			<view style="display: flex;align-items: center;gap: 10rpx;" @click="openSx(2)">
				<view style="font-size: 28rpx;">{{tg}}</view>
				<u-icon name="arrow-down-fill" size="14"></u-icon>
			</view>
			<view style="display: flex;align-items: center;gap: 10rpx;" @click="openSx(3)">
				<view style="font-size: 28rpx;">{{sort}}</view>
				<u-icon name="arrow-down-fill" size="14"></u-icon>
			</view>
		</view>
		<!-- 列表 -->
		<view>
			<scroll-view scroll-y="true" class="scroll-Y content" @scrolltolower="getList">
				<view style="background-color: #fff;margin: 24rpx 32rpx;border-radius: 24rpx;padding: 16rpx 24rpx;"
					v-for="(item,index) in 10">
					<view style="display: flex;flex-direction: column;justify-content: space-between;gap: 35rpx;">
						<view style="display: flex;justify-content: space-between;">
							<view style="display: flex;gap: 12rpx;align-items: center;">
								<u-image width="44rpx" height="44rpx" src="https://cdn.uviewui.com/uview/album/1.jpg"
									shape="circle"></u-image>
								<view style="font-size: 26rpx;color: #333;">
									陈逸诗
								</view>
							</view>
							<view>
								<view v-html="getStatus(index)"></view>
							</view>
						</view>

						<view style="display: flex;gap: 20rpx;">
							<view>
								<u-image width="112rpx" height="112rpx" src="https://cdn.uviewui.com/uview/album/1.jpg"
									border-radius="20rpx"></u-image>
							</view>
							<view
								style="display: flex;flex-direction: column;justify-content: space-between;width: -webkit-fill-available;">
								<view style="display: flex;justify-content: space-between;">
									<view style="font-weight: 700;font-size: 28rpx;color: #000;">
										商家名称
									</view>
									<view style="font-size: 28rpx;color: #aaa;">
										直推
									</view>
								</view>
								<view style="font-size: 24rpx;color: #aaa;">
									这里是商品名字这里是商品名字这里是商品名字这里是商品名字这里是商品名字
								</view>
							</view>

						</view>
						<view style="display: flex;justify-content: space-around;">
							<view>
								<view style="font-size: 24rpx;text-align: left;color: #aaa;">
									付款金额
								</view>
								<view style="font-size: 24rpx;text-align: left;color: #f2a600;font-weight: 700;">￥178
								</view>
							</view>
							<view>
								<view style="font-size: 24rpx;text-align: left;color: #aaa;">
									提成比
								</view>
								<view style="font-size: 24rpx;text-align: left;color: #f2a600;font-weight: 700;">0.29%
								</view>
							</view>
							<view>
								<view style="font-size: 24rpx;text-align: left;color: #aaa;">
									预估提成
								</view>
								<view style="font-size: 24rpx;text-align: left;color: #f2a600;font-weight: 700;">￥11.06
								</view>
							</view>
						</view>
						<view style="font-size: 26rpx;text-align: left;color: #aaa;">
							创建时间：2023-10-09 10:10:10
						</view>
					</view>


				</view>
			</scroll-view>
		</view>

		<!-- 底部bar -->
		<view
			style="position: absolute;padding: 30rpx 40rpx 50rpx 40rpx;border-radius: 20rpx 20rpx 0 0;background-color: #fff;bottom: 0;width: 100vw;">
			<view style="display: flex;justify-content: space-between;">
				<view @click="openPage('/pages/my/goodsTgDt',1)"
					style="display: flex;flex-direction: column;align-items: center;width: 180rpx;height: 100rpx;justify-content: center;">
					<u-icon name="home" color="#999" size="45"></u-icon>
					<view style="font-size: 20rpx;color: #999;">
						首页
					</view>
				</view>
				<view @click="openPage('/pages/my/team',1)"
					style="display: flex;flex-direction: column;align-items: center;width: 180rpx;height: 100rpx;justify-content: center;">
					<u-icon name="account" color="#999" size="45"></u-icon>
					<view style="font-size: 20rpx;color: #999;">
						团队
					</view>
				</view>
				<view @click="openPage('/pages/my/fyJl',1)"
					style="display: flex;flex-direction: column;align-items: center;width: 180rpx;height: 100rpx;justify-content: center;">
					<u-icon name="rmb-circle" color="#999" size="45"></u-icon>
					<view style="font-size: 20rpx;color: #999;">
						分佣
					</view>
				</view>
			</view>
		</view>

		<!-- 弹出层 -->
		<view>
			<u-select v-model="sxDialog" mode="single-column" :list="sxList" @confirm="sx"></u-select>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				params: {
					tg: "",
					zt: "",
					sort: ""
				},
				sxDialog: false,
				sxList: [],
				tgList: [{
					value: "1-0",
					label: '直推/间推'
				}, {
					value: "1-1",
					label: '直推'
				}, {
					value: "1-2",
					label: '间推'
				}],
				ztList: [{
					value: "2-0",
					label: '全部状态'
				}, {
					value: "2-1",
					label: '冻结中'
				}, {
					value: "2-2",
					label: '可用'
				}, {
					value: "2-3",
					label: '用户退款'
				}],
				sortList: [{
					value: "3-1",
					label: '升序'
				}, {
					value: "3-2",
					label: '降序'
				}],
				zt: "全部状态",
				tg: "直推/间推",
				sort: "排序",
			}
		},
		methods: {
			getStatus(e) {
				console.log("e1:", e);
				if (e % 2 == 0) {
					console.log("123123");
					return "<div style='color: #F2A600'>审核中</div>"
				} else {
					return "<div style='color: #aaa'>已通过</div>"
				}
			},
			getList() {
				console.log("触底");
			},
			openPage(path, type) {
				if (!path) {
					uni.navigateBack({
						delta: 1
					});
				}
				var pages = getCurrentPages() // 获取栈实例
				let currentRoute = pages[pages.length - 1].route; // 获取当前页面路由
				if (path === currentRoute) {
					return;
				}
				if (type === 1) {
					uni.redirectTo({
						url: path
					})
				} else {
					this.$u.route({
						url: path
					});
				}
			},
			openSx(type) {
				if (type === 1) {
					this.sxList = this.ztList
				}
				if (type === 2) {
					this.sxList = this.tgList
				}
				if (type === 3) {
					this.sxList = this.sortList
				}
				this.sxDialog = true
			},
			sx(e) {
				console.log("e:", e);
				var value = e[0].value.split("-")
				if (value[0] === "1") {
					this.params.tg = value[1]
					this.tg = e[0].label
				}
				if (value[0] === "2") {
					this.params.zt = value[1]
					this.zt = e[0].label
				}
				if (value[0] === "3") {
					this.params.sort = value[1]
					this.sort = e[0].label
				}
				console.log("this.params:", this.params);
			}
		}
	}
</script>

<style lang="scss">
	page {
		background: #f5f5f5;
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100vh;
		overflow: hidden;
	}

	.content {
		height: 80vh;
	}
</style>