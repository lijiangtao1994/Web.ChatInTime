using Microsoft.AspNet.SignalR;
using Microsoft.AspNet.SignalR.Hubs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;
using System.IO;
using Microsoft.AspNetCore.Http;

namespace Web.ChatInTime.Controllers
{
  public class HomeController : Controller
    {   //所有 hub  
    public class AllHub : Hub
    {

        /// <summary>
        /// 连接的用户数
        /// </summary>
        public static List<string> Users = new List<string>();

        /// <summary>
        /// 通知客户端
        /// </summary>
        public void SendSingle()
        {
            // Call the addNewMessageToPage method to update clients.
            var context = GlobalHost.ConnectionManager.GetHubContext<AllHub>();
        }

        /// <summary>
        /// Sends the update user count to the listening view.
        /// </summary>
        /// <param name="count">
        /// The count.
        /// </param>
        public void Send(int count)
        {
            // Call the addNewMessageToPage method to update clients.
            var context = GlobalHost.ConnectionManager.GetHubContext<AllHub>();
            context.Clients.All.updateUsersOnlineCount(count);
        }

        /// <summary>
        /// The OnConnected event.
        /// </summary>
        /// <returns>
        /// The <see cref="Task"/>.
        /// </returns>
        public override System.Threading.Tasks.Task OnConnected()
        {
            string clientId = GetClientId();

            if (Users.IndexOf(clientId) == -1)
            {
                Users.Add(clientId);
            }

            // Send the current count of users
            Send(Users.Count);

            var context = GlobalHost.ConnectionManager.GetHubContext<AllHub>();
            context.Clients.Client(clientId).updateUserName(clientId);


            return base.OnConnected();
        }

        /// <summary>
        /// The OnReconnected event.
        /// </summary>
        /// <returns>
        /// The <see cref="Task"/>.
        /// </returns>
        public override System.Threading.Tasks.Task OnReconnected()
        {
            string clientId = GetClientId();
            if (Users.IndexOf(clientId) == -1)
            {
                Users.Add(clientId);
            }

            // Send the current count of users
            Send(Users.Count);

            return base.OnReconnected();
        }



        /// <summary>
        /// The OnDisconnected event.
        /// </summary>
        /// <returns>
        /// The <see cref="Task"/>.
        /// </returns>
        public override System.Threading.Tasks.Task OnDisconnected(bool stopCalled)
        {
            string clientId = GetClientId();

            if (Users.IndexOf(clientId) > -1)
            {
                Users.Remove(clientId);
            }

            // Send the current count of users
            Send(Users.Count);

            return base.OnDisconnected(stopCalled);
        }

        /// <summary>
        /// 得到的当前连接的客户端ID.
        /// 这是每个客户独特的、用于识别一个连接
        /// </summary>
        /// <returns>The client Id.</returns>
        private string GetClientId()
        {
            string clientId = "";
            if (Context.QueryString["clientId"] != null)
            {
                // clientId passed from application 
                clientId = this.Context.QueryString["clientId"];
            }

            if (string.IsNullOrEmpty(clientId.Trim()))
            {
                clientId = Context.ConnectionId;
            }

            return clientId;
        }
    }

    //当前 hub  
    public class CurHub : Hub
    {
        public void SetRecGroup(string id)//设置接收组  
        {
            this.Groups.Add(this.Context.ConnectionId, id);
        }
    }
    /// <summary>
    /// 创建聊天室帮助类
    /// </summary>
    [HubName("ChatRoomHub")]
    public class ChatHub : Hub
    {

        static List<UserEntity> users = new List<UserEntity>();

        /// <summary>
        /// 添加用户
        /// </summary>
        /// <param name="nickName"></param>
        public void UserEnter(string nickName, string UserId, string GroupId)
        {
            UserEntity userEntity = new UserEntity
            {
                GroupId = GroupId,
                UserId = Guid.NewGuid().ToString(),
                NickName = nickName,
                ConnectionId = Context.ConnectionId
            };

            users.Add(userEntity);
                adduser(users);
            //Clients.Client(userEntity.ConnectionId).NotifyUserEnter(nickName, users);//调用前台NotifyUserEnter方法
        }

        /// <summary>
        /// 发送消息
        /// </summary>
        /// <param name="nickName"></param>
        /// <param name="message"></param>
        public void SendMessage(string nickName, string GroupId, string message)
        {
            var list = users.Where(c => c.GroupId == GroupId).ToList();
            //按照分组推送消息
            for (int i = 0; i < list.Count; i++)
            {
                Clients.Client(list[i].ConnectionId).NotifySendMessage(nickName, message,"","");//调用前台NotifySendMessage方法
            }
        }
        [HttpPost]
        /// <summary>
        /// 发送语音消息
        /// </summary>
        /// <param name="nickName"></param>
        /// <param name="message"></param>
        public void SendVoiceMessage(messageModel postData)
        {
            //var audioFile = formFile;
            byte[] audioBytes = Convert.FromBase64String(postData.audioData.Split(',')[1]);

            var filePath = Path.Combine("D:\\", "yinpin");
            if (!Directory.Exists(filePath))
            {
                DirectoryInfo directoryInfo = new DirectoryInfo(filePath);
                directoryInfo.Create();
            }
            System.IO.File.WriteAllBytes($"{filePath}\\{Guid.NewGuid().ToString()}.wav", audioBytes);

            var list = users.Where(c => c.GroupId == (postData.GroupId==null?"": postData.GroupId)).ToList();
            //按照分组推送消息
            for (int i = 0; i < list.Count; i++)
            {
                var guid = Guid.NewGuid().ToString();
                Clients.Client(list[i].ConnectionId).NotifySendMessage(postData.nickName, postData.audioData, "voice", guid);//调用前台NotifySendMessage方法
            }
        }
      


        /// <summary>
        /// 断开（刷新页面可以触发此方法）
        /// </summary>
        /// <returns></returns>
        public override Task OnDisconnected(bool stopCalled)
        {
            var currentUser = users.FirstOrDefault(u => u.ConnectionId == Context.ConnectionId);
            if (currentUser != null)
            {
                users.Remove(currentUser);
                Clients.Others.NotifyUserLeft(currentUser.NickName, users);//调用前台NotifyUserLeft方法
            }
            return base.OnDisconnected(stopCalled);
        }
    }
        public static List<UserEntity> userList = new List<UserEntity>();
        public static void adduser(List<UserEntity> users)
        {
            userList=users;
        }
    public class UserEntity
    {
        public string GroupId { get; set; }
        public string UserId { get; set; }
        public string NickName { get; set; }

        public string ConnectionId { get; set; }

        public int State { get; set; }//状态 1是在线，0为离线
    }
    public class messageModel
    {
        public string nickName { get; set; }
        public string GroupId { get; set; }
        public string audioData { get; set; }
    }
   
        public ActionResult Index()
        {
            return View();
        }
        public ActionResult Mobile()
        {
            return View();
        }

        public ActionResult Mobile_2()
        {
            return View();
        }
        public ActionResult Mobile_New()
        {
            return View();
        }
        public JsonResult test(messageModel postData)
        {
            var list = userList.Where(c => c.GroupId == (postData.GroupId == null ? "" : postData.GroupId)).ToList();
            for (int i = 0; i < list.Count; i++)
            {
                var hubContext = GlobalHost.ConnectionManager.GetHubContext<ChatHub>();
                hubContext.Clients.Client(list[i].ConnectionId).NotifySendMessage(postData.nickName, postData.audioData, "voice", Guid.NewGuid());
            }
            return Json(Guid.NewGuid().ToString());
        }
    }
}