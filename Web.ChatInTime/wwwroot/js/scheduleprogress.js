var scheduleprogresslist = "";

function ScheduleProgress(scheduledate) {
    var ProgressHtml = '<div class="PersonalCenter-ProgressHeader">' +
        '<ul>' +
        '<li>7</li>' +
        '<li>8</li>' +
        '<li>9</li>' +
        '<li>10</li>' +
        '<li>11</li>' +
        '<li>12</li>' +
        '<li>13</li>' +
        '<li>14</li>' +
        '<li>15</li>' +
        '<li>16</li>' +
        '<li>17</li>' +
        '<li>18</li>' +
        '<li>19</li>' +
        '</ul>' +
        '<div class="PersonalCenter-DateTitle">(时间)</div>' +
        '</div>';;
    if (scheduleprogresslist.length > 0) {
        

        var navTime = new Date()

        for (var i = 0; i < scheduleprogresslist.length; i++) {
            //截取传过来的开始时间的年、月、日、时、分
            var starttime = new Date(scheduleprogresslist[i]["startTime"]);
            var startyear = starttime.getFullYear();
            var startmonth = starttime.getMonth() + 1;
            var startday = starttime.getDate();
            var starthour = starttime.getHours();
            var startmin = starttime.getMinutes();
            //截取传过来的开始时间的年、月、日、时、分
            var endtime = new Date(scheduleprogresslist[i]["endTime"]);
            var endyear = endtime.getFullYear();
            var endmonth = endtime.getMonth() + 1;
            var endday = endtime.getDate();
            var endhour = endtime.getHours();
            var endmin = endtime.getMinutes();


            //日历选中时间
            var choicedate = new Date(scheduledate);
            var choiceyear = choicedate.getFullYear();
            var choicemonth = choicedate.getMonth() + 1;
            var choiceday = choicedate.getDate();

            var mystarttime = new Date(choiceyear + "-" + choicemonth + "-" + choiceday + " 7:00:00");//任务or会议的开始时间的7点（数轴从7点开始）
            var myendtime = new Date(choiceyear + "-" + choicemonth + "-" + choiceday + " 19:00:00");//任务or会议的开始时间的18点（数轴从18点结束）

            
            //名称超过15个字则显示点点点
            var ProgressName = scheduleprogresslist[i]["title"].length > 14 ? scheduleprogresslist[i]["title"].substring(0, 14) + "..." : scheduleprogresslist[i]["title"];
            var ProgressStyle = "";

            //超过下午两点文字展示在进度条的左侧，不超过则展示在进度条的右侧
            

            var progresswidth = 0;            //进度条的宽度
            var progressmarginleftwidth =0;   //进度条距离左边的宽度


            if (starttime < mystarttime) {
                starttime = mystarttime;
            }
            if (endtime > myendtime) {
                endtime = myendtime;
            }

            if (endtime == myendtime) {
                progresswidth = ((ChangeStrToMinutes(endtime) - ChangeStrToMinutes(starttime)) / 5 * 3) + 36;
            } else {
                progresswidth = ((ChangeStrToMinutes(endtime) - ChangeStrToMinutes(starttime)) / 5 * 3);
            }
            
            progressmarginleftwidth = (ChangeStrToMinutes(starttime) - ChangeStrToMinutes(mystarttime)) / 5 * 3;

            if (starthour >= 14) {
                ProgressStyle = "display:inline-block;margin-left:" + -(progresswidth + 210) + "px;text-align:right;";//210是文字的宽度加10的间距
            } else {
                ProgressStyle = "display:inline-block;text-align:left;";
            }

            if (progresswidth > 280) {
                ProgressStyle = "display:inline-block;margin-left:" + -progresswidth + "px;text-align:center;color:white;width:" + progresswidth+"px;";
            }
            //if (starthour >= 14 && progressmarginleftwidth < 200) {

            //    ProgressStyle = "display:inline-block;margin-left:" + -(470 - progresswidth) + "px;text-align:center;";
            //}
            
            if (starthour < 10) {
                starthour = "0" + starthour;
            }

            if (startmin < 10) {
                startmin = "0" + startmin;
            }

            if (endhour< 10) {
                endhour = "0" + endhour;
            }

            if (endmin < 10) {
                endmin = "0" + endmin;
            }

            var divstyle = "";
            //判断是会议还是任务。展示不同的进度条颜色
            if (scheduleprogresslist[i]["schduleType"] == 0) {
                divstyle = '<div id="PersonalCenter-ProgressDiv' + (i + 1) + '" class="PersonalCenter-ProgressDiv" style="margin-left:' + progressmarginleftwidth + 'px;width:' +
                    progresswidth + 'px;height:70px;background-color:#fdac37;border-radius:5px;margin-top:3px;display: inline-block;"></div>' +
                    '<div id="PersonalCenter-ProgressName' + (i + 1) +'" class="PersonalCenter-ProgressName" style = "color:#fdac37;' + ProgressStyle + '">' + ProgressName + '</div > ' +
                    '<div id="PersonalCenter-ProgressDetail' + (i + 1) + '" class="PersonalCenter-ProgressDetail" style="display:none">' +
                    '<div><span>标题：</span><span>' + scheduleprogresslist[i]["title"] + '</span></div>' +
                    '<div><span>时间：</span><span>' + starthour + ':' + startmin + '-' + endhour + ':' + endmin + '</span></div>' +
                    '<div><span>类型：</span><span>' + scheduleprogresslist[i]["schduleTypeName"] + '</span><span class="PersonalCenter-ProgressAddress">地点：</span><span>' + scheduleprogresslist[i]["address"] + '</span></div>' +
                    '</div>';
            } else {
                divstyle = '<div id="PersonalCenter-ProgressDiv' + (i + 1) + '" class="PersonalCenter-ProgressDiv" style="margin-left:' + progressmarginleftwidth + 'px;width:' +
                    progresswidth + 'px;height:70px;background-color:#0099d2;border-radius:5px;margin-top:3px;display: inline-block;"></div>' +
                    '<div id="PersonalCenter-ProgressName' + (i + 1) +'" class="PersonalCenter-ProgressName" style = "color:#0099d2;' + ProgressStyle + '">' + ProgressName + '</div > ' +
                    '<div id="PersonalCenter-ProgressDetail' + (i + 1) + '" class="PersonalCenter-ProgressDetail" style="display:none">' +
                    '<div><span>标题：</span><span>' + scheduleprogresslist[i]["title"] + '</span></div>' +
                    '<div><span>时间：</span><span>' + starthour + ':' + startmin + '-' + endhour + ':' + endmin + '</span></div>' +
                    '<div><span>类型：</span><span>' + scheduleprogresslist[i]["schduleTypeName"] + '</span></div>' +
                    '</div>';


                //if()


            }
            var ProgressClass = "";
            if (i + 1 == 1) {
                ProgressClass = "PersonalCenter-ProgressContentright";
            } else if (i + 1 == scheduleprogresslist.length) {
                ProgressClass = "PersonalCenter-ProgressContentright2";
            } else {
                ProgressClass = "PersonalCenter-ProgressContentright1";
            }
            ProgressHtml += '<div class="PersonalCenter-Progress">' +
                '<div class="PersonalCenter-ProgressContent">' +
                '<div class="PersonalCenter-ProgressContentleft">事项' + (i + 1) + '</div>' +
                '<div class="' + ProgressClass + '">' +
                divstyle +
                '</div>' +
                '</div>' +
                '</div>';
        }
    } else {
        ProgressHtml += '<div class="PersonalCenter-PromptMessage">当日没有日程</div>';
    }
    return ProgressHtml;
}
function binddiv() {
    for (var i = 0; i < scheduleprogresslist.length; i++) {

        $("#PersonalCenter-ProgressDiv" + (i + 1) + "").mouseenter((function (i) {
            return function () {
                $("#PersonalCenter-ProgressDetail" + (i + 1)).attr("style", "display:block");

                //$("#PersonalCenter-ProgressName" + (i + 1)).attr("style", "display:block");
            }

        })(i)).mouseleave((function (i) {
            return function () {
                $("#PersonalCenter-ProgressDetail" + (i + 1)).attr("style", "display:none");
                //$("#PersonalCenter-ProgressName" + (i + 1)).attr("style", "display:none");
            }
        })(i));

        $("#PersonalCenter-ProgressName" + (i + 1) + "").mouseenter((function (i) {
            return function () {
                $("#PersonalCenter-ProgressDetail" + (i + 1)).attr("style", "display:block");

                //$("#PersonalCenter-ProgressName" + (i + 1)).attr("style", "display:block");
            }

        })(i)).mouseleave((function (i) {
            return function () {
                $("#PersonalCenter-ProgressDetail" + (i + 1)).attr("style", "display:none");
                //$("#PersonalCenter-ProgressName" + (i + 1)).attr("style", "display:none");
            }
        })(i));

    }
}


function ChangeStrToMinutes(str) {
    
    //var time = "";
    //var arrminutes = "";
    //if (str == "7:00:00") {
        
    //    arrminutes = date.split(':');
    //} else {
    //    time = str.split(' ')[1]
    //    arrminutes = time.split(':');
    //}
    var arrminutes = new Date(str);

    var minutes = parseInt(arrminutes.getHours()) * 60 + parseInt(arrminutes.getMinutes());
    return minutes;
}