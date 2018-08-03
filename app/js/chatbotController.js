function login()
{
		var username = document.getElementById('username').value;
		var password = document.getElementById('password').value;
		var encPassword = window.btoa(password);
		console.log(encPassword);
		console.log(username);
		if(username=="" || password=="")
		{
			alert("Enter Both username and password");
			return false;
		}
		else
		{
			var xhr = new XMLHttpRequest();
			var responseData;
			var responseDiscData;
			var url = "http://10.5.7.180:9090/ChatBot/app/loginPage";	
			xhr.open("POST", url, true);
			xhr.setRequestHeader("Content-type", "application/json;charset=UTF-8");
			var data = JSON.stringify({"userName":username,"userPassword":encPassword });
			xhr.send(data);
			var input = document.getElementById("username");
			sessionStorage.setItem("username", input.value);
			xhr.onreadystatechange = function() 
			{
				if (this.readyState == 4 && this.status == 200)
				{
					responseData = JSON.parse(this.responseText);
					console.log(responseData);
					console.log(responseData.authenticateResponse);
					if(responseData.authenticateResponseCode == 0)
					{
						setTimeout(function()
						{
							location.href = "./Chatbot.html"; 
						},0);
					}
					else if(responseData.authenticateResponseCode == 1070)
					{
						if (confirm('User session already exist. Do you want to discard and start new session?'))
						{
							var url = "http://10.5.7.180:9090/ChatBot/app/discardingAndCreatingNewService ";
							xhr.open("POST", url, true);
							xhr.setRequestHeader("Content-type", "application/json;charset=UTF-8");
							var data = JSON.stringify({"userName":username});
							xhr.send(data);
							xhr.onreadystatechange = function() 
							{
								if (this.readyState == 4 && this.status == 200)
								{
									responseDiscData = JSON.parse(this.responseText);
									console.log(responseDiscData);   
									if(responseDiscData.isTokenValid == 1)
									{
										location.href = "./Chatbot.html"; 
									}
									else
									{
										alert("Please Refresh the page and try to Re-Login Again.")
									}
								}
							}
						} 	
					}
					else
					{
						alert(responseData.authenticateResponseMessage);
					}
				};
			}  
		}
}

	
	