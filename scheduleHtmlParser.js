function scheduleHtmlParser(html)
{
    let $raw = $("#manualArrangeCourseTable .infoTitle").toArray();
    
    //console.info($raw);
    
    let name = "";        //Save course name
    let teacher = "";     //Save the teacher's name
    let weeks = "";       //Storage week
    let position = "";    //Storage location of classroom
    let courses = [];     //array

    ///Extract the whole string from the title

    for(str in $raw)    //Traverse the object array and extract the ID and title
    {
        date = $raw[str]
        title_text = date.attribs.title;    
        //里面包含了课程名字，教师名字，周次，教室
        //信号与系统(130122020.001) (李辉,张培玲);;;(4-15,南校区  南校区1号教学楼	1207)

        id_text = date.attribs.id;
        //用来获取星期几低级大节
        rowspan_text = date.attribs.rowspan;
        //通过来判断有几小节课

/*********控制台输出测试片段********/
        //方便测试调试
        
        //console.info(title_text);
        //console.info(id_text);
        //console.info(rowspan_text);
        
/*********************************/


        /*******获取课程名字*****/
        //a_1计算出第一个左括号出现的位置
        a_0 = title_text.indexOf('(');
        //直接获取出name的位置
        name = title_text.substring(0, a_0);
        //console.info(name);


        /******获取教师名字******/
        a_1 = title_text.indexOf(')');
        b = title_text.indexOf(';');
        //直接获取老师名字
        teacher = title_text.substring(a_1 + 3, b - 1);
        //console.info(teacher);
        //信号与系统(130122020.001) (李辉,张培玲);;;(4-15,南校区  南校区1号教学楼	1207)


        /******获取课程周期******/
        c_1 = title_text.lastIndexOf('(');//最后（出现的位置
        c_2 = title_text.lastIndexOf(')');//最后）出现的位置
        str_1 = title_text.substring(c_1 + 1, c_2);//将最后一个括号的所有内容拉出来
        //4-15,南校区  南校区1号教学楼	1207)
        c_3 = str_1.indexOf(',');
        weeks = str_1.substring(0, c_3);
        //console.info(week)  
        //console.info(_get_week(week));
        //console.info(typeof(_get_week(week)))
        //console.info('\n');

        /******教室******/
        //VM2287:50 4-15,南校区  南校区1号教学楼	1207
        d_0 = str_1.indexOf(' ');
        d_1 = str_1.lastIndexOf(' ');
        position = str_1.substring(c_3 + 1);
        //console.info(position);
        //南校区  南校区1号教学楼	1207

        /*******星期几,第几节课*****/
        /*TD0_0,_后面一直为0，不变，所以把TD后面的两位数取出即可*/
        /*var d_0 = week.indexOf('D');
        var d_1 = week.lastIndexOf('_');
        day_section = week.substring(d_0 + 1, d_1);
        console.info(day_section.substring(0,1));*/
        /*
        console.info(_get_day(id_text));
        console.info(_get_section(id_text, rowspan_text));
        console.info('\n');
        */
        let courseInfo = {
            "name": name,
            "position": position,
            "day": _get_day(id_text),
            "teacher": teacher,
            "sections":_get_section(id_text, rowspan_text),
            "weeks": _get_week(weeks)
        };
        courses.push(courseInfo);
        //console.info(courses);
          

    }

    finalResult = {
        "courseInfos": courses,
        "sectionTimes": createSectionTimes()
    };
    //console.info(typeof());
    return finalResult;
    //console.info(courses);
}

/******返回星期几******/
function _get_day(id)//返回星期几,传入的参数为id_text
{
    let week_num;
    let num;
    if(id.substring(3, 4) == '_')
    {
        num = id.substring(2, 3);
    }
    else
    {
        num = id.substring(2, 4);
    }
    //console.info(num);
    switch(parseInt(num / 10))
    {
        case 0:
            week_num = 1;
            break;
        case 1:
            week_num = 2;
            break;
        case 2:
            week_num = 3;
            break;
        case 3:
            week_num = 4;
            break;
        case 4:
            week_num = 5;
            break;
        case 5:
            week_num = 6;
            break;
        default:
            week_num = 7;
            break;
        
    }
    return week_num;
}

function _get_section(id, n)//传入id_text,rowspan_text代表传入的数据
{
    let section = [];
    let num;
    let i;
    if(id.substring(3, 4) == '_')//判断是否为周一
    {
        num = id.substring(2, 3);   //如果为周一，则取第二个字符
    }
    else
    {
        num = id.substring(3, 4);   //否则取第三个字符
    }
    num = Number(num);
    i = num;
    n = Number(n);
    switch(num)
    {
        case 0:
            for(num; num < i + n; num++)//
            {
                section.push({"section":num + 1});
            }
            break;
        case 2:
            for(num; num < i + n; num++)//
            {
                section.push({"section":num + 1});
            }
            break;
        case 4:
            for(num; num < i + n; num++)//
            {
                section.push({"section":num + 1});
            }
            break;
        case 6:
            for(num; num < i + n; num++)//
            {
                section.push({"section":num + 1});
            }
            break;
        default:
            for(num; num < i + n; num++)//
            {
                section.push({"section":num + 1});
            }
            break;
    }
    return section;

}

//将每节课的周次按照数组的形式返回
function _get_week(data) 
{
	//weeks data will be inputed as '4,7-18', to handle ,we will split them by ',' and operate seperately.
    let result = [];
    let raw = data.split(' ');
    for (i in raw) 
    {

        if (raw[i].indexOf('-') == -1) 
        {
        	//create array
            result.push(parseInt(raw[i]));
        } 
        else {
            let begin = raw[i].split('-')[0];
            let end = raw[i].split('-')[1];
            for (let i = parseInt(begin); i <= parseInt(end); i++) 
            {
                result.push(i);
            }
        }
    }
    //sort the array,
    return result.sort(function (a, b) 
    {
        return a - b
    });
}

//时间表
function createSectionTimes() {
     //this is the HEU standard section time.
     //get it on the official website.
     let sectionTimes = [{
             "section": 1,
             "startTime": "08:00",
             "endTime": "08:50"
         }, {
             "section": 2,
             "startTime": "09:00",
             "endTime": "09:50"
         }, {
             "section": 3,
             "startTime": "10:10",
             "endTime": "11:00"
         }, {
             "section": 4,
             "startTime": "11:10",
             "endTime": "12:00"
         }, {
             "section": 5,
             "startTime": "14:30",
             "endTime": "15:20"
         }, {
             "section": 6,
             "startTime": "15:30",
             "endTime": "16:20"
         }, {
             "section": 7,
             "startTime": "16:30",
             "endTime": "17:20"
         }, {
             "section": 8,
             "startTime": "17:30",
             "endTime": "18:20"
         }, {
             "section": 9,
             "startTime": "19:00",
             "endTime": "19:50"
         }, {
             "section": 10,
             "startTime": "20:00",
             "endTime": "20:50"
         }
         
     ]
     return sectionTimes
 }
   