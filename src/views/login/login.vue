<template>
    <div class="login">
        <div class="login_form_box d-flex d-column j-center">
             <img src="@/assets/images/logo.png" alt="" class="welcome_logo">

             <span class="login_title">
                登录
             </span>
             <span class="welcome_title">
                欢迎登录中央站客户端
             </span>
                <el-form :model="loginForm" ref='loginFormRef' :rules="loginFormRules">
                    <el-form-item prop="username">
                        <el-input class="login_form_input" v-model="loginForm.username" placeholder="请输入账号" :maxlength="20">
                            <template #prefix>
                                <div class="form_icon">
                                    <div class="img user_icon"></div>
                                </div>
                            </template>
                        </el-input>
                    </el-form-item>
                    <el-form-item prop="password">
                        <el-input class="login_form_input" type="password" v-model="loginForm.password" placeholder="请输入密码" :maxlength="20">
                            <template #prefix>
                                <div class="form_icon">
                                    <div class="img pwd_icon">
                                    </div>
                                </div>
                            </template>
                        </el-input>
                    </el-form-item>
                </el-form>
                <el-button class="login_button" @click="loginFn" :loading="loading">登录</el-button>
                <div class="forget_pwd" @click="forgetPwd()">忘记账号密码？</div>

        </div>
    </div>
    <custom-dialog v-model="dialogVisible" title="忘记密码" :show-close="false" width="34%" top="25vh">
        <div class="forget_text">
            <p>若您忘记账号密码，可拨打以下电话找回</p>
            <p style="color: #07C160;font-weight: bold;">技术运维电话：400-9616-639</p>
        </div>
        <template #footer>
            <div class="dialog-footer">
                <el-button size="large" type="info" @click="dialogVisible = false">取消</el-button>
                <el-button size="large" type="primary" @click="dialogVisible = false">
                    确定
                </el-button>
            </div>
        </template>
    </custom-dialog>
</template>

<script setup lang='ts'>
import LoginApi from '@/api/login';
import { setCookie } from '@/utils/cookie/cookie';
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { onMounted, onUnmounted, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useZoomStore } from "@/stores/zoom";
import { autoStore } from "@/utils/http/httpRequest"
const { createZoom } = useZoomStore();
 
const router = useRouter()

interface LoginForm {// 登录表单接口规则
    username: string,
    password: string
}

const loginFormRef = ref<FormInstance>()//

const loginForm = reactive<LoginForm>({//登录表单对象
    username: "",
    password: ""
})
const loginFormRules = reactive<FormRules>({//登录表单校验规则
    username: [{ required: true, message: "请输入账号", trigger: 'change' }],
    password: [{ required: true, message: "请输入密码", trigger: 'change' }],
})
const loading = ref<boolean>(false)
const loginFn = () => {//登录
       autoStore.isTokenExpired = false;
    const formEl = loginFormRef.value
    if (!formEl) return
    formEl.validate(async (valid) => {
        if (valid) {
            loading.value = true
            let data = {
                zone_number: loginForm.username,
                password: loginForm.password
            }
            try {
                const res = (await LoginApi.login(data)).data
                if (res) {
                    setCookie('admin', JSON.stringify(res.result))
                    setCookie('token', res.result.token)
                    setCookie('zone_number', res.result.zone_number);
                    createZoom(res.result);
                    ElMessage({
                        message: "登录成功",
                        type: 'success',
                    })
                    setTimeout(() => {
                        loading.value = false;
                     
                        router.push('/index');
                    }, 1000);
                }
            } catch (error) {
                loading.value = false
            }


        }
    })
}

onMounted(() => {
    // 绑定监听事件
    window.addEventListener('keydown', keyDown)
})
onUnmounted(() => {
    // 销毁事件
    window.removeEventListener('keydown', keyDown, false)
})
// 点击回车键登录
const keyDown = (e: { keyCode: number; }) => {
    if (e.keyCode === 13) {
        loginFn()
    }
}


let dialogVisible = ref(false)// 忘记密码弹框Boolean

const forgetPwd = () => {//忘记密码
    dialogVisible.value = true
}
</script>

<style scoped>
.login {
    background-image: url('@/assets/images/loginbg.png');
    background-size: cover;
    background-repeat: no-repeat;
    background-position: left top;
    width: 100%;
    height: 100vh;
    position: relative;
}
:deep(.ep-input__wrapper){
    height:100%;
}

.login_form_box {
    width: 733px;
    height: 100vh;
    background: rgba(255,255,255,0.4);
    backdrop-filter: blur(10px);
    right: 0;
    top: 0;
    position: absolute;
    padding: 0 187px;
    box-sizing: border-box;
}

.box_title {
    font-weight: bold;
    font-size: 24px;
    color: #2A394D;
    letter-spacing: 1px;
    text-align: center;
    margin-bottom: 3.6vw;
}

.form_box {

}

.form_icon {
    position: relative;
    padding-right: 20px;
    padding-left: 10px;
}

.form_icon .img {
    width: 24px;
    height: 24px;
    background-size: 100% 100%;
    background-repeat: no-repeat;
}

.form_icon ::after {
    position: absolute;
    content: '';
    width: 0px;
    height: 10px;
    border: 1.5px solid #929FAF;
    right: 2px;
    top: 50%;
    transform: translateY(-50%);
}

.login_form_input {
    width: 360px;
    height: 72px;
    /* border: 1px solid red; */
   background: #FFFFFF;
    /* box-shadow: 0px 8px 24px 0px rgba(146,159,175,0.16); */
    border-radius: 10px 10px 10px 10px;
    /* border: 1px solid #CDCDCD; */
 
}
:deep(.login_form_input .el-input__wrapper){
    /* box-shadow: none; */
    --el-input-focus-border: 1px solid #24B287;
    --el-input-border-color: #CDCDCD;
    --el-input-hover-border-color: #24B287;
     --el-input-focus-border-color: #24B287;
}

 .user_icon {
    background-image: url('@/assets/images/acount.png');
}

.pwd_icon {
    background-image: url('@/assets/images/password.png');
}
/* 
:deep(.is-error .form_icon .user_icon) {
    background-image: url('@/assets/images/login_form_user_icon_e.png');
}

:deep(.is-error .form_icon .pwd_icon) {
    background-image: url('@/assets/images/login_form_pwd_icon_e.png');
}  */

:deep(.is-error .form_icon ::after) {
    border: 1.5px solid #E24040;
}

:deep(.el-form-item__error) {
    display: none;
}

:deep(.el-form-item.is-error input::placeholder) {
    color: #E24040;
}


.login_button {
    margin-top: 60px;
    width: 100%;
    height: 66px;
    line-height: 66px;
    background: #24B287;
    box-shadow: 0px 8px 24px 0px rgba(146,159,175,0.16);
    border-radius: 10px 10px 10px 10px;
    letter-spacing: 2px;
    cursor: pointer;
    margin-bottom: 24px;
    font-family: Alibaba PuHuiTi 3.0, Alibaba PuHuiTi 30;
    font-weight: normal;
    font-size: 18px;
    color: #FFFFFF;
    text-align: center;
    --el-button-hover-bg-color: #24B287;
        --el-button-hover-text-color: #FFFFFF;
            --el-button-hover-border-color: #24B287;

    }

.forget_pwd {
    font-family: Alibaba PuHuiTi 3.0, Alibaba PuHuiTi 30;
    font-weight: normal;
    font-size: 14px;
    color: #24B287;   
    text-align: center;
    cursor: pointer;
}

.forget_text {
    padding: 64px;
    text-align: center;
    font-size: 16px;
    color: #636676;
}

.forget_text p:nth-child(1) {
    margin-bottom: 10px;
}

.logo_box {
    position: absolute;
    left: 100px;
    top: 80px;
    align-items: center;
}

.logo_box img {
    width: 240px;
    margin-right: 30px;
}

.logo_box .vertical_line {
    width: 3px;
    background-color: #FFFFFF;
    height: 30px;
    margin-right: 30px;
}

.logo_box .p_name {
    color: #FFFFFF;
    font-size: 52px;
    font-weight: bold;
    letter-spacing: 2px;
}

.welcome_logo{
    width: 100px;
    height: 100px;
    /* box-shadow: 0px 8px 24px 0 rgba(146, 159, 175, 0.16); */
}

.login_title{
    font-family: Alibaba PuHuiTi 3.0, Alibaba PuHuiTi 30;
    font-weight: normal;
    font-size: 24px;
    color: #384951;
    font-weight: 800;
}
.welcome_title{
    font-family: Alibaba PuHuiTi 3.0, Alibaba PuHuiTi 30;
    font-weight: normal;
    font-size: 16px;
    color: #929FAF;
    font-weight: 500;
    margin-top: 10px;
    margin-bottom: 60px;
}



</style>
