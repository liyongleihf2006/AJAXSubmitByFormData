/**
 * Created by LiYonglei on 2016/11/5.
 */
function AJAXSubmitByFormData(options){
    var defaults={
        formId:"",
        success:function(){},
        data:{}
    };
    Object.keys(defaults).forEach(function(key){
        options[key]=options[key]||defaults[key];
    });
    var formData=new FormData();
    var originDatas=OriginDatas();
    var form=document.querySelector(options.formId);
    if(form){
        Array.prototype.filter.call(form.elements,function(element){
            return element.hasAttribute("name");
        }).forEach(function(element){
            if(element.nodeName.toUpperCase() === "INPUT" && element.type==="file"&& element.files.length > 0){
                Array.prototype.forEach.call(element.files,function(file){
                    formData.append(element.name,file,file.name);
                });
            }else{
                originDatas.push(element.name,element.value);
            }
        });
    }
    Object.keys(options.datas).forEach(function(key){
        formData.append(key,options.datas[key]);
    });
    originDatas.getDatas().forEach(function(data){
        formData.append(data.name,data.value);
    });
    var xhr=new XMLHttpRequest();
    xhr.open("post",options.url,true);
    xhr.send(formData);
    xhr.onload=options.success;
    /*
     * 盛放原始数据并将同名的字段使用逗号分隔放到一个字段里面
     * */
    function OriginDatas( ){
        var originDatas={};
        return {
            push:function(key,value){
                if(originDatas[key]){
                    originDatas[key].push(value);
                }else{
                    originDatas[key]=[value];
                }
            },
            getDatas:function(){
                return Object.keys(originDatas).reduce(function(datas,key){
                    datas.push({name:key,value:originDatas[key].toString()});
                    return datas;
                },[]);
            }
        }
    };
}