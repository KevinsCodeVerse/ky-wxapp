<template>
  <view class="login" :style="{ 'background-image': 'url(' + background + ')' }">
    <view class="logo">
      <image src="/static/navs/my.png"></image>
    </view>
    <view class="handle">
      <view class="myinput">
        <input placeholder="请输入手机号" placeholder-class="pholder" maxlength="11" @input="setPhone"></input>
      </view>
      <view class="myinput">
        <input placeholder="请输入图片验证码" placeholder-class="pholder" maxlength="11" @input="setVerifyCode"></input>
        <view class="imgcode">
          <img-code ref="imgCode" @sign="getSign" />
        </view>
      </view>
      <view class="myinput">
        <input placeholder="请输入手机验证码" placeholder-class="pholder" maxlength="11" @input="setCode"></input>
        <text v-if="smsShow" @click="getSms" class="button">获取验证码</text>
        <text v-else class="button">{{ getVerification }}</text>
      </view>
      <view class="mybtn btn" @click="bind">下一步</view>
    </view>
    <confirm v-if="wechat" @change="toConfirm"/>
  </view>
</template>

<script>
import rsa from "@/utils/rsa.js";
import confirm from '@/components/confirm/index.vue'
export default {
 components:{confirm},
  data() {
    return {
      background: "/img/common/login_bg.png",
      phone: "",
      verifyCode: "",
      verifySign: "",
      code: "",
      phoneSign: "",
      smsShow: true,
      getVerification: "60s后重新获取",
      wechat: false,
    };
  },
  onLoad(options) {
    console.log("登录options", options);

    this.getAdList(); // 判断是否隐藏取消按钮
    let base64 = uni
      .getFileSystemManager()
      .readFileSync(this.background, "base64");
    this.background = "data:image/jpg;base64," + base64;

    if (options.scene) {
      let scene = decodeURIComponent(options.scene).split(",");
      options.agentId = scene[0];
      options.id = scene[1];
      options.type = scene[2];
      options.scene = "";
    }

    this.phone = options.phone || "";
    this.parentId = options.scene || "";
    this.agentId = options.agentId || "";
    this.id = options.id || "";
    this.type = options.type || "";

    if (this.parentId) uni.setStorageSync("parentId", this.parentId);
    if (options.agentId) uni.setStorageSync("agentIdoptions", options);

    console.log(options);

    this.getUserInfo();
  },
  methods: {
    toConfirm({ detail }) {
      if (detail == "confirm") {
        uni.redirectTo({
          url: "/pages/loginwx/index?phone=" + this.phone,
        });
      } else {
        uni.switchTab({
          url: "/pages/index/index",
        });
        console.log("取消");
      }
    },
    bind() {
      if (!/^1[3-9]\d{9}$/.test(this.phone)) {
        uni.showToast({
          title: "手机号格式错误",
          icon: "none",
        });
        return;
      }
      if (!this.code) {
        uni.showToast({
          title: "请填写手机验证码",
          icon: "none",
        });
        return;
      }
      this.$request.post({
        url: "user/info/public/phone",
        params: {
          phone: rsa.cryptStr(this.phone),
          phoneCode: this.code,
          phoneSign: rsa.cryptStr(this.phoneSign),
        },
        success: (result) => {
          uni.setStorageSync("token", result.token);
          uni.redirectTo({
            url: "/pages/loginwx/index?phone=" + this.phone,
          });
        },
        allError: (res) => {
          this.$refs.imgCode.getCode();
        },
      });
    },
    getSms() {
      if (!/^1[3-9]\d{9}$/.test(this.phone)) {
        uni.showToast({
          title: "手机号格式错误",
          icon: "none",
        });
        return;
      }
      if (!this.verifyCode) {
        uni.showToast({
          title: "请填写图片验证码",
          icon: "none",
        });
        return;
      }
      this.$request.post({
        url: "sms/public/sendCode",
        params: {
          phone: this.phone,
          verifyCode: this.verifyCode,
          verifySign: this.verifySign,
        },
        success: (result) => {
          this.phoneSign = result;
          uni.showToast({
            title: "短信发送成功",
          });
          let time = 60;
          this.smsShow = false;
          this.getVerification = "60s后重新获取";
          let Time = setInterval(() => {
            if (time == 1) {
              this.smsShow = true;
              time = 60;
              clearTimeout(Time);
            } else {
              time--;
              this.getVerification = time + "s后重新获取";
            }
          }, 1000);
        },
        allError: (err) => {
          this.$refs.imgCode.getCode();
        },
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
/* pages/register/resgister.wxss */
.login{
  min-height: 100vh;
  background-color: #4F90F8;
  background-repeat: no-repeat;
  background-size: 100% auto;
}
.logo{
  text-align: center;
}
.logo image{
  width: 300rpx;
  height: 310rpx;
  margin-top: 30%;
  margin-bottom: 2%;
}
.handle{
  display: flex;
  flex-direction: column;
  align-items: center;
}
.btn{
  display: flex;
  align-items: center;
  justify-content: center;
  height: 86rpx;
  width: 82%;
  color: #3994FF;
  background-color: #fff;
  font-size: 32rpx;
  border-radius: 84rpx;
  margin-bottom: 30rpx;
  margin-top: 50rpx;
}
.handle .protocol{
  display: flex;
  color: #FFF59A;
  font-size: 24rpx;
}
.handle text{
  color: #fff;
}
/* 输入框 */
.myinput{
  width: 76%;
  height: 86rpx;
  border-radius: 86rpx;
  margin: 0 12%;
  border: 1px solid #fff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-left: 44rpx;
  margin-bottom: 30rpx;
}
.myinput input{
  color: #fff;
}
.myinput text{
  color: #FFF59A;
  padding-right: 44rpx;
}
.pholder{
  color: #fff!important;
}
.imgcode {
  width: 140rpx;
  height: 60rpx;
  padding-right: 44rpx;
}
.imgcode image {
  width: 100%;
  height: 100%;
}
</style>
