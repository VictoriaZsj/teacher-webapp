let my_plugins={
    install:function(Vue,opts={})
    {
        function handl_filte_table(origin,value_item,table_item,table_item_colum,new_table_item)
        {       
            origin.hasOwnProperty(new_table_item)?1:origin[new_table_item]=origin[table_item];
            let list=origin[new_table_item],
                value=origin.hasOwnProperty(value_item)?origin[value_item]:'',
                result=[];
            
            for(var i=0,len=list.length;i<len;i++)
            {   
                if(list[i][table_item_colum].toString().search(value)!=-1)
                {
                    result.push(list[i]);
                }
            }
            origin[table_item]=result;
        }
        function cance_form(form,exclu_item={},sp_init_hash={})
        {
            let temp=null;
            if(get_num_type(exclu_item)!='Object')
            {
                throw new Error('cancel_from args[1] type error');
            }
            if(get_num_type(form)!='Object')
            {
                throw new Error('cancel_from args[0] type error');
            }
            if(get_num_type(sp_init_hash)!='Object')
            {
                throw new Error('cancel_from args[2] type error');
            }
            
            for(var item in form)
            {
                if(exclu_item.hasOwnProperty(item))
                {
                    continue;
                }
                temp=form[item];
                switch(get_num_type(temp))
                {
                    case 'string':
                        form[item]='';
                        break;
                    case 'Date':
                        form[item]='';
                        break;
                    case 'Array':
                        form[item]=[];
                        break;
                    case 'Object':
                        form[item]={};
                        break;
                        
                    default:

                        break;
                }
            }    
            for(var sp_item in sp_init_hash){
                if(!form.hasOwnProperty(sp_item))
                {
                    throw new Error('cance_form sp_init_hash item doesn.t exit ');
                }
                form[sp_item]=sp_init_hash[sp_item];
            }   
        }
        function get_num_type(num){
            let type=typeof num;
            let type_hash={
                'number':'number',
                'string':'string',
                'boolean':'boolean',
                'object':'object',
                'undefined':'undefined',
                'function':'function'
            };
            let object_hash={
                '[object Array]':'Array',
                '[object Object]':'Object',
                '[object Date]':'Date',
                '[object RegExp]':'RegExp',       
            };
            if(type_hash.hasOwnProperty(type))
            {
                if(type_hash[type]==='object')
                {
                    return object_hash.hasOwnProperty(toString.call(num))?object_hash[toString.call(num)]:'';
                }
                return type_hash.hasOwnProperty(type)?type_hash[type]:'';
            }
            
        }
            
        Vue.prototype.commo_filte_table=handl_filte_table;
        Vue.prototype.commo_cance_form=cance_form;
        Vue.prototype.commo_get_num_type=get_num_type;
        let proto_hash=Vue.prototype;
        for(let item in opts)
        {
            if(proto_hash.hasOwnProperty(item))
            {
                throw new Error('vue.prototype name 冲突');
            }
            else{
                Vue.prototype.item=opts[item];
            }
        }

    }
};
module.exports=my_plugins;