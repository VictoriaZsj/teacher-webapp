import getTeacherSecretInfo from '../../zm-platform/api/select/getTeacherSecretInfo';

export default {
    methods: {
        getTeaSecret(e,teaID,type){
            if(this.requestTeaSecretState){
                this.$Message({
                    message:"请等待上次查询完成"
                });
                return;
            }
            if(this.requestTeaSecretTime < 5){
                this.$Message({
                    message:"单次查询间隔为5秒钟"
                });
                return;
            }
            this.requestTeaSecretTime = 0;
            this.requestTeaSecretState = true;
            let elementList = document.querySelectorAll(".detailsBtn");
            for(let i = 0; i < elementList.length; i++){
                elementList[i].innerText = "点击查看信息";
            }
            let parm = {
                teaId:teaID,
                infoType:type
            };
            e.target.innerText = "正在查询..."
            getTeacherSecretInfo(parm).then(data => {
                this.requestTeaSecretState = false;
                e.target.innerText = data;
                this.requestTeaSecretInterval = window.setInterval(() => {
                    if(this.requestTeaSecretTime >= 5){
                        window.clearInterval(this.requestTeaSecretInterval);
                    }else{
                        this.requestTeaSecretTime = this.requestTeaSecretTime + 1;
                    }
                },1000);
            }).catch(message => {
                e.target.innerText = "信息不存在"
                this.requestTeaSecretState = false;
                this.$Message({
                    message
                });
            });
        },
        selectTable(val) {
            let ids = [];
            val.forEach((value) => {
                ids.push(value.teaId.toString());
            });
            this.selectName = ids;
        },
    }
}
