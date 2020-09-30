<%@ page contentType="text/html;charset=UTF-8" buffer="128kb" autoFlush="true" import= "psdi.util.*" %>
<%@ include file="../../webclient/common/constants.jsp" %>

<%
	String web20Path = request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort()+request.getContextPath()+"/web20";

	request.setCharacterEncoding("UTF-8");
	// String url = new java.net.URL(new java.net.URL(request.getRequestURL().toString()), request.getContextPath()+"/ui/login?debug=6").toString();
	psdi.util.MXSession s = com.talian.web20.system.controller.RequestHandler.getMXSession(session);
	if (psdi.webclient.system.websession.WebAppEnv.useAppServerSecurity() || s.isConnected())
	{
		String url = com.talian.web20.system.controller.RequestHandler.getDefaultURL(request, response) ;
		session.setAttribute("loginexception", null) ;
		response.sendRedirect(url);
		return;
	}
	CocoException loginException = (CocoException)session.getAttribute("loginexception");

	String userName = request.getParameter("username");
	if(userName==null)
		userName="";
	String passWord = request.getParameter("password");
	if(passWord==null)
		passWord="";
	String langcode = request.getParameter("langcode");
	String useCode = null;
	if (langcode == null)
	{
		String acceptLang = request.getHeader("accept-language");
		if(acceptLang != null)
		{
			useCode = acceptLang.substring(0, 2).toUpperCase();
			langcode=useCode;
		}
		else
		{
			useCode = "";
		}
	}
	else
	{
		useCode = langcode;
	}

	String[] labels = null;
	String[][] langs = null;
	if (s != null)
	{
		s.setLangCode(useCode);
		String[] labelList = {"username", "password", "languages", "forgotpassword", "newuserlabel", "newuserlink", "welcome", "loginbutton","welcomeCocomessage"};
		labels = s.getMessages("login", labelList);
		langs = s.getLanguageList() ;
	}

%>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html>
	<head>
	<title><%=labels[8]%></title>
	<meta HTTP-EQUIV="content-type" CONTENT="text/html; charset=UTF-8">

	<script type="text/javascript" src="<%=web20Path%>/adapter/ext/ext-base.js"></script>
	<script type="text/javascript" src="<%=web20Path%>/ext-all-debug.js"></script>

	<script type="text/javascript" src="<%=web20Path%>/examples/ux/statusbar/StatusBar.js"> </script>
	<script type="text/javascript" src="<%=web20Path%>/examples/ux/ToolbarReorderer.js"> </script>
	<script type="text/javascript" src="<%=web20Path%>/examples/ux/DataViewTransition.js"> </script>
	<script type="text/javascript" src="<%=web20Path%>/examples/ux/DataView-more.js"> </script>
	<script type="text/javascript" src="<%=web20Path%>/common/util.js"></script>
	<script type="text/javascript" src="<%=web20Path%>/common/api.js"></script>
	<script type="text/javascript" src="../talian documentation/text.js"></script>

	<!-- Include Ext stylesheets here: -->
	<link rel="stylesheet" type="text/css" href="<%=web20Path%>/resources/css/ext-all.css">
	<link rel="stylesheet" type="text/css" href="<%=web20Path%>/css/coco.css">
	<link rel="stylesheet" type="text/css" href="../docs/resources/docs.css" />

	<!-- <script  type="text/javascript" src="login.js"></script>  -->

	<script type="text/javascript" >
		function setupMenuBar () {
			var handleAction = function(action){
				textStatus ('You clicked "' + action + '"', true, false) ;
		    };

			var mbar = new Ext.Toolbar({
	            enableOverflow: true,
	            renderTo: 'menubar',
	            items: ['<b>Assits Planner to Make Helicopter Route</b>','->',
	            {
		            text: new Date(),
		            handler: function() {
	            		alert ('Change Date - not implemented') ;
	            	}
	            }]
	        })

			var tabs = new Ext.TabPanel({
		        renderTo: '_placeholder',
		        activeTab: 0,
		        frame:true,
		        height: 800,
		        defaults:{autoScroll: true},
		        items:[
		            {title: 'Home', html: Ext.docs.shortBogusMarkup}
		        ]
		    });
		}

	    function setupStatusBar () {
			var bbar = new Ext.ux.StatusBar({
	            id: 'basic-statusbar',
	            renderTo: 'statusbar',

	            // defaults to use when the status is cleared:
	            defaultText: 'Ready',
	            //defaultIconCls: 'default-icon',

	            // values to set initially:
	            text: 'Ready',
	            iconCls: 'x-status-valid'
	        })
	    }

		Ext.onReady(function() {
			setupMenuBar();
			setupStatusBar ();

		    Ext.get('signin_button').on('click', function(){
		        var div1 = Ext.get('signin_button');
		        var div2 = Ext.get('signin_menu');

		        if (!div1.hasClass("menu-open")) {
		        	div1.addClass ("menu-open") ;
			        div2.removeClass ("offscreen") ;
			    }
			    else {
					div1.removeClass ("menu-open") ;
			        div2.addClass ("offscreen") ;
			    }

		        // alert("You clicked the button");
		    });

		    <%
		    	if (loginException != null) {
		    		%>
		    			alert("Login Fail :  <%=loginException.getMessage()%>");
		    		<%

		    		session.setAttribute("loginexception", null) ;
		    	}
		    %>
		});
	</script>

	</head>
	<body>
		<div id="header">
			<form method="post" id="signin" action="../../web/login" style="float:right;margin-right:10px;">
	      					<input id="login" name="login" type="hidden" value="true"/>

								<label for="username">User:</label>
	      						<input id="username" name="username" type="text" autocomplete="off" size="10" value="<%=userName%>"  tabindex="4" />


	      						<label for="password">Password:</label>
	      						<input id="password" name="password" type="password" size="10" autocomplete="off"  tabindex="5"/>

						        <input type="submit" id="signin_submit" value="Sign in" tabindex="6">

						      <%
						      	String scid = request.getParameter("sc");
						      	if (scid != null)
						      	{
						      %>
									<INPUT type="hidden" id="sc" name="sc" value="<%=scid%>">
						      <%
						      }
						      %>
			</form>
			<div class="api-title">Helico Route (HeRo)</div>
			<div class="api-title">Helico Route (HeRo)</div>
	  	</div>
	  	<div id="menubar"> </div>
		<div id="presentation"><div id="_placeholder"></div></div>
	   	<div id="exstatusbar"></div>
	   	<div id="statusbar"><a id="statustext"></a></div>
	</body>
</html>