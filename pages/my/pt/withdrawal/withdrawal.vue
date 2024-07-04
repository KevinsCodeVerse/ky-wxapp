<template>
	<view>
		<view style="padding: 45rpx 30rpx;font-size: 30rpx;display: flex;gap: 20rpx;flex-direction: column;">
			<view style="font-weight: 600;">
				提现金额
			</view>
			<view>
				<u-field v-model="addFrom.money" placeholder="请输入金额" border-bottom label-width="50" label="￥" focus
					:field-style="{'font-size':'50rpx','height':'55rpx'}" label-align="left">
				</u-field>
			</view>
			<view style="font-size: 20rpx;color: #666;">
				目前余额￥0，最低提现金额为￥10.00
			</view>
		</view>
		<view style="display: flex;flex-direction: column;align-items: center;gap: 25rpx;margin-top: 20rpx">
			<view
				style="width: 280rpx;height: 80rpx;border-radius: 40rpx;background: linear-gradient(90.00deg, #3994FF 0%, #3994FF 100%);">
				<view style="text-align: center;line-height: 80rpx;font-weight: 700;font-size: 28rpx;color: #fff;">
					提现至微信零钱
				</view>
			</view>
			<view
				style="width: 280rpx;height: 80rpx;border-radius: 40rpx;background: linear-gradient(90.00deg, #3994FF 0%, #3994FF 100%);">
				<view style="text-align: center;line-height: 80rpx;font-weight: 700;font-size: 28rpx;color: #fff;">
					申请提现至银行卡
				</view>
			</view>
			<view style="color: #3994FF;font-size: 20rpx;" @click="openPage('pages/my/withdrawal/bankcard',2)">
				查看/修改卡号信息
			</view>
		</view>

	</view>
</template>

<script>
	export default {
		data() {
			return {
				addFrom: {
					money: NaN
				}
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
				if (type==1) {				
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
	/deep/.u-field-inner.data-v-1c764f86 {
		align-items: baseline;
	}

	/deep/.u-label-text.data-v-1c764f86 {
		font-size: 50rpx;
	}
</style>