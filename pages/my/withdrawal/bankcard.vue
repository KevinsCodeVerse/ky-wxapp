<template>
	<view>
		<view style="padding: 40rpx 35rpx;display: flex;flex-direction: column;gap: 10rpx;">
			<view style="color: #FFBE00;font-size: 23rpx;text-align: center;"
				@click="openPage('pages/my/withdrawal/bankcard',2)">
				请绑定银行卡后进行手动提现
			</view>
			<view>
				<u-field v-model="addFrom.bank" placeholder="选择银行" border-bottom label-width="150" label="银行名称"
					label-align="left" right-icon="arrow-down-fill" @click="showAction" :disabled="true">
				</u-field>
				<u-select v-model="show" :list="bankList" value-name="bankId" label-name="bank"
					@confirm="confirmBank"></u-select>
			</view>
			<view>
				<u-field v-model="addFrom.cardNum" placeholder="输入银行卡号" border-bottom label-width="150" label="银行卡号"
					label-align="left">
				</u-field>
			</view>
			<view>
				<u-field v-model="addFrom.name" placeholder="输入持卡人" border-bottom label-width="150" label="持卡人"
					label-align="left">
				</u-field>
			</view>
			<view style="display: flex;justify-content: center;margin-top: 25rpx;">
				<view
					@click="addOrUpdate"
					style="width: 280rpx;height: 80rpx;border-radius: 40rpx;background: linear-gradient(90.00deg, #ffc200 0%, #ffac00 100%);">
					<view style="text-align: center;line-height: 80rpx;font-weight: 700;font-size: 28rpx;color: #fff;">
						提交修改
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
				addFrom: {
					id:'',
					bank:'',
					bankId:'',
					cardNum:'',
					name:'',
				},
				show: false,
				bankList: [],
				load: false,
			}
		},
		onLoad() {
			this.getBankList();
			this.detail();
		},
		methods: {
			detail(){
				this.$request.post({
					url: 'user/userBankCard/list',
					params: {
						pageNo: 1,
						pageSize: 1,
					},
					success: (res) => {
						if(res) {
							this.addFrom = res[0];
							this.addFrom.bank = res[0].cardName;
						}
					},
					finally: (e) => {
					}
				});
			},
			addOrUpdate(){
				if(this.load) return;
				this.load = true;
				uni.showLoading({
					title:'加载中'
				})
				if(!this.addFrom.bank || !this.addFrom.cardNum || !this.addFrom.name) {
					uni.showToast({
						title: '请填写完整内容',
						icon: 'none'
					})
					this.load = false;
					uni.hideLoading();
					return;
				}
				this.$request.post({
					url: 'user/userBankCard/addOrUpdate',
					params: this.addFrom,
					success: (res) => {
						this.addFrom.id = res;
						uni.showToast({
							title: '修改成功',
							icon: 'none',
						});
					},
					finally: (e) => {
						this.load = false;
						uni.hideLoading();
					}
				});
			},
			getBankList(){
				this.$request.post({
					url: 'user/userBankCard/selectBankList',
					success: (res) => {
						this.bankList = res;
					}
				});
			},
			showAction() {
				console.log("123123");
				this.show = true;
			},
			confirmBank(e) {
				this.addFrom.bank = e[0].label
				this.addFrom.bankId = e[0].value
				console.log("E:", e);
			}
		}
	}
</script>

<style>

</style>