<template>
	<view>
		<view style="padding: 45rpx 30rpx;font-size: 30rpx;display: flex;gap: 20rpx;flex-direction: column;">
			<view style="font-weight: 600;">
				转换{{unit==1?'积分':'金额'}}
			</view>
			<view>
				<u-field v-model="addFrom.amount" :placeholder="'请输入'+unit==1?'积分':'金额'" border-bottom :label-width="unit==1?100:50" 
				:label="unit==1?'积分':'￥'" focus :field-style="{'font-size':'50rpx','height':'55rpx'}" label-align="left">
				</u-field>
			</view>
			<view style="font-size: 20rpx;color: #666;">
				目前余额{{unit==1?balance+'积分':'￥'+balance}}，最低转换为{{unit==1?'1.00积分':'￥1.00'}}
			</view>
		</view>
		<view style="display: flex;flex-direction: column;align-items: center;gap: 25rpx;margin-top: 20rpx">
			<view
				@click="toConversion"
				style="width: 280rpx;height: 80rpx;border-radius: 40rpx;background: linear-gradient(90.00deg, #ffc200 0%, #ffac00 100%);">
				<view style="text-align: center;line-height: 80rpx;font-weight: 700;font-size: 28rpx;color: #fff;">
					确认转换
				</view>
			</view>
		</view>

	</view>
</template>

<script>
	export default {
		data() {
			return {
				addFrom: {
					amount: 0,
					tenantId: '',
				},
				load: false,
				balance: 0,
				unit:'',
			}
		},
		onLoad(e) {
			this.unit = uni.getStorageSync('unit');
			this.balance = e.balance;
			this.addFrom.tenantId = uni.getStorageSync("infoId");
		},
		methods: {
			toConversion(){
				if(this.load) return;
				this.load = true;
				uni.showLoading({
					title:'加载中'
				})
				if(this.addFrom.amount < 1) {
					uni.showToast({
						title: '最低转换1!',
						icon: 'none'
					})
					this.load = false;
					return;
				}
				this.$request.post({
					url: 'user/userRoyalFlowPro/balanceConversion',
					params: this.addFrom,
					success: (res) => {
						this.balance = res;
						uni.showToast({
							title: '转换成功',
							icon: 'none',
						});
					},
					finally: (e) => {
						this.load = false;
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