<template>
	<view>
		<view
			style="height: 174rpx;background: linear-gradient(135.00deg, #fad232 0%, #faaa32 100%);padding: 32rpx 54rpx;">
			<view style="display: flex;justify-content: space-between;">
				<view>
					<view style="font-weight: 700;font-size: 48rpx;text-align: center;color: #fff;">70000</view>
					<view style="font-size: 28rpx;text-align: center;color: #fff;">直推团队</view>
				</view>
				<view>
					<view style="font-weight: 700;font-size: 48rpx;text-align: center;color: #fff;">3000</view>
					<view style="font-size: 28rpx;text-align: center;color: #fff;">间推团队</view>
				</view>
				<view>
					<view style="font-weight: 700;font-size: 48rpx;text-align: center;color: #fff;">10000</view>
					<view style="font-size: 28rpx;text-align: center;color: #fff;">全部成员</view>
				</view>
			</view>
		</view>

		<scroll-view scroll-y="true" class="scroll-Y content" @scrolltolower="getList">
			<view style="display: flex;flex-direction: column;justify-content: space-between;">
				<view style="margin-bottom:20rpx;padding: 24rpx 32rpx 36rpx 32rpx;background-color: #fff;"
					v-for="(item,index) in 10">
					<view style="display: flex;align-items: center;">
						<view>
							<u-image width="108rpx" height="108rpx" src="https://cdn.uviewui.com/uview/album/1.jpg"
								shape="circle"></u-image>
						</view>
						<!-- 中间部分 -->
						<view
							style="display: flex;flex-direction: column;justify-content: space-between;margin-left: 16rpx;gap: 5rpx;">
							<view style="display: flex;">
								<view
									style="font-weight: 700;font-size: 28rpx;text-align: left;color: #333;max-width: 190rpx;width: max-content;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;">
									陈逸诗六个字超出的内容隐藏
								</view>
								<view>
									<u-image width="148rpx" height="40rpx" src="/static/my/vip4.png"></u-image>
								</view>
							</view>
							<view style="font-size: 22rpx;text-align: left;color: #999;">
								注册时间:2024.06.29
							</view>
							<view style="width: max-content;height: 32rpx;border-radius: 4rpx;background: #fff7e6;">
								<view style="font-size: 20rpx;text-align: left;color: #f2a600;line-height: 32rpx;">
									累计收益:99999999999999999
								</view>
							</view>
						</view>
						<!-- 右边部分 -->
						<view
							style="margin-left: auto;display: flex;flex-direction: column;justify-content: space-between;align-items: center;gap: 18rpx;">
							<view style="width: 144rpx;height: 52rpx;border-radius: 26rpx;background: #fff2d6;">
								<view
									style="font-weight: 700;font-size: 22rpx;text-align: center;color: #f2a600;line-height: 52rpx;">
									开单记录</view>
							</view>
							<view style="display: flex;align-items: flex-end;">
								<view style="font-size: 24rpx;text-align: center;color: #999;">
									查看团队
								</view>
								<view>
									<u-icon name="arrow-right" size="18rpx" color="#999"></u-icon>
								</view>
							</view>
						</view>
					</view>
					<view style="display: flex;justify-content: space-around;margin-top: 32rpx;">
						<view>
							<view style="font-size: 24rpx;text-align: left;color: #aaa;">
								今日开单
							</view>
							<view
								style="font-size: 24rpx;text-align: left;color: #333;font-weight: 700;margin-top: 5rpx;">
								100000000
							</view>
						</view>
						<view>
							<view style="font-size: 24rpx;text-align: left;color: #aaa;">
								总开单
							</view>
							<view
								style="font-size: 24rpx;text-align: left;color: #333;font-weight: 700;margin-top: 5rpx;">
								100000000
							</view>
						</view>
						<view>
							<view style="font-size: 24rpx;text-align: left;color: #aaa;">
								直推团队
							</view>
							<view
								style="font-size: 24rpx;text-align: left;color: #333;font-weight: 700;margin-top: 5rpx;">
								100000000
							</view>
						</view>
						<view>
							<view style="font-size: 24rpx;text-align: left;color: #aaa;">
								间推团队
							</view>
							<view
								style="font-size: 24rpx;text-align: left;color: #333;font-weight: 700;margin-top: 5rpx;">
								100000000
							</view>
						</view>
					</view>
				</view>
			</view>


		</scroll-view>



		<view
			style="position: absolute;padding: 30rpx 40rpx 50rpx 40rpx;border-radius: 20rpx 20rpx 0 0;background-color: #fff;bottom: 0;width: 100vw;">
			<view style="display: flex;justify-content: space-between;">
				<view @click="openPage('/pages/my/pt/goodsTgDt',1)"
					style="display: flex;flex-direction: column;align-items: center;width: 180rpx;height: 100rpx;justify-content: center;">
					<u-icon name="home" color="#999" size="45"></u-icon>
					<view style="font-size: 20rpx;color: #999;">
						首页
					</view>
				</view>
				<view @click="openPage('/pages/my/pt/team',1)"
					style="display: flex;flex-direction: column;align-items: center;width: 180rpx;height: 100rpx;justify-content: center;">
					<u-icon name="account" color="#999" size="45"></u-icon>
					<view style="font-size: 20rpx;color: #999;">
						团队
					</view>
				</view>
				<view @click="openPage('/pages/my/pt/fyJl',1)"
					style="display: flex;flex-direction: column;align-items: center;width: 180rpx;height: 100rpx;justify-content: center;">
					<u-icon name="rmb-circle" color="#999" size="45"></u-icon>
					<view style="font-size: 20rpx;color: #999;">
						分佣
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {

			}
		},
		methods: {
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
				if (type == 1) {
					uni.redirectTo({
						url: path
					})
				} else {
					this.$u.route({
						url: path
					});
				}
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
		height: 75vh;
	}
</style>