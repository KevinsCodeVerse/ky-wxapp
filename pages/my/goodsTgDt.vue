<template>
	<view>
		<view style="width: 100vw;">
			<image src="/static/my/background.png" style="width: 100vw;z-index: -1;"></image>
		</view>
		<view style="margin: 0 36rpx;top: 0;position: absolute;">
			<view style="margin: 95rpx 0 45rpx 0;font-weight: 700;font-size: 18px;width: 90vw;display: flex;">
				<view @click="openPage()">
					<u-icon name="arrow-left" size="35rpx"></u-icon>
				</view>
				<view style="margin: auto;">
					商品推广中心
				</view>
			</view>
			<view style="display: flex;gap: 20rpx;align-items: center;">
				<view>
					<u-image width="96rpx" height="96rpx" src="https://cdn.uviewui.com/uview/album/1.jpg"
						shape="circle"></u-image>
				</view>
				<view style="display: flex;flex-direction: column;">
					<view style="display: flex;align-items: center;">
						<view style="max-width: 260rpx;">
							<view
								style="font-size: 38rpx; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;font-weight: 500;">
								昵称如果太长就隐藏
							</view>
						</view>
						<view style="display: flex;" @click="ywDialog=true">
							<view>
								<!-- <u-image width="128rpx" height="40rpx" src="/static/my/vip1.png"></u-image> -->
								<!-- <u-image width="128rpx" height="40rpx" src="/static/my/vip2.png"></u-image> -->
								<u-image width="108rpx" height="40rpx" src="/static/my/vip3.png"></u-image>
								<!-- <u-image width="148rpx" height="40rpx" src="/static/my/vip4.png"></u-image> -->
							</view>
							<view>
								<u-image width="32rpx" height="32rpx" src="/static/my/bangzhu.png"></u-image>
							</view>
						</view>
					</view>
					<view style="font-size: 26rpx;color: #666666;" v-if="nextZt!==-1">
						距下一级还需{{nextZt}}个直推业绩和{{nextTeamTj}}个间推业绩
					</view>
					<view style="font-size: 26rpx;color: #666666;" v-else>
						您当前已是至尊合伙人，享受平台最大权益
					</view>
				</view>

			</view>

			<!-- 余额 -->
			<view style="position: relative; width: 686rpx; height: 240rpx; margin: 38rpx 0 24rpx 0;">
				<!-- 使用 image 标签作为背景 -->
				<image src="/static/my/amountBck.png" mode="aspectFill"
					style="position: absolute; width: 686rpx; height: 240rpx; top: 0; left: 0;"></image>

				<!-- 内容区域 -->
				<view style="padding: 32rpx; color: #fff; position: relative;">
					<view style="display: flex; justify-content: space-between; font-size: 28rpx;">
						<view>余额</view>
						<view style="display: flex; align-items: center;">
							明细
							<u-icon name="arrow-right" size="20rpx"></u-icon>
						</view>
					</view>
					<view
						style="display: flex; justify-content: space-between; font-size: 64rpx; font-weight: 700; margin-top: 10rpx;">
						<view>888888.88</view>
					</view>
					<view style="display: flex; justify-content: space-between; font-size: 28rpx; margin-top: 15rpx;">
						<view>冻结中：￥1000.00</view>
						<view style="display: flex; gap: 24rpx;">
							<view @click="openPage('pages/my/withdrawal/withdrawal',2)">提现 </view>
							<view> | </view>
							<view>转换 </view>
						</view>
					</view>
				</view>
			</view>

			<!-- 我的收益 -->
			<view
				style="width: 686rpx;height: 88rpx;border-radius: 24rpx 24rpx 0 0;background: linear-gradient(90.00deg, #fff2d6 0%, #fff 100%);padding: 28rpx 20rpx;">
				<view style="display: flex;align-items: center;gap: 12rpx">
					<u-image width="32rpx" height="32rpx" src="/static/my/shouyi.png"></u-image>
					<view style="font-weight: 700;font-size: 32rpx;color: #333;">我的收益</view>
				</view>
			</view>
			<view
				style="width: 686rpx;height: 462rpx;border-radius: 0 0 24rpx 24rpx;background: #fff;padding: 48rpx;display: flex;flex-direction: column;justify-content: space-between;">
				<view style="display: flex;justify-content: space-around">
					<view style="display: flex;flex-direction: column;gap: 5rpx;align-items: center;">
						<view style="font-size: 24rpx;color: #999;">今日佣金</view>
						<view style="font-weight: 700;font-size: 32rpx;color: #333;">8888</view>
					</view>
					<view style="display: flex;flex-direction: column;gap: 5rpx;align-items: center;">
						<view style="font-size: 24rpx;color: #999;">本月佣金</view>
						<view style="font-weight: 700;font-size: 32rpx;color: #333;">8888w</view>
					</view>
					<view style="display: flex;flex-direction: column;gap: 5rpx;align-items: center;">
						<view style="font-size: 24rpx;color: #999;">累计佣金</view>
						<view style="font-weight: 700;font-size: 32rpx;color: #333;">88888w</view>
					</view>
				</view>
				<view style="font-size: 24rpx;text-align: center;color: #999;">
					分享商品链接/海报<br />
					用户通过您的分享注册消费，可获得佣金奖励
				</view>
				<view style="display: flex;justify-content: space-between;">
					<view
						style="width: 280rpx;height: 80rpx;border-radius: 40rpx;background: linear-gradient(90.00deg, #ffc200 0%, #ffac00 100%);">
						<view
							style="text-align: center;line-height: 80rpx;font-weight: 700;font-size: 28rpx;color: #fff;">
							分享链接
						</view>
					</view>
					<view
						style="width: 280rpx;height: 80rpx;border-radius: 40rpx;background: linear-gradient(90.00deg, #ffc200 0%, #ffac00 100%);">
						<view
							style="text-align: center;line-height: 80rpx;font-weight: 700;font-size: 28rpx;color: #fff;">
							生成海报
						</view>
					</view>
				</view>
			</view>
			<!-- 单元格 -->
			<!-- 	<view style="margin-top: 24rpx;">
				<u-cell-group>
					<u-cell-item icon="man-add" title="我的团队"></u-cell-item>
					<u-cell-item icon="grid" title="分佣记录" @click="openPage('pages/my/fyJl')"></u-cell-item>
				</u-cell-group>
			</view> -->

			<!-- 业务推广弹框 -->
			<u-popup v-model="ywDialog" mode="center" border-radius="15">
				<view style="padding: 40rpx;width: 600rpx;">
					<view style="display: flex;flex-direction: column;align-items: center;">
						<view style="font-weight: 700;font-size: 32rpx;text-align: center;margin: 0 0 48rpx 0;">
							业务推广规则
						</view>
						<view
							style="display: flex;justify-content: flex-start;flex-direction: column;margin-bottom: 20rpx;">
							<u-image width="128rpx" height="40rpx" src="/static/my/vip1.png"></u-image>
							<view
								style="font-size: 24rpx;line-height: 36rpx;text-align: left;color: #999;margin-top: 5rpx;">
								条件:无需业绩条件<br />
								每直接推荐用户下单奖励8%元，间接推荐下单奖励2%元
							</view>
						</view>
						<view
							style="display: flex;justify-content: flex-start;flex-direction: column;margin-bottom: 20rpx;">
							<u-image width="128rpx" height="40rpx" src="/static/my/vip2.png"></u-image>
							<view
								style="font-size: 24rpx;line-height: 36rpx;text-align: left;color: #999;margin-top: 5rpx;">
								条件:无需业绩条件<br />
								每直接推荐用户下单奖励8%元，间接推荐下单奖励2%元
							</view>
						</view>
						<view
							style="display: flex;justify-content: flex-start;flex-direction: column;margin-bottom: 20rpx;">
							<u-image width="108rpx" height="40rpx" src="/static/my/vip3.png"></u-image>
							<view
								style="font-size: 24rpx;line-height: 36rpx;text-align: left;color: #999;margin-top: 5rpx;">
								条件:无需业绩条件<br />
								每直接推荐用户下单奖励8%元，间接推荐下单奖励2%元
							</view>
						</view>
						<view
							style="display: flex;justify-content: flex-start;flex-direction: column;margin-bottom: 20rpx;">
							<u-image width="148rpx" height="40rpx" src="/static/my/vip4.png"></u-image>
							<view
								style="font-size: 24rpx;line-height: 36rpx;text-align: left;color: #999;margin-top: 5rpx;">
								条件:无需业绩条件<br />
								每直接推荐用户下单奖励8%元，间接推荐下单奖励2%元
							</view>
						</view>
						<view
							style="width: 510rpx;height: 92rpx;border-radius: 46rpx;background: linear-gradient(90.00deg, #ffc200 0%, #ffac00 100%);margin-top: 35rpx;">
							<view
								style="font-weight: 700;font-size: 32rpx;text-align: center;line-height: 92rpx;color: #fff;"
								@click="ywDialog=false">
								关闭
							</view>
						</view>
					</view>
				</view>
			</u-popup>
		</view>
		<!-- <view style="height: 130rpx;width: 100vw;">
			
		</view> -->
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
	</view>
</template>

<script>
	export default {
		data() {
			return {
				nextZt: -1,
				nextTeamTj: -1,
				ywDialog: false

			};
		},
		onLoad(){
			this.tgInfo()
		},
		methods: {
			tgInfo(){
				this.$request.post({
					url: 'user/userRoyalFlowPro/tgInfo',
					params: {
						infoId: uni.getStorageSync("infoId"),						
					},
					success: (res) => {
						
					}
				});
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
</style>