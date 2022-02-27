

// deepCopy
export function deepCopy(data) {
    const t = typeof data;
    let o;

    if (data instanceof Array) {
        o = [];
    } else if ( t === 'object') {
        o = {};
    } else {
        return data;
    }

    if (data instanceof Array) {
        for (let i = 0; i < data.length; i++) {
            o.push(deepCopy(data[i]));
        }
    } else if ( t === 'object') {
        for (let i in data) {
            o[i] = deepCopy(data[i]);
        }
    }
    return o;
}

export function equalArray(data,compareData){
  if(Object.prototype.toString.call(data) !== '[object Array]'){
      return false;
  }
  if(Object.prototype.toString.call(compareData) !== '[object Array]'){
      return false;
  }
  if(data.length != compareData.length){
    return false;
  }

  if(data.length == 0 && compareData.length == 0){
    return true;
  }
  let item = "";
  let isEqual = false,
      isIndexNull = false;
  for(let i = 0; i < data.length; i++){
    item = data[i];
    let index = compareData.indexOf(item)
    if(index == -1){
      isIndexNull = true;
      break;
    }
  }
  if(isIndexNull == false){
    isEqual = true;
  }
  return isEqual;
}

export function toParams (data){
    var url = "";
    for(var item in data){
        if(!isEmpty(data[item])){
            url = url + "&" + item + "=" + data[item];
        }
    }
    url = url.replace('&','?');
    return url;
};

// 判断参数是否是其中之一
export function oneOf (value, validList) {
    for (let i = 0; i < validList.length; i++) {
        if (value === validList[i]) {
            return true;
        }
    }
    return false;
}

export function guid() {
  let number = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0,
      v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
  return number + "-" + new Date().getTime();
}




//判断I与O是否相等,只遍历I的属性
export function objectEqual(I,O){
    let equal = true;
    if(I == O){
      return true;
    }
    if(!I || !O){
      return false;
    }
    Object.keys(I).forEach(function(item, index) {
      if(!!I[item] == false && !!O[item] == false){

      }else{
        if(I[item] == null){
          if(O[item] != null){
            equal = false;
            return false;
          }
        }else{
          if(typeof O[item] == 'undefined'){
              equal = false;
              return false;
          }
          if(typeof I[item] != 'object'){//值类型
              if(I[item] != O[item]){
                  equal = false;
                  return false;
              }
          }else{
              if(typeof O[item] != 'object'){
                  equal = false;
                  return false;
              }
              let _I = I[item];
              if(objectEqual(_I,O[item]) == false){
                  equal = false;
                  return false;
              }
          }
        }
      }
    });
    return equal;
}
//遍历I属性,获取I属性中与对应O不同的地方 并过滤掉null和undeifned
export function getDifferentPart(I,O){
    I = getVilidAttr(I);
    let part = {};
    Object.keys(I).forEach(function(item, index) {
        if(typeof I[item] == 'object'){
          if(typeof O[item] != 'object'){
            part[item] = I[item];
          }else{
            if(objectEqual(I[item],O[item]) == false){
                part[item] = I[item];
            }
          }
       }else{
         if(O[item] != I[item]){
           part[item] = I[item];
         }
       }
    });
    return part;
}
//过滤掉null或者undefined的属性
export function getVilidAttr(I){
    let part = {};
    Object.keys(I).forEach(function(item, index) {
        if(I[item] == null || typeof I[item] == 'undefined'){

        }else{
          part[item] = I[item];
        }
    });
    return part;
}
//过滤掉null或者undefined或者空字符串的属性
export function getVilidAttrWithEmpty(I){
    let part = {};
    Object.keys(I).forEach(function(item, index) {
        if(!!I[item] == false ){

        }else{
          part[item] = I[item];
        }
    });
    return part;
}

export function isEmpty(value){
  return (typeof value === 'undefined' || value === '' || value === null);
}


//获取页面中内容元素的高度
export function getCkVal(cookieName) {
    var name = cookieName + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i].trim();
        if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
    }
    return "";
}

export function scrollToRight (eleID,num) {

  let ID = "main-container";
  let mainContainer = document.getElementById(ID);
  // let canScrollWid = document.getElementById(eleID).scrollWidth - document.getElementById(eleID).clientWidth;
  // let currentLeft = mainContainer.scrollLeft;
  // if(canScrollWid - currentLeft > (num-10)){
  //   return;
  // }
  if(!!mainContainer){
    window.setTimeout(function(){
      if(!!num){
        mainContainer.scrollLeft = mainContainer.scrollLeft + num;
      }else{
        mainContainer.scrollLeft = mainContainer.scrollWidth;
      }
    },20);
  }
}

export function setCkVal(cookieName, cookieValue, cookieExpires, cookiePath) {
    var d = new Date();
    d.setTime(d.getTime() + (7 * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toGMTString();
    document.cookie = cookieName + "=" + cookieValue + "; " + expires;
}

export function removeCk(name) {
    var cval = getCookieValue(name);
    var d = new Date();
    d.setTime(d.getTime() + (-1 * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toGMTString();
    document.cookie = name + "=" + cval + "; " + expires;
}

//data []
  //attr:name 字段名
  //attr:value 字段值
  //attr:maxLen 字段最大长度 默认50
  //attr:validType 验证类型
export function validAttr(data) {
  let error = "",
      item = null;
  for(let i = 0; i < data.length; i++){
    item = data[i];
    let len = 50;
    if(item.maxLen){
      len = parseInt(item.maxLen);
    }
    if(item.value.length > len){
      error = item.name + "字数不可以超过"+len+"字";
      break;
    }
    if(item.validType == "positiveInt"){
      let validMes = positiveIntValid(item.value);
      if(validMes != ""){
        error = item.name + validMes;
        break;
      }
    }
    if(item.validType == "positive"){
      let validMes = positiveValid(item.value);
      if(validMes != ""){
        error = item.name + validMes;
        break;
      }
    }
  }
  return error;
}

function positiveValid(val){
  let err = "";
  if(isNaN(val)){
    err = "应该是数字"
  }
  if(parseInt(val) < 0){
    err = "应该大于0"
  }
  return err;
}
function positiveIntValid(val){
  let err = "";
  if(isNaN(val)){
    err = "应该是数字"
  }
  if(parseInt(val) < 0){
    err = "应该大于0"
  }
  if(String(val).indexOf('.') != -1){
    err = "应该是整数"
  }
  return err;
}
