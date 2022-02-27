export default {
    bind (el, binding, vnode) {
        var domHeight = document.body.clientHeight;
        var topRate = 3/4;
        function mouseEnter (e) {
            clearInterval(window.getDataInter);
            clearTimeout(window.hoverTimer);
            var ref = binding.value.ref;
            var data = el.getAttribute("mes");
            if(e.clientY > domHeight*topRate){
                ref.bottom = domHeight - (e.clientY-e.offsetY+30);
                ref.top = 'auto';
                ref.vertureP = "vertureBottom";
            }else{
                ref.top = e.clientY-e.offsetY-5;
                ref.bottom = 'auto';
                ref.vertureP = "vertureTop";
            }
            ref.left = e.clientX-e.offsetX+80;
            ref.contentData = window.teaSimpleMessage[data];
            ref.visible = true;
            if(!window.teaSimpleMessage[data]){//如果数据是空,则不断重新请求数据,并赋值给组件
                window.getDataInter = setInterval(function(){
                    if(window.teaSimpleMessage[data]){
                        clearInterval(window.getDataInter);
                        ref.contentData = window.teaSimpleMessage[data];
                    }
                },10);
            }
        }
        function mouseLeave (e) {
          var data = el.getAttribute("mes");
          window.teaSimpleMessage[data] = null;//这两句是清除缓存

            clearInterval(window.getDataInter);
            var ref = binding.value.ref;
            window.hoverTimer = setTimeout(function(){
                if(ref.over == false){
                  ref.visible = false;
                }
            },100);

        }
        el.__vuemouseenter__ = mouseEnter;
        el.__vuemouseleave__ = mouseLeave;
        el.addEventListener('mouseenter', mouseEnter);
        el.addEventListener('mouseleave', mouseLeave);
    },
    unbind (el, binding) {
        el.removeEventListener('mouseenter', el.__vuemouseenter__);
        el.removeEventListener('mouseleave', el.__vuemouseleave__);
        delete el.__vuemouseenter__;
        delete el.__vuemouseleave__;
    }
};
