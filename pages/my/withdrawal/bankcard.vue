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
				<u-select v-model="show" :list="bankList" value-name="id" label-name="bank"
					@confirm="confirmBank"></u-select>
			</view>
			<view>
				<u-field v-model="addFrom.money" placeholder="输入银行卡号" border-bottom label-width="150" label="银行卡号"
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
				addFrom: {},
				show: false,
				bankList: [{
					"id": 1,
					"bank": "农业银行"
				}]
			}
		},
		methods: {
			showAction() {
				console.log("123123");
				this.show = true;
			},
			confirmBank(e) {
				this.addFrom.bank = e[0].label
				this.addFrom.id = e[0].value
				console.log("E:", e);
			}
		}
	}
</script>

<style>

</style>