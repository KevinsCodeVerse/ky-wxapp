<template>
  <view class="bindphone">
    <image class="banner" mode="widthFix" src="@/static/navs/my.png"></image>
    <text class="cue">为了您的账号安全 请绑定您的手机号</text>
    <view class="form">
      <view class="form_item">
        <input type="number" class="long" placeholder="请输入手机号" v-model="phone" @input="setPhone"></input>
      </view>
      <view class="form_item">
        <input class="short" placeholder="请输入图片验证码" v-model="verifyCode" @input="setVerifyCode"></input>
        <view class="imgcode"><img-code ref="imgCode" @sign="getSign" /></view>
      </view>
      <view class="form_item">
        <input type="number" class="short" placeholder="请输入手机验证码" v-model="code" @input="setCode"></input>
        <text v-if="smsShow" @tap="getSms" class="button">获取验证码</text>
        <text v-if="!smsShow" class="button">{{ getVerification }}</text>
      </view>
    </view>
    <button @tap="bind" class="submit">确认绑定</button>
    <navigator class="topass" url="/pages/index/index" open-type='switchTab'>跳过</navigator>
  </view>
</template>

<script>
import rsa from '@/utils/encryption';

export default {
  data() {
    return {
      phone: '',
      verifyCode: '',
      verifySign: '',
      code: '',
      phoneSign: '',
      smsShow: true,
      getVerification: '60s后重新获取',
    };
  },
  methods: {
    bind() {
      if (!/^1[3-9]\d{9}$/.test(this.phone)) {
        uni.showToast({
          title: '手机号格式错误',
          icon: 'none',
        });
        return;
      }
      if (!this.code) {
        uni.showToast({
          title: '请填写手机验证码',
          icon: 'none',
        });
        return;
      }
      this.$request.post('user/info/bindPhone', {
        phone: rsa.cryptStr(this.phone),
        phoneCode: this.code,
        phoneSign: rsa.cryptStr(this.phoneSign),
      }).then(result => {
        setTimeout(() => {
          uni.showToast({
            title: '绑定成功',
          });
        }, 1000);
        uni.setStorageSync('hasPhone', 1);
        uni.switchTab({
          url: '/pages/index/index',
        });
      }).catch(res => {
        this.$refs.imgCode.getCode();
      });
    },
    getSms() {
      if (!/^1[3-9]\d{9}$/.test(this.phone)) {
        uni.showToast({
          title: '手机号格式错误',
          icon: 'none',
        });
        return;
      }
      if (!this.verifyCode) {
        uni.showToast({
          title: '请填写图片验证码',
          icon: 'none',
        });
        return;
      }
      this.$request.post('sms/public/sendCode', {
        phone: this.phone,
        verifyCode: this.verifyCode,
        verifySign: this.verifySign,
      }).then((result) => {
        this.phoneSign = result;
        uni.showToast({
          title: '短信发送成功',
        });
        let time = 60;
        this.smsShow = false;
        this.getVerification = '60s后重新获取';
        const Time = setInterval(() => {
          if (time === 1) {
            this.smsShow = true;
            time = 60;
            clearTimeout(Time);
          } else {
            time--;
            this.getVerification = `${time}s后重新获取`;
          }
        }, 1000);
      }).catch(res => {
        this.$refs.imgCode.getCode();
      });
    },
    getSign(e) {
      this.verifySign = e.detail;
    },
    setPhone(e) {
      this.phone = e.detail.value;
    },
    setVerifyCode(e) {
      this.verifyCode = e.detail.value;
    },
    setCode(e) {
      this.code = e.detail.value;
    },
  },
};
</script>

<style scoped>
.bindphone {
  min-height: 100vh;
  background-color: #ffffff;
  padding-top: 60rpx;
  box-sizing: border-box;
}
.banner {
  width: 60%;
  display: block;
  margin: 0 auto;
}
.cue {
  display: block;
  text-align: center;
  font-size: 28rpx;
  margin: 40rpx 0 50rpx 0;
  font-weight: bold;
}
.form .form_item {
  background-color: #f5f5f5;
  border-radius: 50px;
  width: 80%;
  height: 80rpx;
  margin: 0 auto;
  margin-bottom: 30rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 30rpx;
  box-sizing: border-box;
  font-size: 28rpx;
}
.form .form_item .long {
  width: 100%;
  height: 100%;
}
.form .form_item .short {
  width: 60%;
  height: 100%;
}
.imgcode {
  width: 160rpx;
  height: 60rpx;
}
.imgcode image {
  width: 100%;
  height: 100%;
}
.form_item .button {
  font-size: 28rpx;
  color: #3994FF;
  height: 80rpx;
  line-height: 80rpx;
}
.submit {
  width: 80%;
  display: block;
  margin: 0 auto;
  background: #3994FF;
  color: #ffffff;
  height: 86rpx;
  line-height: 86rpx;
  font-size: 32rpx;
  border-radius: 50px;
  margin-top: 70rpx;
}
.topass{
  text-align: center;
  padding: 30rpx;
  font-size: 32rpx;
  color: #3994FF;
}
</style>
